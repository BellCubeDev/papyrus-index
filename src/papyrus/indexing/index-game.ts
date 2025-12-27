import type { PapyrusFeature, PapyrusFeatureSupportedGames, PapyrusFeatureUnsupportedGames } from "@/papyrus/feature-support";
import { toLowerCase } from "../../utils/toLowerCase";
import type { PapyrusScriptEventOrBaseFunctionIndexed, PapyrusScriptFunctionIndexed, PapyrusScriptFunctionParameterIndexed } from "../data-structures/indexing/function";
import { AllSourcesCombined, type AllSourcesCombinedObject, type PapyrusGameDataIndexed } from "../data-structures/indexing/game";
import type { PapyrusScriptPropertyIndexed } from "../data-structures/indexing/property";
import type { PapyrusScriptPropertyGroupIndexed } from "../data-structures/indexing/propertyGroup";
import type { PapyrusPossibleScripts, PapyrusScriptIndexed } from "../data-structures/indexing/script";
import type { PapyrusScriptSourceIndexed } from "../data-structures/indexing/scriptSource";
import type { PapyrusScriptStructIndexed, PapyrusScriptStructMemberIndexed } from "../data-structures/indexing/struct";
import { UnknownPapyrusScript, UnknownPapyrusScriptStruct, type PapyrusScriptTypeIndexed, type PapyrusScriptTypeScriptInstanceIndexed, type PapyrusScriptTypeStructIndexed, type PapyrusScriptValueIndexed } from "../data-structures/indexing/type";
import type { PapyrusGame, PapyrusGameData } from "../data-structures/pure/game";
import type { PapyrusScript } from "../data-structures/pure/script";
import type { PapyrusScriptStruct } from "../data-structures/pure/struct";
import { PapyrusScriptTypeArchetype, type PapyrusScriptType, type PapyrusScriptValue } from "../data-structures/pure/type";
import { aggregateScript } from "./aggregation/aggregateScript";

// TODO: Break this file up

type AnyScript<TGame extends PapyrusGame> = (PapyrusScript<TGame> | PapyrusScriptIndexed<TGame>) & Pick<PapyrusScriptIndexed<TGame>, 'extendedBy'>;
type AnyScriptPossibleScripts<TGame extends PapyrusGame> = Record<Lowercase<string>, AnyScript<TGame>>;

export interface IndexingContextGame<TGame extends PapyrusGame> {
    game: TGame;
    scriptsByNameThenSource: Record<Lowercase<string>, AnyScriptPossibleScripts<TGame>>;
    /** Basically acts as a pointer. When we clone this value, we still reference the same number---no matter how deep we nest or how much we clone. */
    nextEntityIdRef: {nextEntityId: number};
    unfinishedGameRef: PapyrusGameDataIndexed<TGame>;
}
export interface IndexingContextSource<TGame extends PapyrusGame> extends IndexingContextGame<TGame> {
    sourceIdentifier: Lowercase<string>
    unfinishedSourceRef: PapyrusGameDataIndexed<TGame>['scriptSources'][Lowercase<string>];
}

export interface IndexingContextScript<TGame extends PapyrusGame> extends IndexingContextSource<TGame> {
    script: AnyScript<TGame>;
    blacklistedSources: Set<Lowercase<string>>;
    objectsThatMayNeedFutureBlacklistedSourcesRemoved: Set<Emptyable>;
}


/**
 * Modifies the parsed scripts in-place to exchange all references to script/struct _names_ into references to their actual objects.
 */
