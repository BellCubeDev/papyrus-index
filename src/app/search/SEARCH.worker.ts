import fuzzysort from "fuzzysort";
import type { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import { toLowerCase } from "../../utils/toLowerCase";
import { UnreachableError } from "../../UnreachableError";
import { indexGame } from "../../papyrus/indexing/index-game";
import { AllSourcesCombined, type PapyrusGameDataIndexed } from "../../papyrus/data-structures/indexing/game";
import { AnySearchIndexEntity, SearchIndexEntityGroupRecord, SearchIndexEntityType } from "./Entity";

export interface WorkerMessageBase {
    type: string;
}

export interface WorkerMessageInputInit extends WorkerMessageBase {
    type: 'INIT';
    game: PapyrusGame;
    searchIndexHash: string;
}

export interface WorkerMessageInputSearch extends WorkerMessageBase {
    type: 'SEARCH';
    query: string;
    id: number;
}

export type WorkerMessageInput = WorkerMessageInputInit | WorkerMessageInputSearch;

export interface WorkerMessageOutputSearchResult extends WorkerMessageBase {
    type: 'SEARCH_RESULT';
    id: number;
    results: Fuzzysort.KeysResults<AnySearchIndexEntity<PapyrusGame>>;
}

export type WorkerMessageOutput = WorkerMessageOutputSearchResult;

const {game, searchIndexHash} = await new Promise<WorkerMessageInputInit>(resolve => {
    self.onmessage = (e: MessageEvent<WorkerMessageInput>) => {
        if (e.data.type !== 'INIT') throw new Error('[SEARCH WORKER] First message sent to search worker must be of type "INIT"');
        resolve(e.data);
        self.onmessage = null;
    };
});

export const SYMBOL_PREFIX = '**&&^^%%$##@@!!PAPYRUS_INDEX_SYMBOL_______' as const;

console.log('[SEARCH WORKER] Waiting for search index for game:', game);
export type DeepPreparedObject<T> = {
    [K in keyof T as K extends symbol ? `${typeof SYMBOL_PREFIX}${string}` : K]: DeepPreparedValue<T[K]>;
};
export type DeepPreparedValue<T> =
    T extends string
        ? Fuzzysort.Prepared
    : T extends (infer U)[]
        ? DeepPreparedObject<U>[]
    : T extends null | number | boolean | bigint | undefined
        ? T
    : T extends symbol
        ? `${typeof SYMBOL_PREFIX}${string}`
    : DeepPreparedObject<T>;

const AlreadyPreparedObjects = new WeakMap<Record<any, any>, DeepPreparedObject<any>>();
function deepPrepareObject<T extends Record<any, any>>(obj: T): DeepPreparedObject<T> {
    if (AlreadyPreparedObjects.has(obj)) return AlreadyPreparedObjects.get(obj)!;

    const prepared: any = {};
    AlreadyPreparedObjects.set(obj, prepared);

    for (const k of [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)]) {
        const v = obj[k as keyof typeof obj];
        const newKey = typeof k === 'symbol' ? `**&&^^%%$##@@!!PAPYRUS_INDEX_SYMBOL_______${String(k)}` : k;
        prepared[newKey] = deepPrepare(v);
    }

    return prepared;
}

function deepPrepare<T>(v: T): DeepPreparedValue<T> {
    return (
        typeof v === 'string'
            ? fuzzysort.prepare(v)
        : Array.isArray(v)
            ? v.map(deepPrepare)
        : v === null || typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint' || typeof v === 'undefined'
            ? v
        : typeof v === 'symbol'
            ? `${SYMBOL_PREFIX}${String(v)}`
        : deepPrepareObject(v)
    ) as DeepPreparedValue<T>;
}

function promisifyDBRequest<T>(req: IDBRequest<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

function promisifyDBTransaction(tx: IDBTransaction): Promise<Event> {
    return new Promise<Event>((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
    });
}

const AlreadyTranslatedObjects = new WeakSet<Record<any, any>>();
function translateSymbols<T>(obj: T): T {
    if (typeof obj === 'string' && obj.startsWith(SYMBOL_PREFIX))
        return Symbol.for(obj.slice(SYMBOL_PREFIX.length)) as any;

    if (typeof obj !== 'object' || obj === null) return obj;

    if (AlreadyTranslatedObjects.has(obj)) return obj;
    AlreadyTranslatedObjects.add(obj);

    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) obj[i] = translateSymbols(obj[i]);
        return obj;
    }

    for (const k of Object.getOwnPropertyNames(obj) as (string & keyof typeof obj)[]) {
        const v = obj[k ];

        const newValue = translateSymbols(v);

        if (k.startsWith(SYMBOL_PREFIX)) {
            const newKey = Symbol.for(k.slice(SYMBOL_PREFIX.length));
            (obj as any)[newKey] = newValue;
            delete obj[k];
        } else {
            obj[k] = newValue;
        }
    }

    return obj;
}

async function openIndexedDB(): Promise<IDBDatabase> {
    const request = indexedDB.open('papyrus-index-disk-cache', 2);

    request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('search-index-cache')) db.createObjectStore('search-index-cache');
    };

    const db = await promisifyDBRequest(request);
    return db;
}

