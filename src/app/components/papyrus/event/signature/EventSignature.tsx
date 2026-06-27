import type { PapyrusScriptEventOrBaseFunctionIndexed } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { joinJSXWithElementByWrapping } from "../../../../../utils/joinJSX";
import { prepareUrlParts } from "../../../../../utils/prepareUrlParts";
import { InternalLink } from "../../../Link";
import { SuspenseIfDevServer } from "../../../SuspenseIfDevServer";
import { TextWithTooltip } from "../../../text-with-tooltip/TooltipText";
import { PapyrusTypeNamed, PapyrusTypeWithValue } from "../../type/PapyrusType";
import { EventDocumentationStringAll, EventDocumentationStringBest } from "./DocumentationString";
import styles from './EventSignature.module.scss';
import { PapyrusEventSignatureParamSeparator, PapyrusEventSignatureParamWrapper } from "./EventSignatureParamSeparator";


export function PapyrusEventSignature<TGame extends PapyrusGame>({game, evt, scriptName, inTooltip, longerDescription}: {readonly game: TGame, readonly evt: PapyrusScriptEventOrBaseFunctionIndexed<TGame> & {ckWikiDescription?: string|null|undefined}, readonly scriptName: string, readonly inTooltip?: boolean|undefined, readonly longerDescription?: boolean|undefined}): React.ReactElement {

    return <div className={styles.eventSignatureWithShortDescription}>
        <div className={styles.eventSignature}>
            <span className={styles.eventKeyword}>event</span>
            <span className={styles.wrapableSection}>
                <span className={styles.eventNameWrapper}>
                    {
                        inTooltip
                            ? <span className={styles.eventName}>{evt.name}</span>
                            : <InternalLink className={styles.eventName} href={prepareUrlParts(game, 'script', scriptName, 'event', evt.name)}>{evt.name}</InternalLink>
                    }
                    <span className={styles.eventParametersStart}>(</span>
                    <PapyrusEventSignatureParamSeparator isInWrapper noComma />
                </span>
                {joinJSXWithElementByWrapping(PapyrusEventSignatureParamWrapper, evt.parameters.map((param) => {
                    let el: React.ReactElement;
                    if (param.isRequired) el = <PapyrusTypeNamed game={game} name={param.name} type={param.value} inTooltip={inTooltip} />;
                    else el = <PapyrusTypeWithValue game={game} type={param.value} name={param.name} inTooltip={inTooltip} />;

                    return {
                        wrapperKey: param.name,
                        realElement: el,
                        postSeparator: <PapyrusEventSignatureParamSeparator isInWrapper />
                    };
                }))}
                <PapyrusEventSignatureParamSeparator isInWrapper={false} noComma />
                <span className={styles.eventParametersEnd}>)</span>
                {evt.isDebugOnly ? <PapyrusEventSignatureFlagDebugOnly inTooltip={inTooltip} /> : null}
                {evt.isBetaOnly ? <PapyrusEventSignatureFlagBetaOnly inTooltip={inTooltip} /> : null}
            </span>
        </div>
        {longerDescription
            ? <div className={styles.longDescription}><SuspenseIfDevServer fallback={<p>[DEV SERVER] Loading description...</p>}>
                <br />
                <EventDocumentationStringAll game={game} evt={evt} scriptName={scriptName} inTooltip={inTooltip} />
            </SuspenseIfDevServer></div>
            : <div className={styles.shortDescription}><SuspenseIfDevServer fallback={<p>[DEV SERVER] Loading description...</p>}>
                <EventDocumentationStringBest game={game} evt={evt} scriptName={scriptName} inTooltip={inTooltip} />
            </SuspenseIfDevServer></div>}
    </div>;
}

export function PapyrusEventSignatureFlagNative({inTooltip}: {readonly inTooltip?: boolean|undefined}) {
    if (inTooltip) return <span className={styles.flag}>Native</span>;

    return <TextWithTooltip wrapperClassName={styles.flag} tooltipContents={<p>
        <span className={styles.flag}>Native</span> Papyrus events are integrated directly into the game engine itself.
        New <span className={styles.flag}>Native</span> events can be added by an xSE plugin.
    </p>}>
        Native
    </TextWithTooltip>;
}

export function PapyrusEventSignatureFlagDebugOnly({inTooltip}: {readonly inTooltip?: boolean|undefined}) {
    if (inTooltip) return <span className={styles.flag}>DebugOnly</span>;

    return <TextWithTooltip wrapperClassName={styles.flag} tooltipContents={<>
        <p>
            Calls to <span className={styles.flag}>DebugOnly</span> events will be removed from your script
            when you compile it in Release mode or Beta mode.
        </p><p>
            TODO: ADD RATIONALE FOR ITS EXISTENCE HERE
        </p>
    </>}>
        DebugOnly
    </TextWithTooltip>;
}

export function PapyrusEventSignatureFlagBetaOnly({inTooltip}: {readonly inTooltip?: boolean|undefined}) {
    if (inTooltip) return <span className={styles.flag}>BetaOnly</span>;

    return <TextWithTooltip wrapperClassName={styles.flag} tooltipContents={<>
        <p>
            Calls to <span className={styles.flag}>BetaOnly</span> events will be removed from your script
            when you compile it in Release mode.
        </p><p>
            TODO: ADD RATIONALE FOR ITS EXISTENCE HERE
        </p>
    </>}>
        BetaOnly
    </TextWithTooltip>;
}