export function indexGame<TGame extends PapyrusGame>({game, scriptSources}: PapyrusGameData<TGame>): PapyrusGameDataIndexed<TGame> {
    const scriptsByNameThenSource: Record<Lowercase<string>, AnyScriptPossibleScripts<TGame>> = {}; // need this mapping now for proper indexing
    const resultScripts: Record<Lowercase<string>, PapyrusPossibleScripts<TGame>> = {};

    for (const scriptSource of Object.values(scriptSources)) {
        for (const [scriptNameLowercase, script] of Object.entries(scriptSource.scripts))
            (scriptsByNameThenSource[scriptNameLowercase] ??= {})[scriptSource.sourceIdentifier] = Object.assign(script, {extendedBy: {}});
    }

    const ref = {};

    const ctx: IndexingContextGame<TGame> = {
        game,
        unfinishedGameRef: ref as PapyrusGameDataIndexed<TGame>,
        scriptsByNameThenSource,
        nextEntityIdRef: { nextEntityId: 0 },
    };

    for (const [scriptNameLowercase, possibleScripts] of Object.entries(scriptsByNameThenSource)) {
        for (const [sourceIdentifier, script] of Object.entries(possibleScripts)) {
            const indexed = indexScript(script, {...ctx, sourceIdentifier, unfinishedSourceRef: scriptSources[sourceIdentifier] as unknown as PapyrusScriptSourceIndexed<TGame>} satisfies IndexingContextSource<TGame>);
            (resultScripts[scriptNameLowercase] ??= {})[sourceIdentifier] = indexed;
        }
    }

    const resultScriptsWithCombined = Object.fromEntries(Object.entries(resultScripts).map(([scriptNameLowercase, possibleScripts]) => [
        scriptNameLowercase,
        Object.assign(possibleScripts, {
            [AllSourcesCombined]: aggregateScript(possibleScripts, ctx),
        } satisfies AllSourcesCombinedObject<TGame>),
    ] as const));

    const indexedGame: PapyrusGameDataIndexed<TGame> = Object.assign(ref, {
        game,
        scripts: resultScriptsWithCombined,

        // we'll index the scripts in-place, so the object will remain the same
        scriptSources: scriptSources as unknown as Record<Lowercase<string>, PapyrusScriptSourceIndexed<TGame>>,

        topLevelScripts: Object.fromEntries(
            Object.entries(resultScriptsWithCombined)
                .map(([scriptNameLowercase,scripts]) => [scriptNameLowercase, Object.fromEntries(Object.entries(scripts).filter(([,script]) => script.extends === null))] as const)
                .filter(([,scripts]) => Object.keys(scripts).length > 0)
        )
    });

    return indexedGame;
}

const ON_EMPTIED = Symbol('PapyrusIndexing__ON_EMPTIED');

type Emptyable = Record<Lowercase<string>, unknown> & {[ON_EMPTIED]: ()=>void};

/**
 * Modifies the parsed Papyrus script in-place to exchange all references to script/struct _names_ into references to their actual objects.
 */
