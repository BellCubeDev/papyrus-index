import { register } from "tsx/esm/api";
import { workerData } from "node:worker_threads";

register();

if(!workerData.scriptPath) throw new Error(`No script path provided to worker!`);
await import(workerData.scriptPath);
