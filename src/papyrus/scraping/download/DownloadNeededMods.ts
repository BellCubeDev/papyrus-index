/* eslint-disable max-depth */
import { unpack as unpackWith7z } from "7zip-min";
import Ajv from 'ajv';
import { ReadStream, type Dirent } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { ReadableStream } from 'node:stream/web';
import url from 'node:url';
import unzip from 'unzip-stream';
import { parse as parseYaml } from 'yaml';
import { UnreachableError } from "../../../UnreachableError";
import { nexusModsREST60sMemo, nexusModsRESTRefetch } from "../../../nexus-api/RESTApi";
import { PapyrusGame } from "../../data-structures/pure/game";
import { PapyrusScriptSourceMetadata, PapyrusSourceType } from "../../data-structures/pure/scriptSource";
import { bsArch } from "./BSArch";
import { appendToStepSummarySection, StepSummarySection } from "../../../utils/stepSummary";
import { dataDir, getGameDir } from "../../../folders";

if (typeof window !== 'undefined') throw new Error('This module is not meant to be used in the browser!');

const thisFile = url.fileURLToPath(import.meta.url);
const thisDir = path.dirname(thisFile);
const tempDownloadDir = path.join(thisDir, 'tmp');
const createTempDownloadDirPromise = fs.mkdir(tempDownloadDir, {recursive: true});

