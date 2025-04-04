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




export interface SearchEntityScriptIndexed<TGame extends PapyrusGame> extends SearchEntityScriptAdditions, PapyrusScriptIndexedAggregate<TGame> {
}

export interface SearchEntityFunctionIndexed<TGame extends PapyrusGame> extends SearchEntityFunctionAdditions, PapyrusScriptFunctionIndexedAggregate<TGame> {
}

export interface SearchEntityEventIndexed<TGame extends PapyrusGame> extends SearchEntityEventAdditions, PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame> {
}

export interface SearchEntityPropertyIndexed<TGame extends PapyrusGame> extends SearchEntityPropertyAdditions, PapyrusScriptPropertyIndexedAggregate<TGame> {
}

export interface SearchEntityStructIndexed<TGame extends PapyrusGame> extends SearchEntityStructAdditions, PapyrusScriptStructIndexedAggregate<Exclude<TGame, PapyrusGame.SkyrimSE>> {
}



export interface SearchEntityScriptNonIndexed<TGame extends PapyrusGame> extends SearchEntityScriptAdditions, PapyrusScriptIndexedAggregate<TGame> {
}

export interface SearchEntityFunctionNonIndexed<TGame extends PapyrusGame> extends SearchEntityFunctionAdditions, PapyrusScriptFunctionIndexedAggregate<TGame> {
}

export interface SearchEntityEventNonIndexed<TGame extends PapyrusGame> extends SearchEntityEventAdditions, PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame> {
}

export interface SearchEntityPropertyNonIndexed<TGame extends PapyrusGame> extends SearchEntityPropertyAdditions, PapyrusScriptPropertyIndexedAggregate<TGame> {
}

export interface SearchEntityStructNonIndexed<TGame extends PapyrusGame> extends SearchEntityStructAdditions, PapyrusScriptStructIndexedAggregate<Exclude<TGame, PapyrusGame.SkyrimSE>> {
}

export type SearchEntityNonIndexedBaseTypeMapping<TGame extends PapyrusGame> = {
    readonly [SearchIndexEntityType.Script]: PapyrusScriptIndexedAggregate<TGame>;
    readonly [SearchIndexEntityType.Function]: PapyrusScriptFunctionIndexedAggregate<TGame>;
    readonly [SearchIndexEntityType.Event]: PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>;
    readonly [SearchIndexEntityType.Property]: PapyrusScriptPropertyIndexedAggregate<TGame>;
    readonly [SearchIndexEntityType.Struct]: PapyrusScriptStructIndexedAggregate<Exclude<TGame, PapyrusGame.SkyrimSE>>;
}



export type SearchIndexEntity<TGame extends PapyrusGame> = SearchEntityScriptIndexed<TGame> | SearchEntityFunctionIndexed<TGame> | SearchEntityEventIndexed<TGame> | SearchEntityPropertyIndexed<TGame> | SearchEntityStructIndexed<TGame>;
export type SearchIndexEntityKeys<TGame extends PapyrusGame> = keyof SearchEntityScriptIndexed<TGame> | keyof SearchEntityFunctionIndexed<TGame> | keyof SearchEntityEventIndexed<TGame> | keyof SearchEntityPropertyIndexed<TGame> | keyof SearchEntityStructIndexed<TGame>;



export type SearchIndexEntitiesRecordRawType<TGame extends PapyrusGame, TType extends 'non-indexed'|'indexed' = 'indexed'> = {
    readonly [SearchIndexEntityType.Script]: TType extends 'indexed' ? SearchEntityScriptIndexed<TGame> : SearchEntityScriptNonIndexed<TGame>,
    readonly [SearchIndexEntityType.Function]: TType extends 'indexed' ? SearchEntityFunctionIndexed<TGame> : SearchEntityFunctionNonIndexed<TGame>, // TODO: Create a function aggregate type and use that here
    readonly [SearchIndexEntityType.Event]: TType extends 'indexed' ? SearchEntityEventIndexed<TGame> : SearchEntityEventNonIndexed<TGame>, // TODO: Create an event aggregate type and use that here
    readonly [SearchIndexEntityType.Property]: TType extends 'indexed' ? SearchEntityPropertyIndexed<TGame> : SearchEntityPropertyNonIndexed<TGame>, // TODO: Create a property aggregate type and use that here
    readonly [SearchIndexEntityType.Struct]: TType extends 'indexed' ? SearchEntityStructIndexed<TGame> : SearchEntityStructNonIndexed<TGame>,  // TODO: Create a struct aggregate type and use that here
}

export type AnySearchIndexEntity<TGame extends PapyrusGame, TType extends 'non-indexed'|'indexed' = 'indexed'> = SearchIndexEntitiesRecordRawType<TGame, TType>[keyof SearchIndexEntitiesRecordRawType<TGame, TType>];

export type SearchIndexEntityGroupRecord<TGame extends PapyrusGame, TType extends 'non-indexed'|'indexed' = 'indexed'> = { readonly [K in keyof SearchIndexEntitiesRecordRawType<TGame, TType>]: SearchIndexEntitiesRecordRawType<TGame, TType>[K][] };
export type SearchIndexEntityGroupRecordBlank<TGame extends PapyrusGame> = { readonly [K in keyof SearchIndexEntitiesRecordRawType<TGame>]: readonly SearchEntityBase<K>[] };
export type SearchIndexEntityGroup<TGame extends PapyrusGame, TType extends 'non-indexed'|'indexed' = 'indexed'> = SearchIndexEntityGroupRecord<TGame, TType>[keyof SearchIndexEntityGroupRecord<TGame, TType>];


export type SelectEntityGroups<TGame extends PapyrusGame, TAllGroups extends SearchIndexEntityGroupRecordBlank<TGame>, TTypes extends SearchIndexEntityType> = (TAllGroups[TTypes] extends readonly (infer U)[] ? U : never)[];
export function selectEntityGroups<TGame extends PapyrusGame, TAllGroups extends SearchIndexEntityGroupRecordBlank<TGame>, TTypes extends SearchIndexEntityType>(allGroups: TAllGroups, ...types: TTypes[]): SelectEntityGroups<TGame, TAllGroups, TTypes> {
    return types.flatMap(type => allGroups[type] as any) as any;
}
