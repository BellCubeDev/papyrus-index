import { toLowerCase } from "../../utils/toLowerCase";
import type { PapyrusScriptEventOrBaseFunctionIndexed, PapyrusScriptFunctionIndexed, PapyrusScriptFunctionParameterIndexed } from "../data-structures/indexing/function";
import { AllSourcesCombined, type AllSourcesCombinedObject, type PapyrusGameDataIndexed } from "../data-structures/indexing/game";
import type { PapyrusScriptPropertyIndexed } from "../data-structures/indexing/property";
import type { PapyrusScriptPropertyGroupIndexed } from "../data-structures/indexing/propertyGroup";
import type { PapyrusPossibleScripts, PapyrusScriptIndexed, PapyrusScriptIndexedAggregate } from "../data-structures/indexing/script";
import type { PapyrusScriptStructIndexed, PapyrusScriptStructMemberIndexed } from "../data-structures/indexing/struct";
import { UnknownPapyrusScript, UnknownPapyrusScriptStruct, type PapyrusScriptTypeIndexed, type PapyrusScriptTypeScriptInstanceIndexed, type PapyrusScriptTypeStructIndexed, type PapyrusScriptValueIndexed } from "../data-structures/indexing/type";
import type { PapyrusGame, PapyrusGameData } from "../data-structures/pure/game";
import type { PapyrusScript } from "../data-structures/pure/script";
import type { PapyrusScriptStruct } from "../data-structures/pure/struct";
import { PapyrusScriptTypeArchetype, type PapyrusScriptType, type PapyrusScriptTypeStruct, type PapyrusScriptValue } from "../data-structures/pure/type";

// TODO: Break this file up

type AnyScript<TGame extends PapyrusGame> = (PapyrusScript<TGame> | PapyrusScriptIndexed<TGame>) & Pick<PapyrusScriptIndexed<TGame>, 'extendedBy'>;
type AnyScriptPossibleScripts<TGame extends PapyrusGame> = Record<Lowercase<string>, AnyScript<TGame>>;

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

    for (const [scriptNameLowercase, possibleScripts] of Object.entries(scriptsByNameThenSource)) {
        for (const [sourceIdentifier, script] of Object.entries(possibleScripts)) {
            const indexed = indexScript(sourceIdentifier, script, scriptsByNameThenSource);
            (resultScripts[scriptNameLowercase] ??= {})[sourceIdentifier] = indexed;
        }
    }

    const resultScriptsWithCombined = Object.fromEntries(Object.entries(resultScripts).map(([scriptNameLowercase, possibleScripts]) => [
        scriptNameLowercase,
        Object.assign(possibleScripts, {
            [AllSourcesCombined]: mergeScriptAggregate(possibleScripts, resultScripts),
        } satisfies AllSourcesCombinedObject<TGame>),
    ] as const));

    const indexedGame: PapyrusGameDataIndexed<TGame> = {
        game,
        scripts: resultScriptsWithCombined,
        scriptSources: scriptSources as any, // we'll index the scripts in-place, so the object will remain the same
        topLevelScripts: Object.fromEntries(
            Object.entries(resultScriptsWithCombined)
                .map(([scriptNameLowercase,scripts]) => [scriptNameLowercase, Object.fromEntries(Object.entries(scripts).filter(([,script]) => script.extends === null))] as const)
                .filter(([,scripts]) => Object.keys(scripts).length > 0)
        )
    };

    return indexedGame;
}

export const DoNotIncludeInAggregate = Symbol('DoNotIncludeInAggregate');

