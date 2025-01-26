import type { PapyrusScriptDocumentable } from "./documentable";
import type { PapyrusGame } from "./game";
import type { PapyrusScriptValue } from "./type";

export interface PapyrusScriptStruct<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> extends PapyrusScriptDocumentable {
    name: string;
    members: Record<Lowercase<string>, PapyrusScriptStructMember<TGame>>;
}

export interface PapyrusScriptStructMember<_TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> extends PapyrusScriptDocumentable {
    name: string;
    value: PapyrusScriptValue<false, false>;
    hidden: boolean;
    mandatory: boolean;
}
