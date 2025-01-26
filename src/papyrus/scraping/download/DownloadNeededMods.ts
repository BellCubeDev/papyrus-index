import { PapyrusGame } from "../../data-structures/pure/game";
import { PapyrusScriptSourceMetadata, PapyrusSourceType } from "../../data-structures/pure/scriptSource";
import url from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import { parse as parseYaml } from 'yaml';
import Ajv from 'ajv';
import { UnreachableError } from "../../../UnreachableError";
import { nexusModsREST60sMemo, nexusModsRESTRefetch } from "../../../nexus-api/RESTApi";
import { createWriteStream, ReadStream, type Dirent } from 'node:fs';
import type { ReadableStream } from 'node:stream/web';
import unzip from 'unzip-stream';
import { bsArch } from "./BSArch";
import { unpack as unpackWith7z } from "7zip-min";

if (typeof window !== 'undefined') throw new Error('This module is not meant to be used in the browser!');

const thisFile = url.fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);
const tempDownloadDir = path.join(thisDir, 'tmp');

const papyrusDir = path.join(thisDir, '../../');
if (path.basename(papyrusDir) !== 'papyrus') throw new Error('Expected papyrusDir to be the `papyrus` directory, but got a different name!');

const scriptsDir = path.join(papyrusDir, 'scripts');
function getGameDir(game: PapyrusGame) {
    return path.join(scriptsDir, game);
}

const ajv = new Ajv({
    loadSchema(uri) {
        throw new Error(`Schema loading not implemented intentionally! URI: ${uri}`);
    },
});
const metadataSchemaPromise = fs.readFile(path.resolve(scriptsDir, 'SourceMetadata.schema.json'), 'utf8').then(raw => ajv.compileAsync<PapyrusScriptSourceMetadata<PapyrusGame>>(JSON.parse(raw)));

async function maybeDownloadMod(folder: string) {
    const downloadMarkerPath = path.join(folder, '.download');
    const metadataPath = path.join(folder, 'meta.yaml');

    try {
        await fs.access(downloadMarkerPath);
        await fs.access(metadataPath, fs.constants.R_OK);
    } catch (err) {
        if (!(err instanceof Error) || !('code' in err) || err.code !== 'ENOENT') throw err;
        return; // no marker, no meta; no download
    }

    const downloadFolder = path.join(folder, 'download');
    try {
        await fs.access(downloadFolder, fs.constants.W_OK);
        return; // already downloaded
    } catch (err) {
        if (!(err instanceof Error) || !('code' in err) || err.code !== 'ENOENT') throw err;
        await fs.mkdir(downloadFolder, {recursive: true, });
        console.debug(`We know ${downloadFolder} should now exist...`);
    }

    const metadataRaw = await fs.readFile(metadataPath, 'utf8');
    const metadata = parseYaml(metadataRaw) as PapyrusScriptSourceMetadata<PapyrusGame>;
    const validate = await metadataSchemaPromise;
    let hasError = true;
    try {
        if (!validate(metadata)) throw new Error(`Metadata for ${folder} is invalid!`);
        hasError = false;
    } finally {
        if (hasError) await fs.rmdir(downloadFolder, {recursive: false});
    }

    const sourceType = metadata.type;
    switch (sourceType) {
        case PapyrusSourceType.Vanilla:
            throw new Error(`Vanilla source should not have a download marker!`);
        case PapyrusSourceType.xSE:
        case PapyrusSourceType.xSePluginExtender:
        case PapyrusSourceType.PapyrusLib:
        case PapyrusSourceType.Standalone:
        case PapyrusSourceType.xSePluginIncidental: {
            if (!metadata.nexusPage) throw new Error(`Mod ${path.basename(folder)} is marked for download, but has no nexusPage specified in its meta.yaml file! Folder: ${folder}`);
            hasError = true;
            try {
                if (!metadata.nexusIndexedFileId) throw new Error(`Mod ${path.basename(folder)} is marked for download, but has no nexusIndexedFileId specified in its meta.yaml file! Folder: ${folder}`);
                await definitelyDownloadMod(metadata.nexusPage, metadata.nexusIndexedFileId, downloadFolder);
                hasError = false;
            } finally {
                if (hasError) console.error(`Error downloading mod ${path.basename(folder)}!`);
            }
            break;
        }
        default:
            throw new UnreachableError(sourceType, `Unknown source type for mod ${path.basename(folder)}! Folder: ${folder}`);
    }
}

