/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PapyrusFeature, PapyrusFeatureSupportedGames } from "@/papyrus/feature-support";
import type { PapyrusScriptDocumentable } from "../pure/documentable";
import type { PapyrusGameDataIndexed } from "./game";
import type { PapyrusScriptIndexed, PapyrusScriptIndexedAggregate } from "./script";
import type { PapyrusScriptValueIndexed } from "./type";

export interface PapyrusScriptStructIndexed<TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs>> extends PapyrusScriptDocumentable {
    name: string;
    members: Record<Lowercase<string>, PapyrusScriptStructMemberIndexed<TGame>>;

    /** The script this function originates from */
    script: PapyrusScriptIndexed<TGame>;
    /** The game this struct originates from */
    game: PapyrusGameDataIndexed<TGame>;
}

type PapyrusScriptStructIndexedAggregateBase<TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs>> = {
    [K in keyof PapyrusScriptStructIndexed<TGame>]:
        NonNullable<PapyrusScriptStructIndexed<TGame>[K]> extends Record<Lowercase<string>, any>
            ? Record<Lowercase<string>, [Lowercase<string>[], PapyrusScriptStructIndexed<TGame>[K][any]][]>
            : [Lowercase<string>[], PapyrusScriptStructIndexed<TGame>[K]][];
}

type PapyrusScriptStructIndexedAggregateSpecialKeys<TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs>> = {
    $entityId: number;
    $sources: Record<Lowercase<string>, PapyrusScriptStructIndexed<TGame>>;
    script: PapyrusScriptIndexedAggregate<TGame>;
    game: PapyrusGameDataIndexed<TGame>;
    members: Record<Lowercase<string>, PapyrusScriptStructMemberIndexedAggregate<TGame>>;
}

export type PapyrusScriptStructIndexedAggregate<TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs>> = PapyrusScriptStructIndexedAggregateSpecialKeys<TGame> & Omit<PapyrusScriptStructIndexedAggregateBase<TGame>, keyof PapyrusScriptStructIndexedAggregateSpecialKeys<TGame>>;

export interface PapyrusScriptStructMemberIndexed<TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs>> extends PapyrusScriptDocumentable {
    /** The name of this struct member */
    name: string;
    /** The type & value of this struct member */
    value: PapyrusScriptValueIndexed<false, false, TGame>;
    /** If true, this struct member is hidden in the Creation Kit */
    hidden: boolean;
    /** If true, this struct member will raise an editor warning if it is not defined in the Creation Kit */
    mandatory: boolean;

    /** The struct this member belongs to */
    struct: PapyrusScriptStructIndexed<TGame>;
    /** The script this struct member originates from */
    script: PapyrusScriptIndexed<TGame>;
    /** The game this struct member originates from */
    game: PapyrusGameDataIndexed<TGame>;
}

type PapyrusScriptStructMemberIndexedAggregateBase<TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs>> = {
    [K in keyof PapyrusScriptStructMemberIndexed<TGame>]:
        NonNullable<PapyrusScriptStructMemberIndexed<TGame>[K]> extends Record<Lowercase<string>, any>
            ? Record<Lowercase<string>, [Lowercase<string>[], PapyrusScriptStructMemberIndexed<TGame>[K][any]][]>
            : [Lowercase<string>[], PapyrusScriptStructMemberIndexed<TGame>[K]][];
}

type PapyrusScriptStructMemberIndexedAggregateSpecialKeys<TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs>> = {
    $entityId: number;
    $sources: Record<Lowercase<string>, PapyrusScriptStructMemberIndexed<TGame>>;
    struct: PapyrusScriptStructIndexedAggregate<TGame>;
    script: PapyrusScriptIndexedAggregate<TGame>;
    game: PapyrusGameDataIndexed<TGame>;
}

export type PapyrusScriptStructMemberIndexedAggregate<TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs>> = PapyrusScriptStructMemberIndexedAggregateSpecialKeys<TGame> & Omit<PapyrusScriptStructMemberIndexedAggregateBase<TGame>, keyof PapyrusScriptStructMemberIndexedAggregateSpecialKeys<TGame>>;
