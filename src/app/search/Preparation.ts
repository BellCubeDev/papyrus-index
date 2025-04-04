import fuzzysort from "fuzzysort";

/* =====================
 *  WELCOME TO INSANITY
 * =====================
 * We're your hosts---search indexing, IndexedDB, web workers, getter values, and Symbol values!
 *
 * This file does a lot of wizardry to accomplish 3 simple goals:
 * - Prepare objects recursively for faster use with Fuzzysort
 * - Ready those prepared objects for use with APIs that implement structured cloning (in our case, IndexedDB and communication from workers to the main thread)
 *     - Print getter values into regular values
 *     - Convert symbols to special string values
 * - Lazily undo the preparation we just did now that we're on the main thread (aside from undoing the printed getter values)
 *     - This is lazy because doing so proactively caused a massive performance hit when tested
*/

// Unused, fake symbols to trick TypeScript into only inferring the types we want it to infer
// and to store the original object in the `PreparedForMark` type.
/** THIS SYMBOL DOES NOT EXIST. YOU HAVE BEEN WARNED. */
declare const IS_PREPARED: unique symbol;
/** THIS SYMBOL DOES NOT EXIST. YOU HAVE BEEN WARNED. */
declare const PREPARED_FOR: unique symbol;
type ReservedSymbol = typeof IS_PREPARED | typeof PREPARED_FOR;

export const SYMBOL_PREFIX = '**&&^^%%$##@@!!PAPYRUS_INDEX_SYMBOL_______' as const;

export function getStringForSymbol(s: symbol): `${typeof SYMBOL_PREFIX}${string}` {
    return `${SYMBOL_PREFIX}${String(s)}`;
}


export type PreparedForMark<T> = {
    /** @deprecated THIS SYMBOL DOES NOT EXIST. YOU HAVE BEEN WARNED. */
    [PREPARED_FOR]: T;
    /** @deprecated THIS SYMBOL DOES NOT EXIST. YOU HAVE BEEN WARNED. */
    [IS_PREPARED]: unknown;
}

type MapTupleElementsToPrepared<T extends readonly [any, ...any[]]> =
T extends readonly [infer U, ...(infer R)]
        ? R extends [any, ...any[]]
            ? readonly [DeepPreparedValue<U>, ...MapTupleElementsToPrepared<R>]
            : readonly [DeepPreparedValue<U>]
        : never;


export type MapTupleToPrepared<T extends ReadonlyArray<unknown>> =
    (
        T extends readonly [any, ...any[]]
            ? (MapTupleElementsToPrepared<T> & {[K in keyof T as K extends ReservedSymbol | keyof ReadonlyArray<unknown> ? never : K]: DeepPreparedValue<T[K]>})
            : {
                [K in keyof T]: DeepPreparedValue<T[K]>
            }
    ) & {
        [IS_PREPARED]: true;
    } & PreparedForMark<T>;

export type DeepPreparedObject<T extends Record<any, any>> = {
    [K in keyof T as K extends symbol ? `${typeof SYMBOL_PREFIX}${string}` : K]: DeepPreparedValue<T[K]>
} & {
    [IS_PREPARED]: true;
} & PreparedForMark<T>;

export type Original<T extends PreparedForMark<unknown>> = T[typeof PREPARED_FOR];

export type DeepPreparedValue<T> =
    T extends string
        ? Fuzzysort.Prepared<T>
    : T extends symbol
        ? `${typeof SYMBOL_PREFIX}${string}` & PreparedForMark<T>
    : T extends null | number | boolean | bigint | undefined | ((...args: any[]) => any)
        ? T
    : T extends ReadonlyArray<any> ? MapTupleToPrepared<T>
    : T extends Record<any, any>
        ? DeepPreparedObject<T>
    : T;


export type MapTupleToUnprepared<T extends ReadonlyArray<any>> = {
    [K in keyof T as K extends ReservedSymbol | keyof ReadonlyArray<T> ? never : K]: DeepUnpreparedValue<T[K]>
} & ReadonlyArray<DeepUnpreparedValue<T[number]>>;

export type DeepUnpreparedObject<T> = {
    [K in keyof T as
        K extends `${typeof SYMBOL_PREFIX}${string}` ? never
        : T extends PreparedForMark<unknown>
            ? K extends keyof Original<T> ? K
            : never
        : K
    ]: DeepUnpreparedValue<T[K]>;
} & (T extends PreparedForMark<infer U> ? {
    [K in keyof U as K extends symbol ? K extends ReservedSymbol ? never : K : never]: DeepUnpreparedValue<DeepPreparedValue<U[K]>>;
} : {})

