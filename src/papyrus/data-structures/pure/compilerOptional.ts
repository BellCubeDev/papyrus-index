import type { PapyrusFeature, PapyrusFeatureSupportedGames } from "@/papyrus/feature-support";
import type { PapyrusGame } from "./game";

export interface PapyrusCompilerOptional<TGame extends PapyrusGame> {
    /** If true, this object and all uses of it will be compiled out in non-debug builds */
    isDebugOnly: (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.CompilerTargets> ? boolean : never) | false;
    /** If true, this object and all uses of it will be compiled out in non-debug non-beta builds */
    isBetaOnly: (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.CompilerTargets> ? boolean : never) | false;
}
