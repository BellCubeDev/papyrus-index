
import type { Metadata } from "next";
import React from "react";
import { UnreachableError } from "../../../../UnreachableError";
import type { PapyrusGame } from "../../../../papyrus/data-structures/pure/game";
import { PapyrusSourceType, type PapyrusScriptSourceMetadata, type PapyrusScriptSourceMetadataVanilla, type PapyrusScriptSourceMetadataWithGitHub, type PapyrusScriptSourceMetadataXSE } from "../../../../papyrus/data-structures/pure/scriptSource";
import { getGameName } from "../../../../utils/getGameName";
import { SourceName } from "../../../components/papyrus/SourceName";
import { getGameAndSourceFromParams, type SourceRouteParams } from "./getGameAndSourceFromParams";
import { AllScripts } from "../../../../papyrus/parsing/parse-or-load-all";
import { toLowerCase } from "../../../../utils/toLowerCase";

export function generateStaticParams(): SourceRouteParams[] {
    const params = [];
    for (const [game, gameData] of Object.entries(AllScripts)) {
        for (const source of Object.values(gameData.scriptSources))
            params.push({game: toLowerCase(game), source: source.sourceIdentifier});
    }
    return params;
}

export async function generateMetadata({params}: {params: Promise<SourceRouteParams>}): Promise<Metadata> {
    const {game, source} = getGameAndSourceFromParams(await params);

    return {
        title: `Source: ${SourceName({source, long: false})}`,
        description: `Reference page for the ${getGameName(game)} Papyrus source, ${SourceName({source, long: true})}`,
    };
}

export default async function SourcePage({params}: {readonly params: Promise<SourceRouteParams>}) {
    const {game, source} = getGameAndSourceFromParams(await params);

    return <>
        <SourcePageSourceData game={game} sourceData={source} />

    </>;

}

function SourcePageVanillaGameData<TGame extends PapyrusGame>({game, sourceData}: {readonly game: TGame, readonly sourceData: PapyrusScriptSourceMetadataVanilla<TGame>}) {
    return <>
        <h1>{getGameName(game)} - <SourceName source={sourceData} long /></h1>
        <p>Scripts included in the vanilla game. Users will not need to download anything.</p>
    </>;
}

function SourcePageScriptExtenderData<TGame extends PapyrusGame>({game, sourceData}: {readonly game: TGame, readonly sourceData: PapyrusScriptSourceMetadataXSE<TGame>}) {
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

function SourcePageExternalSourceData<TGame extends PapyrusGame>({game, sourceData}: {readonly game: TGame, readonly sourceData: PapyrusScriptSourceMetadataWithGitHub<TGame>}) {
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
