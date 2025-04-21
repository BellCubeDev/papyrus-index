import type { Metadata } from "next";
import { getGameName } from "../../utils/getGameName";
import { getWiki } from "../../mediawiki/getWiki";
import { WikiAttribution } from "../components/wiki-attribution/WikiAttribution";
import { getGameFromParams, type GameRouteParams } from "./getGameFromParams";
import { LOADING_IN_DEV_MODE, SearchProvider } from "../search/SearchProvider";
import { generateSearchJsonHash } from "./search-data.json/generateSearchJsonHash";
import styles from './GameLayout.module.scss';
import { NavBar } from "../components/nav-bar/NavBar";
import { SuspenseIfDevelopment } from "../components/SuspenseIfDevelopment";

export async function generateMetadata({params}: {readonly params: Promise<GameRouteParams>}): Promise<Metadata> {
    const { game } = getGameFromParams(await params);
    const gameName = getGameName(game);

    return {
        title: {
            template: `%s | ${gameName} - Papyrus Index`,
            absolute: `~~ERROR~~ | ${gameName} - Papyrus Index`,
        }
    };
}

export default async function GameLayout({children, params}: {readonly children: React.ReactNode, readonly params: Promise<GameRouteParams>}) {
    const {game} = getGameFromParams(await params);

    const searchProviderChildren = <>
        <NavBar game={game} />
        {children}
        <WikiAttribution {...getWiki(game)}  />
    </>;

    return <>
        <img
            className={styles.gameBackground}
            src={`/images/${game}/background.jpg`}
            alt={`Background for ${getGameName(game)}`}
            loading="lazy" decoding="async"
        />

        <SuspenseIfDevelopment fallback={
            <SearchProvider game={game} searchIndexHash={LOADING_IN_DEV_MODE}>
                {searchProviderChildren}
            </SearchProvider>
        }  >
            {generateSearchJsonHash(game).then((hash) => <SearchProvider game={game} searchIndexHash={hash}>
                {searchProviderChildren}
            </SearchProvider>)}
        </SuspenseIfDevelopment>


    </>;


}
