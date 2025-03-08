import { register } from "tsx/esm/api";
import { workerData } from "node:worker_threads";

register();

let scriptPath = null;

if(workerData && workerData.scriptPath) scriptPath = workerData.scriptPath;
else if (process.env.TSX_DEV_WORKER_SCRIPT_PATH) scriptPath = process.env.TSX_DEV_WORKER_SCRIPT_PATH;

if (!scriptPath) throw new Error(`No script path provided to worker!`);

console.log(`[DEV WORKER RESOLVER FOR TSX] Loading script: ${scriptPath}`);

await import(scriptPath);
