/* eslint-disable @typescript-eslint/no-unused-vars */

type Awaitable<T> = T | Promise<T>;

type SingleEntryForObject<T extends {}> = { [K in keyof T]-?: [K, T[K]] }[keyof T];

interface ObjectConstructor {
    entries<T extends {}>(o: T): [SingleEntryForObject<T>, ...SingleEntryForObject<T>[]];
    entries<TKeyType extends string | number | symbol, TValueType>(o: Record<TKeyType, TValueType>): [TKeyType, TValueType][];

    keys<T extends {}>(o: T): keyof T extends never ? never : (keyof T & string)[];

    // Handle the special case of Record<> types, whose keys are optional but final types do not include undefined
    values<TValueType>(o: Record<any, TValueType>): TValueType[];
    keys<TKeyType extends string | number | symbol>(o:  Record<TKeyType, any>): TKeyType[];

    // Handle the general case of objects, where keys are either required *or* include undefined as a union
    values<T extends {}>(o: T): keyof T extends never ? never : [T[keyof T], ...T[keyof T][]];

    assign<T extends {}, U extends {}>(target: T, source: U): Omit<T, keyof U> & U;
    assign<T extends {}, U extends {}, V extends {}>(target: T, source1: U, source2: V): Omit<T, keyof U | keyof V> & Omit<U, keyof V> & V;

    fromEntries<TKeyType extends string | number | symbol, TValueType>(entries: Iterable<readonly [TKeyType, TValueType]>): Record<TKeyType, TValueType>;
}

/** A type representing the properties that must be specified to transform type TFromType into type TIntoType */
type ObjectAssignDiff<TFromType extends {}, TIntoType extends {}> = Partial<TIntoType> & {
    readonly [K in keyof TIntoType as K extends keyof TFromType ? TFromType[K] extends TIntoType[K] ? never : K : K]: TIntoType[K]
}
