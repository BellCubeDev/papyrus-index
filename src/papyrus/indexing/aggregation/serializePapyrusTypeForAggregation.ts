import type { PapyrusScriptTypeIndexed } from "../../data-structures/indexing/type";
import type { PapyrusGame } from "../../data-structures/pure/game";
import { PapyrusScriptTypeArchetype } from "../../data-structures/pure/type";



export function serializePapyrusTypeForAggregation<TGame extends PapyrusGame>(type: PapyrusScriptTypeIndexed<boolean, boolean, TGame>): string {
    const arrayEnding = type.isArray ? '[]' : '';
    switch (type.type) {
        case PapyrusScriptTypeArchetype.ScriptInstance: return `SCRIPT://${type.scriptName}${arrayEnding}`;
        case PapyrusScriptTypeArchetype.Struct: return `STRUCT://${type.scriptName}/${type.structName}${arrayEnding}`;
        default: return `${type.type}${arrayEnding}`;
    }
}
