import { UnknownPapyrusScript } from "../../../../papyrus/data-structures/indexing/type";
import type { PapyrusGame } from "../../../../papyrus/data-structures/pure/game";
import styles from './PapyrusScriptReference.module.scss';
import type { SearchIndexEntityScript } from "../../../[game]/search-index.json/SearchIndexEntity";
import type { PapyrusPossibleScripts, PapyrusScriptIndexed, PapyrusScriptIndexedAggregate } from "../../../../papyrus/data-structures/indexing/script";
import type { PapyrusScriptBySources } from "../../../../papyrus/data-structures/indexing/game";
import { UnreachableError } from "../../../../UnreachableError";
import { getScriptNameFromProps } from "./PapyrusScriptReference";

export function PapyrusScriptReferenceTooltip<TGame extends PapyrusGame>(propsObj:
    | {readonly searchScript: SearchIndexEntityScript, readonly script?: undefined, readonly scriptAggregate?: undefined, readonly possibleScripts?: undefined}
    | {readonly searchScript?: undefined, readonly script: |PapyrusScriptIndexed<TGame>, readonly scriptAggregate?: undefined, readonly possibleScripts?: undefined}
    | {readonly searchScript?: undefined, readonly script?: undefined, readonly scriptAggregate: PapyrusScriptIndexedAggregate<TGame>, readonly possibleScripts?: undefined}
    | {readonly searchScript?: undefined, readonly script?: undefined, readonly scriptAggregate?: undefined, readonly possibleScripts: typeof UnknownPapyrusScript | PapyrusPossibleScripts<TGame> | PapyrusScriptBySources<TGame>, missingName: string|null}
): React.ReactElement {
    const {script, searchScript, scriptAggregate, possibleScripts} = propsObj;
    const name = getScriptNameFromProps(propsObj);
    if (searchScript) {
        return <div className={styles.tooltip}>
            {name} (
            {searchScript.isNative === null
                ? searchScript.extends?.target
                    ? `extends ${searchScript.extends.target}`
                    : 'top-level'
                : searchScript.isNative
                    ? 'Native'
                    : 'Papyrus-Only'}
            )
        </div>;
    } else if (script) {
        return <div className={styles.tooltip}>
            {name} (
            {script.isNative === null
                ? script.extendsName
                    ? `extends ${script.extendsName}`
                    : 'top-level'
                : script.isNative
                    ? 'Native'
                    : 'Papyrus-Only'}
            )
        </div>;
    } else if (scriptAggregate) {
        return <div className={styles.tooltip}>
            {scriptAggregate.name.map(n=>n[1]).join(' | ')} (
            {
                scriptAggregate.isNative.some(([, isNative]) => isNative === null)
                    ? scriptAggregate.extendsName.some(([, extendsName]) => extendsName)
                        ? `extends ${scriptAggregate.extendsName.map(n=>n[1]).join(' | ')}`
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
        return <div className={styles.tooltip}>
            {Array.from(new Set(Object.values(possibleScripts).map(s=>s.name))).join(' | ')} (

            )
        </div>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReferenceTooltip> component!');
    }
}
