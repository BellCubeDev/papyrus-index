import type { NextConfig } from 'next';
import { cpus } from 'node:os';
import { isCI } from 'next/dist/server/ci-info';
import classnamesMinifier from '@nimpl/classnames-minifier';
import { appendToStepSummarySection, StepSummarySection } from './src/utils/stepSummary';

//if (process.env.NODE_ENV === 'production') {
//    process.env.DEBUG = '*';
//    process.env.DEBUG_HIDE_DATE = 'true';
//    process.env.DEBUG_DEPTH = '3';
//    process.env.DEBUG_SHOW_HIDDEN = 'true';
//}

const nextConfig = classnamesMinifier({
  prefix: '',
  reservedNames: [],
  disabled: process.env.NODE_ENV === 'development', // doesn't apply in dev anyway since we use Turbopack for dev, and this doesn't apply to Turbopack (yet?)
  distDeletionPolicy: 'auto', // will remove the Next.js cache if it the current cache doesn't properly accommodate classnames-minifier
})({
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
            'legacy-js-api',
        ],

        logger: {
            warn(message, _options) {
                console.warn(`⚠️  Sass Warning:\n${['',...message.split('\n')].join('\n  [96m|[0m ')}\n`);
                appendToStepSummarySection(message, StepSummarySection.SassWarnings);
            },
        }
    } satisfies NextConfig['sassOptions'] & import('sass').Options<'sync' | 'async'>,

    reactCompiler: {
        panicThreshold: 'none',
    },

    experimental: {
        turbopackFileSystemCacheForDev: true,
        cpus: isCI ? cpus().length : cpus().length - 2,
        staleTimes: {
            static: 24*60*60,
        },
    },

    turbopack: {

    },

    staticPageGenerationTimeout: 75 * 60,

    trailingSlash: true,

    images: {
        unoptimized: true,
        formats: ['image/avif', 'image/webp'],
    },

    webpack(config: Parameters<NonNullable<NextConfig['webpack']>>[0], _context: Parameters<NonNullable<NextConfig['webpack']>>[1]) {
        return Object.assign(config, {
            experiments: Object.assign(config.experiments ?? {}, {
                topLevelAwait: true,
            }),
        });
    },

    transpilePackages: ['@wooorm/starry-night']
} as const satisfies RestoreLegacyOptionalKeys<NextConfig>);

export default nextConfig;
