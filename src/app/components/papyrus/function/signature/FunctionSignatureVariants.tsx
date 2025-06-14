import type { PapyrusScriptFunctionIndexed, PapyrusScriptFunctionIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { serializePapyrusTypeForAggregation } from "../../../../../papyrus/indexing/aggregation/serializePapyrusTypeForAggregation";
import type { SearchEntityFunction } from "../../../../search/Entity";
import { SourcesList } from "../../SourcesList";
import { PapyrusFunctionSignature } from "./FunctionSignature";
import styles from './FunctionSignatureVariants.module.scss';

export function PapyrusFunctionSignatureVariants<TGame extends PapyrusGame>({game, funcAggregate, scriptName, inTooltip, longerDescription}: {readonly game: TGame, readonly funcAggregate: PapyrusScriptFunctionIndexedAggregate<TGame>, readonly scriptName: string, readonly inTooltip?: boolean, readonly longerDescription?: boolean}) {
    return <div className={styles.variants}>
        <SourcesList sourceIDs={Object.keys(funcAggregate.$sources)} game={game} />
        {splitFunctionVariants(funcAggregate).map((variant) =>
            <PapyrusFunctionSignature key={variant.profile}
                game={game} func={variant}
                longerDescription={longerDescription} scriptName={scriptName}
                inTooltip={inTooltip}
            />
        )}
    </div>;
}

function getVariantProfileStringForSource(variant: PapyrusScriptFunctionIndexed<PapyrusGame>) {
    let profile = `//returns/${serializePapyrusTypeForAggregation(variant.returnType)}`;

    profile += '//isNative/';
    if (variant.isNative) profile += 'Native';

    profile += '//isGlobal/';
    if (variant.isGlobal) profile += 'Global';

    for (let i = 1; i <= variant.parameters.length; i++) {
        const param = variant.parameters[i-1]!;
        profile += `//param${i}/${serializePapyrusTypeForAggregation(param.value)}`;
    }
    return profile;
}

function splitFunctionVariants<TGame extends PapyrusGame>(funcAggregate: PapyrusScriptFunctionIndexedAggregate<TGame>): (PapyrusScriptFunctionIndexed<TGame> & {profile: string} & RestoreLegacyOptionalKeys<Partial<Pick<SearchEntityFunction<TGame>, 'ckWikiData'>>>)[] {
    const variantMap = new Map<string, PapyrusScriptFunctionIndexed<TGame> & {profile: string} & RestoreLegacyOptionalKeys<Partial<Pick<SearchEntityFunction<TGame>, 'ckWikiData'>>>>;
    for (const variant of Object.values(funcAggregate.$sources)) {
        const profile = getVariantProfileStringForSource(variant);
        variantMap.set(profile, Object.assign(variant, {profile, ckWikiData: (funcAggregate as SearchEntityFunction<TGame>).ckWikiData}));
    }

    return Array.from(variantMap.values());
}
