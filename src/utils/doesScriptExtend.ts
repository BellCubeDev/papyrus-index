import type { PapyrusScriptIndexed } from "../papyrus/data-structures/indexing/script";
import { UnknownPapyrusScript } from "../papyrus/data-structures/indexing/type";
import type { PapyrusGame } from "../papyrus/data-structures/pure/game";
import { iterateOverScriptParents } from "./iterateOverScriptParents";

export function doesScriptExtend<TGame extends PapyrusGame>(doesThisScript: PapyrusScriptIndexed<TGame>, extendThisScript: PapyrusScriptIndexed<TGame>): boolean {
    if (doesThisScript.namespaceName.toLowerCase() === extendThisScript.namespaceName.toLowerCase()) return true;
    for (const possibleParents of iterateOverScriptParents(doesThisScript)) {
        if (possibleParents === UnknownPapyrusScript) break;
        if (Object.values(possibleParents)[0]!.namespaceName.toLowerCase() === extendThisScript.namespaceName.toLowerCase()) return true;
    }
    return false;
}
