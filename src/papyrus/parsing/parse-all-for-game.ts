import { PapyrusGame } from "../data-structures/pure/game";
import type { PapyrusScriptSource, PapyrusScriptSourceMetadata } from "../data-structures/pure/scriptSource";
import url from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import Ajv from 'ajv';
import { parseScriptAsync } from "./parse-script-worker-manager";
import type { PapyrusScript } from "../data-structures/pure/script";
import { PapyrusParserError } from "./PapyrusParserError";
import type { IgnoreYaml } from "../data-structures/ignore-yaml";
import { toLowerCase } from "../../utils/toLowerCase";

const thisFile = url.fileURLToPath(import.meta.url);

const thisDir = path.dirname(thisFile);

const papyrusDir = path.join(thisDir, '../');
if (path.basename(papyrusDir) !== 'papyrus') throw new Error('Expected papyrusDir to be the `papyrus` directory, but got a different name!');

const srcDir = path.join(papyrusDir, '../');
if (path.basename(srcDir) !== 'src') throw new Error('Expected srcDir to be the `src` directory, but got a different name!');

const scriptsDir = path.join(srcDir, '../data');
function getGameDir(game: PapyrusGame) {
    return path.join(scriptsDir, game);
}

const ajv = new Ajv({
    loadSchema(uri) {
        throw new Error(`Schema loading not implemented intentionally! URI: ${uri}`);
    },
});
const metadataSchemaPromise = fs.readFile(path.resolve(scriptsDir, 'SourceMetadata.schema.json'), 'utf8').then(raw => ajv.compileAsync<PapyrusScriptSourceMetadata<PapyrusGame>>(JSON.parse(raw)));
const ignoreYamlSchemaPromise = fs.readFile(path.resolve(scriptsDir, 'IgnoreYaml.schema.json'), 'utf8').then(raw => ajv.compileAsync<IgnoreYaml>(JSON.parse(raw)));

if (typeof window !== 'undefined') throw new Error('This module is not meant to be used in the browser!');

export interface PapyrusScriptDiscoveredDocument {
    /** The source code of the script */
    sourceCode: string;
    /** The absolute file path to the script */
    absolutePath: string;
}
export interface PapyrusScriptDiscoveredSources<TGame extends PapyrusGame> {
    /** Identifier (folder name) for the source of this script (e.g. `po3` or `vanilla`) */
    sourceIdentifier: Lowercase<string>;
    /** Metadata for this source (from meta.yaml) */
    sourceMetadata: PapyrusScriptSourceMetadata<TGame>;
    /** Script documents in this source */
    scripts: PapyrusScriptDiscoveredDocument[];
}

async function getScriptIgnoresForGame(gameDir: string): Promise<Set<Lowercase<string>>|null> {
    try {
        const ignoreYaml = await fs.readFile(path.join(gameDir, 'ignore.yaml'), 'utf8');
        const parsed = parseYaml(ignoreYaml, {
            schema: 'core',
        });
        const schema = await ignoreYamlSchemaPromise;
        if (!schema(parsed)) throw new Error(`Ignore YAML for game ${gameDir} does not match schema!\n\nErrors:\n${ajv.errorsText(schema.errors)}`);
        return new Set(parsed.ignoreScripts.map(toLowerCase));
    } catch (err) {
        if (!(err instanceof Error) || !('code' in err) || err.code !== 'ENOENT') throw err;
        return null;
    }
}

async function isScriptIgnored(ignoreScriptsPromise: Promise<Set<Lowercase<string>>|null>, scriptFilename: string): Promise<boolean> {
    const ignoreScripts = await ignoreScriptsPromise;
    if (ignoreScripts === null) return false;
    return ignoreScripts.has(toLowerCase(scriptFilename));
}

export async function parseAllScriptsForGame<TGame extends PapyrusGame>(game: TGame): Promise<PapyrusScriptSource<typeof game>[]> {
    const gameDir = getGameDir(game);

    console.log(`Parsing scripts for game ${game}...`);

    try {
        await fs.access(gameDir);
    } catch (err) {
        if (!(err instanceof Error)) throw err;
        if ('code' in err && err.code === 'ENOENT') {
            console.log(`Tried to parse scripts for game ${game}, but the directory does not exist!`);
            return [];
        }
        throw err;
    }

    const ignoreScriptsPromise = getScriptIgnoresForGame(gameDir);

    const sourceIdentifiers = (await fs.readdir(gameDir, {withFileTypes: true})).filter(dirent => dirent.isDirectory());

    console.log(`Found ${sourceIdentifiers.length} sources for game ${game}`);

    const res =  (await Promise.all(sourceIdentifiers.map(async sourceIdentifier => {
        const sourceDir = path.join(gameDir, sourceIdentifier.name);
        const metaPromise = fs.readFile(path.join(sourceDir, 'meta.yaml'), 'utf8').then(async yaml => {
            const parsed = parseYaml(yaml, {
                schema: 'core',
            });
            const schema = await metadataSchemaPromise;
            if (!schema(parsed)) throw new Error(`Metadata for source ${sourceIdentifier.name} does not match schema!\nFile: ${sourceDir}/meta.yaml\n\nErrors:\n${ajv.errorsText(schema.errors)}`);
            return parsed;
        }).catch(err => {
            if (err.code === 'ENOENT') return null;
            throw err;
        });
        const [sourceMetadata, scripts] = await Promise.all([
            metaPromise,

            // Parse all .psc files in the source directory recursively (since we download mods and extract them with their original file structures)
            fs.readdir(sourceDir, {withFileTypes: true, recursive: true}).then(dirents => Promise.all(dirents.filter(dirent => dirent.isFile() && dirent.name.endsWith('.psc')).map(async (dirent): Promise<[Lowercase<string>, PapyrusScript<typeof game>]> => {
                    if (await isScriptIgnored(ignoreScriptsPromise, dirent.name)) throw new Error(`Script ${dirent.name} is ignored for game ${game}.`);
                    const absolutePath = path.resolve(path.join(dirent.path, dirent.name));
                    const sourceCode = (await fs.readFile(absolutePath, 'utf8')).replace(/\r\n?/gu, '\n');
                    const parsed = await parseScriptAsync(game, {sourceCode, absolutePath}, metaPromise);
                    return [toLowerCase(parsed.name), parsed];
                }).map(p => p.catch(err => err instanceof PapyrusParserError ? Promise.reject(err) : null)) // TODO: This catch is dangerous and can miss genuine IO errors!
            )).then(async (entriesUnfiltered) => {
                const entries = entriesUnfiltered.filter((x): x is Exclude<typeof x, null> => x !== null);
                const meta = await metaPromise;
                if (!meta) return {};
                if (meta.allowedScripts === undefined) return Object.fromEntries(entries);
                const allowedScriptsLowercase = new Set(meta.allowedScripts.map(toLowerCase));
                return Object.fromEntries(entries.filter(([nameLowercase]) => allowedScriptsLowercase.has(nameLowercase)));
            })
        ]);
        if (sourceMetadata === null) return null;
        return {
            ...sourceMetadata,
            sourceIdentifier: toLowerCase(sourceIdentifier.name),
            scripts
        };
    }))).filter((x): x is Exclude<typeof x, null> => x !== null);

    console.log(`Parsed scripts for game ${game}!`);
    return res;
}
