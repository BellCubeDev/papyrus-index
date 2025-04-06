import { exec } from "node:child_process";
import path from "node:path";
import url from "node:url";
import nextConfig from "../../next.config";
import * as Log from 'next/dist/build/output/log';

const thisFilePath = url.fileURLToPath(import.meta.url);
const thisFolder = path.dirname(thisFilePath);
const srcDir = path.resolve(thisFolder, "..");
if (!srcDir.endsWith(`${path.sep}src`)) throw new Error(`Expected srcDir to end with ${path.sep}src, but got ${srcDir}`);
const parsoidFolder = path.resolve(srcDir, "..", "node_modules", "parsoid-service");

let lastParsoidDelayPromise = Promise.resolve(null as string | null);

/** You probably did not mean to call this.
 *
 * This is as low-level as it gets when it comes to fetching a page from the wiki, as far
 * as our code is concerned. This function spawns an instance of the Parsoid PHP service.
 *
 * Parsoid then builds the page's HTML using data from the wiki's API and returns
 * its results in the form of an STDOUT string.
 */
export async function parsoidGetPageHTML(wikiURL: string, pageTitle: string): Promise<string|null> {
    lastParsoidDelayPromise = lastParsoidDelayPromise.then(()=>new Promise(resolve => setTimeout(resolve, 35 * (process.env.NODE_ENV === 'development' ? 1 : nextConfig.experimental.cpus))));
    await lastParsoidDelayPromise;
    let gotPage = false;
    let hasError = false;
    try {
        return await new Promise((resolve_, reject_) => {

            let childProcess: ReturnType<typeof exec> | null = null;
            const resolve = (value: Awaitable<string|null>) => {
                try {
                    gotPage = value !== null;
                    resolve_(value);
                } finally {
                    if (childProcess) {
                        childProcess.kill();
                        childProcess = null;
                    }
                }
            };
            const reject = (reason: Error) => {
                try {
                    hasError = true;
                    reject_(reason);
                } finally {
                    if (childProcess) {
                        childProcess.kill();
                        childProcess = null;
                    }
                }
            };

            let stdout = '';
            let stderr = '';

            function hasProblematicOutput() {
                return [stdout, stderr].some((data) =>
                    data.includes('parse.php: The specified revision does not exist.')
                    || data.includes('ApiHelper.php: HTTP request failed: HTTP code 5')
                );
            }

            function finalize(code?: number|null) {
                setTimeout(() => {
                    if ([stdout, stderr].some((data) => data.includes('parse.php: The specified revision does not exist.'))) {
                        //Log.trace(`[95mparsoidGetPageHTML[0m() child child process got a 404 error while querying "${wikiURL}" for "${pageTitle}".`);
                        return resolve(null);
                    }

                    if ([stdout, stderr].some((data) => data.includes('ApiHelper.php: HTTP request failed: HTTP code 5'))) {
                        Log.warn(`[95mparsoidGetPageHTML[0m() child child process got HTTP error 5xx while querying "${wikiURL}" for "${pageTitle}". Retrying in 10s...`);
                        return resolve(new Promise(r => setTimeout(r, 10_000)).then(()=>parsoidGetPageHTML(wikiURL, pageTitle)));
                    }

                    if (!stderr) {
                        if (typeof code === 'number' && code !== 0) Log.error(`[95mparsoidGetPageHTML[0m() child process exited with code ${code}`);
                        else return resolve(stdout);
                    }

                    Log.trace({
                        stdout,
                        stderr,
                        code,
                    });

                    return reject(stderr ? new Error(stderr) : new Error(`[95mparsoidGetPageHTML[0m() child process exited with code ${code}`));
                }, 50);
            }

            Log.wait(`[95mparsoidGetPageHTML[0m() called for page "${pageTitle}" on wiki "${wikiURL}"`);
            childProcess = exec(`php bin/parse.php --wt2html "--apiURL=${new URL('/w/api.php', wikiURL)}" "--domain=${new URL(wikiURL).hostname}" "--pageName=${pageTitle}"`, {
                cwd: parsoidFolder,
                timeout: 3 * 60 * 1000,
            }, (error, latestStdout, latestStderr) => {
                if (latestStdout) stdout = latestStdout;
                if (latestStderr) stderr = latestStderr;

                if (error) {
                    if (!hasProblematicOutput())
                    Log.error(`[95mparsoidGetPageHTML[0m() child process error:`, error);
                    finalize(error.code);
                } else {
                    finalize();
                }
            });

            childProcess.stdout!.on('data', (data) => {
                //console.log(`[95mparsoidGetPageHTML[0m() child process stdout: ${data}`);
                stdout += data;
                if (hasProblematicOutput()) finalize();
            });
            childProcess.stderr!.on('data', (data) => {
                //console.error(`[95mparsoidGetPageHTML[0m() child process stderr: ${data}`);
                stderr += data;
                if (hasProblematicOutput()) finalize();
            });
            childProcess.on('close', (code) => {
                finalize(code);
            });
            childProcess.on('error', (error) => {
                Log.error(`[95mparsoidGetPageHTML[0m() child process error: ${error}`);
                reject(error);
            });
            childProcess.on('disconnect', () => {
                //Log.trace(`[95mparsoidGetPageHTML[0m() child process disconnected`);
                finalize();
            });
            childProcess.on('exit', (code) => {
                finalize(code);
            });
            childProcess.on('message', (message) => {
                Log.trace(`[95mparsoidGetPageHTML[0m() child process message: ${message}`);
            });
            childProcess.on('spawn', () => {
                //Log.trace(`[95mparsoidGetPageHTML[0m() child process spawned`);
            });
            //Log.trace(`[95mparsoidGetPageHTML[0m() child process spawned with PID ${childProcess.pid ?? '  [ERROR]  '}`);
            childProcess.stdin!.end();

            setTimeout(() => {
                if (!childProcess?.killed) {
                    Log.warn(`[95mparsoidGetPageHTML[0m() child process timed out after 3 minutes!`);
                    Log.trace({
                        stdout,
                        stderr,
                    });
                    finalize();
                }
            }, 3 * 60 * 1000).unref();
    });
    } finally {
        Log.event(`[95mparsoidGetPageHTML[0m() finished for page "${pageTitle}" on wiki "${wikiURL}" with ${hasError ? 'error' : gotPage ? 'success' : 'no matching page'}.`);
    }
}
