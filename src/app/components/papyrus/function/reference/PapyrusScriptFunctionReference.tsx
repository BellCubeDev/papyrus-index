import { type ComponentProps } from "react";
import type { PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { UnreachableError } from "../../../../../UnreachableError";
import { getBestStringVariant } from "../../../../../utils/getBestName";
import { prepareUrlParts } from "../../../../../utils/prepareUrlParts";
import { InternalLink } from "../../../Link";
import { Tooltip } from "../../../tooltip/Tooltip";
import { getScriptNameFromProps, PapyrusScriptReference } from "../../script/PapyrusScriptReference";
import styles from './PapyrusScriptFunctionReference.module.scss';
import { PapyrusScriptFunctionReferenceTooltip } from "./PapyrusScriptFunctionReferenceTooltip";

const TAKES_PARAMETERS_INDICATOR = <span className={styles.paramsIndicator} aria-label="takes parameters">...</span>;

export function PapyrusScriptFunctionReference<TGame extends PapyrusGame>(propsObj: ComponentProps<typeof PapyrusScriptReference> & (
    | {readonly func: PapyrusScriptFunctionIndexed<TGame>, readonly funcAggregate?: undefined}
    | {readonly func?: undefined, readonly funcAggregate: PapyrusScriptFunctionIndexedAggregate<TGame>}
)): React.ReactNode {
    const {game, func, funcAggregate, inTooltip} = propsObj;
    const scriptName = getScriptNameFromProps(propsObj);
    if (func) {
        const parameterElement = <>({func.parameters.length > 0 ? TAKES_PARAMETERS_INDICATOR: null})</>;
        return <span className={styles.reference}>
            <PapyrusScriptReference {...propsObj} />
            .
            { inTooltip
                ? <>
                    <span className={styles.functionName}>{func.name}</span>
                    {parameterElement}
                </>
                : <Tooltip role='tooltip' tooltipContents={<PapyrusScriptFunctionReferenceTooltip {...propsObj} />}>
                    <InternalLink className={styles.functionName} href={prepareUrlParts(game, 'script', scriptName, 'function', func.name)} data-ref=''>
                        {func.name}
                    </InternalLink>
                    {parameterElement}
                </Tooltip> }

        </span>;
    } else if (funcAggregate) {
        const funcName = getBestStringVariant(funcAggregate.name)![1];
        const parameterElement = <>({funcAggregate.parameters.length > 0 ? TAKES_PARAMETERS_INDICATOR: null})</>;
        return <span className={styles.reference}>
            <PapyrusScriptReference {...propsObj} />
            .
            { inTooltip
                ? <>
                    <span className={styles.functionName}>{funcName}</span>
                    {parameterElement}
                </>
                : <Tooltip role='tooltip' tooltipContents={<PapyrusScriptFunctionReferenceTooltip {...propsObj} />}>
                    <InternalLink className={styles.functionName} href={prepareUrlParts(game, 'script', scriptName, 'function', funcName)} data-ref=''>
                        {funcName}
                    </InternalLink>
                    {parameterElement}
                </Tooltip> }
        </span>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReference> component!');
    }

}
