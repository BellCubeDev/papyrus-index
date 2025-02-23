'use client';

import React from 'react';
import type { PapyrusGame } from '../../papyrus/data-structures/pure/game';
import type { WorkerMessageInput, WorkerMessageInputInit, WorkerMessageOutput } from './SEARCH.worker';
import type { SearchIndexEntity } from '../[game]/search-index.json/SearchIndexEntity';

function generateWorker(game: PapyrusGame, searchIndexHash: string) {
    console.log('Creating search worker...');
    const newWorker = new Worker(new URL('./SEARCH.worker.ts', import.meta.url));
    newWorker.postMessage({type: 'INIT', game, searchIndexHash} satisfies WorkerMessageInputInit);
    return newWorker as Omit<typeof newWorker, 'postMessage'> & {
        postMessage(message: Exclude<WorkerMessageInput, WorkerMessageInputInit>): void;
        addEventListener(type: 'message', listener: (this: Worker, ev: MessageEvent<WorkerMessageOutput>) => any, options?: boolean | AddEventListenerOptions): void;
    };
}

interface SearchContext {
    worker: Worker;
    search(query: string): Promise<Fuzzysort.KeysResults<SearchIndexEntity>>;
}

const searchContext = React.createContext<SearchContext | null>(null);

export function useSearchContext(advanced?: false): SearchContext;
export function useSearchContext(advanced: boolean): SearchContext | null;
export function useSearchContext(advanced?: boolean): SearchContext | null {
    const res = React.useContext(searchContext);
    if (!res && !advanced) {
        if (typeof window !== 'undefined') throw new Error('useSearchContext() was called without a <SearchProvider> ancestor!');
        else return null as never;
    }
    return res;
}

export function SearchProvider({children, game, searchIndexHash}: {readonly children: React.ReactNode, readonly game: PapyrusGame, readonly searchIndexHash: string}) {
    const typeofWorker = typeof Worker;
    const worker = React.useMemo(() => typeofWorker === 'undefined' ? null : generateWorker(game, searchIndexHash), [game, searchIndexHash, typeofWorker]);

    React.useEffect(() => {
        const previousWorker = worker;
        return () => previousWorker?.terminate();
    }, [worker]);

    const searchIdRef = React.useRef(0);

    const search = React.useCallback(async function search(query: string) {
        if (!worker) throw new Error('Cannot call search() from the server! Must be called on the client, with Web Workers enabled.');
        const start = performance.now();
        const searchId = ++searchIdRef.current;
        const resultPromise = new Promise<Fuzzysort.KeysResults<SearchIndexEntity>>(resolve => {
            const listener = (e: MessageEvent<WorkerMessageOutput>) => {
                if (e.data.type !== 'SEARCH_RESULT' || e.data.id !== searchId) return;
                worker.removeEventListener('message', listener);
                resolve(e.data.results);
            };
            worker.addEventListener('message', listener);
        });
        worker.postMessage({type: 'SEARCH', query, id: searchIdRef.current});
        const res = await resultPromise;
        console.log('Search took', performance.now() - start, 'ms', {res});
        return res;
    }, [worker]);

    const value = React.useMemo(() => worker ? ({
        worker,
        search,
    }) : null, [worker, search]);

    return <searchContext.Provider value={value}>
        {children}
    </searchContext.Provider>;
}