const ajv = new Ajv({
    loadSchema(uri) {
        throw new Error(`Schema loading not implemented intentionally! URI: ${uri}`);
    },
});
const metadataSchemaPromise = fs.readFile(path.resolve(dataDir, 'SourceMetadata.schema.json'), 'utf8').then(raw => ajv.compileAsync<PapyrusScriptSourceMetadata<PapyrusGame>>(JSON.parse(raw)));

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

    const destinationFolder = path.join(folder, 'download');
    let downloadedFileId = null;
    try {
        await fs.access(destinationFolder, fs.constants.W_OK);
        downloadedFileId = parseInt(await fs.readFile(path.join(destinationFolder, '.nexusFileId'), 'utf8'), 10);
    } catch (err) {
        if (!(err instanceof Error) || !('code' in err) || err.code !== 'ENOENT') throw err;
        await fs.mkdir(destinationFolder, {recursive: true, });
        console.debug(`We know ${destinationFolder} should now exist...`);
    }

    const metadataRaw = await fs.readFile(metadataPath, 'utf8');
    const metadata = parseYaml(metadataRaw) as PapyrusScriptSourceMetadata<PapyrusGame>;
    const validate = await metadataSchemaPromise;
    let hasError = true;
    try {
        if (!validate(metadata)) throw new Error(`Metadata for ${folder} is invalid!`);
        hasError = false;
    } finally {
        if (hasError) await fs.rm(destinationFolder, {recursive: true});
    }

    const sourceType = metadata.type;
    switch (sourceType) {
        case PapyrusSourceType.Vanilla:
            throw new Error(`Vanilla source should not have a .download marker!`);
        case PapyrusSourceType.xSE:
        case PapyrusSourceType.xSePluginExtender:
        case PapyrusSourceType.PapyrusLib:
        case PapyrusSourceType.Standalone:
        case PapyrusSourceType.xSePluginIncidental: {
            if (!metadata.nexusPage) throw new Error(`Mod ${path.basename(folder)} is marked for download, but has no nexusPage specified in its meta.yaml file! Folder: ${folder}`);
            hasError = true;
            try {
                if (!metadata.nexusIndexedFileId) throw new Error(`Mod ${path.basename(folder)} is marked for download, but has no nexusIndexedFileId specified in its meta.yaml file! Folder: ${folder}`);
                if (metadata.nexusIndexedFileId === null) {
                    console.log(`Mod ${path.basename(folder)} has not been downloaded yet; starting download!`);
                } else {
                    if (metadata.nexusIndexedFileId === downloadedFileId) {
                        console.log(`Mod ${path.basename(folder)} is already up-to-date!`);
                        appendToStepSummarySection(`✅ Mod [${metadata.nameProper}](${metadata.nexusPage || metadata.preferredModPage}) was already up-to-date.`, StepSummarySection.DownloadedMods);
                        hasError = false;
                        return;
                    } else {
                        console.log(`Mod ${path.basename(folder)} is out of date; redownloading!`);
                        await fs.rm(destinationFolder, {recursive: true});
                        await fs.mkdir(destinationFolder, {recursive: true});
                    }
                }
                await definitelyDownloadMod(metadata.nexusPage, metadata.nexusIndexedFileId, destinationFolder);
                appendToStepSummarySection(`🔄 Mod [${metadata.nameProper}](${metadata.nexusPage || metadata.preferredModPage}) was downloaded/updated.`, StepSummarySection.DownloadedMods);
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
            return console.log(`Your Nexus Mods account is not premium. Cannot download mods automatically.
Please download the file at https://www.nexusmods.com/Core/Libs/Common/Widgets/DownloadPopUp?id=${fileId}&nmm=0&game_id=${(await nexusModsREST60sMemo.getGameInfo(gameDomain)).id} manually and place it in ${destinationFolder}
`);
        }

        const [firstDownloadLinkRaw] = await nexusModsRESTRefetch.getDownloadURLs(modId, fileId, undefined, undefined, gameDomain);
        if (!firstDownloadLinkRaw) throw new Error('No mod download link returned by Nexus mods\' API');
        const firstDownloadLink = new URL(firstDownloadLinkRaw.URI);

        const download = await fetch(firstDownloadLink);
        let hasDownloadError = false;
        try {
            if (!download.ok) throw new Error(`Mod download failed with status ${download.status}!`);
            if (!download.body) throw new Error('No body in mod download response!');

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
                    ReadStream.fromWeb(download.body as ReadableStream<Buffer>)
                        .pipe(unzip.Extract({ path: destinationFolder }))
                        .on('close', resolve)
                        .on('error', reject);
                });
            } else {
                const tmpFilePath = path.join(tempDownloadDir, tempFileName);
                let hasErrorWithTempDownloadFile = true;
                await createTempDownloadDirPromise;
                try {
                    console.log(`Downloading mod ${nexusLink} to ${tmpFilePath}...`);
                    const archiveFile = await fs.open(tmpFilePath, 'w+');
                    const archiveFileStream = archiveFile.createWriteStream();
                    console.log(`Created download stream for ${tempFileName}...`);
                    await new Promise<void>((resolve, reject) => {
                        ReadStream.fromWeb(download.body as ReadableStream<Buffer>).pipe(archiveFileStream)
                            .on('close', ()=> { archiveFileStream.close((err) => err ? reject(err) : resolve()) })
                            .on('error', reject);
                    });
                    console.log(`Extracting ${tempFileName} to ${destinationFolder}...`);
                    await new Promise<void>((resolve, reject) => unpackWith7z(tmpFilePath, destinationFolder, err => err ? reject(err) : resolve()));
                    cleanupPromise = fs.rm(tmpFilePath);
                    console.log(`Extracted ${tempFileName} to ${destinationFolder}`);
                    hasErrorWithTempDownloadFile = false;
                } finally {
                    if (hasErrorWithTempDownloadFile) {
                        console.error(`Error downloading mod ${nexusLink} to ${tmpFilePath}!`);
                        await Promise.all([
                            fs.readdir(destinationFolder, {recursive: true}).then(children=> children.length===0 ? fs.rm(destinationFolder) : Promise.resolve() ),
                            fs.rm(tmpFilePath),
                        ]);
                    }
                }
            }

            const extractedFiles = await fs.readdir(destinationFolder, {withFileTypes: true, recursive: true});
            const bsaFiles = extractedFiles.filter(file => file.isFile() && (file.name.endsWith('.bsa') || file.name.endsWith('.ba2')));
            await Promise.all(bsaFiles.map(bsaFile => bsArch.extractArchive(path.join(bsaFile.path, bsaFile.name), bsaFile.path)));
            await fs.writeFile(path.join(destinationFolder, '.nexusFileId'), fileId.toString(10), 'utf8');
            await cleanupPromise;
            hasError = false;
            hasDownloadError = false;
        } finally {
            if (hasDownloadError) console.error(`Response data for error in downloading mod ${nexusLink}:`, download);
        }
    } finally {
        if (hasError) {
            console.error(`Error downloading mod ${nexusLink}${startedDownload ? ' - removing extracted folder...' : ''}`);
            await fs.rm(destinationFolder, {recursive: true});
        } else {
            console.log(`Mod ${nexusLink} downloaded successfully!`);
        }
    }
}

console.log(`Downloading mods...`);

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
})).catch(err => {
    console.error('Error downloading mods:', err);
    process.exit(8311);
});

console.log(`Finished downloading mods!`);
