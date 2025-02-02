'use client';

import { useEffect, useState } from "react";

export function FunctionOfTheDayClient({options}:{readonly options: [number, React.ReactElement][] }): React.ReactNode {

    const [todaySinceEpoch, setTodaySinceEpoch] = useState<number|null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const offsetMillis = -(new Date().getTimezoneOffset() * 60 * 1000);
        setTodaySinceEpoch(Math.ceil((Date.now() + offsetMillis) / (24 * 60 * 60 * 1000)));
    }, []);

    if (todaySinceEpoch === null) return <div>Loading...</div>;
    console.log(options);
    return (options.find(([day, _]) => day === todaySinceEpoch) ?? options[1])?.[1] || <div>Function of the day not found! Something must have broken.</div>;
}
