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

    allowedDevOrigins: process.env.ALLOWED_DEV_ORIGINS?.split(',').map(o => o.trim()).filter(o => o.length > 0),

    productionBrowserSourceMaps: true,

    sassOptions: {
        implementation: 'sass',
        alertColor: true,
        style: 'compressed',
        silenceDeprecations: [
            'mixed-decls', // we don't depend on the order of CSS declarations being deterministic in the first place, so this deprecation is fine
        ],

        logger: {
            warn(message, _options) {
                console.warn(`⚠️  Sass Warning:\n${['',...message.split('\n')].join('\n  [96m|[0m ')}\n`);
            },
        }
    } satisfies NextConfig['sassOptions'] & import('sass').Options<'sync' | 'async'>,

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
} as const satisfies RestoreLegacyOptionalKeys<NextConfig>;

export default nextConfig;
