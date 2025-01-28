import type { Metadata } from "next";
import { AllSourcesCombined } from "../../../../papyrus/data-structures/indexing/game";
import { AllScriptsIndexed } from "../../../../papyrus/indexing/index-all";
import { getBestNameVariant } from "../../../../utils/getBestName";
import { getGameName } from "../../../../utils/getGameName";
import { GuardEmptyList } from "../../../components/GuardEmptyList";
import { InheritanceDisplay } from "../../../components/inheritance-display/InheritanceDisplay";
import { PapyrusFunctionSignatureVariants } from "../../../components/papyrus/function/signature/FunctionSignatureVariants";
import { SourceName } from "../../../components/papyrus/SourceName";
import { getGameAndScriptFromParams, type ScriptRouteParams } from "./getGameAndScriptFromParams";
import styles from './ScriptPage.module.scss';
import { PapyrusTypeWithValue } from "../../../components/papyrus/type/PapyrusType";
import { toLowerCase } from "../../../../utils/toLowerCase";

export function generateStaticParams(): ScriptRouteParams[] {
    const params: [complexity: number, paramObj: ScriptRouteParams][] = [];

    for (const [game, gameData] of Object.entries(AllScriptsIndexed)) {
        for (const [scriptNameLowercase, scriptData] of Object.entries(gameData.scripts)) {
            params.push([
                Object.keys(scriptData[AllSourcesCombined].functions).length + Object.keys(scriptData[AllSourcesCombined].propertyGroups).length + Object.keys(scriptData[AllSourcesCombined].events).length + Object.keys(scriptData[AllSourcesCombined].structs).length,
                {game: toLowerCase(game), scriptNameNoExt: scriptNameLowercase}
            ]);
        }
    }

    // Sorting lets us control which pages should be built first by Next.js (and how they should be spread across workers)
    return params.sort(([complexityA], [complexityB]) => complexityA - complexityB ).map(([_complexity, paramObj]) => paramObj);
}

export async function generateMetadata({params}: {readonly params: Promise<ScriptRouteParams>}): Promise<Metadata> {
    const {game, scriptBySources} = getGameAndScriptFromParams(await params);

    const sourceIDs = Object.keys(scriptBySources);
    const sourceNames = sourceIDs.map((sourceId)=>SourceName({source: AllScriptsIndexed[game].scriptSources[sourceId]!, long: true}));

    if (sourceNames.length === 0) throw new Error('A script should have at least one source! Makes no sense for it to not have a source! Something is VERY wrong here.');
    const sourcesList = sourceNames.length === 1 ? sourceNames[0] : sourceNames.length === 2 ? sourceNames.join(' and ') : `${sourceNames.slice(0, -1).join(', ')}, and ${sourceNames.at(-1)}`;

    return {
        title: getBestNameVariant(scriptBySources[AllSourcesCombined].name)[1],
        description: `Reference page for the ${getBestNameVariant(scriptBySources[AllSourcesCombined].name)[1]} script in ${getGameName(game)}. This script is provided by ${sourcesList}.`,
    };
}

export default async function ScriptPage({params}: {readonly params: Promise<ScriptRouteParams>}) {
    const {game, scriptBySources} = getGameAndScriptFromParams(await params);

    const _sourceIDs = Object.keys(scriptBySources);

    const namespaceNamePart = scriptBySources[AllSourcesCombined].namespace[0]![1] === null ? '' : `${getBestNameVariant(scriptBySources[AllSourcesCombined].namespace as [Lowercase<string>[], string][])[1]}:`;
    const scriptName = namespaceNamePart + getBestNameVariant(scriptBySources[AllSourcesCombined].name)[1];

    return <>
        <div className={styles.scriptHeader}>
            <h1>{scriptName}</h1>
            <div className={styles.extendsList}>
            </div>
        </div>
        <details>
            <summary>Inheritance Tree</summary>
            <InheritanceDisplay game={game} data={scriptBySources[AllSourcesCombined].extendedBy} />
        </details>
        <details>
            <summary>Structs</summary>
            <div className={styles.structs}></div>
        </details>
        <details>
            {/* Include property groups here too! */}
            <summary>Properties</summary>
            {Object.entries(scriptBySources[AllSourcesCombined].propertyGroups).map(([groupName, groupVariants]) => <div key={groupName}>
                {groupVariants.map(([sources, group]) => <div key={sources.join('/')}>
                    <h2>{group.name}</h2>
                    <div className={styles.properties}>
                        {Object.entries(group.properties).map(([propName, prop]) => <div key={propName}>
                            <div className={styles.property}>
                                <PapyrusTypeWithValue game={game} type={prop.value} name={propName} />
                            </div>
                        </div>)}
                    </div>
                </div>)}
            </div>)}

            <div className={styles.properties}></div>
        </details>
        <details>
            <summary>Events</summary>
            <div className={styles.events}></div>
        </details>
        <details>
            <summary>Functions</summary>
            <div className={styles.functions}>
                <GuardEmptyList replacement={<p>No functions found.</p>}>
                    {Object.entries(scriptBySources[AllSourcesCombined].functions).map(([funcName, variants]) => <div key={funcName}>
                        <PapyrusFunctionSignatureVariants game={game} variants={variants} scriptName={scriptName} />
                    </div>)}
                </GuardEmptyList>
            </div>
        </details>

    </>;

}
