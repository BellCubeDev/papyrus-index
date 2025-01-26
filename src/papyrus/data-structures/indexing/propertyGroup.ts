import type { PapyrusScriptDocumentable } from "../pure/documentable";
import type { PapyrusGame } from "../pure/game";
import type { PapyrusCollapsedSpecifier } from "../pure/propertyGroup";
import type { PapyrusScriptPropertyIndexed } from "./property";

export interface PapyrusScriptPropertyGroupIndexed<TGame extends PapyrusGame> extends PapyrusScriptDocumentable {
    collapsed: PapyrusCollapsedSpecifier.Never | (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? PapyrusCollapsedSpecifier : never);
    name: string;
    properties: Record<Lowercase<string>, PapyrusScriptPropertyIndexed<TGame>>;
}
