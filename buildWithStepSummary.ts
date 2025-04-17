import { execa } from "execa";
import { spawnStepSummaryWorker } from "./src/utils/stepSummary/spawnWorker";
import Log from 'next/dist/build/output/log';

const closeStepSummaryWorker = await spawnStepSummaryWorker();

// pnpm run download-mods; pnpm run parse


let hasError = true;
try {
    Log.wait('[buildWithStepSummary.ts] Downloading any needed mods before starting the build...');

    console.log('\n\n');

    await execa("pnpm",  ["run", "download-mods"], {
        stdio: ["inherit", "inherit", "inherit"],
    });

    console.log('\n\n');

    Log.event('[buildWithStepSummary.ts] Needed mods are downloaded!');

    console.log('\n\n');
    Log.wait('[buildWithStepSummary.ts] Parsing Papyrus scripts before starting build...');

    console.log('\n\n');

    await execa("pnpm",  ["run", "parse"], {
        stdio: ["inherit", "inherit", "inherit"],
    });

    console.log('\n\n');

    Log.event('[buildWithStepSummary.ts] Parsed Papyrus scripts successfully!');

    console.log('\n\n');

    Log.wait('[buildWithStepSummary.ts] Starting build from script...');

    console.log('\n\n');

    await execa("next",  ["build", "--turbo"], {
        stdio: ["inherit", "inherit", "inherit"],
    });

    console.log('\n\n');

    Log.event('[buildWithStepSummary.ts] Build finished successfully!');

    hasError = false;
} finally {
    console.log('\n\n');
    if (hasError) Log.error('[buildWithStepSummary.ts] Build failed!');
    closeStepSummaryWorker();
}
