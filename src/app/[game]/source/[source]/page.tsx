
import type { Metadata } from "next";
import React, { Suspense } from "react";
import { UnreachableError } from "../../../../UnreachableError";
import type { PapyrusGame } from "../../../../papyrus/data-structures/pure/game";
import { PapyrusSourceType, type PapyrusScriptSourceMetadata, type PapyrusScriptSourceMetadataVanilla } from "../../../../papyrus/data-structures/pure/scriptSource";
import { getGameName } from "../../../../utils/getGameName";
import { SourceName } from "../../../components/papyrus/SourceName";
import { getGameAndSourceFromParams, type SourceRouteParams } from "./getGameAndSourceFromParams";
import { AllScripts } from "../../../../papyrus/parsing/parse-or-load-all";
import { AllScriptsIndexed } from "../../../../papyrus/indexing/index-all";
import { PapyrusScriptReference } from "../../../components/papyrus/script/PapyrusScriptReference";
import { wikisBySource } from "../../../../wiki-data-extraction/individual-github-wikis/wikisBySource";
import { WikiMarkdown } from "../../../components/wiki-markdown/WikiMarkdown";
import { JsonLDGraph } from "../../../components/JsonLDGraph";
import { prepareUrlPart, prepareUrlParts } from "../../../../utils/prepareUrlParts";
import { getKeywords, type PapyrusDataType } from "@/app/SEO";

export function generateStaticParams(): SourceRouteParams[] {
    const params = [];
    for (const [game, gameData] of Object.entries(AllScripts)) {
        for (const source of Object.values(gameData.scriptSources))
            params.push({game: prepareUrlPart(game), source: prepareUrlPart(source.sourceIdentifier)});
    }
    return params;
}

export async function generateMetadata({params}: {params: Promise<SourceRouteParams>}): Promise<Metadata> {
    const {game, source} = getGameAndSourceFromParams(await params);

    const sourceName = SourceName({source, long: true});

    const subDataTypes: PapyrusDataType[] = ['script'];
    if (Object.values(source.scripts).some(script => Object.values(script.structs ?? {}).length > 0)) subDataTypes.push('struct');
    if (Object.values(source.scripts).some(script => Object.values(script.propertyGroups).some(group => Object.values(group.properties).length > 0))) subDataTypes.push('property');
    if (Object.values(source.scripts).some(script => Object.values(script.events).length > 0)) subDataTypes.push('event');
    if (Object.values(source.scripts).some(script => Object.values(script.functions).length > 0)) subDataTypes.push('function');

    const subDataTypesString = `${subDataTypes.slice(0, -1).join('s, ')}${subDataTypes.length > 1 ? ', and ' : ''}${subDataTypes[subDataTypes.length - 1]}s`;

    return {
        title: `Reference: ${sourceName}`,
        description: `Reference for the ${getGameName(game)} Papyrus source, ${sourceName}. Contains all known ${subDataTypesString} from this source, as well as data from other sources, indexed and searchable in one large, easy-to-use database.`,

        keywords: getKeywords({
            game,
            dataTypes: ['source', ...subDataTypes],
            additionalKeywords: null,
        }),
    };
}

export default async function SourcePage({params}: {readonly params: Promise<SourceRouteParams>}) {
    const {game, source} = getGameAndSourceFromParams(await params);
    const gameData = AllScriptsIndexed[game];

    const githubWikiData = wikisBySource[game].get(source.sourceIdentifier)?.getData();

    return <>
        <main>
            <SourcePageSourceData game={game} sourceData={source} />
            <h2>Scripts In This Source</h2>
            <ul>
                {Object.entries(gameData.scriptSources[source.sourceIdentifier]!.scripts).map(([scriptIdentifier, script]) =>
                    <li key={scriptIdentifier}>
                        <PapyrusScriptReference
                            game={game}
                            script={script}
                            inTooltip={false}
                        />
                    </li>
                )}
            </ul>
            <Suspense fallback={<p>Loading GitHub wiki data...</p>}>
                {githubWikiData?.then(data => !data.sourceDescriptionMD ? null : <>
                    <h2>Description from <a href={data.linkToWikiData}>GitHub Wiki</a></h2>
                    <WikiMarkdown md={data.sourceDescriptionMD} baseURL={data.linkToWikiData} gameData={gameData} />
                </>)}
            </Suspense>
        </main>
        <JsonLDGraph data={[
            {
                "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'source', source.sourceIdentifier)}#source`,
                "@type": "CollectionPage",
                url: `https://papyrus.bellcube.dev${prepareUrlParts(game, 'source', source.sourceIdentifier)}`,
                mainEntityOfPage: `https://papyrus.bellcube.dev${prepareUrlParts(game, 'source', source.sourceIdentifier)}#source`,
                isPartOf: "https://papyrus.bellcube.dev/#website",
                name: `Papyrus scripts from ${SourceName({source, long: true})} for ${getGameName(game)}`,
                description: `Contains all known Papyrus scripts from the source ${SourceName({source, long: true})} for ${getGameName(game)}.`,
                hasPart: [
                    ...Object.values(gameData.scriptSources[source.sourceIdentifier]!.scripts).map(script => ({
                        "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', script.namespaceName)}#script`,
                    }))
                ],
            }
        ]} />
    </>;
}

