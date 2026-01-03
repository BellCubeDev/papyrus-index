import { notFound } from "next/navigation";
import { AllScriptsIndexed } from "../../../../papyrus/indexing/index-all";
import { getGameFromParams, type GameRouteParams } from "../../getGameFromParams";
import type { PapyrusScriptBySources } from "../../../../papyrus/data-structures/indexing/game";
import type { PapyrusGame } from "../../../../papyrus/data-structures/pure/game";
import { unprepareUrlPart } from "@/utils/prepareUrlParts";

export type ScriptRouteParams = GameRouteParams & {readonly scriptNameNoExt: string};

export function getGameAndScriptFromParams(params: ScriptRouteParams): ReturnType<typeof getGameFromParams> & {scriptNameLowercase: Lowercase<string>, scriptBySources: PapyrusScriptBySources<PapyrusGame>} {
    const base = getGameFromParams(params);
    const gameData = AllScriptsIndexed[base.game];
    const scriptNameLowercase = unprepareUrlPart(params.scriptNameNoExt);
    const scriptBySources = gameData.scripts[scriptNameLowercase];
    if (!scriptBySources) return notFound();
    return {...base, scriptNameLowercase, scriptBySources};
}
