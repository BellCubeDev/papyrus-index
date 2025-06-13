/* eslint-disable complexity */
/* eslint-disable max-depth */
/* eslint-disable max-classes-per-file */

import path from "node:path";
import fs from "node:fs/promises";
import { githubWikisDir } from "../../../src/folders";
import { PapyrusGame } from "../../../src/papyrus/data-structures/pure/game";
import { GitHubWiki, type GitHubWikiData, type GitHubWikiEventData, type GitHubWikiFunctionData } from "../../../src/wiki-data-extraction/individual-github-wikis/GitHubWiki";
import { remark } from 'remark';
import { inspect } from "node:util";
import type { Node, RootContent } from 'mdast';
import { appendToStepSummarySection, StepSummarySection } from "../../../src/utils/stepSummary";
import { toLowerCase } from "../../../src/utils/toLowerCase";
import type { PapyrusScriptFunction } from "../../../src/papyrus/data-structures/pure/function";
import { PapyrusScriptParser } from "../../../src/papyrus/parsing/parse-script";

const wikiPath = path.join(githubWikisDir, PapyrusGame.SkyrimSE, 'po3');

const remarkProcessor = remark();

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
    Alias = 'Alias.md',
    AME = 'Active-Effect.md',
    Form = 'Form.md',
}
const validEventRecipients = new Set(Object.values(EventRecipient)) as unknown as Omit<ReadonlySet<EventRecipient>, 'has'> & { has: (value: string) => value is EventRecipient };

export default class SkyrimPO3PapyrusExtenderWiki extends GitHubWiki<PapyrusGame.SkyrimSE> {

    wikiBase = new URL('https://github.com/powerof3/PapyrusExtenderSSE/wiki');

