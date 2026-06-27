import type { PapyrusGame } from "@/papyrus/data-structures/pure/game";

export const keywordSets = {

    games: {
        Fallout4: [
            // Game name
            'Fallout',
            'Fallout 4',

            // xSE
            'F4SE',
            'xSE'
        ],
        Fallout76: [
            // Game name
            'FO76',
            'Fallout 76',

            // xSE -- none for FO76
        ],
        SkyrimSE: [
            // Game name
            'Skyrim',
            'The Elder Scrolls V',
            'TESV',
            'Skyrim Special Edition',
            'SSE',

            // xSE
            'SKSE',
            'xSE'
        ],
        Starfield: [
            // Game name
            'Starfield',

            // xSE
            'SFSE',
            'xSE'
        ],
    } satisfies Record<PapyrusGame, readonly string[]>,

    dataTypes: {
        game: [
            'all scripts',
            'list of papyrus extenders',
            'list of papyrus mods'
        ],
        source: [
            'all scripts',
        ],
        function: [
            'Function',
            'Method',
        ],
        event: [
            'Event',
        ],
        property: [
            'Property',
        ],
        script: [
            'Script',
        ],
        struct: [
            'Struct',
        ],
    } satisfies Record<string, readonly string[]>,

    general: [
        'Papyrus',
        'Creation Engine',
        'Creation Kit',
        'Bethesda',
        'Modding',
        'Scripting',
        'Script',
        'Index',
        'Database',
        'Search',
        'Lookup',
        'Script Extender',
        'Papyrus Extender',
        'xSE',
        'Nexus Mods',
        'CK',
        'Mod',
    ]
} as const;

export type PapyrusDataType = keyof typeof keywordSets.dataTypes;

export function getKeywords(settings: {
    game: PapyrusGame | null,
    dataTypes: [PapyrusDataType, ...PapyrusDataType[]] | 'ERROR',
    additionalKeywords: readonly string[] | null,
}): string[] {
    const { game, dataTypes, additionalKeywords } = settings;

    const keywordSet = new Set<string>();

    if (game) {
        for (const keyword of keywordSets.games[game]) keywordSet.add(keyword);
    } else {
        for (const keywords of Object.values(keywordSets.games))
            for (const keyword of keywords) keywordSet.add(keyword);
    }

    if (dataTypes !== 'ERROR') {
        for (const dataType of dataTypes)
            for (const keyword of keywordSets.dataTypes[dataType]) keywordSet.add(keyword);
    }

    if (additionalKeywords)
        for (const keyword of additionalKeywords) keywordSet.add(keyword);

    for (const keyword of keywordSets.general) keywordSet.add(keyword);

    return Array.from(keywordSet);
}
