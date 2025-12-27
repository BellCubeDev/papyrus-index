/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PapyrusFeature, PapyrusFeatureSupportedGames } from "@/papyrus/feature-support";
import type { PapyrusCompilerOptional } from "../pure/compilerOptional";
import type { PapyrusScriptDocumentable, PapyrusScriptDocumentableOnlyByComment } from "../pure/documentable";
import type { PapyrusGame } from "../pure/game";
import type { PapyrusGameDataIndexed } from "./game";
import type { PapyrusScriptIndexed, PapyrusScriptIndexedAggregate } from "./script";
import type { PapyrusScriptTypeIndexed, PapyrusScriptValueIndexed } from "./type";

export interface PapyrusScriptEventOrBaseFunctionIndexed<TGame extends PapyrusGame> extends PapyrusScriptDocumentable, PapyrusCompilerOptional<TGame> {
    /** The name of the event (typically beginning with `on`) */
    name: string;

    /** Parameters of the event, in the order they appear in */
    parameters: PapyrusScriptFunctionParameterIndexed<TGame>[];

    /** The script this function originates from */
    script: PapyrusScriptIndexed<TGame>;

    /** The game this function originates from */
    game: PapyrusGameDataIndexed<TGame>;
}

type PapyrusScriptEventOrBaseFunctionIndexedAggregateBase<TGame extends PapyrusGame> = {
    [K in keyof PapyrusScriptEventOrBaseFunctionIndexed<TGame>]:
        NonNullable<PapyrusScriptEventOrBaseFunctionIndexed<TGame>[K]> extends Record<Lowercase<string>, any>
            ? Record<Lowercase<string>, [Lowercase<string>[], PapyrusScriptEventOrBaseFunctionIndexed<TGame>[K][any]][]>
            : [Lowercase<string>[], PapyrusScriptEventOrBaseFunctionIndexed<TGame>[K]][];
}

type PapyrusScriptEventOrBaseFunctionIndexedAggregateSpecialKeys<TGame extends PapyrusGame> = {
    $entityId: number;
    $sources: Record<Lowercase<string>, PapyrusScriptEventOrBaseFunctionIndexed<TGame>>;
    isBetaOnly: [Lowercase<string>[], false | (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.CompilerTargets> ? boolean : never)][];
    isDebugOnly: [Lowercase<string>[], false | (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.CompilerTargets> ? boolean : never)][];
    script: PapyrusScriptIndexedAggregate<TGame>;
    game: PapyrusGameDataIndexed<TGame>;
    parameters: (PapyrusScriptFunctionParameterIndexed<TGame> & {$sources: Record<Lowercase<string>, PapyrusScriptFunctionParameterIndexed<TGame>>})[];
    parametersRaw: PapyrusScriptEventOrBaseFunctionIndexedAggregateBase<TGame>['parameters'];
}

export type PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame extends PapyrusGame> = PapyrusScriptEventOrBaseFunctionIndexedAggregateSpecialKeys<TGame> & Omit<PapyrusScriptEventOrBaseFunctionIndexedAggregateBase<TGame>, keyof PapyrusScriptEventOrBaseFunctionIndexedAggregateSpecialKeys<TGame>>;


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

type PapyrusScriptFunctionIndexedAggregateBase<TGame extends PapyrusGame> = {
    [K in keyof PapyrusScriptFunctionIndexed<TGame>]:
        NonNullable<PapyrusScriptFunctionIndexed<TGame>[K]> extends Record<Lowercase<string>, any>
            ? Record<Lowercase<string>, [Lowercase<string>[], PapyrusScriptFunctionIndexed<TGame>[K][any]][]>
            : [Lowercase<string>[], PapyrusScriptFunctionIndexed<TGame>[K]][];
}

export type PapyrusScriptFunctionIndexedAggregateReturnType<TGame extends PapyrusGame> = PapyrusScriptFunctionIndexed<TGame>['returnType'] & {
    $sources: Record<Lowercase<string>, PapyrusScriptTypeIndexed<boolean, false, TGame>>;
}

type PapyrusScriptFunctionIndexedAggregateSpecialKeys<TGame extends PapyrusGame> = Omit<PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>, '$sources'> & {
    $sources: Record<Lowercase<string>, PapyrusScriptFunctionIndexed<TGame>>;
    returnType: PapyrusScriptFunctionIndexedAggregateReturnType<TGame>;
    returnTypeRaw: PapyrusScriptFunctionIndexedAggregateBase<TGame>['returnType'];
}

export type PapyrusScriptFunctionIndexedAggregate<TGame extends PapyrusGame> = PapyrusScriptFunctionIndexedAggregateSpecialKeys<TGame> & Omit<PapyrusScriptFunctionIndexedAggregateBase<TGame>, keyof PapyrusScriptFunctionIndexedAggregateSpecialKeys<TGame>>;
