import type { ComponentProps } from "react";
import type { PapyrusScriptFunctionReference } from "./PapyrusScriptFunctionReference";
import styles from './PapyrusScriptFunctionReference.module.scss';
import { PapyrusFunctionSignature } from "../signature/FunctionSignature";
import { getScriptNameFromProps } from "../../script/PapyrusScriptReference";
import { PapyrusFunctionSignatureVariants } from "../signature/FunctionSignatureVariants";
import { UnreachableError } from "../../../../../UnreachableError";

export function PapyrusScriptFunctionReferenceTooltip(propsObj: ComponentProps<typeof PapyrusScriptFunctionReference>) {
    const {game, func, funcAggregate, possibleFunctions} = propsObj;
    const scriptName = getScriptNameFromProps(propsObj);
    if (func) {
        return <div className={styles.tooltip}>
            <PapyrusFunctionSignature scriptName={scriptName} game={game} func={func} inTooltip />
        </div>;
    } else if (funcAggregate) {
        throw new Error('The PapyrusScriptFunctionReferenceTooltip component does not yet implement the funcAggregate prop!');
    } else if (possibleFunctions) {
        return <div className={styles.tooltip}>
            <PapyrusFunctionSignatureVariants scriptName={scriptName} game={game} variants={possibleFunctions} inTooltip />
        </div>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptFunctionReference> component!');
    }
}
