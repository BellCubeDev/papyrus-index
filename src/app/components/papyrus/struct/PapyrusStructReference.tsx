import type { PapyrusFeature, PapyrusFeatureSupportedGames } from "@/papyrus/feature-support";
import type { PapyrusScriptStructIndexed } from "../../../../papyrus/data-structures/indexing/struct";
import { UnknownPapyrusScriptStruct } from "../../../../papyrus/data-structures/indexing/type";
import { UnreachableError } from "../../../../UnreachableError";
import { getBestString } from "../../../../utils/getBestName";
import { Tooltip } from "../../tooltip/Tooltip";
import { PapyrusStructReferenceTooltip } from "./PapyrusScriptReferenceTooltip";
import styles from './PapyrusStructReference.module.scss';

export function PapyrusStructReference(propsObj: {inTooltip?: boolean|undefined} & (
    | {readonly struct: PapyrusScriptStructIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs>>, readonly possibleStructs?: undefined}
    | {readonly possibleStructs: typeof UnknownPapyrusScriptStruct | Record<Lowercase<string>, PapyrusScriptStructIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs>>>, readonly struct?: undefined})) {
    const {inTooltip, struct, possibleStructs} = propsObj;
    if (struct) {
        if (inTooltip) return <span className={styles.reference}>{struct.name}</span>;
        return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusStructReferenceTooltip struct={struct} />}>
            {struct.name}
        </Tooltip>;
    } else if (possibleStructs) {
        if (possibleStructs === UnknownPapyrusScriptStruct) {
            if (inTooltip) return <span className={styles['reference--unknown']}>[Unknown script]</span>;
            return <Tooltip role='tooltip' wrapperClassName={styles['reference--unknown']} tooltipContents={<PapyrusStructReferenceTooltip possibleStructs={possibleStructs} />}>
                [Unknown script]
            </Tooltip>;
        }
        if (inTooltip) return <span className={styles.reference}>{getBestString(Object.values(possibleStructs).map(s=>s.name))}</span>;
        return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusStructReferenceTooltip possibleStructs={possibleStructs} />}>
            {getBestString(Object.values(possibleStructs).map(s=>s.name))}
        </Tooltip>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReference> component!');
    }

}
