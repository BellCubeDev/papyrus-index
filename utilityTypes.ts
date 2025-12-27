/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
type Awaitable<T> = T | Promise<T>;

type SingleEntryForObject<T extends {}> = { [K in keyof T]-?: [K, T[K]] }[keyof T];

interface ObjectConstructor {
    entries<T extends {}>(o: T): [SingleEntryForObject<T>, ...SingleEntryForObject<T>[]];
    entries<TKeyType extends string | number | symbol, TValueType>(o: Record<TKeyType, TValueType>): [TKeyType, TValueType][];

    keys<T extends {}>(o: T): keyof T extends never ? never : (Extract<keyof T, string>)[];

    // Handle the special case of Record<> types, whose keys are optional but final types do not include undefined
    values<TValueType>(o: Record<any, TValueType>): TValueType[];
    keys<TKeyType extends string | number | symbol>(o:  Record<TKeyType, any>): TKeyType[];

    // Handle the general case of objects, where keys are either required *or* include undefined as a union
    values<T extends {}>(o: T): keyof T extends never ? never : [T[keyof T], ...T[keyof T][]];

    assign<T extends {}, U extends {}>(target: T, source: U): {} extends T ? U : Omit<T, keyof U> & U & {[K in Extract<OptionalKeyof<U>, keyof T>]: Extract<T[K] & U[K], undefined> extends never ? Exclude<T[K] | U[K], undefined> : T[K] | U[K]};
    assign<T extends {}, U extends {}, V extends {}>(target: T, source1: U, source2: V): Omit<T, keyof U | keyof V> & Omit<U, keyof V> & V;
    assign<T extends {}, U extends {}, V extends {}>(target: T, source1: U, source2: V): Omit<T, keyof U | keyof V> & Omit<U, keyof V> & V;

    fromEntries<TKeyType extends string | number | symbol, TValueType>(entries: Iterable<readonly [TKeyType, TValueType]>): Record<TKeyType, TValueType>;
}

type SimpleObjectAssign = {
    <T extends {}, U extends {}>(target: T, source: U): T & U;
    <T extends {}, U extends {}, V extends {}>(target: T, source1: U, source2: V): T & Omit<U, keyof V> & V;
    <T extends {}, U extends {}, V extends {}, W extends {}>(target: T, source1: U, source2: V, source3: W): T & Omit<U, keyof V | keyof W> & Omit<V, keyof W> & W;
    <T extends {}, U extends {}, V extends {}, W extends {}, X extends {}>(target: T, source1: U, source2: V, source3: W, source4: X): T & Omit<U, keyof V | keyof W | keyof X> & Omit<V, keyof W | keyof X> & Omit<W, keyof X> & X;
};

/** A type representing the properties that must be specified to transform type TFromType into type TIntoType */
type ObjectAssignDiff<TFromType extends {}, TIntoType extends {}> = {
    readonly [K in keyof TIntoType as K extends keyof TFromType ? TFromType[K] extends TIntoType[K] ? never : K : K]: TIntoType[K];
} & {
    readonly [K in keyof TIntoType as K extends keyof TFromType ? TFromType[K] extends TIntoType[K] ? K : never : never]?: TIntoType[K];
}

type RecordOfPromises<T> = { [K in keyof T]: Awaitable<T[K]> };
type RecordOfArrayOfPromises<T> = { [K in keyof T]: T[K] extends readonly (infer U)[] ? Awaitable<U>[] : Awaitable<T[K]> };

type OptionalKeyof<T extends object> = Exclude<{
    [K in keyof T]: T extends Record<K, T[K]>
        ? never
        : K
}[keyof T], undefined>

type RestoreLegacyOptionalKeys<T extends object> = Omit<T, OptionalKeyof<T>> & {
    [K in OptionalKeyof<T>]?: T[K] | undefined
}

type UnionToIntersection<U> = (U extends any ? (x: U)=>void : never) extends ((x: infer I)=>void) ? I : never
