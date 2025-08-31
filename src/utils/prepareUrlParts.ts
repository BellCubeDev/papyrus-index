import { toLowerCase } from "./toLowerCase";

declare const IS_PREPARED_URL_PARTS: unique symbol; // not real
export type PreparedURLParts = Lowercase<`/${string}/`> & {readonly [IS_PREPARED_URL_PARTS]: true};

export function prepareUrlParts(...parts: readonly string[]): PreparedURLParts {
    return `/${parts
        .map(part => encodeURIComponent(toLowerCase(part)))
        .join('/')}/` as PreparedURLParts;
}