/** Aggregates a value based on the provided predicate function. */
function aggregateValue<T, TAggregated, TIdentifierType>(
    values: T[],
    getAggregation: (value: T) => typeof DoNotIncludeInAggregate | [identifier: TIdentifierType, aggregationKey: string|number|boolean|undefined|null, value: TAggregated],
    chooseAggregateRepresentative: null | ((a: TAggregated, b: TAggregated) => TAggregated),
): [identifiers: TIdentifierType[], aggregated: TAggregated][] {
    const aggregationMap = new Map<unknown, [identifiers: TIdentifierType[], aggregated: TAggregated[]]>();
    for (const value of values) {
        const aggregationData = getAggregation(value);
        if (aggregationData === DoNotIncludeInAggregate) continue;
        const [identifier, aggregationKey, aggregatedValue] = aggregationData;
        const existing = aggregationMap.get(aggregationKey);
        if (existing) {
            existing[0].push(identifier);
            existing[1].push(aggregatedValue);
            continue;
        }
        aggregationMap.set(aggregationKey, [[identifier], [aggregatedValue]]);
    }
    return Array.from(aggregationMap.values()).map(([identifiers, value]) => [identifiers, chooseAggregateRepresentative === null ? value[0]! : value.reduce(chooseAggregateRepresentative)]);
}

/** Rather than aggregating the Record<> itself, aggregate each key/value pair in the provided Record<>s. */
function aggregateRecordValue<TRecordKey extends string|number|symbol, TRecordValue, TRecordPairing, TAggregated, TIdentifierType>(
    /** The records to map out */
    records: Record<TRecordKey, TRecordValue>[],
    recordPairings: TRecordPairing[],
    getAggregation: (value: [TRecordPairing, TRecordValue | undefined]) => typeof DoNotIncludeInAggregate | [identifier: TIdentifierType, aggregationKey: string|number|undefined|null, value: TAggregated],
    chooseAggregateRepresentative: null | ((a: TAggregated, b: TAggregated) => TAggregated),
): Record<TRecordKey, [identifiers: TIdentifierType[], aggregated: TAggregated][]> {
    const keys = new Set(records.flatMap(Object.keys) as TRecordKey[]);
    const newRecord = {} as Record<TRecordKey, [TIdentifierType[], TAggregated][]>;
    for (const key of keys) {
        if (typeof key !== 'string') throw new Error('Non-string keys not supported by aggregateRecordValue()!');
        const keyValues = records.map((record, index) => [recordPairings[index], record[key]] as [TRecordPairing, TRecordValue | undefined]);
        newRecord[key] = aggregateValue(keyValues, getAggregation, chooseAggregateRepresentative);
    }

    return newRecord;
}


function serializePapyrusType<TGame extends PapyrusGame>(type: PapyrusScriptTypeIndexed<boolean, boolean, TGame>): string {
    const arrayEnding = type.isArray ? '[]' : '';
    switch (type.type) {
        case PapyrusScriptTypeArchetype.ScriptInstance: return `SCRIPT://${type.scriptName}${arrayEnding}`;
        case PapyrusScriptTypeArchetype.Struct: return `STRUCT://${type.scriptName}/${type.structName}${arrayEnding}`;
        default: return `${type.type}${arrayEnding}`;
    }
}

