/* eslint-disable no-await-in-loop */
import * as Log from 'next/dist/build/output/log';
import nextConfig from "../../../../next.config";
import { memoizeDevServerConst } from "../../../utils/memoizeDevServerConst";
import type { PapyrusWiki } from "../getWiki";

const wikiFetchPromisesByURL = memoizeDevServerConst('wikiFetchCache', ()=>{
    const map = new Map<string, Promise<object|null|typeof WIKI_FETCH_403FORBIDDEN>>();

    //
    // In ye olden times, this code stopped memory leaks because we'our code would fetch a TON of data from the wiki
    // But now that our code only fetches a little bit of data directly, we'd prefer
    // to make the space-time tradeoff to keep the results for the lifetime of the process.
    //
    //    const originalMapSet = map.set.bind(map);
    //    map.set = function set(key, value) {
    //        let memoryUsageData = process.memoryUsage();
    //
    //        if (!map.has(key)) {
    //            let i = 0;
    //            while (memoryUsageData.heapUsed / memoryUsageData.heapTotal > 0.85 && i++ < 100) {
    //                const nextKey = map.keys().next().value;
    //                if (!nextKey) {
    //                    let logString = `wikiFetchGet: Memory usage is over 85%, but no keys found in the wikiFetchPromisesByURL map! Memory usage data: ${inspect(memoryUsageData)}`;
    //                    if (isCI) logString = logString.split('\n').map(line => `::debug::${line}`).join('\n');
    //                    Log.warn(logString);
    //                    break;
    //                }
    //                map.delete(nextKey);
    //                memoryUsageData = process.memoryUsage();
    //            }
    //        }
    //
    //        //Log.trace(`Current memory usage: ${memoryUsage.toFixed(2)}%`);
    //        return originalMapSet(key, value);
    //    };
    return map;
});

// MediaWiki API instances can be... finnicky. We don't want to overload the server with requests, so we'll queue them up.
// This isn't fast, but it's safe.
const fetchQueuePromisesByHostname = new Map<string, Promise<object|null|typeof WIKI_FETCH_403FORBIDDEN>>();

const MAX_RETRIES = 5;

const unfulfilledFetches = new Set<string>();
const queuedFetches = new Set<string>();
if (process.env.NODE_ENV !== 'development') {
    setInterval(() => {
        if (unfulfilledFetches.size > 0) Log.trace(`Still waiting for ${unfulfilledFetches.size} wiki fetches to complete and ${queuedFetches.size} more to start`, {unfulfilledFetches, queuedFetches});
        else if (queuedFetches.size > 0) Log.trace(`Still waiting for ${queuedFetches.size} wiki fetches to start`, {queuedFetches});
        //else Log.log('No outstanding wiki fetches, but build/test is still running. Event loop: ', {activeHandles: (process['_getActiveHandles' as 'exit'] as any)(), activeRequests: (process['_getActiveRequests' as 'exit'] as any)()});
    }, 60000).unref();
}

export const WIKI_FETCH_403FORBIDDEN: unique symbol = memoizeDevServerConst('WIKI_FETCH_403FORBIDDEN', () => Symbol.for('PAPYRUS_INDEX_WIKI_FETCH_403FORBIDDEN')) as never;

