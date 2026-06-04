/* eslint-disable complexity */
import type { PapyrusScriptEventOrBaseFunctionIndexed, PapyrusScriptEventOrBaseFunctionIndexedAggregate } from "../../../papyrus/data-structures/indexing/function";
import { AllSourcesCombined } from "../../../papyrus/data-structures/indexing/game";
import type { PapyrusScriptEventOrBaseFunction } from "../../../papyrus/data-structures/pure/function";
import { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { AllScriptsIndexed } from "../../../papyrus/indexing/index-all";
import { getBestString, getBestStringVariant } from "../../../utils/getBestName";
import { memoizeDevServerConst } from "../../../utils/memoizeDevServerConst";
import { appendToStepSummarySection, StepSummarySection } from "../../../utils/stepSummary/index";
import { toLowerCase } from "../../../utils/toLowerCase";
import { getWikiPageHTMLDocument } from "../fetching/GetWikiPageHTML";
import { getWiki, type PapyrusWiki as CKPapyrusWiki } from "../getWiki";
import { parsoidElementsToMarkdown, parsoidToMarkdown } from "./parsoidToMarkdown";
import { extractLinearWikiPageData } from "./parsoidToPageData";

export type PotentialEvent<TGame extends PapyrusGame> = PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>| PapyrusScriptEventOrBaseFunction<TGame> | PapyrusScriptEventOrBaseFunctionIndexed<TGame>;

export interface CKWikiDataEventPage extends CKPapyrusWiki {
    /** Markdown description of this event, as found on the event's dedicated page. */
    descriptionMarkdown: string | null;

    /** Examples from the wiki page designed to demonstrate the usage of this event */
    examplesData: Array<{
        //describingElements: Element[];
        code: string;
    }>

    /** Notes (typically in the form of bullet points) provided by the wiki. */
    notesMarkdown: string;

    /** Data for each of this event's parameters */
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

    /** A link to the wiki page for this event */
    wikiPageUrl: string;

    bugsMarkdown: string;
}

const wikiEventDataMemoization = memoizeDevServerConst('wikiEventDataMemoization', () => new WeakMap<PotentialEvent<PapyrusGame>, CKWikiDataEventPage | null>());

export async function getMediaWikiEventData<TGame extends PapyrusGame, TEvt extends PotentialEvent<TGame>>(game: TGame, evt: TEvt, scriptName: string): Promise<CKWikiDataEventPage | null> {
    const wikiEventData = wikiEventDataMemoization.get(evt);
    if (wikiEventData) return wikiEventData;

    const wikiEventDataNew = await getMediaWikiEventDataInternal(game, evt, scriptName);
    wikiEventDataMemoization.set(evt, wikiEventDataNew);
    return wikiEventDataNew;
}

async function getMediaWikiEventDataInternal<TGame extends PapyrusGame, TEvt extends PotentialEvent<TGame>>(game: TGame, evt: TEvt, scriptName: string): Promise<CKWikiDataEventPage | null> {
    const wiki = getWiki(game);

    const eventName = Array.isArray(evt.name) ? getBestStringVariant(evt.name)![1] : evt.name;
    const pageName = `${eventName} - ${scriptName}`;
    const document = await getWikiPageHTMLDocument(wiki, pageName);
    if (!document) return null;

    // example redirect: <link rel="mw:PageProp/redirect" href="./GetReference_-_ReferenceAlias"
    //                      data-parsoid='{"src":"#REDIRECT ","a":{"href":"./GetReference_-_ReferenceAlias"},"sa":{"href":"GetReference - ReferenceAlias"},"dsr":[0,43,null,null]}' />
    const redirectElement = document.documentElement.querySelector('link[rel="mw:PageProp/redirect"');
    if (redirectElement) {
        const redirectHref = redirectElement.getAttribute('href');
        if (!redirectHref) {
            console.warn(`[MediaWiki Scraping - getWikiDataEventPage()] redirect for event page "${pageName}" on wiki "${wiki.wikiName}" (${document.location.href}) has no href attribute!`);
            appendToStepSummarySection(`
### Event Page w/ Invalid Redirect (No href attribute)
- **Wiki**: [${wiki.wikiName}](${wiki.wikiBaseUrl})
- **Wiki Page:** [${pageName}](${document.location.href})
- **Event:** ${scriptName}.${eventName}
`.trim(), StepSummarySection.MediaWikiFormattingWarnings);
            return null;
        }

        const redirectedUrl = new URL(redirectHref, document.location.href);

        const match = redirectedUrl.pathname.match(/^\/wiki\/(?<redirectedEventName>\w+)_-_(?<redirectedScriptName>\w+)$/u);
        const {redirectedEventName, redirectedScriptName} = match?.groups ?? {};

        if (!redirectedEventName || !redirectedScriptName) {
            console.warn(`[MediaWiki Scraping - getWikiDataEventPage()] redirect for event page "${pageName}" on wiki "${wiki.wikiName}" (${document.location.href}) redirects to a page that does not fit the expected event page name format!`, {redirectedEventName, redirectedScriptName, redirectedUrl, match});
            appendToStepSummarySection(`
### Event Page w/ Invalid Redirect (Invalid Page Name Format)
- **Wiki**: [${wiki.wikiName}](${wiki.wikiBaseUrl})
- **Wiki Page:** [${pageName}](${document.location.href})
- **Redirected To:** [${redirectHref}](${redirectedUrl})
- **Event:** ${scriptName}.${eventName}
- **Redirected Event:** ${redirectedScriptName}.${redirectedEventName}
`.trim(), StepSummarySection.MediaWikiFormattingWarnings);
            return null;
        }

        const redirectedEvent = AllScriptsIndexed[game].scripts[toLowerCase(redirectedScriptName)]?.[AllSourcesCombined].events[toLowerCase(redirectedEventName)];
        if (!redirectedEvent) {
            console.warn(`[MediaWiki Scraping - getWikiDataEventPage()] redirect for event page "${pageName}" on wiki "${wiki.wikiName}" (${document.location.href}) redirects to a event that does not exist in the index! Redirected URL is ${redirectHref}, and the event should be ${redirectedScriptName}.${redirectedEventName}`, {redirectedEventName, redirectedScriptName, redirectedUrl, match});
            appendToStepSummarySection(`
### Event Page w/ Invalid Redirect (Event Not Found in Index)
- **Wiki**: [${wiki.wikiName}](${wiki.wikiBaseUrl})
- **Wiki Page:** [${pageName}](${document.location.href})
- **Redirected To:** [${redirectHref}](${redirectedUrl})
- **Event:** ${scriptName}.${eventName}
- **Redirected Event:** ${redirectedScriptName}.${redirectedEventName}
`.trim(), StepSummarySection.MediaWikiFormattingWarnings);
            return null;
        }

        return getMediaWikiEventData(game, redirectedEvent, redirectedScriptName);
    }

    const pageData = extractLinearWikiPageData(document);

    //console.log(pageData);

    // TODO: Better support the formatting on display in the Skyrim CK wiki's ColorComponent script,
    //       especially the parameters section. That, or contribute to the wiki and standardize it.
    // e.g. https://ck.uesp.net/wiki/GetAlpha_-_ColorComponent

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
        console.warn(`[MediaWiki Scraping - getWikiDataEventPage()] Short description is null for page "${pageName}" on wiki "${wiki.wikiName}" (${document.location.href})!`);
        appendToStepSummarySection(`
### Short Description is Null

- **Wiki**: [${wiki.wikiName}](${wiki.wikiBaseUrl})
- **Wiki Page:** [${pageName}](${document.location.href})
- **Event:** ${scriptName}.${eventName}
`.trim(), StepSummarySection.MediaWikiFormattingWarnings);

    // Counteract "Placeholder Description."
    } else if (shortDescriptionMarkdown.match(/^\s*placeholder description[.!?]?\s*$/iu)) {
        if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') console.warn(`[MediaWiki Scraping - getWikiDataEventPage()] Encountered placeholder short description on page "${pageName}" on wiki "${wiki.wikiName}" (${document.location.href})!`);
        appendToStepSummarySection(`
### Encountered placeholder short description

- **Wiki**: [${wiki.wikiName}](${wiki.wikiBaseUrl})
- **Wiki Page:** [${pageName}](${document.location.href})
- **Event:** ${scriptName}.${eventName}
\`\`\`md
${shortDescriptionMarkdown}
\`\`\`
`.trim(), StepSummarySection.MediaWikiFormattingWarnings);
        shortDescriptionMarkdown = null;
    }



    const exampleCodeElements = (pageData.sectionsById.examples ?? pageData.sectionsById.example)?.contents.filter(el=>el.getAttribute('typeof') === 'mw:Extension/source') ?? [];
    const examplesData = exampleCodeElements.map(e => ({code: e.textContent || ''}));

    const notesElements = pageData.sectionsById.notes?.contents ?? [];
    const notesMarkdown = await parsoidElementsToMarkdown(notesElements, document.location.href);

    const bugsElements = pageData.sectionsById.bugs?.contents ?? [];
    const bugsMarkdown = await parsoidElementsToMarkdown(bugsElements, document.location.href);

    const parametersListElements = pageData.sectionsById.parameters?.contents ?? [];
    const parametersListItems = parametersListElements.filter((el): el is HTMLUListElement => el.tagName.toLowerCase() === 'ul').map(ul => Array.from(ul.children).filter((li): li is HTMLLIElement => li.tagName.toLowerCase() === 'li')).flat(1);

    const parameters: CKWikiDataEventPage['parameters'] = await Promise.all(parametersListItems.map(async li => {

        // Remove **Default:** lines, since we extract the default value from Papyrus directly.
        Array.from(li.querySelectorAll('li:has(> b:first-child)')).filter(nestedLi => nestedLi.firstElementChild!.textContent?.toLowerCase() === 'default:').forEach(nestedLi => nestedLi.remove());

        const asMarkdown = await parsoidToMarkdown(li.innerHTML, document.location.href);
        const [nameMarkdown, ...descriptionMarkdownA] = asMarkdown.split(':').map(s => s.trim());
        const descriptionMarkdown = descriptionMarkdownA.join(':');
        if (!descriptionMarkdown) return null;
        if (!nameMarkdown) {
            console.warn(`[MediaWiki Scraping - getWikiDataEventPage()] Failed to parse parameter name from string "${asMarkdown}"! Skipping...`);
            return null;
        }
        let name = nameMarkdown.match(/\b[a-z0-9_]+\b/iu)?.[0] || '';
        const lowercaseName = toLowerCase(name);
        const lowercaseNameNoPrefix = toLowerCase(name.replace(/^a[a-z](?=[A-Z0-9])/u, ''));
        const param = evt.parameters.find(candidate => {
            if (toLowerCase(candidate.name) === lowercaseName) return true;
            if (toLowerCase(candidate.name.replace(/^a[a-z](?=[A-Z])/u, '')) === lowercaseNameNoPrefix) return true;
            return false;
        });
        if (!param) {
            const editSummary = `Correct Parameter Name (${name} --> CORRECT_NAME_HERE)`;
            if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') {
                console.warn(`
⚠️  [96m[MediaWiki Scraping - getWikiDataEventPage()] Invalid Parameter Detected![0m
[93m|[0m Parameter ${name} not found in event [32m${scriptName}[0m.[33m${eventName}[0m()!
[93m|[0m Wiki: ${wiki.wikiName} (for ${wiki.wikiTrueGame})
[93m|[0m
${wiki.wikiTrueGame !== game ? `[93m|[0m [101mCAUTION: The wiki page is for ${wiki.wikiTrueGame}, but the event is for ${game}![0m
` : ''}[93m|[0m Invalid parameter name: ${name}
[93m|[0m Valid parameter names are: ${evt.parameters.map(p => p.name).join(' | ')}
[93m|[0m
[93m|[0m Edit Link: [34m${document.location.href}?action=edit&summary=${encodeURIComponent(editSummary)}[0m
[93m|[0m Edit Message: [35m${editSummary}[0m
[93m|[0m
[93m|[0m Skipping...`);
            }
            appendToStepSummarySection(`
### Invalid Event Parameter Name

${game !== wiki.wikiTrueGame ? `***⛔️ CAUTION: The wiki page is for ${wiki.wikiTrueGame}, but the event is for ${game}!***` : ''}
- **Wiki**: [${wiki.wikiName}](${wiki.wikiBaseUrl}) (for ${wiki.wikiTrueGame})
- **Wiki Page:** [${pageName}](${document.location.href})
- **Event:** ${scriptName}.${eventName}
- **INVALID Parameter Name:** \`${name}\`
${
    '$sources' in evt
        ? Object.entries(evt.$sources).map(([source, variant]) => `- **Valid Parameter Names (from ${source}):** ${variant.parameters.map(p => `\`${p.name}\``).join(' | ')}`).join('\n')
        : `- **Valid Parameter Names:** ${evt.parameters.map(p => `\`${p.name}\``).join(' | ')}`
}
- **Edit Link:** [${document.location.href}?action=edit&summary=${encodeURIComponent(editSummary)}](${document.location.href}?action=edit&summary=${encodeURIComponent(editSummary)})
- **Edit Message:** ${editSummary}
`.trim(), StepSummarySection.MediaWikiFormattingWarnings, `invalid-param-name-${game}-${scriptName}-${eventName}-${name}`);
            return null;
        }
        name = !Array.isArray(param) ? param.name : getBestString(param.map(p => p.name))[1];
        return {name, nameMarkdown, descriptionMarkdown};
    })).then(a => a.filter((obj): obj is NonNullable<typeof obj> => obj !== null));

    const seeAlsoElements = pageData.sectionsById.see_also?.contents ?? [];
    const seeAlsoMarkdown = await parsoidElementsToMarkdown(seeAlsoElements, document.location.href);

    return {
        ...wiki,
        descriptionMarkdown: shortDescriptionMarkdown,
        examplesData,
        notesMarkdown,
        parameters,
        seeAlsoMarkdown,
        bugsMarkdown,
        wikiPageUrl: document.location.href,
    };
}
