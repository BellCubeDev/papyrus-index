import { execa } from "execa";
import { spawnStepSummaryWorker } from "./src/utils/stepSummary/spawnWorker";
import Log from 'next/dist/build/output/log';

const closeStepSummaryWorker = await spawnStepSummaryWorker();

Log.wait('[buildWithJobSummary.ts] Starting build from script...');

let hasError = true;
try {
    console.log('\n\n');
    const subprocess = execa("next",  ["build", "--turbo"], {
        stdio: ["inherit", "inherit", "inherit"],
    });
    await subprocess;
    hasError = false;
} finally {
    console.log('\n\n');

    if (hasError) Log.error('[buildWithJobSummary.ts] Build failed!');
    else Log.event('[buildWithJobSummary.ts] Build finished successfully!');

    closeStepSummaryWorker();
}
