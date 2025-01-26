import type { PapyrusPossibleScripts, PapyrusScriptIndexed, PapyrusScriptIndexedAggregate } from "../../../../papyrus/data-structures/indexing/script";
import { UnknownPapyrusScript } from "../../../../papyrus/data-structures/indexing/type";
import type { PapyrusGame } from "../../../../papyrus/data-structures/pure/game";
import styles from './PapyrusScriptReference.module.scss';

export function PapyrusScriptReferenceTooltip<TGame extends PapyrusGame>(propsObj: {readonly script?: undefined, readonly scriptAggregate: PapyrusScriptIndexedAggregate<TGame>, readonly possibleScripts?: undefined} | {readonly script: PapyrusScriptIndexed<TGame>, readonly scriptAggregate?: undefined, readonly possibleScripts?: undefined} | {readonly possibleScripts: typeof UnknownPapyrusScript | PapyrusPossibleScripts<TGame>, readonly script?: undefined, readonly scriptAggregate?: undefined}) {
    const {script, scriptAggregate, possibleScripts} = propsObj;
    if (script) {
        return <div className={styles.tooltip}>
            {script.name} (
            {script.isNative === null ? `extends ${script.extendsName}` : script.isNative ? 'Native' : 'Papyrus-Only'}
            )
        </div>;
    } else if (scriptAggregate) {
        return <div className={styles.tooltip}>
            {scriptAggregate.name.map(n=>n[1]).join(', ')}
        </div>;
    } else if (possibleScripts) {
        if (possibleScripts === UnknownPapyrusScript) {
            return <div className={styles.tooltip}>
                This script is not included in the Papyrus Index. It is likely from a mod that is not indexed, or the script was not deemed relevant to the index. If you believe this is a mistake, please contact BellCube!
            </div>;
        }
        return <div className={styles.tooltip}>
            {Array.from(new Set(Object.values(possibleScripts).map(s=>s.name))).join(', ')} (
            {Object.values(possibleScripts).some(s=>s.isNative === null) ? 'extends ' : ''}{Array.from(new Set(Object.values(possibleScripts).map(s=>s.extendsName))).join(', ')}
            )
        </div>;
    }
}
