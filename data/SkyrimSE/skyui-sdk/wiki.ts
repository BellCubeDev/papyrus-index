/* eslint-disable max-lines */
/* eslint-disable class-methods-use-this */
/* eslint-disable complexity */
/* eslint-disable max-depth */

import type { ListItem, Node, RootContent } from 'mdast';
import fs from "node:fs/promises";
import path from "node:path";
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { githubWikisDir } from "../../../src/folders";
import { PapyrusGame } from "../../../src/papyrus/data-structures/pure/game";
import { UnreachableError } from "../../../src/UnreachableError";
import { appendToStepSummarySection, StepSummarySection } from "../../../src/utils/stepSummary";
import { toLowerCase } from "../../../src/utils/toLowerCase";
import { GitHubWiki } from "../../../src/wiki-data-extraction/individual-github-wikis/GitHubWiki";
import type { GitHubWikiData, GitHubWikiEventData, GitHubWikiFunctionData, GitHubWikiPropertyData, GitHubWikiScriptData } from "../../../src/wiki-data-extraction/individual-github-wikis/types";

/*
 * Many decisions in this file were coupled closely with the structure of the SkyUI wiki.
 *
 * While normally a bad idea, the SkyUI wiki has not seen any noteworthy changes in 10 years.
 * The only changes in the last decade were fixing a couple of broken links.
 *
 * As such, the structure of the wiki is considered stable enough to be hardcoded here.
 * Otherwise strange-seeming assumptions have been made in this file as a result.
*/


const wikiPath = path.join(githubWikisDir, PapyrusGame.SkyrimSE, 'skyui-sdk');
const remarkProcessor = remark().use(remarkGfm);

function stringifyNodes(nodes: RootContent[]): string | null {

    const root = {
        type: 'root',
        children: nodes,
    } as const;

    // Provide rich link support for functions and events
    visit(root, 'link', (node) => {
        if (node.url.startsWith('#')) {
            const anchorId = node.url.substring(1);
            if (anchorId.match(/[a-z]Functions$/u)) {
                // do nothing
            } else if (anchorId.match(/^On[A-Z]/u)) {
                // TODO: Enable this once we have event support node.url = `papyrus-index:/skyrimse/script/ski_configbase/event/${toLowerCase(anchorId)}`;
            } else {
                node.url = `papyrus-index:/skyrimse/script/ski_configbase/function/${toLowerCase(anchorId)}`;
            }
        }
    });

    return remarkProcessor.stringify(root).trim() || null;
}

enum SkyUIWikiAPIReferenceSection {
    Functions,
    Events,
    Properties,
}

const API_REFERENCE_PAGE_URL = 'https://github.com/schlangster/skyui/wiki/MCM-API-Reference' as const;

export default class SkyrimSkyUIWiki extends GitHubWiki<PapyrusGame.SkyrimSE> {

    protected override async getDataDirect(): Promise<GitHubWikiData> {
        const [homeData, mcmAPIReferenceData] = await Promise.all([
            this.parseHomeFile(),
            this.parseAPIReferenceForMCM()
        ]);

        return {
            linkToWikiData: 'https://github.com/schlangster/skyui/wiki',
            isPubliclyEditable: false,
            ...homeData,
            scripts: {
                ski_configbase: {
                    linkToWikiData: API_REFERENCE_PAGE_URL,
                    ...mcmAPIReferenceData,
                }
            }
        };
    }

