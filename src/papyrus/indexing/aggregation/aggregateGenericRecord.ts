import { aggregateGenericValue, type DoNotIncludeInAggregate } from "./aggregateGenericValue";

/** Rather than aggregating the Record<> itself, aggregate each key/value pair in the provided Record<>s. */
export function aggregateGenericRecord<TRecordKey extends string|number|symbol, TRecordValue, TRecordPairing, TAggregated, TIdentifierType>(
    /** The records to map out */
    records: Record<TRecordKey, TRecordValue>[],
    recordPairings: TRecordPairing[],
    getAggregation: (value: [TRecordPairing, TRecordValue | undefined]) => typeof DoNotIncludeInAggregate | [identifier: TIdentifierType, aggregationKey: string|number|undefined|null, value: TAggregated],
    chooseAggregateRepresentative: null | ((a: TAggregated, b: TAggregated) => TAggregated),
): Record<TRecordKey, [identifiers: TIdentifierType[], aggregated: TAggregated][]>{
    const keys = new Set(records.flatMap(Object.keys) as TRecordKey[]);
    const identifiers = new Set<TIdentifierType>();
    const newRecord = {} as Record<TRecordKey, [TIdentifierType[], TAggregated][]>;
    for (const key of keys) {
        if (typeof key !== 'string') throw new Error('Non-string keys not supported by aggregateRecordValue()!');
        const keyValues = records.map((record, index) => [recordPairings[index], record[key]] as [TRecordPairing, TRecordValue | undefined]);
        newRecord[key] = aggregateGenericValue(keyValues, getAggregation, chooseAggregateRepresentative, identifiers);
    }

    return newRecord;
}
