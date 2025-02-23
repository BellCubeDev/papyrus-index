import type { ComponentProps } from "react";
import { UnknownPapyrusScript } from "../../../../papyrus/data-structures/indexing/type";
import type { PapyrusGame } from "../../../../papyrus/data-structures/pure/game";
import { UnreachableError } from "../../../../UnreachableError";
import { getBestName, getBestNameVariant } from "../../../../utils/getBestName";
import { toLowerCase } from "../../../../utils/toLowerCase";
import { Link } from "../../Link";
import { Tooltip } from "../../tooltip/Tooltip";
import styles from './PapyrusScriptReference.module.scss';
import { PapyrusScriptReferenceTooltip } from "./PapyrusScriptReferenceTooltip";

export function getScriptNameFromProps(propsObj: ComponentProps<typeof PapyrusScriptReferenceTooltip> & {missingName?: string | null}): string {
    const {script, searchScript, scriptAggregate, possibleScripts, missingName} = propsObj;
    if (searchScript) {
        return searchScript.scriptNamespaceName.target;
    } else if (script) {
        return script.namespaceName;
    } else if (scriptAggregate) {
        return getBestNameVariant(scriptAggregate.namespaceName)[1];
    } else if (possibleScripts) {
        if (possibleScripts === UnknownPapyrusScript) return missingName ? `<UNKNOWN_SCRIPT: {missingName}>` : `<UNKNOWN_SCRIPT>`;
        else return getBestName(Object.values(possibleScripts).map(s=>s.namespaceName))!;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReference> component!');
    }
}

export function PapyrusScriptReference<TGame extends PapyrusGame>(propsObj: ComponentProps<typeof PapyrusScriptReferenceTooltip> & {readonly game: TGame, readonly missingName?: string|null, readonly inTooltip?: boolean}) {
    const {game, searchScript, script, scriptAggregate, possibleScripts, missingName} = propsObj;
    const name = getScriptNameFromProps(propsObj);
    if (searchScript) {
        if (propsObj.inTooltip) return <span className={styles.reference}>{name}</span>;
        return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusScriptReferenceTooltip searchScript={searchScript} />}>
            <Link href={`/${toLowerCase(game)}/script/${toLowerCase(name)}` as const}>
                {name}
            </Link>
        </Tooltip>;
    } else if (script) {
        if (propsObj.inTooltip) return <span className={styles.reference}>{name}</span>;
        return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusScriptReferenceTooltip script={script} />}>
            <Link href={`/${toLowerCase(game)}/script/${toLowerCase(name)}` as const}>
                {name}
            </Link>
        </Tooltip>;
    } else if (scriptAggregate) {
        if (propsObj.inTooltip) return <span className={styles.reference}>{name}</span>;
        return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusScriptReferenceTooltip scriptAggregate={scriptAggregate} />}>
            <Link href={`/${toLowerCase(game)}/script/${toLowerCase(name)}` as const}>
                {name}
            </Link>;
        </Tooltip>;
    } else if (possibleScripts) {
        if (possibleScripts === UnknownPapyrusScript) {
            const nameToUse = missingName ? `<UNKNOWN_SCRIPT: {missingName}>` : `<UNKNOWN_SCRIPT>`;
            if (propsObj.inTooltip) return <span className={styles['reference--unknown']}>{nameToUse}</span>;
            return <Tooltip role='tooltip' wrapperClassName={styles['reference--unknown']} tooltipContents={<PapyrusScriptReferenceTooltip possibleScripts={possibleScripts} missingName={missingName} />}>
                {nameToUse}
            </Tooltip>;
        }
        const content = <Link href={`/${toLowerCase(game)}/script/${toLowerCase(name)}` as const}>
            {name}
        </Link>;
        if (propsObj.inTooltip) return <span className={styles.reference}>{content}</span>;
        return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusScriptReferenceTooltip possibleScripts={possibleScripts} missingName={missingName} />}>
            {content}
        </Tooltip>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReference> component!');
    }

}
