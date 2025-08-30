/* eslint-disable max-depth */
import Markdown, { type ExtraProps } from "react-markdown";
import remarkBreaks from "remark-breaks";
import { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
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
import { ValidPapyrusGames } from "../../../utils/ValidPapyrusGames";
import { getWiki } from "../../../wiki-data-extraction/ck-wiki/getWiki";
import { CodeBlock, CodeBlockLanguage } from "../code-block/CodeBlock";
import { Link } from "../Link";

export const AUTOMATIC_BASE_URL: unique symbol = memoizeDevServerConst('AUTOMATIC_BASE_URL', () => Symbol.for('PAPYRUS_INDEX_AUTOMATIC_BASE_URL')) as never;

function ckWikiMatchesGame(game: PapyrusGame, url: URL): boolean {
    const correctWikidata = getWiki(game);
    const correctWikiHost = new URL(correctWikidata.wikiBaseUrl).host;
    return url.host === correctWikiHost;
}

// eslint-disable-next-line complexity
function WikiMarkdownLink(gameData: PapyrusGameDataIndexed<PapyrusGame>, inTooltip: boolean|undefined, baseUrl: typeof AUTOMATIC_BASE_URL | URL | string | null, {href: rawHref, children}: ComponentProps<'a'> & ExtraProps): React.ReactElement {
    if (!rawHref) return <>{children}</>;

    if (rawHref.startsWith('papyrus-index:')) {
        let url = new URL(toLowerCase(rawHref));
        if (url.protocol  !== 'papyrus-index:') throw new Error(`WikiMarkdownLink: 'papyrus-index:' protocol expected, but got: ${url.protocol}`);
        if (url.pathname[0] !== '/') url = new URL(`papyrus-index:/${url.pathname}`); // Ensure pathname starts with a slash

        const getFallbackComponent = ()=> <Link href={url.pathname as Lowercase<string>}>{children}</Link>;

        const pathnameParts = url.pathname.split('/').filter(Boolean).map((s)=> toLowerCase(decodeURI(s)));

        const [gameLowerCase, pathnameVariable1, ...remainingPathnameParts] = pathnameParts;

        if (!gameLowerCase) throw new Error(`WikiMarkdownLink: 'papyrus-index:' protocol with pathname '${url.pathname}' is missing game name.`);
        const game = ValidPapyrusGames.get(gameLowerCase);
        if (!game) throw new Error(`WikiMarkdownLink: 'papyrus-index:' protocol with pathname '${url.pathname}' references an unsupported game: ${gameLowerCase}. Supported games are: ${Array.from(ValidPapyrusGames.keys()).join(', ')}.`);

        if (game !== gameData.game) return getFallbackComponent();

        switch (pathnameVariable1) {
            case 'source':
                return getFallbackComponent();

            case 'script': {
                const [scriptName, ...remainingScriptPathParts] = remainingPathnameParts;
                if (!scriptName) throw new Error(`WikiMarkdownLink: 'papyrus-index:' protocol with pathname '${url.pathname}' is missing script name.`);
                const script = gameData.scripts[toLowerCase(scriptName)];
                if (!script) {
                    if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') console.warn(`WikiMarkdownLink: 'papyrus-index:' protocol with pathname '${url.pathname}' references a script that does not exist: ${scriptName}.`);
                    appendToStepSummarySection(`\`<WikiMarkdownLink>\` component references a script that does not exist: \`${scriptName}\`.`, StepSummarySection.UnimplementedFeatures);
                    return getFallbackComponent();
                }
                if (remainingScriptPathParts.length === 0) {
                    return <PapyrusScriptReference
                        game={gameData.game}
                        possibleScripts={script} missingName={scriptName}
                        inTooltip={inTooltip}
                    />;
                }

                const [pathnameVariable2, identifier, ..._remainingPathnameParts2] = remainingScriptPathParts;
                switch (pathnameVariable2) {
                    case 'function': {
                        if (!identifier) throw new Error(`WikiMarkdownLink: 'papyrus-index:' protocol with pathname '${url.pathname}' is missing function name.`);
                        const funcAggregate = script[AllSourcesCombined].functions[toLowerCase(identifier)];
                        if (!funcAggregate) {
                            if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') console.warn(`WikiMarkdownLink: 'papyrus-index:' protocol with pathname '${url.pathname}' references a function that does not exist: ${identifier}.`);
                            appendToStepSummarySection(`\`<WikiMarkdownLink>\` component references a function that does not exist: \`${identifier}\`.`, StepSummarySection.UnimplementedFeatures);
                            return getFallbackComponent();
                        }
                        return <PapyrusScriptFunctionReference
                            game={gameData.game}
                            possibleScripts={script}
                            funcAggregate={funcAggregate} missingName={identifier}
                            inTooltip={inTooltip}
                        />;
                    }

                    case 'event': {
                        if (!identifier) throw new Error(`WikiMarkdownLink: 'papyrus-index:' protocol with pathname '${url.pathname}' is missing event name.`);
                        const eventAggregate = script[AllSourcesCombined].events[toLowerCase(identifier)];
                        if (!eventAggregate) {
                            if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') console.warn(`WikiMarkdownLink: 'papyrus-index:' protocol with pathname '${url.pathname}' references an event that does not exist: ${identifier}.`);
                            appendToStepSummarySection(`\`<WikiMarkdownLink>\` component references an event that does not exist: \`${identifier}\`.`, StepSummarySection.UnimplementedFeatures);
                            return getFallbackComponent();
                        }
                        if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') console.warn('<EventReference> component not implemented, but we needed it for a WikiMarkdownLink.');
                        appendToStepSummarySection(`\`<EventReference>\` component not implemented, but we needed it for a WikiMarkdownLink.`, StepSummarySection.UnimplementedFeatures);
                        return <>{children}</>; // TODO: Implement <EventReference> component
                    }

                    default:
                        appendToStepSummarySection(`\`<WikiMarkdownLink>\` component with 'papyrus-index:' protocol and pathname '${url.pathname}' has an unknown second part after the script name: '${pathnameVariable2}'.`, StepSummarySection.UnimplementedFeatures);
                        if (process.env.SKIP_HIGH_LEVEL_DIAGNOSTIC_LOGS !== 'true') console.warn(`WikiMarkdownLink: 'papyrus-index:' protocol with pathname '${url.pathname}' has an unknown second part after the script name: '${pathnameVariable2}'.`);
                        return getFallbackComponent();
                }

            }

            default:
                throw new  Error(`WikiMarkdownLink: 'papyrus-index:' protocol with pathname '${url.pathname}' does not have a valid first part after the game name.`);
        }

        // eslint-disable-next-line no-unreachable -- leaving this here in case we change things up in the future and this is no longer unreachable.
        throw new Error(`WikiMarkdownLink: 'papyrus-index:' could not be resolved to a link: ${rawHref}`);
    }

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

    if (!ckWikiMatchesGame(gameData.game, url)) return <a href={url.href}>{children}</a>;

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

const noOpURLTransform = (url: string): string => url;

export function WikiMarkdown({md, gameData, baseURL, inTooltip, ...dataAttributes}: {readonly md: string, readonly gameData: PapyrusGameDataIndexed<PapyrusGame>, readonly inTooltip?: boolean | undefined, readonly baseURL: typeof AUTOMATIC_BASE_URL | URL | string | null} & Record<`data-${string}`, string|boolean>): React.ReactElement {
    return <div {...dataAttributes} className={styles.md} data-is-md=''><Markdown
        unwrapDisallowed
        urlTransform={noOpURLTransform}
        skipHtml={false}
        remarkPlugins={[
            remarkBreaks,
            remarkGFM,
        ]}
        components={{
            a: WikiMarkdownLink.bind(null, gameData, inTooltip, baseURL),
            pre: MarkdownCodeBlock,
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
                },
                protocols: {
                    ...defaultSchema.protocols ?? {},
                    href: [...defaultSchema.protocols?.href ?? [], 'papyrus-index'],
                },
            } satisfies Options)
        ]}
    >
        {md}
    </Markdown></div>;
}