/** Merges a Papyrus script aggregate (aggregate is by source) so create a single, unified definition that can be used for a quick reference. If scripts are clearly not compatible, will throw. */
function mergeScriptAggregate<TGame extends PapyrusGame>(possibleScripts: PapyrusPossibleScripts<TGame>, _allScripts: Record<Lowercase<string>, PapyrusPossibleScripts<TGame>>): PapyrusScriptIndexedAggregate<TGame> {
    const scriptEntries = Object.entries(possibleScripts);
    if (scriptEntries.length === 0) throw new Error('No scripts to merge!');

    return {
        isConditional: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.isConditional, script.isConditional], null),
        isConst: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.isConst, script.isConst], null),
        default: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.default, script.default], null),
        extends: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.extendsName, script.extends], null),
        extendsName: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.extendsName, script.extendsName], null),
        isHidden: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.isHidden, script.isHidden], null),
        imports: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.importNames.join(','), script.imports], null),
        importNames: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.importNames.join(','), script.importNames], null),
        nameWithoutNamespace: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.nameWithoutNamespace, script.nameWithoutNamespace], null),
        namespaceName: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.namespaceName, script.namespaceName], null),
        namespace: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.namespace, script.namespace], null),
        isNative: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.isNative, script.isNative], null),
        isBetaOnly: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.isBetaOnly, script.isBetaOnly], null),
        isDebugOnly: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.isDebugOnly, script.isDebugOnly], null),
        documentationComment: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.documentationComment, script.documentationComment], null),
        documentationString: aggregateValue(scriptEntries, ([sourceIdentifier, script]) => [sourceIdentifier, script.documentationString, script.documentationString], null),
        functions: aggregateRecordValue(scriptEntries.map(([,script])=>script.functions), scriptEntries, ([[sourceIdentifier, _script], func]) => {
            if (func === undefined) return DoNotIncludeInAggregate;
            const serialized = `${func.name}(${func.parameters.map(param => `${param.name}: ${serializePapyrusType(param.value)}`).join(', ')}): ${func.returnType.type}`;
            return [sourceIdentifier, serialized, func] as const;
        }, (a, b) => {
            if (a === null) return b;
            if (b === null) return a;

            if (a.documentationString === null){
                if (b.documentationString !== null) return b;
            } else if (b.documentationString === null) {
                return a;
            }

            if (a.documentationComment === null){
                if (b.documentationComment !== null) return b;
            } else if (b.documentationComment === null) {
                return a;
            }

            const defaultParamsDiff = a.parameters.filter(param => !param.isRequired).length - b.parameters.filter(param => !param.isRequired).length;

            return defaultParamsDiff > 0 ? a : b;
        }),
        structs: aggregateRecordValue(scriptEntries.map(([,script])=>script.structs as Record<Lowercase<string>, PapyrusScriptStructIndexed<Exclude<PapyrusGame, PapyrusGame.SkyrimSE>>>).filter((v):v is Exclude<typeof v, null>=>Boolean(v)), scriptEntries, ([[sourceIdentifier, _script], struct]) => {
            if (struct === undefined) return DoNotIncludeInAggregate;
            const serialized = Object.entries(struct.members).map(([memberName, member]) => `${memberName}: ${serializePapyrusType(member.value)}`).join(', ');
            return [sourceIdentifier, serialized, struct as (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? PapyrusScriptStructIndexed<TGame> : never)] as const;
        }, (a, b) => {
            if (a === null) return b;
            if (b === null) return a;

            if (a.documentationString === null){
                if (b.documentationString !== null) return b;
            } else if (b.documentationString === null) {
                return a;
            }

            if (a.documentationComment === null){
                if (b.documentationComment !== null) return b;
            } else if (b.documentationComment === null) {
                return a;
            }

            return a;
        }),
        events: aggregateRecordValue(scriptEntries.map(([,script])=>script.events), scriptEntries, ([[sourceIdentifier, _script], event]) => {
            if (event === undefined) return DoNotIncludeInAggregate;
            const serialized = `${event.name}(${event.parameters.map(param => `${param.name}: ${serializePapyrusType(param.value)}`).join(', ')})`;
            return [sourceIdentifier, serialized, event] as const;
        }, (a, b) => {
            if (a === null) return b;
            if (b === null) return a;

            if (a.documentationString === null){
                if (b.documentationString !== null) return b;
            } else if (b.documentationString === null) {
                return a;
            }

            if (a.documentationComment === null){
                if (b.documentationComment !== null) return b;
            } else if (b.documentationComment === null) {
                return a;
            }

            return a;
        }),

        // TODO: Aggregate the values of property groups themselves rather than the entire object
        propertyGroups: aggregateRecordValue(scriptEntries.map(([,script])=>script.propertyGroups), scriptEntries, ([[sourceIdentifier, _script], propertyGroup]) => {
            if (propertyGroup === undefined) return DoNotIncludeInAggregate;
            const serialized = Object.entries(propertyGroup.properties).map(([propertyName, property]) => `${propertyName}: ${serializePapyrusType(property.value)}`).join(', ');
            return [sourceIdentifier, serialized, propertyGroup] as const;
        }, (a, b) => {
            if (a === null) return b;
            if (b === null) return a;

            if (a.documentationString === null){
                if (b.documentationString !== null) return b;
            } else if (b.documentationString === null) {
                return a;
            }

            if (a.documentationComment === null){
                if (b.documentationComment !== null) return b;
            } else if (b.documentationComment === null) {
                return a;
            }

            const documentationCommentDiff = Object.values(a.properties).filter(prop => prop.documentationComment !== null).length - Object.values(b.properties).filter(prop => prop.documentationComment !== null).length;
            if (documentationCommentDiff !== 0) return documentationCommentDiff > 0 ? a : b;
            const documentationStringDiff = Object.values(a.properties).filter(prop => prop.documentationString !== null).length - Object.values(b.properties).filter(prop => prop.documentationString !== null).length;
            if (documentationStringDiff !== 0) return documentationStringDiff > 0 ? a : b;

            const defaultValueDiff = Object.values(a.properties).filter(prop => prop.value.value !== null).length - Object.values(b.properties).filter(prop => prop.value.value !== null).length;

            return defaultValueDiff > 0 ? a : b;
        }),

        // combine all extendedBy and merge their sources together
        extendedBy: Object.fromEntries(scriptEntries.flatMap(([,script])=>Object.entries(script.extendedBy)).reduce((map: Map<string, PapyrusPossibleScripts<TGame>>, [scriptNameLowercase, extendedByItem]) => {
            const existing = map.get(scriptNameLowercase);
            if (existing) {
                Object.keys(extendedByItem).forEach(source => {existing[source] ??= extendedByItem[source]!});
                return map;
            } else {
                map.set(scriptNameLowercase, {...extendedByItem});
                return map;
            }
        }, new Map<Lowercase<string>, PapyrusPossibleScripts<TGame>>()).entries()),
    };
}

