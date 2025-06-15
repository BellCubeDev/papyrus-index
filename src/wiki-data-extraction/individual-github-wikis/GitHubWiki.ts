import type { PapyrusScriptSourceIndexed } from "../../papyrus/data-structures/indexing/scriptSource";
import type { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import type { GitHubWikiData, GitHubWikiEventData, GitHubWikiFunctionData } from "./types";

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
