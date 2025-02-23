import { memoizeDevServerConst } from "../../../utils/memoizeDevServerConst";
import type { PapyrusGame } from "../pure/game";
import type { PapyrusScriptTypeArchetype, PapyrusScriptTypeLiteral, PapyrusScriptTypeScriptInstance, PapyrusScriptTypeStruct, PapyrusScriptTypeVar, PapyrusScriptValueBase, PapyrusScriptValueBool, PapyrusScriptValueFloat, PapyrusScriptValueInt, PapyrusScriptValueString, PapyrusScriptValueVar } from "../pure/type";
import type { PapyrusPossibleScripts, PapyrusScriptIndexed } from "./script";
import type { PapyrusScriptStructIndexed } from "./struct";

export const UnknownPapyrusScript: unique symbol = memoizeDevServerConst('UnknownPapyrusScript', ()=>Symbol('UnknownPapyrusScript')) as any;
export const UnknownPapyrusScriptStruct: unique symbol = memoizeDevServerConst('UnknownPapyrusScriptStruct', ()=>Symbol('UnknownPapyrusScriptStruct')) as any;

export interface PapyrusScriptTypeScriptInstanceIndexed<TIsArray extends boolean, TIsParameter extends boolean, TGame extends PapyrusGame> extends PapyrusScriptTypeScriptInstance<TIsArray, TIsParameter> {
    script: PapyrusPossibleScripts<TGame> | typeof UnknownPapyrusScript;
}

export interface PapyrusScriptTypeStructIndexed<TIsArray extends boolean, TIsParameter extends boolean, TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> extends PapyrusScriptTypeStruct<TIsArray, TIsParameter> {
    script: PapyrusPossibleScripts<TGame> | typeof UnknownPapyrusScript;
    struct: Record<Lowercase<string>, PapyrusScriptStructIndexed<TGame>> | typeof UnknownPapyrusScriptStruct;
    scriptWithStruct: Record<Lowercase<string>, readonly [PapyrusScriptIndexed<TGame>, PapyrusScriptStructIndexed<TGame>]> | typeof UnknownPapyrusScript | typeof UnknownPapyrusScriptStruct;
}

export type PapyrusScriptTypeIndexed<TIsArray extends boolean, TIsParameter extends boolean, TGame extends PapyrusGame> = PapyrusScriptTypeLiteral<TIsArray, TIsParameter> | PapyrusScriptTypeScriptInstanceIndexed<TIsArray, TIsParameter, TGame> | PapyrusScriptTypeStructIndexed<TIsArray, TIsParameter, Exclude<TGame, PapyrusGame.SkyrimSE>> | PapyrusScriptTypeVar<TIsArray, TIsParameter>;


export interface PapyrusScriptValueScriptInstanceIndexed<TIsArray extends boolean, TIsParameter extends boolean, TGame extends PapyrusGame> extends PapyrusScriptValueBase<TIsArray, TIsParameter>, PapyrusScriptTypeScriptInstanceIndexed<TIsArray, TIsParameter, TGame> {
    type: PapyrusScriptTypeArchetype.ScriptInstance;
    /** The value of a PapyrusScriptValueScriptInstance must be None for the purposes of this index. This is because you may not call functions outside of a function—nor may you reference properties. */
    value: null;
}

export interface PapyrusScriptValueStructIndexed<TIsArray extends boolean, TIsParameter extends boolean, TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE>> extends PapyrusScriptValueBase<TIsArray, TIsParameter>, PapyrusScriptTypeStructIndexed<TIsArray, TIsParameter, TGame> {
    type: PapyrusScriptTypeArchetype.Struct;
    /** The value of a PapyrusScriptValueStruct must be None for the purposes of this index. This is because you may not initialize structs outside of a function—nor may you reference properties. */
    value: null;
}

export type PapyrusScriptValueIndexed<TIsArray extends boolean, TIsParameter extends boolean, TGame extends PapyrusGame> = PapyrusScriptValueBool<TIsArray, TIsParameter> | PapyrusScriptValueInt<TIsArray, TIsParameter> | PapyrusScriptValueFloat<TIsArray, TIsParameter> | PapyrusScriptValueString<TIsArray, TIsParameter> | PapyrusScriptValueScriptInstanceIndexed<TIsArray, TIsParameter, TGame> | PapyrusScriptValueStructIndexed<TIsArray, TIsParameter, Exclude<TGame, PapyrusGame.SkyrimSE>> | PapyrusScriptValueVar<TIsArray, TIsParameter>;
