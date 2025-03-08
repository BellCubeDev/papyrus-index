import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { memoizeDevServerConst } from "../../../utils/memoizeDevServerConst";


const InMemoryHashCache = memoizeDevServerConst('RAW__JSON__PER__GAME__HASH_CACHE', ()=> new Map<PapyrusGame, Promise<string>>());

export async function generateRawJsonHash(game: PapyrusGame): Promise<string> {
    if (InMemoryHashCache.has(game)) return await InMemoryHashCache.get(game)!;

    const str = JSON.stringify(game);
    const promise = crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(hashBuffer => {
        const hashArray = Array.from(new Uint32Array(hashBuffer));
        return hashArray.map(b => b.toString(32)).join('');
    });

    InMemoryHashCache.set(game, promise);
    return await promise;
}
