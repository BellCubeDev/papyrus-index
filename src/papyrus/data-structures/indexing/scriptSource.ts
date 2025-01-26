import type { PapyrusGame } from "../pure/game";
import type { PapyrusScriptSourceMetadata } from "../pure/scriptSource";
import type { PapyrusPossibleScripts } from "./script";

export interface PapyrusScriptSourceScriptDataIndexed<TGame extends PapyrusGame> {
    /** Unique per-game identifier (folder name) for this source */
    sourceIdentifier: Lowercase<string>;

    /** Scripts contained by this source, indexed by script name */
    scripts: PapyrusPossibleScripts<TGame>;
}

export type PapyrusScriptSourceIndexed<TGame extends PapyrusGame> = PapyrusScriptSourceScriptDataIndexed<TGame> & PapyrusScriptSourceMetadata<TGame>;
