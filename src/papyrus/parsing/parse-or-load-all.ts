import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import type { AllScriptsFreshlyParsed } from '../parsing/parse-all';


const thisFile = url.fileURLToPath(import.meta.url);

const thisDir = path.dirname(thisFile);

const srcDir = path.join(thisDir, '../../');
if (path.basename(srcDir) !== 'src') throw new Error(`Expected srcDir to be in the 'src' directory, but got a different name! Path: ${srcDir}`);

const publicAssetsDir = path.join(srcDir, '../public');

const rawJsonPath = path.join(publicAssetsDir, 'raw.json');

async function parseOrLoadAllScripts() {
    let hasPreviousFile = false;
    try {
        await fs.access(rawJsonPath);
        hasPreviousFile = true;
    } catch (e) {
        if (!(e instanceof Error) || !('code' in e) || e.code !== 'ENOENT') throw e;
    }

    if (hasPreviousFile) {
        console.log('Loading previously-parsed scripts...');
        const now = performance.now();
        const raw = await fs.readFile(rawJsonPath, 'utf8');
        const json = JSON.parse(raw) as typeof AllScriptsFreshlyParsed;
        console.log(`Finished loading previously-parsed scripts in ${performance.now() - now}ms`);
        return json;
    } else {
        // eslint-disable-next-line no-shadow -- not a shadow if we're just importing the type above
        const { AllScriptsFreshlyParsed } = await import('../parsing/parse-all');
        await fs.writeFile(rawJsonPath, JSON.stringify(AllScriptsFreshlyParsed, null, 4));
        return AllScriptsFreshlyParsed;
    }
}

export const AllScripts: typeof AllScriptsFreshlyParsed = await parseOrLoadAllScripts();
