import type { PapyrusScriptSourceIndexed } from "../../papyrus/data-structures/indexing/scriptSource";
import type { PapyrusGame } from "../../papyrus/data-structures/pure/game";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export abstract class GitHubWiki<TGame extends PapyrusGame> {
    constructor(public readonly source: PapyrusScriptSourceIndexed<TGame>) {

    }

    private __dataPromise: Promise<GitHubWikiData> | null = null;
    protected abstract getDataDirect(): Promise<GitHubWikiData>

    async getData() {
        return await (this.__dataPromise ??= this.getDataDirect());
    }

    async getFunction(scriptNamespaceName: Lowercase<string>, funcName: Lowercase<string>): Promise<GitHubWikiFunctionData | null> {
        const data = await this.getData();

        //console.log(`Getting function ${funcName} in script ${scriptNamespaceName} from wiki ${this.source.sourceIdentifier}`);

        const scriptData = data.scripts[scriptNamespaceName];
        //console.log(`Script data for ${scriptNamespaceName} from wiki ${this.source.sourceIdentifier}:`, scriptData);
        if (!scriptData) return null;

        const functionData = scriptData.functions[funcName];
        //console.log(`Function data for ${funcName} in script ${scriptNamespaceName} from wiki ${this.source.sourceIdentifier}:`, functionData);
        if (!functionData) return null;

        return functionData;
    }

    async getEvent(script: Lowercase<string>, name: Lowercase<string>): Promise<GitHubWikiEventData | null> {
        const data = await this.getData();

        const scriptData = data.scripts[script];
        if (!scriptData) return null;

        const eventData = scriptData.events[name];
        if (!eventData) return null;

        return eventData;
    }
}

export type GitHubWikiWithConcreteConstructor<TGame extends PapyrusGame> = new (...args: ConstructorParameters<typeof GitHubWiki<TGame>>) => GitHubWiki<TGame>;