function indexScript<TGame extends PapyrusGame>(script: AnyScript<TGame>, ctx: IndexingContextSource<TGame>): PapyrusScriptIndexed<TGame> {
    if ('extendsName' in script) return script;

    const blacklistedSources = new Set<Lowercase<string>>();
    const objectsThatMayNeedFutureBlacklistedSourcesRemoved = new Set<Emptyable>();

    const scriptCtx = {
        ...ctx,
        script,
        blacklistedSources,
        objectsThatMayNeedFutureBlacklistedSourcesRemoved,
    };

    const indexedStructs = script.structs === null ? null as (TGame extends PapyrusFeatureUnsupportedGames<PapyrusFeature.Structs> ? null : never) : Object.fromEntries(Object.entries(
        script.structs as Record<Lowercase<string>, PapyrusScriptStruct<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>> | Record<Lowercase<string>, PapyrusScriptStructIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>>
    ).map(([structName, struct]) => [
        structName,
        Object.assign(struct, {
            game: ctx.unfinishedGameRef as PapyrusGameDataIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>,
            script: script as unknown as PapyrusScriptIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>,
            members: Object.fromEntries(Object.entries(struct.members).map(([memberName, member]) => [
                memberName,
                Object.assign(member, {
                    value: indexTypeValue(member.value, scriptCtx) as  PapyrusScriptValueIndexed<false, false, PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>,
                    script: script as unknown as PapyrusScriptIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>,
                    struct: struct as unknown as PapyrusScriptStructIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>,
                    game: ctx.unfinishedGameRef as PapyrusGameDataIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>,
                } satisfies Partial<PapyrusScriptStructMemberIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>>),
            ] as const)),
        } satisfies Partial<PapyrusScriptStructIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>>),
    ] as const)) satisfies Record<Lowercase<string>, PapyrusScriptStructIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>>;

    const res: PapyrusScriptIndexed<TGame> = Object.assign(script, {
        game: ctx.unfinishedGameRef,
        source: ctx.unfinishedSourceRef,
        functions: Object.fromEntries(Object.entries(script.functions).map(([funcNameLowercase, func]) => [funcNameLowercase, Object.assign(func, {
            game: ctx.unfinishedGameRef,
            returnType: indexType<TGame, boolean, false>(func.returnType, scriptCtx),
            script: script as unknown as PapyrusScriptIndexed<TGame>,
            parameters: func.parameters.map(param => Object.assign(param, {
                value: indexTypeValue<TGame, boolean, true>(param.value, scriptCtx),
            } satisfies Partial<PapyrusScriptFunctionParameterIndexed<TGame>>)),
        } satisfies Partial<PapyrusScriptFunctionIndexed<TGame>>)])),
        events: Object.fromEntries(Object.entries(script.events).map(([eventNameLowercase, event]) => [eventNameLowercase, Object.assign(event, {
            game: ctx.unfinishedGameRef,
            script: script as unknown as PapyrusScriptIndexed<TGame>,
            parameters: event.parameters.map(param => Object.assign(param, {
                value: indexTypeValue<TGame, boolean, true>(param.value, scriptCtx),
            } satisfies Partial<PapyrusScriptFunctionParameterIndexed<TGame>>)),
        } satisfies Partial<PapyrusScriptEventOrBaseFunctionIndexed<TGame>>)])),
        extends: getPossibleScriptsFinal(script.extends ? toLowerCase(script.extends) : script.extends as null|'', ctx.scriptsByNameThenSource, objectsThatMayNeedFutureBlacklistedSourcesRemoved, ()=>{res.extends = UnknownPapyrusScript}),
        extendsName: script.extends,
        imports: script.imports.map((importAggregate, index) => getPossibleScriptsFinal(toLowerCase(importAggregate), ctx.scriptsByNameThenSource, objectsThatMayNeedFutureBlacklistedSourcesRemoved, ()=>{res.imports[index] = UnknownPapyrusScript})),
        importNames: script.imports,
        propertyGroups: Object.fromEntries(Object.entries(script.propertyGroups).map(([groupName, group]) => [
            groupName,
            Object.assign(group, {
                game: ctx.unfinishedGameRef,
                script: script as unknown as PapyrusScriptIndexed<TGame>,
                properties: Object.fromEntries(Object.entries(group.properties).map(([propertyName, property]) => [
                    propertyName,
                    Object.assign(property, {
                        game: ctx.unfinishedGameRef,
                        script: script as unknown as PapyrusScriptIndexed<TGame>,
                        group: group as unknown as PapyrusScriptPropertyGroupIndexed<TGame>,
                        value: indexTypeValue<TGame, boolean, false>(property.value, scriptCtx),
                    } satisfies Partial<PapyrusScriptPropertyIndexed<TGame>>),
                ] as const)),
            } satisfies Partial<PapyrusScriptPropertyGroupIndexed<TGame>>),
        ] as const)),
        structs: indexedStructs as (TGame extends PapyrusFeatureSupportedGames<PapyrusFeature.Structs> ? Record<Lowercase<string>, PapyrusScriptStructIndexed<TGame>> : never) | (TGame extends PapyrusFeatureUnsupportedGames<PapyrusFeature.Structs> ? null : never),
    } satisfies Partial<PapyrusScriptIndexed<TGame>>);

    for (const object of objectsThatMayNeedFutureBlacklistedSourcesRemoved) {
        for (const blacklistedSource of blacklistedSources) delete object[blacklistedSource];
        if (Object.keys(object).length === 0) object[ON_EMPTIED]();
    }

    const scriptNameLowercase = toLowerCase(script.namespaceName);
    if (res.extends && res.extends !== UnknownPapyrusScript) {
        for (const extendedScript of Object.values(res.extends)) {
            extendedScript.extendedBy[scriptNameLowercase] ??= {};
            extendedScript.extendedBy[scriptNameLowercase][ctx.sourceIdentifier] = res;
        }
    }

    return res;
}

function getPossibleScriptsFinal<TGame extends PapyrusGame, TScriptNameInputType extends null | Lowercase<string> | PapyrusPossibleScripts<TGame> | typeof UnknownPapyrusScript>(
    scriptName: TScriptNameInputType,
    scriptsByNameThenSource: Record<Lowercase<string>, AnyScriptPossibleScripts<TGame>>,
    objectsThatMayNeedFutureBlacklistedSourcesRemoved: Set<Emptyable>,
    onEmptied: ()=>void,
): (TScriptNameInputType extends null ? null : never) | PapyrusPossibleScripts<TGame> | typeof UnknownPapyrusScript {
    if (scriptName === null) return null as TScriptNameInputType extends null ? null : never;
    if (typeof scriptName !== 'string') return scriptName as Exclude<TScriptNameInputType, string|null>;
    const res = scriptsByNameThenSource[scriptName as Lowercase<string>] ? {...scriptsByNameThenSource[scriptName as Lowercase<string>], [ON_EMPTIED]: onEmptied} satisfies PapyrusPossibleScripts<TGame> & Emptyable : UnknownPapyrusScript;
    if (res !== UnknownPapyrusScript) objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(res);
    return res;
}

