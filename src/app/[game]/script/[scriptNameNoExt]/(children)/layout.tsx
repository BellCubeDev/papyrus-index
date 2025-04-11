import type { Metadata } from "next";
import { getGameName } from "../../../../../utils/getGameName";
import { getBestNameVariant } from "../../../../../utils/getBestName";
import { AllSourcesCombined } from "../../../../../papyrus/data-structures/indexing/game";
import { getGameAndScriptFromParams, type ScriptRouteParams } from "../getGameAndScriptFromParams";
import styles from './ScriptLayout.module.scss';
import { PapyrusScriptReference } from "../../../../components/papyrus/script/PapyrusScriptReference";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScroll } from "@fortawesome/free-solid-svg-icons";

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
    const {game, scriptBySources} = getGameAndScriptFromParams(await params);

    return <>
        <div className={styles.scriptBanner}>
            <FontAwesomeIcon icon={faScroll} className={styles.backArrow!} />
            <span>Member of the <PapyrusScriptReference game={game} scriptAggregate={scriptBySources[AllSourcesCombined]} /> script</span>
        </div>
        {children}
    </>;
}
