import fs from 'fs/promises';
import path from 'path';
import url from 'url';
import type { GameWithWiki, PapyrusWiki } from '../getWiki';
import { WIKI_FETCH_403FORBIDDEN, wikiFetchGet } from './wikiFetch';
import lockfileUtil from 'proper-lockfile';
import { memoizeDevServerConst } from '../../../utils/memoizeDevServerConst';
import { parsoidGetPageHTML } from './parsoid';
import { isCI } from 'next/dist/server/ci-info';
import { srcDir } from '../../../folders';

export interface WikiStorageIndex {
    /** ISO timestamp of the latest change indexed */
    lastKnownChange: string;
    /** Stored pages, by page title. File names should be the same as this page name, but with the .html extension */
    pages: {
        [key: string]: WikiStorageEntry;
    }
}

export interface WikiStorageEntry {
    /** If true, this storage entry is outdated and the latest version of the page needs to be downloaded again. */
    needsRedownloaded: boolean;
    /** Whether this page exists and is downloaded.
     *
     * If the page doesn't exist or is not downloaded, we cannot load it from the disk.
     *
     * If the page does not exist, we don't need to try to fetch it again until it changes.
    */
    exists: boolean;
    /** When this page was last downloaded. Will likely be newer than the index's lastKnownChange date.
     *
     * Used to be stored for a flawed reason, but is now stored for debugging purposes.
    */
    lastDownloaded: string|null;
}

const wikiStoragePath = path.join(srcDir, '../cache/wiki-storage');
function getWikiStorageDirPath(wiki: PapyrusWiki): string {
    return path.join(wikiStoragePath, wiki.wikiTrueGame);
}
function getWikiIndexPath(wiki: PapyrusWiki): string {
    return path.join(getWikiStorageDirPath(wiki), 'index.json');
}

interface MediaWikiRecentChange {
    /** Title of the page edited */
    title: string;
    /** ISO timestamp of the edit */
    timestamp: string;
}

const lockPromisePoolObj = memoizeDevServerConst('lockPromisePoolObj', ()=>({
    lockPromisePool: new Array(500).fill(Promise.resolve()),
    lockPromisePoolCursor: 0,
}));

const lockPromisePool: Promise<any>[] = lockPromisePoolObj.lockPromisePool;
let lockPromisePoolCursor = lockPromisePoolObj.lockPromisePoolCursor;
function getLockPromise<T = void>(then: ()=>Promise<T>): Promise<T> {
    const promise = lockPromisePool[lockPromisePoolCursor]!;
    const newPromise = Promise.allSettled([promise]).then(then);
    lockPromisePool[lockPromisePoolCursor] = newPromise;
    lockPromisePoolCursor = (lockPromisePoolCursor + 1) % lockPromisePool.length;
    return newPromise;
}

function getLock_(filePath: string): Promise<() => Promise<void>> {
    const promise = lockfileUtil.lock(filePath, {
        retries: {
            forever: true,
            factor: 1.3,
            minTimeout: 500,
            maxTimeout: 6000
        },
        onCompromised(err) {
            console.error('The lockfile for', filePath, 'was compromised! See the proper-lockfile docs for more info on what this means', err);
        },
        stale: 60_000,
        update: 10_000,
        realpath: false,
    });

    return promise.then(unlockF => async ()=> {
        try {
            return await unlockF();
        } catch (err) {
            console.log('Likely benign, but we failed to unlock the lockfile for', filePath, 'due to error:', err);
            return Promise.resolve();
        }
    });
}

function getLock(filePath: string): Promise<() => Promise<void>> {
    return getLockPromise(() => getLock_(filePath));
}

/**
 * MUST BE CALLED WITH THE STORAGE INDEX LOCKED
 */
