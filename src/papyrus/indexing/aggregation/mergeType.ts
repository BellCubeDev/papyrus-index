import { UnreachableError } from "../../../UnreachableError";
import { doesScriptExtend } from "../../../utils/doesScriptExtend";
import { iterateOverScriptParents } from "../../../utils/iterateOverScriptParents";
import { UnknownPapyrusScript, type PapyrusScriptTypeIndexed, type PapyrusScriptValueIndexed } from "../../data-structures/indexing/type";
import type { PapyrusGame } from "../../data-structures/pure/game";
import { PapyrusScriptTypeArchetype } from "../../data-structures/pure/type";

export enum PapyrusTypeMergeFailureReason {
    IsArrayMismatch = 'isArrayMismatch',
    ArchetypeMismatch = 'archetypeMismatch',
    ScriptMismatch = 'scriptMismatch',
    StructMismatch = 'structMismatch',
}

export function mergeType<TGame extends PapyrusGame, U extends PapyrusScriptTypeIndexed<boolean, true, TGame>>(existingType: U, newType: U): PapyrusTypeMergeFailureReason | U
export function mergeType<TGame extends PapyrusGame>(existingType: PapyrusScriptTypeIndexed<boolean, true, TGame>, newType: PapyrusScriptTypeIndexed<boolean, true, TGame>): PapyrusTypeMergeFailureReason | PapyrusScriptTypeIndexed<boolean, true, TGame> {
        if (newType.isArray !== existingType.isArray)
        return PapyrusTypeMergeFailureReason.IsArrayMismatch;

    if (newType.type !== existingType.type)
        return PapyrusTypeMergeFailureReason.ArchetypeMismatch;


    switch (newType.type) {
        case PapyrusScriptTypeArchetype.Bool:
        case PapyrusScriptTypeArchetype.Float:
        case PapyrusScriptTypeArchetype.CustomEventName:
        case PapyrusScriptTypeArchetype.Int:
        case PapyrusScriptTypeArchetype.ScriptEventName:
        case PapyrusScriptTypeArchetype.String:
        case PapyrusScriptTypeArchetype.StructVarName:
        case PapyrusScriptTypeArchetype.Var:
        case PapyrusScriptTypeArchetype.None:
            break;

        case PapyrusScriptTypeArchetype.ScriptInstance: {
            const scriptValue = newType;
            const existingScriptValue = existingType as typeof scriptValue;

            if (scriptValue.scriptName.toLowerCase() === existingScriptValue.scriptName.toLowerCase()) break;
            if (scriptValue.script === UnknownPapyrusScript || existingScriptValue.script === UnknownPapyrusScript)
                return PapyrusTypeMergeFailureReason.ScriptMismatch;

            const moreSpecificScript =
                doesScriptExtend(Object.values(scriptValue.script)[0]!, Object.values(existingScriptValue.script)[0]!)
                    ? scriptValue
                    : doesScriptExtend(Object.values(existingScriptValue.script)[0]!, Object.values(scriptValue.script)[0]!)
                        ? existingScriptValue
                        : null;

            if (!moreSpecificScript) return PapyrusTypeMergeFailureReason.ScriptMismatch;

            existingType = moreSpecificScript;

            break;
        }

        // May need some form of conflict resolution later on, but that's a "future me" problem in case our scope really encompasses that
        case PapyrusScriptTypeArchetype.Struct: {
            const structValue = newType;
            const existingStructValue = existingType as typeof structValue;

            if (structValue.scriptName.toLowerCase() !== existingStructValue.scriptName.toLowerCase())
                return PapyrusTypeMergeFailureReason.ScriptMismatch;

            if (structValue.structName.toLowerCase() !== existingStructValue.structName.toLowerCase())
                return PapyrusTypeMergeFailureReason.StructMismatch;

            break;
        }

        default:
            throw new UnreachableError(newType, `Papyrus Value of unknown type archetype ${(newType as PapyrusScriptTypeIndexed<boolean, true, TGame>).type} provided to mergeType()`);
    }

    return existingType;
}

export enum PapyrusValueMergeFailureReason {
    DefaultValueMismatch = 'defaultValueMismatch',
}

export function mergeValue<TGame extends PapyrusGame>(
    existingValue: PapyrusScriptValueIndexed<boolean, true, TGame>,
    newValue: PapyrusScriptValueIndexed<boolean, true, TGame>,
    matchDefaultValue: boolean = true,
): PapyrusValueMergeFailureReason | PapyrusTypeMergeFailureReason | PapyrusScriptValueIndexed<boolean, true, TGame> {
    const mergedType = mergeType(existingValue, newValue);
    if (typeof mergedType === 'string') return mergedType;

    if (matchDefaultValue && !mergedType.isArray) {
        switch (mergedType.type) {
            case PapyrusScriptTypeArchetype.Bool:
            case PapyrusScriptTypeArchetype.Float:
            case PapyrusScriptTypeArchetype.Int:
                if (existingValue.value !== newValue.value) return PapyrusValueMergeFailureReason.DefaultValueMismatch;
                break;

            case PapyrusScriptTypeArchetype.String:
            case PapyrusScriptTypeArchetype.CustomEventName:
            case PapyrusScriptTypeArchetype.ScriptEventName:
            case PapyrusScriptTypeArchetype.StructVarName:
                if ((existingValue.value as string).toLowerCase() !== (newValue.value as string).toLowerCase()) return PapyrusValueMergeFailureReason.DefaultValueMismatch;
                break;

            case PapyrusScriptTypeArchetype.ScriptInstance:
            case PapyrusScriptTypeArchetype.Struct:
                break;

            case PapyrusScriptTypeArchetype.Var:
                if (existingValue.value !== newValue.value) return PapyrusValueMergeFailureReason.DefaultValueMismatch;
                break;

            default:
                throw new UnreachableError(mergedType, `Papyrus Value of unknown type archetype ${(mergedType as PapyrusScriptValueIndexed<boolean, true, TGame>).type} provided to mergeValue()`);
        }
    }

    return mergedType;
}
