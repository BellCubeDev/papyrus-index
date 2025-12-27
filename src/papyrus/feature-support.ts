import { PapyrusGame } from "@/papyrus/data-structures/pure/game";

export enum PapyrusFeature {
    /** Compiler targets includes flags such as "DebugOnly" and "BetaOnly" */
    CompilerTargets = "compiler_targets",

    Structs = "structs",

    ScriptNamespaces = "script_namespaces",
    ConstScriptFlag = "const_script_flag",
    DefaultScriptFlag = "default_script_flag",
    NativeScriptFlag = "native_script_flag",

    PropertyGroups = "property_groups",
    ConstPropertyFlag = "const_property_flag",
    MandatoryPropertyFlag = "mandatory_property_flag",
}

export type PapyrusFeatureSupport = Record<PapyrusGame, boolean>;

export const PapyrusFeatureSupport = {
    [PapyrusFeature.CompilerTargets]: {
        [PapyrusGame.SkyrimSE]: false,
        [PapyrusGame.Fallout4]: true,
        [PapyrusGame.Fallout76]: true,
        [PapyrusGame.Starfield]: true,
    },

    [PapyrusFeature.Structs]: {
        [PapyrusGame.SkyrimSE]: false,
        [PapyrusGame.Fallout4]: true,
        [PapyrusGame.Fallout76]: true,
        [PapyrusGame.Starfield]: true,
    },

    [PapyrusFeature.ScriptNamespaces]: {
        [PapyrusGame.SkyrimSE]: false,
        [PapyrusGame.Fallout4]: true,
        [PapyrusGame.Fallout76]: true,
        [PapyrusGame.Starfield]: true,
    },
    [PapyrusFeature.ConstScriptFlag]: {
        [PapyrusGame.SkyrimSE]: false,
        [PapyrusGame.Fallout4]: true,
        [PapyrusGame.Fallout76]: true,
        [PapyrusGame.Starfield]: true,
    },
    [PapyrusFeature.DefaultScriptFlag]: {
        [PapyrusGame.SkyrimSE]: false,
        [PapyrusGame.Fallout4]: true,
        [PapyrusGame.Fallout76]: true,
        [PapyrusGame.Starfield]: true,
    },
    [PapyrusFeature.NativeScriptFlag]: {
        [PapyrusGame.SkyrimSE]: false,
        [PapyrusGame.Fallout4]: true,
        [PapyrusGame.Fallout76]: true,
        [PapyrusGame.Starfield]: true,
    },

    [PapyrusFeature.PropertyGroups]: {
        [PapyrusGame.SkyrimSE]: false,
        [PapyrusGame.Fallout4]: true,
        [PapyrusGame.Fallout76]: true,
        [PapyrusGame.Starfield]: true,
    },
    [PapyrusFeature.ConstPropertyFlag]: {
        [PapyrusGame.SkyrimSE]: false,
        [PapyrusGame.Fallout4]: true,
        [PapyrusGame.Fallout76]: true,
        [PapyrusGame.Starfield]: true,
    },
    [PapyrusFeature.MandatoryPropertyFlag]: {
        [PapyrusGame.SkyrimSE]: false,
        [PapyrusGame.Fallout4]: true,
        [PapyrusGame.Fallout76]: true,
        [PapyrusGame.Starfield]: true,
    },
} as const satisfies Record<PapyrusFeature, PapyrusFeatureSupport>;

export type PapyrusFeatureSupported<TFeature extends PapyrusFeature, TGame extends PapyrusGame> = typeof PapyrusFeatureSupport[TFeature][TGame];
type PapyrusFeatureSupportedGamesBase<TFeature extends PapyrusFeature> = {
    [TGameIter in PapyrusGame]: PapyrusFeatureSupported<TFeature, TGameIter> extends true ? TGameIter : never
}[PapyrusGame];
export type PapyrusFeatureSupportedGames<TFeature extends PapyrusFeature, TGame extends PapyrusGame = PapyrusGame> = Extract<TGame, PapyrusFeatureSupportedGamesBase<TFeature>>;
export type PapyrusFeatureUnsupportedGames<TFeature extends PapyrusFeature, TGame extends PapyrusGame = PapyrusGame> = Exclude<TGame, PapyrusFeatureSupportedGames<TFeature, TGame>>;

export function isPapyrusFeatureSupported<TFeature extends PapyrusFeature, TGame extends PapyrusGame>(feature: TFeature, game: TGame): game is PapyrusFeatureSupportedGames<TFeature, TGame> {
    return PapyrusFeatureSupport[feature][game];
}
