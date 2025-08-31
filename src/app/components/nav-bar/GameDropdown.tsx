'use client';

import { useRouter } from '@bprogress/next/app';
import { faChess, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import { usePostHog } from "posthog-js/react";
import React, { useEffect, useState } from "react";
import { preload } from "react-dom";
import { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { getGameName } from "../../../utils/getGameName";
import { prepareUrlParts } from "../../../utils/prepareUrlParts";
import { toLowerCase } from "../../../utils/toLowerCase";
import { useUpdatedRef } from "../../hooks/useUpdatedRef";
import { InternalLink } from "../Link";
import styles from './NavBar.module.scss';

const games = Object.values(PapyrusGame);

export function GameDropdown({currentGame}: {readonly currentGame: PapyrusGame | null}) {
    const [desiredGame, setDesiredGame] = useState<PapyrusGame | null>(currentGame);
    const isLoading = desiredGame !== currentGame;
    const router = useRouter();
    const posthog = usePostHog();

    const desiredGameRef = useUpdatedRef(desiredGame);
    const handleOnChange = React.useCallback((newGame: PapyrusGame) => {
        if (newGame === desiredGameRef.current) return;
        setDesiredGame(newGame);

        posthog?.capture('Game dropdown selection', { game: newGame });
        router.push(prepareUrlParts(newGame));
    }, [desiredGameRef, posthog, router]);

    useEffect(() => {
        for (const game of games) router.prefetch(prepareUrlParts(game), { kind: PrefetchKind.FULL });
    }, [router]);

    for (const game of games) preload(`/images/${game}/poster.jpg`, {as: 'image', fetchPriority: 'low'});

    return <span className={styles.gameDropdownWrapper!}>
        <div className={`${styles.gameDropdownContainer} js-only`}>
            <Listbox value={desiredGame} onChange={handleOnChange} disabled={isLoading}>
                <ListboxButton className={styles.gameDropdownButton!}>
                    {desiredGame ? <img src={`/images/${desiredGame}/poster.jpg`} alt={`Poster for the game ${getGameName(desiredGame)}`} className={styles.gameDropdownImage!} /> : <FontAwesomeIcon icon={faChess} className={styles.gameDropdownImage!} />}
                    {desiredGame ? getGameName(desiredGame) : 'Select a game'}
                    <FontAwesomeIcon icon={faChevronDown} className={styles.gameDropdownChevron!} />
                </ListboxButton>
                <ListboxOptions
                    anchor="bottom"
                    transition
                    className={styles.gameDropdownOptions!}
                >
                    {games.map((game) =>
                        <InternalLink key={game}
                            href={prepareUrlParts(game)}
                            className={styles.gameDropdownLink!}
                        >
                            <ListboxOption value={game} className={styles.gameDropdownOption!} enterKeyHint="enter">
                                <img src={`/images/${game}/poster.jpg`} alt={`Poster for the game ${getGameName(game)}`} className={styles.gameDropdownOptionImage!} />
                                <span>{getGameName(game)}</span>
                            </ListboxOption>
                        </InternalLink>
                    )}
                </ListboxOptions>
            </Listbox>
        </div>

        <noscript>
            <div className={styles.gameDropdownFallback!}>
                {games.map((game) =>
                    <a
                        key={game}
                        href={prepareUrlParts(game)}
                        className={styles.gameDropdownLink!}
                    >
                        {getGameName(game)}
                    </a>
                )}
            </div>
        </noscript>
    </span>;
}
