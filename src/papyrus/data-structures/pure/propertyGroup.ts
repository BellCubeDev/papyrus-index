import type { PapyrusFeature, PapyrusFeatureSupportedGames } from "@/papyrus/feature-support";
import type { PapyrusScriptDocumentable } from "./documentable";
import type { PapyrusGame } from "./game";
import type { PapyrusScriptProperty } from "./property";

export enum PapyrusCollapsedSpecifier {
    Never = 'Never',
    OnRef = 'OnRef',
    OnBase = 'OnBase',
    Always = 'Always',
}

export interface PapyrusScriptPropertyGroup<TGame extends PapyrusGame> extends PapyrusScriptDocumentable {
    collapsed: PapyrusCollapsedSpecifier.Never | (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.PropertyGroups> ? PapyrusCollapsedSpecifier : never);
    name: string;
    properties: Record<Lowercase<string>, PapyrusScriptProperty<TGame>>;
}
