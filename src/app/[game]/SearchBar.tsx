'use client';

import React, { type HTMLInputTypeAttribute } from "react";
import type { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import { UnreachableError } from "../../UnreachableError";
import { memoizeDevServerConst } from "../../utils/memoizeDevServerConst";
import { GuardEmptyList } from "../components/GuardEmptyList";
import { PapyrusScriptFunctionReference } from "../components/papyrus/function/reference/PapyrusScriptFunctionReference";
import { PapyrusScriptReference } from "../components/papyrus/script/PapyrusScriptReference";
import { SearchIndexEntityType, type SearchIndexEntity } from "../search/Entity";
import { DeepUnpreparedValue } from "../search/Preparation";
import type { WorkerMessageOutputSearchResult } from "../search/SEARCH.worker";
import { useSearchContext, type SearchContextLoaded } from "../search/SearchProvider";
import { useUpdatedRef } from "../hooks/useUpdatedRef";

const EMPTY_QUERY: unique symbol = memoizeDevServerConst('<SearchBar> EMPTY_QUERY', ()=>Symbol('<SearchBar> EMPTY_QUERY')) as any;
const AWAITING_SEARCH: unique symbol = memoizeDevServerConst('<SearchBar> AWAITING_SEARCH', ()=>Symbol('<SearchBar> AWAITING_SEARCH')) as any;

export default function SearchBar({game}: {readonly game: PapyrusGame}): React.ReactElement {
    const searchProvider = useSearchContext();
    type ResultForRendering = DeepUnpreparedValue<WorkerMessageOutputSearchResult<PapyrusGame, SearchIndexEntityType>['results']>;
    const [result, setResult] = React.useState<typeof EMPTY_QUERY | typeof AWAITING_SEARCH | Error | ResultForRendering>(EMPTY_QUERY);

    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const searchProviderLoadedPromiseRef = React.useRef<{resolve?:(res:SearchContextLoaded)=>void,promise: Promise<SearchContextLoaded>}>(null);
    const isLoading = searchProvider.LOADING_FROM_SSR || searchProvider.DEVELOPMENT__LOADING_HASH;
    searchProviderLoadedPromiseRef.current ??= (()=>{
        if (!isLoading) return {promise: Promise.resolve(searchProvider as SearchContextLoaded)};
        let hoistedResolveF: (res:SearchContextLoaded)=>void;
        const promise = new Promise<SearchContextLoaded>((resolve) => {
            hoistedResolveF = (loaded)=> {
                resolve(loaded);
                delete searchProviderLoadedPromiseRef.current!.resolve;
            };
        });
        return {resolve: hoistedResolveF!, promise} as const;
    })();
    if (!isLoading && searchProviderLoadedPromiseRef.current.resolve) searchProviderLoadedPromiseRef.current.resolve(searchProvider as SearchContextLoaded);


    const search = React.useCallback(async function search(query: string) {
        console.log('Searching for', query);
        const oldTimeout = timeoutRef.current;
        if (oldTimeout) clearTimeout(oldTimeout);
        if (!query) {
            timeoutRef.current = null;
            return setResult(EMPTY_QUERY);
        }
        let hasResults = false;
        const newTimeout = setTimeout(() => {
            if (!hasResults) setResult(AWAITING_SEARCH);
        }, 100);
        timeoutRef.current = newTimeout;
        const searchProviderLoaded = searchProviderLoadedPromiseRef.current!.resolve ? await searchProviderLoadedPromiseRef.current!.promise : searchProvider as SearchContextLoaded;
        const res = await searchProviderLoaded.search(query, [SearchIndexEntityType.Script, SearchIndexEntityType.Function]);
        hasResults = true;
        clearTimeout(newTimeout);
        if (timeoutRef.current !== newTimeout) return;
        timeoutRef.current = null;
        setResult(res);
    }, [searchProvider]);

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => search(e.target.value), [search]);

    // The below chunk is a load of hackery to make sure even the earliest of inputs are counted.
    const onChangeRef = useUpdatedRef(onChange);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        if (searchInputRef.current) onChangeRef.current({target: searchInputRef.current} as React.ChangeEvent<HTMLInputElement>);
    }, [onChangeRef]);

    return <div>
        <input type="search" placeholder="Search..." onChange={onChange} ref={searchInputRef} />
        <ul suppressHydrationWarning>
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
    </div>;
}
