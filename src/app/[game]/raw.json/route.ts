import { NextResponse, type NextRequest } from "next/server";
import { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { AllScripts } from "../../../papyrus/parsing/parse-or-load-all";

const PapyrusGamesCaseMapped = new Map<string, PapyrusGame>(Object.values(PapyrusGame).map(game => [game.toLowerCase(), game]));

export async function GET(_request: NextRequest, opts : { params: Promise<{ game: string }> }) {
    const { game } = await opts.params;
    const properCaseGame = PapyrusGamesCaseMapped.get(game.toLowerCase());
    if (properCaseGame === undefined) return NextResponse.json({ error: 'Invalid game' }, { status: 400 });

    return NextResponse.json(AllScripts[properCaseGame]);
}

export function generateStaticParams() {
    return Object.values(PapyrusGame).map(game => ({ game: game.toLowerCase() }));
}
