import type { PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import type { SearchEntityFunction } from "../../../../search/Entity";

// eslint-disable-next-line camelcase
async function getWikiFunctionShortDescriptionMD__Server<TGame extends PapyrusGame>(game: TGame, func: (SearchEntityFunction<TGame>|PapyrusScriptFunctionIndexedAggregate<TGame>|PapyrusScriptFunctionIndexed<TGame>) & {ckWikiDescription?: string|null|undefined}, scriptName: string): Promise<string | null> {
    const getWikiDataFunctionPage = (await import(typeof window === 'undefined' ? "../../../../../wiki-data-extraction/ck-wiki/data-extraction/getMediaWikiFunctionData" : '@/empty') as typeof import("../../../../../wiki-data-extraction/ck-wiki/data-extraction/getMediaWikiFunctionData")).getMediaWikiFunctionData;
    const wikiData = await getWikiDataFunctionPage(game, func, scriptName);
    if (!wikiData) return null;
    return wikiData.shortDescriptionMarkdown;
}

export function getWikiFunctionShortDescriptionMD<TGame extends PapyrusGame>(game: TGame, func: (SearchEntityFunction<TGame>|PapyrusScriptFunctionIndexedAggregate<TGame>|PapyrusScriptFunctionIndexed<TGame>) & {ckWikiDescription?: string|null|undefined}, scriptName: string): Awaitable<string | null> {
    if (typeof window !== 'undefined') return 'ckWikiDescription' in func ? func.ckWikiDescription as string|null : null;
    return getWikiFunctionShortDescriptionMD__Server(game, func, scriptName);
}
