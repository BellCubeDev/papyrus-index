import { useCallback, useRef } from "react";

/**
 * A custom hook that returns a stable version of a callback function. Useful for event handlers or callbacks
 * that need to maintain a stable reference across renders to avoid unnecessary re-renders or re-subscriptions.
 *
 * This otherwise does not exist within React. The base useCallback() function returns a new reference any time
 * one of its dependencies changes, and useEffectEvent returns a value that you are forbidden from passing to
 * other hooks or components. These limitations prevent it from being used for its otherwise
 * most apt use case---DOM callbacks and other such event handlers from sources other than React.
 *
 */
export function useStableCallback<T extends (this: void, ...args: never[]) => unknown>(callback: T): T {
    /* eslint-disable react-no-manual-memo/no-hook-memo, react-hooks/refs */ // This is what optimization looks like!

    const ref = useRef(callback);
    ref.current = callback;

    return useCallback((...args: Parameters<T>) =>
        ref.current.call(undefined, ...args)
    , []) as T;
}
