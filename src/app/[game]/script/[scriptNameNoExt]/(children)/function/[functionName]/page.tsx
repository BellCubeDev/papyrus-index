import type { Metadata } from "next";
import { AllSourcesCombined } from "../../../../../../../papyrus/data-structures/indexing/game";
import { AllScriptsIndexed } from "../../../../../../../papyrus/indexing/index-all";
import { getBestName, getBestNameVariant } from "../../../../../../../utils/getBestName";
import { getGameName } from "../../../../../../../utils/getGameName";
import { getWikiDataFunctionPage } from "../../../../../../../wikimedia/GetWikiDataFunctionPage";
import { CodeBlock, CodeBlockLanguage } from "../../../../../../components/code-block/CodeBlock";
import { GuardEmptyList } from "../../../../../../components/GuardEmptyList";
import { PapyrusFunctionSignatureVariants } from "../../../../../../components/papyrus/function/signature/FunctionSignatureVariants";
import { SourceName } from "../../../../../../components/papyrus/SourceName";
import { getGameAndScriptAndFunctionFromParams, type FunctionRouteParams } from "./getGameAndScriptAndFunctionFromParams";
import { Suspense } from "react";
import { toLowerCase } from "../../../../../../../utils/toLowerCase";
import { FunctionDocumentationStringRaw } from "../../../../../../components/papyrus/function/signature/DocumentationString";

export function generateStaticParams(): FunctionRouteParams[] {
    const params: FunctionRouteParams[] = [];
    for (const [game, gameData] of Object.entries(AllScriptsIndexed)) {
        for (const [scriptNameLowercase, scriptData] of Object.entries(gameData.scripts)) {
            for (const funcName of Object.keys(scriptData[AllSourcesCombined].functions))
                params.push({game: toLowerCase(game), scriptNameNoExt: scriptNameLowercase, functionName: funcName});
        }
    }

    return params;
}

export async function generateMetadata({params}: {readonly params: Promise<FunctionRouteParams>}): Promise<Metadata> {
    const {game, scriptBySources, func} = getGameAndScriptAndFunctionFromParams(await params);

    const sourceIDs = Object.keys(scriptBySources);
    const sourceNames = sourceIDs.map((sourceId)=>SourceName({source: AllScriptsIndexed[game].scriptSources[sourceId]!, long: true}));

    if (sourceNames.length === 0) throw new Error('A script should have at least one source! Makes no sense for it to not have a source! Something is VERY wrong here.');
    const sourcesList = sourceNames.length === 1 ? sourceNames[0] : sourceNames.length === 2 ? sourceNames.join(' and ') : `${sourceNames.slice(0, -1).join(', ')}, and ${sourceNames.at(-1)}`;

    const scriptName = getBestNameVariant(scriptBySources[AllSourcesCombined].name)[1];
    const description = await FunctionDocumentationStringRaw({game, func: func[0]![1], scriptName});
    return {
        title: getBestName(func.map(f=>f[1].name)),
        description: `${description ? `${description}\n\n` : ''}Reference page for the ${scriptName} script in ${getGameName(game)}. This script is provided by ${sourcesList}.`,
        // TODO: Add keywords relevant to the function.
        // Possibly break its name down into parts, take its parameters into account, return type, parent script, and all that fun stuff.
    };
}

export default async function FunctionPage({params}: {readonly params: Promise<FunctionRouteParams>}) {
    const {game, scriptBySources, func} = getGameAndScriptAndFunctionFromParams(await params);

    const namespaceNamePart = scriptBySources[AllSourcesCombined].namespace[0]![1] === null ? '' : `${getBestNameVariant(scriptBySources[AllSourcesCombined].namespace as [Lowercase<string>[], string][])[1]}:`;
    const scriptName = namespaceNamePart + getBestNameVariant(scriptBySources[AllSourcesCombined].name)[1];

    const wikiDataPromise = getWikiDataFunctionPage(game, func[0]![1], scriptName);

    return <>
        <p>{scriptName}</p>
        <GuardEmptyList replacement={<p>No variants of this function found.</p>}>
            <PapyrusFunctionSignatureVariants game={game} variants={func} scriptName={scriptName} longerDescription />
        </GuardEmptyList>
        <h2>Examples</h2>
        <GuardEmptyList replacement={<p>No examples found for this function. In the future, we plan to auto-generate a single example to demonstrate syntax for new Papyrus users.</p>}>

            <Suspense fallback={<p>[Development] Loading examples...</p>}>
                {wikiDataPromise.then(wikiData => wikiData?.examplesData.map((example)=><div key={example.code}>
                    <CodeBlock language={CodeBlockLanguage.Papyrus} code={example.code} />
                </div>))}
            </Suspense>

        </GuardEmptyList>

    </>;
}
