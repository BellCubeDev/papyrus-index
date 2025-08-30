/* eslint-disable complexity */
/* eslint-disable max-depth */
/* eslint-disable max-classes-per-file */

import type { Node, RootContent } from 'mdast';
import fs from "node:fs/promises";
import path from "node:path";
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import { githubWikisDir } from "../../../src/folders";
import type { PapyrusScriptFunction } from "../../../src/papyrus/data-structures/pure/function";
import { PapyrusGame } from "../../../src/papyrus/data-structures/pure/game";
import { PapyrusScriptParser } from "../../../src/papyrus/parsing/parse-script";
import { appendToStepSummarySection, StepSummarySection } from "../../../src/utils/stepSummary";
import { toLowerCase } from "../../../src/utils/toLowerCase";
import { GitHubWiki } from "../../../src/wiki-data-extraction/individual-github-wikis/GitHubWiki";
import type { GitHubWikiData, GitHubWikiEventData, GitHubWikiFunctionData } from "../../../src/wiki-data-extraction/individual-github-wikis/types";

const wikiPath = path.join(githubWikisDir, PapyrusGame.SkyrimSE, 'po3');

function stringifyNodes(nodes: RootContent[]): string | null {
    return remarkProcessor.stringify({
        type: 'root',
        children: nodes,
    }).trim() || null;
}

const remarkProcessor = remark().use(remarkGfm);

enum EscapeHatchErrorContext {
    getDataDirect,
}

class EscapeHatchError extends Error {
    constructor(public readonly context: EscapeHatchErrorContext) {
        super('Escape hatch error; this should never be thrown and not caught! Please report this as a bug if you see it!');
        this.name = 'EscapeHatchError';
    }
}

function isEscapeHatch<TContext extends EscapeHatchErrorContext>(error: unknown, context: TContext): error is EscapeHatchError & { context: typeof context } {
    return error instanceof EscapeHatchError && error.context === context;
}

enum EventRecipient {
    Alias = 'Alias',
    AME = 'Active-Effect',
    Form = 'Form',
}
const validEventRecipients = new Set(Object.values(EventRecipient)) as unknown as Omit<ReadonlySet<EventRecipient>, 'has'> & { has: (value: string) => value is EventRecipient };

export default class SkyrimPO3PapyrusExtenderWiki extends GitHubWiki<PapyrusGame.SkyrimSE> {

    wikiBase = new URL('https://github.com/powerof3/PapyrusExtenderSSE/wiki');

