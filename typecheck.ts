/* eslint-disable max-classes-per-file */
import buildModule from 'next/dist/build/index.js';
import * as Log from 'next/dist/build/output/log';
//import { writeFileSync } from 'node:fs';
import fs, { type FileHandle } from 'node:fs/promises';

let interval: NodeJS.Timer | null = null;

const writeLogToFile = process.env.CI_WRITE_LOG_TO_FILE === 'true';
let logFile: FileHandle | null = null;
// eslint-disable-next-line no-empty-function
let cleanupFunction = async () => {};
if (writeLogToFile) {
    logFile = await fs.open('typecheck.log', 'w');
    const oldSTDOUTWrite = process.stdout.write;
    // @ts-ignore
    process.stdout.write = function write(this: ThisParameterType<typeof oldSTDOUTWrite>, ...args: Parameters<typeof oldSTDOUTWrite>) {
        logFile!.write(args[0].toString());
        oldSTDOUTWrite.call(this, ...args);
    };

    const oldSTDERRWrite = process.stderr.write;
    // @ts-ignore
    process.stderr.write = function write(this: ThisParameterType<typeof oldSTDERRWrite>, ...args: Parameters<typeof oldSTDERRWrite>) {
        logFile!.write(args[0].toString());
        oldSTDERRWrite.call(this, ...args);
    };


    process.setUncaughtExceptionCaptureCallback(async (err) => {
        Log.error(err);
        await cleanupFunction();
        oldProcessExit(1);
    });

    process.on('uncaughtException', async (err) => {
        Log.error(err);
        await cleanupFunction();
        oldProcessExit(1);
    });

    process.on('unhandledRejection', async (err) => {
        Log.error(err);
        await cleanupFunction();
        oldProcessExit(1);
    });

    cleanupFunction = async () => {
        if (interval) clearInterval(interval);
        process.stdout.write = oldSTDOUTWrite;
        process.stderr.write = oldSTDERRWrite;
        console.log = reallyOldLog;
        console.log('\n'.repeat(10));
        console.log('========== END LOG ==========');
        console.log('Flushing the above log to file...');
        await logFile!.close();
        console.log('Flushed the log above the line to file.');
    };

    process.on('beforeExit', async () => {
        await cleanupFunction();
    });

}


// WARNING: This file is one...

/***
 * spell-checker: disable
 *
 *
 *
 *    BBBBBBBBBBBBBBBBB       IIIIIIIIIIIIIIII            GGGGGGGGGGGGG
 *    B::::::::::::::::B      I::::::::::::::I         GGG::::::::::::G
 *    B::::::BBBBBB:::::B     I::::::::::::::I       GG:::::::::::::::G
 *    BB:::::B     B:::::B    IIIII::::::IIIII      G:::::GGGGGGGG::::G
 *      B::::B     B:::::B         I::::I          G:::::G       GGGGGG
 *      B::::B     B:::::B         I::::I         G:::::G
 *      B::::BBBBBB:::::B          I::::I         G:::::G
 *      B:::::::::::::BB           I::::I         G:::::G    GGGGGGGGGG
 *      B::::BBBBBB:::::B          I::::I         G:::::G    G::::::::G
 *      B::::B     B:::::B         I::::I         G:::::G    GGGGG::::G
 *      B::::B     B:::::B         I::::I         G:::::G        G::::G
 *      B::::B     B:::::B         I::::I          G:::::G       G::::G
 *    BB:::::BBBBBB::::::B    IIIII::::::IIIII      G:::::GGGGGGGG::::G
 *    B:::::::::::::::::B     I::::::::::::::I       GG:::::::::::::::G
 *    B::::::::::::::::B      I::::::::::::::I         GGG::::::GGG:::G
 *    BBBBBBBBBBBBBBBBB       IIIIIIIIIIIIIIII            GGGGGG   GGGG
 *
 *
 *
 *     HHHHHHH     HHHHHHH                  AAA                       CCCCCCCCCC     KKKKKKK      KKKKKKK
 *     H:::::H     H:::::H                 A:::A                   CCC:::::::::C     K:::::K      K:::::K
 *     H:::::H     H:::::H                A:::::A                CC::::::::::::C     K:::::K     K::::::K
 *     H:::::H     H:::::H               A:::::::A              C:::::CCCCCCCCCC     K:::::K    K::::::K
 *     H:::::H     H:::::H              A:::::::::A            C:::::C               K:::::K   K:::::K
 *     H:::::H     H:::::H             A:::::A:::::A          C:::::C                K:::::K  K:::::K
 *     H::::::HHHHH::::::H            A:::::A A:::::A         C:::::C                K::::::KK:::::K
 *     H:::::::::::::::::H           A:::::A   A:::::A        C:::::C                K::::::::::::K
 *     H:::::::::::::::::H          A:::::A     A:::::A       C:::::C                K::::::::::::K
 *     H::::::HHHHH::::::H         A:::::AAAAAAAAA:::::A      C:::::C                K::::::KK:::::K
 *     H:::::H     H:::::H        A:::::::::::::::::::::A     C:::::C                K:::::K  K:::::K
 *     H:::::H     H:::::H       A:::::AAAAAAAAAAAAA:::::A     C:::::C               K:::::K   K:::::K
 *     H:::::H     H:::::H      A:::::A             A:::::A     C:::::CCCCCCCCCC     K:::::K    K::::::K
 *     H:::::H     H:::::H     A:::::A               A:::::A     CC::::::::::::C     K:::::K     K::::::K
 *     H:::::H     H:::::H    A:::::A                 A:::::A      CCC:::::::::C     K:::::K      K:::::K
 *     HHHHHHH     HHHHHHH   AAAAAAA                   AAAAAAA        CCCCCCCCCC     KKKKKKK      KKKKKKK
 *
 *
 *
 * spell-checker: enable
 */


