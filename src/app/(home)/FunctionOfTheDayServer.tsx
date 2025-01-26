/* eslint-disable no-bitwise */
import type { PapyrusScriptFunctionIndexed } from "../../papyrus/data-structures/indexing/function";
import { AllSourcesCombined } from "../../papyrus/data-structures/indexing/game";
import type { PapyrusGame } from "../../papyrus/data-structures/pure/game";
import { getBestNameVariant } from "../../utils/getBestName";
import { AllScriptsIndexed } from "../../papyrus/indexing/index-all";
import { PapyrusFunctionSignatureVariants } from "../components/papyrus/function/signature/FunctionSignatureVariants";
import 'server-only';
import { Fragment } from "react";
import { getGameName } from "../../utils/getGameName";
import { PapyrusScriptFunctionReference } from "../components/papyrus/function/reference/PapyrusScriptFunctionReference";

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
    readonly scriptNameLowercase: Lowercase<string>;
    readonly scriptNameVariants: [Lowercase<string>[], string][];
    readonly functionNameLowercase: Lowercase<string>;
    readonly namespaceVariants: [Lowercase<string>[], string|null][];
    readonly functionVariants: [Lowercase<string>[], PapyrusScriptFunctionIndexed<PapyrusGame>][];
}

const allFunctions: FunctionOfTheDayFunction[] = Object.entries(AllScriptsIndexed).flatMap(([game, gameData]) =>
    Object.entries(gameData.scripts).flatMap(([scriptNameLowercase, bySources]) =>
        Object.entries(bySources[AllSourcesCombined].functions).flatMap(([functionNameLowercase, functionVariants]) => ({
            game,
            scriptNameLowercase,
            scriptNameVariants: bySources[AllSourcesCombined].name,
            namespaceVariants: bySources[AllSourcesCombined].namespace,
            functionNameLowercase,
            functionVariants,
        }))
    )
).sort((a, b) => {
    const aHash = calculateFunctionNamePseudoRandom(a.functionNameLowercase);
    const bHash = calculateFunctionNamePseudoRandom(b.functionNameLowercase);
    return aHash - bHash;
});

const todaySinceEpoch = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
export  type FunctionOfTheDayOption = FunctionOfTheDayFunction & {dayNum: number};
/** Options for the function of the day so we can adjust to the user's local timezone. */
export const functionOfTheDayOptions: FunctionOfTheDayOption[] = new Array(9).fill(null).map((_, i) => {
    const dayNum = todaySinceEpoch+i-1;
    const index = dayNum % allFunctions.length;
    return Object.assign(allFunctions[index]!, {dayNum});
});

export const FunctionOfTheDayOptionsWithRendered = functionOfTheDayOptions.map(FunctionOfTheDay) as [number, JSX.Element][];

function FunctionOfTheDay({dayNum, game, scriptNameLowercase, scriptNameVariants, namespaceVariants, functionNameLowercase, functionVariants}: FunctionOfTheDayOption) {
    const namespaceNamePart = namespaceVariants[0]![1] === null ? '' : `${getBestNameVariant(namespaceVariants as [Lowercase<string>[], string][])[1]}:`;
    const scriptName = namespaceNamePart + getBestNameVariant(scriptNameVariants)[1];

    const script = AllScriptsIndexed[game].scripts[scriptNameLowercase];
    if (!script) throw new Error(`Script ${scriptName} not found in game ${game} for Function of the Day! This should not be possible!`);

    return [dayNum, <Fragment key={`${game}/${scriptNameLowercase}/${functionNameLowercase}`}>
        <h2>
            {getGameName(game)}:{' '}
            <PapyrusScriptFunctionReference game={game} possibleFunctions={functionVariants} possibleScripts={script} missingName={scriptName} /> </h2>
        <PapyrusFunctionSignatureVariants game={game} variants={functionVariants} scriptName={scriptName} />
    </Fragment>] as const;
}