    async parseHomeFile(): Promise<Pick<GitHubWikiData, 'sourceDescriptionMD'>> {
        const homeFilePath = path.join(wikiPath, 'Home.md');
        const homeFileContent = await fs.readFile(homeFilePath, 'utf-8');

        const parsedHomeFile = await remarkProcessor.parse(homeFileContent);

        const headerSDKIndex = parsedHomeFile.children.findIndex((node) =>
            node.type === 'heading' && node.depth === 3 && node.children.length === 1 && node.children[0]!.type === 'text' && node.children[0].value === 'SkyUI SDK'
        );

        // Filter out a list item with link to the "MCM API Reference" page, since the API reference handled by this project
        const sourceDescriptionNodes = parsedHomeFile.children.slice(headerSDKIndex).map(node => {
            // If it's not a list, keep it as is
            if (node.type !== 'list') return node;

            // all of this, just to replace a single link in the list items...
            return {
                ...node,
                children: node.children.map((listItem): ListItem => {
                    // Skip if it's not a list item
                    if (listItem.type !== 'listItem') return listItem;

                    const paragraph = listItem.children[0];
                    if (!paragraph || paragraph.type !== 'paragraph') return listItem;

                    return {
                        ...listItem,
                        children: [{
                            ...paragraph,
                            children: paragraph.children.flatMap(child => {
                                if (child.type === 'link' &&
                                    child.url === 'wiki/MCM-API-Reference' &&
                                    child.children[0]?.type === 'text' &&
                                    child.children[0]?.value === 'API Reference'
                                ) {
                                    return [
                                        {
                                            type: 'text',
                                            value: 'API Reference: '
                                        },
                                        {
                                            ...child,
                                            url: 'papyrus-index:/skyrimse/script/ski_configbase/',
                                            children: [{
                                                type: 'text',
                                                value: ''
                                            }],
                                        },
                                    ];
                                }

                                return [child];
                            })
                        }],
                    };
                })
            };
        });

        const sourceDescriptionMD = stringifyNodes(sourceDescriptionNodes);

        return {
            sourceDescriptionMD,
        };
    }

