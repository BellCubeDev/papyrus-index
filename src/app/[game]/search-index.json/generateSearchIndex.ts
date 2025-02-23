
import { AllScripts } from "../../../papyrus/parsing/parse-or-load-all";

import fuzzysort from 'fuzzysort';

import { getWikiDataFunctionPage } from "../../../wikimedia/GetWikiDataFunctionPage";
import { stripMD } from "../../../utils/stripMD";
import { SearchIndexEntityType, type SearchIndexEntity } from "./SearchIndexEntity";
import { papyrusTypeToString } from "../../components/papyrus/type/PapyrusType";
import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { toLowerCase } from "../../../utils/toLowerCase";


const InMemoryResultCache = new Map<PapyrusGame, Awaitable<SearchIndexEntity>[]>();

export async function generateSearchIndex(game: PapyrusGame) {

    if (InMemoryResultCache.has(game)) return await Promise.all(InMemoryResultCache.get(game)!);

    const gameData = AllScripts[game];
    const searchIndexEntityPromises: Awaitable<SearchIndexEntity>[] = [];

    for (const source of Object.values(gameData.scriptSources)) {
        const sourceIdentifierStr = source.sourceIdentifier;
        const sourceIdentifier = fuzzysort.prepare(sourceIdentifierStr);
        for (const script of Object.values(source.scripts)) {
            const namespaceNameStr = script.namespaceName;
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
                sourceType: source.type,
            });
            for (const func of Object.values(script.functions)) {
                const name = fuzzysort.prepare(func.name);
                searchIndexEntityPromises.push(getWikiDataFunctionPage(game, func, namespaceNameStr).then(wikiData => ({
                    type: SearchIndexEntityType.Function,
                    url: `/${toLowerCase(game)}/script/${toLowerCase(namespaceNameStr)}/function/${toLowerCase(func.name)}?sources=${source.sourceIdentifier}` as const,
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
                    sourceType: source.type
                })));
            }
        }
    }

    InMemoryResultCache.set(game, searchIndexEntityPromises);

    return await Promise.all(searchIndexEntityPromises);
}

const InMemoryHashCache = new Map<PapyrusGame, Promise<string>>();

export async function generateSearchIndexHash(game: PapyrusGame): Promise<string> {
    if (InMemoryHashCache.has(game)) return await InMemoryHashCache.get(game)!;

    const str = JSON.stringify(game);
    const promise = crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(hashBuffer => {
        const hashArray = Array.from(new Uint32Array(hashBuffer));
        return hashArray.map(b => b.toString(32)).join('');
    });

    InMemoryHashCache.set(game, promise);
    return await promise;
}
