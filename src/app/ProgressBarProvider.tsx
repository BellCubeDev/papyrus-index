'use client';

import { ProgressProvider } from '@bprogress/next/app';

export function ProgressBarProvider({children}: {readonly children: React.ReactNode}) {
    return <ProgressProvider
        color="var(--link-udl-color-noncurrent-hover)" height='8px'
        delay={50}
        stopDelay={1}
        shallowRouting
        disableSameURL
        options={{
            speed: 500,
            //trickle: true,
            //trickleSpeed: 200,
            showSpinner: true,
            direction: 'ltr',
            minimum: 0.6,
            maximum: 1,
            parent: typeof document === 'undefined' ? '' : document.getElementById('progress-bar-container')!,

        }}
        spinnerPosition="bottom-right"
        startOnLoad={false}
    >
        {children}
    </ProgressProvider>;
}
