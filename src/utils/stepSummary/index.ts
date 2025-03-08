import { isCI } from "next/dist/server/ci-info";
import net from "node:net";
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

let clientPromise: Promise<net.Socket> | null = null;
const thisFilePath = url.fileURLToPath(import.meta.url);
const fileExt = path.extname(thisFilePath);
const thisFolder = path.dirname(thisFilePath);
export const socketPath = path.join(thisFolder, "jobSummarySocket.sock");

export enum JobSummaryWorkerMessageType {
    AppendToSection,
}

export enum JobSummarySection {
    /** Section for warnings about the MediaWiki data's formatting (e.g. there's a misnamed function parameter) */
    MediaWikiFormattingWarnings,

    /** Section for listing which mods were downloaded */
    DownloadedMods,
}

if (isCI) {
    //const workerThreads = await import("node:worker_threads");
    if (!process.env.BELLCUBE___IS_JOB_SUMMARY_WORKER) {
        let fileExists = false;
        try {
            await fs.stat(socketPath);
            fileExists = true;
        } catch (e) {
            if (!(e instanceof Error)) throw e;
            if (!('code' in e)) throw e;
            if (e.code !== "ENOENT") throw e;
        }

        if (fileExists) {
            clientPromise = Promise.resolve(net.createConnection(socketPath));
        } else {
            //const WorkerThreads = await import("node:worker_threads");;
            const ChildProcess = await import("node:child_process");;
            const scriptPath = path.join(thisFolder, "worker.js");
            clientPromise = new Promise<net.Socket>((resolve, reject) => {
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
                childProcess.unref();
                childProcess.on("error", reject);
                childProcess.once("message", (message) => {
                    if (message === 'ready') {
                        console.log("[STEP SUMMARY THREAD] Worker gave us the OK!");
                        childProcess.off("error", reject);
                        resolve(net.createConnection(socketPath));
                    } else {
                        console.error("[STEP SUMMARY THREAD] Unexpected message from worker:", message);
                    }
                });
            }).catch((e) => {
                console.error("Failed to connect to worker:", e);
                throw e;
            });
        }

        clientPromise.then(c=>c.unref());
    }
}

export async function appendToJobSummarySection(message: string) {
    if (clientPromise === null) return

    console.log("::debug::[STEP SUMMARY THREAD] Queueing a message to send to job summary worker.");
    (await clientPromise).write(JSON.stringify({ type: JobSummaryWorkerMessageType.AppendToSection, message }));
    console.log("::debug::[STEP SUMMARY THREAD] Sent a message to job summary worker.");
}
