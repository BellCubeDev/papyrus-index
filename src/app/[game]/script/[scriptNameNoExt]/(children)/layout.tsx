import type { Metadata } from "next";
import { getGameName } from "../../../../../utils/getGameName";
import { getBestNameVariant } from "../../../../../utils/getBestName";
import { AllSourcesCombined } from "../../../../../papyrus/data-structures/indexing/game";
import { Link } from "../../../../components/Link";
import { toLowerCase } from "../../../../../utils/toLowerCase";
import { getGameAndScriptFromParams, type ScriptRouteParams } from "../getGameAndScriptFromParams";

export async function generateMetadata({params}: {readonly params: Promise<ScriptRouteParams>}): Promise<Metadata> {
    const {game, scriptBySources} = getGameAndScriptFromParams(await params);
    const gameName = getGameName(game);
    const scriptNamespaceName = getBestNameVariant(scriptBySources[AllSourcesCombined].namespaceName)[1];
    return {
        title: {
            template: `%s - ${scriptNamespaceName} | ${gameName} - Papyrus Index`,
            absolute: `~~ERROR~~ | ${gameName} - Papyrus Index`,
        }
    };
}

export default async function GameLayout({children, params}: {readonly children: React.ReactNode, readonly params: Promise<ScriptRouteParams>}) {
    const {game, scriptNameLowercase, scriptBySources} = getGameAndScriptFromParams(await params);
    const scriptNamespaceName = getBestNameVariant(scriptBySources[AllSourcesCombined].namespaceName)[1];

    return <div>
        <h1>Member of the <Link href={`/${toLowerCase(game)}/script/${scriptNameLowercase}` as const}>{scriptNamespaceName}</Link> script</h1>
        {children}
    </div>;
}
