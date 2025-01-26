import { PapyrusGame } from "../papyrus/data-structures/pure/game";
import { UnreachableError } from "../UnreachableError";

export type GameWithWiki = Extract<PapyrusGame, PapyrusGame.SkyrimSE | PapyrusGame.Fallout4>;

export interface PapyrusWiki {
    /** Determiner (labeling article) used in conjunction with the wikiName above.
     *
     * For example, "This data was retrieved from __the__ Skyrim Creation Kit Wiki."
    */
    wikiDeterminer: Lowercase<string> | null;
    /**
     * The name of the wiki, as would be displayed in the attribution footer.
     *
     * @see wikiDeterminer
     */
    wikiName: string;
    /** Base URL (origin) of the wiki of the wiki, e.g. `"https://ck.uesp.net/"` */
    wikiBaseUrl: string;
    /**
     * The actual game wiki this data is from. Some games do not have an equivalent to the CK wiki, so previous Bethesda game wikis are used.
     *
     * At the time of this prop's introduction, both Starfield and FO76 fall back onto Fallout 4's wiki.
    */
    wikiTrueGame: GameWithWiki;
}

export const PapyrusWikiMap: Record<GameWithWiki, PapyrusWiki> = {
    [PapyrusGame.SkyrimSE]: getWiki(PapyrusGame.SkyrimSE),
    [PapyrusGame.Fallout4]: getWiki(PapyrusGame.Fallout4),
};

export function getWiki(game: PapyrusGame): PapyrusWiki {
    switch (game) {
        case PapyrusGame.SkyrimSE:
            return {
                wikiDeterminer: 'the',
                wikiName: 'Skyrim Creation Kit Wiki',
                wikiBaseUrl: 'https://ck.uesp.net/',
                wikiTrueGame: PapyrusGame.SkyrimSE,
            };
        case PapyrusGame.Fallout4:
        case PapyrusGame.Starfield:
        case PapyrusGame.Fallout76:
            return {
                wikiDeterminer: 'the',
                wikiName: 'Fallout 4 Creation Kit Wiki',
                wikiBaseUrl: 'https://falloutck.uesp.net/',
                wikiTrueGame: PapyrusGame.Fallout4,
            };
        default:
            throw new UnreachableError(game, 'Unknown game encountered while determining the correct wiki base URL for this game (via the getWiki(game) function)');
    }
}
