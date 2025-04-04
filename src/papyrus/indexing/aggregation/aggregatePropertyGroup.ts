import type { PapyrusScriptPropertyGroupIndexed, PapyrusScriptPropertyGroupIndexedAggregate } from "../../data-structures/indexing/propertyGroup";
import type { PapyrusGame } from "../../data-structures/pure/game";
import { aggregateGenericValue } from "./aggregateGenericValue";
import { aggregatePropertiesRecord } from "./aggregateProperty";
import type { AggregateScriptContext } from "./aggregateScript";
import { aggregateSourceRecordWithNameRecordEntries } from "./aggregateSourceRecordWithNameRecord";

export interface AggregatePropertyGroupContext<TGame extends PapyrusGame> extends AggregateScriptContext<TGame> {
    unfinishedPropertyGroupAggregateRef: PapyrusScriptPropertyGroupIndexedAggregate<TGame>;
}

export function aggregatePropertyGroup<TGame extends PapyrusGame>(
    _name: Lowercase<string>,
    valuesBySource: [source: Lowercase<string>, value: PapyrusScriptPropertyGroupIndexed<TGame>][],
    ctx: AggregateScriptContext<TGame>,
): PapyrusScriptPropertyGroupIndexedAggregate<TGame> {
    const ref = {};

    const groupContext: AggregatePropertyGroupContext<TGame> = {
        ...ctx,
        unfinishedPropertyGroupAggregateRef: ref as PapyrusScriptPropertyGroupIndexedAggregate<TGame>,
    };

    return Object.assign(ref, {
        $entityId: ctx.nextEntityIdRef.nextEntityId++,
        $sources: Object.fromEntries(valuesBySource),
        name: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.name, value.name], null),
        documentationComment: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.documentationComment, value.documentationComment], null),
        documentationString: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.documentationString, value.documentationString], null),
        script: ctx.unfinishedScriptAggregateRef,
        game: ctx.unfinishedGameRef,
        collapsed: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.collapsed, value.collapsed], null),
        properties: aggregatePropertiesRecord(valuesBySource.map(([source, value]) => [source, value.properties]), groupContext),
    } satisfies ObjectAssignDiff<{}, PapyrusScriptPropertyGroupIndexedAggregate<TGame>>);
}

export function aggregatePropertyGroupsRecord<TGame extends PapyrusGame>(
    recordEntries: [Lowercase<string>, Record<Lowercase<string>, PapyrusScriptPropertyGroupIndexed<TGame>>][],
    ctx: AggregateScriptContext<TGame>,
) {
    return aggregateSourceRecordWithNameRecordEntries(recordEntries, aggregatePropertyGroup, ctx);
}
