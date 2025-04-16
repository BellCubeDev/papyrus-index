import { execa } from "execa";
import "./src/utils/stepSummary";

console.log('[buildWithJobSummary.ts] Starting build from script...');

process.env.FORCE_COLOR = 'true';

let hasError = true;
try {
    const subprocess = execa("next",  ["build", "--turbo"], {
        stdio: ["inherit", "inherit", "inherit"],
    });
    await subprocess;
    hasError = false;
} finally {
    if (hasError) console.log('[buildWithJobSummary.ts] Build failed!');
    else console.log('[buildWithJobSummary.ts] Build finished successfully!');
}
