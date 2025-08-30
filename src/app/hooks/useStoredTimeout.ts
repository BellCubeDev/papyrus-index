import { useCallback, useMemo, useRef, type RefObject } from "react";
import { memoizeDevServerConst } from "../../utils/memoizeDevServerConst";

type TimeoutIdentifier = ReturnType<typeof setTimeout>;

type StartF<T> = (delay: number, callback: () => void) => T;
type ClearF<T> = (knownTimeout: T | typeof CLEAR_ANY_TIMER) => boolean;
type IsCurrentF<T> = (knownTimeout: T | typeof CLEAR_ANY_TIMER) => boolean;

type UseTimerHookReturn<T, TCurrentStr extends string> = Record<`current${TCurrentStr}Ref`, RefObject<T | null>> & {
    start: StartF<T>;
    clear: ClearF<T>;
    isCurrent: IsCurrentF<T>;
}

export const CLEAR_ANY_TIMER: unique symbol = memoizeDevServerConst('<useStoredTimeout/useStoredInterval> CLEAR_ANY_TIMER', () => Symbol('<useStoredTimeout/useStoredInterval> CLEAR_ANY_TIMER')) as never;

/**
 * @returns A stable object with the following properties:
 * - `currentTimeoutRef`: A ref object that holds the current timeout identifier, or null if no timeout is set.
 * - `start`: A function to start a new timeout. It clears any existing timeout before starting a new one.
 * - `clear`: A function to clear a specific timeout (or any timeout if `CLEAR_ANY_TIMER` is passed). It returns true if a timeout was cleared, false otherwise.
 * - `isCurrent`: A function to check if a given timeout identifier is the current one. It returns true if it is, false otherwise.
 */
export function useStoredTimeout(): UseTimerHookReturn<TimeoutIdentifier, 'Timeout'> {
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
        if (knownTimeout !== currentTimeout && knownTimeout !== CLEAR_ANY_TIMER) return false;
        if (!currentTimeout) return knownTimeout === CLEAR_ANY_TIMER;
        clearTimeout(currentTimeout);
        currentTimeoutRef.current = null;
        return true;
    }, []);

    const isCurrent = useCallback((knownTimeout: TimeoutIdentifier | typeof CLEAR_ANY_TIMER) => {
        const currentTimeout = currentTimeoutRef.current;
        if (knownTimeout !== currentTimeout && knownTimeout !== CLEAR_ANY_TIMER) return false;
        return true;
    }, []);

    return useMemo(()=>({ currentTimeoutRef, start, clear, isCurrent }), [clear, isCurrent, start]);
}

type IntervalIdentifier = ReturnType<typeof setInterval>;

/**
 * @returns A stable object with the following properties:
 * - `currentIntervalRef`: A ref object that holds the current interval identifier, or null if no interval is set.
 * - `start`: A function to start a new interval. It clears any existing interval before starting a new one.
 * - `clear`: A function to clear a specific interval (or any interval if `CLEAR_ANY_TIMER` is passed). It returns true if an interval was cleared, false otherwise.
 * - `isCurrent`: A function to check if a given interval identifier is the current one. It returns true if it is, false otherwise.
 */
export function useStoredInterval(): UseTimerHookReturn<IntervalIdentifier, 'Interval'> {
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

    const isCurrent = useCallback((knownInterval: IntervalIdentifier | typeof CLEAR_ANY_TIMER) => {
        const currentInterval = currentIntervalRef.current;
        if (knownInterval !== currentInterval && knownInterval !== CLEAR_ANY_TIMER) return false;
        return true;
    }, []);

    return useMemo(() => ({ currentIntervalRef, start, clear, isCurrent }), [clear, isCurrent, start]);
}
