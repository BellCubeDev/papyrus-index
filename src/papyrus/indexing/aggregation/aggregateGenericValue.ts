import { memoizeDevServerConst } from "../../../utils/memoizeDevServerConst";


export const DoNotIncludeInAggregate: unique symbol = memoizeDevServerConst('DoNotIncludeInAggregate', ()=>Symbol.for('PAPYRUS_INDEX_DoNotIncludeInAggregate')) as any;

/** Aggregates a value based on the provided predicate function. */
export function aggregateGenericValue<T, TAggregated, TIdentifierType>(
    values: T[],
    getAggregation: (value: T) => typeof DoNotIncludeInAggregate | [identifier: TIdentifierType, aggregationKey: string|number|boolean|undefined|null, value: TAggregated],
    chooseAggregateRepresentative: null | ((a: TAggregated, b: TAggregated) => TAggregated),
    identifiersSet?: Set<TIdentifierType>,
): [identifiers: TIdentifierType[], aggregated: TAggregated][] {
    const aggregationMap = new Map<unknown, [identifiers: TIdentifierType[], aggregated: TAggregated[]]>();
    for (const value of values) {
        const aggregationData = getAggregation(value);
        if (aggregationData === DoNotIncludeInAggregate) continue;
        identifiersSet?.add(aggregationData[0]);
        const [identifier, aggregationKey, aggregatedValue] = aggregationData;
        const existing = aggregationMap.get(aggregationKey);
        if (existing) {
            existing[0].push(identifier);
            existing[1].push(aggregatedValue);
            continue;
        }
        aggregationMap.set(aggregationKey, [[identifier], [aggregatedValue]]);
    }
    return Array.from(aggregationMap.values()).map(([identifiers, value]) => [identifiers, chooseAggregateRepresentative === null ? value[0]! : value.reduce(chooseAggregateRepresentative)]);
}
