import net from "node:net";
import fs from "node:fs";
import { JobSummarySection, JobSummaryWorkerMessageType, socketPath } from '.';

const stepSummaryFile = process.env.GITHUB_STEP_SUMMARY;
if (!stepSummaryFile) throw new Error("[STEP SUMMARY WORKER] GITHUB_STEP_SUMMARY is not set! Cannot spawn step summary worker without a job summary path!");

const server = net.createServer({
    keepAlive: true,
});

try {
    await new Promise<void>((resolve, reject) => {
        server.on('error', reject);
        server.listen(socketPath, 511, () => {
            console.log('[STEP SUMMARY WORKER] Server listening at path', socketPath);
            server.off('error', reject);
            resolve();
        });
    });
    console.log('[STEP SUMMARY WORKER] Ready!');
    process.send!('ready');
} catch (e) {
    console.log('[STEP SUMMARY WORKER] Server failed to listen at path', socketPath, 'due to error:', e);
    // if the socket is already in use, assume it was a race condition and just exit like nothing ever happened
    if (!(e instanceof Error)) throw e;
    if (!('code' in e)) throw e;
    if (e.code !== 'EADDRINUSE') throw e;
    console.log('[STEP SUMMARY WORKER] Server failed to listen at path', socketPath, 'because it is already in use. Treating as success.');
    process.send!('ready');
    process.exit(0);
}

const filePromise = fs.promises.open(stepSummaryFile, "w");

/** A string that supports Markdown formatting, GitHub-flavor */
type gfm_markdown_string = string & {};
const JobSummary: Record<JobSummarySection, Set<gfm_markdown_string>> = {
    [JobSummarySection.MediaWikiFormattingWarnings]: new Set(),
    [JobSummarySection.DownloadedMods]: new Set(),
};

const SectionHeaders = {
    [JobSummarySection.MediaWikiFormattingWarnings]: "⚠️ MediaWiki Formatting Warnings",
    [JobSummarySection.DownloadedMods]: "⬇️ Downloaded Mods",
};

let previousDumpData: [AbortController, Promise<void>] | null = null;
async function dumpFileBase(signal: AbortSignal) {
    const contents = Object.entries(JobSummary).filter(([_section, messages]) => messages.size > 0).map(([section, messages]) =>
        `<details><summary><h2>${SectionHeaders[section]}</h2></summary>\n\n${messages.values().reduce((acc, next, i) =>
            `${acc}${i === 0 ? '' : '\n\n---\n\n'}${next}`
        , '')}\n\n</details>`
    ).join('\n\n');
    const file =  await filePromise;
    if (signal.aborted) return;
    console.log('::debug::[STEP SUMMARY WORKER] Dumping string with length', contents.length, 'to step summary file');
    await file.write(contents, 0, 'utf8');
    console.log('::debug::[STEP SUMMARY WORKER] Dumped to file');
}

async function dumpFile() {
    const myController = new AbortController();
    if (previousDumpData) {
        const [oldController, promise] = previousDumpData;
        previousDumpData = [myController, Promise.resolve()];
        oldController.abort();
        await promise;
    }
    if (myController.signal.aborted) return;
    const promise = dumpFileBase(myController.signal);
    previousDumpData = [myController, promise];
    return promise;
}

let closeOnNoConnectionsTimeout: NodeJS.Timeout | null = null;

server.on('connection', (socket) => {
    if (closeOnNoConnectionsTimeout) {
        clearTimeout(closeOnNoConnectionsTimeout);
        closeOnNoConnectionsTimeout = null;
    }

    socket.on('data', (data) => {
        console.log('::debug::[STEP SUMMARY WORKER] Received data:', data.toString());
        const str = data.toString();
        const obj = JSON.parse(str);
        switch (obj.type) {
            case JobSummaryWorkerMessageType.AppendToSection: {
                const message = obj.message;
                JobSummary[JobSummarySection.MediaWikiFormattingWarnings].add(message);
                dumpFile();
                break;
            }
            default:
                throw new Error('[STEP SUMMARY WORKER] Unknown message type:', obj.type);
        }
    });
});

server.on('drop', () => {
    //console.log('[STEP SUMMARY WORKER] Dropped connection');

    if (server.connections !== 0) return;

    console.log('[STEP SUMMARY WORKER] No connections remain; dumping to file');
    dumpFile();
    closeOnNoConnectionsTimeout ??= setTimeout(() => {
        console.log('[STEP SUMMARY WORKER] No connections for 60 seconds; closing server');
        exitHandler(0);
    }, 60 * 1000);
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
    await Promise.all([
        file.close(),
        new Promise<void>((resolve, reject) => server.close((err) => err ? reject(err) : resolve())),
    ]);
    process.exit(exitCode);
}

// catch when the event loop becomes empty
process.on('beforeExit', exitHandler);

// try to do something when app is closing
process.on('exit', exitHandler);

// catches ctrl+c event
process.on('SIGINT', exitHandler);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

// catches uncaught exceptions
process.on('uncaughtException', exitHandler);
