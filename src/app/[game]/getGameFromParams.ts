import { notFound } from "next/navigation";
import type { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import { toLowerCase } from "../../utils/toLowerCase";
import { ValidPapyrusGames } from "../../utils/ValidPapyrusGames";

export type GameRouteParams = {readonly game: string};

export function getGameFromParams({game}: GameRouteParams): {game: PapyrusGame} {
    return {
        game: ValidPapyrusGames.get(toLowerCase(game as PapyrusGame)) ?? notFound()
    };
}
