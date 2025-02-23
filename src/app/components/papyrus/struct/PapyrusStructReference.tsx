import type { PapyrusScriptIndexed } from "../../../../papyrus/data-structures/indexing/script";
import type { PapyrusScriptStructIndexed } from "../../../../papyrus/data-structures/indexing/struct";
import { UnknownPapyrusScriptStruct } from "../../../../papyrus/data-structures/indexing/type";
import type { PapyrusGame } from "../../../../papyrus/data-structures/pure/game";
import { UnreachableError } from "../../../../UnreachableError";
import { getBestName } from "../../../../utils/getBestName";
import { Tooltip } from "../../tooltip/Tooltip";
import { PapyrusStructReferenceTooltip } from "./PapyrusScriptReferenceTooltip";
import styles from './PapyrusStructReference.module.scss';

export function PapyrusStructReference<TGame extends PapyrusGame>(propsObj: {inTooltip?: boolean} & (
    | {readonly struct: PapyrusScriptStructIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>, readonly possibleStructs?: undefined}
    | {readonly possibleStructs: typeof UnknownPapyrusScriptStruct | Record<Lowercase<string>, PapyrusScriptStructIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>>, readonly struct?: undefined})) {
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
        if (inTooltip) return <span className={styles.reference}>{getBestName(Object.values(possibleStructs).map(s=>s.name))}</span>;
        return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusStructReferenceTooltip possibleStructs={possibleStructs} />}>
            {getBestName(Object.values(possibleStructs).map(s=>s.name))}
        </Tooltip>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReference> component!');
    }

}
