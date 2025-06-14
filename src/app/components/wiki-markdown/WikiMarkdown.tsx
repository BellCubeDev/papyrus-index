import Markdown, { type ExtraProps } from "react-markdown";
import remarkBreaks from "remark-breaks";
import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { AllSourcesCombined, PapyrusGameDataIndexed } from "../../../papyrus/data-structures/indexing/game";
import { toLowerCase } from "../../../utils/toLowerCase";
import type { ComponentProps } from "react";
import { PapyrusScriptReference } from "../papyrus/script/PapyrusScriptReference";
import { PapyrusScriptFunctionReference } from "../papyrus/function/reference/PapyrusScriptFunctionReference";
import { appendToStepSummarySection, StepSummarySection } from "../../../utils/stepSummary";
import { memoizeDevServerConst } from "../../../utils/memoizeDevServerConst";
import remarkGFM from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {defaultSchema, default as rehypeSanitize, type Options} from 'rehype-sanitize';
import styles from './WikiMarkdown.module.scss';

export const AUTOMATIC_BASE_URL: unique symbol = memoizeDevServerConst('AUTOMATIC_BASE_URL', () => Symbol.for('PAPYRUS_INDEX_AUTOMATIC_BASE_URL')) as any;

// eslint-disable-next-line complexity
function WikiMarkdownLink(gameData: PapyrusGameDataIndexed<PapyrusGame>, inTooltip: boolean|undefined, baseUrl: typeof AUTOMATIC_BASE_URL | URL | string | null, {href: rawHref, children}: ComponentProps<'a'> & ExtraProps): React.ReactElement {
    if (!rawHref) return <>{children}</>;
    if (!baseUrl) throw new Error(`WikiMarkdownLink: No base URL provided for link: ${rawHref}`);
    const resolvedBaseUrl =
        baseUrl !== AUTOMATIC_BASE_URL
            ? baseUrl
            : (typeof window === 'undefined' ? 'https://papyrus.bellcube.dev' : window.location.href);
            
    let url = new URL(rawHref, resolvedBaseUrl);

    if (url.host === 'www.creationkit.com') {
        // http://www.creationkit.com/GetType_-_Form --> https://ck.uesp.net/wiki/GetType_-_Form
        // https://www.creationkit.com/index.php?title=GetType_-_Form --> https://ck.uesp.net/wiki/GetType_-_Form
        const pageTitle = url.searchParams.get('title') || decodeURI(url.pathname.replace(/^\/(?:fallout4\/)?/u, ''));

        // SKYRIM: https://www.creationkit.com/index.php?title=Main_Page --> https://ck.uesp.net/wiki/Main_Page
        // FALLOUT 4: https://www.creationkit.com/fallout4/index.php?title=Main_Page --> https://falloutck.uesp.net/wiki/Main_Page

        if (url.pathname.includes('/fallout4/')) url = new URL(`https://falloutck.uesp.net/wiki/${encodeURI(pageTitle)}`);
        else url = new URL(`https://ck.uesp.net/wiki/${encodeURI(pageTitle)}`);

        if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') console.warn(`WikiMarkdownLink: Redirected Creation Kit wiki link to UESP: ${rawHref} -> ${url.href}`);
    }

    const wikiPageMatch = url.href.match(/\/wiki\/(?<page>[^?#/]+)/ui);
    if (!wikiPageMatch) return <a href={url.href}>{children}</a>;

    const pageName = wikiPageMatch.groups?.page;
    if (!pageName) return <a href={url.href}>{children}</a>;;

    const standaloneScriptName = pageName.match(/(?<scriptName>.+)_script/ui)?.groups?.scriptName;
    if (standaloneScriptName) {
        const script = gameData.scripts[toLowerCase(standaloneScriptName)];
        if (!script) return <a href={url.href}>{children}</a>;;

        return <PapyrusScriptReference
            game={gameData.game}
            possibleScripts={script} missingName={standaloneScriptName}
            inTooltip={inTooltip}
        />;
    }

    const [functOrEvent, functOrEventScriptName, ...remainder] = pageName.split('_-_') as [string, ...string[]];
    if (remainder.length) return <a href={url.href}>{children}</a>;;
    if (!functOrEventScriptName) return <a href={url.href}>{children}</a>;;

    const script = gameData.scripts[toLowerCase(functOrEventScriptName)];
    if (!script) return <a href={url.href}>{children}</a>;

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
    if (asEvent) {//return <EventReference game={gameData.game} scriptName={functOrEventScriptName} eventAggregate={asEvent} />;
        if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') console.warn('<EventReference> component not implemented, but we needed it for a WikiMarkdownLink.');
        appendToStepSummarySection(`\`<EventReference>\` component not implemented, but we needed it for a WikiMarkdownLink.`, StepSummarySection.UnimplementedFeatures);
        return <a href={url.href}>{children}</a>;
    }

    const structName = functOrEvent.match(/(?<structName>.+)_struct/ui)?.groups?.structName;
    const asStruct = structName && script[AllSourcesCombined].structs?.[toLowerCase(structName)];
    if (asStruct) {
        //return <StructReference game={gameData.game} scriptName={functOrEventScriptName} structAggregate={asEvent} />;
        if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') console.warn('<StructReference> component not implemented, but we needed it for a WikiMarkdownLink.');
        appendToStepSummarySection(`\`<StructReference>\` component not implemented, but we needed it for a WikiMarkdownLink.`, StepSummarySection.UnimplementedFeatures);
        return <a href={url.href}>{children}</a>;
    }

    if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') console.warn(`Wiki page ${pageName} is not a function, struct, or event documented for ${gameData.game} in the Papyrus Index, but this link target looks like a member of a script.`);
    appendToStepSummarySection(`Wiki page ${pageName} is not a function, struct, or event documented for ${gameData.game} in the Papyrus Index, but this link target looks like a member of a script.`, StepSummarySection.MediaWikiFormattingWarnings);

    return <a href={url.href}>{children}</a>;
}

export function WikiMarkdown({md, gameData, baseURL, inTooltip, ...dataAttributes}: {readonly md: string, readonly gameData: PapyrusGameDataIndexed<PapyrusGame>, readonly inTooltip?: boolean | undefined, readonly baseURL: typeof AUTOMATIC_BASE_URL | URL | string | null} & Record<`data-${string}`, string|boolean>): React.ReactElement {
    return <div {...dataAttributes} className={styles.md} data-is-md=''><Markdown
        unwrapDisallowed
        skipHtml={false}
        remarkPlugins={[
            remarkBreaks,
            remarkGFM,
        ]}
        components={{
            a: WikiMarkdownLink.bind(null, gameData, inTooltip, baseURL)
        }}
        remarkRehypeOptions={{
            clobberPrefix: 'md-',
            allowDangerousHtml: true,
        }}
        rehypePlugins={[
            rehypeRaw,
            rehypeSanitize.bind(null, {
                clobberPrefix: 'md-html-',
                ancestors: {
                    ...defaultSchema.ancestors ?? {},
                    summary: ['details'],
                }
            } satisfies Options)
        ]}
    >
        {md}
    </Markdown></div>;
}
