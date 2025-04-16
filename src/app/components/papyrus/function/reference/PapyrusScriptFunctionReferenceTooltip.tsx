import { type ComponentProps } from "react";
import { UnreachableError } from "../../../../../UnreachableError";
import { getScriptNameFromProps } from "../../script/PapyrusScriptReference";
import { PapyrusFunctionSignature } from "../signature/FunctionSignature";
import { PapyrusFunctionSignatureVariants } from "../signature/FunctionSignatureVariants";
import type { PapyrusScriptFunctionReference } from "./PapyrusScriptFunctionReference";
import styles from './PapyrusScriptFunctionReference.module.scss';

export function PapyrusScriptFunctionReferenceTooltip(propsObj: ComponentProps<typeof PapyrusScriptFunctionReference>) {
    const {game, func, funcAggregate} = propsObj;
    const scriptName = getScriptNameFromProps(propsObj);
    if (func) {
        return <div className={styles.tooltip}>
            <PapyrusFunctionSignature scriptName={scriptName} game={game} func={func} inTooltip />
        </div>;
    } else if (funcAggregate) {
        return <div className={styles.tooltip}>
            <PapyrusFunctionSignatureVariants scriptName={scriptName} game={game} funcAggregate={funcAggregate} inTooltip />
        </div>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptFunctionReference> component!');
    }
}
