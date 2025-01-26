export class UnreachableError extends Error {
    constructor(value: never, message?: string) {
        console.log('Unreachable code reached! Value:', value);
        super(`Unreachable code reached! Value: ${value}${message ? `\n${message}` : ''}`);
    }
}
