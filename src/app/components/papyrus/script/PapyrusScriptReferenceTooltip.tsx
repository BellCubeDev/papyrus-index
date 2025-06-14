import { UnknownPapyrusScript } from "../../../../papyrus/data-structures/indexing/type";
import type { PapyrusGame } from "../../../../papyrus/data-structures/pure/game";
import styles from './PapyrusScriptReference.module.scss';
import type { PapyrusPossibleScripts, PapyrusScriptIndexed, PapyrusScriptIndexedAggregate } from "../../../../papyrus/data-structures/indexing/script";
import type { PapyrusScriptBySources } from "../../../../papyrus/data-structures/indexing/game";
import { UnreachableError } from "../../../../UnreachableError";
import { getScriptNameFromProps, PapyrusScriptReference } from "./PapyrusScriptReference";
import { joinJSX } from "../../../../utils/joinJSX";
import { getBestString } from "../../../../utils/getBestName";

export function PapyrusScriptReferenceTooltip<TGame extends PapyrusGame>(propsObj:
    {
        game: TGame,
    } & (
        | {readonly script: |PapyrusScriptIndexed<TGame>, readonly scriptAggregate?: undefined, readonly possibleScripts?: undefined}
        | {readonly script?: undefined, readonly scriptAggregate: PapyrusScriptIndexedAggregate<TGame>, readonly possibleScripts?: undefined}
        | {readonly script?: undefined, readonly scriptAggregate?: undefined, readonly possibleScripts: typeof UnknownPapyrusScript | PapyrusPossibleScripts<TGame> | PapyrusScriptBySources<TGame>, missingName: string|null}
    )
): React.ReactElement {
    const {game, script, scriptAggregate, possibleScripts} = propsObj;
    const name = getScriptNameFromProps(propsObj);
    if (script) {
        return <div className={styles.tooltip}>
            {name} (
            {script.isNative === null
                ? script.extends
                    ? <>extends <PapyrusScriptReference game={game} possibleScripts={script.extends} missingName={script.extendsName} /></>
                    : 'top-level'
                : script.isNative
                    ? 'Native'
                    : 'Papyrus-Only'}
            )
        </div>;
    } else if (scriptAggregate) {
        return <div className={styles.tooltip}>
            {scriptAggregate.namespaceName.map(n=>n[1]).join(' | ')} (
            {
                scriptAggregate.isNative.some(([, isNative]) => isNative === null)
                    ? scriptAggregate.extendsName.some(([, extendsName]) => extendsName)
                        ? <>extends {...joinJSX(' | ', scriptAggregate.extends.filter((n)=> n[1] !== null).map(n=><PapyrusScriptReference key={n[0].join('|')} game={game} possibleScripts={n[1]!} missingName={null} />))}</>
                        : 'top-level'
                    : scriptAggregate.isNative.every(([, isNative]) => !isNative)
                        ? 'Papyrus-Only'
                        : scriptAggregate.isNative.every(([, isNative]) => isNative)
                            ? 'Native'
                            : 'Native in some sources, Papyrus-Only in others'
            }
            )
        </div>;
    } else if (possibleScripts) {
        if (possibleScripts === UnknownPapyrusScript) {
            return <div className={styles.tooltip}>
                This script is not included in the Papyrus Index. It is likely from a mod that is not indexed, or the script was not deemed relevant to the index. If you believe this is a mistake, please contact BellCube!
            </div>;
        }
        const possibleScriptsEntries = Object.entries(possibleScripts);
        return <div className={styles.tooltip}>
            {getBestString(possibleScriptsEntries.map(v => v[1].namespaceName))} (
            {
                possibleScriptsEntries.some(([,s])=>s.isNative === null)
                    ? Object.values(possibleScripts).some(s=>s.extendsName)
                        ? <>extends {...joinJSX(' | ', possibleScriptsEntries.filter(([,s])=>s.extends !== null).map(([k, s])=><PapyrusScriptReference key={k} game={game} possibleScripts={s.extends!} missingName={s.extendsName} />))}</>
                        : 'top-level'
                    : Object.values(possibleScripts).every(s=>!s.isNative)
                        ? 'Papyrus-Only'
                        : Object.values(possibleScripts).every(s=>s.isNative)
                            ? 'Native'
                            : 'Native in some sources, Papyrus-Only in others'
            }
            )
        </div>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReferenceTooltip> component!');
    }
}
