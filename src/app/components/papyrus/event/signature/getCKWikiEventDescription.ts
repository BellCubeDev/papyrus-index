import type { PapyrusScriptEventOrBaseFunctionIndexed, PapyrusScriptEventOrBaseFunctionIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import type { CKWikiDataEventPage } from "../../../../../wiki-data-extraction/ck-wiki/data-extraction/getMediaWikiEventData";
import type { SearchEntityEvent } from "../../../../search/Entity";

// eslint-disable-next-line camelcase
async function getCKWikiEventShortDescriptionMD__Server<TGame extends PapyrusGame>(game: TGame, evt: (SearchEntityEvent<TGame>|PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>|PapyrusScriptEventOrBaseFunctionIndexed<TGame>) & RestoreLegacyOptionalKeys<Partial<Pick<SearchEntityEvent<TGame>, 'ckWikiData'>>>, scriptName: string): Promise<CKWikiDataEventPage | null> {
    const getWikiDataEventPage = (await import(typeof window === 'undefined' ? "../../../../../wiki-data-extraction/ck-wiki/data-extraction/getMediaWikiEventData" : '@/empty') as typeof import("../../../../../wiki-data-extraction/ck-wiki/data-extraction/getMediaWikiEventData")).getMediaWikiEventData;
    return await getWikiDataEventPage(game, evt, scriptName);
}

export function getCKWikiEventShortDescriptionMD<TGame extends PapyrusGame>(game: TGame, evt: (SearchEntityEvent<TGame>|PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>|PapyrusScriptEventOrBaseFunctionIndexed<TGame>) & RestoreLegacyOptionalKeys<Partial<Pick<SearchEntityEvent<TGame>, 'ckWikiData'>>>, scriptName: string): Awaitable<CKWikiDataEventPage | null> {
    if (typeof window !== 'undefined') return 'ckWikiData' in evt && evt.ckWikiData ? evt.ckWikiData : null;
    return getCKWikiEventShortDescriptionMD__Server(game, evt, scriptName);
}
