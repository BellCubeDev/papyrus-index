/* eslint-disable complexity */
import type { PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate } from "../../papyrus/data-structures/indexing/function";
import type { PapyrusScriptFunction } from "../../papyrus/data-structures/pure/function";
import { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import { getWiki, type PapyrusWiki } from "../getWiki";
import { getWikiPageHTMLDocument } from "../fetching/GetWikiPageHTML";
import { parsoidElementsToMarkdown, parsoidToMarkdown } from "./parsoidToMarkdown";
import { toLowerCase } from "../../utils/toLowerCase";
import { appendToStepSummarySection, StepSummarySection } from "../../utils/stepSummary";
import { getBestName, getBestNameVariant } from "../../utils/getBestName";
import { extractLinearWikiPageData } from "./parsoidToPageData";
import { memoizeDevServerConst } from "../../utils/memoizeDevServerConst";

export type PotentialFunction<TGame extends PapyrusGame> = PapyrusScriptFunctionIndexedAggregate<TGame>| PapyrusScriptFunction<TGame> | PapyrusScriptFunctionIndexed<TGame>;

export interface WikiDataFunctionPage extends PapyrusWiki {
    /** Whether this function is marked as "latent" by the wiki. Will have the "Latent Functions" category. */
    isMarkedLatent: boolean;

    /** Whether this function is marked as "non-delayed" by the wiki. Will have the "Non-delayed Native Function" category */
    isMarkedNonDelayed: boolean;

    /** HTML elements representing the wiki's short description of this element. */
    shortDescriptionMarkdown: string | null;

    /** Examples from the wiki page designed to demonstrate the usage of this function */
    examplesData: Array<{
        //describingElements: Element[];
        code: string;
    }>

    /** Elements describing this function's return value */
    returnValueDescriptionMarkdown: string;

    /** Notes (typically in the form of bullet points) provided by the wiki. */
    notesMarkdown: string;

    /** Data for each of this function's parameters */
    parameters: Array<{
        /** The name of the parameter */
        name: string;
        /** The name of the parameter, with Markdown formatting. Included for completeness, but should almost always be identical to `name` .*/
        nameMarkdown: string;
        /** The description given by the wiki */
        descriptionMarkdown: string;
    }>;

    /** Pages a reader may also want to read, given the subject matter of this one (e.g. `Quest.Start()` might link to `Quest.Stop()`) */
    seeAlsoMarkdown: string;

    /** A link to the wiki page for this function */
    wikiPageUrl: string;
}

const wikiFunctionDataMemoization = memoizeDevServerConst('wikiFunctionDataMemoization', () => new WeakMap<PotentialFunction<PapyrusGame>, WikiDataFunctionPage | null>());

export async function getMediaWikiFunctionData<TGame extends PapyrusGame, TFunc extends PotentialFunction<TGame>>(game: TGame, func: TFunc, scriptName: string): Promise<WikiDataFunctionPage | null> {
    const wikiFunctionData = wikiFunctionDataMemoization.get(func);
    if (wikiFunctionData) return wikiFunctionData;

    const wikiFunctionDataNew = await getMediaWikiFunctionDataInternal(game, func, scriptName);
    wikiFunctionDataMemoization.set(func, wikiFunctionDataNew);
    return wikiFunctionDataNew;
}

async function getMediaWikiFunctionDataInternal<TGame extends PapyrusGame, TFunc extends PotentialFunction<TGame>>(game: TGame, func: TFunc, scriptName: string): Promise<WikiDataFunctionPage | null> {
    const wiki = getWiki(game);

    const functionName = Array.isArray(func.name) ? getBestNameVariant(func.name)[1] : func.name;
    const pageName = `${functionName} - ${scriptName}`;
    const document = await getWikiPageHTMLDocument(wiki, pageName);
    if (!document) return null;

    const pageData = extractLinearWikiPageData(document);

    // TODO: Better support the formatting on display in the Skyrim CK wiki's ColorComponent script,
    //       especially the parameters section. That, or contribute to the wiki and standardize it.
    // e.g. https://ck.uesp.net/wiki/GetAlpha_-_ColorComponent

    const isMarkedLatent = pageData.categories.includes('Category:Latent Functions');
    const isMarkedNonDelayed = pageData.categories.includes('Category:Non-delayed Native Function');

    const shortDescriptionElements = pageData.sections[0]?.contents || [];
    while (true) {
        if (!shortDescriptionElements[0]) break;
        const contentToMatch = shortDescriptionElements[0].textContent?.trim().toLocaleLowerCase() as Omit<Lowercase<string>, 'startsWith'> & {startsWith: (s: Lowercase<string>) => boolean};
        if (contentToMatch !== undefined) {
            if (!contentToMatch.startsWith('source:')
                && !contentToMatch.startsWith('member of:')
                && !contentToMatch.match(/^\w\wse member of:/u))
                break;
        }
        shortDescriptionElements.shift();
    }
    const shortDescriptionMarkdown = shortDescriptionElements.length === 0 ? null : await parsoidElementsToMarkdown(shortDescriptionElements, document.location.href);
    if (shortDescriptionMarkdown === null) console.warn(`[MediaWiki Scraping - getWikiDataFunctionPage()] Short description is null for page "${pageName}" on wiki "${wiki.wikiName}" (${document.location.href})!`);

    const exampleCodeElements = pageData.sectionsById.examples?.contents.filter(el=>el.getAttribute('typeof') === 'mw:Extension/source') ?? [];
    const examplesData = exampleCodeElements.map(e => ({code: e.textContent || ''}));

    const returnValueDescriptionElements = pageData.sectionsById.return_value?.contents ?? [];
    const returnValueDescriptionMarkdown = await parsoidElementsToMarkdown(returnValueDescriptionElements, document.location.href);

    const notesElements = pageData.sectionsById.notes?.contents ?? [];
    const notesMarkdown = await parsoidElementsToMarkdown(notesElements, document.location.href);

    const parametersListElements = pageData.sectionsById.parameters?.contents ?? [];
    const parametersListItems = parametersListElements.filter((el): el is HTMLUListElement => el.tagName.toLowerCase() === 'ul').map(ul => Array.from(ul.children).filter((li): li is HTMLLIElement => li.tagName.toLowerCase() === 'li')).flat(1);

    const parameters: WikiDataFunctionPage['parameters'] = await Promise.all(parametersListItems.map(async li => {
        const asMarkdown = await parsoidToMarkdown(li.innerHTML, document.location.href);
        const [nameMarkdown, descriptionMarkdown] = asMarkdown.split(':', 2).map(s => s.trim());
        if (!descriptionMarkdown) return null;
        if (!nameMarkdown) {
            console.warn(`[MediaWiki Scraping - getWikiDataFunctionPage()] Failed to parse parameter name from string "${asMarkdown}"! Skipping...`);
            return null;
        }
        let name = nameMarkdown.match(/\b[a-z0-9_]+\b/iu)?.[0] || '';
        const lowercaseName = toLowerCase(name);
        const lowercaseNameNoPrefix = toLowerCase(name.replace(/^a[a-z](?=[A-Z0-9])/u, ''));
        const param = func.parameters.find(candidate => {
            if (toLowerCase(candidate.name) === lowercaseName) return true;
            if (toLowerCase(candidate.name.replace(/^a[a-z](?=[A-Z])/u, '')) === lowercaseNameNoPrefix) return true;
            return false;
        });
        if (!param) {
            const editSummary = `Correct Parameter Name (${name} --> CORRECT_NAME_HERE)`;
            if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') {
                console.warn(`
⚠️  [96m[MediaWiki Scraping - getWikiDataFunctionPage()] Invalid Parameter Detected![0m
[93m|[0m Parameter ${name} not found in function [32m${scriptName}[0m.[33m${functionName}[0m()!
[93m|[0m Wiki: ${wiki.wikiName} (for ${wiki.wikiTrueGame})
[93m|[0m
${wiki.wikiTrueGame !== game ? `[93m|[0m [101mCAUTION: The wiki page is for ${wiki.wikiTrueGame}, but the function is for ${game}![0m
` : ''}[93m|[0m Invalid parameter name: ${name}
[93m|[0m Valid parameter names are: ${func.parameters.map(p => p.name).join(' | ')}
[93m|[0m
[93m|[0m Edit Link: [34m${document.location.href}?action=edit&summary=${encodeURIComponent(editSummary)}[0m
[93m|[0m Edit Message: [35m${editSummary}[0m
[93m|[0m
[93m|[0m Skipping...`);
            }
            appendToStepSummarySection(`
### Invalid Function Parameter Name

${game !== wiki.wikiTrueGame ? `***CAUTION: The wiki page is for ${wiki.wikiTrueGame}, but the function is for ${game}!***` : ''}
- **Wiki**: [${wiki.wikiName}](${wiki.wikiBaseUrl}) (for ${wiki.wikiTrueGame})
- **Wiki Page:** [${pageName}](${document.location.href})
- **Function:** ${scriptName}.${functionName}
- **INVALID Parameter Name:** \`${name}\`
${
    '$sources' in func
        ? Object.entries(func.$sources).map(([source, variant]) => `- **Valid Parameter Names (from ${source}):** ${variant.parameters.map(p => `\`${p.name}\``).join(' | ')}`).join('\n')
        : `- **Valid Parameter Names:** ${func.parameters.map(p => `\`${p.name}\``).join(' | ')}`
}
- **Edit Link:** [${document.location.href}?action=edit&summary=${encodeURIComponent(editSummary)}](${document.location.href}?action=edit&summary=${encodeURIComponent(editSummary)})
- **Edit Message:** ${editSummary}
`.trim(), StepSummarySection.MediaWikiFormattingWarnings);
            return null;
        }
        name = !Array.isArray(param) ? param.name : getBestName(param.map(p => p.name))[1];
        return {name, nameMarkdown, descriptionMarkdown};
    })).then(a => a.filter((obj): obj is NonNullable<typeof obj> => obj !== null));

    const seeAlsoElements = pageData.sectionsById.see_also?.contents ?? [];
    const seeAlsoMarkdown = await parsoidElementsToMarkdown(seeAlsoElements, document.location.href);

    return {
        ...wiki,
        isMarkedLatent,
        isMarkedNonDelayed,
        returnValueDescriptionMarkdown,
        shortDescriptionMarkdown,
        examplesData,
        notesMarkdown,
        parameters,
        seeAlsoMarkdown,
        wikiPageUrl: document.location.href,
    };
}
