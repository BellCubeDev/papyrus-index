import type { PapyrusScriptDocumentable } from "../pure/documentable";
import type { PapyrusGame } from "../pure/game";
import type { PapyrusGameDataIndexed } from "./game";
import type { PapyrusScriptPropertyGroupIndexed, PapyrusScriptPropertyGroupIndexedAggregate } from "./propertyGroup";
import type { PapyrusScriptIndexed, PapyrusScriptIndexedAggregate } from "./script";
import type { PapyrusScriptValueIndexed } from "./type";

export interface PapyrusScriptPropertyIndexed<TGame extends PapyrusGame> extends PapyrusScriptDocumentable {
    name: string;

    /** If true, this property is automatically handled by the game. If false, it will have a custom getter and/or setter. Most properties will be `auto` */
    auto: boolean;
    /** If true, this property has a getter. Will always be true if `auto` is true. */
    hasGetter: boolean;
    /** If true, this property has a setter. */
    hasSetter: boolean;
    /** If true, this property is not shown in the CK's property editing menu. Will still be accessible to other scripts */
    hidden: boolean;

    value: PapyrusScriptValueIndexed<boolean, false, TGame>;

    /** The group this property belongs to */
    group: PapyrusScriptPropertyGroupIndexed<TGame>;
    /** The script this property originates from */
    script: PapyrusScriptIndexed<TGame>;
    /** The game this property originates from */
    game: PapyrusGameDataIndexed<TGame>;

    // Post-Skyrim additions:

    /** If false, the value is stored in the player's save. If true, the value is read from the plugin */
    constant: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? true : never) | false;
    /** Whether the CK will spit out a warning when this is property is not filled */
    mandatory: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? true : never) | false;
}

type PapyrusScriptPropertyIndexedAggregateBase<TGame extends PapyrusGame> = {
    [K in keyof PapyrusScriptPropertyIndexed<TGame>]:
        NonNullable<PapyrusScriptPropertyIndexed<TGame>[K]> extends Record<Lowercase<string>, any>
            ? Record<Lowercase<string>, [Lowercase<string>[], PapyrusScriptPropertyIndexed<TGame>[K][any]][]>
            : [Lowercase<string>[], PapyrusScriptPropertyIndexed<TGame>[K]][];
}

type PapyrusScriptPropertyIndexedAggregateSpecialKeys<TGame extends PapyrusGame> = {
    $entityId: number;
    $sources: Record<Lowercase<string>, PapyrusScriptPropertyIndexed<TGame>>;
    constant: [Lowercase<string>[], (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? true : never) | false][];
    mandatory: [Lowercase<string>[], (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? true : never) | false][];
    script: PapyrusScriptIndexedAggregate<TGame>;
    game: PapyrusGameDataIndexed<TGame>;
    group: PapyrusScriptPropertyGroupIndexedAggregate<TGame>;
}

export type PapyrusScriptPropertyIndexedAggregate<TGame extends PapyrusGame> = PapyrusScriptPropertyIndexedAggregateSpecialKeys<TGame> & Omit<PapyrusScriptPropertyIndexedAggregateBase<TGame>, keyof PapyrusScriptPropertyIndexedAggregateSpecialKeys<TGame>>;
