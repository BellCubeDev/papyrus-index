import { memoizeDevServerConst } from "../../utils/memoizeDevServerConst";
import { PapyrusGame } from "../data-structures/pure/game";
import { AllScripts } from "../parsing/parse-or-load-all";
import { indexGame } from "./index-game";

if (typeof window !== 'undefined') throw new Error('This file should not be imported in the browser! It is FAR too slow!');

export const AllScriptsIndexed = memoizeDevServerConst('AllScriptsIndexed', getAllScriptsIndexed);

function getAllScriptsIndexed()
 {
    return Object.fromEntries(Object.values(PapyrusGame).map((game) =>
        [game, getAllScriptsIndexedForGame(game)]
    )) as {[K in PapyrusGame]: ReturnType<typeof indexGame>};
}

function getAllScriptsIndexedForGame<TGame extends PapyrusGame>(game: TGame) {
    const gameData = structuredClone(AllScripts[game]);
    const start = performance.now();
    console.log(`Indexing scripts for ${gameData.game}...`);
    const res = indexGame(gameData);
    const end = performance.now();
    //import('fs/promises').then(async (fs)=>fs.writeFile(`test-${game}.inspect.json`, await import('node:util').then(util=>util.inspect(res, { depth: 10 }))));
    //import('fs/promises').then(async (fs)=>fs.writeFile(`test-${game}-vanilla.inspect.json`, await import('node:util').then(util=>util.inspect(res.scriptSources.vanilla, { depth: 10 }))));
    console.log(`Finished indexing scripts for ${gameData.game} in ${end - start}ms`);
    return res;
}
