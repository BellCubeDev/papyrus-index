'use client';

import { faBan, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useEffectEvent } from "react";
import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { UnreachableError } from "../../../UnreachableError";
import { memoizeDevServerConst } from "../../../utils/memoizeDevServerConst";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { CLEAR_ANY_TIMER, useStoredInterval } from "../../hooks/useStoredTimeout";
import { SearchIndexEntityType, type SearchIndexEntity } from "../../search/Entity";
import { DeepUnpreparedValue } from "../../search/Preparation";
import type { WorkerMessageOutputSearchResult } from "../../search/SEARCH.worker";
import { useSearchContext, type SearchContextLoaded } from "../../search/SearchProvider";
import { GuardEmptyList } from "../GuardEmptyList";
import { PapyrusScriptFunctionReference } from "../papyrus/function/reference/PapyrusScriptFunctionReference";
import { PapyrusScriptReference } from "../papyrus/script/PapyrusScriptReference";
import styles from './Search.module.scss';
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { MultiBox, type MultiBoxOption, type MultiBoxOptionFilled } from "../form-fields/MultiBox";
import { PapyrusSourceType } from "../../../papyrus/data-structures/pure/scriptSource";
import { useCurrentPostHog } from "@/app/hooks/useCurrentPostHog";

const EMPTY_QUERY: unique symbol = memoizeDevServerConst('<SearchBar> EMPTY_QUERY', ()=>Symbol('<SearchBar> EMPTY_QUERY')) as never;
const AWAITING_SEARCH: unique symbol = memoizeDevServerConst('<SearchBar> AWAITING_SEARCH', ()=>Symbol('<SearchBar> AWAITING_SEARCH')) as never;

const ENTITY_TYPE_FILTER_OPTIONS = [
    { value: SearchIndexEntityType.Script, key: SearchIndexEntityType.Script, displayNode: 'Scripts' },
    { value: SearchIndexEntityType.Function, key: SearchIndexEntityType.Function, displayNode: 'Functions' },
    //{ value: SearchIndexEntityType.Event, key: SearchIndexEntityType.Event, displayNode: 'Events' },
    //{ value: SearchIndexEntityType.Property, key: SearchIndexEntityType.Property, displayNode: 'Properties' },
    //{ value: SearchIndexEntityType.Struct, key: SearchIndexEntityType.Struct, displayNode: 'Structs' },
] satisfies MultiBoxOption[];

const SOURCE_TYPE_FILTER_OPTIONS = Object.entries(PapyrusSourceType).map(([key, value]) => ({
    value,
    key,
    displayNode: value,
})) satisfies MultiBoxOption[];

function orDefaultIfEmpty<T>(arr: null | undefined | readonly T[], defaultIfEmpty: readonly T[]): readonly T[] {
    if (!arr || arr.length === 0) return defaultIfEmpty;
    return arr;
}

