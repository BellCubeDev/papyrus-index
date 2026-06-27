import type { PapyrusScriptFunctionIndexed } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import { joinJSXWithElementByWrapping } from "../../../../../utils/joinJSX";
import { prepareUrlParts } from "../../../../../utils/prepareUrlParts";
import { InternalLink } from "../../../Link";
import { SuspenseIfDevServer } from "../../../SuspenseIfDevServer";
import { TextWithTooltip } from "../../../text-with-tooltip/TooltipText";
import { PapyrusType, PapyrusTypeNamed, PapyrusTypeWithValue } from "../../type/PapyrusType";
import { FunctionDocumentationStringAll, FunctionDocumentationStringBest } from "./DocumentationString";
import styles from './FunctionSignature.module.scss';
import { PapyrusFunctionSignatureParamSeparator, PapyrusFunctionSignatureParamWrapper } from "./FunctionSignatureParamSeparator";


export function PapyrusFunctionSignature<TGame extends PapyrusGame>({game, func, scriptName, inTooltip, longerDescription}: {readonly game: TGame, readonly func: PapyrusScriptFunctionIndexed<TGame> & {ckWikiDescription?: string|null|undefined}, readonly scriptName: string, readonly inTooltip?: boolean|undefined, readonly longerDescription?: boolean|undefined}): React.ReactElement {

    return <div className={styles.functionSignatureWithShortDescription}>
        <div className={styles.functionSignature}>
            <PapyrusType game={game} type={func.returnType} inTooltip={inTooltip} />
            <span className={styles.functionKeyword}>function</span>
            <span className={styles.wrapableSection}>
                <span className={styles.functionNameWrapper}>
                    {
                        inTooltip
                            ? <span className={styles.functionName}>{func.name}</span>
                            : <InternalLink className={styles.functionName} href={prepareUrlParts(game, 'script', scriptName, 'function', func.name)}>{func.name}</InternalLink>
                    }
                    <span className={styles.functionParametersStart}>(</span>
                    <PapyrusFunctionSignatureParamSeparator isInWrapper noComma />
                </span>
                {joinJSXWithElementByWrapping(PapyrusFunctionSignatureParamWrapper, func.parameters.map((param) => {
                    let el: React.ReactElement;
                    if (param.isRequired) el = <PapyrusTypeNamed game={game} name={param.name} type={param.value} inTooltip={inTooltip} />;
                    else el = <PapyrusTypeWithValue game={game} type={param.value} name={param.name} inTooltip={inTooltip} />;

                    return {
                        wrapperKey: param.name,
                        realElement: el,
                        postSeparator: <PapyrusFunctionSignatureParamSeparator isInWrapper />
                    };
                }))}
                <PapyrusFunctionSignatureParamSeparator isInWrapper={false} noComma />
                <span className={styles.functionParametersEnd}>)</span>
                {func.isNative ? <PapyrusFunctionSignatureFlagNative inTooltip={inTooltip} /> : null}
                {func.isGlobal ? <PapyrusFunctionSignatureFlagGlobal inTooltip={inTooltip} /> : null}
                {func.isDebugOnly ? <PapyrusFunctionSignatureFlagDebugOnly inTooltip={inTooltip} /> : null}
                {func.isBetaOnly ? <PapyrusFunctionSignatureFlagBetaOnly inTooltip={inTooltip} /> : null}
            </span>
        </div>
        {longerDescription
            ? <div className={styles.longDescription}><SuspenseIfDevServer fallback={<p>[DEV SERVER] Loading description...</p>}>
                <br />
                <FunctionDocumentationStringAll game={game} func={func} scriptName={scriptName} inTooltip={inTooltip} />
            </SuspenseIfDevServer></div>
            : <div className={styles.shortDescription}><SuspenseIfDevServer fallback={<p>[DEV SERVER] Loading description...</p>}>
                <FunctionDocumentationStringBest game={game} func={func} scriptName={scriptName} inTooltip={inTooltip} />
            </SuspenseIfDevServer></div>}
    </div>;
}

export function PapyrusFunctionSignatureFlagNative({inTooltip}: {readonly inTooltip?: boolean|undefined}) {
    if (inTooltip) return <span className={styles.flag}>Native</span>;

    return <TextWithTooltip wrapperClassName={styles.flag} tooltipContents={<p>
        <span className={styles.flag}>Native</span> Papyrus functions are integrated directly into the game engine itself.
        New <span className={styles.flag}>Native</span> functions can be added by an xSE plugin.
    </p>}>
        Native
    </TextWithTooltip>;
}

export function PapyrusFunctionSignatureFlagGlobal({inTooltip}: {readonly inTooltip?: boolean|undefined}) {
    if (inTooltip) return <span className={styles.flag}>Global</span>;

    return <TextWithTooltip wrapperClassName={styles.flag} tooltipContents={<>
        <p>
            <span className={styles.flag}>Global</span> functions are not called on a ScriptObject instance (e.g. <code>
                <span style={{color:'#9cdcfe'}}>myObjectReferenceVariable</span>.<span style={{color:'#dcdcaa'}}>Disable</span>()
            </code>).
            They can instead be called from anywhere in Papyrus (e.g. <code>
                <span style={{color:'#4fc9b1'}}>Game</span>.<span style={{color:'#dcdcaa'}}>ForceFirstPerson</span>()
            </code>).
        </p><p>
            <span className={styles.flag}>Global</span> functions have no access to the built-in <code style={{color:'#569cd6'}}>self</code> or <code style={{color:'#569cd6'}}>parent</code> variables
            that a function running on a ScriptObject instance would have.
        </p><p>
            If this is confusing, you may wish to look at this function&rsquo;s usage example(s).
        </p>
    </>}>
        Global
    </TextWithTooltip>;
}

export function PapyrusFunctionSignatureFlagDebugOnly({inTooltip}: {readonly inTooltip?: boolean|undefined}) {
    if (inTooltip) return <span className={styles.flag}>DebugOnly</span>;

    return <TextWithTooltip wrapperClassName={styles.flag} tooltipContents={<>
        <p>
            Calls to <span className={styles.flag}>DebugOnly</span> functions will be removed from your script
            when you compile it in Release mode or Beta mode.
        </p><p>
            TODO: ADD RATIONALE FOR ITS EXISTENCE HERE
        </p>
    </>}>
        DebugOnly
    </TextWithTooltip>;
}

export function PapyrusFunctionSignatureFlagBetaOnly({inTooltip}: {readonly inTooltip?: boolean|undefined}) {
    if (inTooltip) return <span className={styles.flag}>BetaOnly</span>;

    return <TextWithTooltip wrapperClassName={styles.flag} tooltipContents={<>
        <p>
            Calls to <span className={styles.flag}>BetaOnly</span> functions will be removed from your script
            when you compile it in Release mode.
        </p><p>
            TODO: ADD RATIONALE FOR ITS EXISTENCE HERE
        </p>
    </>}>
        BetaOnly
    </TextWithTooltip>;
}
