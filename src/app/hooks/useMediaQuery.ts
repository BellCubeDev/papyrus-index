import { useSyncExternalStore } from "react";

/**
 * A hook that returns whether the provided media query matches the current environment
 */
export function useMediaQuery(mediaQueryString: string, ssrFallback: boolean): boolean {
    return useSyncExternalStore(
        (callback) => {
            const mediaQuery = window.matchMedia(mediaQueryString);
            mediaQuery.addEventListener('change', callback);
            return () => mediaQuery.removeEventListener('change', callback);
        },
        () => window.matchMedia(mediaQueryString).matches,
        () => ssrFallback // SSR fallback
    );
}
