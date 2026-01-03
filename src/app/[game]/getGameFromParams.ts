import { notFound } from "next/navigation";
import type { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import { ValidPapyrusGames } from "../../utils/ValidPapyrusGames";
import { unprepareUrlPart } from "@/utils/prepareUrlParts";

export type GameRouteParams = {readonly game: string};

export function getGameFromParams({game}: GameRouteParams): {game: PapyrusGame} {
    return {
        game: ValidPapyrusGames.get(unprepareUrlPart(game)) ?? notFound()
    };
}
