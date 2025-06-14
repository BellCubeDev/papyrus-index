import { AllScriptsIndexed } from "../../papyrus/indexing/index-all";
import type { GitHubWiki, GitHubWikiWithConcreteConstructor } from "./GitHubWiki";
import { wikisBySourceRaw } from "./wikisBySourceRaw";

export const wikisBySource = Object.fromEntries(
    Object.entries(wikisBySourceRaw).map(([game, wikis]) => [
        game,
        new Map(
            wikis.entries().map(([sourceId, WikiClass]) => {
                const source = AllScriptsIndexed[game].scriptSources[sourceId];
                if (!source) throw new Error(`Source ${sourceId} not found in AllScriptsIndexed for game ${game}, but was found in wikisBySourceRaw. This likely means you have a wiki.ts file WITHOUT a corresponding meta.yaml file.`);

                return [
                    sourceId,
                    new (WikiClass as GitHubWikiWithConcreteConstructor<typeof game>)(source)
                ];
            })
        )
    ])
) as { [TGame in keyof typeof wikisBySourceRaw]: Map<Lowercase<string>, GitHubWiki<TGame>> };
