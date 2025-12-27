import type { PapyrusFeature, PapyrusFeatureSupportedGames } from "@/papyrus/feature-support";
import { UnreachableError } from "../../../UnreachableError";
import type { PapyrusScriptEventOrBaseFunctionIndexedAggregate, PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate, PapyrusScriptFunctionIndexedAggregateReturnType } from "../../data-structures/indexing/function";
import type { PapyrusScriptTypeScriptInstanceIndexed, PapyrusScriptTypeStructIndexed } from "../../data-structures/indexing/type";
import type { PapyrusGame } from "../../data-structures/pure/game";
import { aggregateEventOrBaseFunction } from "./aggregateEventOrBaseFunction";
import { aggregateGenericValue } from "./aggregateGenericValue";
import type { AggregateScriptContext } from "./aggregateScript";
import { aggregateSourceRecordWithNameRecordEntries } from "./aggregateSourceRecordWithNameRecord";
import { mergeType, PapyrusTypeMergeFailureReason } from "./mergeType";
import { serializePapyrusTypeForAggregation } from "./serializePapyrusTypeForAggregation";

export function aggregateFunction<TGame extends PapyrusGame>(_name: Lowercase<string>, valuesBySource: [source: Lowercase<string>, value: PapyrusScriptFunctionIndexed<TGame>][], ctx: AggregateScriptContext<TGame>): PapyrusScriptFunctionIndexedAggregate<TGame> {
    return Object.assign(aggregateEventOrBaseFunction(_name, valuesBySource, ctx), {
        $sources: Object.fromEntries(valuesBySource),
        isGlobal: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.isGlobal, value.isGlobal], null),
        isNative: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.isNative, value.isNative], null),
        returnType: valuesBySource.reduce<PapyrusScriptFunctionIndexedAggregateReturnType<TGame> | null>((acc, [source, nextFunction]): PapyrusScriptFunctionIndexedAggregateReturnType<TGame> => {
            if (!acc) return (Object.assign as SimpleObjectAssign)(nextFunction.returnType, {$sources: {[source]: nextFunction.returnType}});
            const merged = mergeType(acc, nextFunction.returnType);
            if (typeof merged === 'string') {
                switch (merged) {
                    case PapyrusTypeMergeFailureReason.IsArrayMismatch:
                        throw new Error(`Return type of Papyrus function ${nextFunction.script.namespaceName}${nextFunction.name}() has conflicting array types: ${nextFunction.returnType.isArray} (from source ${source}) and ${acc.isArray} (from sources ${Object.keys(acc.$sources).join(', ')})`);
                    case PapyrusTypeMergeFailureReason.ArchetypeMismatch:
                        throw new Error(`Return type of Papyrus function ${nextFunction.script.namespaceName}${nextFunction.name}() has conflicting types: ${serializePapyrusTypeForAggregation(nextFunction.returnType)} (from source ${source}) and ${serializePapyrusTypeForAggregation(acc)} (from sources ${Object.keys(acc.$sources).join(', ')})`);
                    case PapyrusTypeMergeFailureReason.ScriptMismatch:
                        throw new Error(`Return type of Papyrus function ${nextFunction.script.namespaceName}${nextFunction.name}() has conflicting script names: ${(nextFunction.returnType as PapyrusScriptTypeScriptInstanceIndexed<boolean, true, TGame>).scriptName} (from source ${source}) and ${(acc as PapyrusScriptTypeScriptInstanceIndexed<boolean, true, TGame>).scriptName} (from sources ${Object.keys(acc.$sources).join(', ')})`);
                    case PapyrusTypeMergeFailureReason.StructMismatch:
                        throw new Error(`Return type of Papyrus function ${nextFunction.script.namespaceName}${nextFunction.name}() has conflicting struct names: ${(nextFunction.returnType as PapyrusScriptTypeStructIndexed<boolean, true, PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>).structName} (from source ${source}) and ${(acc as PapyrusScriptTypeStructIndexed<boolean, true, PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>).structName} (from sources ${Object.keys(acc.$sources).join(', ')})`);
                    default:
                        throw new UnreachableError(merged, `Unknown Papyrus type merge failure reason "${merged}" for return type of Papyrus function ${nextFunction.script.namespaceName}${nextFunction.name}() from source ${source}`);
                }
            }

            return (Object.assign as SimpleObjectAssign)(merged, {$sources: {...acc.$sources, [source]: nextFunction.returnType}});
        }, null)!,
        returnTypeRaw: aggregateGenericValue(valuesBySource, ([source, value]) => [source, serializePapyrusTypeForAggregation(value.returnType), value.returnType], null),
    } satisfies ObjectAssignDiff<PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>, PapyrusScriptFunctionIndexedAggregate<TGame>>);
}

export function aggregateFunctionsRecord<TGame extends PapyrusGame>(recordEntries: [Lowercase<string>, Record<Lowercase<string>, PapyrusScriptFunctionIndexed<TGame>>][], ctx: AggregateScriptContext<TGame>) {
    return aggregateSourceRecordWithNameRecordEntries(recordEntries, aggregateFunction, ctx);
}
