import posthogJS from 'posthog-js';
import * as Log from 'next/dist/build/output/log';

const TIME_LABEL = 'Welcome to the Papyrus Index! Bootstrapping took';

console.time(TIME_LABEL);

// I would use object destructuring here, but Next.js inlines NEXT_PUBLIC_* variables at build time
// and only detects them if they are accessed using dot notation
const NEXT_PUBLIC_POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const NEXT_PUBLIC_POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!NEXT_PUBLIC_POSTHOG_KEY || !NEXT_PUBLIC_POSTHOG_HOST) {
    Log.warnOnce('Posthog logging not configured! See .env.example for more!');
} else {
    posthogJS.init(NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        person_profiles: 'never', // We're not interested in info tied to specific users
        persistence: 'sessionStorage', // Use sessionStorage to avoid tracking across sessions
    });

    // @ts-expect-error -- just setting Posthog on window for debugging purposes
    window.posthog = posthogJS;
}

console.timeLog(TIME_LABEL);
