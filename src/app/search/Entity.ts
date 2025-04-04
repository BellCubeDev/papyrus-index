import type { PapyrusScriptEventOrBaseFunctionIndexedAggregate, PapyrusScriptFunctionIndexedAggregate } from "../../papyrus/data-structures/indexing/function";
import type { PapyrusScriptPropertyIndexedAggregate } from "../../papyrus/data-structures/indexing/property";
import type { PapyrusScriptIndexedAggregate } from "../../papyrus/data-structures/indexing/script";
import type { PapyrusScriptStructIndexedAggregate } from "../../papyrus/data-structures/indexing/struct";
import type { PapyrusGame } from "../../papyrus/data-structures/pure/game";

export enum SearchIndexEntityType {
    Script,
    Function,
    Event,
    Property,
    Struct,
}

//type WithEntityMark<TEntityType extends SearchIndexEntityType, T> = T & {  };

export interface SearchEntityBase<TEntityType extends SearchIndexEntityType> {
    $entityType: TEntityType;
    $entityId: number;
}

export interface SearchEntityScriptAdditions extends SearchEntityBase<SearchIndexEntityType.Script>  {
    ckWikiDescription: string | null;
    githubWikiDescription: string | null;
}

export interface SearchEntityFunctionAdditions extends SearchEntityBase<SearchIndexEntityType.Function>  {
    ckWikiDescription: string | null;
    githubWikiDescription: string | null;
}

export interface SearchEntityEventAdditions extends SearchEntityBase<SearchIndexEntityType.Event>  {
    ckWikiDescription: string | null;
    githubWikiDescription: string | null;
}

export interface SearchEntityPropertyAdditions extends SearchEntityBase<SearchIndexEntityType.Property>  {
    ckWikiDescription: string | null;
    githubWikiDescription: string | null;
}

export interface SearchEntityStructAdditions extends SearchEntityBase<SearchIndexEntityType.Struct> {
    ckWikiDescription: string | null;
    githubWikiDescription: string | null;
}




export interface SearchEntityScript<TGame extends PapyrusGame> extends SearchEntityScriptAdditions, PapyrusScriptIndexedAggregate<TGame> {
}

export interface SearchEntityFunction<TGame extends PapyrusGame> extends SearchEntityFunctionAdditions, PapyrusScriptFunctionIndexedAggregate<TGame> {
}

export interface SearchEntityEvent<TGame extends PapyrusGame> extends SearchEntityEventAdditions, PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame> {
}

export interface SearchEntityProperty<TGame extends PapyrusGame> extends SearchEntityPropertyAdditions, PapyrusScriptPropertyIndexedAggregate<TGame> {
}

export interface SearchEntityStruct<TGame extends PapyrusGame> extends SearchEntityStructAdditions, PapyrusScriptStructIndexedAggregate<Exclude<TGame, PapyrusGame.SkyrimSE>> {
}

export type SearchEntityBaseTypeMapping<TGame extends PapyrusGame> = {
    readonly [SearchIndexEntityType.Script]: PapyrusScriptIndexedAggregate<TGame>;
    readonly [SearchIndexEntityType.Function]: PapyrusScriptFunctionIndexedAggregate<TGame>;
    readonly [SearchIndexEntityType.Event]: PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>;
    readonly [SearchIndexEntityType.Property]: PapyrusScriptPropertyIndexedAggregate<TGame>;
    readonly [SearchIndexEntityType.Struct]: PapyrusScriptStructIndexedAggregate<Exclude<TGame, PapyrusGame.SkyrimSE>>;
}



export type SearchIndexEntity<TGame extends PapyrusGame> = SearchEntityScript<TGame> | SearchEntityFunction<TGame> | SearchEntityEvent<TGame> | SearchEntityProperty<TGame> | SearchEntityStruct<TGame>;
export type SearchIndexEntityKeys<TGame extends PapyrusGame> = keyof SearchEntityScript<TGame> | keyof SearchEntityFunction<TGame> | keyof SearchEntityEvent<TGame> | keyof SearchEntityProperty<TGame> | keyof SearchEntityStruct<TGame>;



export type SearchIndexEntitiesRecordRawType<TGame extends PapyrusGame> = {
    readonly [SearchIndexEntityType.Script]: SearchEntityScript<TGame>,
    readonly [SearchIndexEntityType.Function]: SearchEntityFunction<TGame>,
    readonly [SearchIndexEntityType.Event]: SearchEntityEvent<TGame>,
    readonly [SearchIndexEntityType.Property]: SearchEntityProperty<TGame>,
    readonly [SearchIndexEntityType.Struct]: SearchEntityStruct<TGame>,
}

export type AnySearchIndexEntity<TGame extends PapyrusGame> = SearchIndexEntitiesRecordRawType<TGame>[keyof SearchIndexEntitiesRecordRawType<TGame>];

export type SearchIndexEntityGroupRecord<TGame extends PapyrusGame> = { readonly [K in keyof SearchIndexEntitiesRecordRawType<TGame>]: SearchIndexEntitiesRecordRawType<TGame>[K][] };
export type SearchIndexEntityGroupRecordBlank<TGame extends PapyrusGame> = { readonly [K in keyof SearchIndexEntitiesRecordRawType<TGame>]: readonly SearchEntityBase<K>[] };
export type SearchIndexEntityGroup<TGame extends PapyrusGame> = SearchIndexEntityGroupRecord<TGame>[keyof SearchIndexEntityGroupRecord<TGame>];


export type SelectEntityGroups<TGame extends PapyrusGame, TAllGroups extends SearchIndexEntityGroupRecordBlank<TGame>, TTypes extends SearchIndexEntityType> = (TAllGroups[TTypes] extends readonly (infer U)[] ? U : never)[];
export function selectEntityGroups<TGame extends PapyrusGame, TAllGroups extends SearchIndexEntityGroupRecordBlank<TGame>, TTypes extends SearchIndexEntityType>(allGroups: TAllGroups, ...types: TTypes[]): SelectEntityGroups<TGame, TAllGroups, TTypes> {
    return types.flatMap((type) => allGroups[type] as any as TAllGroups[TTypes][]) as SelectEntityGroups<TGame, TAllGroups, TTypes>;
}
