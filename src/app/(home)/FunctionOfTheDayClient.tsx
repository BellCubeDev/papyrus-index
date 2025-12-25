'use client';

import { useSyncExternalStore } from "react";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getTodaySinceEpoch = () => {
    const offsetMillis = -(new Date().getTimezoneOffset() * 60 * 1000);
    return Math.ceil((Date.now() + offsetMillis) / DAY_IN_MS);
};

export function FunctionOfTheDayClient({options}:{readonly options: [number, React.ReactElement][] }): React.ReactNode {

    const todaySinceEpoch = useSyncExternalStore(
        (rerender) => {
            const millisSinceDayStart = Date.now() - (DAY_IN_MS * (getTodaySinceEpoch() - 1));
            let intervalId: null | ReturnType<typeof setInterval> = null;
            const timeoutId = setTimeout(() => {
                rerender();
                intervalId = setInterval(rerender, DAY_IN_MS);
            }, DAY_IN_MS - millisSinceDayStart);

            const handleVisibilityChange = () => {
                if (!document.hidden) rerender();
            };

            document.addEventListener("visibilitychange", handleVisibilityChange);

            return () => {
                clearTimeout(timeoutId);
                if (intervalId !== null) window.clearInterval(intervalId);
                document.removeEventListener("visibilitychange", handleVisibilityChange);
            };
        },
        () => getTodaySinceEpoch(),
        () => null
    );

    if (todaySinceEpoch === null) return <div>Loading...</div>;
    //console.log(options);
    return (options.find(([day, _]) => day === todaySinceEpoch) ?? options[1])?.[1] || <div>Function of the day not found! Something must have broken.</div>;
}
