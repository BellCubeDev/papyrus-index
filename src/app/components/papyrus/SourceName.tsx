import type { PapyrusScriptSourceIndexed } from "../../../papyrus/data-structures/indexing/scriptSource";
import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { PapyrusSourceType, type PapyrusScriptSource, type PapyrusScriptSourceMetadata } from "../../../papyrus/data-structures/pure/scriptSource";

export function SourceName({source, long}: {source: PapyrusScriptSourceMetadata<PapyrusGame> | PapyrusScriptSource<PapyrusGame> | PapyrusScriptSourceIndexed<PapyrusGame>, long?: boolean}): string {
    switch (source.type) {
        case PapyrusSourceType.Vanilla:
            return long ? 'The Vanilla Game' : 'Vanilla';
        default:
            return long ? source.nameProper : source.nameShort;
    }
}
