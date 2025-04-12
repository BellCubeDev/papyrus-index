'use client';

import { usePathname } from "next/navigation";
import { useEffect, Suspense } from "react";
import posthogJS from 'posthog-js';
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react';
import * as Log from 'next/dist/build/output/log';

export function PostHogProvider({ children }: { readonly children: React.ReactNode; }) {
    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_POSTHOG_HOST || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            Log.warnOnce('Posthog logging not configured! See .env.example for more!');
            return;
        }
        posthogJS.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
            person_profiles: 'never', // or 'always' to create profiles for anonymous users as well
            capture_pageview: false // Disable automatic pageview capture, as we capture manually
        });

        // @ts-ignore
        window.posthog = posthogJS; // Make PostHog available globally for debugging
    }, []);

    return <PHProvider client={posthogJS}>
        <PostHogPageView />
        {children}
    </PHProvider>;
}

function PostHogPageViewInternal() {
    const pathname = usePathname();
    const posthog = usePostHog();

    // Track pageviews
    useEffect(() => {
        if (pathname && posthog) posthog.capture('$pageview', { '$current_url': new URL(pathname, window.location.origin).href });
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
