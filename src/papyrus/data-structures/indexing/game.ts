import { memoizeDevServerConst } from "../../../utils/memoizeDevServerConst";
import type { PapyrusGame } from "../pure/game";
import type { PapyrusPossibleScripts, PapyrusScriptIndexedAggregate } from "./script";
import type { PapyrusScriptSourceIndexed } from "./scriptSource";

export const AllSourcesCombined: unique symbol = memoizeDevServerConst('AllSourcesCombined', ()=>Symbol('AllSourcesCombined')) as any;

export type AllSourcesCombinedObject<TGame extends PapyrusGame> = { [AllSourcesCombined]: PapyrusScriptIndexedAggregate<TGame> }
export type PapyrusScriptBySources<TGame extends PapyrusGame> = PapyrusPossibleScripts<TGame> & AllSourcesCombinedObject<TGame>;

export interface PapyrusGameDataIndexed<TGame extends PapyrusGame> {
    /** The game in question */
    game: TGame;

    /** Scripts sources (which include scripts) */
    scriptSources: Record<Lowercase<string>, PapyrusScriptSourceIndexed<TGame>>;

    /** Scripts, indexed by name and then source (since a single script may be included/modified by multiple sources)
     *
     * Example usage: `gameData.scripts['ObjectReference']['skse']`
     */
    scripts: Record<Lowercase<string>, PapyrusScriptBySources<TGame>>;

    /** Scripts, indexed by name and then source (since a single script may be included/modified by multiple sources).
     * This property ONLY includes scripts that do not extend another script. Think like StringUtil, Debug, Game, or FO4+'s ScriptObject.
     * Does not include scripts that extend another script---ObjectReference, Flora, SoulGem, and such.
     *
     * Example usage: `gameData.scripts['ObjectReference']['skse']`
     */
    topLevelScripts: Record<Lowercase<string>, PapyrusScriptBySources<TGame>>;
}
