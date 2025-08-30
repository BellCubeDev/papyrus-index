/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PapyrusScriptDocumentable } from "../pure/documentable";
import type { PapyrusGame } from "../pure/game";
import type { PapyrusGameDataIndexed } from "./game";
import type { PapyrusScriptIndexed, PapyrusScriptIndexedAggregate } from "./script";
import type { PapyrusScriptValueIndexed } from "./type";

export interface PapyrusScriptStructIndexed<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> extends PapyrusScriptDocumentable {
    name: string;
    members: Record<Lowercase<string>, PapyrusScriptStructMemberIndexed<TGame>>;

    /** The script this function originates from */
    script: PapyrusScriptIndexed<TGame>;
    /** The game this struct originates from */
    game: PapyrusGameDataIndexed<TGame>;
}

type PapyrusScriptStructIndexedAggregateBase<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> = {
    [K in keyof PapyrusScriptStructIndexed<TGame>]:
        NonNullable<PapyrusScriptStructIndexed<TGame>[K]> extends Record<Lowercase<string>, any>
            ? Record<Lowercase<string>, [Lowercase<string>[], PapyrusScriptStructIndexed<TGame>[K][any]][]>
            : [Lowercase<string>[], PapyrusScriptStructIndexed<TGame>[K]][];
}

type PapyrusScriptStructIndexedAggregateSpecialKeys<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> = {
    $entityId: number;
    $sources: Record<Lowercase<string>, PapyrusScriptStructIndexed<TGame>>;
    script: PapyrusScriptIndexedAggregate<TGame>;
    game: PapyrusGameDataIndexed<TGame>;
    members: Record<Lowercase<string>, PapyrusScriptStructMemberIndexedAggregate<TGame>>;
}

export type PapyrusScriptStructIndexedAggregate<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> = PapyrusScriptStructIndexedAggregateSpecialKeys<TGame> & Omit<PapyrusScriptStructIndexedAggregateBase<TGame>, keyof PapyrusScriptStructIndexedAggregateSpecialKeys<TGame>>;

export interface PapyrusScriptStructMemberIndexed<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> extends PapyrusScriptDocumentable {
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

type PapyrusScriptStructMemberIndexedAggregateBase<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> = {
    [K in keyof PapyrusScriptStructMemberIndexed<TGame>]:
        NonNullable<PapyrusScriptStructMemberIndexed<TGame>[K]> extends Record<Lowercase<string>, any>
            ? Record<Lowercase<string>, [Lowercase<string>[], PapyrusScriptStructMemberIndexed<TGame>[K][any]][]>
            : [Lowercase<string>[], PapyrusScriptStructMemberIndexed<TGame>[K]][];
}

type PapyrusScriptStructMemberIndexedAggregateSpecialKeys<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> = {
    $entityId: number;
    $sources: Record<Lowercase<string>, PapyrusScriptStructMemberIndexed<TGame>>;
    struct: PapyrusScriptStructIndexedAggregate<TGame>;
    script: PapyrusScriptIndexedAggregate<TGame>;
    game: PapyrusGameDataIndexed<TGame>;
}

export type PapyrusScriptStructMemberIndexedAggregate<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> = PapyrusScriptStructMemberIndexedAggregateSpecialKeys<TGame> & Omit<PapyrusScriptStructMemberIndexedAggregateBase<TGame>, keyof PapyrusScriptStructMemberIndexedAggregateSpecialKeys<TGame>>;
