import type { PapyrusScriptFunction } from "../../../papyrus/data-structures/pure/function";
import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import type { PapyrusSourceType } from "../../../papyrus/data-structures/pure/scriptSource";
import type { WikiDataFunctionPage } from "../../../wikimedia/GetWikiDataFunctionPage";

export type PreparedItem<T> = {
    [K in keyof T]: T[K] extends string ? Fuzzysort.Prepared : T[K];
}

export enum SearchIndexEntityType {
    Script,
    Function,
}

export interface SearchIndexEntityBase {
    type: SearchIndexEntityType;
    url: Lowercase<`/${string}`>;
    sourceIdentifier: Fuzzysort.Prepared;
    sourceType: PapyrusSourceType;
}

export interface SearchIndexEntityScript extends SearchIndexEntityBase {
    type: SearchIndexEntityType.Script;
    isHidden: boolean;
    isConditional: boolean;
    extends: null | Fuzzysort.Prepared;
    isConst: boolean;
    isNative: boolean;
    default: boolean;
    structs: unknown;
    scriptNamespaceName: Fuzzysort.Prepared;
    imports: Fuzzysort.Prepared[];
}

export interface SearchIndexEntityFunction extends SearchIndexEntityBase {
    type: SearchIndexEntityType.Function;
    wikiShortDescription: null | Fuzzysort.Prepared;
    wikiNotes: null | Fuzzysort.Prepared;
    wikiParameterData: null | PreparedItem<Omit<WikiDataFunctionPage['parameters'][number], 'nameMarkdown'>>[];
    name: Fuzzysort.Prepared;
    isGlobal: boolean;
    isNative: boolean;
    returnType: Fuzzysort.Prepared;
    parameters: Fuzzysort.Prepared[];
    fromPapyrus: PapyrusScriptFunction<PapyrusGame>;
    scriptNamespaceName: Fuzzysort.Prepared;
}

export type SearchIndexEntity = SearchIndexEntityScript | SearchIndexEntityFunction;