    protected override async getDataDirect(): Promise<GitHubWikiData<PapyrusGame.SkyrimSE>> {
        const files = await fs.readdir(wikiPath, { withFileTypes: true, recursive: false });

        const fileContents = (await Promise.all(files.map(async (file) => {
            if (file.isDirectory()) return null;
            if (file.name === '_Sidebar.md') return null; // Skip the sidebar file; it doesn't house any useful data for us

            const filePath = path.join(file.parentPath, file.name);
            const content = (await fs.readFile(filePath, 'utf-8')).replace(/\r\n?/gu, '\n'); // Normalize line endings to LF
            const ast = remarkProcessor.parse(content);
            return {
                name: file.name.replace(/\.[^.]$/u, ''),
                ast,
                rawContent: content,
                filePath,
            };
        }))).filter((file): file is NonNullable<typeof file> => file !== null);


        const homePageIndex = fileContents.findIndex(file => file?.name === 'Home.md');
        if (homePageIndex === -1) throw new Error('Expected to find a Home page in the SkyrimPO3PapyrusExtenderWiki files, but did not!');
        const [homePage] = fileContents.splice(homePageIndex) as [typeof fileContents[number]];

        const firstHomePageHeaderIndex = homePage.ast.children.findIndex(node => node.type === 'heading');
        const descriptionAST = homePage.ast.children.slice(firstHomePageHeaderIndex);
        const descriptionMd = remarkProcessor.stringify({type: 'root', children: descriptionAST });

        const events = Object.fromEntries(Object.values(EventRecipient).map(recipient => [recipient, {} as Record<Lowercase<string>, GitHubWikiEventData<PapyrusGame.SkyrimSE>>]));

        const registrationControlFunctions: Record<Lowercase<string>, GitHubWikiFunctionData<PapyrusGame.SkyrimSE>> = {};
        const standaloneFunctions: Record<Lowercase<string>, GitHubWikiFunctionData<PapyrusGame.SkyrimSE>> = {};

        const data: GitHubWikiData<PapyrusGame.SkyrimSE> = {
            isPubliclyEditable: false,
            linkToWikiData: this.wikiBase.href,
            sourceDescription: descriptionMd,
            scripts: {
                po3_sksefunctions: {
                    linkToWikiData: this.wikiBase.href,
                    events: {},
                    functions: standaloneFunctions,
                },

                po3_events_alias: {
                    linkToWikiData: this.wikiBase.href,
                    events: events[EventRecipient.Alias],
                    functions: registrationControlFunctions,
                },
                po3_events_ame: {
                    linkToWikiData: this.wikiBase.href,
                    events: events[EventRecipient.AME],
                    functions: registrationControlFunctions,
                },
                po3_events_form: {
                    linkToWikiData: this.wikiBase.href,
                    events: events[EventRecipient.Form],
                    functions: registrationControlFunctions,
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

            fileLoop: for (const file of fileContents) { try {
                // Let's parse functions!
                let functionUnderConstruction: Omit<Partial<GitHubWikiFunctionData<PapyrusGame.SkyrimSE>>, 'description'> & {
                    description: RootContent[];
                    node?: Node;
                } = { description: [] };
                let isInDeprecatedFunctionSection = false;

                function mergeFunctionDataObjs(firstFunctionData: GitHubWikiFunctionData<PapyrusGame.SkyrimSE>, ...remainingFunctionDataObjs: GitHubWikiFunctionData<PapyrusGame.SkyrimSE>[]): GitHubWikiFunctionData<PapyrusGame.SkyrimSE> {
                    return remainingFunctionDataObjs.reduce(function mergeFunctionDataObjsReducer(acc, functionData) {
                        if (acc.description && functionData.description && acc.description !== functionData.description) panic(`Merging function data with different descriptions:\n\n======\n${acc.description.trim()}\n======\n${functionData.description.trim()}\n======\n${JSON.stringify({existing: acc, new: functionData}, null, 4)}`, file.ast, file.filePath);
                        if (acc.name !== functionData.name) panic(`Merging function data with different names: "${acc.name}" and "${functionData.name}"\n${JSON.stringify({existing: acc, new: functionData})}`, file.ast, file.filePath);
                        if (acc.isFunctionDeprecated !== null && functionData.isFunctionDeprecated !== null && acc.isFunctionDeprecated !== functionData.isFunctionDeprecated) panic(`Merging function data with different, explicitly-defined deprecation statuses!\n${JSON.stringify({existing: acc, new: functionData}, null, 4)}`, file.ast, file.filePath);
                        const mergedRegistrationControlFunctions = new Set([...acc.controlsEventRegistrationFor || [], ...(functionData.controlsEventRegistrationFor || [])]);
                        return {
                            description: acc.description || functionData.description,
                            linkToWikiData: acc.linkToWikiData || functionData.linkToWikiData,
                            name: acc.name || functionData.name,
                            controlsEventRegistrationFor: mergedRegistrationControlFunctions.size > 0 ? Array.from(mergedRegistrationControlFunctions) : null,
                            isFunctionDeprecated: acc.isFunctionDeprecated ?? functionData.isFunctionDeprecated,
                        };
                    }, firstFunctionData);
                }

                const finalizeFunction = (node: Node) => {
                    if (!functionUnderConstruction.node) return;
                    if (!functionUnderConstruction.name) panic('Function under construction is missing name, we tried to finalize it!', node, file.filePath);

                    const newObj: GitHubWikiFunctionData<PapyrusGame.SkyrimSE> = {
                        description: functionUnderConstruction.description.length ? remarkProcessor.stringify({type: 'root', children: functionUnderConstruction.description}) : null,
                        linkToWikiData: new URL(`${file.name}#user-content-${functionUnderConstruction.name}`, this.wikiBase).href,
                        name: functionUnderConstruction.name,
                        controlsEventRegistrationFor: null,
                        isFunctionDeprecated: isInDeprecatedFunctionSection,
                    };
                    const existingObj = standaloneFunctions[functionUnderConstruction.name];
                    standaloneFunctions[functionUnderConstruction.name] = existingObj ? mergeFunctionDataObjs(existingObj, newObj) : newObj;
                    functionUnderConstruction = { description: [] };
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
                                    switch (node.children[0]!.value.toLowerCase()) {
                                        case 'getters':
                                            continue;

                                        case 'setters':
                                            continue;

                                        case 'deprecated':
                                            isInDeprecatedFunctionSection = true;
                                            continue;
                                    }
                                    return panic(`Unexpected level 2 heading: ${node.children[0]!.value}`, node, file.filePath);
                                }

                                case 3: {
                                    if (node.children.length !== 1 || node.children[0]!.type !== 'text') panic('Expected a single text node in a level 3 heading', node, file.filePath);
                                    functionUnderConstruction.node = node;
                                    functionUnderConstruction.name = toLowerCase(node.children[0]!.value);
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
                let eventUnderConstruction: Omit<Partial<GitHubWikiFunctionData<PapyrusGame.SkyrimSE>>, 'description'|'name'> & {
                    description: RootContent[],
                    headerText?: string,
                    names: Lowercase<string>[],
                    registrationControllerEntries: [Lowercase<string>, PapyrusScriptFunction<PapyrusGame.SkyrimSE>][]
                    node?: Node,
                } = { description: [], names: [], registrationControllerEntries: [] };

                function mergeEventDataObjs(node: Node, firstEventData: GitHubWikiEventData<PapyrusGame.SkyrimSE>, ...remainingEventDatObjs: GitHubWikiEventData<PapyrusGame.SkyrimSE>[]): GitHubWikiEventData<PapyrusGame.SkyrimSE> {
                    return remainingEventDatObjs.reduce(function mergeEventDataObjsReducer(acc, eventData) {
                        if (acc.description && eventData.description && acc.description !== eventData.description) panic(`Merging event data with different descriptions:\n\n======\n${acc.description.trim()}\n======\n${eventData.description.trim()}\n======\n${JSON.stringify({existing: acc, new: eventData}, null, 4)}`, node, file.filePath);
                        if (acc.name !== eventData.name) panic(`Merging event data with different names: "${acc.name}" and "${eventData.name}"\n${JSON.stringify({existing: acc, new: eventData}, null, 4)}`, node, file.filePath);
                        const mergedRegistrationControlFunctions = new Set([...acc.registrationControlFunctions || [], ...(eventData.registrationControlFunctions || [])]);
                        return {
                            description: acc.description || eventData.description,
                            linkToWikiData: acc.linkToWikiData || eventData.linkToWikiData,
                            name: acc.name || eventData.name,
                            registrationControlFunctions: mergedRegistrationControlFunctions.size > 0 ? Array.from(mergedRegistrationControlFunctions) : null,
                        };
                    }, firstEventData);
                }

                const finalizeEvent = (recipient: EventRecipient) => {
                    if (!eventUnderConstruction.node) return;
                    if (!eventUnderConstruction.headerText) panic('Event under construction is missing a header text, we tried to finalize it!', eventUnderConstruction.node, file.filePath);
                    if (eventUnderConstruction.names.length < 1) panic('Event under construction is missing a name, we tried to finalize it!', eventUnderConstruction.node, file.filePath);

                    const anchorId = eventUnderConstruction.headerText.toLowerCase().replace(/[^a-z0-9]+/gu, '-');
                    const linkToWikiData = new URL(`wiki/${file.name.slice(0, -path.extname(file.name).length)}#user-content-${anchorId}`, this.wikiBase).href;
                    try {
                        for (const name of eventUnderConstruction.names) {
                            const newObj: GitHubWikiEventData<PapyrusGame.SkyrimSE> = {
                                description: eventUnderConstruction.description.length ? remarkProcessor.stringify({type: 'root', children: eventUnderConstruction.description}) : null,
                                linkToWikiData,
                                name,
                                registrationControlFunctions: eventUnderConstruction.registrationControllerEntries.length === 0 ? null : eventUnderConstruction.registrationControllerEntries.map(registrationControllerEntry => registrationControllerEntry[0]),
                            };
                            const existingObj = events[recipient][name];
                            events[recipient][name] = existingObj ? mergeEventDataObjs(eventUnderConstruction.node, existingObj, newObj) : newObj;
                        }

                        for (const [funcNameLowercase, func] of eventUnderConstruction.registrationControllerEntries)  {
                            const newObj: GitHubWikiFunctionData<PapyrusGame.SkyrimSE> = {
                                description: null,
                                linkToWikiData,
                                name: funcNameLowercase,
                                controlsEventRegistrationFor: eventUnderConstruction.names,
                                isFunctionDeprecated: null,
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

                                case 3: {
                                    if (node.children.length !== 1 || node.children[0]!.type !== 'text') panic('Expected a single text node in a level 3 heading', node, file.filePath);
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
            }}
        }

        return data;
    }

}
