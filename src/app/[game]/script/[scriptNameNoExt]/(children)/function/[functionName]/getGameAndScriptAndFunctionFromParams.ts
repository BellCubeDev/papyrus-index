import { notFound } from "next/navigation";
import type { PapyrusScriptFunctionIndexedAggregate } from "../../../../../../../papyrus/data-structures/indexing/function";
import { AllSourcesCombined } from "../../../../../../../papyrus/data-structures/indexing/game";
import type { PapyrusGame } from "../../../../../../../papyrus/data-structures/pure/game";
import { getGameAndScriptFromParams, type ScriptRouteParams } from "../../../getGameAndScriptFromParams";
import { unprepareUrlPart } from "@/utils/prepareUrlParts";

export type FunctionRouteParams = ScriptRouteParams & {readonly functionName: string};

export function getGameAndScriptAndFunctionFromParams(params: FunctionRouteParams): ReturnType<typeof getGameAndScriptFromParams> & {readonly func: PapyrusScriptFunctionIndexedAggregate<PapyrusGame>} {
    const base = getGameAndScriptFromParams(params);
    const func = base.scriptBySources[AllSourcesCombined].functions[unprepareUrlPart(params.functionName)];
    if (!func) return notFound();
    return {...base, func};
}
