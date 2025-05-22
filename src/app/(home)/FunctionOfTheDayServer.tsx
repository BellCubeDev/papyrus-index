/* eslint-disable no-bitwise */
import 'server-only';
import { Fragment } from "react";
import type { PapyrusScriptFunctionIndexedAggregate } from "../../papyrus/data-structures/indexing/function";
import { AllSourcesCombined } from "../../papyrus/data-structures/indexing/game";
import type { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import { AllScriptsIndexed } from "../../papyrus/indexing/index-all";
import { getBestNameVariant } from "../../utils/getBestName";
import { getGameName } from "../../utils/getGameName";
import { PapyrusScriptFunctionReference } from "../components/papyrus/function/reference/PapyrusScriptFunctionReference";
import { PapyrusFunctionSignatureVariants } from "../components/papyrus/function/signature/FunctionSignatureVariants";

function calculateFunctionNamePseudoRandom(value: string) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = ((hash << 5) - hash) + (value.charCodeAt(i) * (1 + (value.charCodeAt(i) % 4)));
        hash |= 0;
    }
    return Math.abs(hash);
}

export type FunctionOfTheDayFunction = {
    readonly game: PapyrusGame;
    readonly scriptNamespaceNameLowercase: Lowercase<string>;
    readonly scriptNamespaceNameVariants: [Lowercase<string>[], string][];
    readonly functionNameLowercase: Lowercase<string>;
    readonly func: PapyrusScriptFunctionIndexedAggregate<PapyrusGame>;
}

const allFunctions: FunctionOfTheDayFunction[] = Object.entries(AllScriptsIndexed).flatMap(([game, gameData]) =>
    Object.entries(gameData.scripts).flatMap(([scriptNamespaceNameLowercase, bySources]) =>
        Object.entries(bySources[AllSourcesCombined].functions).flatMap(([functionNameLowercase, func]) => ({
            game,
            scriptNamespaceNameLowercase,
            scriptNamespaceNameVariants: bySources[AllSourcesCombined].namespaceName,
            functionNameLowercase,
            func,
        }))
    )
).sort((a, b) => {
    const aHash = calculateFunctionNamePseudoRandom(a.game + a.scriptNamespaceNameLowercase + a.functionNameLowercase);
    const bHash = calculateFunctionNamePseudoRandom(b.game + b.scriptNamespaceNameLowercase + b.functionNameLowercase);
    return aHash - bHash;
});

const todaySinceEpoch = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
export  type FunctionOfTheDayOption = FunctionOfTheDayFunction & {dayNum: number};
/** Options for the function of the day so we can adjust to the user's local timezone. */
export const functionOfTheDayOptions: FunctionOfTheDayOption[] = new Array(7).fill(null).map((_, i) => {
    const dayNum = todaySinceEpoch+i-1;
    const index = dayNum % allFunctions.length;
    return Object.assign(allFunctions[index]!, {dayNum});
});

export const FunctionOfTheDayOptionsWithRendered = functionOfTheDayOptions.map(FunctionOfTheDay) as [number, React.ReactElement][];

function FunctionOfTheDay({dayNum, game, scriptNamespaceNameLowercase, functionNameLowercase, func}: FunctionOfTheDayOption) {
    const script = AllScriptsIndexed[game].scripts[scriptNamespaceNameLowercase]!;
    if (!script) throw new Error(`Script ${scriptNamespaceNameLowercase} not found in game ${game} for Function of the Day! This should not be possible!`);
    const scriptName = getBestNameVariant(script[AllSourcesCombined].namespaceName)[1];

    return [dayNum, <Fragment key={`${game}/${scriptNamespaceNameLowercase}/${functionNameLowercase}`}>
        <h2>
            {getGameName(game)}:{' '}
            <PapyrusScriptFunctionReference game={game} funcAggregate={func} possibleScripts={script} missingName={scriptName} /> </h2>
        <PapyrusFunctionSignatureVariants game={game} funcAggregate={func} scriptName={scriptName} />
    </Fragment>] as const;
}
