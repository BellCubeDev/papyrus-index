import { Metadata, Viewport } from 'next';
import './global.scss';

import { config as FontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
FontAwesomeConfig.autoAddCss = false;

import { Roboto } from 'next/font/google';
import { SourceCodePro } from './SourceCodePro';
//import { ApolloWrapper } from '@/nexus-api/GraphQLClientClient';
import { ProgressBar } from './ProgressBar';
import { WikiMarkdown } from './components/wiki-markdown/WikiMarkdown';
import Markdown from 'react-markdown';
const roboto = Roboto({
    display: 'block',
    weight: ['400', '500', '700'],
    subsets: ['latin-ext'],
    variable: '--font',
});

// Exported directly in page.js as well to avoid a strange bugs or two
export const metadata: Metadata = {
    title: {
        template: "%s | Papyrus Index",
        default: "~~ERROR~~ | Papyrus Index",
    },
    description: "All known Papyrus functions, events, and scripts, indexed and searchable in one large, easy-to-use database.",
    applicationName: "Papyrus Index",
    authors: [{
        name: "BellCube",
        url: "https://bellcube.dev",
    }],
    category: "Tool",
    classification: "Development",
    formatDetection: {
        address: false,
        date: false,
        email: false,
        telephone: false,
        url: false,
    },
    icons: undefined, // TODO: Create icon
    keywords: [
        'Papyrus',
        'Skyrim',
        'Fallout',
        'Creation Engine',
        'Creation Kit',
        'Bethesda',
        'Modding',
        'Scripting',
        'Functions',
        'Events',
        'Scripts',
        'Index',
        'Database',
        'Search',
        'Lookup',
        'Extender',
        'Script Extender',
        'Papyrus Extender',
        'xSE',
        'SKSE',
        'F4SE',
        'SFSE',
        'FO76',
        'TESV',
        'Skyrim Special Edition',
        'Nexus Mods',
        'Fallout 4',
        'Fallout 76',
        'The Elder Scrolls V',
        'Starfield',
        'CK',
        'Mod',
    ],
    manifest: undefined, // TODO: Add manifest for PWA
    metadataBase: new URL('https://ndt.bellcube.dev'),
    openGraph: {
        type: 'website',
        siteName: 'Papyrus Index',
        url: 'https://papyrus.bellcube.dev',
        images: undefined, // TODO: Create icon
        determiner: 'the',
        locale: 'en',
    },
    twitter: {
        card: 'summary',
    },

    generator: 'Next.js',

    referrer: 'strict-origin',
    other: {
        'opener': 'noopener',
        'darkreader-lock': 'true',
    },



};

export const viewport: Viewport = {
    colorScheme: 'dark',
    width: 'device-width',
    height: 'device-height',
    initialScale: 1,
    interactiveWidget: 'overlays-content',
    maximumScale: 1,
    minimumScale: 1,
    themeColor: '#0074a9',
    userScalable: false,
    viewportFit: 'cover',
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
    return <html lang='en' suppressHydrationWarning>
        <head>
            {/* eslint-disable-next-line react/no-danger -- we're using JSON.stringify to set a <script> tag's contents; it's fine */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
                "@context": "http://schema.org",
                "@type": "SoftwareApplication",
                name: metadata.applicationName,
                image: "https://papyrus.bellcube.dev/logo/logo.webp",
                url: "https://papyrus.bellcube.dev/",
                author: {
                    "@type": "Person",
                    name: "BellCube",
                    givenName: "Zack",
                },
                applicationCategory: "BrowserApplication",
                applicationSubCategory: "WebApp",
                dateModified: new Date().toISOString(),
                isAccessibleForFree: true,
                license: 'MIT',
                maintainer: {
                    "@type": "Person",
                    name: "BellCube",
                    givenName: "Zack",
                },
                offers: {
                    "@type": "Offer",
                    price: 0,
                    priceCurrency: "USD",
                },
                aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: 5,
                    reviewCount: 0,
                },
                operatingSystem: "Windows, Mac, Linux"//, Android, iOS",
            }) }} />
        </head>
        <body className={`${roboto.className} ${roboto.variable} ${SourceCodePro.variable}`} suppressHydrationWarning>
            <ProgressBar />
            <div>
                <main>
                    {children}
                </main>
            </div>
            <div>
                <footer>

                    <p>
                        © {new Date().getUTCFullYear()} BellCube. Source code <a href="https://github.com/BellCubeDev/papyrus-index">available on GitHub</a>.
                    </p>
                    <p>
                        Website code <a href="https://github.com/BellCubeDev/papyrus-index/blob/development/LICENSE.md">available for free under the MIT license</a>.
                        Papyrus source files are not covered by this license. Wiki&nbsp;data is covered by the respective licenses of the wikis, disclosed on individual pages where such data is used.
                    </p>
                    <Markdown skipHtml>{process.env.NEXT_PUBLIC_BUILD_SOURCE_MD}</Markdown>
                </footer>
            </div>
        </body>
    </html>;
}
