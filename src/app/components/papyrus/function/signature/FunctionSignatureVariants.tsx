import type { PapyrusScriptIndexedAggregate } from "../../../../../papyrus/data-structures/indexing/script";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { SourcesList } from "../../SourcesList";
import { PapyrusFunctionSignature } from "./FunctionSignature";
import styles from './FunctionSignatureVariants.module.scss';

export function PapyrusFunctionSignatureVariants<TGame extends PapyrusGame>({game, variants, scriptName, inTooltip, longerDescription}: {readonly game: TGame, readonly variants: PapyrusScriptIndexedAggregate<TGame>["functions"][Lowercase<string>], readonly scriptName: string, readonly inTooltip?: boolean, readonly longerDescription?: boolean}) {
    return <div className={styles.variants}>
        {variants.map(([sources, variant]) => <div key={sources.join('/')} className={styles.variant}>
            <SourcesList sourceIDs={sources} game={game} />
            <PapyrusFunctionSignature
                game={game} func={variant}
                scriptName={scriptName} inTooltip={inTooltip}
                longerDescription={longerDescription}
            />
        </div>)}
    </div>;
}