const DownstreamScriptsMemo_ = new WeakMap<PapyrusScript<PapyrusGame> | PapyrusScriptIndexed<PapyrusGame>, Set<AnyScriptPossibleScripts<PapyrusGame>>>();
const DownstreamScriptsMemo = DownstreamScriptsMemo_ as Omit<typeof DownstreamScriptsMemo_, 'get'|'set'> & {
    get<TGame extends PapyrusGame>(thisScript: PapyrusScript<TGame> | PapyrusScriptIndexed<TGame>): Set<AnyScriptPossibleScripts<TGame>> | undefined;
    set<TGame extends PapyrusGame>(thisScript: PapyrusScript<TGame> | PapyrusScriptIndexed<TGame>, downstreamScripts: Set<AnyScriptPossibleScripts<TGame>>): void;
};

let getAllDownstreamScriptsRecursionLevels = 0;
const MaxGetAllDownstreamScriptsRecursionLevels = 500;
function getAllDownstreamScripts<TGame extends PapyrusGame>(thisScript: AnyScript<TGame>, scriptsByNameThenSource: Record<Lowercase<string>, AnyScriptPossibleScripts<TGame>>): Set<AnyScriptPossibleScripts<TGame>> {
    const memoized = DownstreamScriptsMemo.get(thisScript);
    if (memoized) return memoized;

    getAllDownstreamScriptsRecursionLevels++;
    try {
        if (getAllDownstreamScriptsRecursionLevels > MaxGetAllDownstreamScriptsRecursionLevels) {
            console.error('Infinite loop detected in getAllDownstreamScripts; exceeded maximum recursion levels', thisScript);
            throw new Error('Infinite loop detected in getAllDownstreamScripts; exceeded maximum recursion levels');
        }


        const downstreamScripts = new Set<AnyScriptPossibleScripts<TGame>>();
        if (thisScript.extends !== null && thisScript.extends !== UnknownPapyrusScript) {
            let downstream: undefined | Record<Lowercase<string>, AnyScript<TGame>>;

            if (typeof thisScript.extends === 'string') downstream = scriptsByNameThenSource[toLowerCase(thisScript.extends)];
            else downstream = thisScript.extends;

            if (downstream) {
                downstreamScripts.add(downstream);
                for (const script of Object.values(downstream))
                    getAllDownstreamScripts(script, scriptsByNameThenSource).forEach(downstreamScripts.add, downstreamScripts);
            }
        }

        // Set of tasks so we can always be certain that the highest-level scripts are listed first
        // Note that extension takes priority over imports
        const tasks: (()=>void)[] = [];

        if (thisScript.imports.length < 0) return downstreamScripts;
        if (typeof thisScript.imports[0]! === 'string') {
            for (const importName of thisScript.imports as typeof thisScript.imports & string[]) {
                const downstream = scriptsByNameThenSource[toLowerCase(importName)];
                if (downstream) {
                    downstreamScripts.add(downstream);

                    tasks.push(() => {
                        for (const script of Object.values(downstream))
                            getAllDownstreamScripts(script, scriptsByNameThenSource).forEach(downstreamScripts.add, downstreamScripts);
                    });
                }
            }
        } else {
            for (const importAggregate of thisScript.imports as typeof thisScript.imports & AnyScriptPossibleScripts<TGame>[]) {
                downstreamScripts.add(importAggregate);
                tasks.push(() => {
                    for (const script of Object.values(importAggregate))
                        getAllDownstreamScripts(script, scriptsByNameThenSource).forEach(downstreamScripts.add, downstreamScripts);
                });
            }
        }

        for (const task of tasks) task();

        DownstreamScriptsMemo.set(thisScript, downstreamScripts);
        return downstreamScripts;
    } finally {
        getAllDownstreamScriptsRecursionLevels--;
    }
}

/**
 * Modifies the parsed Papyrus type in-place to exchange all references to script/struct _names_ into references to their actual objects.
 */
