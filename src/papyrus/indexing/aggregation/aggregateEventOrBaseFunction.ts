import type { PapyrusFeature, PapyrusFeatureSupportedGames } from "@/papyrus/feature-support";
import { UnreachableError } from "../../../UnreachableError";
import type { PapyrusScriptEventOrBaseFunctionIndexed, PapyrusScriptEventOrBaseFunctionIndexedAggregate, PapyrusScriptFunctionParameterIndexed } from "../../data-structures/indexing/function";
import { type PapyrusScriptTypeScriptInstanceIndexed, type PapyrusScriptTypeStructIndexed } from "../../data-structures/indexing/type";
import type { PapyrusGame } from "../../data-structures/pure/game";
import { aggregateGenericValue } from "./aggregateGenericValue";
import type { AggregateScriptContext } from "./aggregateScript";
import { aggregateSourceRecordWithNameRecordEntries } from "./aggregateSourceRecordWithNameRecord";
import { mergeValue, PapyrusTypeMergeFailureReason, PapyrusValueMergeFailureReason } from "./mergeType";
import { serializePapyrusTypeForAggregation } from "./serializePapyrusTypeForAggregation";

export function aggregateEventOrBaseFunction<TGame extends PapyrusGame>(
    _name: Lowercase<string>,
    valuesBySource: [source: Lowercase<string>, value: PapyrusScriptEventOrBaseFunctionIndexed<TGame>][],
    ctx: AggregateScriptContext<TGame>
): PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame> {
    const parameters: (PapyrusScriptFunctionParameterIndexed<TGame> & {$sources: Record<Lowercase<string>, PapyrusScriptFunctionParameterIndexed<TGame>>})[] = [];
    for (const [source, value] of valuesBySource) {
        for (let i = 0; i < value.parameters.length; i++) {
            const newParameter = value.parameters[i]!;
            let existingParameter = parameters[i];
            if (!existingParameter) {
                existingParameter = {...newParameter, $sources: {
                    [source]: newParameter,
                }};
                parameters[i] = existingParameter;
                continue;
            }

            const merged = mergeValue(newParameter.value, existingParameter.value, !newParameter.isRequired && !existingParameter.isRequired);
            if (typeof merged === 'string') {
                switch (merged) {
                    case PapyrusTypeMergeFailureReason.IsArrayMismatch:
                        throw new Error(`Parameter ${i} of Papyrus function ${value.script.namespaceName}${value.name}() has conflicting array types: ${newParameter.value.isArray} (from source ${source}) and ${existingParameter.value.isArray} (from sources ${Object.keys(existingParameter.$sources).join(', ')})`);
                    case PapyrusTypeMergeFailureReason.ArchetypeMismatch:
                        throw new Error(`Parameter ${i} of Papyrus function ${value.script.namespaceName}${value.name}() has conflicting types: ${serializePapyrusTypeForAggregation(newParameter.value)} (from source ${source}) and ${serializePapyrusTypeForAggregation(existingParameter.value)} (from sources ${Object.keys(existingParameter.$sources).join(', ')})`);
                    case PapyrusTypeMergeFailureReason.ScriptMismatch:
                        throw new Error(`Parameter ${i} of Papyrus function ${value.script.namespaceName}${value.name}() has conflicting script names: ${(newParameter.value as PapyrusScriptTypeScriptInstanceIndexed<boolean, true, TGame>).scriptName} (from source ${source}) and ${(existingParameter.value as PapyrusScriptTypeScriptInstanceIndexed<boolean, true, TGame>).scriptName} (from sources ${Object.keys(existingParameter.$sources).join(', ')})`);
                    case PapyrusTypeMergeFailureReason.StructMismatch:
                        throw new Error(`Parameter ${i} of Papyrus function ${value.script.namespaceName}${value.name}() has conflicting struct names: ${(newParameter.value as PapyrusScriptTypeStructIndexed<boolean, true, PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>).structName} (from source ${source}) and ${(existingParameter.value as PapyrusScriptTypeStructIndexed<boolean, true, PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>).structName} (from sources ${Object.keys(existingParameter.$sources).join(', ')})`);
                    case PapyrusValueMergeFailureReason.DefaultValueMismatch:
                        throw new Error(`Parameter ${i} of Papyrus function ${value.script.namespaceName}${value.name}() has conflicting default values: "${newParameter.value.value}" (from source ${source}) and "${existingParameter.value.value}" (from sources ${Object.keys(existingParameter.$sources).join(', ')})`);
                    default:
                        throw new UnreachableError(merged, `Unknown Papyrus value merge failure reason "${merged}" for parameter ${i} of Papyrus function ${value.script.namespaceName}${value.name}() from source ${source}`);
                }
            }

            existingParameter.value = merged;
            existingParameter.isRequired &&= newParameter.isRequired;

            parameters[i]!.$sources![source] = newParameter;
        }
    }

    return {
        $entityId: ctx.nextEntityIdRef.nextEntityId++,
        $sources: Object.fromEntries(valuesBySource),
        name: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.name, value.name], null),
        parameters,
        parametersRaw: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.parameters.map((p)=>`${p.name.toLowerCase()}::${serializePapyrusTypeForAggregation(p.value)}`).join('\n'), value.parameters], null),
        documentationComment: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.documentationComment, value.documentationComment], null),
        documentationString: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.documentationString, value.documentationString], null),
        isBetaOnly: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.isBetaOnly, value.isBetaOnly], null),
        isDebugOnly: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.isDebugOnly, value.isDebugOnly], null),
        script: ctx.unfinishedScriptAggregateRef,
        game: ctx.unfinishedGameRef,
    };
}

export function aggregateEventsOrBaseFunctionsRecord<TGame extends PapyrusGame>(
    recordEntries: [Lowercase<string>, Record<Lowercase<string>, PapyrusScriptEventOrBaseFunctionIndexed<TGame>>][],
    ctx: AggregateScriptContext<TGame>,
) {
    return aggregateSourceRecordWithNameRecordEntries(recordEntries, aggregateEventOrBaseFunction, ctx);
}
