import type { PapyrusScriptStructIndexed, PapyrusScriptStructIndexedAggregate } from "../../data-structures/indexing/struct";
import type { PapyrusGame } from "../../data-structures/pure/game";
import { aggregateGenericValue } from "./aggregateGenericValue";
import type { AggregateScriptContext } from "./aggregateScript";
import { aggregateSourceRecordWithNameRecordEntries } from "./aggregateSourceRecordWithNameRecord";
import { aggregateStructMembersRecord } from "./aggregateStructMember";

export interface AggregateStructContext<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> extends AggregateScriptContext<TGame> {
    unfinishedStructAggregateRef: PapyrusScriptStructIndexedAggregate<TGame>;
}

export function aggregateStruct<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>>(
    _name: Lowercase<string>,
    valuesBySource: [source: Lowercase<string>, value: PapyrusScriptStructIndexed<TGame>][],
    ctx: AggregateScriptContext<TGame>,
): PapyrusScriptStructIndexedAggregate<TGame> {
    const ref = {};

    const structContext: AggregateStructContext<TGame> = {
        ...ctx,
        unfinishedStructAggregateRef: ref as PapyrusScriptStructIndexedAggregate<TGame>,
    };

    return Object.assign(ref, {
        $entityId: ctx.nextEntityIdRef.nextEntityId++,
        $sources: Object.fromEntries(valuesBySource),
        name: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.name, value.name], null),
        documentationComment: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.documentationComment, value.documentationComment], null),
        documentationString: aggregateGenericValue(valuesBySource, ([source, value]) => [source, value.documentationString, value.documentationString], null),
        script: ctx.unfinishedScriptAggregateRef,
        members: aggregateStructMembersRecord(
            valuesBySource.map(([source, value]) => [source, value.members]),
            structContext,
        ),
        game: ctx.unfinishedGameRef,
    } satisfies PapyrusScriptStructIndexedAggregate<TGame>) as PapyrusScriptStructIndexedAggregate<TGame>;
}

export function aggregateStructsRecord<TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>>(
    recordEntries: [Lowercase<string>, Record<Lowercase<string>, PapyrusScriptStructIndexed<TGame>>][],
    ctx: AggregateScriptContext<TGame>,
) {
    return aggregateSourceRecordWithNameRecordEntries(recordEntries, aggregateStruct, ctx);
}
