import type { PapyrusFeature, PapyrusFeatureSupportedGames } from "@/papyrus/feature-support";
import type { PapyrusScriptStructIndexed } from "../../../../papyrus/data-structures/indexing/struct";
import { UnknownPapyrusScriptStruct } from "../../../../papyrus/data-structures/indexing/type";
import styles from './PapyrusStructReference.module.scss';

export function PapyrusStructReferenceTooltip(propsObj: {readonly struct: PapyrusScriptStructIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs>>, readonly possibleStructs?: undefined} | {readonly possibleStructs: typeof UnknownPapyrusScriptStruct | Record<Lowercase<string>, PapyrusScriptStructIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs>>>, readonly struct?: undefined}) {
    const {struct, possibleStructs} = propsObj;
    if (struct) {
        return <div className={styles.tooltip}>
            {struct.name}
        </div>;
    } else if (possibleStructs) {
        if (possibleStructs === UnknownPapyrusScriptStruct) {
            return <div className={styles.tooltip}>
                This script is not included in the Papyrus Index. It is likely from a mod that is not indexed, or the script was not deemed relevant to the index. If you believe this is a mistake, please contact BellCube!
            </div>;
        }
        return <div className={styles.tooltip}>
            {Object.values(possibleStructs).map(s=>s.name).join(', ')}
        </div>;
    }
}