    async parseAPIReferenceForMCM(): Promise<Pick<GitHubWikiScriptData, 'events'|'functions'|'properties'>> {
        const mcmAPIReferenceFilePath = path.join(wikiPath, 'MCM-API-Reference.md');

        function panic(message: string, node: Node): never {
            const err = new Error(message);
            appendToStepSummarySection(`
Error in SkyrimSkyUIWiki file ${mcmAPIReferenceFilePath}: ${message}

This error occurred at node:
\`\`\`json
${JSON.stringify(node, null, 2)}
\`\`\`
Processing was aborted.
`, StepSummarySection.GitHubWikiFormattingWarnings);

            console.error(`Error in SkyrimSkyUIWiki file ${mcmAPIReferenceFilePath}: ${message} at node:`, node, {
                functionUnderConstruction,
                eventUnderConstruction,
                propertyUnderConstruction,
            }, ...(!node.position ? [] : [`\n    at ${mcmAPIReferenceFilePath}:${node.position.start.line}:${node.position.start.column}`]), err.stack?.replace(/.*\n.*/mu, ''));
            throw err;
        }

        const mcmAPIReferenceFileContent = await fs.readFile(mcmAPIReferenceFilePath, 'utf-8');

        const parsedAPIReference = await remarkProcessor.parse(mcmAPIReferenceFileContent);

        const createFunctionUnderConstruction = (): typeof functionUnderConstruction =>
            ({parameters: {}, exampleMDs: []});
        let functionUnderConstruction: Partial<GitHubWikiFunctionData> & {headerNode?: RootContent} & Pick<GitHubWikiFunctionData, 'parameters'|'exampleMDs'> = createFunctionUnderConstruction();
        const functions: Record<Lowercase<string>, GitHubWikiFunctionData> = {};
        function finalizeFunction() {
            if (!functionUnderConstruction.headerNode) return;
            const node = functionUnderConstruction.headerNode;
            if (!functionUnderConstruction.name) panic(`Function under construction has no name: ${JSON.stringify(functionUnderConstruction)}`, node);
            if (functions[functionUnderConstruction.name]) panic(`Duplicate functions with name ${functionUnderConstruction.name} in MCM API Reference: ${JSON.stringify({old: functions[functionUnderConstruction.name], new: functionUnderConstruction}, null, 4)}`, node);
            if (!functionUnderConstruction.linkToWikiData) panic(`Function under construction has no link to wiki data: ${JSON.stringify(functionUnderConstruction)}`, node);
            functions[functionUnderConstruction.name] = {
                name: functionUnderConstruction.name,
                controlsEventRegistrationFor: functionUnderConstruction.controlsEventRegistrationFor ?? null,
                descriptionMD: functionUnderConstruction.descriptionMD ?? null,
                deprecatedFor: functionUnderConstruction.deprecatedFor ?? null,
                isFunctionDeprecated: functionUnderConstruction.isFunctionDeprecated ?? null,
                linkToWikiData: functionUnderConstruction.linkToWikiData,
                parameters: functionUnderConstruction.parameters,
                exampleMDs: functionUnderConstruction.exampleMDs,
                returnValueDescriptionMD: functionUnderConstruction.returnValueDescriptionMD ?? null,
                notesMD: functionUnderConstruction.notesMD ?? null,
            };
            functionUnderConstruction = createFunctionUnderConstruction();
        }


        const createEventUnderConstruction = (): typeof eventUnderConstruction =>
            ({parameters: {}, exampleMDs: []});
        let eventUnderConstruction: Partial<GitHubWikiEventData> & {headerNode?: RootContent} & Pick<GitHubWikiEventData, 'parameters'|'exampleMDs'> = createEventUnderConstruction();
        const events: Record<Lowercase<string>, GitHubWikiEventData> = {};
        function finalizeEvent() {
            if (!eventUnderConstruction.headerNode) return;
            const node = eventUnderConstruction.headerNode;
            if (!eventUnderConstruction.name) panic(`Event under construction has no name: ${JSON.stringify(eventUnderConstruction)}`, node);
            if (events[eventUnderConstruction.name]) panic(`Duplicate events with name ${eventUnderConstruction.name} in MCM API Reference: ${JSON.stringify({old: events[eventUnderConstruction.name], new: eventUnderConstruction}, null, 4)}`, node);
            if (!eventUnderConstruction.linkToWikiData) panic(`Event under construction has no link to wiki data: ${JSON.stringify(eventUnderConstruction)}`, node);

            events[eventUnderConstruction.name] = {
                name: eventUnderConstruction.name,
                descriptionMD: eventUnderConstruction.descriptionMD ?? null,
                registrationControlFunctions: eventUnderConstruction.registrationControlFunctions ?? null,
                parameters: eventUnderConstruction.parameters ?? {},
                linkToWikiData: eventUnderConstruction.linkToWikiData,
                exampleMDs: eventUnderConstruction.exampleMDs,
                notesMD: eventUnderConstruction.notesMD ?? null,
            };
            eventUnderConstruction = createEventUnderConstruction();
        }


        const createPropertyUnderConstruction = (): typeof propertyUnderConstruction =>
            ({});
        let propertyUnderConstruction: Partial<GitHubWikiPropertyData> & {headerNode?: RootContent} = createPropertyUnderConstruction();
        const properties: Record<Lowercase<string>, GitHubWikiPropertyData> = {};
        function finalizeProperty() {
            if (!propertyUnderConstruction.headerNode) return;
            const node = propertyUnderConstruction.headerNode;
            if (!propertyUnderConstruction.name) panic(`Property under construction has no name: ${JSON.stringify(propertyUnderConstruction)}`, node);
            if (properties[propertyUnderConstruction.name]) panic(`Duplicate properties with name ${propertyUnderConstruction.name} in MCM API Reference: ${JSON.stringify({old: properties[propertyUnderConstruction.name], new: propertyUnderConstruction}, null, 4)}`, node);

            if (!propertyUnderConstruction.linkToWikiData) panic(`Property under construction has no link to wiki data: ${JSON.stringify(propertyUnderConstruction)}`, node);

            properties[propertyUnderConstruction.name] = {
                name: propertyUnderConstruction.name,
                descriptionMD: propertyUnderConstruction.descriptionMD ?? null,
                sdkUsageMD: propertyUnderConstruction.sdkUsageMD ?? null,
                exampleMDs: [],
                linkToWikiData: propertyUnderConstruction.linkToWikiData,
                notesMD: propertyUnderConstruction.notesMD ?? null,
            };
            propertyUnderConstruction = createPropertyUnderConstruction();
        }

        let currentSection: SkyUIWikiAPIReferenceSection | null = null;

        for (let  i = 0; i < parsedAPIReference.children.length; i++) {
            const initialNode = parsedAPIReference.children[i]!;

            if (initialNode.type === 'thematicBreak') {
                // Reset the under construction objects when we hit a thematic break
                finalizeFunction();
                finalizeEvent();
                finalizeProperty();
                continue;
            }

            if (initialNode.type === 'heading' && initialNode.depth === 2) {
                const sectionTitle = initialNode.children[0]?.type === 'text' ? initialNode.children[0].value.toLowerCase() : '';

                finalizeFunction();
                finalizeEvent();
                finalizeProperty();

                switch (sectionTitle) {
                    case 'overview': continue;
                    case 'functions': currentSection = SkyUIWikiAPIReferenceSection.Functions; continue;
                    case 'events': currentSection = SkyUIWikiAPIReferenceSection.Events; continue;
                    case 'properties': currentSection = SkyUIWikiAPIReferenceSection.Properties; continue;
                    default:
                        panic(`Unexpected section title: ${sectionTitle}`, initialNode);
                }
            }

            switch (currentSection) {
                case null: continue;

                case SkyUIWikiAPIReferenceSection.Properties: {
                    if (initialNode.type !== 'heading' || initialNode.depth !== 4) continue;
                    finalizeProperty();

                    const lastPropNameChild = initialNode.children.at(-1);
                    if (!lastPropNameChild || lastPropNameChild.type !== 'inlineCode') panic(`Expected last child of property header to be inlineCode, got ${lastPropNameChild?.type}`, initialNode);
                    const {propertyName} = lastPropNameChild.value.match(/\s+(?<propertyName>\w+)$/u)?.groups ?? {};
                    if (!propertyName) panic(`Property name not found in header: ${JSON.stringify(initialNode, null, 4)}`, initialNode);
                    const propertyIdElement = initialNode.children[0]!;
                    if (propertyIdElement.type !== 'html')  panic(`Expected first child of property header to be HTML, got ${propertyIdElement.type}`, initialNode);
                    const propertyIdMatch = propertyIdElement.value.match(/^<a\s+id="(?<propertyId>\w+)"\s*\/?>/u);
                    const propertyId = propertyIdMatch?.groups?.propertyId;
                    if (!propertyId) panic(`Property ID not found in header ID element: ${JSON.stringify(propertyIdElement, null, 4)}`, propertyIdElement);
                    i++;

                    propertyUnderConstruction.headerNode = initialNode;
                    propertyUnderConstruction.name = toLowerCase(propertyName);
                    propertyUnderConstruction.linkToWikiData = `${API_REFERENCE_PAGE_URL}#${propertyId}`;


                    const descriptionAndRestOfNodes = parsedAPIReference.children.slice(i);
                    const descriptionNodes = descriptionAndRestOfNodes.slice(0, descriptionAndRestOfNodes.findIndex(node => node.type === 'heading' && node.depth === 5 && node.children[0]?.type === 'text' && node.children[0].value === 'Usage:'));
                    propertyUnderConstruction.descriptionMD = stringifyNodes(descriptionNodes);
                    i += descriptionNodes.length;

                    i++; // skip the "Usage:" heading

                    const usageNodesAndRestOfNodes = parsedAPIReference.children.slice(i);
                    const usageNodesStopIndex = usageNodesAndRestOfNodes.findIndex(node => node.type === 'thematicBreak' || node.type === 'heading');
                    const usageNodes =  usageNodesAndRestOfNodes.slice(0, usageNodesStopIndex);
                    i += usageNodes.length - 1;
                    propertyUnderConstruction.sdkUsageMD = stringifyNodes(usageNodes);

                    continue;
                }

                case SkyUIWikiAPIReferenceSection.Events: {
                    if (initialNode.type !== 'heading' || initialNode.depth !== 4) continue;
                    finalizeEvent();

                    const lastEventNameChild = initialNode.children.at(-1);
                    if (!lastEventNameChild || lastEventNameChild.type !== 'inlineCode') panic(`Expected last child of event header to be inlineCode, got ${lastEventNameChild?.type}`, initialNode);
                    const {eventName} = lastEventNameChild.value.match(/^(?<eventName>\w+)\(.*\)$/u)?.groups ?? {};
                    if (!eventName) panic(`Event name not found in header: ${JSON.stringify(initialNode, null, 4)}`, initialNode);
                    const eventIdElement = initialNode.children[0]!;
                    if (eventIdElement.type !== 'html')  panic(`Expected first child of event header to be HTML, got ${eventIdElement.type}`, initialNode);
                    const eventIdMatch = eventIdElement.value.match(/^<a\s+id="(?<eventId>\w+)"\s*\/?>/u);
                    const eventId = eventIdMatch?.groups?.eventId;
                    if (!eventId) panic(`Event ID not found in header ID element: ${JSON.stringify(eventIdElement, null, 4)}`, eventIdElement);
                    i++;

                    eventUnderConstruction.headerNode = initialNode;
                    eventUnderConstruction.name = toLowerCase(eventName);
                    eventUnderConstruction.linkToWikiData = `${API_REFERENCE_PAGE_URL}#${eventId}`;

                    const descriptionAndRestOfNodes = parsedAPIReference.children.slice(i);
                    const descriptionNodes = descriptionAndRestOfNodes.slice(0, descriptionAndRestOfNodes.findIndex(node => node.type === 'thematicBreak' || (node.type === 'heading' && (node.depth === 2 || (node.depth === 5 && node.children[0]?.type === 'text' && node.children[0].value === 'Parameters:')))));
                    // we'll combine these with the nodes from the Usage header at the end
                    i += descriptionNodes.length - 1;

                    const maybeParametersHeader = parsedAPIReference.children[i + 1]!;
                    if (maybeParametersHeader.type === 'thematicBreak' || maybeParametersHeader.type === 'heading' && maybeParametersHeader.depth === 2) continue;
                    if (maybeParametersHeader.type !== 'heading' || maybeParametersHeader.depth !== 5 || maybeParametersHeader.children[0]?.type !== 'text' || maybeParametersHeader.children[0].value !== 'Parameters:') panic(`Expected "Parameters:" header after description, got ${maybeParametersHeader.type}`, maybeParametersHeader);
                    i += 2;

                    const parametersList = parsedAPIReference.children[i]!;
                    if (parametersList.type !== 'list') panic(`Expected parameters list to be a list, got ${parametersList.type}`, parametersList);
                    for (const listItem of parametersList.children) {
                        if (listItem.type !== 'listItem') panic(`Expected list item in parameters list, got ${listItem.type}`, listItem);
                        const parameterParagraph = listItem.children[0];
                        if (!parameterParagraph || parameterParagraph.type !== 'paragraph') panic(`Expected first child of list item to be a paragraph, got ${parameterParagraph?.type}`, parameterParagraph ?? listItem);
                        const [parameterFirstTextChild, ...otherParameterChildren] = parameterParagraph.children;
                        if (!parameterFirstTextChild || parameterFirstTextChild.type !== 'text') panic(`Expected first child of paragraph to be text, got ${parameterFirstTextChild?.type}`, parameterFirstTextChild ?? parameterParagraph);
                        const {parameterName, restOfText} = parameterFirstTextChild.value.match(/^(?<parameterName>\w+)\s*-\s*(?<restOfText>.*)/u)?.groups ?? {};
                        if (!parameterName) panic(`Parameter name not found in paragraph: ${JSON.stringify(parameterParagraph, null, 4)}`, parameterParagraph);
                        if (!restOfText) panic(`Rest of text not found in paragraph: ${JSON.stringify(parameterParagraph, null, 4)}`, parameterParagraph);

                        const descriptionMD = stringifyNodes([{
                            type: 'paragraph',
                            children: [
                                {
                                    ...parameterFirstTextChild,
                                    value: restOfText,
                                },
                                ...otherParameterChildren,
                            ],
                        }]);

                        const parameterNameLowercase = toLowerCase(parameterName);
                        if (eventUnderConstruction.parameters[parameterNameLowercase]) panic(`Duplicate parameter name ${parameterNameLowercase} in event ${eventUnderConstruction.name} in MCM API Reference: ${JSON.stringify(eventUnderConstruction.parameters, null, 4)}`, parameterParagraph);
                        eventUnderConstruction.parameters[parameterNameLowercase] = {
                            descriptionMD: descriptionMD || null,
                            name: parameterNameLowercase,
                            linkToWikiData: eventUnderConstruction.linkToWikiData,
                            notesMD: null,
                            exampleMDs: [],
                        };
                    }

                    const maybeUsageHeader = parsedAPIReference.children[i + 1]!;
                    if (maybeUsageHeader.type === 'thematicBreak') continue;
                    if (maybeUsageHeader.type !== 'heading' || maybeUsageHeader.depth !== 5 || maybeUsageHeader.children[0]?.type !== 'text' || maybeUsageHeader.children[0].value !== 'Usage:') panic(`Expected "Usage:" header after parameters list, got ${maybeUsageHeader.type}`, maybeUsageHeader);
                    i += 2;

                    const usageNodesAndRestOfNodes = parsedAPIReference.children.slice(i);
                    const usageNodesStopIndex = usageNodesAndRestOfNodes.findIndex(node => node.type === 'thematicBreak' || node.type === 'heading');
                    const usageNodes =  usageNodesAndRestOfNodes.slice(0, usageNodesStopIndex);
                    i += usageNodes.length - 1;


                    eventUnderConstruction.descriptionMD = stringifyNodes([...descriptionNodes, ...usageNodes]);

                    continue;
                }

                case SkyUIWikiAPIReferenceSection.Functions: {
                    if (initialNode.type !== 'heading' || initialNode.depth !== 4) continue;
                    finalizeFunction();

                    const lastFunctionNameChild = initialNode.children.at(-1);
                    if (!lastFunctionNameChild || lastFunctionNameChild.type !== 'inlineCode') panic(`Expected last child of function header to be inlineCode, got ${lastFunctionNameChild?.type}`, initialNode);

                    const functionSignature = lastFunctionNameChild.value;
                    const signatureMatch = functionSignature.match(/^(?:(?<returnType>\w+(?:\[\])?)\s+)?(?<functionName>\w+)\(.*\)$/u);
                    if (!signatureMatch?.groups?.functionName) panic(`Function name not found in header: ${JSON.stringify(initialNode, null, 4)}`, initialNode);

                    const functionIdElement = initialNode.children[0]!;
                    if (functionIdElement.type !== 'html')  panic(`Expected first child of function header to be HTML, got ${functionIdElement.type}`, initialNode);
                    const functionIdMatch = functionIdElement.value.match(/^<a\s+id="(?<functionId>\w+)"\s*\/?>/u);
                    const functionId = functionIdMatch?.groups?.functionId;
                    if (!functionId) panic(`Function ID not found in header ID element: ${JSON.stringify(functionIdElement, null, 4)}`, functionIdElement);

                    // INCORRECT WIKI DATA EDGE CASE HANDLER AHEAD!
                    const functionName = functionId === 'SetInputOptionValue' ? functionId : signatureMatch.groups.functionName;
                    const _returnType = signatureMatch.groups.returnType;

                    functionUnderConstruction.headerNode = initialNode;
                    if (functionUnderConstruction.name) panic(`Function under construction already has a name: ${functionUnderConstruction.name}`, initialNode);
                    functionUnderConstruction.name = toLowerCase(functionName);
                    functionUnderConstruction.linkToWikiData = `${API_REFERENCE_PAGE_URL}#${functionId}`;
                    i++;

                    // Process description
                    const descriptionAndRestOfNodes = parsedAPIReference.children.slice(i);
                    const nextHeaderIndex = descriptionAndRestOfNodes.findIndex(node =>
                        node.type === 'thematicBreak' ||
                        node.type === 'heading'
                    );
                    const descriptionNodes = descriptionAndRestOfNodes.slice(0, nextHeaderIndex);
                    functionUnderConstruction.descriptionMD = stringifyNodes(descriptionNodes);
                    i += descriptionNodes.length;

                    // Process additional sections
                    while (i < parsedAPIReference.children.length) {
                        const node = parsedAPIReference.children[i]!;

                        if (node.type === 'thematicBreak') break;
                        if (node.type !== 'heading') panic(`Unexpected node in MCM API Reference: ${node.type} at index ${i} in section ${currentSection}`, node);
                        if (node.depth !== 5 || node.children[0]?.type !== 'text') break;

                        i++;

                        const sectionTitle = toLowerCase(node.children[0].value);

                        if (sectionTitle === 'examples:') {
                            const examplesList = parsedAPIReference.children[i];
                            if (!examplesList || examplesList.type !== 'list') panic(`Expected examples section to be a list, got ${examplesList?.type}`, examplesList ?? node);
                            i++;

                            if (examplesList.type === 'list') {
                                for (const listItem of examplesList.children) {
                                    if (listItem.type !== 'listItem') continue;
                                    const str = stringifyNodes(listItem.children);
                                    if (str) functionUnderConstruction.exampleMDs.push(str);
                                }
                            }
                        } else if (sectionTitle === 'parameters:') {
                            const parametersList = parsedAPIReference.children[i];
                            if (!parametersList || parametersList.type !== 'list') panic(`Expected parameters section to be a list, got ${parametersList?.type}`, parametersList ?? node);
                            i++;

                            if (parametersList.type === 'list') {
                                for (const listItem of parametersList.children) {
                                    if (listItem.type !== 'listItem') continue;
                                    const parameterParagraph = listItem.children[0];
                                    if (!parameterParagraph || parameterParagraph.type !== 'paragraph') continue;

                                    const [parameterFirstTextChild, ...otherParameterChildren] = parameterParagraph.children;
                                    if (!parameterFirstTextChild || parameterFirstTextChild.type !== 'text') continue;

                                    const paramMatch = parameterFirstTextChild.value.match(/^(?<parameterName>\w+)\s*-\s*(?<restOfText>.*)/u);
                                    if (!paramMatch?.groups?.parameterName) continue;

                                    const descriptionMD = stringifyNodes([{
                                        type: 'paragraph',
                                        children: [
                                            { ...parameterFirstTextChild, value: paramMatch.groups.restOfText || '' },
                                            ...otherParameterChildren,
                                        ],
                                    }]);

                                    const parameterNameLowercase = toLowerCase(paramMatch.groups.parameterName);
                                    functionUnderConstruction.parameters[parameterNameLowercase] = {
                                        name: parameterNameLowercase,
                                        descriptionMD: descriptionMD || null,
                                        exampleMDs: [],
                                        notesMD: null,
                                        linkToWikiData: functionUnderConstruction.linkToWikiData,
                                    };
                                }
                            }

                            const paramNotesNodesAndRestOfNodes = parsedAPIReference.children.slice(i);
                            const paramNotesEndIndex = paramNotesNodesAndRestOfNodes.findIndex(n => n.type === 'thematicBreak' || n.type === 'heading' );
                            const paramNotesNodes = paramNotesNodesAndRestOfNodes.slice(0, paramNotesEndIndex === -1 ? paramNotesNodesAndRestOfNodes.length : paramNotesEndIndex);
                            i += paramNotesNodes.length;

                            const paramNotesMD = stringifyNodes(paramNotesNodes);
                            if  (paramNotesMD) {
                                if (functionUnderConstruction.notesMD) functionUnderConstruction.notesMD += `\n\n${paramNotesMD}`;
                                else functionUnderConstruction.notesMD = paramNotesMD;
                            }
                        } else if (sectionTitle.startsWith('since version ')) {
                            // do nothing
                        } else {
                            // Generically parse other sections
                            const sectionNodesAndRestOfNodes = parsedAPIReference.children.slice(i);
                            const sectionEndIndex = sectionNodesAndRestOfNodes.findIndex(n => n.type === 'thematicBreak' || n.type === 'heading' );
                            const sectionNodes = sectionNodesAndRestOfNodes.slice(0, sectionEndIndex === -1 ? sectionNodesAndRestOfNodes.length : sectionEndIndex);
                            i += sectionNodes.length;

                            switch (sectionTitle) {
                                case 'return value:':
                                    functionUnderConstruction.returnValueDescriptionMD = stringifyNodes(sectionNodes);
                                    break;
                                case 'context:': {
                                    const str = `#### Context\n\n${stringifyNodes(sectionNodes)}`;
                                    if (!functionUnderConstruction.descriptionMD) functionUnderConstruction.descriptionMD = str;
                                    else functionUnderConstruction.descriptionMD += `\n\n${str}`;
                                    break;
                                }
                                default:
                                    panic(`Unexpected section in MCM API Reference: ${sectionTitle}`, node);
                            }
                        }
                    }

                    continue;
                }

                default:
                    throw new UnreachableError(currentSection, `Unexpected section in MCM API Reference: ${currentSection}`);
            }
        }

        finalizeFunction();
        finalizeEvent();
        finalizeProperty();

        return {
            functions,
            events,
            properties,
        };
    }
}
