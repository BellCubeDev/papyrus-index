import { PapyrusGame } from "../papyrus/data-structures/pure/game";
import { UnreachableError } from "../UnreachableError";

export function getGameName(game: PapyrusGame): string {
    switch (game) {
        case PapyrusGame.SkyrimSE:
            return "Skyrim SE";
        case PapyrusGame.Fallout4:
            return "Fallout 4";
        case PapyrusGame.Fallout76:
            return "Fallout 76";
        case PapyrusGame.Starfield:
            return "Starfield";
        default:
            throw new UnreachableError(game, 'Encountered invalid game while trying to get its name');
    }
}
