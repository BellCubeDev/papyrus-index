import type { NextConfig } from 'next';
import { cpus } from 'node:os';

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
        cpus: 8,
        staleTimes: {
            static: 24*60*60,
        },
        turbo: {

        },
        reactCompiler: {
            panicThreshold: 'NONE',
        },
    },

    staticPageGenerationTimeout: 10*60,

    trailingSlash: true,

    images: {
        unoptimized: true,
        formats: ['image/avif', 'image/webp'],
    },



    transpilePackages: ['@wooorm/starry-night']
} as const satisfies NextConfig;

export default nextConfig;
