import type { PapyrusScriptDocumentable } from "../pure/documentable";
import type { PapyrusGame } from "../pure/game";
import type { PapyrusCollapsedSpecifier } from "../pure/propertyGroup";
import type { PapyrusGameDataIndexed } from "./game";
import type { PapyrusScriptPropertyIndexed, PapyrusScriptPropertyIndexedAggregate } from "./property";
import type { PapyrusScriptIndexed, PapyrusScriptIndexedAggregate } from "./script";

export interface PapyrusScriptPropertyGroupIndexed<TGame extends PapyrusGame> extends PapyrusScriptDocumentable {
    collapsed: PapyrusCollapsedSpecifier.Never | (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? PapyrusCollapsedSpecifier : never);
    name: string;
    properties: Record<Lowercase<string>, PapyrusScriptPropertyIndexed<TGame>>;
    /** The script this property group originates from */
    script: PapyrusScriptIndexed<TGame>;
    /** The game this property group originates from */
    game: PapyrusGameDataIndexed<TGame>;
}

type PapyrusScriptPropertyGroupIndexedAggregateBase<TGame extends PapyrusGame> = {
    [K in keyof PapyrusScriptPropertyGroupIndexed<TGame>]:
        NonNullable<PapyrusScriptPropertyGroupIndexed<TGame>[K]> extends Record<Lowercase<string>, any>
            ? Record<Lowercase<string>, [Lowercase<string>[], PapyrusScriptPropertyGroupIndexed<TGame>[K][any]][]>
            : [Lowercase<string>[], PapyrusScriptPropertyGroupIndexed<TGame>[K]][];
}

type PapyrusScriptPropertyGroupIndexedAggregateSpecialKeys<TGame extends PapyrusGame> = {
    $entityId: number;
    $sources: Record<Lowercase<string>, PapyrusScriptPropertyGroupIndexed<TGame>>;
    collapsed: [Lowercase<string>[], PapyrusCollapsedSpecifier.Never | (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? PapyrusCollapsedSpecifier : never)][];
    properties: Record<Lowercase<string>, PapyrusScriptPropertyIndexedAggregate<TGame>>;
    script: PapyrusScriptIndexedAggregate<TGame>;
    game: PapyrusGameDataIndexed<TGame>;
}

export type PapyrusScriptPropertyGroupIndexedAggregate<TGame extends PapyrusGame> = PapyrusScriptPropertyGroupIndexedAggregateSpecialKeys<TGame> & Omit<PapyrusScriptPropertyGroupIndexedAggregateBase<TGame>, keyof PapyrusScriptPropertyGroupIndexedAggregateSpecialKeys<TGame>>;
