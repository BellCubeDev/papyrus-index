import { useEffect, useState } from "react";

// we never clear this map out, which risks a theoretical memory leak---
// but we'll never add enough unique queries to actually reach that
const MediaQueryMap = new Map<string, MediaQueryList>();

function getQuery(query: string): Pick<MediaQueryList, 'matches' | 'addEventListener' | 'removeEventListener'> {
    const existingQuery = MediaQueryMap.get(query);
    if (existingQuery) return existingQuery;
    const mediaQuery = typeof window !== 'undefined' ? window.matchMedia(query) : { matches: false } as MediaQueryList;
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
        const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
        mediaQuery.addEventListener('change', listener);
        return () => {
            mediaQuery.removeEventListener('change', listener);
            MediaQueryMap.delete(query);
        };
    }, [query]);

    return matches;
}
