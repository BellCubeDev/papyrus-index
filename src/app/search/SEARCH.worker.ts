import fuzzysort from "fuzzysort";
import type { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import { toLowerCase } from "../../utils/toLowerCase";
import type { SearchIndexEntity } from "../[game]/search-index.json/route";
import { UnreachableError } from "../../UnreachableError";

export interface WorkerMessageBase {
    type: string;
}

export interface WorkerMessageInputGame extends WorkerMessageBase {
    type: 'GAME';
    game: PapyrusGame;
}

export interface WorkerMessageInputSearch extends WorkerMessageBase {
    type: 'SEARCH';
    query: string;
    id: number;
}

export type WorkerMessageInput = WorkerMessageInputGame | WorkerMessageInputSearch;

export interface WorkerMessageOutputSearchResult extends WorkerMessageBase {
    type: 'SEARCH_RESULT';
    id: number;
    results: Fuzzysort.KeysResults<SearchIndexEntity>;
}

export type WorkerMessageOutput = WorkerMessageOutputSearchResult;

const game: PapyrusGame = await new Promise(resolve => {
    self.onmessage = (e: MessageEvent<WorkerMessageInput>) => {
        if (e.data.type !== 'GAME') throw new Error('[SEARCH WORKER] First message sent to search worker must be of type "GAME"');
        resolve(e.data.game);
        self.onmessage = null;
    };
});

console.log('[SEARCH WORKER] Waiting for search index for game:', game);

// TODO: Request the un-prepared version (about 1/3 the download size), prep it in the worker, and store the prepared version in IndexedDB
// TODO: Come up with some method of cache invalidation. Ideally, the layout component would calculate the hash of the search index and pass it to the client
const searchIndexPromise: Promise<SearchIndexEntity[]> = fetch(new URL(`/${toLowerCase(game)}/search-index.json`, self.location.href), {
    cache: 'force-cache',
}).then(res => res.json());

console.log('[SEARCH WORKER] Got search index:', searchIndexPromise);

self.addEventListener('message', async function searchWorkerMessageHandler(e: MessageEvent<WorkerMessageInput>) {
    const message = e.data;
    console.log('[SEARCH WORKER] Received message:', message);
    switch (message.type) {
        case 'GAME':
            throw new Error('[SEARCH WORKER] "GAME" message type should not be sent to worker more than once!');
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
