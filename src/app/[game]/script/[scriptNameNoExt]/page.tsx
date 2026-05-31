import type { Metadata } from "next";
import { AllSourcesCombined } from "../../../../papyrus/data-structures/indexing/game";
import { AllScriptsIndexed } from "../../../../papyrus/indexing/index-all";
import { getBestStringVariant } from "../../../../utils/getBestName";
import { getGameName } from "../../../../utils/getGameName";
import { GuardEmptyList } from "../../../components/GuardEmptyList";
import { InheritanceDisplay } from "../../../components/inheritance-display/InheritanceDisplay";
import { PapyrusFunctionSignatureVariants } from "../../../components/papyrus/function/signature/FunctionSignatureVariants";
import { SourceName } from "../../../components/papyrus/SourceName";
import { getGameAndScriptFromParams, type ScriptRouteParams } from "./getGameAndScriptFromParams";
import styles from './ScriptPage.module.scss';
import { PapyrusTypeWithValue } from "../../../components/papyrus/type/PapyrusType";
import { toLowerCase } from "../../../../utils/toLowerCase";
import { SourcesList, sourcesSortFn } from "../../../components/papyrus/SourcesList";
import { JsonLDGraph } from "../../../components/JsonLDGraph";
import { prepareUrlPart, prepareUrlParts } from "../../../../utils/prepareUrlParts";
import type { APIReference, BreadcrumbList, ComputerLanguage } from "schema-dts";
import { _ } from "ajv";
import { isPapyrusFeatureSupported, PapyrusFeature } from "@/papyrus/feature-support";
import { PapyrusEventSignatureVariants } from "@/app/components/papyrus/event/signature/EventSignatureVariants";

export function generateStaticParams(): ScriptRouteParams[] {
    const params: [complexity: number, paramObj: ScriptRouteParams][] = [];

    for (const [game, gameData] of Object.entries(AllScriptsIndexed)) {
        for (const [scriptNameLowercase, scriptData] of Object.entries(gameData.scripts)) {
            params.push([
                Object.keys(scriptData[AllSourcesCombined].functions).length + Object.keys(scriptData[AllSourcesCombined].propertyGroups).length + Object.keys(scriptData[AllSourcesCombined].events).length + Object.keys(scriptData[AllSourcesCombined].structs ?? {}).length,
                {game: prepareUrlPart(game), scriptNameNoExt: prepareUrlPart(scriptNameLowercase)}
            ]);
        }
    }

    // Sorting lets us control which pages should be built first by Next.js (and how they should be spread across workers)
    return params.sort(([complexityA], [complexityB]) => complexityA - complexityB ).map(([_complexity, paramObj]) => paramObj);
}

export async function generateMetadata({params}: {readonly params: Promise<ScriptRouteParams>}): Promise<Metadata> {
    const {game, scriptBySources} = getGameAndScriptFromParams(await params);

    const sourceIDs = Object.keys(scriptBySources);
    const sourceNames = sourceIDs.map(sourceId => AllScriptsIndexed[game].scriptSources[sourceId]!).sort(sourcesSortFn).map((source)=>SourceName({source, long: true}));

    if (sourceNames.length === 0) throw new Error('A script should have at least one source! Makes no sense for it to not have a source! Something is VERY wrong here.');
    const sourcesList = sourceNames.length === 1 ? sourceNames[0] : sourceNames.length === 2 ? sourceNames.join(' and ') : `${sourceNames.slice(0, -1).join(', ')}, and ${sourceNames.at(-1)}`;

    const scriptName = getBestStringVariant(scriptBySources[AllSourcesCombined].namespaceName)![1];

    return {
        title: scriptName,
        description: `Reference page for the ${scriptName} script in ${getGameName(game)}. This script is found in ${sourcesList}.`,
    };
}

