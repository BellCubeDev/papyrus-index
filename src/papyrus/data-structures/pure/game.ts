import type { PapyrusScriptSource } from "./scriptSource";

export enum PapyrusGame {
    SkyrimSE = 'SkyrimSE',
    Fallout4 = 'Fallout4',
    Fallout76 = 'Fallout76',
    Starfield = 'Starfield',
}

export interface PapyrusGameData<TGame extends PapyrusGame> {
    /** The game in question */
    game: TGame;
    /** Scripts, organized by script source */
    scriptSources: Record<Lowercase<string>, PapyrusScriptSource<TGame>>;
}
