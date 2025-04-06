import React, { Fragment, use } from "react";
import type { PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { getBestNameVariant } from "../../../../../utils/getBestName";
import { stripMD } from "../../../../../utils/stripMD";
import type { SearchEntityFunction } from "../../../../search/Entity";
import { GuardEmptyList } from "../../../GuardEmptyList";
import { TextWithTooltip } from "../../../text-with-tooltip/TooltipText";
import { WikiMarkdown } from "../../../wiki-markdown/WikiMarkdown";
import { getWikiFunctionShortDescriptionMD } from "./getWikiFunctionDescription";
import { onlyUseIfUsable } from "../../../../hooks/onlyUseIfPromise";

function getBestStringFromMaybeArray<T extends string>(arr: T|null|([Lowercase<string>[], T|null][])): T|null {
    if (!Array.isArray(arr)) return arr;
    const noNulls = arr.filter(v => v[1] !== null) as [Lowercase<string>[], T][];
    if (noNulls.length === 0) return null;
    return getBestNameVariant(noNulls)![1];
}

/**
 * Returns the most raw form of the documentation strings for a function.
 *
 * Ideal for use in search indexing and SEO.
 */
export async function FunctionDocumentationStringRaw<TGame extends PapyrusGame>({game, func, scriptName}: {readonly game: TGame, readonly func: (SearchEntityFunction<TGame>|PapyrusScriptFunctionIndexedAggregate<TGame>|PapyrusScriptFunctionIndexed<TGame>) & {ckWikiDescription?: string|null|undefined}, readonly scriptName: string}): Promise<string> {
    let str = '';

    const wikiShortDescriptionMD = await getWikiFunctionShortDescriptionMD(game, func, scriptName);
    if (wikiShortDescriptionMD !== null) str += /*(str === '' ? '' : '\n\n') +*/ stripMD(wikiShortDescriptionMD);

    const documentationString = getBestStringFromMaybeArray(func.documentationString);
    if (documentationString !== null) str += (str === '' ? '' : '\n\n') + stripMD(documentationString);

    const documentationComment = getBestStringFromMaybeArray(func.documentationComment);
    if (documentationComment !== null) str += (str === '' ? '' : '\n\n') + stripMD(documentationComment);

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
    const wikiShortDescriptionMD = onlyUseIfUsable(getWikiFunctionShortDescriptionMD(game, func, scriptName));
    if (wikiShortDescriptionMD !== null)
        return <WikiMarkdown gameData={func.game} md={wikiShortDescriptionMD} inTooltip={inTooltip} />;

    const documentationString = getBestStringFromMaybeArray(func.documentationString);
    const documentationComment = getBestStringFromMaybeArray(func.documentationComment);
    if (documentationString === null && documentationComment === null)
        return null;

    if (documentationString !== null && documentationComment !== null) {
        if (documentationString.match(/^\s*Requirements:.*$/iu)) // don't prefer the documentation string if it looks like it's just a requirements list
            return <WikiMarkdown gameData={func.game} md={documentationComment} inTooltip={inTooltip} />;
        else
            return <WikiMarkdown gameData={func.game} md={documentationString} inTooltip={inTooltip} />;
    }

    if (documentationString !== null)
        return <WikiMarkdown gameData={func.game} md={documentationString} inTooltip={inTooltip} />;

    if (documentationComment !== null)
        return <WikiMarkdown gameData={func.game} md={documentationComment} inTooltip={inTooltip} />;

    return null;
}

/**
 * A component that displays all forms of a function's documentation strings
 * in an intuitive manner.
 */
export function FunctionDocumentationStringAll<TGame extends PapyrusGame>({game, func, scriptName, inTooltip}: {readonly game: TGame, readonly func: PapyrusScriptFunctionIndexed<TGame> & {ckWikiDescription?: string|null|undefined}, readonly scriptName: string, readonly inTooltip?: boolean|undefined}): null|React.ReactElement {
    const elements = [];

    if (func.documentationString !== null) {
        elements.push(<Fragment key='docString'>
            <h3><TextWithTooltip tooltipContents={<DocumentationStringTooltipContents />}>
                Documentation String
            </TextWithTooltip></h3>
            <WikiMarkdown gameData={func.game} md={func.documentationString} inTooltip={inTooltip} />
        </Fragment>);
    }

    if (func.documentationComment !== null) {
        elements.push(<Fragment key='docComment'>
            <h3>
                <TextWithTooltip tooltipContents={<DocumentationCommentTooltipContents />}>
                    Documentation Comment
                </TextWithTooltip>
            </h3>
            <WikiMarkdown gameData={func.game} md={func.documentationComment} inTooltip={inTooltip} />
        </Fragment>);
    }

    const wikiShortDescriptionMD = onlyUseIfUsable(getWikiFunctionShortDescriptionMD(game, func, scriptName));
    if (wikiShortDescriptionMD !== null) {
        elements.push(<Fragment key='wiki'>
            <h3>Wiki Description</h3>
            <WikiMarkdown gameData={func.game} md={wikiShortDescriptionMD} inTooltip={inTooltip} />
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
