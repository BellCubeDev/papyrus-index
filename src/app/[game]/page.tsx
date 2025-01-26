import type { Metadata } from "next";
import { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import { AllScriptsIndexed } from "../../papyrus/indexing/index-all";
import { getGameName } from "../../utils/getGameName";
import { toLowerCase } from "../../utils/toLowerCase";
import { InheritanceDisplay } from "../components/inheritance-display/InheritanceDisplay";
import { SourceIcon } from "../components/papyrus/SourceIcon";
import { SourceName } from "../components/papyrus/SourceName";
import { SourceTypeString } from "../components/papyrus/SourceTypeString";
import { VariablePlate } from "../components/variable-plate";
import styles from "./GamePage.module.scss";
import { getGameFromParams, type GameRouteParams } from "./getGameFromParams";


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

    return <div>
        <h1>{game}</h1>
        <div className={styles.inheritanceTree}>
            <InheritanceDisplay game={game} data={gameData.topLevelScripts} />
        </div>
        <div className={styles.sourceGrid}>
            {Object.values(gameData.scriptSources).map(source => <div className={styles.source} key={source.sourceIdentifier}>
                <div className={styles.sourceTop}>
                    <SourceIcon sourceType={source.type} />
                    <span><SourceTypeString sourceType={source.type} /></span>
                    <VariablePlate level={3} value={source.sourceIdentifier} />
                </div>
                <div className={styles.sourceBody}>
                    <h3><SourceName source={source} long /></h3>
                </div>
            </div>)}
        </div>
    </div>;
}
