import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { AllScriptsIndexed } from "../../../papyrus/indexing/index-all";
import { SourceName } from "./SourceName";
import styles from './SourcesList.module.scss';
import { SourceIcon } from "./SourceIcon";
import { Link } from "../Link";
import { toLowerCase } from "../../../utils/toLowerCase";
import { getSourceTypeMultiplier } from "../../../utils/getSourceTypeMultiplier";

export function SourcesList({sourceIDs, game}: {readonly sourceIDs: Lowercase<string>[], readonly game: PapyrusGame}) {
    const sourceObjects = sourceIDs.map(sourceID => AllScriptsIndexed[game].scriptSources[sourceID]!).sort((a, b) => getSourceTypeMultiplier(b.type) - getSourceTypeMultiplier(a.type));
    return <ul className={styles.sourcesList}>
        {sourceObjects.map(source =><li key={source.sourceIdentifier}>
            <Link href={`/${toLowerCase(game)}/source/${toLowerCase(source.sourceIdentifier)}` as const}>
                <SourceIcon sourceType={source.type} />
                <SourceName source={source} />
            </Link>
        </li>)}
    </ul>;
}
