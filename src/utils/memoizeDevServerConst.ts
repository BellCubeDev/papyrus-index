/* eslint-disable no-multi-assign */

declare global {
    var ___MemoizedDevServerConsts: Record<string, unknown>; // eslint-disable-line vars-on-top, no-var
    interface Window {
        ___MemoizedDevServerConsts: Record<string, unknown>;
    }
}

/**
 * Memoize a constant for Next.js' development server. Speeds up hot reloads and prevents the server from regenerating Symbol values.
 *
 * ---
 *
 * Return type is the return type of valueF, however this will not work for `unique symbol` types. You will need to explicitly set
 * the `unique symbol` type on your variable and cast this function's return value to `as any`. For example:
 * ```ts
 * export const UnknownPapyrusScript: unique symbol = memoizeDevServerConst('UnknownPapyrusScript', ()=>Symbol('UnknownPapyrusScript')) as any;
 * ```
 *
 * ---
 *
 * <br /> <br />
 *
 * @param key Cache key to use for the constant. This MUST be unique for each constant.
 * @param valueF Function to generate the constant if it doesn't exist.
 * @returns The constant value.
 */
export function memoizeDevServerConst<TValueType>(key: string, valueF: ()=>TValueType): TValueType {
    let memoConsts: Record<string, unknown>;
    if (typeof window !== 'undefined') memoConsts = window.___MemoizedDevServerConsts ??= {};
    else memoConsts = globalThis.___MemoizedDevServerConsts ??= {};

    memoConsts[key] ??= valueF();
    return memoConsts[key] as TValueType;
}
