import type { PapyrusScriptTypeIndexed, PapyrusScriptValueIndexed } from "../../../../papyrus/data-structures/indexing/type";
import type { PapyrusGame } from "../../../../papyrus/data-structures/pure/game";
import { PapyrusScriptTypeArchetype } from "../../../../papyrus/data-structures/pure/type";
import { UnreachableError } from "../../../../UnreachableError";
import { TextWithTooltip } from "../../text-with-tooltip/TooltipText";
import { PapyrusScriptReference } from "../script/PapyrusScriptReference";
import { PapyrusStructReference } from "../struct/PapyrusStructReference";
import styles from './PapyrusType.module.scss';

export function PapyrusType<TGame extends PapyrusGame>({game, type, inTooltip}: {readonly game: TGame, readonly type: PapyrusScriptTypeIndexed<boolean, true, TGame>, readonly inTooltip?: boolean}) {
    switch (type.type) {
        case PapyrusScriptTypeArchetype.None:
            return <span className={`${styles['type--void']}`}>void<PapyrusTypeArrayIndicator isArray={type.isArray} /></span>;
        case PapyrusScriptTypeArchetype.Bool:
            return <span className={`${styles['type--primitive']}`}>bool<PapyrusTypeArrayIndicator isArray={type.isArray} /></span>;
        case PapyrusScriptTypeArchetype.Int:
            return <span className={`${styles['type--primitive']}`}>int<PapyrusTypeArrayIndicator isArray={type.isArray} /></span>;
        case PapyrusScriptTypeArchetype.Float:
            return <span className={`${styles['type--primitive']}`}>float<PapyrusTypeArrayIndicator isArray={type.isArray} /></span>;
        case PapyrusScriptTypeArchetype.String:
        case PapyrusScriptTypeArchetype.CustomEventName:
        case PapyrusScriptTypeArchetype.ScriptEventName:
        case PapyrusScriptTypeArchetype.StructVarName:
            return <span className={`${styles['type--primitive']}`}>string<PapyrusTypeArrayIndicator isArray={type.isArray} /></span>;
        case PapyrusScriptTypeArchetype.Var:
            return <span className={`${styles['type--var']}`}><TextWithTooltip tooltipContents="Var can represent any type.">var</TextWithTooltip><PapyrusTypeArrayIndicator isArray={type.isArray} /></span>;
        case PapyrusScriptTypeArchetype.ScriptInstance:
            return <span className={`${styles['type--scriptInstance']}`}><PapyrusScriptReference game={game} missingName={type.scriptName} possibleScripts={type.script} inTooltip={inTooltip} /><PapyrusTypeArrayIndicator isArray={type.isArray} /></span>;
        case PapyrusScriptTypeArchetype.Struct:
            return <span className={`${styles['type--struct']}`}><PapyrusScriptReference game={game} missingName={type.scriptName} possibleScripts={type.script} inTooltip={inTooltip} />:<PapyrusStructReference possibleStructs={type.struct} inTooltip={inTooltip} /><PapyrusTypeArrayIndicator isArray={type.isArray} /></span>;
        default:
            throw new UnreachableError(type, 'Unknown Papyrus type archetype!');
    }
}

export function PapyrusTypeNamed<TGame extends PapyrusGame>({game, name, type, inTooltip}: {readonly game: TGame, readonly name: string | null, readonly type: PapyrusScriptTypeIndexed<boolean, true, TGame>, readonly inTooltip?: boolean}) {
    return <span className={styles.typeWithName}>
        <PapyrusType game={game} type={type} inTooltip={inTooltip} />
        {name === null ? null : <span className={styles.typeName}>{name}</span>}
    </span>;
}

export function PapyrusTypeArrayIndicator({isArray}: {readonly isArray: boolean}) {
    return isArray
        ? <span className={`${styles['type--array']}`}>[]</span>
        : null;
}

export function PapyrusTypeValueTokenNone() {
    return <span className={`${styles['value--none']}`}>NONE</span>;
}

export function PapyrusTypeValueToken<TGame extends PapyrusGame>({game: _game, type}: {readonly game: TGame, readonly type: PapyrusScriptValueIndexed<boolean, true, TGame>}) {
    switch (type.type) {
        case PapyrusScriptTypeArchetype.Bool:
            return <span className={`${styles['value--bool']}`}>{type.value ? 'true' : 'false'}</span>;
        case PapyrusScriptTypeArchetype.Int:
            if (type.value === null) return <PapyrusTypeValueTokenNone />;
            switch (type.baseSystem) {
                case 10:
                    return <span className={`${styles['value--int']}`}>{type.value}</span>;
                case 16:
                    return <span className={`${styles['value--int']}`}>0x{type.value.toString(16)}</span>;
                default:
                    throw new UnreachableError(type.baseSystem, 'Unknown base system for integer literal!');
            }
        case PapyrusScriptTypeArchetype.Float:
            return <span className={`${styles['value--float']}`}>{type.value}</span>;
        case PapyrusScriptTypeArchetype.Var:
            return <span className={`${styles['value--var']}`}>{type.value}</span>;
        case PapyrusScriptTypeArchetype.String:
        case PapyrusScriptTypeArchetype.CustomEventName:
        case PapyrusScriptTypeArchetype.ScriptEventName:
        case PapyrusScriptTypeArchetype.StructVarName:
            return <span className={`${styles['value--string']}`}>&quot;{type.value}&quot;</span>;
        case PapyrusScriptTypeArchetype.ScriptInstance:
            if (type.value !== null) throw new UnreachableError(type, 'Script and struct instance values must be None!');
            return <PapyrusTypeValueTokenNone />;
        case PapyrusScriptTypeArchetype.Struct:
            if (type.value !== null) throw new UnreachableError(type, 'Struct value must be None!');
            return <PapyrusTypeValueTokenNone />;
        default:
            throw new UnreachableError(type, 'Unknown Papyrus type archetype!');
    }
}

export function PapyrusTypeWithValue<TGame extends PapyrusGame>({game, name, type, inTooltip}: {readonly game: TGame, readonly name: string | null, readonly type: PapyrusScriptValueIndexed<boolean, true, TGame>, readonly inTooltip?: boolean}) {
    return <span className={styles.typeWithName}>
        <PapyrusTypeNamed game={game} name={name} type={type} inTooltip={inTooltip} />
        <span className={styles.separator}>=</span>
        <PapyrusTypeValueToken game={game} type={type} />
    </span>;
}