export async function wikiFetchGet(wiki: PapyrusWiki, path: `/${string}`): Promise<object|null|typeof WIKI_FETCH_403FORBIDDEN> {
    const url = new URL(path, wiki.wikiBaseUrl);

    const deduped = wikiFetchPromisesByURL.get(url.href);
    if (deduped) {
        //Log.debug(`wikiFetchGet: dedupe hit for ${url}`);
        return await deduped;
    }

    const wikiFetchGetInternalCreatedPromise = async function wikiFetchGetInternalCreatedPromise() {
        Log.trace(`wikiFetchGet: Queueing fetch for ${url}`);
        queuedFetches.add(url.href);

        const loggingIntervalQueued = setInterval(() => {
            Log.info(`wikiFetchGetInternalCreatedPromise: The request queue is fairly backed up; waiting for it to clear out a little before adding ${url}`);
        }, 60000);

        while (unfulfilledFetches.size >= 200) await new Promise(resolve => setTimeout(resolve, 20000));

        Log.trace(`wikiFetchGetInternalCreatedPromise: Creating fetch promise---once previous fetches for this domain complete, will fetch ${url}`);

        const loggingIntervalWaitingForPreviousRequests = setInterval(() => {
            Log.trace(`wikiFetchGetInternalCreatedPromise: still waiting for previous fetches to complete before starting the queued fetch for ${url}`);
        }, 60000);

        unfulfilledFetches.add(url.href);
        queuedFetches.delete(url.href);
        clearInterval(loggingIntervalQueued);

        const existingFetchQueuePromise = fetchQueuePromisesByHostname.get(url.hostname) || Promise.resolve();
        const newFetchQueuePromise = async function wikiFetchGetInternalCreatedFetchQueuePromise() {
            await existingFetchQueuePromise;
            clearInterval(loggingIntervalWaitingForPreviousRequests);
            Log.trace(`wikiFetchGetInternalCreatedFetchQueuePromise: previous fetches completed, adding rate limit throttle before fetching URL ${url}`);
            await new Promise(resolve => setTimeout(resolve, 50 * (process.env.NODE_ENV === 'development' ? 1 : nextConfig.experimental.cpus))); // since we spawn 6 workers in build mode, we need to wait an appropriate amount of time to avoid DOSing the server
            Log.trace(`wikiFetchGetInternalCreatedFetchQueuePromise: rate limit throttle complete, finally actually starting fetch for URL ${url}`);
            const fetchingInterval = setInterval(() => {
                Log.trace(`wikiFetchGetInternalCreatedPromise: still fetching URL ${url}`);
            }, 60000);
            const res = await wikiFetchGetInternalWithParseJsonAndHandleErrors(wiki, path, 0, url);
            Log.trace(`wikiFetchGetInternalCreatedPromise: finished fetching ${url}\n    This worker/process has ${unfulfilledFetches.size} unfulfilled fetches and ${queuedFetches.size} queued fetches remaining.`);
            clearInterval(fetchingInterval);
            unfulfilledFetches.delete(url.href);
            return res;
        }();
        fetchQueuePromisesByHostname.set(url.hostname, newFetchQueuePromise);
        const res = await newFetchQueuePromise;
        if (fetchQueuePromisesByHostname.get(url.hostname) === newFetchQueuePromise) fetchQueuePromisesByHostname.delete(url.hostname);
        return res;
    }();

    wikiFetchPromisesByURL.set(url.href, wikiFetchGetInternalCreatedPromise);
    return await wikiFetchGetInternalCreatedPromise;
}

async function wikiFetchGetInternalWithParseJsonAndHandleErrors(wiki: PapyrusWiki, path: `/${string}`, retriesSoFar: number, url: URL): Promise<object|null|typeof WIKI_FETCH_403FORBIDDEN> {
    const waitingInternalFetchInterval = setInterval(() => {
        Log.trace(`wikiFetchGetInternalWithParseJsonAndHandleErrors: still waiting for internal, low-level fetch to complete for ${url}`);
    }, 60000);
    const [retries, res] = await wikiFetchGetInternalFetch(url, retriesSoFar);
    clearInterval(waitingInternalFetchInterval);
    retriesSoFar = retries;
    if (!res) return null;
    if (res === WIKI_FETCH_403FORBIDDEN) return WIKI_FETCH_403FORBIDDEN;
    const waitingParseJsonInterval = setInterval(() => {
        Log.trace(`wikiFetchGetInternalWithParseJsonAndHandleErrors: still waiting for JSON streaming and parsing to complete for ${url}`);
    }, 60000);
    const json = await res.json() as object;
    clearInterval(waitingParseJsonInterval);
    if ('error' in json && json.error) {
        if (typeof json.error === 'object' && 'info' in json.error && typeof json.error.info === 'string') {
            if (json.error.info.match(/\btimeout\b/iu)) {
                if (retriesSoFar >= MAX_RETRIES) {
                    throw new Error(`[wikiFetchGetInternalWithParseJsonAndHandleErrors - OUT_OF_RETRIES] Failed to fetch ${url} after ${retriesSoFar} retries due to a timeout; giving up.`);
                } else {
                    Log.trace(`Timeout fetching ${url} (server-side parsoid timeout); retrying in 60s`);
                    await new Promise(resolve => setTimeout(resolve, 60000));
                    Log.trace(`Retrying after timeout and 60s retry countdown: ${url}`);
                    return await wikiFetchGetInternalWithParseJsonAndHandleErrors(wiki, path, retriesSoFar + 1, url);
                }
            }
            if (process.env.NODE_ENV === 'development' && json.error.info === 'Error contacting the Parsoid/RESTBase server (HTTP 403)') {
                Log.error(`wikiFetchGetInternalWithParseJsonAndHandleErrors: The remote MediaWiki instance API could not contact the Parsoid/RESTBase server, since it returned a 403 Forbidden. For URL: ${url}`);
                return WIKI_FETCH_403FORBIDDEN;
            } else {
                throw new Error(`[wikiFetchGetInternalWithParseJsonAndHandleErrors - ERROR_IN_JSON] Failed to fetch ${url}: ${json.error.info}\n${JSON.stringify(json.error)}`);
            }
        } else {
            throw new Error(`[wikiFetchGetInternalWithParseJsonAndHandleErrors - ERROR_IN_JSON] Failed to fetch ${url}: ${JSON.stringify(json.error)}`);
        }
    }

    return json;
}

