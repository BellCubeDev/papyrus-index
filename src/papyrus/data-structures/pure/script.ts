import type { PapyrusCompilerOptional } from "./compilerOptional";
import type { PapyrusScriptDocumentable } from "./documentable";
import type { PapyrusScriptEventOrBaseFunction, PapyrusScriptFunction } from "./function";
import type { PapyrusGame } from "./game";
import type { PapyrusScriptPropertyGroup } from "./propertyGroup";
import type { PapyrusScriptStruct } from "./struct";

export interface PapyrusScriptOnlyProps<TGame extends PapyrusGame> extends PapyrusScriptDocumentable, PapyrusCompilerOptional<TGame> {
    /** Name of the script, excluding the namespace. While case-insensitive, we should strive to use the author's intended capitalization */
    nameWithoutNamespace: unknown;

    /** Name of the script, including the namespace (if applicable). While case-insensitive, we should strive to use the author's intended capitalization */
    namespaceName: unknown;

    /** If true, this script is hidden from the scripts menu in the CK. Often used for scripts that should not normally be attached to a form */
    isHidden: unknown;

    /** If true, this script may be used in condition functions. Properties must still define the `conditional` flag to be eligible. */
    isConditional: unknown;

    /** The script this script derives from, if any */
    extends: unknown;

    functions: unknown;

    events: unknown;

    /** Properties, stored by group then name. The default group is "" */
    propertyGroups: unknown;


    // Post-Skyrim additions:

    /** If true, this script is marked as "constant" and all components that may be constant must be constant. Cannot contain scripts. Cannot be the type of a variable. */
    isConst: unknown;

    /** If true, this script is allowed to declare new native functions and events */
    isNative: unknown;

    /** If true, this script is categorized as "default" in the CK script list */
    default: unknown;

    structs: unknown;

    /** The namespace of the script, if it has one. Will never be an empty string. */
    namespace: unknown;

    /** Scripts this script imports (functions like a combination of `export * from './SCRIPT.js'` and importing everything into the global namespace at the same time) */
    imports: unknown;
}

export interface PapyrusScriptUnderConstruction<TGame extends PapyrusGame> extends PapyrusScriptOnlyProps<TGame> {
    nameWithoutNamespace: string | undefined;
    namespaceName: string | undefined;
    isHidden: boolean;
    isConditional: boolean;
    extends: string | null;
    functions: Record<Lowercase<string>, PapyrusScriptFunction<TGame>>;
    events: Record<Lowercase<string>, PapyrusScriptEventOrBaseFunction<TGame>>;
    propertyGroups: Record<Lowercase<string>, PapyrusScriptPropertyGroup<TGame>>;
    isConst: boolean;
    isNative: boolean | null;
    default: boolean | null;
    structs: Record<Lowercase<string>, PapyrusScriptStruct<Exclude<TGame, PapyrusGame.SkyrimSE>>> | null;
    namespace: Exclude<string, ''> | null | undefined;
    imports: string[];
}

export interface PapyrusScript<TGame extends PapyrusGame> extends PapyrusScriptUnderConstruction<TGame> {
    nameWithoutNamespace: string;
    namespaceName: string;
    isHidden: boolean;
    isConditional: boolean;
    extends: string | null;
    functions: Record<Lowercase<string>, PapyrusScriptFunction<TGame>>;
    propertyGroups: Record<Lowercase<string>, PapyrusScriptPropertyGroup<TGame>>;
    isConst: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | false;
    isNative: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never);
    default: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never);
    structs: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? Record<Lowercase<string>, PapyrusScriptStruct<TGame>> : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never);
    namespace: null | (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? Exclude<string, ''> : never);
}
