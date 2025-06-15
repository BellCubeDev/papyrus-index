
export interface GitHubWikiDataPiece {
    linkToWikiData: string;
}

export interface GitHubWikiScriptDataPiece extends GitHubWikiDataPiece {
    name: Lowercase<string>;
}


export interface GitHubWikiFunctionData extends GitHubWikiScriptDataPiece {
    descriptionMD: string | null;
    isFunctionDeprecated: boolean | null;
    deprecatedFor: Lowercase<string> | null;
    /** The name of the event, in this same file, that this function controls registration for */
    controlsEventRegistrationFor: Lowercase<string>[] | null;
}

export interface GitHubWikiEventData extends GitHubWikiScriptDataPiece {
    descriptionMD: string | null;
    /** The names of any functions, in this same file, that control registration for this event */
    registrationControlFunctions: Lowercase<string>[] | null;
}

export interface GitHubWikiDataScript extends GitHubWikiDataPiece {
    functions: Record<Lowercase<string>, GitHubWikiFunctionData>;
    events: Record<Lowercase<string>, GitHubWikiEventData>;
}

export interface GitHubWikiData extends GitHubWikiDataPiece {
    isPubliclyEditable: boolean;
    scripts: Record<Lowercase<string>, GitHubWikiDataScript>;
    sourceDescriptionMD: string | null;
}
