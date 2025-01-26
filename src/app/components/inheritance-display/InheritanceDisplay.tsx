import { AllSourcesCombined } from "../../../papyrus/data-structures/indexing/game";
import type { PapyrusPossibleScripts } from "../../../papyrus/data-structures/indexing/script";
import type { PapyrusGame } from "../../../papyrus/data-structures/pure/game";
import { AllScriptsIndexed } from "../../../papyrus/indexing/index-all";
import { PapyrusScriptReference } from "../papyrus/script/PapyrusScriptReference";
import styles from './InheritanceDisplay.module.scss';

/** Recursive, subdividing grid to display script inheritance. */
export function InheritanceDisplay<TGame extends PapyrusGame>({game, data, isSubTable}: {readonly game: TGame, readonly data: Record<Lowercase<string>, PapyrusPossibleScripts<TGame>>, readonly isSubTable?: true}): JSX.Element {

    const entries = Object.keys(data).map((name) => [name, AllScriptsIndexed[game].scripts[name]![AllSourcesCombined]] as const)
        .sort(([aName, a], [bName, b])=> {
            const extendedByDiff = Object.keys(a.extendedBy).length - Object.keys(b.extendedBy).length;
            if (extendedByDiff !== 0) return extendedByDiff;
            return aName.localeCompare(bName);
        });

    if (entries.length === 0) {
        if (isSubTable) return <span className={styles.extendedByNone}>&mdash;</span>;
        else return <p className={styles.extendedByNone}>No indexed scripts extend this script.</p>;
    }

    return <table className={!isSubTable ? `${styles.table} ${styles['table--root-table']}` : styles.table}>
        <thead>
            <tr>
                <th>Script</th>
                <th>Extended By</th>
            </tr>
        </thead>
        <tbody>
            {entries.map(([key, value]) => <tr key={key}>
                <td>
                    <div>
                        <PapyrusScriptReference game={game} possibleScripts={data[key]!} missingName={null} />
                    </div>
                </td>
                <td>
                    {
                        Object.keys(value.extendedBy).length > 5
                            ? <details>
                                <summary>{Object.keys(value.extendedBy).length} scripts</summary>
                                <InheritanceDisplay isSubTable game={game} data={value.extendedBy} />
                            </details>
                            : <InheritanceDisplay isSubTable game={game} data={value.extendedBy} />
                    }
                </td>
            </tr>)}
        </tbody>
    </table>;
}
