import { useEffect, useState } from "react";

export const PREFERS_REDUCED_MOTION_QUERY = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)')
    // eslint-disable-next-line no-empty-function -- gotta mock the thing somehow!
    : ({ matches: false, addEventListener(){}, removeEventListener(){}, media: '', onchange: null, dispatchEvent: ()=>true, addListener(){}, removeListener(){} } satisfies MediaQueryList) as MediaQueryList;

/**
 * A hook that returns whether the user prefers reduced motion and updates when the user changes their preference.
 * @returns `true` if user prefers reduced motion and `false` if they do not have a preference set.
 */
export function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(PREFERS_REDUCED_MOTION_QUERY.matches);

    useEffect(() => {
        const listener = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
        PREFERS_REDUCED_MOTION_QUERY.addEventListener('change', listener);
        return () => PREFERS_REDUCED_MOTION_QUERY.removeEventListener('change', listener);
    }, []);

    return prefersReducedMotion;
}
