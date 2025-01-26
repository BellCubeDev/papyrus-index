import type { PapyrusScriptDocumentable } from "./documentable";
import type { PapyrusGame } from "./game";
import type { PapyrusScriptValue } from "./type";

export interface PapyrusScriptProperty<TGame extends PapyrusGame> extends PapyrusScriptDocumentable {
    name: string;

    /** If true, this property is automatically handled by the game. If false, it will have a custom getter and/or setter. Most properties will be `auto` */
    auto: boolean;
    /** If true, this property has a getter. Will always be true if `auto` is true. */
    hasGetter: boolean;
    /** If true, this property has a setter. */
    hasSetter: boolean;
    /** If true, this property is not shown in the CK's property editing menu. Will still be accessible to other scripts */
    hidden: boolean;

    value: PapyrusScriptValue<boolean, false>;

    // Post-Skyrim additions:

    /** If false, the value is stored in the player's save. If true, the value is read from the plugin */
    constant: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? true : never) | false;
    /** Whether the CK will spit out a warning when this is property is not filled */
    mandatory: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? true : never) | false;
}
