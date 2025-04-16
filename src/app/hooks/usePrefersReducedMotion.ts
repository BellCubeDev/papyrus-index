import { useMediaQuery } from "./useMediaQuery";

/**
 * A hook that returns whether the user prefers reduced motion and updates when the user changes their preference.
 * @returns `true` if user prefers reduced motion and `false` if they do not have a preference set.
 */
export function usePrefersReducedMotion() {
    return useMediaQuery('(prefers-reduced-motion: reduce)');
}
