import { PapyrusGame, type PapyrusGameData } from "../data-structures/pure/game";
import { performance } from "node:perf_hooks";
import { parseAllScriptsForGame } from "./parse-all-for-game";
import { inspect } from "node:util";

console.log('Parsing all scripts...');

performance.mark('start');
const start = performance.now();

export const AllScriptsFreshlyParsed = Object.fromEntries(await Promise.all(Object.values(PapyrusGame).map(async game => [
    game,
    {
        game,
        scriptSources: Object.fromEntries((await parseAllScriptsForGame(game)).map(source => [source.sourceIdentifier, source] as const)),
    } satisfies PapyrusGameData<typeof game>,
] as const))) as {[TGame in PapyrusGame]: PapyrusGameData<TGame>};

inspect.defaultOptions.depth = 10;

performance.mark('end');

console.log(`Finished parsing scripts in ${performance.now() - start}ms`);

//fs.writeFile('test.json', JSON.stringify(AllScriptsFreshlyParsed, null, 4));
