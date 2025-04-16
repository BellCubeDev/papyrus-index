import Markdown, { type ExtraProps } from "react-markdown";
import remarkBreaks from "remark-breaks";
import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { AllSourcesCombined, PapyrusGameDataIndexed } from "../../../papyrus/data-structures/indexing/game";
import { toLowerCase } from "../../../utils/toLowerCase";
import type { ComponentProps } from "react";
import { PapyrusScriptReference } from "../papyrus/script/PapyrusScriptReference";
import { PapyrusScriptFunctionReference } from "../papyrus/function/reference/PapyrusScriptFunctionReference";
import { appendToJobSummarySection, JobSummarySection } from "../../../utils/stepSummary";

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
            funcAggregate={asFunction} missingName={functOrEventScriptName}
            inTooltip={inTooltip}
        />;
    }

    const asEvent = script[AllSourcesCombined].events[toLowerCase(functOrEvent)];
    if (asEvent) {//return <EventReference game={gameData.game} scriptName={functOrEventScriptName} possibleEvents={asEvent} />;
        if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') console.warn('<EventReference> component not implemented, but we needed it for a WikiMarkdownLink.');
        appendToJobSummarySection(`\`<EventReference>\` component not implemented, but we needed it for a WikiMarkdownLink.`, JobSummarySection.UnimplementedFeatures);
    }

    if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') console.warn(`Wiki page ${pageName} is not a function or event, but looks like a member of a script.`);
    appendToJobSummarySection(`Wiki page ${pageName} is not a function or event, but looks like a member of a script.`, JobSummarySection.MediaWikiFormattingWarnings);

    return <a href={href}>{children}</a>;
}

export function WikiMarkdown({md, gameData, inTooltip, ...dataAttributes}: {readonly md: string, readonly gameData: PapyrusGameDataIndexed<PapyrusGame>, readonly inTooltip?: boolean | undefined} & Record<`data-${string}`, string|boolean>): React.ReactElement {
    return <div {...dataAttributes} data-is-md=''><Markdown skipHtml remarkPlugins={[remarkBreaks]} components={{a: WikiMarkdownLink.bind(null, gameData, inTooltip)}}>
        {md}
    </Markdown></div>;
}
