import type { PapyrusScriptSourceIndexed } from "../../papyrus/data-structures/indexing/scriptSource";
import type { PapyrusGame } from "../../papyrus/data-structures/pure/game";

export abstract class GitHubWiki<TGame extends PapyrusGame> {
    constructor(public readonly source: PapyrusScriptSourceIndexed<TGame>) {

    }
}
