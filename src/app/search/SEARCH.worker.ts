import fuzzysort from "fuzzysort";
import { UnreachableError } from "../../UnreachableError";
import { AllSourcesCombined } from "../../papyrus/data-structures/indexing/game";
import type { PapyrusScriptSourceIndexedNoScriptsProp } from "../../papyrus/data-structures/indexing/scriptSource";
import { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import { indexGame } from "../../papyrus/indexing/index-game";
import { getSourceTypeMultiplier } from "../../utils/getSourceTypeMultiplier";
import { toLowerCase } from "../../utils/toLowerCase";
import type { SearchDataGETResponse, SingleExtraEntityDataRecord } from "../[game]/search-data.json/route";
import { SearchIndexEntityGroupRecord, SearchIndexEntityType, selectEntityGroups, type SearchIndexEntity, type SelectEntityGroups } from "./Entity";
import { deepPrepareObject, getStringForSymbol, prepForBorderCrossing, SYMBOL_PREFIX, type DeepPreparedObject } from "./Preparation";
import { PapyrusScriptTypeArchetype, type PapyrusScriptType } from "../../papyrus/data-structures/pure/type";
import { UnknownPapyrusScript, UnknownPapyrusScriptStruct, type PapyrusScriptTypeIndexed, type PapyrusScriptTypeScriptInstanceIndexed, type PapyrusScriptTypeStructIndexed } from "../../papyrus/data-structures/indexing/type";

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
    types: SearchIndexEntityType[];
    id: number;
}

export type WorkerMessageInput = WorkerMessageInputInit | WorkerMessageInputSearch;


export interface WorkerMessageOutputSearchResult<TGame extends PapyrusGame, TTypes extends SearchIndexEntityType> extends WorkerMessageBase {
    type: 'SEARCH_RESULT';
    id: number;
    results: Fuzzysort.KeysResults<SelectEntityGroups<TGame, DeepPreparedObject<SearchIndexEntityGroupRecord<PapyrusGame>>, TTypes> extends (infer AV)[] ? AV : never>
}

export interface WorkerMessageOutputSearchIndexReady extends WorkerMessageBase {
    type: 'SEARCH_INDEX_READY';
    sources: Record<Lowercase<string>, PapyrusScriptSourceIndexedNoScriptsProp<PapyrusGame>>;
}

export type WorkerMessageOutput = WorkerMessageOutputSearchResult<PapyrusGame, SearchIndexEntityType> | WorkerMessageOutputSearchIndexReady;

const {game, searchIndexHash} = await new Promise<WorkerMessageInputInit>(resolve => {
    self.onmessage = (e: MessageEvent<WorkerMessageInput>) => {
        if (e.data.type !== 'INIT') throw new Error('[SEARCH WORKER] First message sent to search worker must be of type "INIT"');
        resolve(e.data);
        self.onmessage = null;
    };
});

console.log('[SEARCH WORKER] Waiting for search index for game:', game);


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


async function openIndexedDB(): Promise<IDBDatabase> {
    const request = indexedDB.open('papyrus-index-disk-cache', 2);

    request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('search-index-cache')) db.createObjectStore('search-index-cache');
    };

    const db = await promisifyDBRequest(request);
    return db;
}

