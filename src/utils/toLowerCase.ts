export function toLowerCase<T extends string>(value: T) {
    try {
        return value.toLowerCase() as Lowercase<T>;
    } catch (e) {
        console.error('Failed to convert', value, 'to lowercase:', e);
        throw e;
    }
}