export default function SearchBar({game}: {readonly game: PapyrusGame}): React.ReactElement {
    const posthog = useCurrentPostHog();
    const useCompactWidthLayout = useMediaQuery('(max-width: 900px)', false);

    const searchProvider = useSearchContext();
    type ResultForRendering = DeepUnpreparedValue<WorkerMessageOutputSearchResult<PapyrusGame, SearchIndexEntityType>['results']>;
    const [result, setResult] = React.useState<typeof EMPTY_QUERY | typeof AWAITING_SEARCH | Error | ResultForRendering>(EMPTY_QUERY);

    const [hasText, setHasText] = React.useState(false);

    const tookTooLongInterval = useStoredInterval();

    const isLoading = searchProvider.LOADING_FROM_SSR || searchProvider.DEVELOPMENT__LOADING_HASH;
    const searchProviderLoadedPromiseRef = React.useRef<{resolve?:null|((res:SearchContextLoaded)=>void),promise: Promise<SearchContextLoaded>}>(
        (()=>{
            if (!isLoading) return {promise: Promise.resolve(searchProvider as SearchContextLoaded)};
            let hoistedResolveF: (res:SearchContextLoaded)=>void;
            const promise = new Promise<SearchContextLoaded>((resolve) => {
                hoistedResolveF = (loaded)=> {
                    resolve(loaded);
                    searchProviderLoadedPromiseRef.current!.resolve = null;
                };
            });
            return {resolve: hoistedResolveF!, promise} as const;
        })()
    );

    const resolveSearchProviderLoadedPromise = useEffectEvent(()=> {
        if (searchProviderLoadedPromiseRef.current.resolve) searchProviderLoadedPromiseRef.current.resolve(searchProvider as SearchContextLoaded);
    });

    useEffect(() => {
        if (!isLoading) resolveSearchProviderLoadedPromise();
    }, [isLoading, searchProvider]);




    const [filterEntityTypes, setFilterEntityTypes] = React.useState<readonly MultiBoxOptionFilled<typeof ENTITY_TYPE_FILTER_OPTIONS[number]>[]>([]);
    const [filterSourceTypes, setFilterSourceTypes] = React.useState<readonly MultiBoxOptionFilled<typeof SOURCE_TYPE_FILTER_OPTIONS[number]>[]>([]);

    const filter = {
        entityTypes: orDefaultIfEmpty(filterEntityTypes, ENTITY_TYPE_FILTER_OPTIONS).map(o => o.value as SearchIndexEntityType),
        sourceTypes: orDefaultIfEmpty(filterSourceTypes, SOURCE_TYPE_FILTER_OPTIONS).map(o => o.value as PapyrusSourceType),
    };

    const filtersChildren = <>
        <MultiBox options={ENTITY_TYPE_FILTER_OPTIONS} onChange={setFilterEntityTypes}>Entity Types</MultiBox>
        <MultiBox options={SOURCE_TYPE_FILTER_OPTIONS} onChange={setFilterSourceTypes}>Source Types</MultiBox>
        <p><i>More filters to come!</i></p>
    </>;




    // eslint-disable-next-line func-style -- declaring as a const allows TypeScript and React Compiler to do smarter inference
    const searchPassable = async function searchPassable(query: string) {
        console.log('Searching for', query);
        setHasText(query !== '');

        if (!query) return setResult(EMPTY_QUERY);

        setResult(AWAITING_SEARCH);

        let hasResults = false;

        const startTimeLoadSearchProvider = performance.now();
        const loadedSearchProvider = searchProviderLoadedPromiseRef.current!.resolve ? await searchProviderLoadedPromiseRef.current!.promise : searchProvider as SearchContextLoaded;

        const startTimeForSearch = performance.now();
        const newTookTooLongInterval = tookTooLongInterval.start(3000, () => {
            const debugData = {
                game,
                query,
                hasResults,
                search_time: performance.now() - startTimeForSearch,
                search_time_since_query: performance.now() - startTimeLoadSearchProvider,
            };
            console.warn('Search taking too long!', debugData);
            posthog.capture?.('Search taking too long', debugData);
        });

        // debounce
        await new Promise(resolve => setTimeout(resolve, 250)); // this can sometimes be 3x as long as the search itself! The things we do to make the UI feel snappier...
        if (!tookTooLongInterval.isCurrent(newTookTooLongInterval)) return;

        const res = await loadedSearchProvider.search(query, filter);

        hasResults = true;

        const isCurrent = tookTooLongInterval.clear(newTookTooLongInterval);
        if (!isCurrent) return;

        setResult(res);
    };
    const search = useEffectEvent(searchPassable);

    const onChangePassable = (e: React.ChangeEvent<HTMLInputElement>) => searchPassable(e.target.value);
    const onChange = useEffectEvent((e: React.ChangeEvent<HTMLInputElement>) => search(e.target.value));

    // Make search gets run any time anything changes
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        if (searchInputRef.current) onChange({target: searchInputRef.current} as React.ChangeEvent<HTMLInputElement>);
    }, [filter]);

    React.useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.value = '';
            onChange({target: searchInputRef.current} as React.ChangeEvent<HTMLInputElement>);
        }
    }, [game]);

    const clearSearch = () => {
        setResult(EMPTY_QUERY);
        setHasText(false);
        const searchInput = searchInputRef.current;
        if (searchInput) searchInput.value = '';
        tookTooLongInterval.clear(CLEAR_ANY_TIMER);
    };

    useEffect(() => {
        if (isLoading) return;
        if (result === AWAITING_SEARCH) return;
        tookTooLongInterval.clear(CLEAR_ANY_TIMER);
        if (result === EMPTY_QUERY) return;
        if (result instanceof Error) {
            posthog.capture?.('SearchBar rendered error', {game, error: result, inputValue: searchInputRef.current?.value ?? null});
            return;
        }
        posthog.capture?.('SearchBar rendered result', {game, result: result.map(res => res.obj.$entityId)});
    }, [isLoading, game, posthog, result, tookTooLongInterval]);

    const searchResultsULRef = React.useRef<HTMLUListElement>(null);

    const prefersReducedMotion = usePrefersReducedMotion();

    const focusSearchResults = () => {
        const searchResultsUL = searchResultsULRef.current;
        if (!searchResultsUL) return;
        const firstChild = searchResultsUL.firstElementChild as HTMLLIElement | null;
        if (!firstChild) return;
        firstChild.scrollIntoView({behavior: prefersReducedMotion ? 'instant' : 'smooth', block: 'nearest', inline: 'nearest'});
        firstChild.focus({preventScroll: true});
    };

    const focusSearchResultsOnEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            focusSearchResults();
        }
    };

    return <>
        <div className={styles.searchModalBodySplitRight1!}>
            <input type="search" placeholder="Search..."
                enterKeyHint="search"
                ref={searchInputRef}
                onChange={onChangePassable}
                onKeyUp={focusSearchResultsOnEnter}
                data-autofocus
            />
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchModalSearchIcon!} />
            <button type='reset' onClick={clearSearch} hidden={!hasText} className={styles.searchModalCancelButton!}><FontAwesomeIcon icon={faBan} /></button>
        </div>
        <div className={styles.searchModalBodySplitLeft!}>
            {
                useCompactWidthLayout
                    ? <details className={styles.searchModalFilters!}>
                        <summary>Filters</summary>
                        {filtersChildren}
                    </details>
                    : <div className={styles.searchModalFilters!}>
                        <h3>Filters</h3>
                        {filtersChildren}
                    </div>
            }
        </div>
        <div className={styles.searchModalBodySplitRight2!}>
            <ul className={styles.searchModalResults!} ref={searchResultsULRef}>
                <GuardEmptyList replacement={<li>No results! Try another query!</li>}>
                    {
                        searchProvider.DEVELOPMENT__LOADING_HASH ? <li tabIndex={-1}>DEVELOPMENT ONLY - Hashing the search index! This may take a second, especially if this is the first time you&rsquo;ve opened this game!</li>
                        : result === EMPTY_QUERY ? <li suppressHydrationWarning tabIndex={-1}>Empty query! Try searching for something...</li>
                        : result === AWAITING_SEARCH ? <li tabIndex={-1}>Search in progress...</li>
                        : result instanceof Error ? <li tabIndex={-1}>Error: <pre><code>{result.stack}</code></pre></li>
                        : result.map((res, i) => {
                            const obj = res.obj;
                            const score = res.score;
                            switch (obj.$entityType) {
                                case SearchIndexEntityType.Script:
                                    return <li key={obj.$entityId} tabIndex={i === 0 ? -1 : undefined}>
                                        <PapyrusScriptReference game={game} scriptAggregate={obj} /> (score: <code>{score}</code>)
                                    </li>;
                                case SearchIndexEntityType.Function:
                                    return <li key={obj.$entityId} tabIndex={i === 0 ? -1 : undefined}>
                                        <PapyrusScriptFunctionReference game={game} scriptAggregate={obj.script} funcAggregate={obj} /> (score: <code>{score}</code>)
                                    </li>;
                                case SearchIndexEntityType.Event:
                                    return <li key={obj.$entityId} tabIndex={i === 0 ? -1 : undefined}>
                                        Event {obj.name} (score: <code>{score}</code>)
                                    </li>;
                                case SearchIndexEntityType.Property:
                                    return <li key={obj.$entityId} tabIndex={i === 0 ? -1 : undefined}>
                                        Property {obj.name} (score: <code>{score}</code>)
                                    </li>;
                                case SearchIndexEntityType.Struct:
                                    return <li key={obj.$entityId} tabIndex={i === 0 ? -1 : undefined}>
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
