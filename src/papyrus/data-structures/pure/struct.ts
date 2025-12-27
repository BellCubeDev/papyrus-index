import type { PapyrusFeature, PapyrusFeatureSupportedGames } from "@/papyrus/feature-support";
import type { PapyrusScriptDocumentable } from "./documentable";
import type { PapyrusScriptValue } from "./type";

export interface PapyrusScriptStruct<TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs>> extends PapyrusScriptDocumentable {
    name: string;
    members: Record<Lowercase<string>, PapyrusScriptStructMember<TGame>>;
}

export interface PapyrusScriptStructMember<_TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs>> extends PapyrusScriptDocumentable {
    name: string;
    value: PapyrusScriptValue<false, false>;
    hidden: boolean;
    mandatory: boolean;
}
