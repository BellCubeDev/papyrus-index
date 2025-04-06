import type { RefObject } from "react";

/** A hack around React's ESLint rules so we can access the `current` prop when we know we need it. */
export function useRefObjectValue<T>(value: RefObject<T>): T {
    return value.current;
}
