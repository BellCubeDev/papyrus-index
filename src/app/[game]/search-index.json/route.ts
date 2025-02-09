import { NextResponse, type NextRequest } from "next/server";
import { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { toLowerCase } from "../../../utils/toLowerCase";
import { getGameFromParams, type GameRouteParams } from "../getGameFromParams";
import { generateSearchIndex } from "./generateSearchIndex";

export async function GET(_request: NextRequest, opts : { params: Promise<GameRouteParams> }) {
    const { game } = getGameFromParams(await opts.params);
    return NextResponse.json(await generateSearchIndex(game));
}

export function generateStaticParams() {
    return Object.values(PapyrusGame).map(game => ({ game: toLowerCase(game) }));
}