function indexType<TGame extends PapyrusGame, TIsArray extends boolean, TIsParameter extends boolean>($type: PapyrusScriptTypeIndexed<TIsArray, TIsParameter, TGame> | PapyrusScriptType<TIsArray, TIsParameter>, ctx: IndexingContextScript<TGame>): PapyrusScriptTypeIndexed<TIsArray, TIsParameter, TGame> {
    const type = $type as PapyrusScriptTypeIndexed<TIsArray, true, TGame> | PapyrusScriptType<TIsArray, true>;
    const scriptsByNameThenSource = ctx.scriptsByNameThenSource as Record<Lowercase<string>, Record<Lowercase<string>, PapyrusScriptIndexed<TGame>>>;
    switch (type.type) {
        case PapyrusScriptTypeArchetype.ScriptInstance: {
            const script = scriptsByNameThenSource[toLowerCase(type.scriptName)] || UnknownPapyrusScript;
            return Object.assign(type, {
                script,
            } as const);
        }
        case PapyrusScriptTypeArchetype.Struct: {
            if ('struct' in type) return type;
            const scriptNameLowercase = toLowerCase(type.scriptName);
            const foundScriptAggregateRaw = scriptsByNameThenSource[scriptNameLowercase] as Record<Lowercase<string>, PapyrusScriptIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>> | undefined;
            if (!foundScriptAggregateRaw) {
                return Object.assign(type, {
                    script: UnknownPapyrusScript,
                    struct: UnknownPapyrusScriptStruct,
                    scriptWithStruct: UnknownPapyrusScript,
                } as const);
            }
            const foundScriptAggregate = {...foundScriptAggregateRaw};
            const structNameLowercase = toLowerCase(type.structName);
            const applicableScripts = Object.entries(foundScriptAggregate).filter((scriptEntry): scriptEntry is [typeof scriptEntry[0], typeof scriptEntry[1] & {structs: NonNullable<typeof scriptEntry[1]['structs']>}] => {
                const hasStruct = scriptEntry[1].structs?.[structNameLowercase] !== undefined;
                if (!hasStruct) ctx.blacklistedSources.add(scriptEntry[0]);
                return hasStruct;
            });
            const finalScriptsAggregate = Object.fromEntries(applicableScripts);
            const onEmptied = ()=>{
                const obj = (type as unknown as PapyrusScriptTypeStructIndexed<boolean, true, PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>);
                obj.script = UnknownPapyrusScript;
                obj.struct = UnknownPapyrusScriptStruct;
                obj.scriptWithStruct = UnknownPapyrusScriptStruct;
            };
            if (applicableScripts.length === 0) {
                ctx.objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(Object.assign(foundScriptAggregate, {[ON_EMPTIED]: onEmptied}));
                return Object.assign(type, {
                    script: foundScriptAggregate,
                    struct: UnknownPapyrusScriptStruct,
                    scriptWithStruct: UnknownPapyrusScriptStruct,
                } as const);
            }


            const res: PapyrusScriptTypeStructIndexed<TIsArray, TIsParameter, PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>> = Object.assign(type, {
                script: finalScriptsAggregate,
                struct: Object.fromEntries(applicableScripts.map(([sourceIdentifier, script]) => [sourceIdentifier, (script.structs as Record<Lowercase<string>, PapyrusScriptStructIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>>)[structNameLowercase]!] as const)),
                scriptWithStruct: Object.fromEntries(applicableScripts.map(([sourceIdentifier, script]) => [sourceIdentifier, [script, (script.structs as Record<Lowercase<string>, PapyrusScriptStructIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>>)[structNameLowercase]!] as const] as const)),
            } as const);

            ctx.objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(Object.assign(res.struct, {[ON_EMPTIED]: onEmptied}));
            ctx.objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(Object.assign(res.scriptWithStruct, {[ON_EMPTIED]: onEmptied}));

            return res;
        }
        case PapyrusScriptTypeArchetype.ScriptInstanceOrStruct: {
            const thisScriptNameLowercase = toLowerCase(ctx.script.namespaceName);
            const foundScriptAggregates = [scriptsByNameThenSource[thisScriptNameLowercase] as Record<Lowercase<string>, PapyrusScriptIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>>, ...getAllDownstreamScripts(ctx.script, ctx.scriptsByNameThenSource)];

            const ambiguousNameLowercase = toLowerCase(type.ambiguousName);
            const scriptsWithTargetStruct: AnyScriptPossibleScripts<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>[] = Array.from(foundScriptAggregates.map((scriptAggregate) => {
                const sourcesToBlacklistIfStructFound: Lowercase<string>[] = [];
                const filtered = Object.entries(scriptAggregate as AnyScriptPossibleScripts<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>).filter(([sourceIdentifier, script]) => {
                    const hasStruct = script.structs?.[ambiguousNameLowercase] !== undefined;
                    if (!hasStruct) sourcesToBlacklistIfStructFound.push(sourceIdentifier);
                    return hasStruct;
                });
                if (filtered.length === 0) return null;
                sourcesToBlacklistIfStructFound.forEach(ctx.blacklistedSources.add, ctx.blacklistedSources);
                return Object.fromEntries(filtered);
            })).filter((x): x is Exclude<typeof x, null> => x !== null);

            if (scriptsWithTargetStruct.length !== 0) {
                if (scriptsWithTargetStruct.length > 1) console.warn('Multiple scripts with struct found for ScriptInstanceOrStruct type', {type, ctx});
                const firstScriptAggregate = {...scriptsWithTargetStruct[0]! as PapyrusPossibleScripts<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>};
                const res = Object.assign(type, {
                    type: PapyrusScriptTypeArchetype.Struct,
                    script: firstScriptAggregate,
                    scriptName: Object.values(firstScriptAggregate)[0]!.namespaceName,
                    struct: Object.fromEntries(Object.entries(firstScriptAggregate).map(([sourceIdentifier, script]) => [sourceIdentifier, script.structs![ambiguousNameLowercase] as PapyrusScriptStructIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>] as const)),
                    structName: type.ambiguousName,
                    scriptWithStruct: Object.fromEntries(Object.entries(firstScriptAggregate).map(([sourceIdentifier, script]) => [sourceIdentifier, [script, script.structs![ambiguousNameLowercase] as PapyrusScriptStructIndexed<PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>] as const] as const))
                } as const) satisfies PapyrusScriptTypeStructIndexed<TIsArray, TIsParameter, PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>;
                const onEmptied = ()=>{
                    const obj = (type as unknown as PapyrusScriptTypeStructIndexed<boolean, true, PapyrusFeatureSupportedGames<PapyrusFeature.Structs, TGame>>);
                    obj.script = UnknownPapyrusScript;
                    obj.struct = UnknownPapyrusScriptStruct;
                    obj.scriptWithStruct = UnknownPapyrusScriptStruct;
                };
                ctx.objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(Object.assign(res.script, {[ON_EMPTIED]: onEmptied}));
                ctx.objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(Object.assign(res.struct, {[ON_EMPTIED]: onEmptied}));
                ctx.objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(Object.assign(res.scriptWithStruct, {[ON_EMPTIED]: onEmptied}));
                return res;
            } else {
                const foundScriptRaw = scriptsByNameThenSource[ambiguousNameLowercase];
                if (!foundScriptRaw) {
                    return Object.assign(type, {
                        type: PapyrusScriptTypeArchetype.ScriptInstance,
                        scriptName: type.ambiguousName,
                        script: UnknownPapyrusScript,
                    } as const);
                }

                const foundScript = {...foundScriptRaw, [ON_EMPTIED]: ()=>{(res.script as unknown) = UnknownPapyrusScript}};

                const res = Object.assign(type, {
                    type: PapyrusScriptTypeArchetype.ScriptInstance,
                    scriptName: type.ambiguousName,
                    script: foundScript,
                }) satisfies PapyrusScriptTypeScriptInstanceIndexed<TIsArray, TIsParameter, TGame>;
                ctx.objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(res.script);
                return res;
            }
        }
        default: {
            return type as PapyrusScriptTypeIndexed<TIsArray, TIsParameter, TGame>;
        }

    }
}

/**
 * Modifies the parsed Papyrus type in-place to exchange all references to script/struct _names_ into references to their actual objects.
 *
 * Could potentially accomplish this with generics rather than a case, but we'll see.
 */
function indexTypeValue<TGame extends PapyrusGame, TIsArray extends boolean, TIsParameter extends boolean>(value: PapyrusScriptValue<TIsArray, TIsParameter>, ctx: IndexingContextScript<TGame>): PapyrusScriptValueIndexed<TIsArray, TIsParameter, TGame> {
    return indexType(value, ctx) as PapyrusScriptValueIndexed<TIsArray, TIsParameter, TGame>;
}
