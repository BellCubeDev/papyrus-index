import type { PapyrusCompilerOptional } from "../pure/compilerOptional";
import type { PapyrusScriptDocumentable, PapyrusScriptDocumentableOnlyByComment } from "../pure/documentable";
import type { PapyrusGame } from "../pure/game";
import type { PapyrusScriptIndexed } from "./script";
import type { PapyrusScriptTypeIndexed, PapyrusScriptValueIndexed } from "./type";

export interface PapyrusScriptEventOrBaseFunctionIndexed<TGame extends PapyrusGame> extends PapyrusScriptDocumentable, PapyrusCompilerOptional<TGame> {
    /** The name of the event (typically beginning with `on`) */
    name: string;

    /** Parameters of the event, in the order they appear in */
    parameters: PapyrusScriptFunctionParameterIndexed<TGame>[];

    /** The script this function originates from */
    script: PapyrusScriptIndexed<TGame>;
}

export interface PapyrusScriptFunctionIndexed<TGame extends PapyrusGame> extends PapyrusScriptEventOrBaseFunctionIndexed<TGame> {
    /** The name of the function */
    name: string;

    /** If true, this function is analogous to a "static" function in traditional OOP terminology */
    isGlobal: boolean;
    /** If true, this function's logic is housed in the game engine itself, rather than in a Papyrus script */
    isNative: boolean;

    /** Parameters of the function, in the order they appear in */
    parameters: PapyrusScriptFunctionParameterIndexed<TGame>[];

    /** The return type of the function */
    returnType: PapyrusScriptTypeIndexed<boolean, false, TGame>;
}

export interface PapyrusScriptFunctionParameterIndexed<TGame extends PapyrusGame> extends PapyrusScriptDocumentableOnlyByComment {
    name: string;
    isRequired: boolean;
    value: PapyrusScriptValueIndexed<boolean, true, TGame>;
}
