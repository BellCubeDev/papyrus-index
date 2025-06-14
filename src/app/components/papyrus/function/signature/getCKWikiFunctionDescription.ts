import type { PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import type { CKWikiDataFunctionPage } from "../../../../../wiki-data-extraction/ck-wiki/data-extraction/getMediaWikiFunctionData";
import type { SearchEntityFunction } from "../../../../search/Entity";

// eslint-disable-next-line camelcase
async function getCKWikiFunctionShortDescriptionMD__Server<TGame extends PapyrusGame>(game: TGame, func: (SearchEntityFunction<TGame>|PapyrusScriptFunctionIndexedAggregate<TGame>|PapyrusScriptFunctionIndexed<TGame>) & RestoreLegacyOptionalKeys<Partial<Pick<SearchEntityFunction<TGame>, 'ckWikiData'>>>, scriptName: string): Promise<CKWikiDataFunctionPage | null> {
    const getWikiDataFunctionPage = (await import(typeof window === 'undefined' ? "../../../../../wiki-data-extraction/ck-wiki/data-extraction/getMediaWikiFunctionData" : '@/empty') as typeof import("../../../../../wiki-data-extraction/ck-wiki/data-extraction/getMediaWikiFunctionData")).getMediaWikiFunctionData;
    return await getWikiDataFunctionPage(game, func, scriptName);
}

export function getCKWikiFunctionShortDescriptionMD<TGame extends PapyrusGame>(game: TGame, func: (SearchEntityFunction<TGame>|PapyrusScriptFunctionIndexedAggregate<TGame>|PapyrusScriptFunctionIndexed<TGame>) & RestoreLegacyOptionalKeys<Partial<Pick<SearchEntityFunction<TGame>, 'ckWikiData'>>>, scriptName: string): Awaitable<CKWikiDataFunctionPage | null> {
    if (typeof window !== 'undefined') return 'ckWikiData' in func && func.ckWikiData ? func.ckWikiData : null;
    return getCKWikiFunctionShortDescriptionMD__Server(game, func, scriptName);
}
