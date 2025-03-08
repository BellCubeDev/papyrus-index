import type { PapyrusScriptEventOrBaseFunctionIndexed, PapyrusScriptFunctionIndexed } from "../../papyrus/data-structures/indexing/function";
import type { PapyrusScriptBySources } from "../../papyrus/data-structures/indexing/game";
import type { PapyrusScriptPropertyIndexed } from "../../papyrus/data-structures/indexing/property";
import type { PapyrusScriptIndexed } from "../../papyrus/data-structures/indexing/script";
import type { PapyrusScriptStructIndexed } from "../../papyrus/data-structures/indexing/struct";
import type { PapyrusGame } from "../../papyrus/data-structures/pure/game";

export enum SearchIndexEntityType {
    Script,
    Function,
    Event,
    Property,
    Struct,
}

type SearchIndexEntitiesRecord<TGame extends PapyrusGame> = {
    readonly [SearchIndexEntityType.Script]: PapyrusScriptBySources<PapyrusGame>,
    readonly [SearchIndexEntityType.Function]: PapyrusScriptFunctionIndexed<TGame>,
    readonly [SearchIndexEntityType.Event]: PapyrusScriptEventOrBaseFunctionIndexed<TGame>,
    readonly [SearchIndexEntityType.Property]: PapyrusScriptPropertyIndexed<TGame>,
    readonly [SearchIndexEntityType.Struct]: PapyrusScriptStructIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>,
}

export type AnySearchIndexEntity<TGame extends PapyrusGame> = SearchIndexEntitiesRecord<TGame>[keyof SearchIndexEntitiesRecord<TGame>];

export type SearchIndexEntityGroupRecord<TGame extends PapyrusGame> = { readonly [K in keyof SearchIndexEntitiesRecord<TGame>]: SearchIndexEntitiesRecord<TGame>[K][] };
export type SearchIndexEntityGroup<TGame extends PapyrusGame> = SearchIndexEntityGroupRecord<TGame>[keyof SearchIndexEntityGroupRecord<TGame>];

export function selectEntityGroups<TGame extends PapyrusGame>(allGroups: SearchIndexEntityGroupRecord<TGame>, ...types: SearchIndexEntityType[]): AnySearchIndexEntity<TGame>[] {
    return types.flatMap(type => allGroups[type] as AnySearchIndexEntity<TGame>[]);
}