function SourcePageVanillaGameData<TGame extends PapyrusGame>({game, sourceData: _sourceData}: {readonly game: TGame, readonly sourceData: PapyrusScriptSourceMetadataVanilla<TGame>}) {
    return <>
        <h1>{getGameName(game)} (the vanilla game)</h1>
        <p>Scripts included in the vanilla game. Users will not need to download anything.</p>
    </>;
}

function SourcePageScriptExtenderData<TGame extends PapyrusGame>({game, sourceData}: {readonly game: TGame, readonly sourceData: PapyrusScriptSourceMetadata<TGame> & {type: PapyrusSourceType.xSE}}) {
    return <>
        <h1>{getGameName(game)} - <SourceName source={sourceData} long /></h1>
        <p>
            These scripts come with the community-made script extender for {getGameName(game)} (<SourceName source={sourceData} />). Users will only need to install the script extender for these scripts to be in the game.
        </p>
        <h2>Download Locations</h2>
        <ul>
            {!sourceData.preferredModPage ? null : <li><a href={sourceData.preferredModPage}>Mod Page</a></li>}
            {!sourceData.nexusPage ? null : <li><a href={sourceData.nexusPage}>Nexus Mods Page</a></li>}
            {!sourceData.silverlockPage ? null : <li><a href={sourceData.silverlockPage}>Silverlock Page</a></li>}
        </ul>
    </>;
}

function SourcePageExternalSourceData<TGame extends PapyrusGame>({game, sourceData}: {readonly game: TGame, readonly sourceData: PapyrusScriptSourceMetadata<TGame> & {type: Exclude<PapyrusSourceType, PapyrusSourceType.xSE|PapyrusSourceType.Vanilla>}}) {
    return <>
        <h1>{getGameName(game)} - <SourceName source={sourceData} long /></h1>
        <p>This source is a mod and will need to be downloaded & installed separately by users. {sourceData.type !== PapyrusSourceType.PapyrusLib ? null : <>
            As this library is purely Papyrus, it is possible the library author allows for direct inclusion in other mods. Check the library&rsquo;s license to see if they allow for this&mdash;and never include parts of a library in your mod without permission!
        </>}</p>
        <h2>Download Locations</h2>
        <ul>
            {!sourceData.preferredModPage ? null : <li><a href={sourceData.preferredModPage}>Mod Page</a></li>}
            {!sourceData.nexusPage ? null : <li><a href={sourceData.nexusPage}>Nexus Mods Page</a></li>}
            {!sourceData.gitRepo ? null : <li><a href={sourceData.gitRepo}>Git Repository</a> (source code)</li>}
        </ul>
    </>;
}

function SourcePageSourceData<TGame extends PapyrusGame>({game, sourceData}: {readonly game: TGame, readonly sourceData: PapyrusScriptSourceMetadata<TGame>}) {
    switch (sourceData.type) {
        case PapyrusSourceType.Vanilla:
            return <SourcePageVanillaGameData game={game} sourceData={sourceData} />;
        case PapyrusSourceType.xSE:
            return <SourcePageScriptExtenderData game={game} sourceData={sourceData} />;
        case PapyrusSourceType.PapyrusLib:
        case PapyrusSourceType.Standalone:
        case PapyrusSourceType.xSePluginExtender:
        case PapyrusSourceType.xSePluginIncidental:
            return <SourcePageExternalSourceData game={game} sourceData={sourceData} />;
        default:
            throw new UnreachableError(sourceData, `Unknown source type for ${getGameName(game)} source!`);
    }
}
