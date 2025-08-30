import { NextResponse, type NextRequest } from "next/server";
import { PapyrusGame, type PapyrusGameData } from "../../../papyrus/data-structures/pure/game";
import { toLowerCase } from "../../../utils/toLowerCase";
import { AllScripts } from "../../../papyrus/parsing/parse-or-load-all";
import { SearchEntityBaseTypeMapping, SearchIndexEntitiesRecordRawType, SearchIndexEntityType } from "../../search/Entity";
import { AllScriptsIndexed } from "../../../papyrus/indexing/index-all";
import { getGameFromParams } from "../getGameFromParams";
import type { PapyrusScriptIndexedAggregate } from "../../../papyrus/data-structures/indexing/script";
import type { PapyrusScriptEventOrBaseFunctionIndexedAggregate, PapyrusScriptFunctionIndexedAggregate } from "../../../papyrus/data-structures/indexing/function";
import type { PapyrusScriptStructIndexedAggregate } from "../../../papyrus/data-structures/indexing/struct";
import type { PapyrusScriptPropertyIndexedAggregate } from "../../../papyrus/data-structures/indexing/property";
import { getMediaWikiFunctionData } from "../../../wiki-data-extraction/ck-wiki/data-extraction/getMediaWikiFunctionData";
import { getBestStringVariant } from "../../../utils/getBestName";
import { AllSourcesCombined } from "../../../papyrus/data-structures/indexing/game";
import { getGitHubWikiFunctionData } from "../../components/papyrus/function/signature/getGitHubWikiFunctionDescription";

const PapyrusGamesCaseMapped = new Map<string, PapyrusGame>(Object.values(PapyrusGame).map(game => [game.toLowerCase(), game]));

export type SingleExtraEntityDataRecord = { [TKey in keyof SearchIndexEntitiesRecordRawType<PapyrusGame>]: ObjectAssignDiff<SearchEntityBaseTypeMapping<PapyrusGame>[SearchIndexEntitiesRecordRawType<PapyrusGame>[TKey]['$entityType']], Omit<SearchIndexEntitiesRecordRawType<PapyrusGame>[TKey],'$entityType'>> };
export type SingleExtraEntityData = SingleExtraEntityDataRecord[keyof SingleExtraEntityDataRecord];

export interface SearchDataGETResponse {
    rawData: PapyrusGameData<PapyrusGame>;
    extraEntityData: Record<number, SingleExtraEntityData>;
}

export async function GET(_request: NextRequest | null, opts : { params: Promise<{ game: string }> }) {
    const { game } = getGameFromParams(await opts.params);

    const properCaseGame = PapyrusGamesCaseMapped.get(game.toLowerCase());
    if (properCaseGame === undefined) return NextResponse.json({ error: 'Invalid game' }, { status: 400 });

    const extraEntityData: Promise<[number, SingleExtraEntityData]>[] = [];

    for (const scriptBySources of Object.values(AllScriptsIndexed[game].scripts)) {
        extraEntityData.push(getExtraEntityDataForScript(scriptBySources[AllSourcesCombined]));

        for (const func of Object.values(scriptBySources[AllSourcesCombined].functions))
            extraEntityData.push(getExtraEntityDataForFunction(properCaseGame, func));

        for (const event of Object.values(scriptBySources[AllSourcesCombined].events))
            extraEntityData.push(getExtraEntityDataForEvent(event));

        for (const group of Object.values(scriptBySources[AllSourcesCombined].propertyGroups)) {
            for (const prop of Object.values(group.properties))
                extraEntityData.push(getExtraEntityDataForProperty(prop));
        }
        if (scriptBySources[AllSourcesCombined].structs) {
            for (const struct of Object.values(scriptBySources[AllSourcesCombined].structs))
                extraEntityData.push(getExtraEntityDataForStruct(struct));
        }
    }

    return NextResponse.json({
        rawData: AllScripts[properCaseGame],
        extraEntityData: Object.fromEntries(await Promise.all(extraEntityData)),
    } satisfies SearchDataGETResponse);
}

export function generateStaticParams() {
    return Object.values(PapyrusGame).map(game => ({ game: toLowerCase(game) }));
}

async function getExtraEntityDataForScript(script: PapyrusScriptIndexedAggregate<PapyrusGame>): Promise<[number, SingleExtraEntityDataRecord[SearchIndexEntityType.Script]]> {
    // TODO: Implement getExtraEntityDataForScript()
    return [script.$entityId, {
        ckWikiData: null,
        githubWikiData: null,
    }];
}

async function getExtraEntityDataForFunction(game: PapyrusGame, func: PapyrusScriptFunctionIndexedAggregate<PapyrusGame>): Promise<[number, SingleExtraEntityDataRecord[SearchIndexEntityType.Function]]> {
    const [githubWikiData, ckWikiData] = await Promise.all([
        getGitHubWikiFunctionData(func),
        getMediaWikiFunctionData(game, func, getBestStringVariant(func.script.namespaceName)![1])
    ]);

    return [func.$entityId, {
        ckWikiData,
        githubWikiData,
    }];
}

async function getExtraEntityDataForEvent(event: PapyrusScriptEventOrBaseFunctionIndexedAggregate<PapyrusGame>): Promise<[number, SingleExtraEntityDataRecord[SearchIndexEntityType.Event]]> {
    // TODO: Implement getExtraEntityDataForEvent()
    return [event.$entityId, {
        ckWikiData: null,
        githubWikiData: null,
    }];
}

async function getExtraEntityDataForProperty(prop: PapyrusScriptPropertyIndexedAggregate<PapyrusGame>): Promise<[number, SingleExtraEntityDataRecord[SearchIndexEntityType.Property]]> {
    // TODO: Implement getExtraEntityDataForProperty()
    return [prop.$entityId, {
        ckWikiData: null,
        githubWikiData: null,
    }];
}
async function getExtraEntityDataForStruct(struct: PapyrusScriptStructIndexedAggregate<Exclude<PapyrusGame, PapyrusGame.SkyrimSE>>): Promise<[number, SingleExtraEntityDataRecord[SearchIndexEntityType.Struct]]> {
    // TODO: Implement getExtraEntityDataForStruct()
    return [struct.$entityId, {
        ckWikiData: null,
        githubWikiData: null,
    }];
}
