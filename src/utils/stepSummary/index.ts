import { isCI } from "next/dist/server/ci-info";
import net from "node:net";
import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

let client: net.Socket | null = null;
const thisFilePath = url.fileURLToPath(import.meta.url);
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


if (isCI && !process.env.BELLCUBE___IS_JOB_SUMMARY_WORKER) {
    let fileExists = false;
    try {
        await fs.stat(socketPath);
        fileExists = true;
    } catch (e) {
        if (!(e instanceof Error)) throw e;
        if (!('code' in e)) throw e;
        if (e.code !== "ENOENT") throw e;
    }

    if (!fileExists) throw new Error("[STEP SUMMARY THREAD] Socket file does not exist! Did you forget to spawn the worker?");
    client = net.createConnection(socketPath);
    client.unref();
}

export function appendToJobSummarySection(message: string) {
    if (client === null) return;

    console.log("::debug::[STEP SUMMARY THREAD] Queueing a message to send to job summary worker.");
    client.write(JSON.stringify({ type: JobSummaryWorkerMessageType.AppendToSection, message }));
    console.log("::debug::[STEP SUMMARY THREAD] Sent a message to job summary worker.");
}
