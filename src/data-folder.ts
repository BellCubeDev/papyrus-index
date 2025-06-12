import { PapyrusGame } from './papyrus/data-structures/pure/game';
import url from 'node:url';
import path from 'node:path';

const thisFile = url.fileURLToPath(import.meta.url);

export const srcDir = path.dirname(thisFile);
if (path.basename(srcDir) !== 'src') throw new Error('Expected srcDir to be the `src` directory, but got a different name!');

export const dataDir = path.join(srcDir, '../data');

export function getGameDir(game: PapyrusGame) {
    return path.join(dataDir, game);
}
