import { execa } from "execa";
import { spawnStepSummaryWorker } from "./src/utils/stepSummary/spawnWorker";
import Log from 'next/dist/build/output/log';

const closeStepSummaryWorker = await spawnStepSummaryWorker();

// pnpm run download-mods; pnpm run parse

const $ = execa({stdio: ["inherit", "inherit", "inherit"]});

let hasError = true;
try {
    Log.wait('[buildWithStepSummary.ts] Downloading any needed mods before starting the build...');

    console.log('\n\n');

    await $`pnpm run download-mods`;

    console.log('\n\n');

    Log.event('[buildWithStepSummary.ts] Needed mods are downloaded!');

    console.log('\n\n');
    Log.wait('[buildWithStepSummary.ts] Parsing Papyrus scripts before starting build...');

    console.log('\n\n');

    await $`pnpm run parse`;

    console.log('\n\n');

    Log.event('[buildWithStepSummary.ts] Parsed Papyrus scripts successfully!');

    console.log('\n\n');

    Log.wait('[buildWithStepSummary.ts] Starting build from script...');

    console.log('\n\n');

    await $`next build --webpack`;

    console.log('\n\n');

    Log.event('[buildWithStepSummary.ts] Build finished successfully!');

    hasError = false;
} finally {
    console.log('\n\n');
    if (hasError) Log.error('[buildWithStepSummary.ts] Build failed!');
    closeStepSummaryWorker();
}
