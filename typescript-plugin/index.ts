import ts from "typescript";
import fs from "fs";
import os from "os";
import path from "path";

const doDebugLogging = false as boolean;
const logFile = process.env.PAPYRUS_PLUGIN_LOG || path.join(os.tmpdir(), "papyrus-index-plugin.log");

function writeLog(message: string): void {
    if (!doDebugLogging) return;

    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`, 'utf8');
}

export = function init(modules: { typescript: typeof import("typescript/lib/tsserverlibrary"); }) {

    function create(info: ts.server.PluginCreateInfo) {
        // Get configuration from tsconfig.json
        const config = info.config || {};
        const filePattern = config.filePattern || 'data/*/*/wiki.ts';
        const baseClassName = config.baseClassName || 'GitHubWiki';

        // Diagnostic logging
        writeLog(`\n[PapyrusIndexTSPlugin] Plugin initialized with pattern: ${filePattern}, base class: ${baseClassName}\n`);

        function isTargetFile(fileName: string): boolean {
            const projectRoot = info.project.getCurrentDirectory();
            const relativePath = ts.server.toNormalizedPath(fileName).replace(projectRoot, '').replace(/^[/\\]/u, '');
            const normalizedPath = relativePath.replace(/\\/gu, '/');

            // Convert glob pattern to regex
            const pattern = filePattern
                .replace(/\*/gu, '[^/]*')
                .replace(/\//gu, '\\/');

            const regex = new RegExp(`^${pattern}$`, 'u');
            const isMatch = regex.test(normalizedPath);

            writeLog(`[PapyrusIndexTSPlugin] Checking file: ${fileName}, normalized: ${normalizedPath}, matches: ${isMatch}`);

            return isMatch;
        }

        function checkInheritance(heritageClauses: any, typeChecker: any): boolean {
            for (const heritage of heritageClauses) {
                if (heritage.token === ts.SyntaxKind.ExtendsKeyword) {
                    for (const type of heritage.types) {
                        const typeNode = typeChecker.getTypeAtLocation(type);
                        const symbol = typeNode.getSymbol();

                        if (symbol && symbol.getName() === baseClassName)
                            return true;

                    }
                }
            }
            return false;
        }

        function hasValidDefaultExport(sourceFile: any, program: any): boolean {
            const typeChecker = program.getTypeChecker();
            let hasValidExport = false;

            function visit(node: any): void {
                // Check for default export class declaration
                if (ts.isClassDeclaration(node) &&
                    node.modifiers?.some((modifier: any) => modifier.kind === ts.SyntaxKind.DefaultKeyword)) {

                    if (node.heritageClauses && checkInheritance(node.heritageClauses, typeChecker)) {
                        hasValidExport = true;
                        return;
                    }
                }

                // Check for export assignment
                if (ts.isExportAssignment(node) && !node.isExportEquals) {
                    if (ts.isClassExpression(node.expression)) {
                        const classExpr = node.expression;
                        if (classExpr.heritageClauses && checkInheritance(classExpr.heritageClauses, typeChecker)) {
                            hasValidExport = true;
                            return;
                        }
                    }
                }

                ts.forEachChild(node, visit);
            }

            visit(sourceFile);
            return hasValidExport;
        }

        function checkExports(sourceFile: any): { hasDefaultExport: boolean; hasAnyExport: boolean; defaultExportNode: null | ts.ExportAssignment | ts.ClassDeclaration } {
            let hasDefaultExport = false;
            let hasAnyExport = false;
            let defaultExportNode: ts.ExportAssignment | ts.ClassDeclaration | null = null;

            function visit(node: any): void {
                if (ts.isExportAssignment(node) && !node.isExportEquals) {
                    hasDefaultExport = true;
                    hasAnyExport = true;
                    defaultExportNode = node;
                }

                if (ts.isClassDeclaration(node) &&
                    node.modifiers?.some((modifier: any) => modifier.kind === ts.SyntaxKind.DefaultKeyword)) {
                    hasDefaultExport = true;
                    hasAnyExport = true;
                    defaultExportNode = node;
                }

                if (ts.isExportDeclaration(node) ||
                    (ts.isVariableStatement(node) &&
                        node.modifiers?.some((modifier: any) => modifier.kind === ts.SyntaxKind.ExportKeyword)))
                    hasAnyExport = true;


                ts.forEachChild(node, visit);
            }

            visit(sourceFile);
            return { hasDefaultExport, hasAnyExport, defaultExportNode };
        }

        // Set up decorator object
        const proxy: any = Object.create(null);
        for (const k of Object.keys(info.languageService)) {
            const x = (info.languageService as any)[k];
            proxy[k] = function proxyMethod(...args: any[]) {
                return x.apply(info.languageService, args);
            };
        }

        // Override getSemanticDiagnostics to add our custom diagnostics
        proxy.getSemanticDiagnostics = (fileName: string) => {
            const prior = info.languageService.getSemanticDiagnostics(fileName);

            if (!isTargetFile(fileName))
                return prior;

            writeLog(`[PapyrusIndexTSPlugin] Checking semantic diagnostics for target file: ${fileName}`);

            const program = info.languageService.getProgram();
            if (!program) {
                writeLog(`[PapyrusIndexTSPlugin] No program available for ${fileName}`);
                return prior;
            }

            const sourceFile = program.getSourceFile(fileName);
            if (!sourceFile) {
                writeLog(`[PapyrusIndexTSPlugin] No source file available for ${fileName}`);
                return prior;
            }

            const hasValidExport = hasValidDefaultExport(sourceFile, program);
            writeLog(`[PapyrusIndexTSPlugin] File ${fileName} has valid export: ${hasValidExport}`);

            if (!hasValidExport) {
                const { hasDefaultExport, hasAnyExport, defaultExportNode } = checkExports(sourceFile);

                let messageText: string;
                if (!hasAnyExport) messageText = `File matching pattern '${filePattern}' must have a default export that extends ${baseClassName}.\nCurrently has no exports.`;
                else if (!hasDefaultExport) messageText = `File matching pattern '${filePattern}' must have a default export that extends ${baseClassName}.\nCurrently has no default export.`;
                else messageText = `File matching pattern '${filePattern}' must have a default export that extends ${baseClassName}.\nCurrent default export does not extend ${baseClassName}.`;


                const diagnostic = {
                    file: sourceFile,
                    start: defaultExportNode?.getStart() ?? 0,
                    length: defaultExportNode?.getWidth() ?? (sourceFile.text.length > 0 ? 1 : 0),
                    messageText,
                    category: ts.DiagnosticCategory.Error,
                    code: 9001,
                    source: 'papyrus-index-plugin'
                };


                writeLog(`[PapyrusIndexTSPlugin] Adding diagnostic: ${messageText}`);

                return [...prior, diagnostic];
            }

            return prior;
        };

        return proxy;
    }

    return { create };
}
