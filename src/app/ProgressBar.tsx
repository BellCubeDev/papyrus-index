'use client';

import { AppProgressBar } from 'next-nprogress-bar';

export function ProgressBar() {
    return <AppProgressBar
        color="#bb5cff" height='8px'
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
            minimum: 0.9,
            //maximum: 0.85,
        }}
        spinnerPosition="bottom-right"
    />;
}
