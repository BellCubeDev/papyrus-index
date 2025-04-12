import { useCallback, useRef, type RefObject } from "react";
import { memoizeDevServerConst } from "../../utils/memoizeDevServerConst";

type TimeoutIdentifier = ReturnType<typeof setTimeout>;

type StartF<T> = (delay: number, callback: () => void) => T;
type ClearF<T> = (knownTimeout: T | typeof CLEAR_ANY_TIMER) => boolean;

export const CLEAR_ANY_TIMER: unique symbol = memoizeDevServerConst('<useStoredTimeout/useStoredInterval> CLEAR_ANY_TIMER', () => Symbol('<useStoredTimeout/useStoredInterval> CLEAR_ANY_TIMER')) as any;

export function useStoredTimeout(): {currentTimeoutRef: RefObject<TimeoutIdentifier | null>, start: StartF<TimeoutIdentifier>, clear: ClearF<TimeoutIdentifier>} {
    const currentTimeoutRef = useRef<TimeoutIdentifier>(null);

    const start = useCallback((delay: number, callback: () => void) => {
        const oldTimeout = currentTimeoutRef.current;
        if (oldTimeout) clearTimeout(oldTimeout);
        const newTimeout = setTimeout(callback, delay);
        currentTimeoutRef.current = newTimeout;
        return newTimeout;
    }, []);

    const clear = useCallback((knownTimeout: TimeoutIdentifier | typeof CLEAR_ANY_TIMER)=> {
        const currentTimeout = currentTimeoutRef.current;
        console.log('Clearing timeout', {knownTimeout, currentTimeout, isEqual: knownTimeout === currentTimeout});
        if (knownTimeout !== currentTimeout && knownTimeout !== CLEAR_ANY_TIMER) return false;
        if (!currentTimeout) return knownTimeout === CLEAR_ANY_TIMER;
        clearTimeout(currentTimeout);
        currentTimeoutRef.current = null;
        return true;
    }, []);

    return { currentTimeoutRef, start, clear };
}

type IntervalIdentifier = ReturnType<typeof setInterval>;

export function useStoredInterval(): {currentIntervalRef: RefObject<IntervalIdentifier | null>, start: StartF<IntervalIdentifier>, clear: ClearF<IntervalIdentifier>} {
    const currentIntervalRef = useRef<IntervalIdentifier>(null);

    const start = useCallback((delay: number, callback: () => void) => {
        const oldInterval = currentIntervalRef.current;
        if (oldInterval) clearInterval(oldInterval);
        const newInterval = setInterval(callback, delay);
        currentIntervalRef.current = newInterval;
        return newInterval;
    }, []);

    const clear = useCallback((knownInterval: IntervalIdentifier | typeof CLEAR_ANY_TIMER) => {
        const currentInterval = currentIntervalRef.current;
        if (knownInterval !== currentInterval && knownInterval !== CLEAR_ANY_TIMER) return false;
        if (!currentInterval) return knownInterval === CLEAR_ANY_TIMER;
        clearInterval(currentInterval);
        currentIntervalRef.current = null;
        return true;
    }, []);

    return { currentIntervalRef, start, clear };
}
