import type { PapyrusScriptSourceIndexed } from "../../papyrus/data-structures/indexing/scriptSource";
import type { PapyrusScriptFunction } from "../../papyrus/data-structures/pure/function";
import type { PapyrusGame } from "../../papyrus/data-structures/pure/game";

export interface GitHubWikiDataPiece<TGame extends PapyrusGame> {
    linkToWikiData: string;
}

export interface GitHubWikiScriptDataPiece<TGame extends PapyrusGame> extends GitHubWikiDataPiece<TGame> {
    name: Lowercase<string>;
}


export interface GitHubWikiFunctionData<TGame extends PapyrusGame> extends GitHubWikiScriptDataPiece<TGame> {
    description: string | null;
    isFunctionDeprecated: boolean | null;
    /** The name of the event, in this same file, that this function controls registration for */
    controlsEventRegistrationFor: Lowercase<string>[] | null;
}

export interface GitHubWikiEventData<TGame extends PapyrusGame> extends GitHubWikiScriptDataPiece<TGame> {
    description: string | null;
    /** The names of any functions, in this same file, that control registration for this event */
    registrationControlFunctions: Lowercase<string>[] | null;
}

export interface GitHubWikiDataScript<TGame extends PapyrusGame> extends GitHubWikiDataPiece<TGame> {
    functions: Record<Lowercase<string>, GitHubWikiFunctionData<TGame>>;
    events: Record<Lowercase<string>, GitHubWikiEventData<TGame>>;
}

export interface GitHubWikiData<TGame extends PapyrusGame> extends GitHubWikiDataPiece<TGame> {
    isPubliclyEditable: boolean;
    scripts: Record<Lowercase<string>, GitHubWikiDataScript<TGame>>;
    sourceDescription: string | null;
}

export abstract class GitHubWiki<TGame extends PapyrusGame> {
    constructor(public readonly source: PapyrusScriptSourceIndexed<TGame>) {

    }

    private __dataPromise: Promise<GitHubWikiData<TGame>> | null = null;
    protected abstract getDataDirect(): Promise<GitHubWikiData<TGame>>

    async getData() {
        return await (this.__dataPromise ??= this.getDataDirect());
    }

    async getFunction(script: Lowercase<string>, name: Lowercase<string>): Promise<GitHubWikiFunctionData<TGame> | null> {
        const data = await this.getData();

        const scriptData = data.scripts[script];
        if (!scriptData) return null;

        const functionData = scriptData.functions[name];
        if (!functionData) return null;

        return functionData;
    }

    async getEvent(script: Lowercase<string>, name: Lowercase<string>): Promise<GitHubWikiEventData<TGame> | null> {
        const data = await this.getData();

        const scriptData = data.scripts[script];
        if (!scriptData) return null;

        const eventData = scriptData.events[name];
        if (!eventData) return null;

        return eventData;
    }
}

export type GitHubWikiWithConcreteConstructor<TGame extends PapyrusGame> = new (...args: ConstructorParameters<typeof GitHubWiki<TGame>>) => GitHubWiki<TGame>;
