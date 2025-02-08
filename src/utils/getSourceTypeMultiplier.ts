import { PapyrusSourceType } from "../papyrus/data-structures/pure/scriptSource";
import { UnreachableError } from "../UnreachableError";

/** Returns the search multiplier/priority for each type of Papyrus source. Useful any time you need to sort sources. */
export function getSourceTypeMultiplier(type: PapyrusSourceType): number {
    switch (type) {
        case PapyrusSourceType.Vanilla:
            return 6;
        case PapyrusSourceType.xSE:
            return 4;
        case PapyrusSourceType.xSePluginExtender:
            return 2.2;
        case PapyrusSourceType.PapyrusLib:
            return 1.4;
        case PapyrusSourceType.xSePluginIncidental:
            return 1;
        case PapyrusSourceType.Standalone:
            return .6;
        default:
            throw new UnreachableError(type, 'Encountered an unknown source type in getSourceTypeMultiplier()');
    }
}
