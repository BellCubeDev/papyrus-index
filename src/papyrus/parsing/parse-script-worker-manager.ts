import { Worker } from "node:worker_threads";
import type { PapyrusScript } from "../data-structures/pure/script";
import type { PapyrusGame } from "../data-structures/pure/game";
import type { PapyrusScriptDiscoveredDocument } from "./parse-all-for-game";
import path from "node:path";
import url from "node:url";
import { parseScriptSync, replaceFunctionImplementationWithGuard } from "./parse-script";
import fs from "node:fs/promises";
import { PapyrusSourceType, type PapyrusScriptSourceMetadata } from "../data-structures/pure/scriptSource";

const filePath = url.fileURLToPath(import.meta.url);
const fileExt = path.extname(filePath);

const GUARD_LOGIC = process.env.DO_GUARD_LOGIC === 'true';

// No workers is FASTER? If it gets too slow, try with a queue-based multithreading approach instead
export async function parseScriptAsync<TGame extends PapyrusGame>(game: TGame, document: PapyrusScriptDiscoveredDocument, metadataPromise: Promise<PapyrusScriptSourceMetadata<PapyrusGame> | null>): Promise<PapyrusScript<TGame>> {

    if (GUARD_LOGIC) {
        const [newDocument, parsedScript] = replaceFunctionImplementationWithGuard(game, document);
        if (newDocument.isModified) {
            const meta = await metadataPromise;
            if (meta && meta.type !== PapyrusSourceType.Vanilla && meta.type !== PapyrusSourceType.xSE)
                await fs.writeFile(newDocument.absolutePath, newDocument.sourceCode, 'utf8');
        }
        return parsedScript;
    } else {
        return parseScriptSync(game, document);
    }

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
