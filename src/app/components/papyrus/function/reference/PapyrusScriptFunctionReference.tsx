import type { ComponentProps } from "react";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { UnreachableError } from "../../../../../UnreachableError";
import { getBestName } from "../../../../../utils/getBestName";
import { Tooltip } from "../../../tooltip/Tooltip";
import { getScriptNameFromProps, PapyrusScriptReference } from "../../script/PapyrusScriptReference";
import styles from './PapyrusScriptFunctionReference.module.scss';
import { PapyrusScriptFunctionReferenceTooltip } from "./PapyrusScriptFunctionReferenceTooltip";
import type { PapyrusScriptFunctionIndexed } from "../../../../../papyrus/data-structures/indexing/function";
import { Link } from "../../../Link";
import { toLowerCase } from "../../../../../utils/toLowerCase";

export function PapyrusScriptFunctionReference<TGame extends PapyrusGame>(propsObj: ComponentProps<typeof PapyrusScriptReference> & (
    | {readonly func: PapyrusScriptFunctionIndexed<TGame>, readonly funcAggregate?: undefined, readonly possibleFunctions?: undefined}
    //| {readonly func?: undefined, readonly funcAggregate: PapyrusScriptFunctionIndexedAggregate<TGame>, readonly possibleFunctions?: undefined}
    | {readonly func?: undefined, readonly funcAggregate?: undefined, readonly possibleFunctions: [Lowercase<string>[], PapyrusScriptFunctionIndexed<TGame>][]}
)): React.ReactNode {
    const {game, func, funcAggregate, possibleFunctions, inTooltip} = propsObj;
    const scriptName = getScriptNameFromProps(propsObj);
    if (func) {
        return <>
            <PapyrusScriptReference {...propsObj} />
            { inTooltip
                ? <span className={styles.reference}>{func.name}</span>
                : <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusScriptFunctionReferenceTooltip {...propsObj} />}>
                    <Link href={`/${toLowerCase(game)}/script/${toLowerCase(scriptName)}/function/${toLowerCase(func.name)}` as const}>
                        {func.name}
                    </Link>
                </Tooltip> }
            ()
        </>;
    } else if (funcAggregate) {
        throw new Error('The PapyrusScriptFunctionReference component does not yet implement the funcAggregate prop!');
        //return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusScriptFunctionReferenceTooltip scriptAggregate={scriptAggregate} />}>
        //    <Link href={`/${toLowerCase(game)}/script/${toLowerCase(scriptAggregate.name[0]![1])}` as const}>
        //        {getBestNameVariant(scriptAggregate.name)[1]}
        //    </Link>
        //</Tooltip>;
    } else if (possibleFunctions) {
        const funcName = getBestName(possibleFunctions.map(([_, f]) => f.name))!;
        return <>
            <PapyrusScriptReference {...propsObj} />
            .

            { inTooltip
                ? <span className={styles.reference}>{funcName}</span>
                : <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusScriptFunctionReferenceTooltip {...propsObj} />}>
                    <Link href={`/${toLowerCase(game)}/script/${toLowerCase(scriptName)}/function/${toLowerCase(funcName)}` as const}>
                        {funcName}
                    </Link>
                </Tooltip> }
            ()
        </>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReference> component!');
    }

}
