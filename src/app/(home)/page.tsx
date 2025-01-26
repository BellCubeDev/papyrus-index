import type { Metadata } from "next";
import { FunctionOfTheDayClient } from "./FunctionOfTheDayClient";
import { FunctionOfTheDayOptionsWithRendered } from "./FunctionOfTheDayServer";
import styles from './page.module.scss';
import { ThePapyrusIndexLogo } from "../components/logo/ThePapyrusIndexLogo";

export const metadata: Metadata = {
    title: { absolute: 'The Papyrus Index' },
};

export default function RedirectToFilesByHashPage() {


    return <div className={styles.homePageWrapper}>
        <ThePapyrusIndexLogo />
        
        <article>
            <h1> Welcome to the Papyrus Index </h1>
            <p> This is a database of developer-centric Papyrus scripts, functions, events, properties, and structs&mdash;indexed and searchable in one large, easy-to-use database. </p>
            <p> If you&rsquo;ve ever had to search the CK Wiki and three different Papyrus extenders for a function, you&rsquo;ll appreciate this tool as much as I do. </p>

            <div className={styles.functionOfTheDayContainer}>
                <h1> Function of the Day </h1>
                <FunctionOfTheDayClient options={FunctionOfTheDayOptionsWithRendered} />
            </div>
        </article>
    </div>;
}