export default async function ScriptPage({params}: {readonly params: Promise<ScriptRouteParams>}) {
    const {game, scriptBySources} = getGameAndScriptFromParams(await params);

    const sourceIDs = Object.keys(scriptBySources);

    const scriptNamespaceName = getBestStringVariant(scriptBySources[AllSourcesCombined].namespaceName)![1];

    return <>
        <main>
            <div className={styles.scriptHeader}>
                <h1>{scriptNamespaceName}</h1>
                <SourcesList sourceIDs={sourceIDs} game={game} />
                <div className={styles.extendsList}></div> { /* TODO: Add the scripts that this script extends to the script page */ }
            </div>
            <br />
            <details suppressHydrationWarning>
                <summary>Inheritance Tree</summary>
                <InheritanceDisplay game={game} data={scriptBySources[AllSourcesCombined].extendedBy} />
            </details>
            {isPapyrusFeatureSupported(PapyrusFeature.Structs, game) ?
                <details suppressHydrationWarning>
                    <summary>Structs</summary>
                    <p>The Papyrus Index is still under construction. Structs have not been implemented yet.</p>
                    <div className={styles.structs}></div> { /* TODO: Add structs to the script page */ }
                </details>
            : null}
            <details suppressHydrationWarning>
                {/* Include property groups here too! */}
                <summary>Properties</summary>

                <GuardEmptyList replacement={<p>No properties found.</p>}>
                    {Object.entries(scriptBySources[AllSourcesCombined].propertyGroups).map(([groupName, group]) => <div key={groupName}>
                        <h2>{group.name}</h2>
                        <div className={styles.properties}>
                            {Object.entries(group.properties).map(([propName, prop]) => <div key={propName}>
                                <div className={styles.property}>
                                    <PapyrusTypeWithValue game={game} type={prop.value[0]![1]} name={propName} />
                                </div>
                            </div>)}
                        </div>
                    </div>)}
                </GuardEmptyList>

                <div className={styles.properties}></div> { /* TODO: Add properties to the script page */ }
            </details>
            <details suppressHydrationWarning>
                <summary>Events</summary>
                <div className={styles.events}>
                    <GuardEmptyList replacement={<p>No events found.</p>}>
                        {Object.entries(scriptBySources[AllSourcesCombined].events).map(([evtName, variants]) => <div key={evtName}>
                            <PapyrusEventSignatureVariants game={game} evtAggregate={variants} scriptName={scriptNamespaceName} />
                        </div>)}
                    </GuardEmptyList>
                </div>
            </details>
            <details suppressHydrationWarning>
                <summary>Functions</summary>
                <div className={styles.functions}>
                    <GuardEmptyList replacement={<p>No functions found.</p>}>
                        {Object.entries(scriptBySources[AllSourcesCombined].functions).map(([funcName, variants]) => <div key={funcName}>
                            <PapyrusFunctionSignatureVariants game={game} funcAggregate={variants} scriptName={scriptNamespaceName} />
                        </div>)}
                    </GuardEmptyList>
                </div>
            </details>

        </main>
        <JsonLDGraph data={[
            {
                "@type": "APIReference",
                "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', scriptBySources[AllSourcesCombined].namespaceName[0]![1])}#script`,
                url: `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', scriptBySources[AllSourcesCombined].namespaceName[0]![1])}`,
                mainEntityOfPage: {"@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', scriptBySources[AllSourcesCombined].namespaceName[0]![1])}#script`},
                isPartOf: { "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game)}#game` },
                name: `${scriptNamespaceName} script reference for ${getGameName(game)}`,
                about: { "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game)}#game` },
                description: `Reference page for the ${scriptNamespaceName} script in ${getGameName(game)}.`,
                ["programmingLanguage" as never]: {
                    "@type": "ComputerLanguage",
                    name: "Papyrus",
                } satisfies ComputerLanguage,
            } satisfies APIReference,
            {
                "@type": "SoftwareSourceCode",
                "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', scriptBySources[AllSourcesCombined].namespaceName[0]![1])}#code`,
                url: `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', scriptBySources[AllSourcesCombined].namespaceName[0]![1])}#code`,
                mainEntityOfPage: { "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', scriptBySources[AllSourcesCombined].namespaceName[0]![1])}#script` },
                isPartOf: [
                    { "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game)}#game` },
                    ...sourceIDs.map(sourceId => ({ "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'source', sourceId)}#source` }))
                ],
                isBasedOn: Array.from(new Set(scriptBySources[AllSourcesCombined].extendsName.map((([_sourceIdentifier, scriptName]) => scriptName && toLowerCase(scriptName))))).filter((s): s is NonNullable<typeof s> => Boolean(s)).map(extendedScriptName => ({
                    "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', extendedScriptName)}#script`,
                })),
                programmingLanguage: "Papyrus",
                codeSampleType: "class",
                name: scriptNamespaceName,
                about: { "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game)}#game` },
                hasPart: [
                    ...Object.entries(scriptBySources[AllSourcesCombined].functions).map(([funcName, _variants]) => ({
                        "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', scriptBySources[AllSourcesCombined].namespaceName[0]![1], 'function', funcName)}#function`,
                    })),
                    //...Object.entries(scriptBySources[AllSourcesCombined].events).map(([eventName, _event]) => ({
                    //    "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', scriptBySources[AllSourcesCombined].namespaceName[0]![1], 'event', eventName)}#event`,
                    //})),
                    //...Object.entries(scriptBySources[AllSourcesCombined].structs ?? {}).map(([structName, _struct]) => ({
                    //    "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', scriptBySources[AllSourcesCombined].namespaceName[0]![1], 'struct', structName)}#struct`,
                    //}))
                ],
            },
            {
                "@type": "BreadcrumbList",
                "@id": `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', scriptBySources[AllSourcesCombined].namespaceName[0]![1])}#breadcrumb`,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: "https://papyrus.bellcube.dev/",
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: getGameName(game),
                        item: `https://papyrus.bellcube.dev${prepareUrlParts(game)}`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: scriptNamespaceName,
                        item: `https://papyrus.bellcube.dev${prepareUrlParts(game, 'script', scriptBySources[AllSourcesCombined].namespaceName[0]![1])}`,
                    }
                ]
            } satisfies BreadcrumbList,
        ]} />
    </>;
}
