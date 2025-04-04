import type { PapyrusPossibleScripts, PapyrusScriptIndexed } from "../papyrus/data-structures/indexing/script";
import { UnknownPapyrusScript } from "../papyrus/data-structures/indexing/type";
import type { PapyrusGame } from "../papyrus/data-structures/pure/game";

export function* iterateOverScriptParents<TGame extends PapyrusGame>(script: PapyrusScriptIndexed<TGame>): Generator<typeof UnknownPapyrusScript | PapyrusPossibleScripts<TGame>> {
    let currentScript: typeof UnknownPapyrusScript | null | PapyrusPossibleScripts<TGame> = script.extends;
    while (currentScript) {
        yield currentScript;
        if (currentScript === UnknownPapyrusScript) return;
        currentScript = Object.values(currentScript)[0]!.extends;
    }
}
