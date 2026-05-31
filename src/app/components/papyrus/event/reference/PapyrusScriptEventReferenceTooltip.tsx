import { type ComponentProps } from "react";
import { UnreachableError } from "../../../../../UnreachableError";
import { getScriptNameFromProps } from "../../script/PapyrusScriptReference";
import { PapyrusEventSignature } from "../signature/EventSignature";
import { PapyrusEventSignatureVariants } from "../signature/EventSignatureVariants";
import type { PapyrusScriptEventReference } from "./PapyrusScriptEventReference";
import styles from './PapyrusScriptEventReference.module.scss';
import { SuspenseIfDevelopment } from "../../../SuspenseIfDevelopment";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";

export function PapyrusScriptEventReferenceTooltip(propsObj: ComponentProps<typeof PapyrusScriptEventReference<PapyrusGame>>) {
    const {game, evt, evtAggregate} = propsObj;
    const scriptName = getScriptNameFromProps(propsObj);
    if (evt) {
        return <div className={styles.tooltip}>
            <SuspenseIfDevelopment fallback={<p>[DEV] Loading event signature...</p>}>
                <PapyrusEventSignature scriptName={scriptName} game={game} evt={evt} inTooltip />
            </SuspenseIfDevelopment>
        </div>;
    } else if (evtAggregate) {
        return <div className={styles.tooltip}>
            <SuspenseIfDevelopment fallback={<p>[DEV] Loading event signature...</p>}>
                <PapyrusEventSignatureVariants scriptName={scriptName} game={game} evtAggregate={evtAggregate} inTooltip />
            </SuspenseIfDevelopment>
        </div>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptEventReference> component!');
    }
}
