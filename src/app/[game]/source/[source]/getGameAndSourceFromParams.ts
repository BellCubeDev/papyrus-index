import { notFound } from "next/navigation";
import type { PapyrusScriptSourceIndexed } from "../../../../papyrus/data-structures/indexing/scriptSource";
import type { PapyrusGame } from "../../../../papyrus/data-structures/pure/game";
import { AllScriptsIndexed } from "../../../../papyrus/indexing/index-all";
import { getGameFromParams, type GameRouteParams } from "../../getGameFromParams";
import { unprepareUrlPart } from "@/utils/prepareUrlParts";

export type SourceRouteParams = GameRouteParams & {readonly source: string};

export function getGameAndSourceFromParams(params: SourceRouteParams): ReturnType<typeof getGameFromParams> & {source: PapyrusScriptSourceIndexed<PapyrusGame>} {
    const base = getGameFromParams(params);
    const gameData = AllScriptsIndexed[base.game];
    const sourceNameLowercase = unprepareUrlPart(params.source);
    const sourceObj = gameData.scriptSources[sourceNameLowercase];
    if (!sourceObj) return notFound();
    return {...base, source: sourceObj};
}
