import { NextResponse, type NextRequest } from "next/server";
import { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { AllScripts } from "../../../papyrus/parsing/parse-or-load-all";
import { toLowerCase } from "../../../utils/toLowerCase";
import fuzzysort from 'fuzzysort';
import { getWikiDataFunctionPage, type WikiDataFunctionPage } from "../../../wikimedia/GetWikiDataFunctionPage";
import type { PapyrusScriptFunction } from "../../../papyrus/data-structures/pure/function";
import { getGameFromParams, type GameRouteParams } from "../getGameFromParams";
import { PapyrusScriptTypeArchetype, type PapyrusScriptType } from "../../../papyrus/data-structures/pure/type";
import { UnreachableError } from "../../../UnreachableError";
import { stripMD } from "../../../utils/stripMD";

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

function papyrusTypeToString(type: PapyrusScriptType<boolean, true>): string {
    const arrString = type.isArray ? '[]' : '';
    switch (type.type) {
        case PapyrusScriptTypeArchetype.Bool:
            return `bool${arrString}`;
        case PapyrusScriptTypeArchetype.Float:
            return `float${arrString}`;
        case PapyrusScriptTypeArchetype.Int:
            return `int${arrString}`;
        case PapyrusScriptTypeArchetype.None:
            return `none${arrString}`;
        case PapyrusScriptTypeArchetype.ScriptInstance:
            return `scriptinstance${arrString}`;
        case PapyrusScriptTypeArchetype.String:
            return `string${arrString}`;
        case PapyrusScriptTypeArchetype.Struct:
            return `${type.scriptName}:${type.structName}${arrString}`;
        case PapyrusScriptTypeArchetype.ScriptInstanceOrStruct:
            return `${type.ambiguousName}${arrString}`;
        case PapyrusScriptTypeArchetype.Var:
            return `var${arrString}`;
        case PapyrusScriptTypeArchetype.CustomEventName:
            return `CustomEventName${arrString} (string[])`;
        case PapyrusScriptTypeArchetype.ScriptEventName:
            return `ScriptEventName${arrString} (string[])`;
        case PapyrusScriptTypeArchetype.StructVarName:
            return `StructVarName${arrString} (string[])`;
        default:
            throw new UnreachableError(type, 'Encountered an unknown PapyrusScriptTypeArchetype while preparing the sorting index in papyrusTypeToPrepared()');
    }
}

const InMemoryResultCache = new Map<PapyrusGame, Awaitable<SearchIndexEntity>[]>();

export async function GET(_request: NextRequest, opts : { params: Promise<GameRouteParams> }) {
    const { game } = getGameFromParams(await opts.params);
    if (InMemoryResultCache.has(game)) return NextResponse.json(await Promise.all(InMemoryResultCache.get(game)!));

    const gameData = AllScripts[game];
    const searchIndexEntityPromises: Awaitable<SearchIndexEntity>[] = [];

    for (const source of Object.values(gameData.scriptSources)) {
        const sourceIdentifierStr = source.sourceIdentifier;
        const sourceIdentifier = fuzzysort.prepare(sourceIdentifierStr);
        for (const script of Object.values(source.scripts)) {
            const namespaceNameStr = script.namespace ? `${script.namespace}:${script.name}` : script.name;
            const namespaceName = fuzzysort.prepare(namespaceNameStr);
            searchIndexEntityPromises.push({
                type: SearchIndexEntityType.Script,
                url: `/${toLowerCase(game)}/script/${toLowerCase(namespaceNameStr)}?sources=${source.sourceIdentifier}` as const,
                default: Boolean(script.default),
                extends: script.extends !== null ? fuzzysort.prepare(script.extends) : null,
                imports: script.imports.map(i => fuzzysort.prepare(i)),
                isConditional: script.isConditional,
                isConst: script.isConst,
                isHidden: script.isHidden,
                isNative: Boolean(script.isNative),
                structs: script.structs,
                scriptNamespaceName: namespaceName,
                sourceIdentifier,
            });
            for (const func of Object.values(script.functions)) {
                const name = fuzzysort.prepare(func.name);
                searchIndexEntityPromises.push(getWikiDataFunctionPage(game, func, namespaceNameStr).then(wikiData => ({
                    type: SearchIndexEntityType.Function,
                    url: `/${toLowerCase(game)}/function/${toLowerCase(namespaceNameStr)}/${toLowerCase(func.name)}?sources=${source.sourceIdentifier}` as const,
                    fromPapyrus: func,
                    isGlobal: func.isGlobal,
                    isNative: func.isNative,
                    name,
                    parameters: func.parameters.map(p => fuzzysort.prepare(`${papyrusTypeToString(p.value)} ${p.name}`)),
                    returnType: fuzzysort.prepare(papyrusTypeToString(func.returnType)),
                    scriptNamespaceName: namespaceName,
                    wikiNotes: wikiData ? fuzzysort.prepare(stripMD(wikiData.notesMarkdown)) : null,
                    wikiParameterData: wikiData ? wikiData.parameters.map(p => ({ name: fuzzysort.prepare(p.name), descriptionMarkdown: fuzzysort.prepare(stripMD(stripMD(p.descriptionMarkdown))) })) : null,
                    wikiShortDescription: wikiData ? fuzzysort.prepare(stripMD(wikiData.shortDescriptionMarkdown)) : null,
                    sourceIdentifier,
                })));
            }
        }
    }

    InMemoryResultCache.set(game, searchIndexEntityPromises);
    return NextResponse.json(await Promise.all(searchIndexEntityPromises));
}

export function generateStaticParams() {
    return Object.values(PapyrusGame).map(game => ({ game: toLowerCase(game) }));
}