function MarkdownCodeBlock({children, node, ...props}: ComponentProps<'pre'> & ExtraProps): React.ReactElement {
    if (!node) throw new Error('MarkdownCodeBlock: No `node` prop provided! This is almost certainly a bug in the WikiMarkdown component.');

    const codeElement = node.children[0];
    if (!codeElement || codeElement.type !== 'element' || codeElement.tagName !== 'code') throw new Error('MarkdownCodeBlock: Expected the first child of the <pre> element to be a <code> element.');

    const className = Array.isArray(codeElement.properties.className) ? codeElement.properties.className.join(' ') : codeElement.properties.className;
    if (!className) return <pre {...props}>{children}</pre>;
    if (typeof className !== 'string') throw new Error(`MarkdownCodeBlock: Expected the \`className\` property of the <code> element to be a string or an array of strings, but got ${typeof className}.`);
    const language = className.match(/(?:\s*|^)language-(?<language>\w+)/u)?.groups?.language;
    if (language !== 'papyrus') return <pre {...props}>{children}</pre>;

    const code = codeElement.children.map((child) => {
        if (child.type === 'text') return child.value;
        if (child.type === 'element' && child.tagName === 'br') return '\n';
        throw new Error(`MarkdownCodeBlock: Unexpected child type in <code> element: ${child.type}. Expected 'text' or 'br'.`);
    }).join('');

    return <CodeBlock language={CodeBlockLanguage.Papyrus} code={code} doLineNumbers />;
}
