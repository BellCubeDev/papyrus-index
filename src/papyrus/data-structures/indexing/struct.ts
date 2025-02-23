import type { PapyrusScriptDocumentable } from "../pure/documentable";
import type { PapyrusGame } from "../pure/game";
import type { PapyrusScriptIndexed } from "./script";
import type { PapyrusScriptValueIndexed } from "./type";

export interface PapyrusScriptStructIndexed<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> extends PapyrusScriptDocumentable {
    name: string;
    members: Record<Lowercase<string>, PapyrusScriptStructMemberIndexed<TGame>>;

    /** The script this function originates from */
    script: PapyrusScriptIndexed<TGame>;
}

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
}
