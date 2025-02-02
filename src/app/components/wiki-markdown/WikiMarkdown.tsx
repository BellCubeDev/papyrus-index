import Markdown, { type ExtraProps } from "react-markdown";
import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { AllSourcesCombined, PapyrusGameDataIndexed } from "../../../papyrus/data-structures/indexing/game";
import { toLowerCase } from "../../../utils/toLowerCase";
import type { ComponentProps } from "react";
import { PapyrusScriptReference } from "../papyrus/script/PapyrusScriptReference";
import { PapyrusScriptFunctionReference } from "../papyrus/function/reference/PapyrusScriptFunctionReference";

function WikiMarkdownLink(gameData: PapyrusGameDataIndexed<PapyrusGame>, inTooltip: boolean|undefined, {href, children}: ComponentProps<'a'> & ExtraProps): React.ReactElement {
    if (!href) return <>{children}</>;
    const wikiPageMatch = href.match(/\/wiki\/(?<page>[^?#/]+)/ui);
    if (!wikiPageMatch) return <a href={href}>{children}</a>;

    const pageName = wikiPageMatch.groups?.page;
    if (!pageName) return <a href={href}>{children}</a>;;

    const standaloneScriptName = pageName.match(/(?<scriptName>.+)_script/ui)?.groups?.scriptName;
    if (standaloneScriptName) {
        const script = gameData.scripts[toLowerCase(standaloneScriptName)];
        if (!script) return <a href={href}>{children}</a>;;

        return <PapyrusScriptReference
            game={gameData.game}
            possibleScripts={script} missingName={standaloneScriptName}
            inTooltip={inTooltip}
        />;
    }

    const [functOrEvent, functOrEventScriptName, ...remainder] = pageName.split('_-_') as [string, ...string[]];
    if (remainder.length) return <a href={href}>{children}</a>;;
    if (!functOrEventScriptName) return <a href={href}>{children}</a>;;

    const script = gameData.scripts[toLowerCase(functOrEventScriptName)];
    if (!script) return <a href={href}>{children}</a>;

    const asFunction = script[AllSourcesCombined].functions[toLowerCase(functOrEvent)];
    if (asFunction) {
        return <PapyrusScriptFunctionReference
            game={gameData.game}
            possibleScripts={script}
            possibleFunctions={asFunction} missingName={functOrEventScriptName}
            inTooltip={inTooltip}
        />;
    }

    const asEvent = script[AllSourcesCombined].events[toLowerCase(functOrEvent)];
    if (asEvent) //return <EventReference game={gameData.game} scriptName={functOrEventScriptName} possibleEvents={asEvent} />;
        console.warn('<EventReference> component not implemented, but we needed it for a WikiMarkdownLink.');

    console.warn(`Wiki page ${pageName} is not a function or event, but looks like a member of a script.`);
    return <a href={href}>{children}</a>;
}

export function WikiMarkdown({md, gameData, inTooltip}: {readonly md: string, readonly gameData: PapyrusGameDataIndexed<PapyrusGame>, readonly inTooltip?: boolean}): React.ReactElement {
    return <Markdown skipHtml components={{a: WikiMarkdownLink.bind(null, gameData, inTooltip)}}>
        {md}
    </Markdown>;
}
