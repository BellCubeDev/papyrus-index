import { isCI } from "next/dist/server/ci-info";
import fs from "node:fs/promises";
import net from "node:net";
import { StepSummaryWorkerMessageType, type StepSummarySection } from ".";
import { socketPath } from "./spawnWorker";

let client: net.Socket | null = null;

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

    if (!fileExists) throw new Error("[STEP SUMMARY POSTER] Socket file does not exist! Did you forget to spawn the worker?");
    client = net.createConnection(socketPath);
    client.unref();
}

export function appendToStepSummarySectionInternal(message: string, section: StepSummarySection) {
    if (client === null) return;

    const jsonMessage = JSON.stringify({
        type: StepSummaryWorkerMessageType.AppendToSection,
        message,
        section
    });

    const messageBuffer = Buffer.from(jsonMessage, 'utf8');
    
    const lengthPrefixedMessage = Buffer.alloc(4 + messageBuffer.length);
    lengthPrefixedMessage.writeUInt32BE(messageBuffer.length, 0);
    messageBuffer.copy(lengthPrefixedMessage, 4);

    client.write(lengthPrefixedMessage);
}