async function ingestLatestChanges(wiki: PapyrusWiki, storageIndex: WikiStorageIndex): Promise<void> {
    let changeList;

    let indexHasChanged = false;

    do { // eslint-disable-next-line no-await-in-loop
        changeList = await wikiFetchGet(wiki, `/w/api.php?action=query&format=json&prop=&list=recentchanges&rcstart=${encodeURIComponent(storageIndex.lastKnownChange)}&rcdir=newer&rcprop=title%7Ctimestamp&rclimit=20&rctype=edit%7Cnew&rctoponly=1`);
        if (!changeList) throw new Error('Fetching the change list failed!');
        if (changeList === WIKI_FETCH_403FORBIDDEN) {
            if (process.env.NODE_ENV === 'development') return;
            throw new Error(`The ${wiki.wikiTrueGame} wiki returned a 403 Forbidden error when trying to fetch the change list. This is likely due to the wiki's rate limiting settings, and is not an error on our end.`);
        }

        console.log(`Got a change list response from the ${wiki.wikiTrueGame} wiki!`, changeList);

        if (!('query' in changeList) || !changeList.query || typeof changeList.query !== 'object') throw new Error('The returned change list from the MediaWiki API is missing the "query" results object!');
        if (!('recentchanges' in changeList.query) || !changeList.query.recentchanges || !Array.isArray(changeList.query.recentchanges)) throw new Error('The returned change list from the MediaWiki API is missing the "recentchanges" array!');
        if (changeList.query.recentchanges.length === 0) break;

        console.log(`Got a filled change list from the ${wiki.wikiTrueGame} wiki!`, changeList.query.recentchanges);

        const recentChanges: [MediaWikiRecentChange, ...MediaWikiRecentChange[]] = changeList.query.recentchanges as [any, ...any[]];

        let latestChangeDate: Date|null = new Date(storageIndex.lastKnownChange);
        for (const change of recentChanges) {

            const changeDate = new Date(change.timestamp);
            if (changeDate.toISOString() === storageIndex.lastKnownChange) continue; // Skip the last known change, as it's already indexed.
            if (changeDate > latestChangeDate) {
                indexHasChanged = true;
                latestChangeDate = changeDate;
            }

            const page = storageIndex.pages[change.title];
            if (page) {
                page.needsRedownloaded = true;
                indexHasChanged = true;
            }
        }

        storageIndex.lastKnownChange = latestChangeDate?.toISOString() ?? storageIndex.lastKnownChange;

    } while ('continue' in changeList);

    if (!indexHasChanged) return;

    const storageIndexPath = getWikiIndexPath(wiki);
    await fs.writeFile(storageIndexPath, JSON.stringify(storageIndex));
}

const storageIndexCache = memoizeDevServerConst('storageIndexCache', ()=>new Map<GameWithWiki, [data: WikiStorageIndex, mtime: number]>());
const activeGetStorageIndexPromises = new Map<GameWithWiki, ReturnType<typeof getStorageIndex_>>();
export function getStorageIndex(wiki: PapyrusWiki): ReturnType<typeof getStorageIndex_> {
    const activePromise = activeGetStorageIndexPromises.get(wiki.wikiTrueGame);
    if (activePromise) return activePromise;

    const newPromise = getStorageIndex_(wiki).finally(()=>activeGetStorageIndexPromises.delete(wiki.wikiTrueGame));
    activeGetStorageIndexPromises.set(wiki.wikiTrueGame, newPromise);
    return newPromise;
}
async function getStorageIndex_(wiki: PapyrusWiki): Promise<WikiStorageIndex> {
    const cached = storageIndexCache.get(wiki.wikiTrueGame);
    if (cached) {
        const [data, storedMTime] = cached;
        const stats = await fs.stat(getWikiIndexPath(wiki));
        if (stats.mtimeMs <= storedMTime) return data;
    }

    if (isCI) console.log(`::debug::[WIKI STORAGE] Getting the storage index for the ${wiki.wikiTrueGame} wiki! Should we ingest the latest changes?`, cached === undefined);
    const data = await getStorageIndexRaw(wiki, cached === undefined);
    storageIndexCache.set(wiki.wikiTrueGame, [data, Date.now()]);
    return data;
}

async function getStorageIndexRaw(wiki: PapyrusWiki, shouldIngestLatestChanges: boolean): Promise<WikiStorageIndex> {
    const storageDir = getWikiStorageDirPath(wiki);
    const storageIndexPath = getWikiIndexPath(wiki);

    let indexExists = false;
    try {
        await fs.access(storageIndexPath);
        indexExists = true;
    } catch (err) {
        if (!(err instanceof Error) || !('code' in err) || err.code !== 'ENOENT') throw err;
    }

    let data: WikiStorageIndex;
    if (!indexExists) {
        await fs.mkdir(storageDir, {recursive: true});
        data = {
            lastKnownChange: new Date().toISOString(),
            pages: {},
        };
        const releaseIndexLock = await getLock(storageIndexPath);
        await fs.writeFile(storageIndexPath, JSON.stringify(data));
        await releaseIndexLock();
    } else {
        const releaseIndexLock = await getLock(storageIndexPath);
        const indexContents = await fs.readFile(storageIndexPath, 'utf8');
        data = JSON.parse(indexContents);
        if (shouldIngestLatestChanges) await ingestLatestChanges(wiki, data);
        await releaseIndexLock();
    }

    return data;
}


const pendingChangesByWiki = new Map<GameWithWiki, [page: string, payload: WikiStorageEntry][]>();
async function applyIndexChangesRAW(wiki: PapyrusWiki, changes: [page: string, payload: WikiStorageEntry][]) {
    pendingChangesByWiki.set(wiki.wikiTrueGame, changes);
    const indexPath = getWikiIndexPath(wiki);
    const releaseIndexLock = await getLock(indexPath);
    try {
        const latestData = JSON.parse(await fs.readFile(indexPath, 'utf8'));
        for (const [page, payload] of changes) latestData.pages[page] = payload;
        pendingChangesByWiki.delete(wiki.wikiTrueGame);
        await fs.writeFile(indexPath, JSON.stringify(latestData));
        storageIndexCache.set(wiki.wikiTrueGame, [latestData, Date.now()]);
    } finally {
        await releaseIndexLock();
    }
}


