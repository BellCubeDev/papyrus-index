import { isCI } from "next/dist/server/ci-info";
import path from "node:path";
import url from "node:url";
import Log from 'next/dist/build/output/log';

const thisFilePath = url.fileURLToPath(import.meta.url);
const fileExt = path.extname(thisFilePath);
const thisFolder = path.dirname(thisFilePath);
export const socketPath = path.join(thisFolder, "jobSummarySocket.sock");


/** Spawns the worker and returns a function to close the worker once finished. */
export async function spawnStepSummaryWorker(): Promise<()=>void> {
    if (!isCI) {
        Log.trace("Not in CI; not spawning a step summary worker.");
        return () => {
            Log.trace("Not in CI; did not spawn a step summary worker to close.");
        };
    }

    Log.wait('Starting step summary worker...');

    //const WorkerThreads = await import("node:worker_threads");;
    const ChildProcess = await import("node:child_process");;
    const scriptPath = path.join(thisFolder, "worker.js");
    try {
        const res =  await new Promise<()=>void>((resolve, reject) => {
            console.log("[STEP SUMMARY THREAD] Connecting to job summary worker...");
            const childProcess = ChildProcess.fork(fileExt === '.js' ? scriptPath : path.join(thisFolder, `../dev-worker-resolver-for-tsx.mjs`), {
                detached: true,
                stdio: ["ignore", "inherit", "inherit", "ipc"],
                env: {
                    ...process.env,
                    BELLCUBE___IS_JOB_SUMMARY_WORKER: "true",
                    TSX_DEV_WORKER_SCRIPT_PATH: scriptPath,
                },
            });
            childProcess.on("error", reject);
            childProcess.once("message", (message) => {
                if (message === 'ready') {
                    console.log("[STEP SUMMARY THREAD] Worker gave us the OK!");
                    childProcess.off("error", reject);
                    resolve(() => {
                        Log.trace("[STEP SUMMARY THREAD] Sending signal to close worker...");
                        childProcess.kill("SIGINT");
                        Log.trace("[STEP SUMMARY THREAD] Sent signal to close worker.");
                    });
                } else {
                    console.error("[STEP SUMMARY THREAD] Unexpected message from worker:", message);
                }
            });
        });
        Log.event("Step summary worker started.");
        return res;
    } catch (e) {
        console.error("Failed to connect to worker:", e);
        throw e;
    }
}
