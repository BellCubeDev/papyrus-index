import { toLowerCase } from "./toLowerCase";

declare const IS_PREPARED_URL_PARTS: unique symbol; // not real
export type PreparedURLParts = Lowercase<`/${string}/`> & {readonly [IS_PREPARED_URL_PARTS]: true};

export function prepareUrlPart(part: string) {
    part = toLowerCase(part);
    part = part.replaceAll(':', '~'); // Next.js handles colons weirdly
    part = encodeURIComponent(part);
    return part;
}

export function prepareUrlParts(...parts: readonly string[]): PreparedURLParts {
    return `/${parts
        .map(prepareUrlPart)
        .join('/')}/` as PreparedURLParts;
    }

export function unprepareUrlPart(part: string) {
    part = decodeURIComponent(part);
    part = part.replaceAll('~', ':');
    return toLowerCase(part); // just in case
}
