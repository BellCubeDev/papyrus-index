import type { NextConfig } from 'next';
import { cpus } from 'node:os';
import { isCI } from 'next/dist/server/ci-info';

//if (process.env.NODE_ENV === 'production') {
//    process.env.DEBUG = '*';
//    process.env.DEBUG_HIDE_DATE = 'true';
//    process.env.DEBUG_DEPTH = '3';
//    process.env.DEBUG_SHOW_HIDDEN = 'true';
//}

const nextConfig = {
    poweredByHeader: true,
    reactStrictMode: true,

    output: 'export',

    productionBrowserSourceMaps: true,

    /** @type {import('sass').Options} */
    sassOptions: {
        alertColor: true,
        style: 'compressed',
    },

    experimental: {
        cpus: isCI ? cpus().length : cpus().length - 2,
        staleTimes: {
            static: 24*60*60,
        },
        turbo: {

        },
        reactCompiler: {
            panicThreshold: 'NONE',
        },
    },

    staticPageGenerationTimeout: 45 * 60,

    trailingSlash: true,

    images: {
        unoptimized: true,
        formats: ['image/avif', 'image/webp'],
    },



    transpilePackages: ['@wooorm/starry-night']
} as const satisfies NextConfig;

export default nextConfig;
