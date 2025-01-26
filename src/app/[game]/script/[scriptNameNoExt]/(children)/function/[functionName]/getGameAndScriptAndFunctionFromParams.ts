import { notFound } from "next/navigation";
import { getGameAndScriptFromParams, type ScriptRouteParams } from "../../../getGameAndScriptFromParams";
import { AllSourcesCombined } from "../../../../../../../papyrus/data-structures/indexing/game";
import { toLowerCase } from "../../../../../../../utils/toLowerCase";
import type { PapyrusScriptFunctionIndexed } from "../../../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../../../papyrus/data-structures/pure/game";

export type FunctionRouteParams = ScriptRouteParams & {readonly functionName: string};

export function getGameAndScriptAndFunctionFromParams(params: FunctionRouteParams): ReturnType<typeof getGameAndScriptFromParams> & {readonly func: [Lowercase<string>[], PapyrusScriptFunctionIndexed<PapyrusGame>][]} {
    const base = getGameAndScriptFromParams(params);
    const func = base.scriptBySources[AllSourcesCombined].functions[toLowerCase(params.functionName)];
    if (!func) return notFound();
    return {...base, func};
}
