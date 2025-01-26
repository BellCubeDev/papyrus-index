import { Worker } from "node:worker_threads";
import type { PapyrusScript } from "../data-structures/pure/script";
import type { PapyrusGame } from "../data-structures/pure/game";
import type { PapyrusScriptDiscoveredDocument } from "./parse-all-for-game";
import path from "node:path";
import url from "node:url";
import { parseScriptSync } from "./parse-script";

const filePath = url.fileURLToPath(import.meta.url);
const fileExt = path.extname(filePath);

// eslint-disable-next-line require-await -- wait this is FASTER? If it gets too slow, try with a queue-based multithreading approach
export async function parseScriptAsync<TGame extends PapyrusGame>(game: TGame, document: PapyrusScriptDiscoveredDocument): Promise<PapyrusScript<TGame>> {
    return parseScriptSync(game, document);

    //return await new Promise<PapyrusScript<TGame>>((resolve, reject) => {
    //
    //    const scriptPath = url.fileURLToPath(new URL(`./parse-script-worker.js`, import.meta.url));
    //    const worker = new Worker(fileExt === '.js' ? scriptPath : new URL(`./dev-worker-resolver-for-tsx.mjs`, import.meta.url), { workerData: {
    //        scriptPath,
    //        document,
    //        game,
    //    } });
    //
    //    worker.once('message', (messageOrError)=>{
    //        if (messageOrError instanceof Error) {
    //            console.error(messageOrError);
    //            reject(messageOrError);
    //        } else {
    //            resolve(messageOrError);
    //        }
    //
    //        worker.terminate();
    //    });
    //
    //    worker.once('error', (err)=>{
    //        console.error(err);
    //        reject(err);
    //        worker.terminate();
    //    });
    //});
}
