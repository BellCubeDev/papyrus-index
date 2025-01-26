import type { PapyrusGame } from "./game";

export interface PapyrusCompilerOptional<TGame extends PapyrusGame> {
    /** If true, this object and all uses of it will be compiled out in non-debug builds */
    isDebugOnly: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | false;
    /** If true, this object and all uses of it will be compiled out in non-debug non-beta builds */
    isBetaOnly: (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | false;
}