function changeIndexEntry(wiki: PapyrusWiki, page: string, payload: WikiStorageEntry) {
    const pendingChanges = pendingChangesByWiki.get(wiki.wikiTrueGame);
    if (pendingChanges) pendingChanges.push([page, payload]);
    else applyIndexChangesRAW(wiki, [[page, payload]]);

    const cachedStorageIndex = storageIndexCache.get(wiki.wikiTrueGame);
    if (cachedStorageIndex) {
        const [data] = cachedStorageIndex;
        data.pages[page] = payload;
    }
}


const writePromisePoolObj = memoizeDevServerConst('writePromisePoolObj', ()=>({
    writePromisePool: new Array(250).fill(Promise.resolve()),
    writePromisePoolCursor: 0,
}));

const writePromisePool: Promise<any>[] = writePromisePoolObj.writePromisePool;
let writePromisePoolCursor = writePromisePoolObj.writePromisePoolCursor;

function getQueuedWritePromise<T = void>(then: ()=>Promise<T>): Promise<T> {
    const promise = writePromisePool[writePromisePoolCursor]!;
    const newPromise = Promise.allSettled([promise]).then(then);
    writePromisePool[writePromisePoolCursor] = newPromise;
    writePromisePoolCursor = (writePromisePoolCursor + 1) % writePromisePool.length;
    return newPromise;
}

export async function getWikiPageHTMLString(wiki: PapyrusWiki, pageTitle: string): Promise<string | null> {
    const htmlFilePath = path.join(getWikiStorageDirPath(wiki), `${pageTitle}.html`);
    if (isCI) console.debug(`::debug::[WIKI STORAGE] Attempting to get ${wiki.wikiTrueGame} wiki page ${pageTitle} from disk cache at ${htmlFilePath}`);
    const storageIndex = await getStorageIndex(wiki);


    const page = storageIndex.pages[pageTitle];
    if (page && !page.needsRedownloaded) {
        if (!page.exists) return null;
        const releaseHTMLFileLock = await getLock(htmlFilePath);
        try {
            const res = await fs.readFile(path.join(getWikiStorageDirPath(wiki), `${pageTitle}.html`), 'utf8');

            if (res.trim() === '') {
                if (isCI) console.debug(`::debug::[WIKI STORAGE] File is empty; marking ${wiki.wikiTrueGame} wiki page ${pageTitle} as nonexistent.`);
                changeIndexEntry(wiki, pageTitle, {
                    exists: false,
                    needsRedownloaded: page.needsRedownloaded,
                    lastDownloaded: page.lastDownloaded,
                });
                await fs.rm(htmlFilePath);
                return null;
            }

            if (isCI) console.debug(`::debug::[WIKI STORAGE] Successfully read ${wiki.wikiTrueGame} wiki page ${pageTitle} from ${htmlFilePath}`);
            return res;
        } catch (err) {
            if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
                if (isCI) console.debug(`::debug::[WIKI STORAGE] File for ${wiki.wikiTrueGame} wiki page ${pageTitle} does not exist. Will redownload.`);
                changeIndexEntry(wiki, pageTitle, {
                    exists: false,
                    needsRedownloaded: page.needsRedownloaded,
                    lastDownloaded: page.lastDownloaded,
                });
                await fs.rm(htmlFilePath, {force: true});
                // intentionally continue on to downloading now
            } else {
                throw err;
            }
        } finally {
            await releaseHTMLFileLock();
        }
    }

    return await getQueuedWritePromise(()=>downloadWikiPageHTMLString(wiki, pageTitle, htmlFilePath));
}

async function downloadWikiPageHTMLString(wiki: PapyrusWiki, pageTitle: string, htmlFilePath: string): Promise<string | null> {
    if (isCI) console.debug(`::debug::[WIKI STORAGE] Downloading ${wiki.wikiTrueGame} wiki page ${pageTitle} to ${htmlFilePath} ...`);
    const releaseHTMLFileLock = await getLock(htmlFilePath);
    try {
        const startDateISO = new Date().toISOString();
        const pageContent = await parsoidGetPageHTML(wiki.wikiBaseUrl, pageTitle);
        if (!pageContent) {
            if (isCI) console.debug(`::debug::[WIKI STORAGE] Page does not exist; failed to download ${wiki.wikiTrueGame} wiki page ${pageTitle} to ${htmlFilePath}`);
            changeIndexEntry(wiki, pageTitle, {
                exists: false,
                needsRedownloaded: false,
                lastDownloaded: startDateISO,
            });
        } else {
            await fs.writeFile(htmlFilePath, pageContent);
            if (isCI) console.debug(`::debug::[WIKI STORAGE] Successfully downloaded ${wiki.wikiTrueGame} wiki page ${pageTitle} to ${htmlFilePath}`);
            changeIndexEntry(wiki, pageTitle, {
                exists: true,
                needsRedownloaded: false,
                lastDownloaded: startDateISO,
            });
        }
        return pageContent;
    } finally {
        await releaseHTMLFileLock();
    }
}
