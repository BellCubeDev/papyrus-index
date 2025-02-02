'use client';

import React from 'react';
import type { PapyrusGame } from '../../papyrus/data-structures/pure/game';
import type { WorkerMessageInput, WorkerMessageInputGame, WorkerMessageOutput } from './SEARCH.worker';
import type { SearchIndexEntity } from '../[game]/search-index.json/route';

function generateWorker(game: PapyrusGame) {
    console.log('Creating search worker...');
    const newWorker = new Worker(new URL('./SEARCH.worker.ts', import.meta.url));
    newWorker.postMessage({type: 'GAME', game});
    return newWorker as Omit<typeof newWorker, 'postMessage'> & {
        postMessage(message: Exclude<WorkerMessageInput, WorkerMessageInputGame>): void;
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
    if (!res && !advanced) throw new Error('useSearchContext() was called without a <SearchProvider> ancestor!');
    return res;
}

export function SearchProvider({children, game}: {readonly children: React.ReactNode, readonly game: PapyrusGame}) {
    const worker = React.useMemo(() => generateWorker(game), [game]);

    React.useEffect(() => {
        const previousWorker = worker;
        return () => previousWorker.terminate();
    }, [worker]);

    const searchIdRef = React.useRef(0);

    const search = React.useCallback(async function search(query: string) {
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

    const value = React.useMemo(() => ({
        worker,
        search,
    }), [worker, search]);

    return <searchContext.Provider value={value}>
        {children}
    </searchContext.Provider>;
}
