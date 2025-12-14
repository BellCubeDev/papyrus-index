import net from "node:net";
import fs from "node:fs";
import { StepSummarySection, StepSummaryWorkerMessageType, type StepSummaryWorkerMessage } from '.';
import { socketPath } from "./socketPath";

console.log('[STEP SUMMARY WORKER] Starting step summary worker...');

const stepSummaryFile = process.env.GITHUB_STEP_SUMMARY;
if (!stepSummaryFile) throw new Error("[STEP SUMMARY WORKER] GITHUB_STEP_SUMMARY is not set! Cannot spawn step summary worker without a job summary path!");

const server = net.createServer({
    keepAlive: true,
    noDelay: true,
});

let hasError = true;
try {
    await fs.promises.rm(socketPath, { force: true });
    await new Promise<void>((resolve, reject) => {
        server.on('error', reject);
        server.listen(socketPath, 999, () => {
            console.log('[STEP SUMMARY WORKER] Server listening at path', socketPath);
            server.off('error', reject);
            resolve();
        });
    });
    console.log('[STEP SUMMARY WORKER] Ready!');
    process.send!('ready');
    hasError = false;
} finally {
    if (hasError) console.warn('[STEP SUMMARY WORKER] Server failed to listen at path', socketPath, 'due to error!');
}

const filePromise = fs.promises.open(stepSummaryFile, "w");

/** A string that supports Markdown formatting, GitHub-flavor */
type gfm_markdown_string = string & {};
const StepSummary: Record<StepSummarySection, Map<string, gfm_markdown_string>> = {
    [StepSummarySection.MediaWikiFormattingWarnings]: new Map(),
    [StepSummarySection.GitHubWikiFormattingWarnings]: new Map(),
    [StepSummarySection.DownloadedMods]: new Map(),
    [StepSummarySection.UnimplementedFeatures]: new Map(),
    [StepSummarySection.SassWarnings]: new Map(),
};

const SectionHeaders: Record<StepSummarySection, string> = {
    [StepSummarySection.MediaWikiFormattingWarnings]: "⚠️ MediaWiki Formatting Warnings",
    [StepSummarySection.GitHubWikiFormattingWarnings]: "⚠️ GitHub Wiki Formatting Warnings",
    [StepSummarySection.UnimplementedFeatures]: "🚧 Unimplemented Features",
    [StepSummarySection.DownloadedMods]: "⬇️ Downloaded Mods",
    [StepSummarySection.SassWarnings]: "⚠️ Sass Warnings",
};

let previousDumpData: [AbortController, Promise<void>] | null = null;
async function dumpFileBase(signal: AbortSignal) {
    const contents = Object.entries(StepSummary).filter(([_section, messages]) => messages.size > 0).map(([section, messages]) =>
        `<details><summary><h2>${SectionHeaders[section]}</h2></summary>\n\n${Array.from(messages.values()).sort().join('\n\n---\n\n')}\n\n</details>`
    ).join('\n\n');
    const file =  await filePromise;
    if (signal.aborted) return;
    console.log('::debug::[STEP SUMMARY WORKER] Dumping string with length', contents.length, 'to step summary file');
    await file.write(contents, 0, 'utf8');
    console.log('::debug::[STEP SUMMARY WORKER] Dumped to file');
}

async function dumpFile(isFinalFlush = false) {
    const myController = new AbortController();
    if (previousDumpData) {
        const [oldController, promise] = previousDumpData;
        previousDumpData = [myController, Promise.resolve()];
        oldController.abort();
        await promise;
    }
    previousDumpData = [myController, Promise.resolve()];
    if (!isFinalFlush) await new Promise(r=>setTimeout(r, 5000));
    if (myController.signal.aborted) return;
    const promise = dumpFileBase(myController.signal);
    previousDumpData = [myController, promise];
    return promise;
}


server.on('connection', (socket) => {
    let buffer = Buffer.alloc(0);
    let expectedLength = -1;

    socket.on('data', (data) => {
        buffer = Buffer.concat([buffer, data]);

        // Process complete messages
        while (buffer.length > 4) {
            if (expectedLength === -1) {
                // Read the message length (first 4 bytes)
                expectedLength = buffer.readUInt32BE(0);
                buffer = buffer.subarray(4);
            }

            if (buffer.length < expectedLength) break; // Don't have the full message yet

            const messageBuffer = buffer.subarray(0, expectedLength);
            buffer = buffer.subarray(expectedLength);

            const messageStr = messageBuffer.toString('utf8');
            console.log('::debug::[STEP SUMMARY WORKER] Processing message:', messageStr);

            try {
                const obj = JSON.parse(messageStr) as StepSummaryWorkerMessage;
                switch (obj.type) {

                    case StepSummaryWorkerMessageType.AppendToSection: {

                        const existingMessage = StepSummary[obj.section].get(obj.uniqueIdentifier);
                        if (!existingMessage || existingMessage.length < obj.message.length)
                            StepSummary[obj.section].set(obj.uniqueIdentifier, obj.message);

                        dumpFile();
                        break;
                    }

                    default:
                        throw new Error('[STEP SUMMARY WORKER] Unknown message type:', obj.type);
                }
            } catch (e) {
                console.error('[STEP SUMMARY WORKER] Failed to parse message:', e, {
                    data: messageStr,
                });
            }

            expectedLength = -1;
        }
    });
});

server.on('drop', () => {
    //console.log('[STEP SUMMARY WORKER] Dropped connection');

    if (server.connections !== 0) return;

    console.log('[STEP SUMMARY WORKER] No connections remain; dumping to file');
    dumpFile();
});

server.on('end', () => {
    console.log('[STEP SUMMARY WORKER] Disconnected from server');
});

let isExiting = false;
async function exitHandler(exitCode: number) {
    if (isExiting) return console.log('[STEP SUMMARY WORKER] Already exiting! Give this poor worker a moment to clean up!');
    isExiting = true;
    console.log('[STEP SUMMARY WORKER] Cleaning up before exit...');
    const file = await filePromise;
    await new Promise<void>((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
    await dumpFile(true);
    await file.close();
    process.exit(exitCode);
}

process.once('message', (message) => {
    if (message === 'close') {
        console.log('[STEP SUMMARY WORKER] Received close signal; exiting...');
        exitHandler(0);
    } else {
        console.error('[STEP SUMMARY WORKER] Unknown message from parent process:', message);
    }
});
