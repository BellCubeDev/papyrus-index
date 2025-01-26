export enum PapyrusScriptTypeArchetype {
    None = 'None',
    Bool = 'Bool',
    Int = 'Int',
    Float = 'Float',
    String = 'String',
    ScriptInstance = 'ScriptInstance',

    // Post-Skyrim additions
    Struct = 'Struct',
    ScriptInstanceOrStruct = 'ScriptInstanceOrStruct',
    Var = 'Var',

    // Post-Skyrim additions, function parameter only
    ScriptEventName = 'ScriptEventName',
    CustomEventName = 'CustomEventName',
    StructVarName = 'StructVarName',
}

export interface PapyrusScriptTypeBase<TIsArray extends boolean, TIsParameter extends boolean> {
    type: Exclude<PapyrusScriptTypeArchetype, PapyrusScriptTypeArchetype.CustomEventName | PapyrusScriptTypeArchetype.ScriptEventName | PapyrusScriptTypeArchetype.StructVarName> | (TIsParameter extends true ? PapyrusScriptTypeArchetype.CustomEventName | PapyrusScriptTypeArchetype.ScriptEventName | PapyrusScriptTypeArchetype.StructVarName : never);
    /** If true, this type is an array type. Note that structs may not contain arrays within themselves.
     *
     * If the type is an array, the initial value, if present, must be None for the purposes of this index. This is because you may not initialize an array outside of a function.
    */
    isArray: TIsArray;
}

export interface PapyrusScriptTypeLiteral<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptTypeBase<TIsArray, TIsParameter> {
    type: PapyrusScriptTypeArchetype.Bool | PapyrusScriptTypeArchetype.Int | PapyrusScriptTypeArchetype.Float | PapyrusScriptTypeArchetype.String | PapyrusScriptTypeArchetype.None | (TIsParameter extends true ? PapyrusScriptTypeArchetype.ScriptEventName | PapyrusScriptTypeArchetype.CustomEventName | PapyrusScriptTypeArchetype.StructVarName : never);
}

export interface PapyrusScriptTypeScriptInstance<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptTypeBase<TIsArray, TIsParameter> {
    type: PapyrusScriptTypeArchetype.ScriptInstance;
    scriptName: string;
}

export interface PapyrusScriptTypeStruct<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptTypeBase<TIsArray, TIsParameter> {
    type: PapyrusScriptTypeArchetype.Struct;
    scriptName: string;
    structName: string;
}

export interface PapyrusScriptTypeScriptInstanceOrStruct<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptTypeBase<TIsArray, TIsParameter> {
    type: PapyrusScriptTypeArchetype.ScriptInstanceOrStruct;
    ambiguousName: string;
}

export interface PapyrusScriptTypeVar<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptTypeBase<TIsArray, TIsParameter> {
    type: PapyrusScriptTypeArchetype.Var;
}

export type PapyrusScriptType<TIsArray extends boolean, TIsParameter extends boolean> = PapyrusScriptTypeLiteral<TIsArray, TIsParameter> | PapyrusScriptTypeScriptInstance<TIsArray, TIsParameter> | PapyrusScriptTypeStruct<TIsArray, TIsParameter> | PapyrusScriptTypeScriptInstanceOrStruct<TIsArray, TIsParameter> | PapyrusScriptTypeVar<TIsArray, TIsParameter>;




export interface PapyrusScriptValueBase<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptTypeBase<TIsArray, TIsParameter> {
    /** If the type is an array, the initial value, if present, must be None for the purposes of this index. This is because you may not initialize an array outside of a function—nor may you reference properties. */
    value: (TIsArray extends false ? unknown : never) | null;
}

export interface PapyrusScriptValueBool<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptValueBase<TIsArray, TIsParameter>, PapyrusScriptTypeLiteral<TIsArray, TIsParameter> {
    type: PapyrusScriptTypeArchetype.Bool;
    value: (TIsArray extends false ? boolean : never) | null;
}

