

export function getBestNameVariant<T extends string>(names: [[Lowercase<string>[], T], ...([Lowercase<string>[], T][])]): [Lowercase<string>[], T];
export function getBestNameVariant<T extends string>(names: [Lowercase<string>[], T][] & { length: Exclude<number, 0> }): [Lowercase<string>[], T];
export function getBestNameVariant<T extends string>(names: [Lowercase<string>[], T][] & { length: 0 }): undefined;
export function getBestNameVariant(names: []): undefined;
export function getBestNameVariant<T extends string>(names: [Lowercase<string>[], T][]): [Lowercase<string>[], T] | undefined;
/**
 * Because names in Papyrus are case-insensitive, we may have multiple case variations of a given name.
 *
 * We ideally want to choose the name that will be easiest for API consumers to understand. A name is considered
 * "better" using a simple algorithm which prioritizes names with roughly 25% uppercase characters.
 */
export function getBestNameVariant<T extends string>([firstName, ...remainingNames]: [Lowercase<string>[], T][]): [Lowercase<string>[], T] | undefined {
    if (firstName === undefined) return undefined;
    return remainingNames.reduce((acc, newest) => {
        const newestScore = calculateNameDesirability(newest[1]);
        if (acc[0] < newestScore) return [newestScore, newest] as const;
        return acc;
    }, [calculateNameDesirability(firstName[1]), firstName] as const)[1];
}

/**
 * Because names in Papyrus are case-insensitive, we may have multiple case variations of a given name.
 *
 * We ideally want to choose the name that will be easiest for API consumers to understand. A name is considered
 * "better" using a simple algorithm which prioritizes names with roughly 25% uppercase characters.
 */
export function getBestName<T extends string>([firstName, ...remainingNames]: T[]): T | undefined {
    if (firstName === undefined) return undefined;
    return remainingNames.reduce((acc, newest) => {
        const newestScore = calculateNameDesirability(newest);
        if (acc[0] < newestScore) return [newestScore, newest] as const;
        return acc;
    }, [calculateNameDesirability(firstName), firstName] as const)[1];
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
