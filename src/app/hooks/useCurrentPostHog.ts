import { useUpdatedRef } from "@/app/hooks/useUpdatedRef";
import { usePostHog } from "posthog-js/react";
import { useMemo } from "react";

/**
 * A hook which returns a stable reference to the current PostHog instance.
 *
 * @returns A stable Proxy which will always return the props of the latest PostHog object, and whose functions will always get and invoke the latest version when called
 */
export function useCurrentPostHog() {
    const posthog = usePostHog() as ReturnType<typeof usePostHog> | null | undefined;
    const posthogRef = useUpdatedRef(posthog);

    // eslint-disable-next-line react-hooks/refs, react-no-manual-memo/no-hook-memo -- this hook does funky things, man!
    const stableProxy = useMemo(() => new Proxy({} as Partial<NonNullable<typeof posthog>>, {
        get(_, prop: keyof NonNullable<typeof posthog>) {
            const currentPosthog = posthogRef.current;
            if (!currentPosthog) return undefined;
            const value = currentPosthog ? currentPosthog[prop] : undefined;
            if (typeof value === 'function') {
                return (...args: unknown[]) => {
                    const func = posthogRef.current ? posthogRef.current[prop] : undefined;
                    if (typeof func === 'function')
                        return func.apply(posthogRef.current, args);

                };
            }
            return value;
        }
    }), [posthogRef]);

    return stableProxy;
}