export interface PapyrusScriptValueInt<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptValueBase<TIsArray, TIsParameter>, PapyrusScriptTypeLiteral<TIsArray, TIsParameter> {
    type: PapyrusScriptTypeArchetype.Int;
    /** The value for this integer literal. Stored as a JS number type, meaning it does not retain base system information on its own. */
    value: (TIsArray extends false ? number : never) | null;
    /** The base system for this integer literal. The default base is 10, but modifiers such as 0x will make it base-16 */
    baseSystem: (TIsArray extends false ? 16 : never) | 10;
}

export interface PapyrusScriptValueFloat<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptValueBase<TIsArray, TIsParameter>, PapyrusScriptTypeLiteral<TIsArray, TIsParameter> {
    type: PapyrusScriptTypeArchetype.Float;
    value: (TIsArray extends false ? number : never) | null;
}

export interface PapyrusScriptValueString<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptValueBase<TIsArray, TIsParameter>, PapyrusScriptTypeLiteral<TIsArray, TIsParameter> {
    type: PapyrusScriptTypeArchetype.String | (TIsParameter extends true ? PapyrusScriptTypeArchetype.ScriptEventName | PapyrusScriptTypeArchetype.CustomEventName | PapyrusScriptTypeArchetype.StructVarName : never);
    value: (TIsArray extends false ? string : never) | null;
}


export interface PapyrusScriptValueScriptInstance<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptValueBase<TIsArray, TIsParameter>, PapyrusScriptTypeScriptInstance<TIsArray, TIsParameter> {
    type: PapyrusScriptTypeArchetype.ScriptInstance;
    /** The value of a PapyrusScriptValueScriptInstance must be None for the purposes of this index. This is because you may not call functions outside of a function—nor may you reference properties. */
    value: null;
}

export interface PapyrusScriptValueStruct<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptValueBase<TIsArray, TIsParameter>, PapyrusScriptTypeStruct<TIsArray, TIsParameter> {
    type: PapyrusScriptTypeArchetype.Struct;
    /** The value of a PapyrusScriptValueStruct must be None for the purposes of this index. This is because you may not initialize structs outside of a function—nor may you reference properties. */
    value: null;
}

export interface PapyrusScriptValueScriptInstanceOrStruct<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptValueBase<TIsArray, TIsParameter>, PapyrusScriptTypeScriptInstanceOrStruct<TIsArray, TIsParameter> {
    type: PapyrusScriptTypeArchetype.ScriptInstanceOrStruct;
    /** The value of a PapyrusScriptValueScriptInstanceOrStruct must be None for the purposes of this index. This is because you may not call functions outside of a function—nor may you reference properties. */
    value: null;
}

export interface PapyrusScriptValueVar<TIsArray extends boolean, TIsParameter extends boolean> extends PapyrusScriptValueBase<TIsArray, TIsParameter>, PapyrusScriptTypeVar<TIsArray, TIsParameter> {
    type: PapyrusScriptTypeArchetype.Var;
    /** Because the default value of a Var could be anything, we won't bother parsing it and will just leave it as a string. Easier than programming some form of type inference. */
    value: (TIsArray extends false ? string : never) | null;
}

export type PapyrusScriptValue<TIsArray extends boolean, TIsParameter extends boolean> = PapyrusScriptValueBool<TIsArray, TIsParameter> | PapyrusScriptValueInt<TIsArray, TIsParameter> | PapyrusScriptValueFloat<TIsArray, TIsParameter> | PapyrusScriptValueString<TIsArray, TIsParameter> | PapyrusScriptValueScriptInstance<TIsArray, TIsParameter> | PapyrusScriptValueStruct<TIsArray, TIsParameter> | PapyrusScriptValueScriptInstanceOrStruct<TIsArray, TIsParameter> | PapyrusScriptValueVar<TIsArray, TIsParameter>;
