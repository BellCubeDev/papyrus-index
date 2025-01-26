import type { Metadata } from "next";
import { getGameName } from "../../utils/getGameName";
import { toLowerCase } from "../../utils/toLowerCase";
import { getWiki } from "../../wikimedia/getWiki";
import { Link } from "../components/Link";
import { WikiAttribution } from "../components/wiki-attribution/WikiAttribution";
import { getGameFromParams, type GameRouteParams } from "./getGameFromParams";

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

    return <div>
        <h1>From the game: <Link href={`/${toLowerCase(game)}` as const}>{getGameName(game)}</Link></h1>
        {children}
        <WikiAttribution {...getWiki(game)}  />
    </div>;
}
