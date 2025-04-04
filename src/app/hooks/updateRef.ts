import type { MutableRefObject, RefObject } from "react";

/**
 * A wonderful workaround for not being allowed to mutate hook props directly according to React Compiler, including with a ref.
 */
export function updateRef<T>(ref: RefObject<T> | MutableRefObject<T>, value: T) {
    (ref as RefObject<T>).current = value;
}
