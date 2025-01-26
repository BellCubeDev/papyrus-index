import fs from 'fs/promises';
import path from 'path';
import url from 'url';
import type { GameWithWiki, PapyrusWiki } from './getWiki';
import { wikiFetchGet } from './wikiFetch';
import { getWikiPageHTMLStringRaw } from './getWikiPageStringRaw';
import lockfileUtil from 'proper-lockfile';

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
     * If this is less than one minute newer than the latest change, this page should be marked for redownload.
    */
    lastDownloaded: string|null;
}

const thisFilePath = url.fileURLToPath(import.meta.url);
const thisDirPath = path.dirname(thisFilePath);
if (path.basename(thisDirPath) !== 'wikimedia') throw new Error(`Expected wikiStorage.ts to be in the wikimedia directory, but found ${thisDirPath}`);
const srcDir = path.join(thisDirPath, '..');
if (path.basename(srcDir) !== 'src') throw new Error(`Expected the parent of the 'wikimedia' folder to be in the src directory, but found ${srcDir}`);
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

function getLock(filePath: string): Promise<() => Promise<void>> {
    return lockfileUtil.lock(filePath, {retries: {forever: true, factor: 1.1, minTimeout: 300, maxTimeout: 3000}, realpath: false});
}

/**
 * MUST BE CALLED WITH THE STORAGE INDEX LOCKED
 */
async function ingestLatestChanges(wiki: PapyrusWiki, storageIndex: WikiStorageIndex): Promise<void> {
    let changeList;

    let hasChanges = false;

    do { // eslint-disable-next-line no-await-in-loop
        changeList = await wikiFetchGet(wiki, `/w/api.php?action=query&format=json&prop=&list=recentchanges&rcstart=${encodeURIComponent(storageIndex.lastKnownChange)}&rcdir=newer&rcprop=title%7Ctimestamp&rclimit=2&rctype=edit%7Cnew&rctoponly=1`);
        if (!changeList) throw new Error('Fetching the change list failed!');

        if (!('query' in changeList) || !changeList.query || typeof changeList.query !== 'object') throw new Error('The returned change list from the MediaWiki API is missing the "query" results object!');
        if (!('recentchanges' in changeList.query) || !changeList.query.recentchanges || !Array.isArray(changeList.query.recentchanges)) throw new Error('The returned change list from the MediaWiki API is missing the "recentchanges" array!');
        if (changeList.query.recentchanges.length === 0) break;

        hasChanges = true;
        const recentChanges: [MediaWikiRecentChange, ...MediaWikiRecentChange[]] = changeList.query.recentchanges as [any, ...any[]];

        let latestChangeDate: Date|null = null;
        for (const change of recentChanges) {
            const changeDate = new Date(change.timestamp);
            if (!latestChangeDate || changeDate > latestChangeDate) latestChangeDate = changeDate;

            const page = storageIndex.pages[change.title];
            if (!page) {
                storageIndex.pages[change.title] = {
                    needsRedownloaded: true,
                    exists: false,
                    lastDownloaded: null,
                };
            } else if (page.lastDownloaded && (changeDate.getTime() - new Date(page.lastDownloaded).getTime()) < 60000) {
                page.needsRedownloaded = true;
            }
        }

        storageIndex.lastKnownChange = latestChangeDate!.toISOString();

    } while ('continue' in changeList);

    if (!hasChanges) return;

    const storageIndexPath = getWikiIndexPath(wiki);
    await fs.writeFile(storageIndexPath, JSON.stringify(storageIndex));
}

const storageIndexCache = new Map<GameWithWiki, [data: WikiStorageIndex, mtime: number]>();
async function getStorageIndex(wiki: PapyrusWiki): Promise<WikiStorageIndex> {
    const cached = storageIndexCache.get(wiki.wikiTrueGame);
    if (cached) {
        const [data, storedMTime] = cached;
        const stats = await fs.stat(getWikiIndexPath(wiki));
        if (stats.mtimeMs > storedMTime) return data;
    }

    const data = await getStorageIndexRaw(wiki, cached !== undefined);
    storageIndexCache.set(wiki.wikiTrueGame, [data, Date.now()]);
    return data;
}

async function getStorageIndexRaw(wiki: PapyrusWiki, hasRunBefore: boolean): Promise<WikiStorageIndex> {
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
        await getLock(storageIndexPath);
        await fs.writeFile(storageIndexPath, JSON.stringify(data));
        await lockfileUtil.unlock(storageIndexPath);
    } else {
        await getLock(storageIndexPath);
        const indexContents = await fs.readFile(storageIndexPath, 'utf8');
        data = JSON.parse(indexContents);
        if (!hasRunBefore) await ingestLatestChanges(wiki, data);
        await lockfileUtil.unlock(storageIndexPath);
    }

    return data;
}


const pendingChangesByWiki = new Map<GameWithWiki, [page: string, payload: WikiStorageEntry][]>();
async function applyIndexChangesRAW(wiki: PapyrusWiki, changes: [page: string, payload: WikiStorageEntry][]) {
    pendingChangesByWiki.set(wiki.wikiTrueGame, changes);
    const indexPath = getWikiIndexPath(wiki);
    await getLock(indexPath);
    const latestData = JSON.parse(await fs.readFile(indexPath, 'utf8'));
    for (const [page, payload] of changes) latestData.pages[page] = payload;
    pendingChangesByWiki.delete(wiki.wikiTrueGame);
    await fs.writeFile(indexPath, JSON.stringify(latestData));
    storageIndexCache.set(wiki.wikiTrueGame, [latestData, Date.now()]);
    await lockfileUtil.unlock(indexPath);
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

export async function getWikiPageHTMLString(wiki: PapyrusWiki, pageTitle: string): Promise<string | null> {
    const htmlFilePath = path.join(getWikiStorageDirPath(wiki), `${pageTitle}.html`);

    const storageIndex = await getStorageIndex(wiki);


    const page = storageIndex.pages[pageTitle];
    if (page && !page.needsRedownloaded) {
        if (!page.exists) return null;
        await getLock(htmlFilePath);
        try {
            const res = await fs.readFile(path.join(getWikiStorageDirPath(wiki), `${pageTitle}.html`), 'utf8');
            if (res.trim() === '') {
                changeIndexEntry(wiki, pageTitle, {
                    exists: false,
                    needsRedownloaded: page.needsRedownloaded,
                    lastDownloaded: page.lastDownloaded,
                });
                await fs.rm(htmlFilePath);
                return null;
            }
            return res;
        } finally {
            await lockfileUtil.unlock(htmlFilePath);
        }
    }

    const htmlFileHandle = await fs.open(htmlFilePath, 'w');
    await getLock(htmlFilePath);
    let pageContent: string | null;
    try {
        const startDateISO = new Date().toISOString();
        pageContent = await getWikiPageHTMLStringRaw(wiki, pageTitle);

        if (!pageContent) {
            changeIndexEntry(wiki, pageTitle, {
                exists: false,
                needsRedownloaded: false,
                lastDownloaded: startDateISO,
            });
        } else {
            htmlFileHandle.writeFile(pageContent).then(()=>{
                changeIndexEntry(wiki, pageTitle, {
                    exists: true,
                    needsRedownloaded: false,
                    lastDownloaded: startDateISO,
                });
            });
        }
    } finally {
        try {
            await htmlFileHandle.close();
        } finally {
            await lockfileUtil.unlock(htmlFilePath);
        }
    }

    return pageContent;
}
