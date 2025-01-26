import type { PapyrusCompilerOptional } from "./compilerOptional";
import type { PapyrusScriptDocumentable, PapyrusScriptDocumentableOnlyByComment } from "./documentable";
import type { PapyrusGame } from "./game";
import type { PapyrusScriptType, PapyrusScriptValue } from "./type";

export interface PapyrusScriptEventOrBaseFunction<TGame extends PapyrusGame> extends PapyrusScriptDocumentable, PapyrusCompilerOptional<TGame> {
    /** The name of the event (typically beginning with `on`) */
    name: string;

    /** Parameters of the event, in the order they appear in */
    parameters: PapyrusScriptFunctionParameter[];
}

export interface PapyrusScriptFunction<TGame extends PapyrusGame> extends PapyrusScriptEventOrBaseFunction<TGame> {
    /** The name of the function */
    name: string;

    /** If true, this function is analogous to a "static" function in traditional OOP terminology */
    isGlobal: boolean;
    /** If true, this function's logic is housed in the game engine itself, rather than in a Papyrus script */
    isNative: boolean;

    /** Parameters of the function, in the order they appear in */
    parameters: PapyrusScriptFunctionParameter[];

    /** The return type of the function */
    returnType: PapyrusScriptType<boolean, false>
}

export interface PapyrusScriptFunctionParameter extends PapyrusScriptDocumentableOnlyByComment {
    name: string;
    isRequired: boolean;
    value: PapyrusScriptValue<boolean, true>;
}
