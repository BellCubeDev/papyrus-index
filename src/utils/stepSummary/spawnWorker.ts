import { isCI } from "next/dist/server/ci-info";
import path from "node:path";
import url from "node:url";
import Log from 'next/dist/build/output/log';
import { fork } from "node:child_process";

const thisFilePath = url.fileURLToPath(import.meta.url);
const fileExt = path.extname(thisFilePath);
const thisFolder = path.dirname(thisFilePath);


/** Spawns the worker and returns a function to close the worker once finished. */
export async function spawnStepSummaryWorker(): Promise<()=>void> {
    if (!isCI) {
        Log.trace("Not in CI; not spawning a step summary worker.");
        return () => {
            Log.trace("Not in CI; did not spawn a step summary worker to close.");
        };
    }

    Log.wait('Starting step summary worker...');

    const scriptPath = path.join(thisFolder, "worker.js");
    try {
        const res =  await new Promise<()=>void>((resolve, reject) => {
            console.log("[STEP SUMMARY MANAGER] Connecting to job summary worker...");
            const childProcess = fork(fileExt === '.js' ? scriptPath : path.join(thisFolder, `../dev-worker-resolver-for-tsx.mjs`), {
                detached: true,
                stdio: ["ignore", "inherit", "inherit", "ipc"],
                env: {
                    ...process.env,
                    BELLCUBE___IS_JOB_SUMMARY_WORKER: "true",
                    TSX_DEV_WORKER_SCRIPT_PATH: scriptPath,
                },
            });
            childProcess.on("error", (err) => {
                console.error("[STEP SUMMARY MANAGER] Error in worker process:", err);
                reject(err);
            });
            let didExitIntentionally = false;
            childProcess.once("message", (message) => {
                if (message === 'ready') {
                    console.log("[STEP SUMMARY MANAGER] Worker gave us the OK!");
                    childProcess.off("error", reject);
                    resolve(() => {
                        Log.trace("[STEP SUMMARY MANAGER] Sending signal to close worker...");
                        didExitIntentionally = true;
                        childProcess.send("close", (err) => {
                            if (err) {
                                Log.error("[STEP SUMMARY MANAGER] Failed to send close signal to worker. Killing\nError was:", err);
                                childProcess.kill();
                            }
                            Log.trace("[STEP SUMMARY MANAGER] Close signal sent to worker.");
                        });
                        Log.trace("[STEP SUMMARY MANAGER] Sent signal to close worker.");
                    });
                } else {
                    console.error("[STEP SUMMARY MANAGER] Unexpected message from worker:", message);
                }
            });
            childProcess.once('exit', (code, signal) => {
                if (didExitIntentionally) {
                    Log.event("[STEP SUMMARY MANAGER] Worker exited intentionally.");
                    return;
                }

                throw new Error(`Step summary worker exited unexpectedly with code ${code} and signal ${signal}.`);
            });
        });
        Log.event("Step summary worker started.");
        return res;
    } catch (e) {
        console.error("Failed to connect to worker:", e);
        throw e;
    }
}
