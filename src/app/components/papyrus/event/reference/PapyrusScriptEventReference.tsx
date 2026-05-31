import { type ComponentProps } from "react";
import type { PapyrusScriptEventOrBaseFunctionIndexed, PapyrusScriptEventOrBaseFunctionIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { UnreachableError } from "../../../../../UnreachableError";
import { getBestStringVariant } from "../../../../../utils/getBestName";
import { prepareUrlParts } from "../../../../../utils/prepareUrlParts";
import { InternalLink } from "../../../Link";
import { Tooltip } from "../../../tooltip/Tooltip";
import { getScriptNameFromProps, PapyrusScriptReference } from "../../script/PapyrusScriptReference";
import styles from './PapyrusScriptEventReference.module.scss';
import { PapyrusScriptEventReferenceTooltip } from "./PapyrusScriptEventReferenceTooltip";

const TAKES_PARAMETERS_INDICATOR = <span className={styles.paramsIndicator} aria-label="takes parameters">...</span>;

export function PapyrusScriptEventReference<TGame extends PapyrusGame>(propsObj: ComponentProps<typeof PapyrusScriptReference> & (
    | {readonly evt: PapyrusScriptEventOrBaseFunctionIndexed<TGame>, readonly evtAggregate?: undefined}
    | {readonly evt?: undefined, readonly evtAggregate: PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>}
)): React.ReactNode {
    const {game, evt, evtAggregate, inTooltip} = propsObj;
    const scriptName = getScriptNameFromProps(propsObj);
    if (evt) {
        const parameterElement = <>({evt.parameters.length > 0 ? TAKES_PARAMETERS_INDICATOR: null})</>;
        return <span className={styles.reference}>
            <PapyrusScriptReference {...propsObj} />
            .
            { inTooltip
                ? <>
                    <span className={styles.eventName}>{evt.name}</span>
                    {parameterElement}
                </>
                : <Tooltip role='tooltip' tooltipContents={<PapyrusScriptEventReferenceTooltip {...propsObj} />}>
                    <InternalLink className={styles.eventName} href={prepareUrlParts(game, 'script', scriptName, 'event', evt.name)} data-ref=''>
                        {evt.name}
                    </InternalLink>
                    {parameterElement}
                </Tooltip> }

        </span>;
    } else if (evtAggregate) {
        const evtName = getBestStringVariant(evtAggregate.name)![1];
        const parameterElement = <>({evtAggregate.parameters.length > 0 ? TAKES_PARAMETERS_INDICATOR: null})</>;
        return <span className={styles.reference}>
            <PapyrusScriptReference {...propsObj} />
            .
            { inTooltip
                ? <>
                    <span className={styles.eventName}>{evtName}</span>
                    {parameterElement}
                </>
                : <Tooltip role='tooltip' tooltipContents={<PapyrusScriptEventReferenceTooltip {...propsObj} />}>
                    <InternalLink className={styles.eventName} href={prepareUrlParts(game, 'script', scriptName, 'event', evtName)} data-ref=''>
                        {evtName}
                    </InternalLink>
                    {parameterElement}
                </Tooltip> }
        </span>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReference> component!');
    }

}
