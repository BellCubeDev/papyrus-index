import { type ComponentProps } from "react";
import { UnreachableError } from "../../../../../UnreachableError";
import { getScriptNameFromProps } from "../../script/PapyrusScriptReference";
import { PapyrusFunctionSignature } from "../signature/FunctionSignature";
import { PapyrusFunctionSignatureVariants } from "../signature/FunctionSignatureVariants";
import type { PapyrusScriptFunctionReference } from "./PapyrusScriptFunctionReference";
import styles from './PapyrusScriptFunctionReference.module.scss';
import { SuspenseIfDevelopment } from "../../../SuspenseIfDevelopment";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";

export function PapyrusScriptFunctionReferenceTooltip(propsObj: ComponentProps<typeof PapyrusScriptFunctionReference<PapyrusGame>>) {
    const {game, func, funcAggregate} = propsObj;
    const scriptName = getScriptNameFromProps(propsObj);
    if (func) {
        return <div className={styles.tooltip}>
            <SuspenseIfDevelopment fallback={<p>[DEV] Loading function signature...</p>}>
                <PapyrusFunctionSignature scriptName={scriptName} game={game} func={func} inTooltip />
            </SuspenseIfDevelopment>
        </div>;
    } else if (funcAggregate) {
        return <div className={styles.tooltip}>
            <SuspenseIfDevelopment fallback={<p>[DEV] Loading function signature...</p>}>
                <PapyrusFunctionSignatureVariants scriptName={scriptName} game={game} funcAggregate={funcAggregate} inTooltip />
            </SuspenseIfDevelopment>
        </div>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptFunctionReference> component!');
    }
}
