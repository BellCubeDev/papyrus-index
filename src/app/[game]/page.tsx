import type { Metadata } from "next";
import { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import { AllScriptsIndexed } from "../../papyrus/indexing/index-all";
import { getGameName } from "../../utils/getGameName";
import { toLowerCase } from "../../utils/toLowerCase";
import { InheritanceDisplay } from "../components/inheritance-display/InheritanceDisplay";
import { SourceIcon } from "../components/papyrus/SourceIcon";
import { SourceName } from "../components/papyrus/SourceName";
import { SourceTypeString } from "../components/papyrus/SourceTypeString";
import styles from "./GamePage.module.scss";
import { getGameFromParams, type GameRouteParams } from "./getGameFromParams";
import { PapyrusTypeValueToken } from "../components/papyrus/type/PapyrusType";
import { PapyrusScriptTypeArchetype } from "../../papyrus/data-structures/pure/type";
import { Link } from "../components/Link";
import { SourcePlate } from "../components/papyrus/SourcesList";


export function generateStaticParams() {
    return Object.values(PapyrusGame).map(gameCased => ({
        game: toLowerCase(gameCased)
    }));
}

export async function generateMetadata({params}: {readonly params: Promise<GameRouteParams>}): Promise<Metadata> {
    const { game } = getGameFromParams(await params);
    const gameName = getGameName(game);
    return {
        title: gameName,
        description: `All known Papyrus functions, events, and scripts for ${gameName}, indexed and searchable in one large, easy-to-use database.`,
    };
}

export default async function GamePage({params}: {readonly params: Promise<GameRouteParams>}) {
    const {game} = getGameFromParams(await params);

    const gameData = AllScriptsIndexed[game];

    return <main>
        <h1>{game}</h1>
        <div className={styles.inheritanceTree}>
            <InheritanceDisplay game={game} data={gameData.topLevelScripts} />
        </div>
        <div className={styles.sourceGrid}>
            {Object.values(gameData.scriptSources).map(source => <Link
                key={source.sourceIdentifier}
                href={`/${toLowerCase(game)}/source/${source.sourceIdentifier}` as const}
                className={styles.source}
                data-no-link-style
            ><div
                style={{
                    // @ts-expect-error I know this isn't a real prop, but I need my css variables
                    "--random-tilt-factor": 2 ** (1.2 * Math.random()),
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
            </div></Link>)}
        </div>
    </main>;
}
