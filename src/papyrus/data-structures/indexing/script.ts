import type { PapyrusGame } from "../pure/game";
import type { PapyrusScriptEventOrBaseFunctionIndexed, PapyrusScriptEventOrBaseFunctionIndexedAggregate, PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate } from "./function";
import type { PapyrusScriptPropertyGroupIndexed, PapyrusScriptPropertyGroupIndexedAggregate } from "./propertyGroup";
import type { PapyrusScriptStructIndexed, PapyrusScriptStructIndexedAggregate } from "./struct";
import type { UnknownPapyrusScript } from "./type";
import type { PapyrusScriptOnlyProps } from "../pure/script";
import type { PapyrusGameDataIndexed } from "./game";

export interface PapyrusScriptIndexed<TGame extends PapyrusGame> extends PapyrusScriptOnlyProps<TGame> {
    nameWithoutNamespace: string;
    namespaceName: string;
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

type PapyrusScriptIndexedAggregateBase<TGame extends PapyrusGame> = {
    [K in keyof PapyrusScriptIndexed<TGame>]:
        NonNullable<PapyrusScriptIndexed<TGame>[K]> extends Record<Lowercase<string>, any>
            ? Record<Lowercase<string>, [Lowercase<string>[], PapyrusScriptIndexed<TGame>[K][any]][]>
            : [Lowercase<string>[], PapyrusScriptIndexed<TGame>[K]][];
}

type PapyrusScriptIndexedAggregateSpecialKeys<TGame extends PapyrusGame> = {
    $entityId: number;

    /** The game this script originates from */
    game: PapyrusGameDataIndexed<TGame>;

    $sources: Record<Lowercase<string>, PapyrusScriptIndexed<TGame>>;
    isConst: [Lowercase<string>[], (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | false][];
    isNative: [Lowercase<string>[], (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never)][];
    default: [Lowercase<string>[], (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never)][];
    namespace: [Lowercase<string>[], null | (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? Exclude<string, ''> : never)][];

    /* If true, this object and all uses of it will be compiled out in non-debug builds */
    isDebugOnly: [Lowercase<string>[], (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | false][];
    /* If true, this object and all uses of it will be compiled out in non-debug non-beta builds */
    isBetaOnly: [Lowercase<string>[], (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | false][];

    functions: Record<Lowercase<string>, PapyrusScriptFunctionIndexedAggregate<TGame>>;
    events: Record<Lowercase<string>, PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>>;
    propertyGroups: Record<Lowercase<string>, PapyrusScriptPropertyGroupIndexedAggregate<TGame>>;
    structs: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? Record<Lowercase<string>, PapyrusScriptStructIndexedAggregate<TGame>> : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never);
} & Pick<PapyrusScriptIndexed<TGame>, 'extendedBy'>

export type PapyrusScriptIndexedAggregate<TGame extends PapyrusGame> = PapyrusScriptIndexedAggregateSpecialKeys<TGame> & Omit<PapyrusScriptIndexedAggregateBase<TGame>, keyof PapyrusScriptIndexedAggregateSpecialKeys<TGame>>;

/** Represents a single script. Maps potential sources to those scripts. */
export type PapyrusPossibleScripts<TGame extends PapyrusGame> = Record<Lowercase<string>, PapyrusScriptIndexed<TGame>>;
