'use client';

import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { useSearchContext } from '../../search/SearchProvider';
import { SearchModalButton } from '../search/SearchModal';

export function NavBarSearchBarClient({game}: {
    readonly game: PapyrusGame | null,
}) {
    const searchContext = useSearchContext(true);
    return game && searchContext ? <SearchModalButton game={game!} /> : null;
}
