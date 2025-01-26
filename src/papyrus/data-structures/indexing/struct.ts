import type { PapyrusScriptDocumentable } from "../pure/documentable";
import type { PapyrusGame } from "../pure/game";
import type { PapyrusScriptValueIndexed } from "./type";

export interface PapyrusScriptStructIndexed<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> extends PapyrusScriptDocumentable {
    name: string;
    members: Record<Lowercase<string>, PapyrusScriptStructMemberIndexed<TGame>>;
}

export interface PapyrusScriptStructMemberIndexed<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> extends PapyrusScriptDocumentable {
    name: string;
    value: PapyrusScriptValueIndexed<false, false, TGame>;
    hidden: boolean;
    mandatory: boolean;
}
