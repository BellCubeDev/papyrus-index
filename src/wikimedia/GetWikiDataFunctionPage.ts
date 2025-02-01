import type { PapyrusScriptFunctionIndexed } from "../papyrus/data-structures/indexing/function";
import type { PapyrusScriptFunction } from "../papyrus/data-structures/pure/function";
import { PapyrusGame } from "../papyrus/data-structures/pure/game";
import { getWiki, type PapyrusWiki } from "./getWiki";
import { getWikiPageHTMLDocument } from "./GetWikiPageHTML";
import { parsoidElementsToMarkdown, parsoidToMarkdown } from "./parsoidToMarkdown";
import { toLowerCase } from "../utils/toLowerCase";

export type PotentialFunction<TGame extends PapyrusGame> = PapyrusScriptFunction<TGame> | PapyrusScriptFunctionIndexed<TGame>;

export interface WikiDataFunctionPage extends PapyrusWiki {
    /** Whether this function is marked as "latent" by the wiki. Will have the "Latent Functions" category. */
    isMarkedLatent: boolean;

    /** Whether this function is marked as "non-delayed" by the wiki. Will have the "Non-delayed Native Function" category */
    isMarkedNonDelayed: boolean;

    /** HTML elements representing the wiki's short description of this element. */
    shortDescriptionMarkdown: string;

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
}

export async function getWikiDataFunctionPage<TGame extends PapyrusGame, TFunc extends PotentialFunction<TGame>>(game: TGame, func: TFunc, scriptName: string): Promise<WikiDataFunctionPage | null> {
    const wiki = getWiki(game);

    const document = await getWikiPageHTMLDocument(wiki, `${func.name} - ${scriptName}`);
    if (!document) return null;

    const categories = Array.from(document.querySelectorAll('link[rel="mw:PageProp/Category"]'))
        .map(e => {
            const attr = e.getAttribute('data-parsoid');
            if (!attr) return null;
            return JSON.parse(attr)?.sa?.href;
        })
        .filter(a => typeof a === 'string');

    const isMarkedLatent = categories.includes('Category:Latent Functions');
    const isMarkedNonDelayed = categories.includes('Category:Non-delayed Native Function');

    const shortDescriptionElements = Array.from(document.querySelectorAll<HTMLElement>('section[data-mw-section-id="0"] > :not(link, p:first-of-type)'));
    const shortDescriptionMarkdown = await parsoidElementsToMarkdown(shortDescriptionElements, document.location.href);

    const exampleCodeElements = Array.from(document.querySelectorAll('section:has(#Examples) pre'));
    const examplesData = exampleCodeElements.map(e => ({code: e.textContent || ''}));

    const returnValueDescriptionElements = Array.from(document.querySelectorAll<HTMLElement>('#Return_Value ~ *'));
    const returnValueDescriptionMarkdown = await parsoidElementsToMarkdown(returnValueDescriptionElements, document.location.href);

    const notesElements = Array.from(document.querySelectorAll<HTMLLIElement>('#Notes ~ *'));
    const notesMarkdown = await parsoidElementsToMarkdown(notesElements, document.location.href);

    const parametersListItems = Array.from(document.querySelectorAll<HTMLLIElement>('#Parameters ~ ul > li'));
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
            console.warn(`[MediaWiki Scraping - getWikiDataFunctionPage()] Parameter ${name} not found in function ${scriptName}.${func.name}!

Invalid parameter name: ${name}
Valid parameter names are: ${func.parameters.map(p => p.name).join(' | ')}

Edit Link: ${document.location.href}?action=edit
Edit Message: Correct Parameter Name (${name} --> CORRECT_NAME_HERE)

Skipping...`);
            return null;
        }
        name = param.name;
        return {name, nameMarkdown, descriptionMarkdown};
    })).then(a => a.filter((obj): obj is NonNullable<typeof obj> => obj !== null));

    const seeAlsoElements = Array.from(document.querySelectorAll<HTMLLIElement>('#See_Also ~ *'));
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
    };
}