export type DeepUnpreparedValue<T> =
    T extends Fuzzysort.KeysResult<infer U>
        ? Fuzzysort.KeysResult<DeepUnpreparedValue<U>>
    : T extends PreparedForMark<infer U>
        ? U
    : T extends Fuzzysort.Prepared<infer U>
        ? U
    : T extends string | null | number | boolean | bigint | undefined | ((...args: any[]) => any)
        ? T
    : T extends ReadonlyArray<any> ? MapTupleToUnprepared<T>
    : T extends Record<any, any> ? DeepUnpreparedObject<T>
    : T;


export const AlreadyPreparedObjects = new WeakMap<Record<any, any>, DeepPreparedObject<any>>();
export function deepPrepareObject<T extends Record<any, any>>(obj: T): DeepPreparedObject<T> {
    if (AlreadyPreparedObjects.has(obj)) return AlreadyPreparedObjects.get(obj) as any;

    const prepared: any = {};
    AlreadyPreparedObjects.set(obj, prepared);

    for (const k of [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)]) {
        const v = obj[k as keyof typeof obj];
        let newKey: string;
        if (typeof k === 'symbol') {
            newKey = `${SYMBOL_PREFIX}${String(k)}`;
        } else {
            if (typeof k !== 'string') {
                console.error(`Unexpected key type "${typeof k}" in object:`, obj);
                throw new TypeError('Unexpected key type');
            }

            if (k.startsWith(SYMBOL_PREFIX)) throw new Error(`Key "${k}" starts with the reserved symbol prefix "${SYMBOL_PREFIX}" and may introduce an exploitable vulnerability or conflict!`);

            newKey = k;
        }
        prepared[newKey] = deepPrepare(v);
    }

    return prepared;
}

export function deepPrepare<T>(v: T): DeepPreparedValue<T> {
    return (
        typeof v === 'string'
            ? fuzzysort.prepare(v)
        : Array.isArray(v)
            ? v.map(deepPrepare as any)
        : v === null || typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint' || typeof v === 'undefined'
            ? v
        : typeof v === 'symbol'
            ? getStringForSymbol(v)
        : deepPrepareObject(v)
    ) as unknown as DeepPreparedValue<T>;
}



const AlreadyPreppedForBorderCrossing = new WeakMap<any, any>();
export function prepForBorderCrossingObject<T>(obj: T): T {
    if (AlreadyPreppedForBorderCrossing.has(obj)) return AlreadyPreppedForBorderCrossing.get(obj) as any;

    const prepared: any = {};
    AlreadyPreppedForBorderCrossing.set(obj, prepared);

    for (const k of Object.getOwnPropertyNames(obj) as (string & keyof typeof obj)[])
        prepared[k] = prepForBorderCrossing(obj[k]);

    return prepared;
}

export function prepForBorderCrossingArrayWithExtraProps<T extends any[]>(arr: T): T {
    const prepared: any = [];
    for (const k of Object.getOwnPropertyNames(arr)) {
        switch (k) {
            case '_score':
                prepared.score = arr['score' as any];
                break;
            default:
                prepared[k] = prepForBorderCrossing(arr[k as keyof T]);
        }
    }
    return prepared;
}

export function prepForBorderCrossing<T>(v: T): T {
    return (
        Array.isArray(v)
            ? prepForBorderCrossingArrayWithExtraProps(v)
        : typeof v === 'string' || typeof v === 'symbol' || v === null || typeof v === 'function' || typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint' || typeof v === 'undefined'
            ? v
        : prepForBorderCrossingObject(v)
    ) as T;
}



export const AlreadyUnpreparedObjects = new WeakMap<any, any>();

const ORIGINAL_TARGET = Symbol.for('ORIGINAL_TARGET');

//
// Rather than recursing over the entire data structure to
// unprepare each key and value, we use a Proxy to lazily
// compute the unprepared value of each key and value.
//
// This prevents us from doing unnecessary work and lets
// us spread it out as the values are needed.
//
// Took initial search rendering from roughly 1.3s to about 0.4s.
//

