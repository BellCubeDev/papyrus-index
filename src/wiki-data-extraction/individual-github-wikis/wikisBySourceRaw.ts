import { PapyrusGame } from '../../papyrus/data-structures/pure/game';
import path from 'node:path';
import url from 'node:url';
import fs from 'node:fs/promises';
import { toLowerCase } from "../../utils/toLowerCase";
import { GitHubWiki, type GitHubWikiWithConcreteConstructor } from './GitHubWiki';
import { dataDir } from '../../folders';

const thisFile = url.fileURLToPath(import.meta.url);

export const wikisBySourceRaw = Object.fromEntries(await Promise.all(Object.values(PapyrusGame)
    .map(async (game)=>[
        game,
        new Map(
            await fs.readdir(path.join(dataDir, game), {withFileTypes: true}).catch(()=>[]).then(async entries => (await Promise.all(
                entries.map(async entry => {
                    if (!entry.isDirectory()) return null;

                    //
                    // Because of bundlers, we can't just construct the paths as a non-statically-analyzable string. That'd be too easy.
                    // So, we must use a template literal to construct the path to the wiki.ts file.
                    //
                    // But, for sanity's sake, we also check that the path constructed with path.join() matches the template literal path.
                    //
                    // This also means we have to have two copies of the template literal, since we have to pass the literal directly to import()
                    //

                    const wikiPath =                         `../../../data/${game}/${entry.name}/wiki.ts`;
                    function dynamicImport() { return import(`../../../data/${game}/${entry.name}/wiki.ts`) };

                    const wikiPathResolved = path.resolve(path.dirname(thisFile), wikiPath); // use path.dirname() here since dynamic import() goes relative to the current directory
                    const expectedWikiPath = path.resolve(dataDir, game, entry.name, 'wiki.ts');
                    if (wikiPathResolved !== expectedWikiPath) throw new Error(`Mismatch between path.join() and template literal path for wiki.ts: ${wikiPathResolved} vs ${expectedWikiPath}`);

                    if (!(await fs.access(wikiPathResolved, fs.constants.R_OK).then(() => true).catch((e) => {if (!(e instanceof Error) || !('code' in e) || e.code !== 'ENOENT') throw e; return false}))) return null;

                    const res =  await dynamicImport().then(wikiModule => {
                        const isXExtendedByY = Object.prototype.isPrototypeOf.call.bind(Object.prototype.isPrototypeOf);
                        if (!isXExtendedByY(GitHubWiki, wikiModule.default)) throw new Error(`Invalid wiki module: ${wikiPath} (default export does not extend GitHubWiki)`);
                        return [toLowerCase(entry.name), wikiModule.default as GitHubWikiWithConcreteConstructor<typeof game>] as const;
                    });
                    return res;

                })
            )).filter((wiki): wiki is NonNullable<typeof wiki> => wiki !== null))
        )
    ] as const))) as {[TGame in PapyrusGame]: Map<Lowercase<string>, GitHubWikiWithConcreteConstructor<TGame>>};
