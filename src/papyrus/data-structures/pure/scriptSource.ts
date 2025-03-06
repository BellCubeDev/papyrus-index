import type { PapyrusGame } from "./game";
import type { PapyrusScript } from "./script";

export enum PapyrusSourceType {
    /** This source is the vanilla game */
    Vanilla = 'Vanilla',
    /** This source is the game's Script Extender */
    xSE = 'xSE',
    /**
     * This source is a Script Extender plugin whose entire goal is to add new Papyrus functions
     *
     * May include additional pure-Papyrus functions (e.g. Dylbills Papyrus Functions)
     *
     * Examples:
     * * PO3's Papyrus Extender
     * * PapyrusUtil
     * * Dylbills Papyrus Functions
    */
    xSePluginExtender = 'xSE Plugin (Only An Extender)',
    /**
     * This source is a Script Extender plugin that functions as a standalone mod---but
     * nonetheless exposes enable new capabilities to Papyrus scripts.
     *
     * May include additional pure-Papyrus functions (e.g. CACO)
     *
     * Examples:
     * * CACO
     * * Simply Knock
     * * DynDOLOD
    */
    xSePluginIncidental = 'xSE Plugin (Incidentally An Extender)',
    /**
     * A standalone third-party mod with an API to interact with it
     *
     * Examples:
     * * Campfire
     * * FO4's MCM
    */
    Standalone = 'Standalone Mod',
    /**
     * A pure-Papyrus collection of utilities
     *
     * Examples:
     * * cLib
    */
    PapyrusLib = 'Papyrus-Only Library',
}

// TODO: Better metadata for third-party mods
// * Contrast dedicated, side-effect-less Papyrus extenders with extenders that do stuff on their own but have an API
// * Allow for non-extender Papyrus APIs to be indexed

export interface PapyrusScriptSourceScriptData<TGame extends PapyrusGame> {
    /** Unique per-game identifier (folder name) for this source */
    sourceIdentifier: Lowercase<string>;

    /**  Scripts contained by this source */
    scripts: Record<Lowercase<string>, PapyrusScript<TGame>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- may be used later
export interface PapyrusScriptSourceMetadataBase<TGame extends PapyrusGame> {
    type: PapyrusSourceType;

    /** The latest applicable version of this source being indexed. If the source provides an SDK and the version differs from the main download, prefer the SDK version. */
    indexedVersion: string;

    /** Scripts to be parsed for this source. Intended to be used by auto-downloaded sources which may include many uninteresting scripts. */
    allowedScripts?: string[];
}

export interface PapyrusScriptSourceMetadataVanilla<TGame extends PapyrusGame> extends PapyrusScriptSourceMetadataBase<TGame> {
    type: PapyrusSourceType.Vanilla;
}

export interface PapyrusScriptSourceWithExternalStuff<TGame extends PapyrusGame> extends PapyrusScriptSourceMetadataBase<TGame> {
    type: Exclude<PapyrusSourceType, PapyrusSourceType.Vanilla>;

    /** The proper name of this source. For example, "powerofthree's Papyrus Extender" */
    nameProper: string;
    /** The shortened name of this source. For example, "PO3" */
    nameShort: string;

    /** A link to source's page on Nexus Mods, if applicable
     *
     * If this source has a .download indicator, this field may not be null.
    */
    nexusPage: string | null;

    /** The Nexus Mods file ID for the indexed version of this source, if applicable.
     *
     * If this source has a .download indicator, this field may not be null.
    */
    nexusIndexedFileId: number | null;

    /** A link to the mod page on author's preferred platform, if not Nexus Mods
     *
     * For example, AFK Mods or Let's Play with Fire
     */
    preferredModPage?: string;
}

export interface PapyrusScriptSourceMetadataXSE<TGame extends PapyrusGame> extends PapyrusScriptSourceWithExternalStuff<TGame> {
    type: PapyrusSourceType.xSE;

    /** Link to the script extender's page on the Silverlock website, e.g https://skse.silverlock.org */
    silverlockPage: string;
}

export interface PapyrusScriptSourceMetadataWithGitHub<TGame extends PapyrusGame> extends PapyrusScriptSourceWithExternalStuff<TGame> {
    type: PapyrusSourceType.xSePluginExtender | PapyrusSourceType.xSePluginIncidental | PapyrusSourceType.Standalone | PapyrusSourceType.PapyrusLib | PapyrusSourceType.Standalone;

    /** A link to this source's GitHub/GitLab/etc. repository, if applicable */
    gitRepo: string | null;
}

export type PapyrusScriptSourceMetadataExternal<TGame extends PapyrusGame> = PapyrusScriptSourceMetadataXSE<TGame> | PapyrusScriptSourceMetadataWithGitHub<TGame>;
export type PapyrusScriptSourceMetadata<TGame extends PapyrusGame> = PapyrusScriptSourceMetadataVanilla<TGame> | PapyrusScriptSourceMetadataExternal<TGame>;
export type PapyrusScriptSource<TGame extends PapyrusGame> = PapyrusScriptSourceScriptData<TGame> & PapyrusScriptSourceMetadata<TGame>;
