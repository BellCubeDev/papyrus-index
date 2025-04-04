import React from 'react';
import { updateRef } from './updateRef';

/**
 * Returns a ref that is updated every time the value changes.
 *
 * Intended as an escape hatch for react-hooks/exhaustive-deps
 * when you EXPLICITLY do not want a value to trigger a re-run of useEffect or similar.
 *
 * @param value The value to store in the ref
 * @returns A ref that is updated on every render with the value you passed
 */
export function useUpdatedRef<T>(value: T) {
    const ref = React.useRef(value);
    React.useEffect(() => {
        updateRef(ref, value);
    }, [value]);
    return ref;
}
