import { workerData, parentPort as parentPort_ } from "node:worker_threads";
import { parseScriptSync } from "./parse-script";

const parentPort = parentPort_!;
if (!parentPort) throw new Error(`This file may not be run as a standalone script! It MUST be run as a worker thread!`);

try {
    const parsed = parseScriptSync(workerData.game, workerData.document);
    parentPort.postMessage(parsed);
} catch (err) {
    parentPort.postMessage(err);
}
