function addValueToMappedArray<T, K>(map: Map<K, T[]>, key: K, value: T): void {
    const existing = map.get(key);
    if (existing) existing.push(value);
    else map.set(key, [value]);
}

export function aggregateSourceRecordWithNameRecordEntries<TInitialValue, TMapKey extends string | number | symbol, TTransformedValue, TAdditionalArgs extends readonly unknown[]>(
    recordEntries: readonly [Lowercase<string>, Record<TMapKey, TInitialValue>][],
    createAggregate: (name: TMapKey, valuesBySource: [source: Lowercase<string>, value: TInitialValue][], ...additionalArgs: TAdditionalArgs) => TTransformedValue,
    ...additionalArgsToPass: TAdditionalArgs
): Record<TMapKey, TTransformedValue> {
    const valuesByName = new Map<TMapKey, [source: Lowercase<string>, value: TInitialValue][]>();

    for (const [source, sourceRecord] of recordEntries) {
        for (const [name, value] of Object.entries(sourceRecord))
            addValueToMappedArray(valuesByName, name, [source, value]);
    }

    return Object.fromEntries(valuesByName.entries().map(([name, valuesBySource]) => [name, createAggregate(name, valuesBySource, ...additionalArgsToPass)]));
}
