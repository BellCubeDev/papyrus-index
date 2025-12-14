'use client';

import { usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";
import posthogJS from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import * as Log from 'next/dist/build/output/log';
import { useCurrentPostHog } from "@/app/hooks/useCurrentPostHog";

export function PostHogProvider({ children }: { readonly children: React.ReactNode; }) {
    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_POSTHOG_HOST || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            Log.warnOnce('Posthog logging not configured! See .env.example for more!');
            return;
        }
        posthogJS.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
            capture_pageview: false, // Disable automatic pageview capture, as we capture manually
            person_profiles: 'never', // We're not interested in info tied to specific users
            persistence: 'sessionStorage', // Use sessionStorage to avoid tracking across sessions
        });

        // @ts-expect-error -- just setting Posthog on window for debugging purposes
        window.posthog = posthogJS;
    }, []);

    return <PHProvider client={posthogJS}>
        <PostHogPageView />
        {children}
    </PHProvider>;
}

function PostHogPageViewInternal() {
    const pathname = usePathname();
    const posthog = useCurrentPostHog();

    // Track pageviews
    useEffect(() => {
        if (pathname && posthog) posthog.capture?.('$pageview', { '$current_url': new URL(pathname, window.location.origin).href });
    }, [pathname, posthog]);

    return null;
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function PostHogPageView() {
    return <Suspense fallback={null}>
        <PostHogPageViewInternal />
    </Suspense>;
}