const ON_EMPTIED = Symbol('PapyrusIndexing__ON_EMPTIED');

type Emptyable = Record<Lowercase<string>, unknown> & {[ON_EMPTIED]: ()=>void};

/**
 * Modifies the parsed Papyrus script in-place to exchange all references to script/struct _names_ into references to their actual objects.
 */
function indexScript<TGame extends PapyrusGame>(source: Lowercase<string>, script: AnyScript<TGame>, scriptsByNameThenSource: Record<Lowercase<string>, AnyScriptPossibleScripts<TGame>>): PapyrusScriptIndexed<TGame> {
    if ('extendsName' in script) return script;

    const blacklistedSources = new Set<Lowercase<string>>();
    const objectsThatMayNeedFutureBlacklistedSourcesRemoved = new Set<Emptyable>();

    const indexedStructs = script.structs === null ? null as (TGame extends PapyrusGame.SkyrimSE ? null : never) : Object.fromEntries(Object.entries(
        script.structs as Record<Lowercase<string>, PapyrusScriptStruct<Exclude<TGame, PapyrusGame.SkyrimSE>>> | Record<Lowercase<string>, PapyrusScriptStructIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>>
    ).map(([structName, struct]) => [
        structName,
        Object.assign(struct, {
            script: script as any as PapyrusScriptIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>,
            members: Object.fromEntries(Object.entries(struct.members).map(([memberName, member]) => [
                memberName,
                Object.assign(member, {
                    value: indexTypeValue(member.value, script, blacklistedSources, objectsThatMayNeedFutureBlacklistedSourcesRemoved, scriptsByNameThenSource),
                    script: script as any as PapyrusScriptIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>,
                    struct: struct as any as PapyrusScriptStructIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>,
                } satisfies Partial<PapyrusScriptStructMemberIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>>),
            ] as const)),
        } satisfies Partial<PapyrusScriptStructIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>>),
    ] as const)) satisfies Record<Lowercase<string>, PapyrusScriptStructIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>>;

    const res: PapyrusScriptIndexed<TGame> = Object.assign(script, {
        functions: Object.fromEntries(Object.entries(script.functions).map(([funcNameLowercase, func]) => [funcNameLowercase, Object.assign(func, {
            returnType: indexType(func.returnType, script, blacklistedSources, objectsThatMayNeedFutureBlacklistedSourcesRemoved, scriptsByNameThenSource),
            script: script as any as PapyrusScriptIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>,
            parameters: func.parameters.map(param => Object.assign(param, {
                value: indexTypeValue(param.value, script, blacklistedSources, objectsThatMayNeedFutureBlacklistedSourcesRemoved, scriptsByNameThenSource),
            } satisfies Partial<PapyrusScriptFunctionParameterIndexed<TGame>>)),
        } satisfies Partial<PapyrusScriptFunctionIndexed<TGame>>)])),
        events: Object.fromEntries(Object.entries(script.events).map(([eventNameLowercase, event]) => [eventNameLowercase, Object.assign(event, {
            script: script as any as PapyrusScriptIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>,
            parameters: event.parameters.map(param => Object.assign(param, {
                value: indexTypeValue(param.value, script, blacklistedSources, objectsThatMayNeedFutureBlacklistedSourcesRemoved, scriptsByNameThenSource),
            } satisfies Partial<PapyrusScriptFunctionParameterIndexed<TGame>>)),
        } satisfies Partial<PapyrusScriptEventOrBaseFunctionIndexed<TGame>>)])),
        extends: getPossibleScriptsFinal(script.extends ? toLowerCase(script.extends) : script.extends as null|'', scriptsByNameThenSource, objectsThatMayNeedFutureBlacklistedSourcesRemoved, ()=>{res.extends = UnknownPapyrusScript}),
        extendsName: script.extends,
        imports: script.imports.map((importAggregate, index) => getPossibleScriptsFinal(toLowerCase(importAggregate), scriptsByNameThenSource, objectsThatMayNeedFutureBlacklistedSourcesRemoved, ()=>{res.imports[index] = UnknownPapyrusScript})),
        importNames: script.imports,
        propertyGroups: Object.fromEntries(Object.entries(script.propertyGroups).map(([groupName, group]) => [
            groupName,
            Object.assign(group, {
                script: script as any as PapyrusScriptIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>,
                properties: Object.fromEntries(Object.entries(group.properties).map(([propertyName, property]) => [
                    propertyName,
                    Object.assign(property, {
                        script: script as any as PapyrusScriptIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>,
                        group: group as any as PapyrusScriptPropertyGroupIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>,
                        value: indexTypeValue(property.value, script, blacklistedSources, objectsThatMayNeedFutureBlacklistedSourcesRemoved, scriptsByNameThenSource),
                    } satisfies Partial<PapyrusScriptPropertyIndexed<TGame>>),
                ] as const)),
            } satisfies Partial<PapyrusScriptPropertyGroupIndexed<TGame>>),
        ] as const)),
        structs: indexedStructs as (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? Record<Lowercase<string>, PapyrusScriptStructIndexed<TGame>> : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never),
    } satisfies Partial<PapyrusScriptIndexed<TGame>>);

    for (const object of objectsThatMayNeedFutureBlacklistedSourcesRemoved) {
        for (const blacklistedSource of blacklistedSources) delete object[blacklistedSource];
        if (Object.keys(object).length === 0) object[ON_EMPTIED]();
    }

    const scriptNameLowercase = toLowerCase(script.namespaceName);
    if (res.extends && res.extends !== UnknownPapyrusScript) {
        for (const extendedScript of Object.values(res.extends)) {
            extendedScript.extendedBy[scriptNameLowercase] ??= {};
            extendedScript.extendedBy[scriptNameLowercase][source] = res;
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


        const downstreamScripts = new Set<AnyScriptPossibleScripts<PapyrusGame>>();
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
            for (const importAggregate of thisScript.imports as typeof thisScript.imports & AnyScriptPossibleScripts<PapyrusGame>[]) {
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
function indexType<TGame extends PapyrusGame, TIsArray extends boolean, TIsParameter extends boolean>(type_: PapyrusScriptTypeIndexed<TIsArray, TIsParameter, TGame> | PapyrusScriptType<TIsArray, TIsParameter>, thisScript: AnyScript<TGame>, blacklistedSources: Set<Lowercase<string>>, objectsThatMayNeedFutureBlacklistedSourcesRemoved: Set<Emptyable>, scriptsByNameThenSource_: Record<Lowercase<string>, AnyScriptPossibleScripts<TGame>>): PapyrusScriptTypeIndexed<TIsArray, TIsParameter, TGame> {
    const type = type_ as PapyrusScriptTypeIndexed<TIsArray, true, TGame> | PapyrusScriptType<TIsArray, true>;
    const scriptsByNameThenSource = scriptsByNameThenSource_ as Record<Lowercase<string>, Record<Lowercase<string>, PapyrusScriptIndexed<TGame>>>;
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
            const foundScriptAggregate = scriptsByNameThenSource_[scriptNameLowercase] as Record<Lowercase<string>, PapyrusScriptIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>> | undefined;
            if (!foundScriptAggregate) {
                return Object.assign(type, {
                    script: UnknownPapyrusScript,
                    struct: UnknownPapyrusScriptStruct,
                    scriptWithStruct: UnknownPapyrusScript,
                } as const);
            }
            const structNameLowercase = toLowerCase(type.structName);
            const applicableScripts = Object.entries(foundScriptAggregate).filter((scriptEntry): scriptEntry is [typeof scriptEntry[0], typeof scriptEntry[1] & {structs: NonNullable<typeof scriptEntry[1]['structs']>}] => {
                const hasStruct = scriptEntry[1].structs?.[structNameLowercase] !== undefined;
                if (!hasStruct) blacklistedSources.add(scriptEntry[0]);
                return hasStruct;
            });
            const finalScriptsAggregate = Object.fromEntries(applicableScripts);
            const onEmptied = ()=>{
                const obj = (type as any as PapyrusScriptTypeStructIndexed<boolean, true, Exclude<TGame, PapyrusGame.SkyrimSE>>);
                obj.script = UnknownPapyrusScript;
                obj.struct = UnknownPapyrusScriptStruct;
                obj.scriptWithStruct = UnknownPapyrusScriptStruct;
            };
            if (applicableScripts.length === 0) {
                objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(Object.assign(foundScriptAggregate, {[ON_EMPTIED]: onEmptied}));
                return Object.assign(type, {
                    script: foundScriptAggregate,
                    struct: UnknownPapyrusScriptStruct,
                    scriptWithStruct: UnknownPapyrusScriptStruct,
                } as const);
            }


            const res: PapyrusScriptTypeStructIndexed<TIsArray, TIsParameter, Exclude<TGame, PapyrusGame.SkyrimSE>> = Object.assign(type, {
                script: finalScriptsAggregate,
                struct: Object.fromEntries(applicableScripts.map(([sourceIdentifier, script]) => [sourceIdentifier, (script.structs as Record<Lowercase<string>, PapyrusScriptStructIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>>)[structNameLowercase]!] as const)),
                scriptWithStruct: Object.fromEntries(applicableScripts.map(([sourceIdentifier, script]) => [sourceIdentifier, [script, (script.structs as Record<Lowercase<string>, PapyrusScriptStructIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>>)[structNameLowercase]!] as const] as const)),
            } as const);

            objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(Object.assign(res.struct, {[ON_EMPTIED]: onEmptied}));
            objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(Object.assign(res.scriptWithStruct, {[ON_EMPTIED]: onEmptied}));

            return res;
        }
        case PapyrusScriptTypeArchetype.ScriptInstanceOrStruct: {
            const thisScriptNameLowercase = toLowerCase(thisScript.namespaceName);
            const foundScriptAggregates = [scriptsByNameThenSource[thisScriptNameLowercase] as Record<Lowercase<string>, PapyrusScriptIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>>, ...getAllDownstreamScripts(thisScript, scriptsByNameThenSource_)];

            const ambiguousNameLowercase = toLowerCase(type.ambiguousName);
            const scriptsWithTargetStruct: AnyScriptPossibleScripts<Exclude<TGame, PapyrusGame.SkyrimSE>>[] = Array.from(foundScriptAggregates.map((scriptAggregate) => {
                const sourcesToBlacklistIfStructFound: Lowercase<string>[] = [];
                const filtered = Object.entries(scriptAggregate).filter(([sourceIdentifier, script]) => {
                    const hasStruct = script.structs?.[ambiguousNameLowercase] !== undefined;
                    if (!hasStruct) sourcesToBlacklistIfStructFound.push(sourceIdentifier);
                    return hasStruct;
                });
                if (filtered.length === 0) return null;
                sourcesToBlacklistIfStructFound.forEach(blacklistedSources.add, blacklistedSources);
                return Object.fromEntries(filtered);
            })).filter((x): x is Exclude<typeof x, null> => x !== null);

            if (scriptsWithTargetStruct.length !== 0) {
                if (scriptsWithTargetStruct.length > 1) console.warn('Multiple scripts with struct found for ScriptInstanceOrStruct type', thisScript, type, scriptsWithTargetStruct.map(Object.keys));
                const firstScriptAggregate = scriptsWithTargetStruct[0]! as PapyrusPossibleScripts<Exclude<TGame, PapyrusGame.SkyrimSE>>;
                const res = Object.assign(type, {
                    type: PapyrusScriptTypeArchetype.Struct,
                    script: firstScriptAggregate,
                    scriptName: Object.values(firstScriptAggregate)[0]!.namespaceName,
                    struct: Object.fromEntries(Object.entries(firstScriptAggregate).map(([sourceIdentifier, script]) => [sourceIdentifier, script.structs![ambiguousNameLowercase] as PapyrusScriptStructIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>] as const)),
                    structName: type.ambiguousName,
                    scriptWithStruct: Object.fromEntries(Object.entries(firstScriptAggregate).map(([sourceIdentifier, script]) => [sourceIdentifier, [script, script.structs![ambiguousNameLowercase] as PapyrusScriptStructIndexed<Exclude<TGame, PapyrusGame.SkyrimSE>>] as const] as const))
                } as const) satisfies PapyrusScriptTypeStructIndexed<TIsArray, TIsParameter, Exclude<TGame, PapyrusGame.SkyrimSE>>;
                const onEmptied = ()=>{
                    const obj = (type as any as PapyrusScriptTypeStructIndexed<boolean, true, Exclude<TGame, PapyrusGame.SkyrimSE>>);
                    obj.script = UnknownPapyrusScript;
                    obj.struct = UnknownPapyrusScriptStruct;
                    obj.scriptWithStruct = UnknownPapyrusScriptStruct;
                };
                objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(Object.assign(res.script, {[ON_EMPTIED]: onEmptied}));
                objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(Object.assign(res.struct, {[ON_EMPTIED]: onEmptied}));
                objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(Object.assign(res.scriptWithStruct, {[ON_EMPTIED]: onEmptied}));
                return res;
            } else {
                const foundScript = scriptsByNameThenSource[ambiguousNameLowercase];
                if (!foundScript) {
                    return Object.assign(type, {
                        type: PapyrusScriptTypeArchetype.ScriptInstance,
                        scriptName: type.ambiguousName,
                        script: UnknownPapyrusScript,
                    } as const);
                }

                const res = Object.assign(type, {
                    type: PapyrusScriptTypeArchetype.ScriptInstance,
                    scriptName: type.ambiguousName,
                    script: foundScript,
                }) satisfies PapyrusScriptTypeScriptInstanceIndexed<TIsArray, TIsParameter, TGame>;
                objectsThatMayNeedFutureBlacklistedSourcesRemoved.add(Object.assign(res.script, {[ON_EMPTIED]: ()=>{(res.script as any) = UnknownPapyrusScript}}));
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
function indexTypeValue<TGame extends PapyrusGame, TIsArray extends boolean, TIsParameter extends boolean>(value: PapyrusScriptValue<TIsArray, TIsParameter>, thisScript: AnyScript<TGame>, blacklistedSources: Set<Lowercase<string>>, objectsThatMayNeedFutureBlacklistedSourcesRemoved: Set<Emptyable>, scriptsByNameThenSource: Record<Lowercase<string>, any>): PapyrusScriptValueIndexed<TIsArray, TIsParameter, TGame> {
    return indexType(value, thisScript, blacklistedSources, objectsThatMayNeedFutureBlacklistedSourcesRemoved, scriptsByNameThenSource) as PapyrusScriptValueIndexed<TIsArray, TIsParameter, TGame>;
}
