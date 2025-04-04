import type { PapyrusGame } from "../pure/game";
import type { PapyrusScriptSourceMetadata } from "../pure/scriptSource";
import type { PapyrusGameDataIndexed } from "./game";
import type { PapyrusPossibleScripts } from "./script";

export interface PapyrusScriptSourceScriptDataIndexed<TGame extends PapyrusGame> {
    /** Unique per-game identifier (folder name) for this source */
    sourceIdentifier: Lowercase<string>;

    /** Scripts contained by this source, indexed by script name */
    scripts: PapyrusPossibleScripts<TGame>;

    /** The game this source originates from */
    game: PapyrusGameDataIndexed<TGame>;
}

export type PapyrusScriptSourceIndexed<TGame extends PapyrusGame> = PapyrusScriptSourceScriptDataIndexed<TGame> & PapyrusScriptSourceMetadata<TGame>;
export type PapyrusScriptSourceIndexedNoScriptsProp<TGame extends PapyrusGame> = Omit<PapyrusScriptSourceScriptDataIndexed<TGame>, 'scripts'> & PapyrusScriptSourceMetadata<TGame>;