async function wikiFetchGetInternalFetch(originalUrl: URL, retriesSoFar: number): Promise<[retries: number, res: Response|null|typeof WIKI_FETCH_403FORBIDDEN]> {
    let response;

    const noCacheUrl = new URL(originalUrl.href);
    noCacheUrl.searchParams.set('__nextjs__nocache_timestamp', Date.now().toString());

    Log.wait(`Fetching ${noCacheUrl}${retriesSoFar > 0 ? ` (retry #${retriesSoFar}/${MAX_RETRIES})` : ''}`);
    const loggingInterval = setInterval(() => { Log.trace(`wikiFetchGetInternalFetch: stalled while fetching ${noCacheUrl}`) }, 60000);

    const timeoutController = new AbortController();
    const timeout = setTimeout(() => {
        timeoutController.abort();
        Log.trace(`wikiFetchGetInternalFetch: timed out after 60s while fetching ${noCacheUrl}`);
    }, 60000);

    try {
        response = await fetch(noCacheUrl, {
            signal: timeoutController.signal,
            headers: {
                'User-Agent': 'Papyrus Index (https://papyrus.bellcube.dev/)',
            },
        });
    } catch (e) {
        if (retriesSoFar >= MAX_RETRIES) {
            throw new Error(`[wikiFetchGetInternalFetch - OUT_OF_RETRIES] Failed to fetch ${noCacheUrl} after ${retriesSoFar} retries due to a fetch error; giving up.`);
        } else {
            Log.trace(`Fetch error while fetching ${noCacheUrl} (fetch error); retrying in 60s`, e);
            await new Promise(resolve => setTimeout(resolve, 60000));
            Log.trace(`Retrying after fetch error and 60s retry countdown: ${noCacheUrl}`);
            return await wikiFetchGetInternalFetch(originalUrl, retriesSoFar + 1);
        }
    } finally {
        clearTimeout(timeout);
        clearInterval(loggingInterval);
        Log.event(`wikiFetchGetInternalFetch: finished fetching ${noCacheUrl}`);
    }

    if (!response.ok) {
        if (response.status === 404) {
            return [retriesSoFar, null];
        } else if (response.status === 403) {
            for (let i = 0; i < 25; i++) Log.error(`[wikiFetchGetInternalFetch - STATUS_403] Failed to fetch ${noCacheUrl}; status is 403 (Forbidden)! (message spammed for visibility)`);
            Log.trace(`[wikiFetchGetInternalFetch - STATUS_403] Failed to fetch ${noCacheUrl}; status is 403 (Forbidden)! Debug info:`, {
                headers: Object.fromEntries(response.headers.entries()),
                status: response.status,
                statusText: response.statusText,
                url: response.url,
                type: response.type,
                redirected: response.redirected,
                ok: response.ok,
                bodyText: await response.text(),
            });
            return [retriesSoFar, WIKI_FETCH_403FORBIDDEN];
        } else if (response.statusText === 'Service Unavailable') {
            if (retriesSoFar >= MAX_RETRIES) {
                throw new Error(`[wikiFetchGetInternalFetch - OUT_OF_RETRIES] Failed to fetch ${noCacheUrl} after ${retriesSoFar} retries due to a fetch error; giving up.`);
            } else {
                Log.trace(`Service appears to be temporarily down while fetching ${noCacheUrl}; retrying in 60s`);
                await new Promise(resolve => setTimeout(resolve, 60000));
                return await wikiFetchGetInternalFetch(originalUrl, retriesSoFar + 1);
            }
        }
        else {
            throw new Error(`[wikiFetchGetInternalFetch - STATUS_NOT_OK] Failed to fetch ${noCacheUrl}; status is not OK: ${response.status} (${response.statusText})`);
        }
    }

    return [retriesSoFar, response];
}
