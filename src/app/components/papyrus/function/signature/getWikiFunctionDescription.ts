import { use } from "react";
import type { PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import type { SearchEntityFunction } from "../../../../search/Entity";

// eslint-disable-next-line camelcase
async function getWikiFunctionShortDescriptionMD__Server<TGame extends PapyrusGame>(game: TGame, func: (SearchEntityFunction<TGame>|PapyrusScriptFunctionIndexedAggregate<TGame>|PapyrusScriptFunctionIndexed<TGame>) & {ckWikiDescription?: string|null|undefined}, scriptName: string): Promise<string | null> {
    const getWikiDataFunctionPage = (await import(typeof window === 'undefined' ? "../../../../../wikimedia/GetWikiDataFunctionPage" : 'data:text/plain;charset=utf-8;base64,MQ==') as typeof import("../../../../../wikimedia/GetWikiDataFunctionPage")).getWikiDataFunctionPage;
    const wikiData = await getWikiDataFunctionPage(game, func, scriptName);
    if (!wikiData) return null;
    return wikiData.shortDescriptionMarkdown;
}

export function useGetWikiFunctionShortDescriptionMD<TGame extends PapyrusGame>(game: TGame, func: (SearchEntityFunction<TGame>|PapyrusScriptFunctionIndexedAggregate<TGame>|PapyrusScriptFunctionIndexed<TGame>) & {ckWikiDescription?: string|null|undefined}, scriptName: string): string | null {
    if (typeof window !== 'undefined') return 'ckWikiDescription' in func ? func.ckWikiDescription as string|null : null;
    return use(getWikiFunctionShortDescriptionMD__Server(game, func, scriptName));
}
