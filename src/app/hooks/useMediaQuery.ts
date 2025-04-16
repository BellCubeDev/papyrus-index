import { useEffect, useState } from "react";

const MediaQueryMap = new Map<string, MediaQueryList & {refCount: number}>();

function getQuery(query: string): Pick<MediaQueryList, 'matches' | 'addEventListener' | 'removeEventListener'> & {refCount: number} {
    const existingQuery = MediaQueryMap.get(query);
    if (existingQuery) return existingQuery;
    const mediaQuery = Object.assign(
        typeof window !== 'undefined' ? window.matchMedia(query) : { matches: false } as MediaQueryList,
        { refCount: 0 }
    );
    MediaQueryMap.set(query, mediaQuery);
    return mediaQuery;
}

/**
 * A hook that returns whether the provided media query matches the current environment
 */
export function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(() => getQuery(query).matches);

    useEffect(() => {
        const mediaQuery = getQuery(query);
        setMatches(mediaQuery.matches);
        const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
        mediaQuery.addEventListener('change', listener);
        mediaQuery.refCount++;
        return () => {
            mediaQuery.removeEventListener('change', listener);
            mediaQuery.refCount--;
            requestAnimationFrame(() => {
                if (mediaQuery.refCount === 0) MediaQueryMap.delete(query);
            });
        };
    }, [query]);

    return matches;
}
