'use client';

import React, { Suspense } from 'react';
import type { PapyrusGame } from '../../papyrus/data-structures/pure/game';
import type { SearchIndexEntityType } from './Entity';
import { deepUnprepare, DeepUnpreparedValue } from './Preparation';
import type { WorkerMessageInput, WorkerMessageInputInit, WorkerMessageOutput, WorkerMessageOutputSearchIndexReady, WorkerMessageOutputSearchResult } from './SEARCH.worker';
import { memoizeDevServerConst } from '../../utils/memoizeDevServerConst';
import { SourceListUser } from '../components/papyrus/SourcesList';
import { usePostHog } from 'posthog-js/react';
import { useUpdatedRef } from '../hooks/useUpdatedRef';

function generateWorker(game: PapyrusGame, searchIndexHash: string) {
    console.log('Creating search worker...');
    const newWorker = new Worker(new URL('./SEARCH.worker.ts', import.meta.url));
    newWorker.postMessage({type: 'INIT', game, searchIndexHash} satisfies WorkerMessageInputInit);
    return newWorker as Omit<typeof newWorker, 'postMessage'> & {
        postMessage(message: Exclude<WorkerMessageInput, WorkerMessageInputInit>): void;
        addEventListener(type: 'message', listener: (this: Worker, ev: MessageEvent<WorkerMessageOutput>) => any, options?: boolean | AddEventListenerOptions): void;
    };
}

export type SearchContextLoaded = {
    worker: Worker;
    sources: Promise<WorkerMessageOutputSearchIndexReady['sources']>;
    DEVELOPMENT__LOADING_HASH: false;
    LOADING_FROM_SSR: false;
    search<TTypes extends SearchIndexEntityType>(query: string, types: TTypes[], signal?: undefined): Promise<DeepUnpreparedValue<WorkerMessageOutputSearchResult<PapyrusGame, TTypes>['results']>>;
    search<TTypes extends SearchIndexEntityType>(query: string, types: TTypes[], signal?: AbortSignal | undefined): Promise<null | DeepUnpreparedValue<WorkerMessageOutputSearchResult<PapyrusGame, TTypes>['results']>>;
    search<TTypes extends SearchIndexEntityType>(query: string, types: TTypes[], signal: AbortSignal | undefined): Promise<null | DeepUnpreparedValue<WorkerMessageOutputSearchResult<PapyrusGame, TTypes>['results']>>;
}

export type SearchContext = SearchContextLoaded | {
    DEVELOPMENT__LOADING_HASH: boolean;
    LOADING_FROM_SSR: boolean;
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

export const LOADING_IN_DEV_MODE: unique symbol = memoizeDevServerConst('SEARCH__LOADING_IN_DEV_MODE', () => Symbol.for('PAPYRUS_INDEX_LOADING_IN_DEV_MODE')) as any;

export function SearchProvider({children, game, searchIndexHash}: {readonly children: React.ReactNode, readonly game: PapyrusGame, readonly searchIndexHash: string | typeof LOADING_IN_DEV_MODE}) {
    const posthog = usePostHog();
    const posthogRef = useUpdatedRef(posthog); // because the sources promise is async, we don't want to start *another* promise just because Posthog loaded; just use whatever the current Posthog instance is

    const isLoadingHash = searchIndexHash === LOADING_IN_DEV_MODE;
    const typeofWorker = typeof Worker;
    const worker = React.useMemo(() => (isLoadingHash || typeofWorker === 'undefined') ? null : generateWorker(game, searchIndexHash), [game, searchIndexHash, typeofWorker, isLoadingHash]);
    const sources = React.useMemo(() => new Promise<WorkerMessageOutputSearchIndexReady['sources']>(resolve => {
        if (!worker) return resolve(null as never);
        const startLoad = performance.now();
        const takingTooLongInterval = setInterval(() => {
            const debugObj = {
                game,
                searchIndexHash,
                time: performance.now() - startLoad,
            };
            console.warn('SearchIndex taking too long to load', debugObj);
            posthogRef.current?.capture('SearchIndex taking too long to load', debugObj);
        }, 2000);
        const listener = (e: MessageEvent<WorkerMessageOutput>) => {
            if (e.data.type !== 'SEARCH_INDEX_READY') return;
                worker.removeEventListener('message', listener);
                clearInterval(takingTooLongInterval);
                resolve(e.data.sources);
                console.log('Search index loaded for', game);
                posthogRef.current?.capture('Search index loaded', {
                    search_index_hash: searchIndexHash,
                    game,
                });

            };
            worker.addEventListener('message', listener);
        }
    ), [game, posthogRef, searchIndexHash, worker]);

    React.useEffect(() => {
        const previousWorker = worker;
        return () => previousWorker?.terminate();
    }, [worker]);

    const searchIdRef = React.useRef(0);

    const search = React.useCallback<SearchContextLoaded['search']>(
        async function search<TTypes extends SearchIndexEntityType>(query: string, types: TTypes[], signal?: AbortSignal): Promise<any> {
            if (!worker) throw new Error('Cannot call search() from the server! Must be called on the client, with Web Workers enabled.');
            const start = performance.now();
            const searchId = ++searchIdRef.current;
            const resultPromise = new Promise<null | DeepUnpreparedValue<WorkerMessageOutputSearchResult<PapyrusGame, TTypes>['results']>>(resolve => {
                const removeMessageListener = () => worker.removeEventListener('message', messageListener);
                const messageListener = (e: MessageEvent<WorkerMessageOutput>) => {
                    if (e.data.type !== 'SEARCH_RESULT' || e.data.id !== searchId) return;
                    removeMessageListener();
                    if (signal?.aborted) return;
                    const narrowedE = e as MessageEvent<WorkerMessageOutputSearchResult<PapyrusGame, TTypes>>;
                    resolve(deepUnprepare(narrowedE.data.results));
                };
                worker.addEventListener('message', messageListener);
                signal?.addEventListener('abort', removeMessageListener);
                signal?.addEventListener('abort', () => resolve(null));
            });
            worker.postMessage({
                type: 'SEARCH',
                query,
                types,
                id: searchIdRef.current
            });
            const res = await resultPromise;
            const end = performance.now();
            console.log('Search took', end - start, 'ms', {res});
            posthog?.capture('Search query completed', {
                game,
                query,
                types,
                result_count: res ? Object.keys(res).length : 0,
                search_time: end - start,
                search_id: searchId,
                latest_search_id: searchIdRef.current,
                is_latest: searchId === searchIdRef.current,
                search_index_hash: searchIndexHash,
            });
            return res;
        },
    [worker, posthog, game, searchIndexHash]);

    const value = React.useMemo<SearchContext>(() => worker ? ({
        worker,
        sources,
        search,
        DEVELOPMENT__LOADING_HASH: false,
        LOADING_FROM_SSR: false,
    }) : {
        DEVELOPMENT__LOADING_HASH: isLoadingHash,
        LOADING_FROM_SSR: typeof window === 'undefined',
    }, [isLoadingHash, worker, sources, search]);

    return <searchContext.Provider value={value}>
        {children}
        <Suspense>
            <SourceListUser game={game} />
        </Suspense>
    </searchContext.Provider>;
}
