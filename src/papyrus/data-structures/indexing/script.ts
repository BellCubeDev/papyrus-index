/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PapyrusGame } from "../pure/game";
import type { PapyrusScriptEventOrBaseFunctionIndexed, PapyrusScriptEventOrBaseFunctionIndexedAggregate, PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate } from "./function";
import type { PapyrusScriptPropertyGroupIndexed, PapyrusScriptPropertyGroupIndexedAggregate } from "./propertyGroup";
import type { PapyrusScriptStructIndexed, PapyrusScriptStructIndexedAggregate } from "./struct";
import type { UnknownPapyrusScript } from "./type";
import type { PapyrusScriptOnlyProps } from "../pure/script";
import type { PapyrusGameDataIndexed } from "./game";
import type { PapyrusScriptSourceIndexed } from "./scriptSource";
import type { PapyrusFeature, PapyrusFeatureSupportedGames, PapyrusFeatureUnsupportedGames } from "@/papyrus/feature-support";

export interface PapyrusScriptIndexed<TGame extends PapyrusGame> extends PapyrusScriptOnlyProps<TGame> {
    nameWithoutNamespace: string;
    namespaceName: string;
    isHidden: boolean;
    isConditional: boolean;

    game: PapyrusGameDataIndexed<TGame>;
    source: PapyrusScriptSourceIndexed<TGame>;

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

    isConst: (TGame extends  PapyrusFeatureSupportedGames<PapyrusFeature.ConstScriptFlag> ? boolean : never) | false;

    isNative: (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.NativeScriptFlag> ? boolean : never) | (TGame extends PapyrusFeatureUnsupportedGames<PapyrusFeature.NativeScriptFlag> ? null : never);

    default: (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.DefaultScriptFlag> ? boolean : never) | (TGame extends PapyrusFeatureUnsupportedGames<PapyrusFeature.DefaultScriptFlag> ? null : never);

    structs: (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs> ? Record<Lowercase<string>, PapyrusScriptStructIndexed<TGame>> : never) | (TGame extends PapyrusFeatureUnsupportedGames<PapyrusFeature.Structs> ? null : never);

    /** The namespace of the script, if it has one. Will never be an empty string. */
    namespace: null | (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.ScriptNamespaces> ? string : never);

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
    isConst: [Lowercase<string>[], (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.ConstScriptFlag> ? boolean : never) | false][];
    isNative: [Lowercase<string>[], (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.NativeScriptFlag> ? boolean : never) | (TGame extends PapyrusFeatureUnsupportedGames<PapyrusFeature.NativeScriptFlag> ? null : never)][];
    default: [Lowercase<string>[], (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.DefaultScriptFlag> ? boolean : never) | (TGame extends PapyrusFeatureUnsupportedGames<PapyrusFeature.DefaultScriptFlag> ? null : never)][];
    namespace: [Lowercase<string>[], null | (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.ScriptNamespaces> ? string : never)][];

    /* If true, this object and all uses of it will be compiled out in non-debug builds */
    isDebugOnly: [Lowercase<string>[], (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.CompilerTargets> ? boolean : never) | false][];
    /* If true, this object and all uses of it will be compiled out in non-debug non-beta builds */
    isBetaOnly: [Lowercase<string>[], (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.CompilerTargets> ? boolean : never) | false][];

    functions: Record<Lowercase<string>, PapyrusScriptFunctionIndexedAggregate<TGame>>;
    events: Record<Lowercase<string>, PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>>;
    propertyGroups: Record<Lowercase<string>, PapyrusScriptPropertyGroupIndexedAggregate<TGame>>;
    structs: (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs> ? Record<Lowercase<string>, PapyrusScriptStructIndexedAggregate<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>> : never) | (TGame extends PapyrusFeatureUnsupportedGames<PapyrusFeature.Structs> ? null : never);
} & Pick<PapyrusScriptIndexed<TGame>, 'extendedBy'>

export type PapyrusScriptIndexedAggregate<TGame extends PapyrusGame> = PapyrusScriptIndexedAggregateSpecialKeys<TGame> & Omit<PapyrusScriptIndexedAggregateBase<TGame>, 'source'|keyof PapyrusScriptIndexedAggregateSpecialKeys<TGame>>;

/** Represents a single script. Maps potential sources to those scripts. */
export type PapyrusPossibleScripts<TGame extends PapyrusGame> = Record<Lowercase<string>, PapyrusScriptIndexed<TGame>>;
