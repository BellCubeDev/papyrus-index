import React, { Fragment } from "react";
import type { PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { getBestString, getBestStringVariant } from "../../../../../utils/getBestName";
import { stripMD } from "../../../../../utils/stripMD";
import type { SearchEntityFunction } from "../../../../search/Entity";
import { GuardEmptyList } from "../../../GuardEmptyList";
import { TextWithTooltip } from "../../../text-with-tooltip/TooltipText";
import { AUTOMATIC_BASE_URL, WikiMarkdown } from "../../../wiki-markdown/WikiMarkdown";
import { getCKWikiFunctionShortDescriptionMD } from "./getCKWikiFunctionDescription";
import { onlyUseIfUsable } from "../../../../hooks/onlyUseIfPromise";
import { getGitHubWikiFunctionData } from "./getGitHubWikiFunctionDescription";
import { SourceName } from "../../SourceName";

function getBestStringFromMaybeArray<T extends string>(arr: T|null|([Lowercase<string>[], T|null][])): T|null {
    if (!Array.isArray(arr)) return arr;
    const noNulls = arr.filter(v => v[1] !== null) as [Lowercase<string>[], T][];
    if (noNulls.length === 0) return null;
    return getBestStringVariant(noNulls)![1];
}

/**
 * Returns the most raw form of the documentation strings for a function.
 *
 * Ideal for use in search indexing and SEO.
 */
export async function FunctionDocumentationStringRaw<TGame extends PapyrusGame>({game, func, scriptName}: {readonly game: TGame, readonly func: (SearchEntityFunction<TGame>|PapyrusScriptFunctionIndexedAggregate<TGame>|PapyrusScriptFunctionIndexed<TGame>) & {ckWikiDescription?: string|null|undefined}, readonly scriptName: string}): Promise<string> {
    let str = '';

    const ckWikiData = await getCKWikiFunctionShortDescriptionMD(game, func, scriptName);
    if (ckWikiData?.descriptionMarkdown) str += /*(str === '' ? '' : '\n\n') +*/ stripMD(ckWikiData.descriptionMarkdown);

    const githubWikiData = await getGitHubWikiFunctionData(func);
    const bestGitHubWikiMD = getBestString(githubWikiData.map(v => v[1].descriptionMD).filter(v => v !== null));
    if (bestGitHubWikiMD) str += (str === '' ? '' : '\n\n') + stripMD(bestGitHubWikiMD);

    const documentationString = getBestStringFromMaybeArray(func.documentationString);
    if (documentationString) str += (str === '' ? '' : '\n\n') + stripMD(documentationString);

    const documentationComment = getBestStringFromMaybeArray(func.documentationComment);
    if (documentationComment) str += (str === '' ? '' : '\n\n') + stripMD(documentationComment);

    // TODO: dedupe
    // Example offender (via SEO description):
    // https://self.bellcube.dev/skyrimse/script/game/function/findrandomactorfromref/
    //
    // It doesn't offend in rendered Markdown because it renders the script names, but the wording is identical.
    // It'd be best not to duplicate the same information in the description we hand to Google.

    return str;
}

/**
 * A component that displays the "best" form of a function's documentation strings.
 *
 * If the function has wiki data, use their description.
 * Otherwise, use some form of heuristics to determine which of the in-script documentation strings/comments to use.
 */
export function FunctionDocumentationStringBest<TGame extends PapyrusGame>({game, func, scriptName, inTooltip}: {readonly game: TGame, readonly func: PapyrusScriptFunctionIndexedAggregate<TGame>|PapyrusScriptFunctionIndexed<TGame>, readonly scriptName: string, readonly inTooltip?: boolean|undefined}): null|React.ReactElement {
    const ckWikiData = onlyUseIfUsable(getCKWikiFunctionShortDescriptionMD(game, func, scriptName));
    if (ckWikiData?.descriptionMarkdown)
        return <WikiMarkdown gameData={func.game} md={ckWikiData.descriptionMarkdown} inTooltip={inTooltip} baseURL={ckWikiData.wikiPageUrl} />;

    const githubWikiData = onlyUseIfUsable(getGitHubWikiFunctionData(func));
    const githubWikisWithDescriptions = githubWikiData.filter(v => v[1].descriptionMD !== null);
    const bestVariant = getBestStringVariant(githubWikisWithDescriptions.map(v => [[v[0]], v[1].descriptionMD!]));
    if (githubWikisWithDescriptions.length > 0)
        return <WikiMarkdown gameData={func.game} md={getBestString(githubWikiData.map(v=>v[1].descriptionMD!))!} inTooltip={inTooltip} baseURL={githubWikisWithDescriptions.find(v => v[0] === bestVariant![0][0])![1].linkToWikiData} />;

    const documentationString = getBestStringFromMaybeArray(func.documentationString);
    const documentationComment = getBestStringFromMaybeArray(func.documentationComment);
    if (documentationString === null && documentationComment === null)
        return null;

    if (documentationString !== null && documentationComment !== null) {
        if (documentationString.match(/^\s*Requirements:.*$/iu)) // don't prefer the documentation string if it looks like it's just a requirements list
            return <WikiMarkdown gameData={func.game} md={documentationComment} inTooltip={inTooltip} baseURL={AUTOMATIC_BASE_URL} />;
        else
            return <WikiMarkdown gameData={func.game} md={documentationString} inTooltip={inTooltip} baseURL={AUTOMATIC_BASE_URL} />;
    }

    if (documentationString !== null)
        return <WikiMarkdown gameData={func.game} md={documentationString} inTooltip={inTooltip} baseURL={AUTOMATIC_BASE_URL} />;

    if (documentationComment !== null)
        return <WikiMarkdown gameData={func.game} md={documentationComment} inTooltip={inTooltip} baseURL={AUTOMATIC_BASE_URL} />;

    return null;
}

/**
 * A component that displays all forms of a function's documentation strings
 * in an intuitive manner.
 */
export function FunctionDocumentationStringAll<TGame extends PapyrusGame>({game, func, scriptName, inTooltip}: {readonly game: TGame, readonly func: PapyrusScriptFunctionIndexed<TGame>, readonly scriptName: string, readonly inTooltip?: boolean|undefined}): null|React.ReactElement {
    const elements = [];

    const ckWikiData = onlyUseIfUsable(getCKWikiFunctionShortDescriptionMD(game, func, scriptName));
    if (ckWikiData?.descriptionMarkdown) {
        elements.push(<Fragment key='wiki'>
            <h3>Wiki Description</h3>
            <WikiMarkdown data-analytics-id="docs-description-mediawiki"
                gameData={func.game} inTooltip={inTooltip}
                md={ckWikiData.descriptionMarkdown} baseURL={ckWikiData.wikiPageUrl} />
        </Fragment>);
    }

    const githubWikiData = onlyUseIfUsable(getGitHubWikiFunctionData(func));
    const githubWikisWithDescriptions = githubWikiData.filter(v => v[1].descriptionMD !== null);
    elements.push(...githubWikisWithDescriptions.map(([source, data]) =>
        <Fragment key={`githubWiki-${source}`}>
            <h3>GitHub Wiki Description (<SourceName source={func.game.scriptSources[source]!} />)</h3>
            <WikiMarkdown data-analytics-id="docs-description-githubwiki"
                gameData={func.game} inTooltip={inTooltip}
                md={data.descriptionMD!} baseURL={data.linkToWikiData} />
        </Fragment>
    ));

    if (func.documentationString !== null) {
        elements.push(<Fragment key='docString'>
            <h3><TextWithTooltip tooltipContents={<DocumentationStringTooltipContents />}>
                Documentation String
            </TextWithTooltip></h3>
            <WikiMarkdown data-analytics-id="docs-description-string"
                gameData={func.game} inTooltip={inTooltip}
                md={func.documentationString} baseURL={AUTOMATIC_BASE_URL} />
        </Fragment>);
    }

    if (func.documentationComment !== null) {
        elements.push(<Fragment key='docComment'>
            <h3>
                <TextWithTooltip tooltipContents={<DocumentationCommentTooltipContents />}>
                    Documentation Comment
                </TextWithTooltip>
            </h3>
            <WikiMarkdown data-analytics-id="docs-description-comment"
                gameData={func.game} inTooltip={inTooltip}
                md={func.documentationComment} baseURL={AUTOMATIC_BASE_URL} />
        </Fragment>);
    }

    return <GuardEmptyList replacement={null} Wrapper={FunctionDocumentationStringWrapper}>
        {elements}
    </GuardEmptyList>;
}

function FunctionDocumentationStringWrapper({children}: {readonly children: React.ReactNode}) {
    return <>
        <h2>Description</h2>
        {children}
    </>;
} // abcdef

function DocumentationStringTooltipContents() {
    return <>
        <p>
            Documentation strings are the Papyrus compiler&rsquo;s official way to document functions.
            Documentation strings are typically included as text inside the final, compiled PEX binary and are often displayed by the Creation Kit.
        </p>
        <p>
            When written in a Papyrus script, they look like this:
        </p>
        <pre><code>
            <span style={{color: '#c586c0'}}>function</span> <span style={{color: '#dcdcaa'}}>SomeFunction</span>()
            {'\n'}
            <span style={{color: '#6a9955'}}>{'    {This is a documentation string!}'}</span>
            {'\n'}
            <span style={{color: '#667'}}>{'    ...function body'}</span>
            {'\n'}
            <span style={{color: '#c586c0'}}>endFunction</span>
        </code></pre>
    </>;
}

function DocumentationCommentTooltipContents() {
    return <>
        <p>
            Documentation comments are a more informal way to document functions.
            They are comments that appear just before a function declaration. For example:
        </p>
        <pre><code>
            <span style={{color: '#6a9955'}}>; This is a documentation comment!</span>
            {'\n'}
            <span style={{color: '#c586c0'}}>function</span> <span style={{color: '#dcdcaa'}}>SomeFunction</span>()
            {'\n'}
            <span style={{color: '#667'}}>{'    ...function body'}</span>
            {'\n'}
            <span style={{color: '#c586c0'}}>endFunction</span>
        </code></pre>
    </>;
}
