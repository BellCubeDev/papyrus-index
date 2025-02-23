/* eslint-disable no-await-in-loop */
import nextConfig from "../../next.config";
import { memoizeDevServerConst } from "../utils/memoizeDevServerConst";
import type { PapyrusWiki } from "./getWiki";

const wikiFetchPromisesByURL = memoizeDevServerConst('wikiFetchCache', ()=>{
    const map = new Map<string, Promise<{}|null|typeof WIKI_FETCH_403FORBIDDEN>>();
    const originalMapSet = map.set.bind(map);
    map.set = function set(key, value) {
        const memoryUsageData = process.memoryUsage();
        const memoryUsage = memoryUsageData.heapUsed / memoryUsageData.heapTotal;

        if (memoryUsage > 0.6 && !map.has(key)) {
            const nextKey = map.keys().next().value;
            if (!nextKey) console.warn('wikiFetchGet: Memory usage is over 60%, but no keys found in the wikiFetchPromisesByURL map! Memory usage data: ', memoryUsageData);
            else map.delete(nextKey);
        }


        //console.log(`Current memory usage: ${memoryUsage.toFixed(2)}%`);
        return originalMapSet(key, value);
    };
    return map;
});

// MediaWiki API instances can be... finnicky. We don't want to overload the server with requests, so we'll queue them up.
// This isn't fast, but it's safe.
const fetchQueuePromisesByHostname = new Map<string, Promise<{}|null|typeof WIKI_FETCH_403FORBIDDEN>>();

const MAX_RETRIES = 5;

const unfulfilledFetches = new Set<string>();
const queuedFetches = new Set<string>();
if (process.env.NODE_ENV !== 'development') {
    setInterval(() => {
        if (unfulfilledFetches.size > 0) console.log(`Still waiting for ${unfulfilledFetches.size} wiki fetches to complete and ${queuedFetches.size} more to start`, {unfulfilledFetches, queuedFetches});
        else if (queuedFetches.size > 0) console.log(`Still waiting for ${queuedFetches.size} wiki fetches to start`, {queuedFetches});
        //else console.log('No outstanding wiki fetches, but build/test is still running. Event loop: ', {activeHandles: (process['_getActiveHandles' as 'exit'] as any)(), activeRequests: (process['_getActiveRequests' as 'exit'] as any)()});
    }, 60000).unref();
}

export const WIKI_FETCH_403FORBIDDEN: unique symbol = memoizeDevServerConst('WIKI_FETCH_403FORBIDDEN', () => Symbol('WIKI_FETCH_403FORBIDDEN')) as any;

