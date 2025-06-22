import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { SourceName } from "./SourceName";
import styles from './SourcesList.module.scss';
import { SourceIcon } from "./SourceIcon";
import { Link } from "../Link";
import { toLowerCase } from "../../../utils/toLowerCase";
import { getSourceTypeMultiplier } from "../../../utils/getSourceTypeMultiplier";
import { useSearchContext, type SearchContextLoaded } from "../../search/SearchProvider";
import type { WorkerMessageOutputSearchIndexReady } from "../../search/SEARCH.worker";
import { use } from "react";

async function loadSourceListOnServer(game: PapyrusGame) {
    return (await import(typeof window !== 'undefined' ? '@/empty' : "../../../papyrus/indexing/index-all")).AllScriptsIndexed[game].scriptSources;
}

function useLoadSourceListOnClient() {
    const searchContext = useSearchContext();
    if (searchContext.LOADING_FROM_SSR || searchContext.DEVELOPMENT__LOADING_HASH) return null as never;
    return use((searchContext as SearchContextLoaded).sources);
}

function useLoadSourceList(game: PapyrusGame): WorkerMessageOutputSearchIndexReady['sources'] {
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/rules-of-hooks
    return typeof window === 'undefined' ? use(loadSourceListOnServer(game)) : useLoadSourceListOnClient();
}

/** This component is a hack to make React load the sources list promise */
export function SourceListUser({game}: {readonly game: PapyrusGame}) {
    useLoadSourceList(game);
    return null;
}

export function SourcesList({sourceIDs, game}: {readonly sourceIDs: Lowercase<string> | Lowercase<string>[], readonly game: PapyrusGame}) {
    sourceIDs = Array.isArray(sourceIDs) ? sourceIDs : [sourceIDs];

    const sources = useLoadSourceList(game);
    const sourceObjects = sourceIDs.map(sourceID => sources[sourceID]!).sort((a, b) => getSourceTypeMultiplier(b.type) - getSourceTypeMultiplier(a.type));

    return <ul className={styles.sourcesList}>
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
    return <Link href={`/${toLowerCase(game)}/source/${source.sourceIdentifier}` as const} className={classNamesCombined} data-no-link-style>
        {children}
    </Link>;
    }
}
