import type { Metadata } from "next";
import type { AboutPage, Person, WebSite } from "schema-dts";
import { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import { JsonLDGraph } from "../components/JsonLDGraph";
import { ThePapyrusIndexLogo } from "../components/logo/ThePapyrusIndexLogo";
import { NavBar } from "../components/nav-bar/NavBar";
import { FunctionOfTheDayClient } from "./FunctionOfTheDayClient";
import { FunctionOfTheDayOptionsWithRendered } from "./FunctionOfTheDayServer";
import styles from './page.module.scss';
import { prepareUrlParts } from "../../utils/prepareUrlParts";
import { getKeywords } from "@/app/SEO";

export const metadata: Metadata = {
    title: { absolute: 'The Papyrus Index' },

    keywords: getKeywords({
        game: null,
        dataTypes: ['game', 'script', 'function', 'event', 'property', 'struct'],
        additionalKeywords: null,
    }),
};

export default function HomePage() {
    return <>
        <NavBar game={null} // We have a NavBar in the home page so we can add it separately to the game layouts
        />
        <main className={styles.homePageWrapper}>

            <ThePapyrusIndexLogo />

            <article>
                <h1> Welcome to the Papyrus Index </h1>
                <p> This is a database of developer-centric Papyrus scripts, functions, <del>events, properties, and structs</del> (coming soon)&mdash;indexed and searchable in one large, easy-to-use database. </p>
                <p> If you&rsquo;ve ever had to search the CK Wiki and three different Papyrus extenders for a function, you&rsquo;ll appreciate this tool as much as I do. </p>
                <br />
                <p> Select a game from the navigation bar above to get started! </p>
                <br />
                <p> The Papyrus Index is a <strong>work in progress</strong>. If you have suggestions, find bugs, or want to contribute, please visit the <a href="https://github.com/BellCubeDev/papyrus-index" target="_blank" rel="noopener noreferrer">GitHub repository</a>. </p>

                <div className={styles.functionOfTheDayContainer}>
                    <h2> Function of the Day </h2>
                    <FunctionOfTheDayClient options={FunctionOfTheDayOptionsWithRendered} />
                </div>
            </article>
        </main>

        <JsonLDGraph data={[
            {
                "@id": "https://papyrus.bellcube.dev/#website",
                "@type": "WebSite",
                name: 'the Papyrus Index',
                image: "https://papyrus.bellcube.dev/logo/logo.webp",
                url: "https://papyrus.bellcube.dev/",
                author: "https://papyrus.bellcube.dev/#author",
                publisher: "https://papyrus.bellcube.dev/#author",
                dateModified: new Date().toISOString(),
                isAccessibleForFree: true,
                license: "http://opensource.org/licenses/MIT",
                maintainer: {
                    "@type": "Person",
                    name: "BellCube",
                },
                description: "A database of developer-centric Papyrus scripts, functions, events, properties, and structs—indexed and searchable in one large, easy-to-use database.",
                inLanguage: "en",
                mainEntityOfPage: "https://papyrus.bellcube.dev/#website",
            } satisfies WebSite,
            {
                "@id": "https://papyrus.bellcube.dev/#author",
                "@type": "Person",
                name: "BellCube",
                givenName: "Zack",
            } satisfies Person,
            {
                "@id": "https://papyrus.bellcube.dev/#aboutpage",
                "@type": "AboutPage",
                url: "https://papyrus.bellcube.dev/",
                name: "the Papyrus Index",
                description: "A database of developer-centric Papyrus scripts, functions, events, properties, and structs—indexed and searchable in one large, easy-to-use database.",
                isPartOf: "https://papyrus.bellcube.dev/#website",
                mainEntity: "https://papyrus.bellcube.dev/#website",
                mentions: Object.values(PapyrusGame).map(game => ({
                    "@type": "CollectionPage",
                    "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game)}#game`,
                })),
            } satisfies AboutPage,
        ]} />
    </>;
}
