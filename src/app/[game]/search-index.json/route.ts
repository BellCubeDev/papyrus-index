import { NextResponse, type NextRequest } from "next/server";
import { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { AllScripts } from "../../../papyrus/parsing/parse-or-load-all";
import { toLowerCase } from "../../../utils/toLowerCase";
import fuzzysort from 'fuzzysort';
import { getWikiDataFunctionPage } from "../../../wikimedia/GetWikiDataFunctionPage";
import { getGameFromParams, type GameRouteParams } from "../getGameFromParams";
import { PapyrusScriptTypeArchetype, type PapyrusScriptType } from "../../../papyrus/data-structures/pure/type";
import { UnreachableError } from "../../../UnreachableError";
import { stripMD } from "../../../utils/stripMD";
import { SearchIndexEntityType, type SearchIndexEntity } from "./SearchIndexEntity";
import { papyrusTypeToString } from "../../components/papyrus/type/PapyrusType";


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
