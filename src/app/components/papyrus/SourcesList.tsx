import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { AllScriptsIndexed } from "../../../papyrus/indexing/index-all";
import { SourceName } from "./SourceName";
import styles from './SourcesList.module.scss';
import { PapyrusSourceType } from "../../../papyrus/data-structures/pure/scriptSource";
import { SourceIcon } from "./SourceIcon";
import { Link } from "../Link";
import { toLowerCase } from "../../../utils/toLowerCase";

function getSourcePriority(source: {type: PapyrusSourceType}) {
    switch (source.type) {
        case PapyrusSourceType.Vanilla:
            return 100;
        case PapyrusSourceType.xSE:
            return 90;
        case PapyrusSourceType.xSePluginExtender:
            return 80;
        case PapyrusSourceType.PapyrusLib:
            return 60;
        case PapyrusSourceType.xSePluginIncidental:
            return 40;
        case PapyrusSourceType.Standalone:
            return 20;
    }
}

export function SourcesList({sourceIDs, game}: {readonly sourceIDs: Lowercase<string>[], readonly game: PapyrusGame}) {
    const sourceObjects = sourceIDs.map(sourceID => AllScriptsIndexed[game].scriptSources[sourceID]!).sort((a, b) => getSourcePriority(b) - getSourcePriority(a));
    return <ul className={styles.sourcesList}>
        {sourceObjects.map(source =><li key={source.sourceIdentifier}>
            <Link href={`/${toLowerCase(game)}/${toLowerCase(source.sourceIdentifier)}` as const}>
                <SourceIcon sourceType={source.type} />
                <SourceName source={source} />
            </Link>
        </li>)}
    </ul>;
}
