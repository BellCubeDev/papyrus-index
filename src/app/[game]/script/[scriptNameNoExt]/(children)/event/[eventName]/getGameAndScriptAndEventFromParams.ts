import { notFound } from "next/navigation";
import type { PapyrusScriptEventOrBaseFunctionIndexedAggregate } from "../../../../../../../papyrus/data-structures/indexing/function";
import { AllSourcesCombined } from "../../../../../../../papyrus/data-structures/indexing/game";
import type { PapyrusGame } from "../../../../../../../papyrus/data-structures/pure/game";
import { getGameAndScriptFromParams, type ScriptRouteParams } from "../../../getGameAndScriptFromParams";
import { unprepareUrlPart } from "@/utils/prepareUrlParts";

export type EventRouteParams = ScriptRouteParams & {readonly eventName: string};

export function getGameAndScriptAndEventFromParams(params: EventRouteParams): ReturnType<typeof getGameAndScriptFromParams> & {readonly evt: PapyrusScriptEventOrBaseFunctionIndexedAggregate<PapyrusGame>} {
    const base = getGameAndScriptFromParams(params);
    const evt = base.scriptBySources[AllSourcesCombined].events[unprepareUrlPart(params.eventName)];
    if (!evt) return notFound();
    return {...base, evt};
}
