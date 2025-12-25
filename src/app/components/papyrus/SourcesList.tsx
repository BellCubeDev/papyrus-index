import { use } from "react";
import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { getSourceTypeMultiplier } from "../../../utils/getSourceTypeMultiplier";
import { prepareUrlParts } from "../../../utils/prepareUrlParts";
import type { WorkerMessageOutputSearchIndexReady } from "../../search/SEARCH.worker";
import { useSearchContext, type SearchContextLoaded } from "../../search/SearchProvider";
import { InternalLink } from "../Link";
import { SourceIcon } from "./SourceIcon";
import { SourceName } from "./SourceName";
import styles from './SourcesList.module.scss';
import type { PapyrusScriptSourceIndexedNoScriptsProp } from "../../../papyrus/data-structures/indexing/scriptSource";

function useLoadSourceListOnServer(game: PapyrusGame) {
    const importedModule = use(import(typeof window !== 'undefined' ? '@/empty' : "../../../papyrus/indexing/index-all") as Promise<typeof import("../../../papyrus/indexing/index-all")>);
    return importedModule.AllScriptsIndexed[game].scriptSources;
}

function useLoadSourceListOnClient() {
    const searchContext = useSearchContext();
    if (searchContext.LOADING_FROM_SSR || searchContext.DEVELOPMENT__LOADING_HASH) {
        console.warn("Search context is not ready yet, but tried to useLoadSourceListOnClient()!");
        return null as never;
    }
    return use((searchContext as SearchContextLoaded).sources);
}

// On server, use a pseudo-hook that just loads the sources list directly. On client, use a real hook that uses the search context.
// By doing a dependency injection here, we can avoid having to call useSyncExternalStore, which would cause excessive re-renders
// and cause issues with the search context not being ready before we tried to use it.
const useLoadSourceList: (game: PapyrusGame) => WorkerMessageOutputSearchIndexReady['sources'] =
    typeof window === 'undefined' ? useLoadSourceListOnServer : useLoadSourceListOnClient;

/** This component is a hack to make React load the sources list promise */
export function SourceListUser({game}: {readonly game: PapyrusGame}) {
    useLoadSourceList(game);
    return null;
}

export function sourcesSortFn(a: PapyrusScriptSourceIndexedNoScriptsProp<PapyrusGame>, b: PapyrusScriptSourceIndexedNoScriptsProp<PapyrusGame>) {
    return getSourceTypeMultiplier(b.type) - getSourceTypeMultiplier(a.type);
}

export function SourcesList({sourceIDs, game}: {readonly sourceIDs: Lowercase<string> | Lowercase<string>[], readonly game: PapyrusGame}) {
    sourceIDs = Array.isArray(sourceIDs) ? sourceIDs : [sourceIDs];

    const sources = useLoadSourceList(game);
    const sourceObjects = sourceIDs.map(sourceID => sources[sourceID]!).sort(sourcesSortFn);

    return <ul className={styles.sourcesList}>
        <span>Found in:</span>
        {sourceObjects.map(source => <li key={source.sourceIdentifier}>
            <SourcePlate sourceId={source.sourceIdentifier} game={game} />
        </li>)}
    </ul>;
}

export function SourcePlate({sourceId, game, className, noLink}: {readonly sourceId: Lowercase<string>, readonly game: PapyrusGame, readonly className?: string, readonly noLink?: boolean}) {
    const sources = useLoadSourceList(game);
    const source = sources[sourceId];
    if (!source) return null;

    const children = <>
        <SourceIcon sourceType={source.type} />
        <SourceName source={source} />
    </>;
    const classNamesCombined = [styles.sourcePlate, className].filter(Boolean).join(' ');
    if (noLink) {
        return <div className={classNamesCombined}>
            {children}
        </div>;
    } else {
    return <InternalLink href={prepareUrlParts(game, 'source', source.sourceIdentifier)} className={classNamesCombined} data-no-link-style>
        {children}
    </InternalLink>;
    }
}
