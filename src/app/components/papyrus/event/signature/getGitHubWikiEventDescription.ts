import type { PapyrusScriptEventOrBaseFunctionIndexed, PapyrusScriptEventOrBaseFunctionIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { toLowerCase } from "../../../../../utils/toLowerCase";
import type { GitHubWikiEventData } from "../../../../../wiki-data-extraction/individual-github-wikis/types";
import type { SearchEntityEvent } from "../../../../search/Entity";

// eslint-disable-next-line camelcase
async function getGitHubWikiEventData__Server<TGame extends PapyrusGame>(evt: (SearchEntityEvent<TGame>|PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>|PapyrusScriptEventOrBaseFunctionIndexed<TGame>) & RestoreLegacyOptionalKeys<Partial<Pick<SearchEntityEvent<TGame>, 'githubWikiData'>>>): Promise<[Lowercase<string>, GitHubWikiEventData][]> {
    const wikisBySource = (await import(typeof window === 'undefined' ? "../../../../../wiki-data-extraction/individual-github-wikis/wikisBySource" : '@/empty') as typeof import("../../../../../wiki-data-extraction/individual-github-wikis/wikisBySource")).wikisBySource;
    const wikisBySourceForGame = wikisBySource[evt.game.game];

    if ('$sources' in evt) {
        const scriptNamespaceName = toLowerCase(evt.script.namespaceName[0]![1]);
        const evtName = toLowerCase(evt.name[0]![1]);
        //console.log(`Getting GitHub wiki function descriptions for ${evtName} in script ${scriptNamespaceName} from game ${evt.game.game}`);
        return await Promise.all(Object.keys(evt.$sources).map(async source => {
            const wiki = wikisBySourceForGame.get(source);
            //console.log(`Getting GitHub wiki function descriptions for ${evtName} in script ${scriptNamespaceName} from game ${evt.game.game}; wiki for source ${source}:`, wiki);
            if (!wiki) return null;
            const wikiData = await wiki.getEvent(scriptNamespaceName, evtName);
            //console.log(`Got GitHub wiki event description for event ${evtName} in script ${scriptNamespaceName} from game ${evt.game.game}, source ${source}; wikiData:`, wikiData);
            if (!wikiData) return null;
            return [source, wikiData] satisfies [Lowercase<string>, GitHubWikiEventData];
        })).then(results => results.filter((v): v is NonNullable<typeof v> => v !== null));
    } else {
        const wiki = wikisBySourceForGame.get(evt.script.source.sourceIdentifier);
        if (!wiki) return [];
        const wikiData = await wiki.getEvent(toLowerCase(evt.script.namespaceName), toLowerCase(evt.name));
        if (!wikiData) return [];
        return [[evt.script.source.sourceIdentifier, wikiData]];
    }
}

export function getGitHubWikiEventData<TGame extends PapyrusGame>(evt: (SearchEntityEvent<TGame>|PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>|PapyrusScriptEventOrBaseFunctionIndexed<TGame>) & RestoreLegacyOptionalKeys<Partial<Pick<SearchEntityEvent<TGame>, 'githubWikiData'>>>): Awaitable<[Lowercase<string>, GitHubWikiEventData][]> {
    if (typeof window !== 'undefined') return 'githubWikiData' in evt && evt.githubWikiData ? evt.githubWikiData : [];
    return getGitHubWikiEventData__Server(evt);
}
