import { type ComponentProps } from "react";
import type { PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { UnreachableError } from "../../../../../UnreachableError";
import { getBestStringVariant } from "../../../../../utils/getBestName";
import { toLowerCase } from "../../../../../utils/toLowerCase";
import { Link } from "../../../Link";
import { Tooltip } from "../../../tooltip/Tooltip";
import { getScriptNameFromProps, PapyrusScriptReference } from "../../script/PapyrusScriptReference";
import styles from './PapyrusScriptFunctionReference.module.scss';
import { PapyrusScriptFunctionReferenceTooltip } from "./PapyrusScriptFunctionReferenceTooltip";

export function PapyrusScriptFunctionReference<TGame extends PapyrusGame>(propsObj: ComponentProps<typeof PapyrusScriptReference> & (
    | {readonly func: PapyrusScriptFunctionIndexed<TGame>, readonly funcAggregate?: undefined}
    | {readonly func?: undefined, readonly funcAggregate: PapyrusScriptFunctionIndexedAggregate<TGame>}
)): React.ReactNode {
    const {game, func, funcAggregate, inTooltip} = propsObj;
    const scriptName = getScriptNameFromProps(propsObj);
    if (func) {
        const parameterElement = <>({func.parameters.length > 0 ? <span className={styles.paramsIndicator}>...</span>: ''})</>;
        return <span className={styles.reference}>
            <PapyrusScriptReference {...propsObj} />
            .
            { inTooltip
                ? <>
                    <span className={styles.functionName}>{func.name}</span>
                    {parameterElement}
                </>
                : <Tooltip role='tooltip' tooltipContents={<PapyrusScriptFunctionReferenceTooltip {...propsObj} />}>
                    <Link className={styles.functionName} href={`/${toLowerCase(game)}/script/${toLowerCase(scriptName)}/function/${toLowerCase(func.name)}` as const} data-ref=''>
                        {func.name}
                    </Link>
                    {parameterElement}
                </Tooltip> }

        </span>;
    } else if (funcAggregate) {
        const funcName = getBestStringVariant(funcAggregate.name)![1];
        const parameterElement = <>({funcAggregate.parameters.length ? <span className={styles.paramsIndicator}>...</span>: ''})</>;
        return <span className={styles.reference}>
            <PapyrusScriptReference {...propsObj} />
            .
            { inTooltip
                ? <>
                    <span className={styles.functionName}>{funcName}</span>
                    {parameterElement}
                </>
                : <Tooltip role='tooltip' tooltipContents={<PapyrusScriptFunctionReferenceTooltip {...propsObj} />}>
                    <Link className={styles.functionName} href={`/${toLowerCase(game)}/script/${toLowerCase(scriptName)}/function/${toLowerCase(funcName)}` as const} data-ref=''>
                        {funcName}
                    </Link>
                    {parameterElement}
                </Tooltip> }
        </span>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReference> component!');
    }

}
