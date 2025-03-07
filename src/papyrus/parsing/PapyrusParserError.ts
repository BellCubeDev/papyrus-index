import path from "node:path";
import fs from "node:fs";
import type { PapyrusScriptDiscoveredDocument } from "./parse-all-for-game";
import { isCI } from 'next/dist/server/ci-info';

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

    constructor(message: string, public readonly index: number, document: PapyrusScriptDiscoveredDocument & {isModified?: boolean}) {
        index--; // The index is one character further than the actual position of the problem
        const { line, column } = PapyrusParserError.computeLineAndColumn(document, index);
        if (document.isModified) {
            document = {...document, absolutePath: `${document.absolutePath}.reference`};
            fs.writeFileSync(document.absolutePath, document.sourceCode, 'utf8');
        }
        super(`Error in Papyrus script "${path.basename(document.absolutePath)}":   ${message}\n\n    ${document.absolutePath}:${line}:${column} (character #${index + 1})\n`);
        if (this.stack) {
            this.stack = this.stack.replace(/^[^\S\n]+at /um, (match) =>
                `${match}[Papyrus Code] (${document.absolutePath}:${line}:${column})\n${match}`
            );
        }
        this.line = line;
        this.column = column;

        // For GitHub Actions, add an annotation - https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions#setting-a-notice-message
        if (isCI) console.error(`::error file=${document.absolutePath},line=${line},col=${column}::${message}`);
    }
}
