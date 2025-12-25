import posthogJS from 'posthog-js';
import * as Log from 'next/dist/build/output/log';

console.log('');
console.log('%cInitializing the Papyrus Index...', 'color: #ad5de6ff; font-weight: 600');
console.log('');

const TIME_LABEL = `%c
       /$$$$$$$     /$$$$$$    /$$$$$$$   /$$     /$$   /$$$$$$$    /$$   /$$    /$$$$$$
      | $$__  $$   /$$__  $$  | $$__  $$ |  $$   /$$/  | $$__  $$  | $$  | $$   /$$__  $$
      | $$  \\ $$  | $$  \\ $$  | $$  \\ $$  \\  $$ /$$/   | $$  \\ $$  | $$  | $$  | $$  \\__/
      | $$$$$$$/  | $$$$$$$$  | $$$$$$$/   \\  $$$$/    | $$$$$$$/  | $$  | $$  |  $$$$$$
      | $$____/   | $$__  $$  | $$____/     \\  $$/     | $$__  $$  | $$  | $$   \\____  $$
      | $$        | $$  | $$  | $$           | $$      | $$  \\ $$  | $$  | $$   /$$  \\ $$
      | $$        | $$  | $$  | $$           | $$      | $$  | $$  |  $$$$$$/  |  $$$$$$/
      |__/        |__/  |__/  |__/           |__/      |__/  |__/   \\______/    \\______/


       /$$$$$$   /$$   /$$   /$$$$$$$    /$$$$$$$$   /$$    /‾$$/
      |_  $$_/  | $$$ | $$  | $$__  $$  | $$_____/  |  $$  / $$/
        | $$    | $$$$| $$  | $$  \\ $$  | $$         \\  $$/ $$/
        | $$    | $$ $$ $$  | $$  | $$  | $$$$$       \\  $$$$<
        | $$    | $$  $$$$  | $$  | $$  | $$__/       / $$  $$
        | $$    | $$\\  $$$  | $$  | $$  | $$         / $$/ \\ $$
       /$$$$$$  | $$ \\  $$  | $$$$$$$/  | $$$$$$$$  | $$/   \\ $$
      |______/  |__/  \\__/  |_______/   |________/  |__/     \\__/


%cWelcome to the Papyrus Index!%c Bootstrapping took`;

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

console.timeLog(TIME_LABEL, 'color: #ad5de6ff; font-weight: 900', 'color: #13e941ff; font-weight: 600', 'color: #5ec073ff');
console.log('');
console.log('');
