import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { PapyrusSourceType, type PapyrusScriptSourceMetadata } from "../../../papyrus/data-structures/pure/scriptSource";
import { getGameName } from "../../../utils/getGameName";

export function SourceName({source, long}: {source: PapyrusScriptSourceMetadata<PapyrusGame>, long?: boolean}): string {
    switch (source.type) {
        case PapyrusSourceType.Vanilla:
            return long ? `vanilla ${getGameName(source.game)}` : 'Vanilla';
        default:
            return long ? source.nameProper : source.nameShort;
    }
}
