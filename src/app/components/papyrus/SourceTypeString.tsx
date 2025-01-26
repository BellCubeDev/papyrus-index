import { PapyrusSourceType } from "../../../papyrus/data-structures/pure/scriptSource";

export function SourceTypeString({sourceType}: {readonly sourceType: PapyrusSourceType}): string {
    switch (sourceType) {
        case PapyrusSourceType.Vanilla:
            return 'The Vanilla Game';
        case PapyrusSourceType.xSE:
            return 'Script Extender';
        case PapyrusSourceType.PapyrusLib:
            return 'Pure-Papyrus Library';
        case PapyrusSourceType.xSePluginExtender:
            return 'Papyrus Extender xSE Plugin';
        case PapyrusSourceType.xSePluginIncidental:
            return 'xSE Mod + Incidental Papyrus Extensions';
        case PapyrusSourceType.Standalone:
            return 'Standalone Mod + Papyrus API';
    }
}
