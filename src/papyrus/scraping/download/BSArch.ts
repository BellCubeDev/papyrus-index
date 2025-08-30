import fs from 'node:fs/promises';
import { ReadStream } from 'node:fs';
import url from 'node:url';
import path from 'node:path';
import { nexusModsREST60sMemo, nexusModsRESTRefetch } from '../../../nexus-api/RESTApi';
import unzip from 'unzip-stream';
import type { ReadableStream } from 'node:stream/web';
import { exec, spawn } from 'node:child_process';
import os from 'node:os';

const thisFilePath = url.fileURLToPath(import.meta.url);
const thisDirPath = path.dirname(thisFilePath);
const bsArchEXEPath = path.resolve(thisDirPath, 'BSArch.exe');

// The Wine installation script in the INSTALL_WINE_SCRIPT_PATH environment variable
// will run every time this module is used and BSArch is needed.
// It is meant for use in CI environments.
const wineReadyPromise = Object.assign(Promise.withResolvers<void>(), {
    needsToStartInstall: false,
});


if (os.platform() !== 'win32') {
    const WineNoInstalledError = new Error('Wine is not installed or not accessible.');
    try {
        await new Promise<void>((resolve, reject) => {
            const child = spawn('wine --version', { shell: true });
            child.once('exit', (code) => {
                if (code === 0) resolve();
                else reject(WineNoInstalledError);
            });
            child.once('error', reject);
        });
        console.log('Wine is installed and accessible. If BSArch needs to be run, it will run under Wine, and should work without issue.');
        wineReadyPromise.resolve();
        wineReadyPromise.needsToStartInstall = false;
    } catch (e) {
        wineReadyPromise.needsToStartInstall = true;

        if (e === WineNoInstalledError) console.log('Wine is not installed. If BSArch needs to be run, it will need to be installed. If this is a CI environment, Wine may be installed automatically by this script, depending on the CI configuration.');
        else console.error('Encountered an error while checking for Wine installation:', e);

        const rawResolve = wineReadyPromise.resolve;
        wineReadyPromise.resolve = () => {
            console.log('Wine installation completed successfully.');
            return rawResolve();
        };

        const rawReject = wineReadyPromise.reject;
        wineReadyPromise.reject = (err) => {
            console.error('Wine installation failed:', err);
            return rawReject(err);
        };
    }
}

async function ensureWineInstalled() {
    if (os.platform() === 'win32') return console.warn('Wine is not needed on Windows, but ensureWineInstalled() was called. This is likely a bug in the code.');
    if (!wineReadyPromise.needsToStartInstall) {
        console.log('Wine has been flagged as either installed or currently being installed. Waiting for the completion signal...');
        return await wineReadyPromise.promise;
    }

    console.log('Wine is not installed. Attempting to install...');

    if (!process.env.INSTALL_WINE_SCRIPT_PATH) throw new Error('INSTALL_WINE_SCRIPT_PATH environment variable is not set (i.e. this is not a CI workflow). Wine must be installed manually.');
    wineReadyPromise.needsToStartInstall = false;

    console.log('INSTALL_WINE_SCRIPT_PATH:', process.env.INSTALL_WINE_SCRIPT_PATH);
    console.log('Ensuring INSTALL_WINE_SCRIPT_PATH is executable...');

    const stats = await fs.stat(process.env.INSTALL_WINE_SCRIPT_PATH);
    // eslint-disable-next-line no-bitwise
    if (!(stats.mode & 0o100)) await fs.chmod(process.env.INSTALL_WINE_SCRIPT_PATH, stats.mode | 0o100);

    console.log('INSTALL_WINE_SCRIPT_PATH is executable. Running installation script...');

    let hasErrorSpawning = true;
    try {
        const scriptProcess = exec(`sudo ${process.env.INSTALL_WINE_SCRIPT_PATH!}`, (err, _stdout, _stderr) => {
            if (err) {
                console.error('Wine installation failed:', err);
                wineReadyPromise.reject(err);
            }
            if (scriptProcess.exitCode !== 0) {
                console.error('Wine installation failed with exit code:', scriptProcess.exitCode, scriptProcess);
                wineReadyPromise.reject(new Error(`Wine installation failed with exit code ${scriptProcess.exitCode}`));
            }

            console.log('Wine installation completed successfully.');
            wineReadyPromise.resolve();
        });

        scriptProcess.stdout?.pipe(process.stdout);
        scriptProcess.stderr?.pipe(process.stderr);

        scriptProcess.once('error', (err) => {
            console.error('Wine installation failed:', err);
            wineReadyPromise.reject(err);
        });

        scriptProcess.once('spawn', () => {
            console.log('Wine installation script spawned successfully. Waiting for completion...');
            hasErrorSpawning = false;
        });

        console.log('Wine installation script spawning queued successfully. Waiting for completion...');
        hasErrorSpawning = false;
    } finally {
        if (hasErrorSpawning) console.error('Wine installation failed: Could not spawn process. Please check the INSTALL_WINE_SCRIPT_PATH environment variable and make sure it points to a valid script and that there are no strange errors elsewhere in the log.');
    }

    await wineReadyPromise.promise;
}

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

        console.log(`Queueing BSArch to extract archive ${archivePath} to ${outputPath}`);
        await this.bsArchReady();
        console.log(`Extracting archive ${archivePath} to ${outputPath}`);

        await fs.mkdir(outputPath, { recursive: true });

        let execString = `"${bsArchEXEPath}" unpack "${archivePath}" "${outputPath}" -mt`;
        if (os.platform() !== 'win32') {
            console.log('BSarch will be run under Wine.');
            await ensureWineInstalled();
            console.log('Wine is installed and accessible. Running BSArch under Wine...');
            execString = `wine ${execString}`;
        }
        let hasError = true;
        try {
            await new Promise<void>((resolve, reject) => {
                const child = spawn(execString, { shell: true, stdio: 'inherit' });
                child.once('exit', (code) => {
                    if (code === 0) resolve();
                    else reject(new Error(`BSArch exited with code ${code}`));
                });
            });
            hasError = false;
        } finally {
            if (hasError) {
                console.error(`BSArch extraction failed. Please check the output for more information.`);
                console.log(`If you are using Wine, please make sure it is installed and accessible.`);
            } else {
                console.log(`BSArch extraction completed successfully.`);
            }
        }
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
                ReadStream.fromWeb(download.body as ReadableStream<Buffer>)
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