// Do not be surprised if this breaks in the future!



//
// The current hack: Force the environment to not use TTY, and then check to see if Next.js logs the message we're looking for.
//
// When this script was first devised with TTY mode in mind,
// console.log() got reset every time a log "spinner" (cycling ellipsis) finished, so we used that to detect when something finished.
// Was a great way to optimize our checks, but it failed once TTY mode was disabled (in CI builds, which was what this script was meant for).
//


/** This "error" is an error only in name. It's really an escape hatch to exit out of the build and give control back to our script. */
class PleaseExitTypecheckNowError extends Error {
    constructor() {
        super('This error is thrown to indicate that the typechecking process has finished and to exit the build process. It should only be caught by the typechecking script.');
    }
}

/** This error is a way for us to be able to clean up when process.exit() is called while still exiting the current context. */
class WorkerExitedError extends Error {
    constructor(code: number) {
        super(`A worker process exited (or tried to exit) with code ${code}!`);
    }
}

process.stdout.isTTY = false;
const targetLogMessage = ` ${Log.prefixes.info} Collecting page data ...`;

/** The log since the last time patchLog() ran successfully */
let currentLog = '';
const isOurLog = Symbol('isOurLog');
const reallyOldLog = console.log;
function patchLog(isInitialRun = false) {
    if ((console.log as any)[isOurLog]) return;
    const oldLog = console.log;
    //writeFileSync('typecheck.log.json', JSON.stringify(logsSoFar));
    currentLog = '';
    console.log = function log(...args: any[]) {
        if (args[0] === targetLogMessage) {
            Log.info('Typechecking finished without errors! Throwing an escape hatch, nominal "error" up the stack...');
            throw new PleaseExitTypecheckNowError();
        }
        oldLog(...args);
    };
    (console.log as any)[isOurLog] = true;
    if (isInitialRun) Log.event('Typecheck script successfully monkey-patched console.log! To detect when typechecking ends, we look for the next log message, ""');
    else Log.info('Reestablished console.log monkey patch.');
}
const oldSTDOUTWrite = process.stdout.write;
// @ts-ignore
process.stdout.write = function write(this: ThisParameterType<typeof oldSTDOUTWrite>, ...args: Parameters<typeof oldSTDOUTWrite>) {
    currentLog += args[0].toString();
    oldSTDOUTWrite.call(this, ...args);
};
patchLog(true);
interval = setInterval(patchLog, 50);

const oldProcessExit = process.exit;
process.exit = function exit(code: number) {
    throw new WorkerExitedError(code);
};


process.on('beforeExit', () => {
    process.stdout.write = oldSTDOUTWrite;
    console.log = reallyOldLog;
    console.log('\n'.repeat(10));
    console.log('Script never did its usual "premature exit" thing after typechecking finished! This indicates that the script is broken!');
    console.log('\n'.repeat(2));
    oldProcessExit(1);
});

const build = buildModule as unknown as typeof import('next/dist/build/index.js'); // Next.js' types are screwed up here
build.default(
    //dir: string,
    process.cwd(),
    //reactProductionProfiling = false,
    false,
    //debugOutput = false,
    false,
    //runLint = true,
    false,
    //noMangling = false,
    true,
    //appDirOnly = false,
    false,
    //turboNextBuild = false,
    false,
    //experimentalBuildMode: 'default' | 'compile' | 'generate',
    'default',
    //traceUploadUrl: string | undefined})
    undefined
).catch(async (err: Error) => {
    const isBenign =err instanceof PleaseExitTypecheckNowError;

    if (isBenign) Log.event('Typechecking finished without errors! Exiting...');
    else Log.error(err);

    await cleanupFunction();

    oldProcessExit(isBenign ? 0 : 1);
});
