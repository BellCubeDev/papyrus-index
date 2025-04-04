import type { PapyrusScriptPropertyIndexed, PapyrusScriptPropertyIndexedAggregate } from "../../data-structures/indexing/property";
import type { PapyrusGame } from "../../data-structures/pure/game";
import { aggregateGenericValue } from "./aggregateGenericValue";
import { type AggregatePropertyGroupContext } from "./aggregatePropertyGroup";
import { aggregateSourceRecordWithNameRecordEntries } from "./aggregateSourceRecordWithNameRecord";
import { serializePapyrusTypeForAggregation } from "./serializePapyrusTypeForAggregation";

export function aggregateProperty<TGame extends PapyrusGame>(
    _name: Lowercase<string>,
    valuesBySource: [source: Lowercase<string>, value: PapyrusScriptPropertyIndexed<TGame>][],
    ctx: AggregatePropertyGroupContext<TGame>,
): PapyrusScriptPropertyIndexedAggregate<TGame> {
    return {
        $entityId: ctx.nextEntityIdRef.nextEntityId++,
        $sources: Object.fromEntries(valuesBySource),
        auto: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.auto, value.auto], null),
        constant: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.constant, value.constant], null),
        documentationComment: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.documentationComment, value.documentationComment], null),
        documentationString: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.documentationString, value.documentationString], null),
        hidden: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.hidden, value.hidden], null),
        hasGetter: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.hasGetter, value.hasGetter], null),
        hasSetter: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.hasSetter, value.hasSetter], null),
        mandatory: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.mandatory, value.mandatory], null),
        name: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.name, value.name], null),
        value: aggregateGenericValue(valuesBySource, ([source, value]) => [source, serializePapyrusTypeForAggregation(value.value), value.value], null),
        script: ctx.unfinishedScriptAggregateRef,
        group: ctx.unfinishedPropertyGroupAggregateRef,
        game: ctx.unfinishedGameRef,
    };
}

export function aggregatePropertiesRecord<TGame extends PapyrusGame>(
    recordEntries: [Lowercase<string>, Record<Lowercase<string>, PapyrusScriptPropertyIndexed<TGame>>][],
    ctx: AggregatePropertyGroupContext<TGame>,
) {
    return aggregateSourceRecordWithNameRecordEntries(recordEntries, aggregateProperty, ctx);
}
