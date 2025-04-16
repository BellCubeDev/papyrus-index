'use client';

import React, { useEffect } from "react";
import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { UnreachableError } from "../../../UnreachableError";
import { memoizeDevServerConst } from "../../../utils/memoizeDevServerConst";
import { GuardEmptyList } from "../GuardEmptyList";
import { PapyrusScriptFunctionReference } from "../papyrus/function/reference/PapyrusScriptFunctionReference";
import { PapyrusScriptReference } from "../papyrus/script/PapyrusScriptReference";
import { useUpdatedRef } from "../../hooks/useUpdatedRef";
import { SearchIndexEntityType, type SearchIndexEntity } from "../../search/Entity";
import { DeepUnpreparedValue } from "../../search/Preparation";
import type { WorkerMessageOutputSearchResult } from "../../search/SEARCH.worker";
import { useSearchContext, type SearchContextLoaded } from "../../search/SearchProvider";
import styles from './Search.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { usePostHog } from "posthog-js/react";
import { CLEAR_ANY_TIMER, useStoredInterval, useStoredTimeout } from "../../hooks/useStoredTimeout";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const EMPTY_QUERY: unique symbol = memoizeDevServerConst('<SearchBar> EMPTY_QUERY', ()=>Symbol('<SearchBar> EMPTY_QUERY')) as any;
const AWAITING_SEARCH: unique symbol = memoizeDevServerConst('<SearchBar> AWAITING_SEARCH', ()=>Symbol('<SearchBar> AWAITING_SEARCH')) as any;