    protected override async getDataDirect(): Promise<GitHubWikiData> {
        const fileDirents = await fs.readdir(wikiPath, { withFileTypes: true, recursive: false });

        const files = (await Promise.all(fileDirents.map(async (file) => {
            if (file.isDirectory()) return null;
            if (file.name === '_Sidebar.md') return null; // Skip the sidebar file; it doesn't house any useful data for us
            if (!file.name.endsWith('.md')) {
                appendToStepSummarySection(`Skipping file "${file.name}" in SkyrimPO3PapyrusExtenderWiki because it does not have a .md extension.`, StepSummarySection.GitHubWikiFormattingWarnings, 'no-md-extension-SkyrimPO3PapyrusExtenderWiki');
                return null;
            }

            const filePath = path.join(file.parentPath, file.name);
            const content = (await fs.readFile(filePath, 'utf-8')).replace(/\r\n?/gu, '\n'); // Normalize line endings to LF
            const ast = remarkProcessor.parse(content);
            return {
                name: file.name.replace(/\.[^.]+$/u, ''),
                ast,
                rawContent: content,
                filePath,
            };
        }))).filter((file): file is NonNullable<typeof file> => file !== null);

        const homePageIndex = files.findIndex(file => file?.name === 'Home');
        if (homePageIndex === -1) throw new Error('Expected to find a Home page in the SkyrimPO3PapyrusExtenderWiki files, but did not!');
        const [homePage] = files.splice(homePageIndex, 1) as [typeof files[number]];

        const firstHomePageHeaderIndex = homePage.ast.children.findIndex(node => node.type === 'heading');
        const descriptionAST = homePage.ast.children.slice(firstHomePageHeaderIndex);
        const descriptionMd = stringifyNodes(descriptionAST);

        const events = Object.fromEntries(Object.values(EventRecipient).map(recipient => [recipient, {} as Record<Lowercase<string>, GitHubWikiEventData>]));

        const registrationControlFunctions: Record<Lowercase<string>, GitHubWikiFunctionData> = {};
        const standaloneFunctions: Record<Lowercase<string>, GitHubWikiFunctionData> = {};

        const data: GitHubWikiData = {
            isPubliclyEditable: false,
            linkToWikiData: this.wikiBase.href,
            sourceDescriptionMD: descriptionMd,
            scripts: {
                po3_sksefunctions: {
                    linkToWikiData: this.wikiBase.href,
                    events: {},
                    functions: standaloneFunctions,
                    properties: {},
                },

                po3_events_alias: {
                    linkToWikiData: this.wikiBase.href,
                    events: events[EventRecipient.Alias],
                    functions: registrationControlFunctions,
                    properties: {},
                },
                po3_events_ame: {
                    linkToWikiData: this.wikiBase.href,
                    events: events[EventRecipient.AME],
                    functions: registrationControlFunctions,
                    properties: {},
                },
                po3_events_form: {
                    linkToWikiData: this.wikiBase.href,
                    events: events[EventRecipient.Form],
                    functions: registrationControlFunctions,
                    properties: {},
                },
            },
        };

        {
            function panic(message: string, node: Node, file: string): never {
                const escapeHatch = new EscapeHatchError(EscapeHatchErrorContext.getDataDirect);
                appendToStepSummarySection(`
Error in SkyrimPO3PapyrusExtenderWiki file ${file}: ${message}

This error occurred at node:
\`\`\`json
${JSON.stringify(node, null, 2)}
\`\`\`
Processing was aborted.
`, StepSummarySection.GitHubWikiFormattingWarnings);

                console.error(`Error in SkyrimPO3PapyrusExtenderWiki file ${file}: ${message} at node:`, node, ...(!node.position ? [] : [`\n    at ${file}:${node.position.start.line}:${node.position.start.column}`]), escapeHatch.stack?.replace(/.*\n.*/mu, ''));
                throw escapeHatch;
            }

            fileLoop: for (const file of files) { try {
                // Let's parse functions!
                let functionUnderConstruction: Omit<Partial<GitHubWikiFunctionData>, 'description'|'name'> & {
                    description: RootContent[];
                    node?: RootContent;
                    names: Lowercase<string>[]
                } = { description: [], names: [] };
                let isInDeprecatedFunctionSection = false;

                function mergeFunctionDataObjs(firstFunctionData: GitHubWikiFunctionData, ...remainingFunctionDataObjs: GitHubWikiFunctionData[]): GitHubWikiFunctionData {
                    return remainingFunctionDataObjs.reduce(function mergeFunctionDataObjsReducer(acc, functionData) {
                        if (acc.descriptionMD && functionData.descriptionMD && acc.descriptionMD !== functionData.descriptionMD) panic(`Merging function data with different descriptions:\n\n======\n${acc.descriptionMD.trim()}\n======\n${functionData.descriptionMD.trim()}\n======\n${JSON.stringify({existing: acc, new: functionData}, null, 4)}`, file.ast, file.filePath);
                        if (acc.name !== functionData.name) panic(`Merging function data with different names: "${acc.name}" and "${functionData.name}"\n${JSON.stringify({existing: acc, new: functionData})}`, file.ast, file.filePath);
                        if (acc.isFunctionDeprecated !== null && functionData.isFunctionDeprecated !== null && acc.isFunctionDeprecated !== functionData.isFunctionDeprecated) panic(`Merging function data with different, explicitly-defined deprecation statuses!\n${JSON.stringify({existing: acc, new: functionData}, null, 4)}`, file.ast, file.filePath);
                        if (acc.deprecatedFor !== null && functionData.deprecatedFor !== null && acc.deprecatedFor !== functionData.deprecatedFor) panic(`Merging function data with different, explicitly-defined deprecatedFor values!\n${JSON.stringify({existing: acc, new: functionData}, null, 4)}`, file.ast, file.filePath);
                        const mergedRegistrationControlFunctions = new Set([...acc.controlsEventRegistrationFor || [], ...(functionData.controlsEventRegistrationFor || [])]);
                        const mergedExampleMDs = new Set([...acc.exampleMDs, ...functionData.exampleMDs]);
                        if (Object.keys(acc.parameters).length > 0 || Object.keys(functionData.parameters).length > 0) throw new Error(`Merging function data with parameters is not supported, as there was no need to develop it!`);
                        return {
                            descriptionMD: acc.descriptionMD || functionData.descriptionMD,
                            linkToWikiData: acc.linkToWikiData || functionData.linkToWikiData,
                            name: acc.name || functionData.name,
                            controlsEventRegistrationFor: mergedRegistrationControlFunctions.size > 0 ? Array.from(mergedRegistrationControlFunctions) : null,
                            isFunctionDeprecated: acc.isFunctionDeprecated ?? functionData.isFunctionDeprecated,
                            deprecatedFor: acc.deprecatedFor ?? functionData.deprecatedFor,
                            parameters: {},
                            returnValueDescriptionMD: acc.returnValueDescriptionMD || functionData.returnValueDescriptionMD,
                            exampleMDs: mergedExampleMDs.size > 0 ? Array.from(mergedExampleMDs) : [],
                            notesMD: [acc.notesMD, functionData.notesMD].filter(Boolean).join('\n\n') || null,
                        };
                    }, firstFunctionData);
                }

                const finalizeFunction = (node: Node) => {
                    if (!functionUnderConstruction.node) return;
                    if (!functionUnderConstruction.names) panic('Function under construction is missing name, we tried to finalize it!', node, file.filePath);

                    const nameNode = functionUnderConstruction.node;
                    if (!('children' in nameNode) || nameNode.children.length !== 1 || nameNode.children[0]!.type !== 'text') panic('Expected a single text node in the function name heading', nameNode, file.filePath);
                    const anchorId = nameNode.children[0]!.value.toLowerCase().replace(/\s/gu, '-').replace(/[^a-z0-9-]+/gu, '');
                    const linkToWikiData = new URL(`wiki/${file.name}#user-content-${anchorId}`, this.wikiBase).href;

                    const newObjBase: GitHubWikiFunctionData = {
                        descriptionMD: stringifyNodes(functionUnderConstruction.description),
                        linkToWikiData,
                        name: 'replace_me',
                        controlsEventRegistrationFor: null,
                        isFunctionDeprecated: isInDeprecatedFunctionSection,
                        deprecatedFor: functionUnderConstruction.deprecatedFor ?? null,
                        parameters: {},
                        returnValueDescriptionMD: null,
                        exampleMDs: [],
                        notesMD: null,
                    };

                    for (const name of functionUnderConstruction.names) {
                        const existingObj = standaloneFunctions[name];
                        const newObj: GitHubWikiFunctionData = {...newObjBase, name};
                        standaloneFunctions[name] = existingObj ? mergeFunctionDataObjs(existingObj, newObj) : newObj;
                    }

                    functionUnderConstruction = { description: [], names: [] };
                };

                let i = 0;
                functionLoop: for (; i < file.ast.children.length; i++) {
                    const node = file.ast.children[i]!;
                    switch (node.type) {
                        case 'heading': {
                            finalizeFunction(node);
                            switch (node.depth) {
                                case 1: {
                                    if (node.children.length !== 1 || node.children[0]!.type !== 'text') panic('Expected a single text node in a level 1 heading', node, file.filePath);
                                    switch (node.children[0]!.value.toLowerCase()) {
                                        case 'events':
                                            i++;
                                            break functionLoop; // this is in the next loop
                                        case 'functions':
                                            continue;
                                    }
                                    return panic(`Unexpected level 1 heading: ${node.children[0]!.value}`, node, file.filePath);
                                }

                                case 2: {
                                    if (node.children.length !== 1 || node.children[0]!.type !== 'text') panic('Expected a single text node in a level 2 heading', node, file.filePath);
                                    const name = node.children[0]!.value;
                                    const nameLowerCase = toLowerCase(name);
                                    switch (nameLowerCase) {
                                        case 'getters':
                                        case 'getter':
                                            continue;

                                        case 'setters':
                                        case 'setter':
                                            continue;

                                        case 'deprecated':
                                            isInDeprecatedFunctionSection = true;
                                            continue;
                                    }
                                    // eslint-disable-next-line prefer-named-capture-group
                                    const [,nameBase, ...nameSuffixes] = name.match(/^(.*?As)(Int|String)\/(Int|String)$/u) ?? [];
                                    if (nameBase) {
                                        functionUnderConstruction.node = node;
                                        functionUnderConstruction.names = nameSuffixes.map(namePart => {
                                            const variant = `${nameBase}${namePart}`;
                                            if (!variant.match(/^[a-z][a-z0-9_]*$/ui)) panic(`Function name "${variant}" (variant of ${name}) is not a valid Papyrus function name! This case will require special parsing.`, node, file.filePath);
                                            return toLowerCase(variant);
                                        });
                                        continue;
                                    } else {
                                        panic(`Unexpected level 2 heading: ${node.children[0]!.value}`, node, file.filePath);
                                        continue;
                                    }
                                }

                                case 3:
                                case 4: {
                                    if (node.children.length !== 1 || node.children[0]!.type !== 'text') panic('Expected a single text node in a level 3/4 heading', node, file.filePath);
                                    functionUnderConstruction.node = node;
                                    let name = node.children[0]!.value;

                                    if (isInDeprecatedFunctionSection) {
                                        const {functionName, deprecatedFor} = name.match(/^(?<functionName>.+?)\s*(?:\(\s*use\s+(?<deprecatedFor>.+)\))?$/iu)?.groups ?? {};
                                        if (!functionName) panic(`Function name "${name}" could not be matched against the expected pattern for deprecated functions! This case will require special parsing.`, node, file.filePath);
                                        if (!functionName.match(/^[a-z][a-z0-9_]*$/ui)) panic(`Function name "${functionName}" is not a valid Papyrus function name (isInDeprecatedFunctionSection=${isInDeprecatedFunctionSection})! This case will require special parsing.`, node, file.filePath);
                                        if (deprecatedFor) functionUnderConstruction.deprecatedFor = toLowerCase(deprecatedFor);
                                        name = functionName;
                                    }

                                    if (!name.match(/^[a-z][a-z0-9_]*$/ui)) panic(`Function name "${name}" is not a valid Papyrus function name (isInDeprecatedFunctionSection=${isInDeprecatedFunctionSection})! This case will require special parsing.`, node, file.filePath);
                                    functionUnderConstruction.names = [toLowerCase(name)];
                                    continue;
                                }
                            }
                            return panic(`Unexpected heading depth: ${node.depth}`, node, file.filePath);
                        }

                        case 'code':
                            continue; // these code blocks are just the Papyrus declaration, which we already have

                        default:
                            if (functionUnderConstruction.node) functionUnderConstruction.description.push(node);
                    }
                }
                finalizeFunction(file.ast.children.at(-1) ?? file.ast);

                if (i === file.ast.children.length) continue fileLoop;
                if (!validEventRecipients.has(file.name)) panic(`Unexpected file name for events recipient: ${file.name}. Expected one of ${Array.from(validEventRecipients).join(', ')}`, file.ast, file.filePath);

                // Let's parse events!
                let eventUnderConstruction: Omit<Partial<GitHubWikiFunctionData>, 'description'|'name'> & {
                    description: RootContent[],
                    headerText?: string,
                    names: Lowercase<string>[],
                    registrationControllerEntries: [Lowercase<string>, PapyrusScriptFunction<PapyrusGame.SkyrimSE>][]
                    node?: Node,
                } = { description: [], names: [], registrationControllerEntries: [] };

                function mergeEventDataObjs(node: Node, firstEventData: GitHubWikiEventData, ...remainingEventDatObjs: GitHubWikiEventData[]): GitHubWikiEventData {
                    return remainingEventDatObjs.reduce(function mergeEventDataObjsReducer(acc, eventData) {
                        if (acc.descriptionMD && eventData.descriptionMD && acc.descriptionMD !== eventData.descriptionMD) panic(`Merging event data with different descriptions:\n\n======\n${acc.descriptionMD.trim()}\n======\n${eventData.descriptionMD.trim()}\n======\n${JSON.stringify({existing: acc, new: eventData}, null, 4)}`, node, file.filePath);
                        if (acc.name !== eventData.name) panic(`Merging event data with different names: "${acc.name}" and "${eventData.name}"\n${JSON.stringify({existing: acc, new: eventData}, null, 4)}`, node, file.filePath);
                        const mergedRegistrationControlFunctions = new Set([...acc.registrationControlFunctions || [], ...(eventData.registrationControlFunctions || [])]);
                        const mergedExampleMDs = new Set([...acc.exampleMDs, ...eventData.exampleMDs]);
                        return {
                            descriptionMD: acc.descriptionMD || eventData.descriptionMD,
                            linkToWikiData: acc.linkToWikiData || eventData.linkToWikiData,
                            name: acc.name || eventData.name,
                            registrationControlFunctions: mergedRegistrationControlFunctions.size > 0 ? Array.from(mergedRegistrationControlFunctions) : null,
                            parameters: {},
                            exampleMDs: mergedExampleMDs.size > 0 ? Array.from(mergedExampleMDs) : [],
                            notesMD: [acc.notesMD, eventData.notesMD].filter(Boolean).join('\n\n') || null,
                        };
                    }, firstEventData);
                }

                const finalizeEvent = (recipient: EventRecipient) => {
                    if (!eventUnderConstruction.node) return;
                    if (!eventUnderConstruction.headerText) panic('Event under construction is missing a header text, we tried to finalize it!', eventUnderConstruction.node, file.filePath);
                    if (eventUnderConstruction.names.length < 1) panic('Event under construction is missing a name, we tried to finalize it!', eventUnderConstruction.node, file.filePath);

                    const anchorId = eventUnderConstruction.headerText.toLowerCase().replaceAll(' ', '-').replace(/[^a-z0-9]+/gu, '');
                    const linkToWikiData = new URL(`wiki/${file.name.slice(0, -path.extname(file.name).length)}#user-content-${anchorId}`, this.wikiBase).href;
                    try {
                        for (const name of eventUnderConstruction.names) {
                            const newObj: GitHubWikiEventData = {
                                descriptionMD: stringifyNodes(eventUnderConstruction.description),
                                linkToWikiData,
                                name,
                                registrationControlFunctions: eventUnderConstruction.registrationControllerEntries.length === 0 ? null : eventUnderConstruction.registrationControllerEntries.map(registrationControllerEntry => registrationControllerEntry[0]),
                                parameters: {},
                                exampleMDs: [],
                                notesMD: null,
                            };
                            const existingObj = events[recipient][name];
                            events[recipient][name] = existingObj ? mergeEventDataObjs(eventUnderConstruction.node, existingObj, newObj) : newObj;
                        }

                        for (const [funcNameLowercase, _func] of eventUnderConstruction.registrationControllerEntries)  {
                            const newObj: GitHubWikiFunctionData = {
                                descriptionMD: null,
                                linkToWikiData,
                                name: funcNameLowercase,
                                controlsEventRegistrationFor: eventUnderConstruction.names,
                                isFunctionDeprecated: null,
                                deprecatedFor: null,
                                parameters: {},
                                returnValueDescriptionMD: null,
                                exampleMDs: [],
                                notesMD: null,
                            };
                            const existingObj = registrationControlFunctions[funcNameLowercase];
                            registrationControlFunctions[funcNameLowercase] = existingObj ? mergeFunctionDataObjs(existingObj, newObj) : newObj;
                        };
                    } finally {
                        eventUnderConstruction = { description: [], names: [], registrationControllerEntries: [] };
                    }
                };

                for (; i < file.ast.children.length; i++) {
                    const node = file.ast.children[i]!;
                    switch (node.type) {
                        case 'heading': {
                            finalizeEvent(file.name);
                            switch (node.depth) {
                                case 1: {
                                    if (node.children.length !== 1 || node.children[0]!.type !== 'text') panic('Expected a single text node in a level 1 heading', node, file.filePath);
                                    switch (node.children[0]!.value.toLowerCase()) {
                                        case 'deprecated':
                                            appendToStepSummarySection(`Deprecated events section found in file ${file.filePath}, but it is not yet handled by the SkyrimPO3PapyrusExtenderWiki parser.`, StepSummarySection.UnimplementedFeatures, 'deprecated-section-po3-skyrim-wiki');
                                            continue fileLoop;
                                    }
                                    return panic(`Unexpected level 1 heading after Events header!`, node, file.filePath);
                                }

                                case 2: {
                                    return panic(`Unexpected level 2 heading after Events header!`, node, file.filePath);
                                }

                                case 3:
                                case 4: {
                                    if (node.children.length !== 1 || node.children[0]!.type !== 'text') panic('Expected a single text node in a level 3/4 heading', node, file.filePath);
                                    eventUnderConstruction.headerText = node.children[0]!.value;
                                    eventUnderConstruction.node = node;
                                    continue;
                                }
                            }
                            return panic(`Unexpected heading depth: ${node.depth}`, node, file.filePath);
                        }

                        case 'code': {
                            if (node.lang !== 'papyrus') panic(`Expected a code block with lang="papyrus", but got lang="${node.lang}"`, node, file.filePath);
                            const partialScript = PapyrusScriptParser.parsePartialScript(PapyrusGame.SkyrimSE, {
                                absolutePath: file.filePath,
                                sourceCode: node.value,
                                partialOffset: {
                                    characterOffset: (node.position?.start.offset ?? 0) + '```papyrus'.length + 1,
                                    lineOffset: (node.position?.start.line ?? 0) + 1,
                                    columnOffset: 0,
                                }
                            });

                            const eventNames = Object.keys(partialScript.events);
                            if (eventNames.length < 1) panic(`Expected at least one event in the code block, but found none`, node, file.filePath);
                            for (const eventName of eventNames) {
                                if (eventUnderConstruction.names.includes(eventName)) panic(`Duplicate event name ${eventName} in the code block (names: ${eventUnderConstruction.names.join(', ')})`, node, file.filePath);
                                eventUnderConstruction.names.push(eventName);
                            }

                            eventUnderConstruction.registrationControllerEntries = Object.entries(partialScript.functions);
                            break;
                        }

                        default:
                            if (eventUnderConstruction.node) eventUnderConstruction.description.push(node);
                    }
                }
                finalizeEvent(file.name);
            } catch (error) {
                if (isEscapeHatch(error, EscapeHatchErrorContext.getDataDirect)) return data;
                else throw error;
            } finally {
                //fs.writeFile(file.filePath.replace(/\.md$/u, '.json'), JSON.stringify(file.ast, null, 4), 'utf-8');
                //fs.writeFile('test.json', JSON.stringify(data, null, 4), 'utf-8');
            }}
        }

        return data;
    }

}
