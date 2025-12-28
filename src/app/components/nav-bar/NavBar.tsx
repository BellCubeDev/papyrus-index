import { NavBarSearchBarClient } from '@/app/components/nav-bar/NavBarSearchBarClient';
import Link from 'next/link';
import { Suspense } from 'react';
import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { ThePapyrusIndexLogo } from '../logo/ThePapyrusIndexLogo';
import { GameDropdown } from './GameDropdown';
import styles from './NavBar.module.scss';

export function NavBar({game}: {
    readonly game: PapyrusGame | null,
}) {
    return <nav className={styles.nav}>
        {game ? null : <div /> /* To align the dropdown to the middle of the screen when we're on the home page */}

        <Suspense>
            <GameDropdown currentGame={game} />
        </Suspense>

        {game ? <Link href='/' className={styles.logo} data-no-link-style aria-label="Go to homepage">
            <ThePapyrusIndexLogo />
        </Link> : null}

        <Suspense>
            <NavBarSearchBarClient game={game} />
        </Suspense>
    </nav>;
}