export default function SearchBar({game}: {readonly game: PapyrusGame}): React.ReactElement {
    const posthog = usePostHog();
    const useCompactWidthLayout = useMediaQuery('(max-width: 900px)');

    const searchProvider = useSearchContext();
    type ResultForRendering = DeepUnpreparedValue<WorkerMessageOutputSearchResult<PapyrusGame, SearchIndexEntityType>['results']>;
    const [result, setResult] = React.useState<typeof EMPTY_QUERY | typeof AWAITING_SEARCH | Error | ResultForRendering>(EMPTY_QUERY);

    const {clear: clearDisplayAwaitingTimeout, start: startDisplayAwaitingTimeout} = useStoredTimeout();
    const {clear: clearTookTooLongInterval, start: startTookTooLongInterval} = useStoredInterval();

    const searchProviderLoadedPromiseRef = React.useRef<{resolve?:null|((res:SearchContextLoaded)=>void),promise: Promise<SearchContextLoaded>}>(null);
    const isLoading = searchProvider.LOADING_FROM_SSR || searchProvider.DEVELOPMENT__LOADING_HASH;
    searchProviderLoadedPromiseRef.current ??= (()=>{
        if (!isLoading) return {promise: Promise.resolve(searchProvider as SearchContextLoaded)};
        let hoistedResolveF: (res:SearchContextLoaded)=>void;
        const promise = new Promise<SearchContextLoaded>((resolve) => {
            hoistedResolveF = (loaded)=> {
                resolve(loaded);
                searchProviderLoadedPromiseRef.current!.resolve = null;
            };
        });
        return {resolve: hoistedResolveF!, promise} as const;
    })();
    if (!isLoading && searchProviderLoadedPromiseRef.current.resolve) searchProviderLoadedPromiseRef.current.resolve(searchProvider as SearchContextLoaded);

    const search = React.useCallback(async function search(query: string) {
        console.log('Searching for', query);

        if (!query) {
            clearDisplayAwaitingTimeout(CLEAR_ANY_TIMER);
            return setResult(EMPTY_QUERY);
        }

        let hasResults = false;

        const newDisplayAwaitingInterval = startDisplayAwaitingTimeout(100, () => {
            if (hasResults) return;
            setResult(AWAITING_SEARCH);
            posthog?.capture('SearchBar rendered awaiting', {game, query});
        });


        clearTookTooLongInterval(CLEAR_ANY_TIMER);

        const startTimeLoadSearchProvider = performance.now();
        const loadedSearchProvider = searchProviderLoadedPromiseRef.current!.resolve ? await searchProviderLoadedPromiseRef.current!.promise : searchProvider as SearchContextLoaded;


        const startTimeForSearch = performance.now();
        startTookTooLongInterval(1000, () => {
            const debugData = {
                game,
                query,
                hasResults,
                search_time: performance.now() - startTimeForSearch,
                search_time_since_query: performance.now() - startTimeLoadSearchProvider,
            };
            console.warn('Search taking too long!', debugData);
            posthog?.capture('Search taking too long', debugData);
        });

        const res = await loadedSearchProvider.search(query, [SearchIndexEntityType.Script, SearchIndexEntityType.Function]);

        hasResults = true;

        const isCurrent = clearDisplayAwaitingTimeout(newDisplayAwaitingInterval);
        if (!isCurrent) return;

        setResult(res);
    }, [startDisplayAwaitingTimeout, clearTookTooLongInterval, searchProvider, startTookTooLongInterval, clearDisplayAwaitingTimeout, posthog, game]);

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => search(e.target.value), [search]);

    // The below chunk is a load of hackery to make sure even the earliest of inputs are counted.
    const onChangeRef = useUpdatedRef(onChange);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        if (searchInputRef.current) onChangeRef.current({target: searchInputRef.current} as React.ChangeEvent<HTMLInputElement>);
    }, [onChangeRef]);

    React.useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.value = '';
            onChangeRef.current({target: searchInputRef.current} as React.ChangeEvent<HTMLInputElement>);
        }
    }, [game, onChangeRef]);

    useEffect(() => {
        if (isLoading) return;
        if (result === AWAITING_SEARCH) return;
        clearTookTooLongInterval(CLEAR_ANY_TIMER);
        if (result === EMPTY_QUERY) return;
        if (result instanceof Error) {
            posthog?.capture('SearchBar rendered error', {game, error: result, inputValue: searchInputRef.current?.value ?? null});
            return;
        }
        posthog?.capture('SearchBar rendered result', {game, result: result.map(res => res.obj.$entityId)});
    }, [isLoading, game, posthog, result, clearTookTooLongInterval]);

    const filtersChildren = <>
        Filters coming soon!
    </>;

    return <>
        <div className={styles.searchModalBodySplitRight1!}>
            <input type="search" placeholder="Search..." onChange={onChange} ref={searchInputRef} />
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchModalSearchIcon!} />
        </div>
        <div className={styles.searchModalBodySplitLeft!}>
            {
                useCompactWidthLayout
                    ? <details className={styles.searchModalFilters!}>
                        <summary>Filters</summary>
                        {filtersChildren}
                    </details>
                    : <div className={styles.searchModalFilters!}>
                        {filtersChildren}
                    </div>
            }
        </div>
        <div className={styles.searchModalBodySplitRight2!}>
            <ul className={styles.searchModalResults!}>
                <GuardEmptyList replacement={<li>No results! Try another query!</li>}>
                    {
                        searchProvider.DEVELOPMENT__LOADING_HASH ? <li>DEVELOPMENT ONLY - Hashing the search index! This may take a second, especially if this is the first time you&rsquo;ve opened this game!</li>
                        : result === EMPTY_QUERY ? <li suppressHydrationWarning>Empty query! Try searching for something...</li>
                        : result === AWAITING_SEARCH ? <li>Search in progress...</li>
                        : result instanceof Error ? <li>Error: <pre><code>{result.stack}</code></pre></li>
                        : result.map(res => {
                            const obj = res.obj;
                            const score = res.score;
                            switch (obj.$entityType) {
                                case SearchIndexEntityType.Script:
                                    return <li key={obj.$entityId}>
                                        <PapyrusScriptReference game={game} scriptAggregate={obj} /> (score: <code>{score}</code>)
                                    </li>;
                                case SearchIndexEntityType.Function:
                                    return <li key={obj.$entityId}>
                                        <PapyrusScriptFunctionReference game={game} scriptAggregate={obj.script} funcAggregate={obj} /> (score: <code>{score}</code>)
                                    </li>;
                                case SearchIndexEntityType.Event:
                                    return <li key={obj.$entityId}>
                                        Event {obj.name} (score: <code>{score}</code>)
                                    </li>;
                                case SearchIndexEntityType.Property:
                                    return <li key={obj.$entityId}>
                                        Property {obj.name} (score: <code>{score}</code>)
                                    </li>;
                                case SearchIndexEntityType.Struct:
                                    return <li key={obj.$entityId}>
                                        Struct {obj.name} (score: <code>{score}</code>)
                                    </li>;
                                default:
                                    throw new UnreachableError(obj, `Unexpected SearchIndexEntity type: ${(obj as SearchIndexEntity<PapyrusGame>).$entityType}`);
                            }
                        })
                    }
                </GuardEmptyList>
            </ul>
        </div>
    </>;
}
