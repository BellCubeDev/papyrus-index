'use client';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useCallback, useState } from 'react';
import SearchBar from './SearchBar';
import type { PapyrusGame } from '../../../papyrus/data-structures/pure/game';
import styles from './Search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

export function SearchModalButton({game}: {readonly game: PapyrusGame}): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false);
    const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);
    return <>
        <button type='button' onClick={toggleOpen}>Open Search</button>
        <Dialog open={isOpen} onClose={toggleOpen} className={styles.searchModalBackdrop!} unmount={false}>
            <DialogPanel className={styles.searchModalDialog!}>
                <div className={styles.searchModalHeader!}>
                    <button type='button' onClick={toggleOpen} className={styles.searchModalReturnButton!}>
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
                    <SearchBar game={game} />
                </div>
            </DialogPanel>
        </Dialog>
    </>;
}