async function definitelyDownloadMod(nexusLink: string, fileId: number, destinationFolder: string) {
    let hasError = true;
    let startedDownload = false;
    try {
        const [,gameDomain,modIdRaw] = nexusLink.match(/https:\/\/(?:www\.)?nexusmods\.com\/(?<gameDomain>[^/]+)\/mods\/(?<modId>\d+)/u) ?? [];
        if (!gameDomain || !modIdRaw) throw new Error(`Invalid nexusLink: ${nexusLink}`);
        const modId = parseInt(modIdRaw, 10);
        if (Number.isNaN(modId)) throw new Error(`Invalid modId "${modIdRaw}" in nexusLink: ${nexusLink}`);

        if (!(await nexusModsREST60sMemo.getValidationResult()).is_premium) {
            console.log(`Your Nexus Mods account is not premium. Cannot download mods automatically.
Please download the file at https://www.nexusmods.com/Core/Libs/Common/Widgets/DownloadPopUp?id=${fileId}&nmm=0&game_id=${(await nexusModsREST60sMemo.getGameInfo(gameDomain)).id} manually and place it in ${destinationFolder}
`);
            return;
        }

        const [firstDownloadLinkRaw] = await nexusModsRESTRefetch.getDownloadURLs(modId, fileId, undefined, undefined, gameDomain);
        if (!firstDownloadLinkRaw) throw new Error('No BSArch download link returned by Nexus mods\' API');
        const firstDownloadLink = new URL(firstDownloadLinkRaw.URI);

        const download = await fetch(firstDownloadLink);

        if (!download.ok) throw new Error(`BSArch download failed with status ${download.status}`);
        if (!download.body) throw new Error('No body in BSArch download response');

        const tempFileName = path.basename(decodeURI(firstDownloadLink.pathname));

        startedDownload = true;
        // TODO: Will need to handle the case where the download is a 7z or a rar file

        // Use a direct stream from request to extraction if possible.
        // If not, write the archive to file and then use the ol' reliable 7z binaries to extract.
        //
        // Would be nice if there were a way to stream the archive to 7z directly,
        // but I don't see an easy way to do that outside of (maybe) STDIN.
        // Still, this method is clean and works well. Even if it's a little more IO-heavy than I'd like.
        let cleanupPromise: Promise<void> | undefined;
        if (download.headers.get('Content-Type') === 'application/zip') {
            await new Promise<void>((resolve, reject) => {
                ReadStream.fromWeb(download.body as ReadableStream<any>)
                    .pipe(unzip.Extract({ path: destinationFolder }))
                    .on('close', resolve)
                    .on('error', reject);
            });
        } else {
            const archiveFile = createWriteStream(path.join(tempDownloadDir, tempFileName));
            await new Promise<void>((resolve, reject) => {
                ReadStream.fromWeb(download.body as ReadableStream<any>).pipe(archiveFile)
                    .on('close', resolve)
                    .on('error', reject);
            });
            await new Promise<void>((resolve, reject) => unpackWith7z(path.join(tempDownloadDir, tempFileName), destinationFolder, err => err ? reject(err) : resolve()));
            cleanupPromise = fs.rm(path.join(tempDownloadDir, tempFileName), {recursive: true});
        }

        const extractedFiles = await fs.readdir(destinationFolder, {withFileTypes: true, recursive: true});
        const bsaFiles = extractedFiles.filter(file => file.isFile() && (file.name.endsWith('.bsa') || file.name.endsWith('.ba2')));
        await Promise.all(bsaFiles.map(bsaFile => bsArch.extractArchive(path.join(bsaFile.path, bsaFile.name), bsaFile.path)));
        await cleanupPromise;
        hasError = false;
    } finally {
        if (hasError) {
            console.error(`Error downloading mod ${nexusLink}!${startedDownload ? 'Removing download folder...' : ''}`);
            await fs.rm(destinationFolder, {recursive: true});
        }
    }
}

await Promise.all(Object.values(PapyrusGame).map(async game => {
    const gameDir = getGameDir(game);
    let gameFolders: Dirent[];
    try {
        gameFolders = (await fs.readdir(gameDir, {withFileTypes: true})).filter(dirent => dirent.isDirectory());
    } catch (err) {
        if (!(err instanceof Error) || !('code' in err) || err.code !== 'ENOENT') throw err;
        return;
    }

    await Promise.all(gameFolders.map(gameFolder => maybeDownloadMod(path.join(gameFolder.path, gameFolder.name))));
}));
