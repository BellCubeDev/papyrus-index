'use client';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useCallback, useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import type { PapyrusGame } from '../../../papyrus/data-structures/pure/game';
import styles from './Search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { usePostHog } from 'posthog-js/react';
import { useUpdatedRef } from '../../hooks/useUpdatedRef';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function SearchModalButton({game}: {readonly game: PapyrusGame}): React.ReactElement {
    const posthog = usePostHog();
    const posthogRef = useUpdatedRef(posthog);

    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

    useEffect(() => {
        if (isOpen) posthogRef.current.capture('SearchModal opened', {source: 'button'});
        else posthogRef.current.capture('SearchModal closed', {source: 'button'});
    }, [isOpen, posthogRef]);

    const useCompactWidthLayout = useMediaQuery('(max-width: 900px)');

    return <>
        <button type='button' onClick={toggleOpen} className={`${styles.searchButton} js-only`}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchModalSearchIcon!} />
            <span>Search...</span>
        </button>
        <Dialog open={isOpen} onClose={toggleOpen} className={styles.searchModalBackdrop!} unmount={false}>
            <DialogPanel className={styles.searchModalDialog!}>
                <div className={styles.searchModalHeader!}>
                    <button
                        type='button' onClick={toggleOpen}
                        className={styles.searchModalReturnButton!}
                        disabled={useCompactWidthLayout} hidden={useCompactWidthLayout}
                    >
                        <FontAwesomeIcon icon={faArrowLeftLong} />
                        <span>Return to Page</span>
                    </button>
                    <DialogTitle>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <span>Papyrus Index Search</span>
                    </DialogTitle>
                    <button type='button' onClick={toggleOpen} className={styles.searchModalCloseButton!}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                <div className={styles.searchModalBody!}>
                    <div className={styles.searchModalBodyContentWrapper!}>
                        <SearchBar game={game} />
                    </div>
                </div>
            </DialogPanel>
        </Dialog>
    </>;
}
