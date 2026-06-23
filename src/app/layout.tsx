import { Metadata, Viewport } from 'next';
import './global.scss';

import { config as FontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
FontAwesomeConfig.autoAddCss = false;

import { Roboto, SourceCodePro } from './Fonts';


//import { ApolloWrapper } from '@/nexus-api/GraphQLClientClient';
import Image from 'next/image';
import Markdown from 'react-markdown';
import { ProgressBarProvider } from './ProgressBarProvider';
import { Link } from './components/Link';
import { ThePapyrusIndexLogo } from './components/logo/ThePapyrusIndexLogo';
import { ReactGeigerDevOnly } from '@/app/components/react-geiger-dev-only';


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
            <noscript><style>
                {`

                    .js-only { display: none }
                    noscript { display: contents }
                    * { transition: none !important; }
                `.split('\n').map(l=>l.trim()).join(' ').trim()}
            </style></noscript>
        </head>
        <body className={`${Roboto.className} ${Roboto.variable} ${SourceCodePro.variable}`} suppressHydrationWarning>
            <Providers>
                <div>
                    {children}
                </div>
                <div>
                    <footer>
                        <div>
                            <div>
                                <Link href='/' data-no-link-style>
                                    <ThePapyrusIndexLogo />
                                </Link>
                            </div>
                            <div>
                                <p>
                                    &copy; {new Date().getUTCFullYear()} BellCube. Source code <a href="https://github.com/BellCubeDev/papyrus-index">available on GitHub</a>.
                                </p>
                                <p>
                                    Website code <a href="https://github.com/BellCubeDev/papyrus-index/blob/development/LICENSE.md">available for free under the MIT license</a>.
                                    Papyrus source files are not covered by this license. Wiki&nbsp;data is covered by the respective licenses of the wikis, disclosed on individual pages where such data is used.
                                </p>
                                <Markdown skipHtml>{process.env.NEXT_PUBLIC_BUILD_SOURCE_MD}</Markdown>
                            </div>
                            <div>
                                <a href='https://bellcube.dev' data-no-link-style target="_blank" rel="noopener noreferrer">
                                    <Image alt='BellCube Logo'
                                        src='/logo/logo.webp'
                                        width={96} height={96}
                                        loading='lazy'
                                    />
                                </a>
                            </div>
                        </div>
                        <hr />
                        <p>
                            The Papyrus Index is a reference for Papyrus scripts, functions, and events. It indexes scripts from countless xSE plugins, libraries, and other sources, and provides a uniquely granular search tool to find exactly what you&rsquo;re looking for. It is well-suited for beginners because it includes tooltips to explain Papyrus syntax and it integrates content directly from the CK Wiki. It is also perfectly designed for power users thanks to its well-structured rapid-feedback search tool and its display format rooted strongly in Papyrus syntax.
                        </p>
                        <p>
                            This project is unaffiliated with Bethesda Softworks and is an entirely community-driven effort.
                        </p>
                    </footer>
                </div>
            </Providers>
            <div id='progress-bar-container' />
        </body>
    </html>;
}

function Providers({ children }: { readonly children: React.ReactNode }) {
    return <ReactGeigerDevOnly renderTimeThreshold={0} enabled phaseOption='both'>
        <ProgressBarProvider>
            {children}
        </ProgressBarProvider>
    </ReactGeigerDevOnly>;
}


// test function to see if type checking reaaaaally works
///* export */ function _alberto(): 'alberto' & { readonly alberto: 'alberto' } {
//    console.log('you know I will return alberto');
//    return 'alberto' as const;
//}
