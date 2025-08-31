'use client';

import Link from 'next/link';
import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { useSearchContext } from '../../search/SearchProvider';
import { ThePapyrusIndexLogo } from '../logo/ThePapyrusIndexLogo';
import { SearchModalButton } from '../search/SearchModal';
import { GameDropdown } from './GameDropdown';
import styles from './NavBar.module.scss';

export function NavBar({game}: {
    readonly game: PapyrusGame | null,
}) {
    const searchContext = useSearchContext(true);

    return <nav className={styles.nav}>
        {game ? null : <div /> /* To align the dropdown to the middle of the screen when we're on the home page */}

        <GameDropdown currentGame={game} />

        {game ? <Link href='/' className={styles.logo} data-no-link-style aria-label="Go to homepage">
            <ThePapyrusIndexLogo />
        </Link> : null}

        {game && searchContext ? <SearchModalButton game={game!} /> : null}
    </nav>;
}
