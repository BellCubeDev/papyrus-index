'use client';
import { faArrowLeftLong, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PapyrusGame } from '../../../papyrus/data-structures/pure/game';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useUpdatedRef } from '../../hooks/useUpdatedRef';
import styles from './Search.module.scss';
import SearchBar from './SearchBar';

export function SearchModalButton({game}: {readonly game: PapyrusGame}): React.ReactElement {
    const posthog = usePostHog();
    const posthogRef = useUpdatedRef(posthog);

    const [isOpen, setIsOpen] = useState(false);
    const closeModal  = useCallback(() => setIsOpen(false), []);
    const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

    const wasOpenRef = useRef(false);
    useEffect(() => {
        if (isOpen) posthogRef.current.capture('SearchModal opened', {source: 'button'});
        else if (wasOpenRef.current) posthogRef.current.capture('SearchModal closed', {source: 'button'});
        wasOpenRef.current = isOpen;
    }, [isOpen, posthogRef]);


    const pathname = usePathname();
    useEffect(closeModal, [pathname, closeModal]);

    return <>
        <button type='button' onClick={toggleOpen} className={`${styles.searchButton} js-only`}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchModalSearchIcon!} />
            <span>Search...</span>
        </button>
        <Dialog open={isOpen} onClose={closeModal} className={styles.searchModalBackdrop!} unmount={false}>
            <DialogPanel className={styles.searchModalDialog!}>
                <SearchModalContents game={game} closeModal={closeModal} Title={DialogTitle} />
            </DialogPanel>
        </Dialog>
    </>;
}

export function SearchModalDeveloperStandalone({game}: {readonly game: PapyrusGame}): React.ReactElement {
    if (process.env.NODE_ENV === 'production') throw new Error('SearchModalDeveloperStandalone should not be used in production!');
    return <div className={styles.searchModalBackdrop!}>
        <div className={styles.searchModalDialog!}>
            <SearchModalContents game={game} Title='h2' />
        </div>
    </div>;
}

function SearchModalContents({game, closeModal, Title}: {
    readonly game: PapyrusGame;
    readonly closeModal?: () => void;
    readonly Title: keyof React.JSX.IntrinsicElements | React.ComponentType<{children: React.ReactNode}>;
}): React.ReactElement {

    const useCompactWidthLayout = useMediaQuery('(max-width: 900px)');

    return <>
        <div className={styles.searchModalHeader!}>
            <button
                type='button' onClick={closeModal}
                className={styles.searchModalReturnButton!}
                disabled={useCompactWidthLayout} hidden={useCompactWidthLayout}
            >
                <FontAwesomeIcon icon={faArrowLeftLong} />
                <span>Return to Page</span>
            </button>
            <Title>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <span>Papyrus Index Search</span>
            </Title>
            <button type='button' onClick={closeModal} className={styles.searchModalCloseButton!}>
                <FontAwesomeIcon icon={faXmark} />
            </button>
        </div>
        <div className={styles.searchModalBody!}>
            <div className={styles.searchModalBodyContentWrapper!}>
                <SearchBar game={game} />
            </div>
        </div>
    </>;
}
