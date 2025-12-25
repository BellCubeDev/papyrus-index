import { useSyncExternalStore, type RefObject } from "react";

type ValueIshBaseKeys = {
    value: string;
    checked: boolean;
};
type ValueIshBaseKey = keyof ValueIshBaseKeys;

type PossibleValueIshSuffix = '' | `As${Capitalize<string>}`
type AnyValueIshKeys<TBaseKey extends ValueIshBaseKey = ValueIshBaseKey> = `${TBaseKey}${PossibleValueIshSuffix}`;

// You know, I tried using string template inference. This ended poorly.
//
// TypeScript would infer the full type in the "extends" clause,
// which would cause "valueAsDate" extends `${infer K extends ValueIshBaseKey}${PossibleValueIshSuffix}` to return K = "value" | "checked"!
//
// So, instead, we instead find all keys which start with a base key and map them to their corresponding default key.
// Like absolute cavemen.

type DefaultKeyForValueIshKeyObject<T extends object> = UnionToIntersection<{
    [TBaseKey in ValueIshBaseKey]: {
        [K in Extract<keyof T, AnyValueIshKeys<TBaseKey>>]: `default${Capitalize<TBaseKey>}`
    }
}[ValueIshBaseKey]>

type DefaultKeyForValueIshKey<T extends object, TValueKey extends keyof T & AnyValueIshKeys> = TValueKey extends keyof DefaultKeyForValueIshKeyObject<T> ? DefaultKeyForValueIshKeyObject<T>[TValueKey] : never;

/**
 * A custom hook to get the value of an input the React way.
 *
 * Requires that you bring your own ref for React's automatic inferences to work correctly (ESLint, React Compiler, etc.)
 *
 * Under the hood, uses `useSyncExternalStore(...)` to subscribe to changes in the input element's value.
 * Subscribes to the `input` and `change` events of the input element to keep the value in sync with the DOM.
 *
 * @param defaultValue The default value of the input element. Will be returned for you to pass to the input element as its defaultValue prop, maintaining a single source of truth.
 * @param valueKey The key of the input element that holds its current value, typically "value," but could be any key that follows the pattern `value${string}` (such as "valueAsNumber" or "valueAsDate")
 * @returns A tuple containing the default value and the current value of the input element.
 */
export function useInputValue<TElementType extends HTMLElement, TValueKey extends keyof TElementType & AnyValueIshKeys>(
    ref: RefObject<TElementType | null>,
    valueKey: TValueKey,
    defaultValue: TElementType[keyof TElementType & DefaultKeyForValueIshKey<TElementType, TValueKey>]
) {
    const value = useSyncExternalStore(
        (sendChanged) => {
            const input = ref.current;
            if (!input) return ()=>{/* empty */};

            input.addEventListener('input', sendChanged);
            input.addEventListener('change', sendChanged);
            return () => {
                input.removeEventListener('input', sendChanged);
                input.removeEventListener('change', sendChanged);
            };
        },
        () => ref.current ? ref.current[valueKey] : defaultValue,
        () => defaultValue,
    );

    return [defaultValue, value] as const;
}
