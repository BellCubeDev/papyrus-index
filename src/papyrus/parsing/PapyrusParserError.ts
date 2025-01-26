import path from "node:path";
import type { PapyrusScriptDiscoveredDocument } from "./parse-all-for-game";

export class PapyrusParserError extends Error /* not SyntaxError because it's not a JS syntax error */ {
    static computeLineAndColumn(script: PapyrusScriptDiscoveredDocument, index: number) {
        let line = 1;
        let column = 1;
        for (let i = 0; i < index; i++) {
            if (script.sourceCode[i] === '\n') {
                line++;
                column = 1;
            } else {
                column++;
            }
        }
        return { line, column };
    }

    public line: number;
    public column: number;

    constructor(message: string, public readonly index: number, script: PapyrusScriptDiscoveredDocument) {
        index--; // The index is one character further than the actual position of the problem
        const { line, column } = PapyrusParserError.computeLineAndColumn(script, index);
        super(`Error in Papyrus script "${path.basename(script.absolutePath)}":   ${message}\n\n    ${script.absolutePath}:${line}:${column} (character #${index + 1})\n`);
        if (this.stack) {
            this.stack = this.stack.replace(/^[^\S\n]+at /um, (match) =>
                `${match}[Papyrus Code] (${script.absolutePath}:${line}:${column})\n${match}`
            );
        }
        this.line = line;
        this.column = column;
    }
}
