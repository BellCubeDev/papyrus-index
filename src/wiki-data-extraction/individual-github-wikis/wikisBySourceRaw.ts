import { PapyrusGame } from '../../papyrus/data-structures/pure/game';
import path from 'node:path';
import fs from 'node:fs/promises';
import { toLowerCase } from "../../utils/toLowerCase";
import { GitHubWiki, type GitHubWikiWithConcreteConstructor } from './GitHubWiki';
import { dataDir } from '../../folders';


export const wikisBySourceRaw = Object.fromEntries(await Promise.all(Object.values(PapyrusGame)
    .map(async (game)=>[
        game,
        new Map(
            await fs.readdir(path.join(dataDir, game), {withFileTypes: true}).catch(()=>[]).then(async entries => (await Promise.all(
                entries.map(async entry => {
                    if (!entry.isDirectory()) return null;

                    const wikiPath = path.join(dataDir, game, entry.name, 'wiki.ts');
                    if (!(await fs.access(wikiPath).then(() => true).catch(() => false))) return null;

                    return await import(wikiPath).then(wikiModule => {
                        const isXExtendedByY = Object.prototype.isPrototypeOf.call.bind(Object.prototype.isPrototypeOf);
                        if (!isXExtendedByY(GitHubWiki, wikiModule.default)) throw new Error(`Invalid wiki module: ${wikiPath} (default export does not extend GitHubWiki)`);
                        return [toLowerCase(entry.name), wikiModule.default as GitHubWikiWithConcreteConstructor<typeof game>] as const;
                    });

                })
            )).filter((wiki): wiki is NonNullable<typeof wiki> => wiki !== null))
        )
    ] as const))) as {[TGame in PapyrusGame]: Map<Lowercase<string>, GitHubWikiWithConcreteConstructor<TGame>>};
