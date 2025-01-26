import fs from 'node:fs/promises';
import { ReadStream } from 'node:fs';
import url from 'node:url';
import path from 'node:path';
import { nexusModsREST60sMemo, nexusModsRESTRefetch } from '../../../nexus-api/RESTApi';
import unzip from 'unzip-stream';
import type { ReadableStream } from 'node:stream/web';
import { spawn } from 'node:child_process';
import os from 'node:os';

const thisFilePath = url.fileURLToPath(import.meta.url);
const thisDirPath = path.dirname(thisFilePath);
const bsArchEXEPath = path.resolve(thisDirPath, 'BSArch.exe');

/** Class to handle interacting with the command-line tool BSArch */
class BSArch {
    private static instance: BSArch;

    private bsArchReadyPromise: Promise<void> | null = null;

    private constructor() {
        this.bsArchReadyPromise = this.prepareBSArch();
    }

    public static getInstance(): BSArch {
        if (!BSArch.instance) BSArch.instance = new BSArch();
        return BSArch.instance;
    }

    public async extractArchive(archivePath: string, outputPath: string): Promise<void> {
        await this.bsArchReady();

        await fs.mkdir(outputPath, { recursive: true });

        await new Promise<void>((resolve, reject) => {
            let execString = `"${bsArchEXEPath}" unpack "${archivePath}" "${outputPath}" -mt`;
            if (os.platform() !== 'win32') execString = `wine ${execString}`;
            const child = spawn(execString, { shell: true, stdio: 'inherit' });
            child.once('exit', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`BSArch exited with code ${code}`));
            });
        });
    }

    // eslint-disable-next-line class-methods-use-this
    private async prepareBSArch(): Promise<void> {
        try {
            await fs.access(bsArchEXEPath);
            return;
        } catch(err) {
            if (!(err instanceof Error) || !('code' in err) || err.code !== 'ENOENT') throw err;
            console.log('BSArch not found, downloading...');
        }

        if (!(await nexusModsREST60sMemo.getValidationResult()).is_premium) {
            console.log(`Your Nexus Mods account is not premium. Cannot download BSArch automatically.

Please download BSArch manually and place the EXE at ${bsArchEXEPath}.
https://www.nexusmods.com/newvegas/mods/64745?tab=files
// `);
            process.exit(1);
        }

        let didWork = false;
        try {
            nexusModsRESTRefetch.setGame('newvegas');
            const [firstDownloadLink] = await nexusModsRESTRefetch.getDownloadURLs(64745, 1000097654);
            if (!firstDownloadLink) throw new Error('No BSArch download link returned by Nexus mods\' API');

            const download = await fetch(firstDownloadLink.URI);

            if (!download.ok) throw new Error(`BSArch download failed with status ${download.status}`);
            if (!download.body) throw new Error('No body in BSArch download response');

            await new Promise<void>((resolve, reject) => {
                ReadStream.fromWeb(download.body as ReadableStream<any>)
                    .pipe(unzip.Extract({ path: thisDirPath }))
                    .on('close', resolve)
                    .on('error', reject);
            });

            await fs.access(bsArchEXEPath);
            didWork = true;
        } finally {
            if (!didWork) {
                console.error(`

========================================


BSArch download and extraction failed. Please download BSArch manually and place the EXE at ${bsArchEXEPath}.
https://www.nexusmods.com/newvegas/mods/64745?tab=files


========================================


`);
            }
        }
    }

    public bsArchReady(this: BSArch): Promise<void> {
        this.bsArchReadyPromise ??= this.prepareBSArch();

        return this.bsArchReadyPromise;
    }

}

export const bsArch = BSArch.getInstance();
