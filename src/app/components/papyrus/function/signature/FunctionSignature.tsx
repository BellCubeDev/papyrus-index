import type { PapyrusScriptFunctionIndexed } from "../../../../../papyrus/data-structures/indexing/function";
import type { PapyrusGame } from "../../../../../papyrus/data-structures/pure/game";
import styles from './FunctionSignature.module.scss';
import { PapyrusType, PapyrusTypeNamed, PapyrusTypeWithValue } from "../../type/PapyrusType";
import { joinJSXWithElementByWrapping } from "../../../../../utils/joinJSX";
import { PapyrusFunctionSignatureParamSeparator, PapyrusFunctionSignatureParamWrapper } from "./FunctionSignatureParamSeparator";
import { TextWithTooltip } from "../../../text-with-tooltip/TooltipText";
import { getWikiDataFunctionPage } from "../../../../../wikimedia/GetWikiDataFunctionPage";
import { WikiMarkdown } from "../../../wiki-markdown/WikiMarkdown";
import { AllScriptsIndexed } from "../../../../../papyrus/indexing/index-all";
import { Link } from "../../../Link";
import { toLowerCase } from "../../../../../utils/toLowerCase";
import { FunctionDocumentationStringAll, FunctionDocumentationStringBest } from "./DocumentationString";
import { Suspense } from "react";


export function PapyrusFunctionSignature<TGame extends PapyrusGame>({game, func, scriptName, inTooltip, longerDescription}: {readonly game: TGame, readonly func: PapyrusScriptFunctionIndexed<TGame>, readonly scriptName: string, readonly inTooltip?: boolean, readonly longerDescription?: boolean}): React.ReactElement {

    return <div className={styles.functionSignatureWithShortDescription}>
        <div className={styles.functionSignature}>
            <PapyrusType game={game} type={func.returnType} inTooltip={inTooltip} />
            <span className={styles.functionKeyword}>function</span>
            <span className={styles.wrapableSection}>
                {
                    inTooltip
                        ? <span className={styles.functionName}>{func.name}</span>
                        : <Link className={styles.functionName} href={`/${toLowerCase(game)}/script/${toLowerCase(scriptName)}/function/${toLowerCase(func.name)}` as const}>{func.name}</Link>
                }
                <span className={styles.functionParametersStart}>(</span>
                <PapyrusFunctionSignatureParamSeparator isInWrapper={false} />
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
                <PapyrusFunctionSignatureParamSeparator isInWrapper={false} />
                <span className={styles.functionParametersEnd}>)</span>
                {func.isNative ? <PapyrusFunctionSignatureFlagNative inTooltip={inTooltip} /> : null}
                {func.isGlobal ? <PapyrusFunctionSignatureFlagGlobal inTooltip={inTooltip} /> : null}
                {func.isDebugOnly ? <PapyrusFunctionSignatureFlagDebugOnly inTooltip={inTooltip} /> : null}
                {func.isBetaOnly ? <PapyrusFunctionSignatureFlagBetaOnly inTooltip={inTooltip} /> : null}
            </span>
        </div>
        {longerDescription
            ? <div className={styles.longDescription}><Suspense fallback={<p>[DEV SERVER] Loading description...</p>}>
                <FunctionDocumentationStringAll game={game} func={func} scriptName={scriptName} inTooltip={inTooltip} />
            </Suspense></div>
            : <div className={styles.shortDescription}><Suspense fallback={<p>[DEV SERVER] Loading description...</p>}>
                <FunctionDocumentationStringBest game={game} func={func} scriptName={scriptName} inTooltip={inTooltip} />
            </Suspense></div>}
    </div>;
}

export function PapyrusFunctionSignatureFlagNative({inTooltip}: {readonly inTooltip?: boolean}) {
    if (inTooltip) return <span className={styles.flag}>Native</span>;

    return <TextWithTooltip wrapperClassName={styles.flag} tooltipContents={<p>
        &ldquo;Native&rdquo; Papyrus functions are integrated directly into the game engine itself.
        New Native functions can be added by an xSE plugin.
    </p>}>
        Native
    </TextWithTooltip>;
}

export function PapyrusFunctionSignatureFlagGlobal({inTooltip}: {readonly inTooltip?: boolean}) {
    if (inTooltip) return <span className={styles.flag}>Global</span>;

    return <TextWithTooltip wrapperClassName={styles.flag} tooltipContents={<>
        <p>
            &ldquo;Global&rdquo; functions are not called on a ScriptObject instance (e.g. <code>
                <span style={{color:'#9cdcfe'}}>myObjectReferenceVariable</span>.<span style={{color:'#dcdcaa'}}>Disable</span>()
            </code>).
            They can instead be called from anywhere in Papyrus (e.g. <code>
                <span style={{color:'#4fc9b1'}}>Game</span>.<span style={{color:'#dcdcaa'}}>ForceFirstPerson</span>()
            </code>).
        </p><p>
            Global functions have no access to the built-in <code style={{color:'#569cd6'}}>self</code> or <code style={{color:'#569cd6'}}>parent</code> variables
            that a function running on a ScriptObject instance would have.
        </p><p>
            If this is confusing, you may wish to look at this function&rsquo;s usage example(s).
        </p>
    </>}>
        Global
    </TextWithTooltip>;
}

export function PapyrusFunctionSignatureFlagDebugOnly({inTooltip}: {readonly inTooltip?: boolean}) {
    if (inTooltip) return <span className={styles.flag}>DebugOnly</span>;

    return <TextWithTooltip wrapperClassName={styles.flag} tooltipContents={<>
        <p>
            Calls to &ldquo;DebugOnly&rdquo; functions will be removed from your script
            when you compile it in Release mode or Beta mode.
        </p><p>
            ADD RATIONALE FOR ITS EXISTENCE HERE
        </p>
    </>}>
        DebugOnly
    </TextWithTooltip>;
}

export function PapyrusFunctionSignatureFlagBetaOnly({inTooltip}: {readonly inTooltip?: boolean}) {
    if (inTooltip) return <span className={styles.flag}>BetaOnly</span>;

    return <TextWithTooltip wrapperClassName={styles.flag} tooltipContents={<>
        <p>
            Calls to &ldquo;BetaOnly&rdquo; functions will be removed from your script
            when you compile it in Release mode.
        </p><p>
            ADD RATIONALE FOR ITS EXISTENCE HERE
        </p>
    </>}>
        BetaOnly
    </TextWithTooltip>;
}
