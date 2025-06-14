import type { PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { toLowerCase } from "../../../../../utils/toLowerCase";
import type { GitHubWikiFunctionData } from "../../../../../wiki-data-extraction/individual-github-wikis/GitHubWiki";
import type { SearchEntityFunction } from "../../../../search/Entity";

// eslint-disable-next-line camelcase
async function getGitHubWikiFunctionData__Server<TGame extends PapyrusGame>(func: (SearchEntityFunction<TGame>|PapyrusScriptFunctionIndexedAggregate<TGame>|PapyrusScriptFunctionIndexed<TGame>) & RestoreLegacyOptionalKeys<Partial<Pick<SearchEntityFunction<TGame>, 'githubWikiData'>>>): Promise<[Lowercase<string>, GitHubWikiFunctionData][]> {
    const wikisBySource = (await import(typeof window === 'undefined' ? "../../../../../wiki-data-extraction/individual-github-wikis/wikisBySource" : '@/empty') as typeof import("../../../../../wiki-data-extraction/individual-github-wikis/wikisBySource")).wikisBySource;
    const wikisBySourceForGame = wikisBySource[func.game.game];

    if ('$sources' in func) {
        const scriptNamespaceName = toLowerCase(func.script.namespaceName[0]![1]);
        const funcName = toLowerCase(func.name[0]![1]);
        //console.log(`Getting GitHub wiki function descriptions for ${funcName} in script ${scriptNamespaceName} from game ${func.game.game}`);
        return await Promise.all(Object.keys(func.$sources).map(async source => {
            const wiki = wikisBySourceForGame.get(source);
            //console.log(`Getting GitHub wiki function descriptions for ${funcName} in script ${scriptNamespaceName} from game ${func.game.game}; wiki for source ${source}:`, wiki);
            if (!wiki) return null;
            const wikiData = await wiki.getFunction(scriptNamespaceName, funcName);
            return wikiData?.descriptionMD ? [source, wikiData] satisfies [Lowercase<string>, GitHubWikiFunctionData] : null;
        })).then(results => results.filter((v): v is NonNullable<typeof v> => v !== null));
    } else {
        const wiki = wikisBySourceForGame.get(func.script.source.sourceIdentifier);
        if (!wiki) return [];
        const wikiData = await wiki.getFunction(toLowerCase(func.script.namespaceName), toLowerCase(func.name));
        return wikiData?.descriptionMD ? [[func.script.source.sourceIdentifier, wikiData]] : [];
    }
}

export function getGitHubWikiFunctionData<TGame extends PapyrusGame>(func: (SearchEntityFunction<TGame>|PapyrusScriptFunctionIndexedAggregate<TGame>|PapyrusScriptFunctionIndexed<TGame>) & RestoreLegacyOptionalKeys<Partial<Pick<SearchEntityFunction<TGame>, 'githubWikiData'>>>): Awaitable<[Lowercase<string>, GitHubWikiFunctionData][]> {
    if (typeof window !== 'undefined') return 'githubWikiData' in func && func.githubWikiData ? func.githubWikiData : [];
    return getGitHubWikiFunctionData__Server(func);
}
