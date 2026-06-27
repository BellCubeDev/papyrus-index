import type { Metadata } from "next";
import { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import { AllScriptsIndexed } from "../../papyrus/indexing/index-all";
import { getGameName } from "../../utils/getGameName";
import { InheritanceDisplay } from "../components/inheritance-display/InheritanceDisplay";
import { SourceIcon } from "../components/papyrus/SourceIcon";
import { SourceName } from "../components/papyrus/SourceName";
import { SourceTypeString } from "../components/papyrus/SourceTypeString";
import styles from "./GamePage.module.scss";
import { getGameFromParams, type GameRouteParams } from "./getGameFromParams";
import { PapyrusTypeValueToken } from "../components/papyrus/type/PapyrusType";
import { PapyrusScriptTypeArchetype } from "../../papyrus/data-structures/pure/type";
import { InternalLink } from "../components/Link";
import { SourcePlate } from "../components/papyrus/SourcesList";
import { JsonLDGraph } from "../components/JsonLDGraph";
import type { BreadcrumbList, CollectionPage, WebPage } from "schema-dts";
import { AllSourcesCombined } from "../../papyrus/data-structures/indexing/game";
import { prepareUrlPart, prepareUrlParts } from "../../utils/prepareUrlParts";
import { UnreachableError } from "../../UnreachableError";
import { getKeywords, type PapyrusDataType } from "@/app/SEO";
import { isPapyrusFeatureSupported, PapyrusFeature } from "@/papyrus/feature-support";


export function generateStaticParams() {
    return Object.values(PapyrusGame).map(gameCased => ({
        game: prepareUrlPart(gameCased)
    }));
}

function hasFunctions(game: PapyrusGame) {
    const gameData = AllScriptsIndexed[game];
    const scripts = Object.values(gameData.scripts);
    return scripts.some(script => Object.keys(script[AllSourcesCombined].functions).length > 0);
}

function hasEvents(game: PapyrusGame) {
    const gameData = AllScriptsIndexed[game];
    const scripts = Object.values(gameData.scripts);
    return scripts.some(script => Object.keys(script[AllSourcesCombined].events).length > 0);
}

function hasProperties(game: PapyrusGame) {
    const gameData = AllScriptsIndexed[game];
    const scripts = Object.values(gameData.scripts);
    return scripts.some(script => Object.values(script[AllSourcesCombined].propertyGroups).some(group => Object.keys(group.properties).length > 0));
}

function hasStructs(game: PapyrusGame) {
    if (!isPapyrusFeatureSupported(PapyrusFeature.Structs, game)) return false;

    const gameData = AllScriptsIndexed[game];
    const scripts = Object.values(gameData.scripts);
    return scripts.some(script => Object.keys(script[AllSourcesCombined].structs).length > 0);
}

export async function generateMetadata({params}: {readonly params: Promise<GameRouteParams>}): Promise<Metadata> {
    const { game } = getGameFromParams(await params);
    const gameName = getGameName(game);

    const subDataTypes: PapyrusDataType[] = ['script'];
    if (hasStructs(game)) subDataTypes.push('struct');
    if (hasProperties(game)) subDataTypes.push('property');
    if (hasEvents(game)) subDataTypes.push('event');
    if (hasFunctions(game)) subDataTypes.push('function');

    const subDataTypesString = `${subDataTypes.slice(0, -1).join('s, ')}${subDataTypes.length > 1 ? ', and ' : ''}${subDataTypes[subDataTypes.length - 1]}s`;

    return {
        title: gameName,
        description: `All known ${gameName} Papyrus ${subDataTypesString}, indexed and searchable in one large, easy-to-use database.`,

        keywords: getKeywords({
            game,
            dataTypes: ['game', ...subDataTypes],
            additionalKeywords: null,
        }),
    };
}

export default async function GamePage({params}: {readonly params: Promise<GameRouteParams>}) {
    const {game} = getGameFromParams(await params);

    const gameData = AllScriptsIndexed[game];

    return <>
        <main>
            <h1>{game}</h1>
            <div className={styles.inheritanceTree}>
                <InheritanceDisplay game={game} data={gameData.topLevelScripts} />
            </div>
            <ul className={styles.sourceGrid}>
                {Object.values(gameData.scriptSources).map(source => <li key={source.sourceIdentifier}>
                    <InternalLink
                        href={prepareUrlParts(game, 'source', source.sourceIdentifier)}
                        className={styles.source}
                        data-no-link-style
                    >
                        <div
                            style={{
                                // @ts-expect-error I know this isn't a real prop, but I need my css variables
                                // eslint-disable-next-line react-hooks/purity -- these components are only rendered once during SSG
                                "--random-tilt-factor": 2 ** (1.2 * Math.random()),
                                // eslint-disable-next-line react-hooks/purity -- these components are only rendered once during SSG
                                "--random-tilt-direction": Math.random() >= 0.5 ? 1 : -1,
                            }}
                        >
                            <div className={styles.sourceTop}>
                                <SourcePlate sourceId={source.sourceIdentifier} game={game} noLink className={styles.sourcePlate!} />
                                <PapyrusTypeValueToken game={game} type={{type: PapyrusScriptTypeArchetype.String, isArray: false, value: source.sourceIdentifier}} />
                            </div>
                            <div className={styles.sourceMiddle}>
                                <SourceIcon sourceType={source.type} />
                                <span><SourceTypeString sourceType={source.type} /></span>
                            </div>
                            <div className={styles.sourceBody}>
                                <span className={styles.sourceNameAndPlate}>
                                    <h3><SourceName source={source} long /></h3>
                                </span>
                            </div>
                        </div>
                    </InternalLink>
                </li>)}
            </ul>
        </main>
        <JsonLDGraph data={[
            {
                "@type": "CollectionPage",
                "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game)}#game`,
                url: `https://papyrus.bellcube.dev${prepareUrlParts(game)}`,
                mainEntityOfPage: `https://papyrus.bellcube.dev${prepareUrlParts(game)}#game`,
                isPartOf: "https://papyrus.bellcube.dev/#website",
                name: `Papyrus scripts for ${getGameName(game)}`,
                description: `Contains all known Papyrus scripts for ${getGameName(game)}, including both vanilla and modded scripts. Also includes places where you can find scripts, such as the vanilla game, xSE, and various mods.`,
                hasPart: [
                    ...Object.values(gameData.scriptSources).map(source => ({
                        "@type": "WebPage",
                        "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'source', source.sourceIdentifier)}#source`
                    } )),
                    ...Object.values(gameData.scripts).map(script => ({
                        "@type": "WebPage",
                        "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', script[AllSourcesCombined].namespaceName[0]![1])}#script`
                    })),
                ],
                about: {
                    "@id": (()=>{
                        switch (game) {
                            case PapyrusGame.SkyrimSE: return "https://en.wikipedia.org/wiki/The_Elder_Scrolls_V:_Skyrim";
                            case PapyrusGame.Fallout4: return "https://en.wikipedia.org/wiki/Fallout_4";
                            case PapyrusGame.Fallout76: return "https://en.wikipedia.org/wiki/Fallout_76";
                            case PapyrusGame.Starfield: return "https://en.wikipedia.org/wiki/Starfield_(video_game)";
                            default: throw new UnreachableError(game, "Unknown game in /[game]/ page schema.org about field");
                        }
                    })()
                },
                breadcrumb: {
                    "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game)}#breadcrumb`
                },
            } satisfies CollectionPage,
            {
                "@type": "WebPage",
                "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game)}#webpage`,
                url: `https://papyrus.bellcube.dev${prepareUrlParts(game)}`,
                mainEntity: { "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game)}#game` },
                isPartOf: { "@id": "https://papyrus.bellcube.dev/#website" },
            } satisfies WebPage,
            {
                "@type": "BreadcrumbList",
                "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game)}#breadcrumb`,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: "https://papyrus.bellcube.dev/",
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: getGameName(game),
                        item: `https://papyrus.bellcube.dev${prepareUrlParts(game)}`,
                    }
                ]
            } satisfies BreadcrumbList,
        ]} />
    </>;
}