// eslint-disable-next-line complexity
async function getSearchIndexOnWorkerLoad(): Promise<[DeepPreparedObject<SearchIndexEntityGroupRecord<PapyrusGame>>, Record<Lowercase<string>, PapyrusScriptSourceIndexedNoScriptsProp<PapyrusGame>>]> {

    const searchIndexKey = `${searchIndexHash}-vTEST_01`;

    try {
        performance.mark('startLoadExistingSearchIndex');
        const db = await openIndexedDB();

        const existingHash = await promisifyDBRequest(db.transaction('search-index-cache', "readonly").objectStore('search-index-cache').get(`${toLowerCase(game)}-key`));
        if (existingHash === searchIndexKey) {
            const transaction = db.transaction('search-index-cache', "readonly").objectStore('search-index-cache')
            const existingIndex: DeepPreparedObject<SearchIndexEntityGroupRecord<PapyrusGame>> | null = await promisifyDBRequest(transaction.get(`${toLowerCase(game)}-index`));
            const existingSources: Record<Lowercase<string>, PapyrusScriptSourceIndexedNoScriptsProp<PapyrusGame>> = await promisifyDBRequest(transaction.get(`${toLowerCase(game)}-sources`));
            if (existingIndex && existingSources) {
                console.log('[SEARCH WORKER] Found search index in IndexedDB cache:', existingIndex);
                performance.mark('gotExistingSearchIndexRaw');

                console.log('[SEARCH WORKER] Translated search index:', existingIndex);

                performance.mark('endLoadExistingSearchIndex');

                console.log(performance.measure('getExistingSearchIndexFromDB', 'startLoadExistingSearchIndex', 'gotExistingSearchIndexRaw'));
                console.log(performance.measure('translateExistingSearchIndex', 'gotExistingSearchIndexRaw', 'endLoadExistingSearchIndex'));
                console.log(performance.measure('loadExistingSearchIndex', 'startLoadExistingSearchIndex', 'endLoadExistingSearchIndex'));

                self.postMessage({
                    type: 'SEARCH_INDEX_READY',
                    sources: existingSources,
                } satisfies WorkerMessageOutput);

                return [existingIndex, existingSources];
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

    const res = await fetch(new URL(`/${toLowerCase(game)}/search-data.json?hash=${searchIndexHash}`, self.location.href), {
        cache: 'force-cache',
    });
    if (!res.ok) {
        try {
            console.error('[SEARCH WORKER] Failed to fetch search index data:', res.status, res.statusText, 'with result:', await res.text());
        } finally {
            // eslint-disable-next-line no-unsafe-finally
            throw new Error(`[SEARCH WORKER] Failed to fetch search index data: ${res.status} ${res.statusText}`);
        }
    }

    performance.mark('startCreateSearchIndex');
    console.log(performance.measure('downloadRawData', 'startDownloadRawData', 'startCreateSearchIndex'));

    const searchData = await res.json() as SearchDataGETResponse;
    const indexedScripts = indexGame(searchData.rawData);
    console.log('[SEARCH WORKER] Indexed scripts:', indexedScripts);


    const oldStackTraceLimit = Error.stackTraceLimit;
    const newStackTraceLimit = 500;
    Error.stackTraceLimit = newStackTraceLimit;

    try {
        const entitiesPromises: RecordOfArrayOfPromises<SearchIndexEntityGroupRecord<PapyrusGame>> = {
            [SearchIndexEntityType.Script]: [],
            [SearchIndexEntityType.Function]: [],
            [SearchIndexEntityType.Event]: [],
            [SearchIndexEntityType.Property]: [],
            [SearchIndexEntityType.Struct]: [],
        };

        for (const scriptBySources of Object.values(indexedScripts.scripts)) {
            const extraScriptEntityData = searchData.extraEntityData[scriptBySources[AllSourcesCombined].$entityId] as SingleExtraEntityDataRecord[SearchIndexEntityType.Script] | undefined;
            if (!extraScriptEntityData) throw new Error(`[SEARCH WORKER] Failed to find extra entity data for script ${scriptBySources[AllSourcesCombined].nameWithoutNamespace[0]![1]}!`);
            entitiesPromises[SearchIndexEntityType.Script].push(Object.assign(scriptBySources[AllSourcesCombined], {...extraScriptEntityData, $entityType: SearchIndexEntityType.Script}));            for (const func of Object.values(scriptBySources[AllSourcesCombined].functions)) {
                const extraEntityData = searchData.extraEntityData[func.$entityId] as SingleExtraEntityDataRecord[SearchIndexEntityType.Function] | undefined;
                if (!extraEntityData) throw new Error(`[SEARCH WORKER] Failed to find extra entity data for function ${func.name[0]![1]} in script ${scriptBySources[AllSourcesCombined].nameWithoutNamespace[0]![1]}!`);
                entitiesPromises[SearchIndexEntityType.Function].push(Object.assign(func, {...extraEntityData, $entityType: SearchIndexEntityType.Function}));
            }
            for (const event of Object.values(scriptBySources[AllSourcesCombined].events)) {
                const extraEntityData = searchData.extraEntityData[event.$entityId] as SingleExtraEntityDataRecord[SearchIndexEntityType.Event] | undefined;
                if (!extraEntityData) throw new Error(`[SEARCH WORKER] Failed to find extra entity data for function ${event.name[0]![1]} in script ${scriptBySources[AllSourcesCombined].nameWithoutNamespace[0]![1]}!`);
                entitiesPromises[SearchIndexEntityType.Event].push(Object.assign(event, {...extraEntityData, $entityType: SearchIndexEntityType.Event}));
            }
            for (const group of Object.values(scriptBySources[AllSourcesCombined].propertyGroups)) {
                for (const prop of Object.values(group.properties)) {
                    const extraEntityData = searchData.extraEntityData[prop.$entityId] as SingleExtraEntityDataRecord[SearchIndexEntityType.Property] | undefined;

                    if (!extraEntityData) throw new Error(`[SEARCH WORKER] Failed to find extra entity data for function ${prop.name[0]![1]} (from group ${prop.group.name[0]![1]}) in script ${scriptBySources[AllSourcesCombined].nameWithoutNamespace[0]![1]}!`); // eslint-disable-line max-depth
                    entitiesPromises[SearchIndexEntityType.Property].push(Object.assign(prop, {...extraEntityData, $entityType: SearchIndexEntityType.Property}));
                }
            }
            if (scriptBySources[AllSourcesCombined].structs) {
                for (const struct of Object.values(scriptBySources[AllSourcesCombined].structs)) {
                    const extraEntityData = searchData.extraEntityData[struct.$entityId] as SingleExtraEntityDataRecord[SearchIndexEntityType.Struct] | undefined;
                    if (!extraEntityData) throw new Error(`[SEARCH WORKER] Failed to find extra entity data for function ${struct.name[0]![1]} in script ${scriptBySources[AllSourcesCombined].nameWithoutNamespace[0]![1]}!`); // eslint-disable-line max-depth
                    entitiesPromises[SearchIndexEntityType.Struct].push(Object.assign(struct, {...extraEntityData, $entityType: SearchIndexEntityType.Struct}));
                }
            }
        }

        const entities = Object.fromEntries(await Promise.all(Object.entries(entitiesPromises).map(async ([k, v]) => [k, await Promise.all(v)]))) as SearchIndexEntityGroupRecord<PapyrusGame>;

        const readyToStoreEntities = deepPrepareObject(entities);


        const sources = Object.fromEntries(Object.entries(indexedScripts.scriptSources).map(([sourceIdentifier, source]) => [sourceIdentifier, Object.fromEntries(Object.entries(source).filter(([k, _v]) => k !== 'scripts'))])) as Record<Lowercase<string>, PapyrusScriptSourceIndexedNoScriptsProp<PapyrusGame>>;
        console.log('[SEARCH WORKER] Gathered sources:', sources);

        try {
            const db = await openIndexedDB();
            const tx = db.transaction('search-index-cache', 'readwrite');
            tx.objectStore('search-index-cache').put(readyToStoreEntities, `${toLowerCase(game)}-index`);
            tx.objectStore('search-index-cache').put(sources, `${toLowerCase(game)}-sources`);
            tx.objectStore('search-index-cache').put(searchIndexKey, `${toLowerCase(game)}-key`);
            await promisifyDBTransaction(tx);
        } catch (e) {
            console.warn('[SEARCH WORKER] Failed to store search index in IndexedDB cache! Encountered error:', e);
        }

        performance.mark('endFetchSearchIndex');
        console.log(performance.measure('createSearchIndex', 'startCreateSearchIndex', 'endFetchSearchIndex'));
        console.log(performance.measure('getSearchIndex', 'startDownloadRawData', 'endFetchSearchIndex'));

        self.postMessage({
            type: 'SEARCH_INDEX_READY',
            sources,
        } satisfies WorkerMessageOutput);

        return [readyToStoreEntities, sources];
    } finally {
        if (Error.stackTraceLimit === newStackTraceLimit) Error.stackTraceLimit = oldStackTraceLimit;
    }
}

const searchIndexPromise = getSearchIndexOnWorkerLoad();

(searchIndexPromise as Promise<any>).then((searchIndex) => {
    console.log('[SEARCH WORKER] Got search index:', searchIndex);
});

const keys: ((obj: SelectEntityGroups<PapyrusGame, DeepPreparedObject<SearchIndexEntityGroupRecord<PapyrusGame>>, SearchIndexEntityType> extends (infer T)[] ? T : never) => string | Fuzzysort.Prepared)[] = [
    (en) => en.$entityType === SearchIndexEntityType.Script ? en.namespaceName[0]![1] ?? '' : '',
    (en) => en.$entityType === SearchIndexEntityType.Script ? en.ckWikiDescription ?? '' : '',
    (en) => 'ckWikiDescription' in en ? en.ckWikiDescription ?? '' : '',
    (en) => 'githubWikiDescription' in en ? en.githubWikiDescription ?? '' : '',
    (en) => 'documentationComment' in en ? en.documentationComment[0]![1] ?? '' : '',
    (en) => 'documentationString' in en ? en.documentationString[0]![1] ?? '' : '',
    (en) => 'script' in en ? en.script.namespaceName[0]![1] ?? '' : '',
    (en) => 'name' in en ? en.name[0]![1] ?? '' : '',
    (en) => Object.keys(en.$sources).join(' '),
    (en) => en.$entityType !== SearchIndexEntityType.Script ? en.name[0]![1] ?? '' : '',
    (en) => ('parameters' in en ? en.parameters.map((parameter) => parameter.name.target) : []).join(' '),
];

function hasGoodMatchFor(str: string | Fuzzysort.Prepared, results: Fuzzysort.Result[], threshold: number) {
    if (typeof str !== 'string') str = str.target;
    const res = results.find(res_ => res_.target === str);
    return res && (!('_score' in res) || (typeof res._score === 'number' && res._score > threshold));
}

const stringsToPrepare = [
    'bool',
    'int',
    'float',
    'string',
    'none void',
    'var',
] as const;
const preparedStrings = Object.fromEntries(stringsToPrepare.map(v => [v, fuzzysort.prepare(v)]));

function getTypeSearchKey(typeRaw: DeepPreparedObject<PapyrusScriptTypeIndexed<boolean, false, PapyrusGame>>): string | Fuzzysort.Prepared {
    switch (typeRaw.type.target) {
        case PapyrusScriptTypeArchetype.Bool:
            return preparedStrings.bool;
        case PapyrusScriptTypeArchetype.Int:
            return preparedStrings.int;
        case PapyrusScriptTypeArchetype.Float:
            return preparedStrings.float;
        case PapyrusScriptTypeArchetype.String:
            return preparedStrings.string;
        case PapyrusScriptTypeArchetype.None:
            return preparedStrings['none void'];
        case PapyrusScriptTypeArchetype.Var:
            return preparedStrings.var;
        case PapyrusScriptTypeArchetype.ScriptInstance: {
            const type = (typeRaw as DeepPreparedObject<PapyrusScriptTypeScriptInstanceIndexed<boolean, false, PapyrusGame>>);
            return typeof type.script === 'string' ? type.script === getStringForSymbol(UnknownPapyrusScript) ? type.scriptName : '' : Object.values(type.script)[0]!.namespaceName;
        }
        case PapyrusScriptTypeArchetype.Struct: {
            const type = typeRaw as DeepPreparedObject<PapyrusScriptTypeStructIndexed<boolean, false, Exclude<PapyrusGame, PapyrusGame.SkyrimSE>>>;
            return typeof type.struct === 'string' ? type.struct === getStringForSymbol(UnknownPapyrusScriptStruct) ? `${type.scriptName} ${type.structName}` : ''
                : typeof type.script === 'string' ? type.script === getStringForSymbol(UnknownPapyrusScript) ? `${type.scriptName} ${Object.values(type.struct)[0]!.name}` : ''
                : `${Object.values(type.script)[0]!.namespaceName} ${Object.values(type.struct)[0]!.name}`;
        }

        default:
            throw new UnreachableError(typeRaw.type, `Unexpected PapyrusScriptTypeArchetype: ${typeRaw.type}`);

    }
}

self.addEventListener('message', async function searchWorkerMessageHandler(e: MessageEvent<WorkerMessageInput>) {
    const message = e.data;
    console.log('[SEARCH WORKER] Received message:', message);
    switch (message.type) {
        case 'INIT':
            throw new Error('[SEARCH WORKER] "INIT" message type should not be sent to worker more than once!');
        case 'SEARCH': {
            console.log('[SEARCH WORKER] Starting search:', message);
            performance.mark('startSearch');
            const [entities, sources] = await searchIndexPromise;
            const entitiesToSearchFrom = selectEntityGroups(entities, ...message.types);

            const results = prepForBorderCrossing(fuzzysort.go(message.query, entitiesToSearchFrom, {
                limit: 50,
                keys,
                scoreFn(keysResult) {
                    let newScore = keysResult.score ** 5; // make the initial score more... drastic

                    const obj = keysResult.obj;

                    const [coolestSourceMultiplier, coolestSource] = Object.keys(obj.$sources).reduce((acc, nextSourceName) => {
                        if (nextSourceName.startsWith(SYMBOL_PREFIX)) return acc;
                        const source = sources[nextSourceName]!;
                        const nextMultiplier = getSourceTypeMultiplier(source.type);
                        if (nextMultiplier > acc[0]) return [nextMultiplier, source] as const;
                        return acc;
                    }, [-Infinity, null] as any as readonly [number, PapyrusScriptSourceIndexedNoScriptsProp<PapyrusGame>]);

                    newScore *= coolestSourceMultiplier;

                    const matchedKeys = keysResult.filter((value) => value.target !== '');
                    const sourcesKey = Object.keys(obj.$sources).join(' ');

                    switch (obj.$entityType) {
                        case SearchIndexEntityType.Script: {
                            newScore *= getSourceTypeMultiplier(coolestSource.type);
                            if (matchedKeys.find((value) => value.target === coolestSource.sourceIdentifier)) newScore *= 2;
                            if (matchedKeys.find((value) => value.target.toLowerCase() === obj.namespaceName[0]![1].target)) newScore *= 10;

                            if (game === PapyrusGame.SkyrimSE) {
                                if (obj.isHidden) newScore *= 8;
                            } else {
                                if (obj.isNative.some(v => v[1])) newScore *= 8;
                            }

                            break;
                        }
                        case SearchIndexEntityType.Function: {
                            if (!matchedKeys.find((value) => value.target !== sourcesKey && value.target !== obj.script.namespaceName[0]![1].target)) {
                                newScore = 0;
                                break;
                            }

                            if (hasGoodMatchFor(obj.name[0]![1], matchedKeys, -100)) newScore *= 8;
                            else newScore *= .3;


                            if (hasGoodMatchFor(obj.script.namespaceName[0]![1], matchedKeys, -1000)) newScore *= 2.6;
                            if (hasGoodMatchFor(sourcesKey, matchedKeys, -1000)) newScore *= 1.4;

                            if (hasGoodMatchFor(getTypeSearchKey(obj.returnType), matchedKeys, -1000)) newScore *= 2.3;

                            if (!obj.isNative) newScore *= .6;
                            if (obj.isGlobal) newScore *= 1.2;


                            break;
                        }
                        case SearchIndexEntityType.Event: {
                            break;
                        }
                        case SearchIndexEntityType.Property: {
                            break;
                        }
                        case SearchIndexEntityType.Struct: {
                            break;
                        }
                        default:
                            throw new UnreachableError(obj, `Unexpected SearchIndexEntity type: ${(obj as any as SearchIndexEntity<PapyrusGame>).$entityType}`);
                    }
                    return newScore;
                },
                threshold: 0.2,
            }));
            performance.mark('endSearch');
            console.log('[SEARCH WORKER] Search took:', performance.measure('search', 'startSearch', 'endSearch').duration, 'ms, yielding results:', results);
            self.postMessage({
                type: 'SEARCH_RESULT',
                id: message.id,
                results,
            } as WorkerMessageOutputSearchResult<PapyrusGame, SearchIndexEntityType>);
            break;
        }
        default:
            throw new UnreachableError(message, 'Unknown type of message sent to SEARCH worker');
    }
});
