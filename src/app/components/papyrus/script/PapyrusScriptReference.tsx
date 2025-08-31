import type { ComponentProps } from "react";
import { UnknownPapyrusScript } from "../../../../papyrus/data-structures/indexing/type";
import type { PapyrusGame } from "../../../../papyrus/data-structures/pure/game";
import { UnreachableError } from "../../../../UnreachableError";
import { getBestString, getBestStringVariant } from "../../../../utils/getBestName";
import { prepareUrlParts } from "../../../../utils/prepareUrlParts";
import { InternalLink } from "../../Link";
import { Tooltip } from "../../tooltip/Tooltip";
import styles from './PapyrusScriptReference.module.scss';
import { PapyrusScriptReferenceTooltip } from "./PapyrusScriptReferenceTooltip";

export function getScriptNameFromProps<TGame extends PapyrusGame>(propsObj: ComponentProps<typeof PapyrusScriptReferenceTooltip<TGame>> & {missingName?: string | null|undefined}): string {
    const {script, scriptAggregate, possibleScripts, missingName} = propsObj;
    if (script) {
        return script.namespaceName;
    } else if (scriptAggregate) {
        return getBestStringVariant(scriptAggregate.namespaceName)![1];
    } else if (possibleScripts) {
        if (possibleScripts === UnknownPapyrusScript) return missingName ? `<UNKNOWN_SCRIPT: ${missingName}>` : `<UNKNOWN_SCRIPT>`;
        else return getBestString(Object.values(possibleScripts).map(s=>s.namespaceName))!;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReference> component!');
    }
}

export function PapyrusScriptReference<TGame extends PapyrusGame>(propsObj: ComponentProps<typeof PapyrusScriptReferenceTooltip> & {readonly game: TGame, readonly missingName?: string|null|undefined, readonly inTooltip?: boolean|undefined}) {
    const {game, script, scriptAggregate, possibleScripts, missingName} = propsObj;
    const name = getScriptNameFromProps(propsObj);
    const href = prepareUrlParts(game, 'script', name);
    if (script) {
        if (propsObj.inTooltip) return <span className={styles.reference}>{name}</span>;
        return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusScriptReferenceTooltip game={game} script={script} />}>
            <InternalLink href={href} data-ref=''>
                {name}
            </InternalLink>
        </Tooltip>;
    } else if (scriptAggregate) {
        if (propsObj.inTooltip) return <span className={styles.reference}>{name}</span>;
        return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusScriptReferenceTooltip game={game} scriptAggregate={scriptAggregate} />}>
            <InternalLink href={href} data-ref=''>
                {name}
            </InternalLink>
        </Tooltip>;
    } else if (possibleScripts) {
        if (possibleScripts === UnknownPapyrusScript) {
            const nameToUse = missingName ? `<UNKNOWN_SCRIPT: ${missingName}>` : `<UNKNOWN_SCRIPT>`;
            if (propsObj.inTooltip) return <span className={styles['reference--unknown']}>{nameToUse}</span>;
            return <Tooltip role='tooltip' wrapperClassName={styles['reference--unknown']} tooltipContents={<PapyrusScriptReferenceTooltip game={game} possibleScripts={possibleScripts} missingName={missingName} />}>
                {nameToUse}
            </Tooltip>;
        }
        const content = <InternalLink href={href} data-ref=''>
            {name}
        </InternalLink>;
        if (propsObj.inTooltip) return <span className={styles.reference}>{content}</span>;
        return <Tooltip role='tooltip' wrapperClassName={styles.reference} tooltipContents={<PapyrusScriptReferenceTooltip game={game} possibleScripts={possibleScripts} missingName={missingName} />}>
            {content}
        </Tooltip>;
    } else {
        throw new UnreachableError(propsObj, 'Unknown Papyrus script reference type passed to <PapyrusScriptReference> component!');
    }

}