export function deepUnprepareObject<T>(obj: T): DeepUnpreparedObject<T> {
    if (AlreadyUnpreparedObjects.has(obj)) return AlreadyUnpreparedObjects.get(obj) as any;

    // This object will hold computed, newly-unprepared values.
    const mapped = {} as DeepUnpreparedObject<T>;
    // @ts-ignore -- this is only here so we can see the original target in the debugger
    mapped[ORIGINAL_TARGET] = obj;

    const proxy = new Proxy(mapped, {
        get(target, key, receiver) {
            if (key in target) return Reflect.get(target, key, receiver);

            if (typeof key === "symbol")
                return this.get!(target as any, `${SYMBOL_PREFIX}${String(key)}`, receiver);


            const mappedValue = deepUnprepare(obj[key as keyof T]);
            (target as any)[key] = mappedValue;
            return mappedValue;
        },
        has(target, key) {
            if (key in target) return true;
            if (key in (obj as {})) return true;
            if (typeof key === 'symbol' && this.has!(target, getStringForSymbol(key))) return true;
            return false;
        },
        ownKeys(target) {
            const keys = new Set(Reflect.ownKeys(target));
            for (const k of Object.getOwnPropertyNames(obj)) {
                const newKey = k.startsWith(SYMBOL_PREFIX)
                    ? Symbol.for(k.slice(SYMBOL_PREFIX.length))
                    : k;
                keys.add(newKey);
            }
            return Array.from(keys);
        },
        getOwnPropertyDescriptor(target, key) {
            if (key in target) return Object.getOwnPropertyDescriptor(target, key);
            if (this.has!(target, key)) {
                return {
                    configurable: true,
                    enumerable: true,
                    get() {
                        return proxy[key as never];
                    }
                };
            }
            return undefined;
        }
    });

    AlreadyUnpreparedObjects.set(obj, proxy);
    return proxy;
}

// Lazy proxy for arrays with extra properties
function deepUnprepareArrayWithExtraProps<T extends any[]>(arr: T): DeepUnpreparedValue<T> {
    if (AlreadyUnpreparedObjects.has(arr)) return AlreadyUnpreparedObjects.get(arr) as any;

    // Use an array as the target for the proxy.
    const mapped = [] as DeepUnpreparedValue<T>;
    // @ts-ignore -- this is only here so we can see the original target in the debugger
    mapped[ORIGINAL_TARGET] = arr;

    const proxy = new Proxy(mapped, {
        get(target, key, receiver) {
            if (key === "length") return Reflect.get(arr, "length");
            if (key in target) return Reflect.get(target, key, receiver);

            if (!(key in arr)) return undefined;

            const value = arr[key as keyof T];
            const mappedValue = deepUnprepare(value);
            target[key as keyof typeof target] = mappedValue as any;
            return mappedValue;
        },
        has(target, key) {
            return key in target || key in arr;
        },
        ownKeys(target) {
            const keys = new Set([...Reflect.ownKeys(arr), ...Reflect.ownKeys(target)]);
            return Array.from(keys);
        },
        getOwnPropertyDescriptor(target, key) {
            if (key in target) return Object.getOwnPropertyDescriptor(target, key);

            if (!(key in arr)) return undefined;
            return {
                configurable: true,
                enumerable: true,
                get() {
                    return proxy[key as never];
                }
            };
        }
    });

    AlreadyUnpreparedObjects.set(arr, proxy);
    return proxy;
}

export function isFuzzysortPrepared(obj: any): obj is Fuzzysort.Prepared {
    return (
        obj &&
        typeof obj === "object" &&
        "target" in obj &&
        typeof obj.target === "string" &&
        "_bitflags" in obj &&
        typeof obj._bitflags === "number"
    );
}

function getSymbolFromString<T>(s: `${typeof SYMBOL_PREFIX}${string}` & PreparedForMark<T>): T {
    if (!s.startsWith(SYMBOL_PREFIX)) throw new Error(`String "${s}" does not start with the reserved symbol prefix "${SYMBOL_PREFIX}" and may introduce an exploitable vulnerability or conflict!`);
    return Symbol.for(s.slice(SYMBOL_PREFIX.length + 'Symbol('.length - 1)) as T;
}


export function deepUnprepare<T>(v: T): DeepUnpreparedValue<T> {
    const typeOfV = typeof v;
    return (
        isFuzzysortPrepared(v)
            ? v.target
        : Array.isArray(v)
            ? deepUnprepareArrayWithExtraProps(v)
        : typeOfV === "symbol"
            ? null as never // this should not be possible!
        : typeOfV === "string"
            ? getSymbolFromString(v as `${typeof SYMBOL_PREFIX}${string}` & PreparedForMark<any>)
        : v === null || typeOfV === "function" || typeOfV === "number" || typeOfV === "boolean" || typeOfV === "bigint" || typeOfV === "undefined"
            ? v
        : deepUnprepareObject(v)
    ) as any;
}
