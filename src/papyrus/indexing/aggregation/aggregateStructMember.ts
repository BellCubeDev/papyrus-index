import type { PapyrusFeature, PapyrusFeatureSupportedGames } from "@/papyrus/feature-support";
import type { PapyrusScriptStructMemberIndexed, PapyrusScriptStructMemberIndexedAggregate } from "../../data-structures/indexing/struct";
import { aggregateGenericValue } from "./aggregateGenericValue";
import { aggregateSourceRecordWithNameRecordEntries } from "./aggregateSourceRecordWithNameRecord";
import type { AggregateStructContext } from "./aggregateStruct";
import { serializePapyrusTypeForAggregation } from "./serializePapyrusTypeForAggregation";

export function aggregateStructMember<TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs>>(
    _name: Lowercase<string>,
    valuesBySource: [source: Lowercase<string>, value: PapyrusScriptStructMemberIndexed<TGame>][],
    ctx: AggregateStructContext<TGame>,
): PapyrusScriptStructMemberIndexedAggregate<TGame> {
    return {
        $entityId: ctx.nextEntityIdRef.nextEntityId++,
        $sources: Object.fromEntries(valuesBySource),
        name: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.name, value.name], null),
        documentationComment: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.documentationComment, value.documentationComment], null),
        documentationString: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.documentationString, value.documentationString], null),
        value: aggregateGenericValue(valuesBySource, ([source, value]) => [source, serializePapyrusTypeForAggregation(value.value), value.value], null),
        script: ctx.unfinishedScriptAggregateRef,
        hidden: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.hidden, value.hidden], null),
        mandatory: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.mandatory, value.mandatory], null),
        struct: ctx.unfinishedStructAggregateRef,
        game: ctx.unfinishedGameRef,
    };
}

export function aggregateStructMembersRecord<TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs>>(
    recordEntries: [Lowercase<string>, Record<Lowercase<string>, PapyrusScriptStructMemberIndexed<TGame>>][],
    ctx: AggregateStructContext<TGame>,
) {
    return aggregateSourceRecordWithNameRecordEntries(
        recordEntries,
        aggregateStructMember,
        ctx,
    );
}
