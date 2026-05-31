import type { PapyrusScriptEventOrBaseFunctionIndexed, PapyrusScriptEventOrBaseFunctionIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { serializePapyrusTypeForAggregation } from "../../../../../papyrus/indexing/aggregation/serializePapyrusTypeForAggregation";
import type { SearchEntityEvent } from "../../../../search/Entity";
import { SourcesList } from "../../SourcesList";
import { PapyrusEventSignature } from "./EventSignature";
import styles from './EventSignatureVariants.module.scss';

export function PapyrusEventSignatureVariants<TGame extends PapyrusGame>({game, evtAggregate, scriptName, inTooltip, longerDescription}: {readonly game: TGame, readonly evtAggregate: PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>, readonly scriptName: string, readonly inTooltip?: boolean, readonly longerDescription?: boolean}) {
    return <div className={styles.variants}>
        <SourcesList sourceIDs={Object.keys(evtAggregate.$sources)} game={game} />
        {splitEventVariants(evtAggregate).map((variant) =>
            <PapyrusEventSignature key={variant.profile}
                game={game} evt={variant}
                longerDescription={longerDescription} scriptName={scriptName}
                inTooltip={inTooltip}
            />
        )}
    </div>;
}

function getVariantProfileStringForSource(variant: PapyrusScriptEventOrBaseFunctionIndexed<PapyrusGame>) {
    let profile = ``;

    for (let i = 1; i <= variant.parameters.length; i++) {
        const param = variant.parameters[i-1]!;
        profile += `//param${i}/${serializePapyrusTypeForAggregation(param.value)}`;
    }
    
    return profile;
}

function splitEventVariants<TGame extends PapyrusGame>(evtAggregate: PapyrusScriptEventOrBaseFunctionIndexedAggregate<TGame>): (PapyrusScriptEventOrBaseFunctionIndexed<TGame> & {profile: string} & RestoreLegacyOptionalKeys<Partial<Pick<SearchEntityEvent<TGame>, 'ckWikiData'>>>)[] {
    const variantMap = new Map<string, PapyrusScriptEventOrBaseFunctionIndexed<TGame> & {profile: string} & RestoreLegacyOptionalKeys<Partial<Pick<SearchEntityEvent<TGame>, 'ckWikiData'>>>>;
    for (const variant of Object.values(evtAggregate.$sources)) {
        const profile = getVariantProfileStringForSource(variant);
        variantMap.set(profile, Object.assign(variant, {profile, ckWikiData: (evtAggregate as SearchEntityEvent<TGame>).ckWikiData}));
    }

    return Array.from(variantMap.values());
}
