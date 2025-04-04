import type { PapyrusPossibleScripts, PapyrusScriptIndexedAggregate } from "../../data-structures/indexing/script";
import type { PapyrusScriptStructIndexed, PapyrusScriptStructIndexedAggregate } from "../../data-structures/indexing/struct";
import type { PapyrusGame } from "../../data-structures/pure/game";
import type { IndexingContextGame, IndexingContextSource } from "../index-game";
import { aggregateEventsOrBaseFunctionsRecord } from "./aggregateEventOrBaseFunction";
import { aggregateFunctionsRecord } from "./aggregateFunction";
import { aggregateGenericValue } from "./aggregateGenericValue";
import { aggregatePropertyGroupsRecord } from "./aggregatePropertyGroup";
import { aggregateStructsRecord } from "./aggregateStruct";

export interface AggregateScriptContext<TGame extends PapyrusGame> extends IndexingContextGame<TGame> {
    unfinishedScriptAggregateRef: PapyrusScriptIndexedAggregate<TGame>;
}

/** Merges a Papyrus script aggregate (aggregate is by source) so create a single, unified definition that can be used for a quick reference. If scripts are clearly not compatible, will throw. */
export function aggregateScript<TGame extends PapyrusGame>(possibleScripts: PapyrusPossibleScripts<TGame>, ctx: IndexingContextGame<TGame>): PapyrusScriptIndexedAggregate<TGame> {
    const scriptEntries = Object.entries(possibleScripts);
    if (scriptEntries.length === 0) throw new Error('No scripts to merge!');

    const ref = {};

    type TGameNoSkyrim = Exclude<TGame, PapyrusGame.SkyrimSE>;

    const aggregateScriptContext: AggregateScriptContext<TGame> = {
        ...ctx,
        unfinishedScriptAggregateRef: ref as PapyrusScriptIndexedAggregate<TGame>,
    };

    return Object.assign(ref, {
        $entityId: ctx.nextEntityIdRef.nextEntityId++,
        $sources: possibleScripts,
        isConditional: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.isConditional, script.isConditional], null),
        isConst: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.isConst, script.isConst], null),
        default: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.default, script.default], null),
        extends: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.extendsName, script.extends], null),
        extendsName: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.extendsName, script.extendsName], null),
        isHidden: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.isHidden, script.isHidden], null),
        imports: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.importNames.join(','), script.imports], null),
        importNames: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.importNames.join(','), script.importNames], null),
        nameWithoutNamespace: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.nameWithoutNamespace, script.nameWithoutNamespace], null),
        namespaceName: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.namespaceName, script.namespaceName], null),
        namespace: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.namespace, script.namespace], null),
        isNative: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.isNative, script.isNative], null),
        isBetaOnly: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.isBetaOnly, script.isBetaOnly], null),
        isDebugOnly: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.isDebugOnly, script.isDebugOnly], null),
        documentationComment: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.documentationComment, script.documentationComment], null),
        documentationString: aggregateGenericValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.documentationString, script.documentationString], null),
        game: ctx.unfinishedGameRef,

        // combine all extendedBy and merge their sources together
        extendedBy: Object.fromEntries(scriptEntries.flatMap(([,script])=>Object.entries(script.extendedBy)).reduce((map: Map<string, PapyrusPossibleScripts<TGame>>, [scriptNameLowercase, extendedByItem]) => {
            const existing = map.get(scriptNameLowercase);
            if (existing) {
                Object.keys(extendedByItem).forEach(source => {existing[source] ??= extendedByItem[source]!});
                return map;
            } else {
                map.set(scriptNameLowercase, {...extendedByItem});
                return map;
            }
        }, new Map<Lowercase<string>, PapyrusPossibleScripts<TGame>>()).entries()),


        // Each of these will have its record values transformed into special aggregate types, similar to how aggregateScript itself works
        functions: aggregateFunctionsRecord(scriptEntries.map(([sourceIdentifier, script]) => [sourceIdentifier, script.functions]), aggregateScriptContext),
        structs: scriptEntries.some(v=>v[1].structs === null)
            ? null as TGame extends PapyrusGame.SkyrimSE ? null : never
            : aggregateStructsRecord(scriptEntries.map(([sourceIdentifier, script]) => [sourceIdentifier, script.structs as Record<Lowercase<string>, PapyrusScriptStructIndexed<TGameNoSkyrim>>]), aggregateScriptContext as AggregateScriptContext<TGameNoSkyrim>) as (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? Record<Lowercase<string>, PapyrusScriptStructIndexedAggregate<Exclude<TGame, PapyrusGame.SkyrimSE>>> : never) ,
        events: aggregateEventsOrBaseFunctionsRecord(scriptEntries.map(([sourceIdentifier, script]) => [sourceIdentifier, script.events] as const), aggregateScriptContext),
        propertyGroups: aggregatePropertyGroupsRecord(scriptEntries.map(([sourceIdentifier, script]) => [sourceIdentifier, script.propertyGroups]), aggregateScriptContext),
    } satisfies ObjectAssignDiff<{}, PapyrusScriptIndexedAggregate<TGame>>);
}
