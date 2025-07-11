/* eslint-disable complexity */
import type { PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate } from "../../../papyrus/data-structures/indexing/function";
import type { PapyrusScriptFunction } from "../../../papyrus/data-structures/pure/function";
import { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { getWiki, type PapyrusWiki as CKPapyrusWiki } from "../getWiki";
import { getWikiPageHTMLDocument } from "../fetching/GetWikiPageHTML";
import { parsoidElementsToMarkdown, parsoidToMarkdown } from "./parsoidToMarkdown";
import { toLowerCase } from "../../../utils/toLowerCase";
import { appendToStepSummarySection, StepSummarySection } from "../../../utils/stepSummary";
import { getBestString, getBestStringVariant } from "../../../utils/getBestName";
import { extractLinearWikiPageData } from "./parsoidToPageData";
import { memoizeDevServerConst } from "../../../utils/memoizeDevServerConst";
import { AllScriptsIndexed } from "../../../papyrus/indexing/index-all";
import { AllSourcesCombined } from "../../../papyrus/data-structures/indexing/game";

export type PotentialFunction<TGame extends PapyrusGame> = PapyrusScriptFunctionIndexedAggregate<TGame>| PapyrusScriptFunction<TGame> | PapyrusScriptFunctionIndexed<TGame>;

export interface CKWikiDataFunctionPage extends CKPapyrusWiki {
    /** Whether this function is marked as "latent" by the wiki. Will have the "Latent Functions" category. */
    isMarkedLatent: boolean;

    /** Whether this function is marked as "non-delayed" by the wiki. Will have the "Non-delayed Native Function" category */
    isMarkedNonDelayed: boolean;

    /** Markdown description of this function, as found on the function's dedicated page. */
    descriptionMarkdown: string | null;

    /** Examples from the wiki page designed to demonstrate the usage of this function */
    examplesData: Array<{
        //describingElements: Element[];
        code: string;
    }>

    /** Description of this function's return value */
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

    bugsMarkdown: string;
}

const wikiFunctionDataMemoization = memoizeDevServerConst('wikiFunctionDataMemoization', () => new WeakMap<PotentialFunction<PapyrusGame>, CKWikiDataFunctionPage | null>());

export async function getMediaWikiFunctionData<TGame extends PapyrusGame, TFunc extends PotentialFunction<TGame>>(game: TGame, func: TFunc, scriptName: string): Promise<CKWikiDataFunctionPage | null> {
    const wikiFunctionData = wikiFunctionDataMemoization.get(func);
    if (wikiFunctionData) return wikiFunctionData;

    const wikiFunctionDataNew = await getMediaWikiFunctionDataInternal(game, func, scriptName);
    wikiFunctionDataMemoization.set(func, wikiFunctionDataNew);
    return wikiFunctionDataNew;
}

async function getMediaWikiFunctionDataInternal<TGame extends PapyrusGame, TFunc extends PotentialFunction<TGame>>(game: TGame, func: TFunc, scriptName: string): Promise<CKWikiDataFunctionPage | null> {
    const wiki = getWiki(game);

    const functionName = Array.isArray(func.name) ? getBestStringVariant(func.name)![1] : func.name;
    const pageName = `${functionName} - ${scriptName}`;
    const document = await getWikiPageHTMLDocument(wiki, pageName);
    if (!document) return null;

    // example redirect: <link rel="mw:PageProp/redirect" href="./GetReference_-_ReferenceAlias"
    //                      data-parsoid='{"src":"#REDIRECT ","a":{"href":"./GetReference_-_ReferenceAlias"},"sa":{"href":"GetReference - ReferenceAlias"},"dsr":[0,43,null,null]}' />
    const redirectElement = document.documentElement.querySelector('link[rel="mw:PageProp/redirect"');
    if (redirectElement) {
        const redirectHref = redirectElement.getAttribute('href');
        if (!redirectHref) {
            console.warn(`[MediaWiki Scraping - getWikiDataFunctionPage()] redirect for function page "${pageName}" on wiki "${wiki.wikiName}" (${document.location.href}) has no href attribute!`);
            appendToStepSummarySection(`
### Function Page w/ Invalid Redirect (No href attribute)
- **Wiki**: [${wiki.wikiName}](${wiki.wikiBaseUrl})
- **Wiki Page:** [${pageName}](${document.location.href})
- **Function:** ${scriptName}.${functionName}
`.trim(), StepSummarySection.MediaWikiFormattingWarnings);
            return null;
        }

        const redirectedUrl = new URL(redirectHref, document.location.href);

        const match = redirectedUrl.pathname.match(/^\/wiki\/(?<redirectedFunctionName>\w+)_-_(?<redirectedScriptName>\w+)$/u);
        const {redirectedFunctionName, redirectedScriptName} = match?.groups ?? {};

        if (!redirectedFunctionName || !redirectedScriptName) {
            console.warn(`[MediaWiki Scraping - getWikiDataFunctionPage()] redirect for function page "${pageName}" on wiki "${wiki.wikiName}" (${document.location.href}) redirects to a page that does not fit the expected function page name format!`, {redirectedFunctionName, redirectedScriptName, redirectedUrl, match});
            appendToStepSummarySection(`
### Function Page w/ Invalid Redirect (Invalid Page Name Format)
- **Wiki**: [${wiki.wikiName}](${wiki.wikiBaseUrl})
- **Wiki Page:** [${pageName}](${document.location.href})
- **Redirected To:** [${redirectHref}](${redirectedUrl})
- **Function:** ${scriptName}.${functionName}
- **Redirected Function:** ${redirectedScriptName}.${redirectedFunctionName}
`.trim(), StepSummarySection.MediaWikiFormattingWarnings);
            return null;
        }

        const redirectedFunction = AllScriptsIndexed[game].scripts[toLowerCase(redirectedScriptName)]?.[AllSourcesCombined].functions[toLowerCase(redirectedFunctionName)];
        if (!redirectedFunction) {
            console.warn(`[MediaWiki Scraping - getWikiDataFunctionPage()] redirect for function page "${pageName}" on wiki "${wiki.wikiName}" (${document.location.href}) redirects to a function that does not exist in the index! Redirected URL is ${redirectHref}, and the function should be ${redirectedScriptName}.${redirectedFunctionName}`, {redirectedFunctionName, redirectedScriptName, redirectedUrl, match});
            appendToStepSummarySection(`
### Function Page w/ Invalid Redirect (Function Not Found in Index)
- **Wiki**: [${wiki.wikiName}](${wiki.wikiBaseUrl})
- **Wiki Page:** [${pageName}](${document.location.href})
- **Redirected To:** [${redirectHref}](${redirectedUrl})
- **Function:** ${scriptName}.${functionName}
- **Redirected Function:** ${redirectedScriptName}.${redirectedFunctionName}
`.trim(), StepSummarySection.MediaWikiFormattingWarnings);
            return null;
        }

        return getMediaWikiFunctionData(game, redirectedFunction, redirectedScriptName);
    }

    const pageData = extractLinearWikiPageData(document);

    //console.log(pageData);

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
    let shortDescriptionMarkdown = shortDescriptionElements.length === 0 ? null : await parsoidElementsToMarkdown(shortDescriptionElements, document.location.href);
    if (shortDescriptionMarkdown === null) {
        console.warn(`[MediaWiki Scraping - getWikiDataFunctionPage()] Short description is null for page "${pageName}" on wiki "${wiki.wikiName}" (${document.location.href})!`);
        appendToStepSummarySection(`
### Short Description is Null

- **Wiki**: [${wiki.wikiName}](${wiki.wikiBaseUrl})
- **Wiki Page:** [${pageName}](${document.location.href})
- **Function:** ${scriptName}.${functionName}
`.trim(), StepSummarySection.MediaWikiFormattingWarnings);

    // Counteract "Placeholder Description."
    } else if (shortDescriptionMarkdown.match(/^\s*placeholder description[.!?]?\s*$/iu)) {
        if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') console.warn(`[MediaWiki Scraping - getWikiDataFunctionPage()] Encountered placeholder short description on page "${pageName}" on wiki "${wiki.wikiName}" (${document.location.href})!`);
        appendToStepSummarySection(`
### Encountered placeholder short description

- **Wiki**: [${wiki.wikiName}](${wiki.wikiBaseUrl})
- **Wiki Page:** [${pageName}](${document.location.href})
- **Function:** ${scriptName}.${functionName}
\`\`\`md
${shortDescriptionMarkdown}
\`\`\`
`.trim(), StepSummarySection.MediaWikiFormattingWarnings);
        shortDescriptionMarkdown = null;
    }



    const exampleCodeElements = pageData.sectionsById.examples?.contents.filter(el=>el.getAttribute('typeof') === 'mw:Extension/source') ?? [];
    const examplesData = exampleCodeElements.map(e => ({code: e.textContent || ''}));

    const returnValueDescriptionElements = pageData.sectionsById.return_value?.contents ?? [];
    const returnValueDescriptionMarkdown = await parsoidElementsToMarkdown(returnValueDescriptionElements, document.location.href);

    const notesElements = pageData.sectionsById.notes?.contents ?? [];
    const notesMarkdown = await parsoidElementsToMarkdown(notesElements, document.location.href);

    const bugsElements = pageData.sectionsById.bugs?.contents ?? [];
    const bugsMarkdown = await parsoidElementsToMarkdown(bugsElements, document.location.href);

    const parametersListElements = pageData.sectionsById.parameters?.contents ?? [];
    const parametersListItems = parametersListElements.filter((el): el is HTMLUListElement => el.tagName.toLowerCase() === 'ul').map(ul => Array.from(ul.children).filter((li): li is HTMLLIElement => li.tagName.toLowerCase() === 'li')).flat(1);

    const parameters: CKWikiDataFunctionPage['parameters'] = await Promise.all(parametersListItems.map(async li => {

        // Remove **Default:** lines, since we extract the default value from Papyrus directly.
        Array.from(li.querySelectorAll('li:has(> b:first-child)')).filter(nestedLi => nestedLi.firstElementChild!.textContent?.toLowerCase() === 'default:').forEach(nestedLi => nestedLi.remove());

        const asMarkdown = await parsoidToMarkdown(li.innerHTML, document.location.href);
        const [nameMarkdown, ...descriptionMarkdownA] = asMarkdown.split(':').map(s => s.trim());
        const descriptionMarkdown = descriptionMarkdownA.join(':');
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

${game !== wiki.wikiTrueGame ? `***⛔️ CAUTION: The wiki page is for ${wiki.wikiTrueGame}, but the function is for ${game}!***` : ''}
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
`.trim(), StepSummarySection.MediaWikiFormattingWarnings, `invalid-param-name-${game}-${scriptName}-${functionName}-${name}`);
            return null;
        }
        name = !Array.isArray(param) ? param.name : getBestString(param.map(p => p.name))[1];
        return {name, nameMarkdown, descriptionMarkdown};
    })).then(a => a.filter((obj): obj is NonNullable<typeof obj> => obj !== null));

    const seeAlsoElements = pageData.sectionsById.see_also?.contents ?? [];
    const seeAlsoMarkdown = await parsoidElementsToMarkdown(seeAlsoElements, document.location.href);

    return {
        ...wiki,
        isMarkedLatent,
        isMarkedNonDelayed,
        returnValueDescriptionMarkdown,
        descriptionMarkdown: shortDescriptionMarkdown,
        examplesData,
        notesMarkdown,
        parameters,
        seeAlsoMarkdown,
        bugsMarkdown,
        wikiPageUrl: document.location.href,
    };
}
