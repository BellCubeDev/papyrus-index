
export interface GitHubWikiDataPiece {
    linkToWikiData: string;
}

export interface GitHubWikiScriptDataPiece extends GitHubWikiDataPiece {
    name: Lowercase<string>;
    exampleMDs: string[];
    descriptionMD: string | null;
    notesMD: string | null;
}

export interface GitHubWikiFunctionOrEventParameterData extends GitHubWikiScriptDataPiece {
}

export interface GitHubWikiFunctionData extends GitHubWikiScriptDataPiece {
    returnValueDescriptionMD: string | null;
    isFunctionDeprecated: boolean | null;
    deprecatedFor: Lowercase<string> | null;
    /** The name of the event, in this same file, that this function controls registration for */
    controlsEventRegistrationFor: Lowercase<string>[] | null;
    parameters: Record<Lowercase<string>, GitHubWikiFunctionOrEventParameterData>;
}

export interface GitHubWikiEventData extends GitHubWikiScriptDataPiece {
    /** The names of any functions, in this same file, that control registration for this event */
    registrationControlFunctions: Lowercase<string>[] | null;
    parameters: Record<Lowercase<string>, GitHubWikiFunctionOrEventParameterData>;
}

export interface GitHubWikiPropertyData extends GitHubWikiScriptDataPiece {
    /** How the property is intended to be used, if the property is part of an SDK (such as with SkyUI's `SKI_ConfigBase.Pages` property) */
    sdkUsageMD: string | null;
}

export interface GitHubWikiScriptData extends GitHubWikiDataPiece {
    functions: Record<Lowercase<string>, GitHubWikiFunctionData>;
    events: Record<Lowercase<string>, GitHubWikiEventData>;
    properties: Record<Lowercase<string>, GitHubWikiPropertyData>;
}

export interface GitHubWikiData extends GitHubWikiDataPiece {
    isPubliclyEditable: boolean;
    scripts: Record<Lowercase<string>, GitHubWikiScriptData>;
    sourceDescriptionMD: string | null;
}
