import type { PapyrusGame } from "../pure/game";
import type { PapyrusScriptEventOrBaseFunctionIndexed, PapyrusScriptFunctionIndexed } from "./function";
import type { PapyrusScriptPropertyGroupIndexed } from "./propertyGroup";
import type { PapyrusScriptStructIndexed } from "./struct";
import type { UnknownPapyrusScript } from "./type";
import type { PapyrusScriptOnlyProps } from "../pure/script";

export interface PapyrusScriptIndexed<TGame extends PapyrusGame> extends PapyrusScriptOnlyProps<TGame> {
    name: string;
    isHidden: boolean;
    isConditional: boolean;

    /** The script this script derives from, if any */
    extends: PapyrusPossibleScripts<TGame> | typeof UnknownPapyrusScript | null;
    /** The name of the script this script derives from, if any
     * @see this.extends
    */
    extendsName: string | null;

    /** Scripts that extend this script. For example, in Starfield, ObjectReference extends Actor, so, if this script is ObjectReference, its array should include Actor. */
    extendedBy: Record<Lowercase<string>, PapyrusPossibleScripts<TGame>>;

    functions: Record<Lowercase<string>, PapyrusScriptFunctionIndexed<TGame>>;
    events: Record<Lowercase<string>, PapyrusScriptEventOrBaseFunctionIndexed<TGame>>;

    /** Properties, stored by group then name. The default group is "" */
    propertyGroups: Record<Lowercase<string>, PapyrusScriptPropertyGroupIndexed<TGame>>;

    isConst: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | false;

    isNative: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never);

    default: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never);

    structs: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? Record<Lowercase<string>, PapyrusScriptStructIndexed<TGame>> : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never);

    /** The namespace of the script, if it has one. Will never be an empty string. */
    namespace: null | (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? Exclude<string, ''> : never);

    /** Scripts this script imports (functions like a combination of `export * from './SCRIPT.js'` and importing everything into the global namespace at the same time) */
    imports: (PapyrusPossibleScripts<TGame> | typeof UnknownPapyrusScript)[];
    /** Names of scripts this script imports
     * @see this.imports
    */
    importNames: string[];
}

// TODO: Fix this type so it works properly with ternary operators (?)
// Do this by creating a second type and adding all the problematic props manually
type PapyrusScriptIndexedAggregateBase<TGame extends PapyrusGame> = {
    [K in keyof PapyrusScriptIndexed<TGame>]:
        NonNullable<PapyrusScriptIndexed<TGame>[K]> extends Record<Lowercase<string>, any>
            ? Record<Lowercase<string>, [Lowercase<string>[], PapyrusScriptIndexed<TGame>[K][any]][]>
            : [Lowercase<string>[], PapyrusScriptIndexed<TGame>[K]][];
}

export type PapyrusScriptIndexedAggregate<TGame extends PapyrusGame> = Omit<PapyrusScriptOnlyProps<TGame>, 'isBetaOnly'|'isDebugOnly'|'documentationComment'|'documentationString'> & Omit<PapyrusScriptIndexedAggregateBase<TGame>, 'isConst'|'default'|'namespace'|'isNative'|'isBetaOnly'|'isDebugOnly'|'structs'|'extendedBy'> & {
    isConst: [Lowercase<string>[], (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | false][];
    isNative: [Lowercase<string>[], (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never)][];
    default: [Lowercase<string>[], (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never)][];
    structs: Record<Lowercase<string>, [string[], (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? PapyrusScriptStructIndexed<TGame> : never)][]>;
    namespace: [Lowercase<string>[], null | (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? Exclude<string, ''> : never)][];

    /* If true, this object and all uses of it will be compiled out in non-debug builds */
    isDebugOnly: [Lowercase<string>[], (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | false][];
    /* If true, this object and all uses of it will be compiled out in non-debug non-beta builds */
    isBetaOnly: [Lowercase<string>[], (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | false][];
} & Pick<PapyrusScriptIndexed<TGame>, 'extendedBy'>;

/** Represents a single script. Maps potential sources to those scripts. */
export type PapyrusPossibleScripts<TGame extends PapyrusGame> = Record<Lowercase<string>, PapyrusScriptIndexed<TGame>>;
