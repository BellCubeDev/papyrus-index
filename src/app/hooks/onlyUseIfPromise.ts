import { use, type Usable } from "react";

function isContext(value: unknown): value is React.Context<unknown> {
    return typeof value === 'function' && value !== null && 'Provider' in value && 'Consumer' in value && '$$typeof' in value;
}


/*
    eslint-disable react-hooks/rules-of-hooks  -- this function itself should be treated as `use`
*/

export function onlyUseIfUsable<T>(value: T): T extends Usable<infer U> ? U : T {
    if (value instanceof Promise) return use(value) as T extends Usable<infer U> ? U : never;
    if (isContext(value)) return use(value) as T extends Usable<infer U> ? U : never;
    return value as T extends Usable<infer _U> ? never : T; // TypeScript, explain why I can't use `any` or `unknown` in there instead of `infer _U`
}

/* eslint-enable react-hooks/rules-of-hooks */
