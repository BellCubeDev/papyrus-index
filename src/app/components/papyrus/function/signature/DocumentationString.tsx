import type { PapyrusScriptFunctionIndexed } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { AllScriptsIndexed } from "../../../../../papyrus/indexing/index-all";
import { stripMD } from "../../../../../utils/stripMD";
import { getWikiDataFunctionPage } from "../../../../../wikimedia/GetWikiDataFunctionPage";
import { GuardEmptyList } from "../../../GuardEmptyList";
import { TextWithTooltip } from "../../../text-with-tooltip/TooltipText";
import { WikiMarkdown } from "../../../wiki-markdown/WikiMarkdown";
import React from "react";

/**
 * Returns the most raw form of the documentation strings for a function.
 *
 * Ideal for use in search indexing and SEO.
 */
export async function FunctionDocumentationStringRaw<TGame extends PapyrusGame>({game, func, scriptName}: {readonly game: TGame, readonly func: PapyrusScriptFunctionIndexed<TGame>, readonly scriptName: string}): Promise<string> {
    let str = '';

    const wikiData = await getWikiDataFunctionPage(game, func, scriptName);
    if (wikiData !== null) str += /*(str === '' ? '' : '\n\n') +*/ stripMD(wikiData.shortDescriptionMarkdown);

    if (func.documentationString !== null) str += (str === '' ? '' : '\n\n') + stripMD(func.documentationString);

    if (func.documentationComment !== null) str += (str === '' ? '' : '\n\n') + stripMD(func.documentationComment);

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
export async function FunctionDocumentationStringBest<TGame extends PapyrusGame>({game, func, scriptName, inTooltip}: {readonly game: TGame, readonly func: PapyrusScriptFunctionIndexed<TGame>, readonly scriptName: string, readonly inTooltip?: boolean}): Promise<null|JSX.Element> {
    const wikiData = await getWikiDataFunctionPage(game, func, scriptName);
    if (wikiData !== null)
        return <WikiMarkdown gameData={AllScriptsIndexed[game]} md={wikiData.shortDescriptionMarkdown} inTooltip={inTooltip} />;

    if (func.documentationString === null && func.documentationComment === null)
        return null;

    if (func.documentationString !== null && func.documentationComment !== null) {
        if (func.documentationString.match(/^\s*Requirements:.*$/iu)) // don't prefer the documentation string if it looks like it's just a requirements list
            return <WikiMarkdown gameData={AllScriptsIndexed[game]} md={func.documentationComment} inTooltip={inTooltip} />;
        else
            return <WikiMarkdown gameData={AllScriptsIndexed[game]} md={func.documentationString} inTooltip={inTooltip} />;
    }

    if (func.documentationString !== null)
        return <WikiMarkdown gameData={AllScriptsIndexed[game]} md={func.documentationString} inTooltip={inTooltip} />;

    if (func.documentationComment !== null)
        return <WikiMarkdown gameData={AllScriptsIndexed[game]} md={func.documentationComment} inTooltip={inTooltip} />;

    return null;
}

/**
 * A component that displays all forms of a function's documentation strings
 * in an intuitive manner.
 */
export async function FunctionDocumentationStringAll<TGame extends PapyrusGame>({game, func, scriptName, inTooltip}: {readonly game: TGame, readonly func: PapyrusScriptFunctionIndexed<TGame>, readonly scriptName: string, readonly inTooltip?: boolean}): Promise<null|JSX.Element> {
    const elements = [];

    if (func.documentationString !== null) {
        elements.push(<>
            <h3><TextWithTooltip tooltipContents={<DocumentationStringTooltipContents />}>
                Documentation String
            </TextWithTooltip></h3>
            <WikiMarkdown gameData={AllScriptsIndexed[game]} md={func.documentationString} inTooltip={inTooltip} />
        </>);
    }

    if (func.documentationComment !== null) {
        elements.push(<>
            <h3>
                <TextWithTooltip tooltipContents={<DocumentationCommentTooltipContents />}>
                    Documentation Comment
                </TextWithTooltip>
            </h3>
            <WikiMarkdown gameData={AllScriptsIndexed[game]} md={func.documentationComment} inTooltip={inTooltip} />
        </>);
    }

    const wikiData = await getWikiDataFunctionPage(game, func, scriptName);
    if (wikiData !== null) {
        elements.push(<>
            <h3>Wiki Description</h3>
            <WikiMarkdown gameData={AllScriptsIndexed[game]} md={wikiData.shortDescriptionMarkdown} inTooltip={inTooltip} />
        </>);
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