export async function wikiFetchGet(wiki: PapyrusWiki, path: `/${string}`): Promise<{}|null|typeof WIKI_FETCH_403FORBIDDEN> {
    const url = new URL(path, wiki.wikiBaseUrl);

    const deduped = wikiFetchPromisesByURL.get(url.href);
    if (deduped) {
        //console.debug(`wikiFetchGet: dedupe hit for ${url}`);
        return await deduped;
    }

    const wikiFetchGetInternalCreatedPromise = async function wikiFetchGetInternalCreatedPromise() {
        queuedFetches.add(url.href);

        const loggingIntervalQueued = setInterval(() => {
            console.log(`wikiFetchGetInternalCreatedPromise: The request queue is fairly backed up; waiting for it to clear out a little before adding ${url}`);
        }, 60000).unref();

        while (unfulfilledFetches.size >= 200) await new Promise(resolve => setTimeout(resolve, 20000).unref());

        unfulfilledFetches.add(url.href);
        queuedFetches.delete(url.href);
        clearInterval(loggingIntervalQueued);

        //const loggingIntervalUnfulfilled = setInterval(() => {
        //    console.log(`wikiFetchGetInternalCreatedPromise: still waiting for previous requests to finish before fetching ${url}`);
        //}, 60000).unref();

        const existingFetchQueuePromise = fetchQueuePromisesByHostname.get(url.hostname) || Promise.resolve();
        const newFetchQueuePromise = async function wikiFetchGetInternalCreatedFetchQueuePromise() {
            await existingFetchQueuePromise;
            await new Promise(resolve => setTimeout(resolve, 50 * (process.env.NODE_ENV === 'development' ? 1 : nextConfig.experimental.cpus)).unref()); // since we spawn 6 workers in build mode, we need to wait an appropriate amount of time to avoid DOSing the server
            const res = await wikiFetchGetInternalWithParseJsonAndHandleErrors(wiki, path, 0, url);
            unfulfilledFetches.delete(url.href);
            //console.log(`wikiFetchGetInternalCreatedPromise: finished fetching ${url}\n    This worker/process has ${unfulfilledFetches.size} unfulfilled fetches and ${queuedFetches.size} queued fetches remaining.`);
            //clearInterval(loggingIntervalUnfulfilled);
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

async function wikiFetchGetInternalWithParseJsonAndHandleErrors(wiki: PapyrusWiki, path: `/${string}`, retriesSoFar: number, url: URL): Promise<{}|null|typeof WIKI_FETCH_403FORBIDDEN> {
    const [retries, res] = await wikiFetchGetInternalFetch(url, retriesSoFar);
    retriesSoFar = retries;
    if (!res) return null;
    if (res === WIKI_FETCH_403FORBIDDEN) return WIKI_FETCH_403FORBIDDEN;
    const json = await res.json() as {};
    if ('error' in json && json.error) {
        if (typeof json.error === 'object' && 'info' in json.error && typeof json.error.info === 'string') {
            if (json.error.info.match(/\btimeout\b/iu)) {
                if (retriesSoFar >= MAX_RETRIES) {
                    throw new Error(`Failed to fetch ${url} after ${retriesSoFar} retries due to a timeout; giving up.`);
                } else {
                    console.log(`Timeout fetching ${url} (server-side parsoid timeout); retrying in 60s`);
                    await new Promise(resolve => setTimeout(resolve, 60000).unref());
                    return await wikiFetchGetInternalWithParseJsonAndHandleErrors(wiki, path, retriesSoFar + 1, url);
                }
            }
            throw new Error(`Failed to fetch ${url}: ${json.error.info}`);
        } else {
            throw new Error(`Failed to fetch ${url}: ${JSON.stringify(json.error)}`);
        }
    }

    return json;
}

async function wikiFetchGetInternalFetch(originalUrl: URL, retriesSoFar: number): Promise<[retries: number, res: Response|null|typeof WIKI_FETCH_403FORBIDDEN]> {
    let response;

    const noCacheUrl = new URL(originalUrl.href);
    noCacheUrl.searchParams.set('__nextjs__nocache_timestamp', Date.now().toString());

    console.log(`Fetching ${noCacheUrl}${retriesSoFar > 0 ? ` (retry #${retriesSoFar}/${MAX_RETRIES})` : ''}`);
    const loggingInterval = setInterval(() => { console.log(`wikiFetchGetInternalFetch: stalled while fetching ${noCacheUrl}`) }, 60000 /* 60s */).unref();


    try {
        response = await fetch(noCacheUrl, {
            signal: AbortSignal.timeout(2000),
            headers: {
                'User-Agent': 'Papyrus Index (https://papyrus.bellcube.dev/)',
            },
        });
    } catch (e) {
        if (retriesSoFar >= MAX_RETRIES) {
            throw new Error(`Failed to fetch ${noCacheUrl} after ${retriesSoFar} retries due to a fetch error; giving up.`);
        } else {
            console.log(`Fetch error while fetching ${noCacheUrl} (fetch error); retrying in 60s`);
            await new Promise(resolve => setTimeout(resolve, 60000).unref());
            return await wikiFetchGetInternalFetch(originalUrl, retriesSoFar + 1);
        }
    } finally {
        clearInterval(loggingInterval);
        console.log(`wikiFetchGetInternalFetch: finished fetching ${noCacheUrl}`);
    }

    if (!response.ok) {
        if (response.status === 404) {
            return [retriesSoFar, null];
        } else if (response.status === 403) {
            for (let i = 0; i < 25; i++) console.error(`Failed to fetch ${noCacheUrl}; status is 403 (Forbidden)! (message spammed for visibility)`);
            return [retriesSoFar, WIKI_FETCH_403FORBIDDEN];
        } else if (response.statusText === 'Service Unavailable') {
            if (retriesSoFar >= MAX_RETRIES) {
                throw new Error(`Failed to fetch ${noCacheUrl} after ${retriesSoFar} retries due to a fetch error; giving up.`);
            } else {
                console.log(`Service appears to be temporarily down while fetching ${noCacheUrl}; retrying in 60s`);
                await new Promise(resolve => setTimeout(resolve, 60000).unref());
                return await wikiFetchGetInternalFetch(originalUrl, retriesSoFar + 1);
            }
        }
        else {
            throw new Error(`Failed to fetch ${noCacheUrl}; status is not OK: ${response.status} (${response.statusText})`);
        }
    }

    return [retriesSoFar, response];
}