async function getSearchIndexOnWorkerLoad(): Promise<DeepPreparedObject<SearchIndexEntityGroupRecord<PapyrusGame>>> {

    const searchIndexKey = `${searchIndexHash}-vTEST_01`;

    try {
        performance.mark('startLoadExistingSearchIndex');
        const db = await openIndexedDB();

        const existingHash = await promisifyDBRequest(db.transaction('search-index-cache', "readonly").objectStore('search-index-cache').get(`${toLowerCase(game)}-key`));
        if (existingHash === searchIndexKey) {
            const existingIndex = await promisifyDBRequest(db.transaction('search-index-cache', "readonly").objectStore('search-index-cache').get(`${toLowerCase(game)}-index`));
            if (existingIndex) {
                console.log('[SEARCH WORKER] Found search index in IndexedDB cache:', existingIndex);
                performance.mark('gotExistingSearchIndexRaw');

                const translatedIndex = translateSymbols(existingIndex);
                console.log('[SEARCH WORKER] Translated search index:', translatedIndex);

                performance.mark('endLoadExistingSearchIndex');

                console.log(performance.measure('getExistingSearchIndexFromDB', 'startLoadExistingSearchIndex', 'gotExistingSearchIndexRaw'));
                console.log(performance.measure('translateExistingSearchIndex', 'gotExistingSearchIndexRaw', 'endLoadExistingSearchIndex'));
                console.log(performance.measure('loadExistingSearchIndex', 'startLoadExistingSearchIndex', 'endLoadExistingSearchIndex'));

                return translatedIndex as Promise<DeepPreparedObject<SearchIndexEntityGroupRecord<PapyrusGame>>>;
            }
        }
    } catch (e) {
        console.warn('[SEARCH WORKER] Failed to get search index from IndexedDB! Encountered error:', e);

        try {
            console.log(performance.measure('getExistingSearchIndexFromDB', 'startLoadExistingSearchIndex', 'gotExistingSearchIndexRaw'));
            console.log(performance.measure('translateExistingSearchIndex', 'gotExistingSearchIndexRaw', 'endLoadExistingSearchIndex'));
            console.log(performance.measure('loadExistingSearchIndex', 'startLoadExistingSearchIndex', 'endLoadExistingSearchIndex'));
        } catch (e2) {
            // do nothing
        }
    }

    performance.mark('startDownloadRawData');

    const res = await fetch(new URL(`/${toLowerCase(game)}/raw.json?hash=${searchIndexHash}`, self.location.href), {
        cache: 'force-cache',
    });
    if (!res.ok) {
        try {
            console.error('[SEARCH WORKER] Failed to fetch search index:', res.status, res.statusText, 'with result:', await res.text());
        } finally {
            // eslint-disable-next-line no-unsafe-finally
            throw new Error(`[SEARCH WORKER] Failed to fetch search index: ${res.status} ${res.statusText}`);
        }
    }

    performance.mark('startCreateSearchIndex');
    console.log(performance.measure('downloadRawData', 'startDownloadRawData', 'startCreateSearchIndex'));

    const rawScripts = await res.json();
    const indexedScripts = indexGame(rawScripts);


    Error.stackTraceLimit = 500;


    const deepPreparedScripts = deepPrepareObject(indexedScripts);
    const readyToStoreEntities: DeepPreparedObject<SearchIndexEntityGroupRecord<PapyrusGame>> = {
        [SearchIndexEntityType.Script]: [],
        [SearchIndexEntityType.Function]: [],
        [SearchIndexEntityType.Event]: [],
        [SearchIndexEntityType.Property]: [],
        [SearchIndexEntityType.Struct]: [],
    };

    for (const script of Object.values(deepPreparedScripts.scripts)) {
        readyToStoreEntities[SearchIndexEntityType.Script].push(script);
        for (const func of script[AllSourcesCombined]) readyToStoreEntities[SearchIndexEntityType.Function].push(func);

    try {
        const db = await openIndexedDB();
        const tx = db.transaction('search-index-cache', 'readwrite');
        tx.objectStore('search-index-cache').put(readyToStoreEntities, `${toLowerCase(game)}-index`);
        tx.objectStore('search-index-cache').put(searchIndexKey, `${toLowerCase(game)}-key`);
        await promisifyDBTransaction(tx);
    } catch (e) {
        console.warn('[SEARCH WORKER] Failed to store search index in IndexedDB cache! Encountered error:', e);
    }

    const returnValue = translateSymbols(readyToStoreEntities);

    performance.mark('endFetchSearchIndex');
    console.log(performance.measure('createSearchIndex', 'startCreateSearchIndex', 'endFetchSearchIndex'));
    console.log(performance.measure('getSearchIndex', 'startDownloadRawData', 'endFetchSearchIndex'));

    return returnValue;
}

const searchIndexPromise = getSearchIndexOnWorkerLoad();

console.log('[SEARCH WORKER] Got search index:', searchIndexPromise);

self.addEventListener('message', async function searchWorkerMessageHandler(e: MessageEvent<WorkerMessageInput>) {
    const message = e.data;
    console.log('[SEARCH WORKER] Received message:', message);
    switch (message.type) {
        case 'INIT':
            throw new Error('[SEARCH WORKER] "INIT" message type should not be sent to worker more than once!');
        case 'SEARCH': {
            const results = fuzzysort.go(message.query, await searchIndexPromise, {
                keys: ['name', 'wikiShortDescription', 'wikiNotes', 'wikiParameterData.descriptionMarkdown', 'wikiParameterData.name'],
                limit: 50,
            });
            self.postMessage({
                type: 'SEARCH_RESULT',
                id: message.id,
                results,
            } as WorkerMessageOutput);
            break;
        }
        default:
            throw new UnreachableError(message, 'Unknown type of message sent to SEARCH worker');
    }
});
