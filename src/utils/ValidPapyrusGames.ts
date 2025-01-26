import { PapyrusGame } from "../papyrus/data-structures/pure/game";
import { toLowerCase } from "./toLowerCase";

export const ValidPapyrusGames = new Map<Lowercase<PapyrusGame>, PapyrusGame>(Object.values(PapyrusGame).map(game => [toLowerCase(game), game]));
