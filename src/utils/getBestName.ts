

export function getBestNameVariant(names: [[Lowercase<string>[], string], ...([Lowercase<string>[], string][])]): [Lowercase<string>[], string];
export function getBestNameVariant(names: []): undefined;
export function getBestNameVariant(names: [Lowercase<string>[], string][] & { length: Exclude<number, 0> }): [Lowercase<string>[], string];
export function getBestNameVariant(names: [Lowercase<string>[], string][] & { length: 0 }): undefined;
export function getBestNameVariant(names: [Lowercase<string>[], string][]): [Lowercase<string>[], string] | undefined;
/**
 * Because names in Papyrus are case-insensitive, we may have multiple case variations of a given name.
 *
 * We ideally want to choose the name that will be easiest for API consumers to understand. A name is considered
 * "better" using a simple algorithm which prioritizes names with roughly 25% uppercase characters.
 */
export function getBestNameVariant(names: [Lowercase<string>[], string][]) {
    return names.sort((a, b) => calculateNameDesirability(a[1]) - calculateNameDesirability(b[1]))[0];
}

/**
 * Because names in Papyrus are case-insensitive, we may have multiple case variations of a given name.
 *
 * We ideally want to choose the name that will be easiest for API consumers to understand. A name is considered
 * "better" using a simple algorithm which prioritizes names with roughly 25% uppercase characters.
 */
export function getBestName(names: string[]) {
    return names.sort((a, b) => calculateNameDesirability(a) - calculateNameDesirability(b))[0];
}

/**
 * Returns the desirability rating of a name. Higher is better.
 */
function calculateNameDesirability(name: string) {
    const uppercaseCount = name.split('').filter(char => char === char.toUpperCase()).length;

    // Paste into Desmos to play around with the math
    // Use the `l` slider to set the length of the name
    // Use the `X` slider to set the uppercase count
    // Replace `X` with `x` to see it graphed
    // -\frac{\left(X-\frac{l}{4}\right)^{1.4}}{\left(X-l-1\right)^{2}}-\left(X-\frac{l}{3}\right)^{2}-\frac{l^{1.8}}{X+1}
    return -( (uppercaseCount - (name.length/4))**1.4  /  (uppercaseCount - name.length - 1)**2 )   -   ((uppercaseCount - name.length / 3)**2)   -   ((name.length**1.8)  /  (uppercaseCount + 1));
}
