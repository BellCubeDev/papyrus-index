import type { ComponentProps } from "react";
import type { PapyrusScriptBySources } from "../../../../papyrus/data-structures/indexing/game";
import type { PapyrusPossibleScripts, PapyrusScriptIndexed, PapyrusScriptIndexedAggregate } from "../../../../papyrus/data-structures/indexing/script";
import { UnknownPapyrusScript } from "../../../../papyrus/data-structures/indexing/type";
import type { PapyrusGame } from "../../../../papyrus/data-structures/pure/game";
import { UnreachableError } from "../../../../UnreachableError";
import { getBestName, getBestNameVariant } from "../../../../utils/getBestName";
import { toLowerCase } from "../../../../utils/toLowerCase";
import { Link } from "../../Link";
import { Tooltip } from "../../tooltip/Tooltip";
import styles from './PapyrusScriptReference.module.scss';
import { PapyrusScriptReferenceTooltip } from "./PapyrusScriptReferenceTooltip";

export function getScriptNameFromProps(propsObj: ComponentProps<typeof PapyrusScriptReference>): string {
    const {script, scriptAggregate, possibleScripts, missingName} = propsObj;
    if (script) {
        return script.name;
    } else if (scriptAggregate) {
        return getBestNameVariant(scriptAggregate.name)[1];
    } else if (possibleScripts) {
        if (possibleScripts === UnknownPapyrusScript) return missingName ? `<UNKNOWN_SCRIPT: {missingName}>` : `<UNKNOWN_SCRIPT>`;
        else return getBestName(Object.values(possibleScripts).map(s=>s.name))!;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReference> component!');
    }
}

export function PapyrusScriptReference<TGame extends PapyrusGame>(propsObj: {readonly game: TGame, readonly missingName?: string|null, readonly inTooltip?: boolean} & (
    | {readonly script: PapyrusScriptIndexed<TGame>, readonly scriptAggregate?: undefined, readonly possibleScripts?: undefined}
    | {readonly script?: undefined, readonly scriptAggregate: PapyrusScriptIndexedAggregate<TGame>, readonly possibleScripts?: undefined}
    | {readonly script?: undefined, readonly scriptAggregate?: undefined, readonly possibleScripts: typeof UnknownPapyrusScript | PapyrusPossibleScripts<TGame> | PapyrusScriptBySources<TGame>, missingName: string|null}
)) {
    const {game, script, scriptAggregate, possibleScripts, missingName} = propsObj;
    if (script) {
        if (propsObj.inTooltip) return <span className={styles.reference}>{script.name}</span>;
        return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusScriptReferenceTooltip script={script} />}>
            <Link href={`/${toLowerCase(game)}/script/${toLowerCase(script.name)}` as const}>
                {script.name}
            </Link>
        </Tooltip>;
    } else if (scriptAggregate) {
        if (propsObj.inTooltip) return <span className={styles.reference}>{getBestNameVariant(scriptAggregate.name)[1]}</span>;
        return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusScriptReferenceTooltip scriptAggregate={scriptAggregate} />}>
            <Link href={`/${toLowerCase(game)}/script/${toLowerCase(scriptAggregate.name[0]![1])}` as const}>
                {getBestNameVariant(scriptAggregate.name)[1]}
            </Link>;
        </Tooltip>;
    } else if (possibleScripts) {
        if (possibleScripts === UnknownPapyrusScript) {
            const nameToUse = missingName ? `<UNKNOWN_SCRIPT: {missingName}>` : `<UNKNOWN_SCRIPT>`;
            if (propsObj.inTooltip) return <span className={styles['reference--unknown']}>{nameToUse}</span>;
            return <Tooltip role='tooltip' wrapperClassName={styles['reference--unknown']} tooltipContents={<PapyrusScriptReferenceTooltip possibleScripts={possibleScripts} />}>
                {nameToUse}
            </Tooltip>;
        }
        const possibleScriptObjects = Object.values(possibleScripts);
        const content = <Link href={`/${toLowerCase(game)}/script/${toLowerCase(possibleScriptObjects[0]?.name || 'ERROR')}` as const}>
            {getBestName(possibleScriptObjects.map(s=>s.name))}
        </Link>;
        if (propsObj.inTooltip) return <span className={styles.reference}>{content}</span>;
        return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusScriptReferenceTooltip possibleScripts={possibleScripts} />}>
            {content}
        </Tooltip>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReference> component!');
    }

}
