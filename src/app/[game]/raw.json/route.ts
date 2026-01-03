import { NextResponse, type NextRequest } from "next/server";
import { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { AllScripts } from "../../../papyrus/parsing/parse-or-load-all";
import { toLowerCase } from "../../../utils/toLowerCase";
import { getGameFromParams } from "@/app/[game]/getGameFromParams";

export async function GET(_request: NextRequest, opts : { params: Promise<{ game: string }> }) {
    const { game } = getGameFromParams(await opts.params);
    return NextResponse.json(AllScripts[game]);
}

export function generateStaticParams() {
    return Object.values(PapyrusGame).map(game => ({ game: toLowerCase(game) }));
}
