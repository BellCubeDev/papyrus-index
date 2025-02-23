/* eslint-disable prefer-template */
/* eslint-disable max-depth */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import { toLowerCase } from '../../utils/toLowerCase';
import { UnreachableError } from '../../UnreachableError';
import type { PapyrusScriptFunctionParameter } from '../data-structures/pure/function';
import { PapyrusGame } from '../data-structures/pure/game';
import { PapyrusCollapsedSpecifier } from '../data-structures/pure/propertyGroup';
import type { PapyrusScript, PapyrusScriptUnderConstruction } from '../data-structures/pure/script';
import type { PapyrusScriptStruct, PapyrusScriptStructMember } from '../data-structures/pure/struct';
import { PapyrusScriptTypeArchetype, type PapyrusScriptType, type PapyrusScriptValue } from '../data-structures/pure/type';
import { PapyrusParserError } from './PapyrusParserError';
import type { PapyrusScriptDiscoveredDocument } from './parse-all-for-game';

/** Note that all keywords are case-insensitive. This enum will be modified at runtime to respect this. */
enum PapyrusKeyword {
    DocumentationStringBegin = '{',
    DocumentationStringEnd = '}',

    FunctionStart = 'function',
    FunctionGlobal = 'global',
    FunctionEnd = 'endfunction',

    EventBegin = 'event',
    EventEnd = 'endevent',

    PropertyBegin = 'property',
    PropertyAutoReadonly = 'autoreadonly',
    PropertyEnd = 'endproperty',

    ScriptnameExtends = 'extends',
    ScriptnameDefault = 'default',
    Scriptname = 'scriptname',

    StructBegin = 'struct',
    StructEnd = 'endstruct',

    Import = 'import',

    /** Can apply to either the Scriptname header or a Property */
    Conditional = 'conditional',
    /** Can apply to either the Scriptname header or a Property */
    Const = 'const',
    /** Can apply to either the Scriptname header, a Property, or a Struct member */
    Hidden = 'hidden',
    /** Can apply to either a Property or a Struct member */
    Mandatory = 'mandatory',
    /** Can apply to either the Scriptname header or a Function */
    Native = 'native',
    /** Can apply to either the Scriptname header or a Function */
    DebugOnly = 'debugonly',
    /** Can apply to either the Scriptname header or a Function */
    BetaOnly = 'betaonly',
    /** Can appear either as a flag on a Property or as an indicator to Papyrus that it should enter this State first */
    Auto = 'auto',

    State = 'state',
    EndState = 'endstate',

    As = 'as',
    New = 'new',
    Else = 'else',
    ElseIf = 'elseif',
    If = 'if',
    Return = 'return',

    Group = 'group',
    EndGroup = 'endgroup',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- this is here for type-checking purposes
declare function ENSURE_KEYWORDS_ARE_LOWERCASE<T extends Lowercase<PapyrusKeyword> = PapyrusKeyword>(value: never): never;

const PapyrusKeywords = new Set(Object.values(PapyrusKeyword)) as any as Omit<ReadonlySet<PapyrusKeyword>, 'has'> & {
    has(value: string): value is PapyrusKeyword;
};

const PapyrusKeywordsToSearchFor_ = new Set([
    PapyrusKeyword.DocumentationStringBegin,
    PapyrusKeyword.FunctionStart,
    PapyrusKeyword.EventBegin,
    PapyrusKeyword.Scriptname,
    PapyrusKeyword.StructBegin,
    PapyrusKeyword.Import,
    PapyrusKeyword.Group,
    PapyrusKeyword.State,
    PapyrusKeyword.Auto,
] as const);

type PapyrusKeywordToSearchFor = typeof PapyrusKeywordsToSearchFor_ extends ReadonlySet<infer T> ? T : never;

const PapyrusKeywordsToSearchFor = PapyrusKeywordsToSearchFor_ as any as Omit<ReadonlySet<PapyrusKeywordToSearchFor>, 'has'> & {
    has(value: string): value is PapyrusKeywordToSearchFor;
};

const WhitespaceTokens = new Set([
    ' ',
    '\n',
    '\t',
] as const) as ReadonlySet<string>;

const TokenTerminators = new Set([
    ...WhitespaceTokens,
    '{',
    '(',
    ')',
    ';',
    '"',
    "'",
    "-",
    ",",
    "+",
    "/",
    "*",
    "=",
] as const) as ReadonlySet<string>;

const MAX_ITERATIONS = Number.MAX_SAFE_INTEGER;

const EOF = Symbol('End of file reached');

export class PapyrusScriptParser<TGame extends PapyrusGame> {

    // The Papyrus Source Code format is a custom language used in the Creation Engine.
    // Its syntax invokes ideas of a more verbose Python.
    //
    // It is, almost by design, incredibly easy to parse.
    // * Each individual line is guaranteed to serve a single purpose (though that purpose is not guaranteed to span only one line).
    // * Outside of functions and events, every token is separated by whitespace or a multi-line comment.
    //
    // We can abuse this very, very, very easily.
    //
    // Note that this parser is NOT designed to be a full parser for the Papyrus language.
    // Neither is it designed to implement many of the fairly-arbitrary restrictions of the Papyrus language.
    // This parser's goal is to extract relevant information from a known-good Papyrus script file.
    //
    // Depending on the error, this script may not fail to extract information from the script.
    // However, it makes no guarantees about what errors it will and will not fail on.
    // It assumes all scripts are valid Papyrus scripts, exactly as Bethesda's compiler would accept them.


    // eslint-disable-next-line no-empty-function
    private constructor(public readonly game: TGame) {}

    /** The original text of the source code. Used to get the names of identifiers. */
    private sourceCodeCased!: string;
    /** The lowercase text of the source code. Used to identify case-insensitive keywords. */
    private sourceCodeLowercase!: Lowercase<string>;
    private index_!: number;
    private originalIndex_!: number;
    private get originalIndex(): number {
        return this.originalIndex_ ?? this.index;
    }
    private get index(): number {
        return this.index_;
    }
    private set index(value: number) {
        //if (value < 0) throw new PapyrusParserError('Parser managed to find itself at a negative index! This indicates an error with the parser.', value, this.document);
        //if (value > this.sourceCode.length) throw new PapyrusSyntaxError('Parser managed to find itself at an index beyond the end of the source code! This indicates an error with the parser.', value, this.document);
        if (!this.isReplacingLogicWithGuard && value < this.index_) throw new PapyrusParserError('Parser managed to find itself at a lower index than it was before! This indicates an error with the parser.', value, this.document);
        else this.originalIndex_ = this.index_;
        this.index_ = value;
    }
    private document!:PapyrusScriptDiscoveredDocument & {isModified: boolean};

    /** Keep track of the current comment so we can use it as documentation for the next documentable thing.
     *
     * This will be cleared under the following conditions:
     * * The most recent comment is a multi-line comment
     * * The newest comment is a single-line comment, but the previous comment was a multi-line comment
     * * There are at least two newline characters without any comments in between
     * * A new token is requested
     *
     * ⚠️ ⚠️ ⚠️ USE `PapyrusScriptParser.normalizeDocumentationWhitespace` TO NORMALIZE THE WHITESPACE OF THIS STRING ⚠️ ⚠️ ⚠️
     */
    private currentCommentRaw: string | null = null;

    /** Whether to replace implementation logic with Guard() calls */
    private isReplacingLogicWithGuard = false;

    generateEmptyPapyrusScript(): PapyrusScriptUnderConstruction<TGame> {
        return {
            namespaceName: undefined,
            nameWithoutNamespace: undefined,
            namespace: undefined,
            isBetaOnly: false,
            isDebugOnly: false,
            documentationComment: null,
            documentationString: null,
            events: {},
            functions: {},
            propertyGroups: {
                '': {
                    collapsed: PapyrusCollapsedSpecifier.Never,
                    documentationComment: null,
                    documentationString: null,
                    name: '',
                    properties: {},
                }
            },
            imports: [],
            isConditional: false,
            isConst: false,
            extends: null,
            isHidden: false,
            structs: this.game === PapyrusGame.SkyrimSE ? null : {},
            default: this.game === PapyrusGame.SkyrimSE ? null : false,
            isNative: this.game === PapyrusGame.SkyrimSE ? null : false,
        };
    }

    private result!: PapyrusScriptUnderConstruction<TGame>;

    private tokenIterations = 0;

    /**
     * Skips over whitespace and handles intermediary comments to get the next token.
     *
     * @param caseSensitive if true, will return the next token with its original casing. If false, will return a lowercase version. This has zero performance impact. Note that many functions require both cased and lowercase versions of the token, in which case you should use caseSensitive=true and then convert the token to lowercase yourself.
     * @returns The next token in the source code, respecting the `caseSensitive` parameter. If there are no more tokens, returns an empty string.
     */
    private getNextToken<TIsCaseSensitive extends boolean>(caseSensitive: boolean): readonly [index: number, token: (TIsCaseSensitive extends true ? string : never) | (TIsCaseSensitive extends false ? Lowercase<string> : never) | typeof EOF] {
        this.currentCommentRaw = null;
        if (this.index >= this.sourceCodeCased.length) return [this.sourceCodeCased.length, EOF];

        this.tokenIterations++;
        if (this.tokenIterations > MAX_ITERATIONS) throw new PapyrusParserError('Infinite loop detected', this.originalIndex, this.document);

        let lastCommentWasMultiLine = false;
        let clearCommentOnNextEncounteredNewline = false;
        for (; this.index < this.sourceCodeLowercase.length; this.index++) {
            if (this.sourceCodeLowercase[this.index] === ';') {
                this.index++;
                if (this.sourceCodeLowercase[this.index] === '/') {
                    this.index++;
                    lastCommentWasMultiLine = true;
                    this.parseMultiLineComment();
                    clearCommentOnNextEncounteredNewline = false;
                } else {
                    if (lastCommentWasMultiLine) {
                        lastCommentWasMultiLine = false;
                        this.currentCommentRaw = null;
                    }
                    this.parseSingleLineComment();
                    // Since we just handled a newline...
                    clearCommentOnNextEncounteredNewline = true;
                }
                continue;
            }

            if (WhitespaceTokens.has(this.sourceCodeLowercase[this.index]!)) {
                if (this.sourceCodeLowercase[this.index] === '\n') {
                    if (clearCommentOnNextEncounteredNewline && this.currentCommentRaw !== null)
                        this.currentCommentRaw = null;
                    clearCommentOnNextEncounteredNewline = true;
                }
                continue;
            }

            break;
        }

        let tokenIndex = this.index;

        for (; this.index < this.sourceCodeLowercase.length; this.index++) {
            if (TokenTerminators.has(this.sourceCodeLowercase[this.index]!)) {
                if (this.sourceCodeLowercase[this.index] === '[') this.index++; // include open array syntax in the token
                break;
            }
        }

        const sourceToGrabFrom = caseSensitive ? this.sourceCodeCased : this.sourceCodeLowercase;

        let str = sourceToGrabFrom.slice(tokenIndex, this.index);
        if (str === '') {
            if (this.index < this.sourceCodeCased.length) {
                str = sourceToGrabFrom[this.index]!;
                tokenIndex = this.index;
                this.index++;
            } else {
                //console.debug('Discovered new token', {token: EOF, tokenIndex: this.index, newIndex: this.index});
                return [this.index, EOF];
            }
        }

        //console.debug('Discovered new token', {token: str, tokenIndex, newIndex: this.index});

        //console.log({tokenIndex, str});
        return [tokenIndex, str as any];
    }

    static normalizeDocumentationWhitespace<TStr extends string | null>(str: TStr): (TStr extends null ? null : never) | (TStr extends string ? string : never) {
        if (!str) return str as any as (TStr extends null ? null : never) | (TStr extends string ? string : never);
        let lines = str.split('\n').map(line => line.trimEnd());

        lines = lines.slice(lines.findIndex(line => line.length > 0));
        lines = lines.slice(0, lines.findLastIndex(line => line.length > 0) + 1);

        if (lines.length <= 1) return str.trim() as TStr extends string ? string : never;

        const lowestIndentation = lines.reduce((lowest, line) => {
            if (line.length === 0) return lowest;
            const indentation = line.length - line.trimStart().length;
            return Math.min(lowest, indentation);
        }, Infinity);
        if (lowestIndentation === Infinity) throw new Error('This is logically impossible!');

        if (lowestIndentation === 0) return lines.join('\n') as TStr extends string ? string : never;
        else return lines.map(line => line.slice(lowestIndentation)).join('\n') as TStr extends string ? string : never;
    }

    private parseSingleLineComment(): void {
        const oldIndex = this.index;
        ////console.debug('Parsing single-line comment from', {index: this.index});

        const newIndexBeforeSubtraction = this.sourceCodeCased.indexOf('\n', oldIndex);
        if (newIndexBeforeSubtraction === -1) this.index = this.sourceCodeCased.length;
        else this.index = newIndexBeforeSubtraction;

        const comment = this.sourceCodeCased.slice(oldIndex, this.index);
        if (this.currentCommentRaw === null) this.currentCommentRaw = comment;
        else this.currentCommentRaw += `\n${comment}`;
    }

    private parseMultiLineComment(): void {
        const oldIndex = this.index;

        const newIndexBeforeAddition = this.sourceCodeCased.indexOf('/;', oldIndex + 1);
        if (newIndexBeforeAddition === -1) throw new PapyrusParserError('Multi-line comment never ended!', oldIndex, this.document);
        this.currentCommentRaw = this.sourceCodeCased.slice(oldIndex, newIndexBeforeAddition);
        this.index = newIndexBeforeAddition + 1;
    }

    /**
     * If a comment starts before the next token and before the next line break, this function will return the next token. Will return immediately if the current index is a line break.
     *
     * Useful for things like structs members and properties, which only take up one line. F4SE itself uses this pattern for some structs.
     *
     * Automatically normalizes the comment's whitespace.
     */
    private getCommentBeforeNextTokenOrLineBreak(): null | string | typeof EOF {
        this.currentCommentRaw = null;
        if (this.index >= this.sourceCodeCased.length) return EOF;

        if (this.sourceCodeCased[this.index] === '\n') return null;

        this.tokenIterations++;
        if (this.tokenIterations > MAX_ITERATIONS) throw new PapyrusParserError('Infinite loop detected', this.originalIndex, this.document);

        for (; this.index < this.sourceCodeLowercase.length; this.index++) {
            if (this.sourceCodeLowercase[this.index] === ';') {
                this.index++;
                if (this.sourceCodeLowercase[this.index] === '/') {
                    this.index++;
                    this.parseMultiLineComment();
                } else {
                    this.parseSingleLineComment();
                }
                break;
            }

            if (WhitespaceTokens.has(this.sourceCodeLowercase[this.index]!)) {
                if (this.sourceCodeLowercase[this.index] === '\n') break;
                continue;
            }

            break;
        }

        const commentContents = this.currentCommentRaw;
        this.currentCommentRaw = null;
        return commentContents ? PapyrusScriptParser.normalizeDocumentationWhitespace(commentContents) : null;
    }

    private parseScriptnameHeader(_index: number): void {
        this.result.documentationComment = PapyrusScriptParser.normalizeDocumentationWhitespace(this.currentCommentRaw);
        const [tokenIndex, token] = this.getNextToken(true);
        if (token === EOF) throw new PapyrusParserError('Expected script name, but got the end of the file (EOF)!', tokenIndex, this.document);
        this.result.namespaceName = token;
        const [namespaceOrScriptName, scriptNameIfHasNamespace] = token.split(':');
        if (namespaceOrScriptName === '' || namespaceOrScriptName === undefined) throw new PapyrusParserError('Expected script name, but got a colon (":")', tokenIndex, this.document);
        if (scriptNameIfHasNamespace === undefined) {
            this.result.namespace = null;
            this.result.nameWithoutNamespace = namespaceOrScriptName;
        } else {
            if (this.game === PapyrusGame.SkyrimSE) throw new PapyrusParserError('Script namespaces are not supported by Skyrim\'s Papyrus compiler. Expected identifier, but got ":".', tokenIndex, this.document);
            this.result.namespace = namespaceOrScriptName;
            this.result.nameWithoutNamespace = scriptNameIfHasNamespace;
        }



        const [nextTokenIndex_, nextToken_] = this.getNextToken(true);
        if (nextToken_ === EOF) {
            //console.debug('Scriptname header was the only part of the file, and the script does not extend anything');
            return;
        }

        let nextTokenIndex = nextTokenIndex_;
        let nextToken = nextToken_;
        let nextTokenLowercase = toLowerCase(nextToken);
        if (nextTokenLowercase === PapyrusKeyword.ScriptnameExtends) {
            const [extendsNameIndex, extendsName] = this.getNextToken(true);
            if (extendsName === EOF) throw new PapyrusParserError('Expected the name of the script to extend, but got the end of the file (EOF)!', extendsNameIndex, this.document);
            this.result.extends = extendsName;
            const [nextTokenIndex__, nextToken__] = this.getNextToken(true);
            if (nextToken__ === EOF) {
                //console.debug('Scriptname header was the only part of the file');
                return;
            }
            nextTokenIndex = nextTokenIndex__;
            nextToken = nextToken__;
            nextTokenLowercase = toLowerCase(nextToken);
        }

        loop: while (this.index < this.sourceCodeCased.length) {
            switch (nextTokenLowercase) {
                case PapyrusKeyword.Conditional:
                    this.result.isConditional = true;
                    break;
                case PapyrusKeyword.Const:
                    this.result.isConst = true;
                    break;
                case PapyrusKeyword.Hidden:
                    this.result.isHidden = true;
                    break;
                case PapyrusKeyword.Native:
                    this.result.isNative = true;
                    break;
                case PapyrusKeyword.ScriptnameDefault:
                    this.result.default = true;
                    break;
                case PapyrusKeyword.DebugOnly:
                    if (this.game === PapyrusGame.SkyrimSE) throw new PapyrusParserError('Debug-only scripts are not supported by Skyrim\'s Papyrus compiler', nextTokenIndex, this.document);
                    this.result.isDebugOnly = true as false | (TGame extends PapyrusGame.Fallout4 | PapyrusGame.Fallout76 | PapyrusGame.Starfield ? true : never);
                    break;
                case PapyrusKeyword.BetaOnly:
                    if (this.game === PapyrusGame.SkyrimSE) throw new PapyrusParserError('Beta-only scripts are not supported by Skyrim\'s Papyrus compiler', nextTokenIndex, this.document);
                    this.result.isBetaOnly = true as false | (TGame extends PapyrusGame.Fallout4 | PapyrusGame.Fallout76 | PapyrusGame.Starfield ? true : never);
                    break;
                case '{':
                    this.result.documentationString = this.parseDocumentationString(nextTokenIndex, false);
                    break loop;
                default:
                    this.parseToken(nextTokenIndex, nextToken, nextTokenLowercase);
                    break loop;
            }
            const [nextTokenIndex__, nextToken__] = this.getNextToken(false);
            if (nextToken__ === EOF) break loop;
            nextTokenIndex = nextTokenIndex__;
            nextToken = nextToken__;
            nextTokenLowercase = toLowerCase(nextToken);
        }
    }

    /** Parses the documentation string and returns a whitespace-normalized string */
    private parseDocumentationString(_index: number, willBeUsed = true): string {
        const oldIndex = this.index;
        const newIndexBeforeAddition = this.sourceCodeCased.indexOf('}', oldIndex+1);
        if (newIndexBeforeAddition === -1) throw new PapyrusParserError('Documentation string never ended!', oldIndex, this.document);
        this.index = newIndexBeforeAddition + 1;

        return willBeUsed ? PapyrusScriptParser.normalizeDocumentationWhitespace(this.sourceCodeCased.slice(oldIndex, this.index - 1)) : '';
    }

    private parseNextToken(): void {
        const [nextTokenIndex, nextToken] = this.getNextToken(true);
        if (nextToken === EOF) return;
        this.parseToken(nextTokenIndex, nextToken, toLowerCase(nextToken));
    }

    private parseToken(tokenIndex: number, tokenCased: string, lowercaseToken: Lowercase<string>): void {
        if (tokenCased === '') throw new PapyrusParserError('Managed to get an empty string token! This indicates a bug in the parser.', tokenIndex, this.document);
        if (PapyrusKeywordsToSearchFor.has(lowercaseToken)) {
            switch (lowercaseToken) {
                case PapyrusKeyword.FunctionStart:
                    //console.debug('Found function (return type: void)');
                    this.parseFunction(tokenIndex, null);
                    break;
                case PapyrusKeyword.EventBegin:
                    //console.debug('Found event');
                    this.parseEvent(tokenIndex);
                    break;
                case PapyrusKeyword.Scriptname:
                    this.parseScriptnameHeader(tokenIndex);
                    break;
                case PapyrusKeyword.DocumentationStringBegin:
                    //console.debug('Found documentation string without a home!');
                    this.parseDocumentationString(tokenIndex); // It can't go anywhere so we just yeet it
                    break;
                case PapyrusKeyword.StructBegin:
                    //console.debug('Found struct');
                    this.parseStruct(tokenIndex);
                    break;
                case PapyrusKeyword.Import:
                    //console.debug('Found import');
                    this.parseImport(tokenIndex);
                    break;
                case PapyrusKeyword.Group:
                    //console.debug('Found group');
                    this.parsePropertyGroup(tokenIndex);
                    break;
                case PapyrusKeyword.State:
                    //console.debug('Found state');
                    this.skipStateBlock(tokenIndex);
                    break;
                case PapyrusKeyword.Auto: {
                    const [nextTokenIndex, nextTokenLowercase] = this.getNextToken(false);
                    if (nextTokenLowercase !== PapyrusKeyword.State) throw new PapyrusParserError('Expected "state" after free-standing "auto"', nextTokenIndex, this.document);
                    //console.debug('Found auto state');
                    this.skipStateBlock(nextTokenIndex);
                    break;
                } default:
                    throw new UnreachableError(lowercaseToken);
            }
        } else if (PapyrusKeywords.has(lowercaseToken)) {
            throw new PapyrusParserError(`Unexpected keyword "${tokenCased}"`, tokenIndex, this.document);
        } else {
            //console.debug('Found identifier, literal, or type');
            this.parseFromIdentifier(tokenIndex, tokenCased, lowercaseToken);
        }
        this.currentCommentRaw = null;
    }

    private skipToKeyword(startIndex: number, keyword: PapyrusKeyword): void {
        let [nextTokenIndex, nextTokenCased] = this.getNextToken(true);
        if (nextTokenCased === EOF) throw new PapyrusParserError(`Expected to see keyword "${keyword}", but got the end of the file (EOF)`, startIndex, this.document);
        let nextTokenLowercase = toLowerCase(nextTokenCased);
        while (nextTokenLowercase !== keyword) {
            this.completeLiteralToken(nextTokenIndex, nextTokenCased, false);
            const [nextTokenIndex_, nextToken_] = this.getNextToken(true);
            if (nextToken_ === EOF) throw new PapyrusParserError(`Expected to see keyword "${keyword}", but got the end of the file (EOF)`, startIndex, this.document);
            nextTokenIndex = nextTokenIndex_;
            nextTokenCased = nextToken_;
            nextTokenLowercase = toLowerCase(nextTokenCased);
        }
    }

    private skipStateBlock(index: number): void {
        const [stateNameIndex, stateNameToken] = this.getNextToken(true);
        if (stateNameToken === EOF) throw new PapyrusParserError('Expected state name, but got the end of the file (EOF)!', index, this.document);
        this.skipToKeyword(stateNameIndex, PapyrusKeyword.EndState);
    }

    private parsePropertyGroup(index: number): void {
        let documentationCommentForGroup = PapyrusScriptParser.normalizeDocumentationWhitespace(this.currentCommentRaw);
        const [groupNameIndex, groupName] = this.getNextToken(true);
        if (groupName === EOF) throw new PapyrusParserError('Expected group name, but got the end of the file (EOF)!', groupNameIndex, this.document);
        const groupNameLowercase = toLowerCase(groupName);
        if (groupNameLowercase in this.result.propertyGroups) throw new PapyrusParserError(`Property group "${groupName}" already exists in this script!`, groupNameIndex, this.document);
        if (PapyrusKeywords.has(groupNameLowercase)) throw new PapyrusParserError(`Property group name "${groupName}" is a reserved keyword!`, groupNameIndex, this.document);

        const collapsed: PapyrusCollapsedSpecifier = PapyrusCollapsedSpecifier.Never;

        let [nextTokenIndex, nextTokenCased] = this.getNextToken(true);
        if (nextTokenCased === EOF) throw new PapyrusParserError('Expected group body, but got the end of the file (EOF)!', this.originalIndex, this.document);
        let nextTokenLowercase: Lowercase<string> = toLowerCase(nextTokenCased);

        const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
        if (maybeDocumentationComment !== EOF) documentationCommentForGroup ??= maybeDocumentationComment;

        let documentationStringForGroup: string | null = null;
        if (nextTokenLowercase === '{') {
            documentationStringForGroup = this.parseDocumentationString(nextTokenIndex);
            const [nextTokenIndex_, nextToken_] = this.getNextToken(true);
            if (nextToken_ === EOF) throw new PapyrusParserError('Expected group body, but got the end of the file (EOF)!', this.originalIndex, this.document);
            nextTokenIndex = nextTokenIndex_;
            nextTokenCased = nextToken_;
            nextTokenLowercase = toLowerCase(nextTokenCased);
        }

        this.result.propertyGroups[groupNameLowercase] = {
            collapsed,
            documentationComment: documentationCommentForGroup,
            documentationString: documentationStringForGroup,
            name: groupName,
            properties: {},
        };

        while (nextTokenLowercase !== PapyrusKeyword.EndGroup) {
            const type = [nextTokenIndex, nextTokenCased] as const;
            const [propertyKeywordIndex, propertyKeyword] = this.getNextToken(false);
            //console.log('Expecting property keyword...', {nextTokenIndex, nextTokenCased, propertyKeywordIndex, propertyKeyword});
            if (propertyKeyword === EOF) throw new PapyrusParserError('Expected property keyword, but got the end of the file (EOF)!', propertyKeywordIndex, this.document);
            if (propertyKeyword !== PapyrusKeyword.PropertyBegin) throw new PapyrusParserError('Expected property keyword, but got something else!', propertyKeywordIndex, this.document);
            const maybeNextTokenTuple = this.parseProperty(propertyKeywordIndex, type, groupNameLowercase);
            if (maybeNextTokenTuple === undefined) {
                [nextTokenIndex, nextTokenCased] = this.getNextToken(true);
                if (nextTokenCased === EOF) throw new PapyrusParserError('Group never ended!', index, this.document);
                nextTokenLowercase = toLowerCase(nextTokenCased);
            } else {
                [nextTokenIndex, nextTokenCased, nextTokenLowercase] = maybeNextTokenTuple;
            }
        }
    }


    private parseStruct(structBegin: number): void {
        const documentationCommentForStruct = PapyrusScriptParser.normalizeDocumentationWhitespace(this.currentCommentRaw);
        const [structNameIndex, structName] = this.getNextToken(true);
        if (structName === EOF) throw new PapyrusParserError('Expected struct name, but got the end of the file (EOF)!', structNameIndex, this.document);
        if (!this.result.structs) throw new PapyrusParserError('Structs are not supported by this game!', structNameIndex, this.document);
        const structNameLowercase = toLowerCase(structName);
        if (structNameLowercase in this.result.structs) throw new PapyrusParserError(`Struct "${structName}" already exists in this script!`, structNameIndex, this.document);
        if (PapyrusKeywords.has(structNameLowercase)) throw new PapyrusParserError(`Struct name "${structName}" is a reserved keyword!`, structNameIndex, this.document);

        const members: PapyrusScriptStructMember<Exclude<TGame, PapyrusGame.SkyrimSE>>[] = [];
        let [nextTokenIndex, nextTokenCased] = this.getNextToken(true);
        if (nextTokenCased === EOF) throw new PapyrusParserError('Expected struct body, but got the end of the file (EOF)!', this.originalIndex, this.document);
        let nextTokenLowercase = toLowerCase(nextTokenCased);
        let foundEnd = false;

        let documentationStringForStruct: string | null = null;
        if (nextTokenLowercase === '{') {
            documentationStringForStruct = this.parseDocumentationString(nextTokenIndex);
            const [nextTokenIndex_, nextToken_] = this.getNextToken(true);
            if (nextToken_ === EOF) throw new PapyrusParserError('Expected struct body, but got the end of the file (EOF)!', this.originalIndex, this.document);
            nextTokenIndex = nextTokenIndex_;
            nextTokenCased = nextToken_;
            nextTokenLowercase = toLowerCase(nextTokenCased);
        }

        if (nextTokenLowercase !== PapyrusKeyword.StructEnd) {
            structLoop: while (this.index < this.sourceCodeCased.length) {
                let documentationCommentForMember = PapyrusScriptParser.normalizeDocumentationWhitespace(this.currentCommentRaw);
                const typeIndex = nextTokenIndex;
                const type = nextTokenCased;

                const [memberNameIndex, memberName] = this.getNextToken(true);
                if (memberName === EOF) throw new PapyrusParserError('Expected struct member name, but got the end of the file (EOF)!', memberNameIndex, this.document);

                const maybeDocumentationCommentBeforeLoop = this.getCommentBeforeNextTokenOrLineBreak();
                if (maybeDocumentationCommentBeforeLoop !== EOF) documentationCommentForMember ??= maybeDocumentationCommentBeforeLoop;

                let hidden = false;
                let mandatory = false;

                let defaultValue: readonly [number, string|null] | null = null;

                let documentationStringForMember: string | null = null;
                memberLoop: while (this.index < this.sourceCodeCased.length) {
                    const [tokenIndex, tokenCased] = this.getNextToken(true);
                    if (tokenCased === EOF) throw new PapyrusParserError('Expected to see the end of the struct member, but got the end of the file (EOF)!', tokenIndex, this.document);
                    const tokenLowercase = toLowerCase(tokenCased);
                    switch(tokenLowercase) {
                        case '=': {
                            const [defaultValueIndex, defaultValueRaw] = this.getNextToken(true);
                            if (defaultValueRaw === EOF) throw new PapyrusParserError('Expected default value for struct member after an "=", but got the end of the file (EOF)!', defaultValueIndex, this.document);
                            defaultValue = [defaultValueIndex, this.completeLiteralToken(tokenIndex, defaultValueRaw, true)];
                            const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                            if (maybeDocumentationComment !== EOF) documentationCommentForMember ??= maybeDocumentationComment;
                            break;
                        }
                        case PapyrusKeyword.Hidden: {
                            hidden = true;
                            const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                            if (maybeDocumentationComment !== EOF) documentationCommentForMember ??= maybeDocumentationComment;
                            break;
                        } case PapyrusKeyword.Mandatory:{
                            mandatory = true;
                            const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                            if (maybeDocumentationComment !== EOF) documentationCommentForMember ??= maybeDocumentationComment;
                            break;
                        } case PapyrusKeyword.StructEnd:
                            foundEnd = true; // functions as break structLoop, but allows us to finish this member first
                            break memberLoop;
                        case '{':
                            documentationStringForMember = this.parseDocumentationString(tokenIndex);
                            break memberLoop;
                        default:
                            //console.debug('Found next token after a struct member declaration; saving to parse later');
                            nextTokenIndex = tokenIndex;
                            nextTokenCased = tokenCased;
                            nextTokenLowercase = tokenLowercase; // eslint-disable-line no-useless-assignment
                            break memberLoop;
                    }
                }

                const value = this.formatPapyrusValue([typeIndex, type], defaultValue ?? [memberNameIndex, null], false);  // TODO: Test if a struct can actually use CustomEventName and such types
                if (value.isArray) throw new PapyrusParserError('Struct members may not be arrays!', memberNameIndex, this.document);

                members.push({
                    name: memberName,
                    mandatory,
                    hidden,
                    documentationComment: documentationCommentForMember,
                    documentationString: documentationStringForMember,
                    value: value as PapyrusScriptValue<false, false>,
                });

                if (foundEnd) break structLoop;
            }
        }

        if (!foundEnd) throw new PapyrusParserError('Expected end of struct, but got the end of the file (EOF)!', structBegin, this.document);

        this.result.structs[structNameLowercase] = {
            documentationComment: documentationCommentForStruct,
            documentationString: documentationStringForStruct,
            name: structName,
            members: Object.fromEntries(members.map(member => [toLowerCase(member.name), member])),
        };
    }

    private parseFromIdentifier(index: number, identifierLiteralOrTypeCased: string, _identifierLiteralOrTypeLowercase: string) {
        const currentComment = this.currentCommentRaw;
        const [nextTokenIndex, nextToken] = this.getNextToken(false);
        switch (nextToken) {
            case '=':
                throw new PapyrusParserError('Expected a keyword or identifier, but got an equals sign ("="). Assignment is not supported outside of a function.', nextTokenIndex, this.document);
            case PapyrusKeyword.FunctionStart:
                //console.debug('Found function (return type: identifier)');
                this.currentCommentRaw = currentComment; // preserve documentation comment for functions with a return type
                this.parseFunction(nextTokenIndex, [index, identifierLiteralOrTypeCased]);
                break;
            case PapyrusKeyword.PropertyBegin:
                //console.debug('Found property');
                this.parseProperty(nextTokenIndex, [index, identifierLiteralOrTypeCased], '');
                break;
            default: {
                // Who's got a type with no keyword?
                // Who's got a type with no keyword?
                // Must be variables!
                // Must be variables!
                // Must be variables! Darn variables!

                // We don't care about variables for the purpose of this index. So let's yeet them into the void after parsing them properly.

                const [possibleEqualSignIndex, possibleEqualSign] = this.getNextToken(true);
                if (possibleEqualSign === '=') {
                    //console.debug('Found variable with assignment');
                    const [defaultValueIndex, defaultValueRaw] = this.getNextToken(false);
                    if (defaultValueRaw === EOF) throw new PapyrusParserError('Expected default value for variable after an "=", but got the end of the file (EOF)!', defaultValueIndex, this.document);
                    const defaultValue = this.completeLiteralToken(possibleEqualSignIndex, defaultValueRaw, true); // eslint-disable-line @typescript-eslint/no-unused-vars
                } else if (possibleEqualSign === EOF) {
                    //console.debug('Found variable with no assignment, with an EOF after the identifier');
                } else {
                    //console.debug('Found variable with no assignment, with another token after the identifier');
                    this.parseToken(possibleEqualSignIndex, possibleEqualSign, toLowerCase(possibleEqualSign));
                }
            }
        }
    }

    private parseProperty(propertyBegin: number, type: readonly [ begin: number, str: string], groupName: Lowercase<string>): undefined | [index: number, cased: string, lowercase: Lowercase<string>] {
        const group = this.result.propertyGroups[groupName];
        if (!group) throw new PapyrusParserError(`Property group "${groupName}" does not exist, but we just tried to parse a property for that group!`, this.originalIndex, this.document);

        let documentationComment = PapyrusScriptParser.normalizeDocumentationWhitespace(this.currentCommentRaw);

        const [propertyNameIndex, propertyName] = this.getNextToken(true);
        if (propertyName === EOF) throw new PapyrusParserError('Expected property name, but got the end of the file (EOF)!', propertyNameIndex, this.document);
        const propertyNameLowercase = toLowerCase(propertyName);
        if (propertyNameLowercase in group.properties) throw new PapyrusParserError(`Property "${propertyName}" already exists in group "${groupName}"!`, propertyNameIndex, this.document);
        if (PapyrusKeywords.has(propertyNameLowercase)) throw new PapyrusParserError(`Property name "${propertyName}" is a reserved keyword!`, propertyNameIndex, this.document);

        let auto = false;
        let foundEnd = false;
        let hasGetter = false;
        let hasSetter = false;
        let isConstant = false;
        let hidden = false; // Must be hidden if not auto!
        let isMandatory = false;

        let nextTokenIndex = -1;
        let nextTokenCased: string | null = null;
        let nextTokenLowercase: Lowercase<string> | null = null;

        let defaultValue: readonly [number, string|null] | null = null;

        let documentationString: string | null = null;
        loop: while (this.index < this.sourceCodeCased.length) {
            const [tokenIndex, tokenCased] = this.getNextToken(true);
            if (tokenCased === EOF) {
                if (auto) break loop;
                throw new PapyrusParserError('Expected to see the end of the property, but got the end of the file (EOF)!', tokenIndex, this.document);
            }
            const tokenLowercase = toLowerCase(tokenCased);
            switch(tokenLowercase) {
                case '=': {
                    const [defaultValueIndex, defaultValueRaw] = this.getNextToken(true);
                    if (defaultValueRaw === EOF) throw new PapyrusParserError('Expected default value for property after an "=", but got the end of the file (EOF)!', defaultValueIndex, this.document);
                    defaultValue = [defaultValueIndex, this.completeLiteralToken(tokenIndex, defaultValueRaw, true)]; // this should be fine, but I'll make it more complex if it's not
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment ??= maybeDocumentationComment;
                    break;
                } case PapyrusKeyword.Auto: {
                    auto = true;
                    hasGetter = true;
                    hasSetter = true;
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment ??= maybeDocumentationComment;
                    break;
                } case PapyrusKeyword.PropertyAutoReadonly: {
                    auto = true;
                    hasGetter = true;
                    hasSetter = false;
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment ??= maybeDocumentationComment;
                    break;
                } case PapyrusKeyword.Const: {
                    if (this.game === PapyrusGame.SkyrimSE) throw new PapyrusParserError('Const properties are not supported by Skyrim\'s Papyrus compiler', tokenIndex, this.document);
                    isConstant = true;
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment ??= maybeDocumentationComment;
                    break;
                } case PapyrusKeyword.Hidden: {
                    hidden = true;
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment ??= maybeDocumentationComment;
                    break;
                } case PapyrusKeyword.Conditional: {
                    isMandatory = true;
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment ??= maybeDocumentationComment;
                    break;
                } case PapyrusKeyword.Mandatory: {
                    if (this.game === PapyrusGame.SkyrimSE) throw new PapyrusParserError('Mandatory properties are not supported by Skyrim\'s Papyrus compiler', tokenIndex, this.document);
                    isMandatory = true;
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment ??= maybeDocumentationComment;
                    break;
                } case PapyrusKeyword.PropertyEnd:
                    foundEnd = true;
                    break loop;
                case '{':
                    documentationString = this.parseDocumentationString(tokenIndex);
                    break loop;
                default:
                    if (auto) {
                        //console.debug('Found next token after a native function declaration; saving to parse later');
                        nextTokenIndex = tokenIndex;
                        nextTokenCased = tokenCased;
                        nextTokenLowercase = tokenLowercase;
                    } else {
                        //console.debug('Found function body; skipping to end of function');
                    }
                    break loop;
            }
        }

        // TODO: Find if the property body has getter and/or setter functions

        if (!foundEnd && !auto) this.skipToKeyword(this.index, PapyrusKeyword.PropertyEnd);

        if (!auto) hidden = true;

        group.properties[propertyNameLowercase] = {
            name: propertyName,
            auto,
            hasGetter,
            hasSetter,
            documentationComment,
            documentationString,
            hidden,
            constant: isConstant as false | (TGame extends PapyrusGame.Fallout4 | PapyrusGame.Fallout76 | PapyrusGame.Starfield ? true : never),
            mandatory: isMandatory as false | (TGame extends PapyrusGame.Fallout4 | PapyrusGame.Fallout76 | PapyrusGame.Starfield ? true : never),
            value: this.formatPapyrusValue(type, defaultValue ?? [propertyBegin, null], false),  // TODO: Test if a property can actually use CustomEventName and such types
        };


        if (nextTokenCased !== null) {
            if (nextTokenLowercase === null) throw new Error('This is logically impossible!');
            if (nextTokenIndex === -1) throw new Error('This is logically impossible!');
            //console.debug('Now parsing the token we found after the auto property declaration', {nextToken: nextTokenCased});
            if (groupName !== '') return [nextTokenIndex, nextTokenCased, nextTokenLowercase];
            else this.parseToken(nextTokenIndex, nextTokenCased, nextTokenLowercase);
        }

    }

    private parseImport(_index: number): void {
        const [importScriptNameIndex, importScriptName] = this.getNextToken(true);
        if (importScriptName === EOF) throw new PapyrusParserError('Expected import name, but got the end of the file (EOF)!', importScriptNameIndex, this.document);
        this.result.imports.push(importScriptName);
    }

    private parseFunctionOrEventParameters(): PapyrusScriptFunctionParameter[] {
        const [openParenIndex, openParen] = this.getNextToken(true);
        if (openParen !== '(') throw new PapyrusParserError('Expected "(", but got something else!', openParenIndex, this.document);

        const parameters: PapyrusScriptFunctionParameter[] = [];
        let currentParameter: [type?: readonly [index: number, str: string], name?: readonly [index: number, str: string], defaultValue?: [index: number, str: string|null]] = [];
        // I do not know if the following logic needs to be as complex as it is but I'm playing it safe
        let nestLevels = 1;
        let nextShouldBeDefaultValue = false;
        let documentationComment: string | null = this.currentCommentRaw;
        while (nestLevels > 0) {
            const [tokenIndex, tokenRaw] = this.getNextToken(true);
            if (tokenRaw === EOF) throw new PapyrusParserError('Expected parameter type, but got the end of the file (EOF)!', tokenIndex, this.document);
            const token = this.completeLiteralToken(tokenIndex, tokenRaw, false);
            if (token === '\\') {
                continue;
            } else if (token === '(') {
                nestLevels++;
                if (nextShouldBeDefaultValue) currentParameter[2] = [tokenIndex, token];
            } else if (token === ')') {
                nestLevels--;
                if (nextShouldBeDefaultValue) {
                    if (nestLevels === 0) throw new PapyrusParserError('Expected default value for parameter after equal sign (got close parentheses)', tokenIndex, this.document);
                    else if (nestLevels === 1) nextShouldBeDefaultValue = false;
                } else {
                    const [type, name, defaultValue] = currentParameter;
                    if (!type) {
                        if (parameters.length > 0) throw new PapyrusParserError('Expected parameter type and name after comma', tokenIndex, this.document);
                        else continue;
                    }
                    if (!name) throw new PapyrusParserError('Expected parameter name after type', tokenIndex, this.document);
                    parameters.push({
                        documentationComment,
                        isRequired: defaultValue === undefined,
                        name: name[1],
                        value: this.formatPapyrusValue(type, defaultValue ?? [tokenIndex, null], true),
                    });
                    currentParameter = [];
                }
            } else if (token === ',') {
                const [type, name, defaultValue] = currentParameter;
                if (!type) throw new PapyrusParserError('Expected parameter type and name after comma', tokenIndex, this.document);
                if (!name) throw new PapyrusParserError('Expected parameter name after type', tokenIndex, this.document);
                if (nextShouldBeDefaultValue) {
                    if (nestLevels > 1) throw new PapyrusParserError('Expected a closed parentheses to close the nesting before ending the parameter!', tokenIndex, this.document);
                    if (!defaultValue) throw new PapyrusParserError('Expected default value for parameter after equal sign (got comma)', tokenIndex, this.document);
                }
                parameters.push({
                    documentationComment,
                    isRequired: defaultValue === undefined,
                    name: name[1],
                    value: this.formatPapyrusValue(type, defaultValue ?? [tokenIndex, null], true),
                });
                currentParameter = [];
            } else if (token === '=') {
                if (currentParameter.length !== 2) throw new PapyrusParserError('Expected parameter type and name before default value', tokenIndex, this.document);
                nextShouldBeDefaultValue = true;
            } else {
                if (currentParameter.length === 0) {
                    if (token === null) throw new PapyrusParserError('Expected parameter type, but got "none"!', tokenIndex, this.document);
                    currentParameter[0] = [tokenIndex, token];
                } else if (currentParameter.length === 1) {
                    if (token === null) throw new PapyrusParserError('Expected parameter name, but got "none"!', tokenIndex, this.document);
                    currentParameter[1] = [tokenIndex, token];
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment = maybeDocumentationComment;
                } else if (currentParameter.length === 2) {
                    currentParameter[2] = [tokenIndex, token];
                    if (nestLevels === 1) nextShouldBeDefaultValue = false;
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment = maybeDocumentationComment;
                } else if (currentParameter.length === 3 && nestLevels > 1){
                    currentParameter[2]![1] += ` ${token}`;
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment = maybeDocumentationComment;
                } else {
                    throw new PapyrusParserError('Too many tokens for parameter', tokenIndex, this.document);
                }
            }
        }
        if (nextShouldBeDefaultValue) throw new PapyrusParserError('Expected default value for parameter', this.originalIndex, this.document);
        return parameters;
    }

    private parseFunction(_functionBegin: number, returnType: readonly [number, string] | null): void {
        let documentationComment = PapyrusScriptParser.normalizeDocumentationWhitespace(this.currentCommentRaw);

        const [functionNameIndex, functionName] = this.getNextToken(true);
        if (functionName === EOF) throw new PapyrusParserError('Expected function name, but got the end of the file (EOF)!', functionNameIndex, this.document);
        const functionNameLowercase = toLowerCase(functionName);
        if (functionNameLowercase in this.result.functions) throw new PapyrusParserError(`Function "${functionName}" already exists in this script!`, functionNameIndex, this.document);

        const parameters = this.parseFunctionOrEventParameters();

        let isGlobal = false;
        let isNative = false;
        let isDebugOnly = false;
        let isBetaOnly = false;
        let foundEnd = false;
        let documentationString: string | null = null;
        let nextTokenIndex = -1;
        let nextTokenCased : string | null = null;
        let nextTokenLowercase: Lowercase<string> | null = null;
        let lastIndex = this.index;
        loop: while (this.index < this.sourceCodeCased.length) {
            const [tokenIndex, tokenCased] = this.getNextToken(true);
            if (tokenCased === EOF) {
                if (isNative) break loop;
                else throw new PapyrusParserError('Expected to see the end of the function, but got the end of the file (EOF)!', tokenIndex, this.document);
            }
            const tokenLowercase = toLowerCase(tokenCased);
            switch(tokenLowercase) {
                case PapyrusKeyword.FunctionGlobal: {
                    //console.debug('Encountered Global function flag');
                    isGlobal = true;
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment ??= maybeDocumentationComment;
                    break;
                } case PapyrusKeyword.Native: {
                    //console.debug('Encountered Native function flag');
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment ??= maybeDocumentationComment;
                    isNative = true;
                    break;
                } case PapyrusKeyword.DebugOnly: {
                    if (this.game === PapyrusGame.SkyrimSE) throw new PapyrusParserError('Debug-only functions are not supported by Skyrim\'s Papyrus compiler', tokenIndex, this.document);
                    //console.debug('Encountered Debug-only function flag');
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment ??= maybeDocumentationComment;
                    isDebugOnly = true;
                    break;
                } case PapyrusKeyword.BetaOnly: {
                    if (this.game === PapyrusGame.SkyrimSE) throw new PapyrusParserError('Beta-only functions are not supported by Skyrim\'s Papyrus compiler', tokenIndex, this.document);
                    //console.debug('Encountered Beta-only function flag');
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment ??= maybeDocumentationComment;
                    isBetaOnly = true;
                    break;
                } case PapyrusKeyword.FunctionEnd: {
                    //console.debug('Function ended');
                    const maybeDocumentationComment = this.getCommentBeforeNextTokenOrLineBreak();
                    if (maybeDocumentationComment !== EOF) documentationComment ??= maybeDocumentationComment;
                    foundEnd = true;
                    break loop;
                } case '{':
                    //console.debug('Found function documentation string');
                    documentationString = this.parseDocumentationString(tokenIndex);
                    lastIndex = this.index;
                    break loop;
                default:
                    if (isNative) {
                        //console.debug('Found next token after a native function declaration; saving to parse later');
                        nextTokenIndex = tokenIndex;
                        nextTokenCased = tokenCased;
                        nextTokenLowercase = tokenLowercase;
                    } else {
                        //console.debug('Found function body; skipping to end of function');
                    }
                    break loop;
            }
            lastIndex = this.index;
        }

        if (!foundEnd && !isNative) {
            if (!this.isReplacingLogicWithGuard || functionNameLowercase === 'guard') {
                this.skipToKeyword(this.index, PapyrusKeyword.FunctionEnd);
            } else {
                const functionBodyStartIndex = this.sourceCodeLowercase.indexOf('\n', lastIndex) + 1;
                this.skipToKeyword(this.index, PapyrusKeyword.FunctionEnd);
                const functionBodyEndIndex = this.sourceCodeLowercase.slice(0, this.index).lastIndexOf('\n');
                this.sourceCodeCased = this.sourceCodeCased.slice(0, functionBodyStartIndex) + '    Guard()' + this.sourceCodeCased.slice(functionBodyEndIndex);
                this.sourceCodeLowercase = this.sourceCodeLowercase.slice(0, functionBodyStartIndex) as Lowercase<string> + '    guard()' + this.sourceCodeLowercase.slice(functionBodyEndIndex) as Lowercase<string>;
                this.document.sourceCode = this.sourceCodeCased;
                this.document.isModified = true;
                //console.log('=============================\n'.repeat(5) + this.sourceCodeCased + '\n============================='.repeat(5));
                this.index -= functionBodyEndIndex - (functionBodyStartIndex + 11);
            }
        }

        // SDKs for Papyrus-only libraries use Guard() to show a message box when you accidentally compile the SDK script
        // We also use it to avoid just outright including the code for Papyrus-only functions and libraries.
        //
        // If we're not actively Guard()ing, don't include the Guard() function in the parsed script.
        if (functionNameLowercase !== 'guard' || this.isReplacingLogicWithGuard) {
            this.result.functions[functionNameLowercase] = {
                name: functionName,
                isGlobal,
                isNative,
                documentationComment,
                documentationString,
                isBetaOnly: isBetaOnly as false | (TGame extends PapyrusGame.Fallout4 | PapyrusGame.Fallout76 | PapyrusGame.Starfield ? boolean : never),
                isDebugOnly: isDebugOnly as false | (TGame extends PapyrusGame.Fallout4 | PapyrusGame.Fallout76 | PapyrusGame.Starfield ? boolean : never),
                parameters,
                returnType: returnType ? this.formatPapyrusType(returnType, false) : {type: PapyrusScriptTypeArchetype.None, isArray: false},
            };
        }

        if (nextTokenCased !== null) {
            if (nextTokenLowercase === null) throw new Error('This is logically impossible!');
            if (nextTokenIndex === -1) throw new Error('This is logically impossible!');
            //console.debug('Now parsing the token we found after the native function declaration', {nextToken: nextTokenCased});
            this.parseToken(nextTokenIndex, nextTokenCased, nextTokenLowercase);
        }
    }

    private parseEvent(_eventBegin: number): void {
        const documentationComment = PapyrusScriptParser.normalizeDocumentationWhitespace(this.currentCommentRaw);

        const [eventNameIndex, eventName] = this.getNextToken(true);
        if (eventName === EOF) throw new PapyrusParserError('Expected event name, but got the end of the file (EOF)!', eventNameIndex, this.document);
        const eventNameLowercase = toLowerCase(eventName);
        if (eventNameLowercase in this.result.events) throw new PapyrusParserError(`Event "${eventName}" already exists in this script!`, eventNameIndex, this.document);

        const parameters = this.parseFunctionOrEventParameters();

        let isDebugOnly = false;
        let isBetaOnly = false;
        let foundEnd = false;
        let documentationString: string | null = null;
        let isNative = false;
        let nextTokenIndex = -1;
        let nextTokenCased : string | null = null;
        let nextTokenLowercase: Lowercase<string> | null = null;
        let lastIndex = this.index;
        loop: while (this.index < this.sourceCodeCased.length) {
            const [tokenIndex, tokenCased] = this.getNextToken(false);
            if (tokenCased === EOF) {
                if (isNative) break loop;
                else throw new PapyrusParserError('Expected to see the end of the event, but got the end of the file (EOF)!', tokenIndex, this.document);
            }
            const tokenLowercase = toLowerCase(tokenCased);
            switch(tokenLowercase) {
                case PapyrusKeyword.DebugOnly:
                    if (this.game === PapyrusGame.SkyrimSE) throw new PapyrusParserError('Debug-only events are not supported by Skyrim\'s Papyrus compiler', tokenIndex, this.document);
                    isDebugOnly = true;
                    break;
                case PapyrusKeyword.BetaOnly:
                    if (this.game === PapyrusGame.SkyrimSE) throw new PapyrusParserError('Beta-only events are not supported by Skyrim\'s Papyrus compiler', tokenIndex, this.document);
                    isBetaOnly = true;
                    break;
                case PapyrusKeyword.Native: // so apparently Skyrim's compiler just... supports this? idk man but Better Third Person Selection uses it
                    isNative = true;
                    break;
                case PapyrusKeyword.EventEnd:
                    //console.debug('Event ended');
                    foundEnd = true;
                    break loop;
                case '{':
                    //console.debug('Found event documentation string');
                    documentationString = this.parseDocumentationString(tokenIndex);
                    lastIndex = this.index;
                    break loop;
                default:
                    if (isNative) {
                        //console.debug('Found next token after a native event declaration; saving to parse later');
                        nextTokenIndex = tokenIndex;
                        nextTokenCased = tokenCased;
                        nextTokenLowercase = tokenLowercase;
                    } else {
                        //console.debug('Found event body; skipping to end of event');
                    }
                    break loop;
            }
            lastIndex = this.index;
        }

        if (!foundEnd && !isNative) {
            if (!this.isReplacingLogicWithGuard) {
                this.skipToKeyword(this.index, PapyrusKeyword.EventEnd);
            } else {
                const functionBodyStartIndex = this.sourceCodeLowercase.indexOf('\n', lastIndex) + 1;
                this.skipToKeyword(this.index, PapyrusKeyword.EventEnd);
                const functionBodyEndIndex = this.sourceCodeLowercase.slice(0, this.index).lastIndexOf('\n');
                this.sourceCodeCased = this.sourceCodeCased.slice(0, functionBodyStartIndex) + '    Guard()' + this.sourceCodeCased.slice(functionBodyEndIndex);
                this.sourceCodeLowercase = this.sourceCodeLowercase.slice(0, functionBodyStartIndex) as Lowercase<string> + '    guard()' + this.sourceCodeLowercase.slice(functionBodyEndIndex) as Lowercase<string>;
                this.document.sourceCode = this.sourceCodeCased;
                this.document.isModified = true;
                //console.log('=============================\n'.repeat(5) + this.sourceCodeCased + '\n============================='.repeat(5));
                this.index -= functionBodyEndIndex - (functionBodyStartIndex + 11);
            }
        }

        this.result.events[eventNameLowercase] = {
            name: eventName,
            isBetaOnly: isBetaOnly as false | (TGame extends PapyrusGame.Fallout4 | PapyrusGame.Fallout76 | PapyrusGame.Starfield ? true : never),
            isDebugOnly: isDebugOnly as false | (TGame extends PapyrusGame.Fallout4 | PapyrusGame.Fallout76 | PapyrusGame.Starfield ? true : never),
            documentationComment,
            documentationString,
            parameters,
        };

        if (nextTokenCased !== null) {
            if (nextTokenLowercase === null) throw new Error('This is logically impossible!');
            if (nextTokenIndex === -1) throw new Error('This is logically impossible!');
            //console.debug('Now parsing the token we found after the native event declaration', {nextToken: nextTokenCased});
            this.parseToken(nextTokenIndex, nextTokenCased, nextTokenLowercase);
        }
    }

    completeLiteralToken(tokenIndex: number, token: string, expectLiteral: boolean): string | null {
        const lowercaseToken = toLowerCase(token);
        if (token === "'") {
            //console.debug('Found single-quoted string; completing...');
            const oldIndex = this.index;
            const endStringMatch = this.sourceCodeLowercase.slice(oldIndex).match(/(?:[^\\']|\\.)?'/u);
            if (!endStringMatch) throw new PapyrusParserError('String literal never ended (expected unescaped single quote)!', tokenIndex, this.document);
            this.index = oldIndex + endStringMatch.index! + endStringMatch[0].length;
            return this.sourceCodeCased.slice(oldIndex, this.index);
        } else if (token === '"') {
            //console.debug('Found double-quoted string; completing...');
            const oldIndex = this.index;
            const endStringMatch = this.sourceCodeLowercase.slice(oldIndex).match(/(?:[^\\"]|\\.)?"/u);
            if (!endStringMatch) throw new PapyrusParserError('String literal never ended (expected unescaped double quote)!', tokenIndex, this.document);
            this.index = oldIndex + endStringMatch.index! + endStringMatch[0].length;
            return this.sourceCodeCased.slice(oldIndex, this.index);
        } else if (lowercaseToken === 'none') {
            //console.debug('Found "none" literal. No completion needed.');
            return null;
        }  else if (lowercaseToken === 'true' || lowercaseToken === 'false') {
            //console.debug('Found boolean or none literal. No completion needed.');
            return lowercaseToken;
        } else if (lowercaseToken.match(/^(?:0x[0-9a-f]+|[0-9.]+)$/u)) {
            //console.debug('Found positive integer or float. No completion needed.');
            return lowercaseToken;
        } else if (token === '-') {
            const nextCharacter = this.sourceCodeCased[this.index];
            if (!nextCharacter) throw new PapyrusParserError('Expected a number after a negative sign, but got the end of the file (EOF)!', this.originalIndex, this.document);
            if (WhitespaceTokens.has(nextCharacter)) {
                //console.debug('Found standalone subtraction sign. No completion needed.');
                return token;
            }
            if (!nextCharacter.match(/[0-9]/u)) {
                if (expectLiteral) throw new PapyrusParserError('Expected a number after a negative sign, but got something else!', this.originalIndex, this.document);
                else return token;
            }
            //console.debug('Found negative integer or float. Completing...');
            const oldIndex = this.index;
            const endNumberMatch = this.sourceCodeLowercase.slice(oldIndex).match(/^(?:0x[0-9a-f]|[0-9.]+)/u);
            if (!endNumberMatch) throw new PapyrusParserError('Number literal never ended!', oldIndex, this.document);
            this.index = oldIndex + endNumberMatch[0].length;
            return this.sourceCodeCased.slice(oldIndex - 1, this.index);
        } else {
            //console.debug('Found non-literal token. No completion needed.');
            if (expectLiteral) throw new PapyrusParserError('Expected a literal value, but got something else!', tokenIndex, this.document);
            return token;
        }
    }

    formatPapyrusType<TIsParameter extends boolean>([typeBegin, type]: readonly [number, string], isFunctionParameter: TIsParameter): PapyrusScriptType<boolean, TIsParameter> {
        //console.debug('Formatting Papyrus type', {typeBegin, type});
        const isArray = type.endsWith('[]');
        if (isArray) type = type.slice(0, -2);
        const typeLowercase = toLowerCase(type);
        switch (typeLowercase) {
            case 'bool':
                return {
                    type: PapyrusScriptTypeArchetype.Bool,
                    isArray,
                };
            case 'int':
                return {
                    type: PapyrusScriptTypeArchetype.Int,
                    isArray,
                };
            case 'float':
                return {
                    type: PapyrusScriptTypeArchetype.Float,
                    isArray,
                };
            case 'string':
                return {
                    type: PapyrusScriptTypeArchetype.String,
                    isArray,
                };
            case 'var':
                return {
                    type: PapyrusScriptTypeArchetype.Var,
                    isArray,
                };
            case 'structvarname':
                if (!isFunctionParameter) throw new PapyrusParserError('StructVarName is only allowed as a function parameter type!', typeBegin, this.document);
                return {
                    type: PapyrusScriptTypeArchetype.StructVarName as TIsParameter extends true ? PapyrusScriptTypeArchetype.StructVarName : never,
                    isArray,
                };
            case 'customeventname':
                if (!isFunctionParameter) throw new PapyrusParserError('CustomEventName is only allowed as a function parameter type!', typeBegin, this.document);
                return {
                    type: PapyrusScriptTypeArchetype.CustomEventName as TIsParameter extends true ? PapyrusScriptTypeArchetype.CustomEventName : never,
                    isArray,
                };
            case 'scripteventname':
                if (!isFunctionParameter) throw new PapyrusParserError('ScriptEventName is only allowed as a function parameter type!', typeBegin, this.document);
                return {
                    type: PapyrusScriptTypeArchetype.ScriptEventName as TIsParameter extends true ? PapyrusScriptTypeArchetype.ScriptEventName : never,
                    isArray,
                };
            default:
                if (this.game === PapyrusGame.SkyrimSE) {
                    return {
                        type: PapyrusScriptTypeArchetype.ScriptInstance,
                        isArray,
                        scriptName: type,
                    };
                } else {
                    return {
                        type: PapyrusScriptTypeArchetype.ScriptInstanceOrStruct,
                        isArray,
                        ambiguousName: type,
                    };
                }
        }
    }

    parseMaybeArrayValue<TIsArray extends boolean, TValue, TModifierFunction extends (this: void, value: TValue) => any>(index: number, isArray: TIsArray, value: TValue, modifier: TModifierFunction): (TIsArray extends true ? null : never) | (TIsArray extends false ? ReturnType<TModifierFunction> : never) {
        if (isArray) {
            if (value !== null) throw new PapyrusParserError('Expected "none" for array value, but got something else!', index, this.document);
            return null as (TIsArray extends true ? null : never);
        }

        return modifier(value) as (TIsArray extends false ? ReturnType<TModifierFunction> : never);
    }


    formatPapyrusValue<TIsParameter extends boolean>(type: readonly [number, string], [valueBegin, value]: readonly [number, string|null], isFunctionParameter: TIsParameter): PapyrusScriptValue<boolean, TIsParameter> {
        const papyrusType = this.formatPapyrusType(type, isFunctionParameter as true);
        //console.debug('Formatting Papyrus value', {valueBegin, value, papyrusType});

        switch (papyrusType.type) {
            case PapyrusScriptTypeArchetype.Bool:
                return {
                    type: PapyrusScriptTypeArchetype.Bool,
                    isArray: papyrusType.isArray,
                    value: this.parseMaybeArrayValue(valueBegin, papyrusType.isArray, value, () => {
                        if (value === 'true') return true;
                        if (value === 'false') return false;
                        if (value === null) return null; // when a parameter is required, we use "none" as our placeholder value -- throw new PapyrusSyntaxError('Cannot initialize a boolean value with "none"', valueBegin, this.document);
                        throw new PapyrusParserError('Expected a boolean value, but got something else!', valueBegin, this.document);
                    }),
                };
            case PapyrusScriptTypeArchetype.Int: {
                const baseSystem = value?.startsWith('0x') ? 16 : 10;
                return {
                    type: PapyrusScriptTypeArchetype.Int,
                    isArray: papyrusType.isArray,
                    baseSystem,
                    value: this.parseMaybeArrayValue(valueBegin, papyrusType.isArray, value, () => value === null ? null : parseInt(value, baseSystem)),
                };
            }
            case PapyrusScriptTypeArchetype.Float: {
                return {
                    type: PapyrusScriptTypeArchetype.Float,
                    isArray: papyrusType.isArray,
                    value: this.parseMaybeArrayValue(valueBegin, papyrusType.isArray, value, () => value === null ? null : parseFloat(value)),
                };
            }
            case PapyrusScriptTypeArchetype.String:
                return {
                    type: PapyrusScriptTypeArchetype.String,
                    isArray: papyrusType.isArray,
                    value: this.parseMaybeArrayValue(valueBegin, papyrusType.isArray, value, () => value === null ? null : value.slice(1, -1)),
                };
            case PapyrusScriptTypeArchetype.ScriptEventName:
                if (!isFunctionParameter) throw new PapyrusParserError('ScriptEventName is only allowed as a function parameter type!', type[0], this.document);
                return {
                    type: PapyrusScriptTypeArchetype.ScriptEventName as TIsParameter extends true ? PapyrusScriptTypeArchetype.ScriptEventName : never,
                    isArray: papyrusType.isArray,
                    value: this.parseMaybeArrayValue(valueBegin, papyrusType.isArray, value, () => value),
                };
            case PapyrusScriptTypeArchetype.CustomEventName:
                if (!isFunctionParameter) throw new PapyrusParserError('CustomEventName is only allowed as a function parameter type!', type[0], this.document);
                return {
                    type: PapyrusScriptTypeArchetype.CustomEventName as TIsParameter extends true ? PapyrusScriptTypeArchetype.CustomEventName : never,
                    isArray: papyrusType.isArray,
                    value: this.parseMaybeArrayValue(valueBegin, papyrusType.isArray, value, () => value),
                };
            case PapyrusScriptTypeArchetype.StructVarName:
                if (!isFunctionParameter) throw new PapyrusParserError('StructVarName is only allowed as a function parameter type!', type[0], this.document);
                return {
                    type: PapyrusScriptTypeArchetype.StructVarName as TIsParameter extends true ? PapyrusScriptTypeArchetype.StructVarName : never,
                    isArray: papyrusType.isArray,
                    value: this.parseMaybeArrayValue(valueBegin, papyrusType.isArray, value, () => value),
                };
            case PapyrusScriptTypeArchetype.ScriptInstance:
                if (value !== null) throw new PapyrusParserError('Cannot initialize a non-primitive type outside of a function', valueBegin, this.document);
                return {
                    type: PapyrusScriptTypeArchetype.ScriptInstance,
                    isArray: papyrusType.isArray,
                    scriptName: papyrusType.scriptName,
                    value: null,
                };
            case PapyrusScriptTypeArchetype.Struct:
                if (value !== null) throw new PapyrusParserError('Cannot initialize a non-primitive type outside of a function', valueBegin, this.document);
                return {
                    type: PapyrusScriptTypeArchetype.Struct,
                    isArray: papyrusType.isArray,
                    scriptName: papyrusType.scriptName,
                    structName: papyrusType.structName,
                    value: null,
                };
            case PapyrusScriptTypeArchetype.ScriptInstanceOrStruct:
                if (value !== null) throw new PapyrusParserError('Cannot initialize a non-primitive type outside of a function', valueBegin, this.document);
                return {
                    type: PapyrusScriptTypeArchetype.ScriptInstanceOrStruct,
                    isArray: papyrusType.isArray,
                    ambiguousName: papyrusType.ambiguousName,
                    value: null,
                };
            case PapyrusScriptTypeArchetype.Var:
                return {
                    type: PapyrusScriptTypeArchetype.Var,
                    isArray: papyrusType.isArray,
                    value: this.parseMaybeArrayValue(valueBegin, false, value, () => value),
                };
            case PapyrusScriptTypeArchetype.None:
                throw new PapyrusParserError('Cannot use "none" as a type', type[0], this.document);
            default:
                throw new UnreachableError(papyrusType, 'Unknown Papyrus type archetype');
        }
    }


    parseScript(document: PapyrusScriptDiscoveredDocument): PapyrusScript<TGame> {
        this.document = {...document, isModified: false};
        this.sourceCodeCased = document.sourceCode;
        this.sourceCodeLowercase = toLowerCase(document.sourceCode);
        this.index = 0;
        this.result = this.generateEmptyPapyrusScript();

        while (this.index < this.sourceCodeCased.length)
            this.parseNextToken();

        if (Object.keys(this.result.propertyGroups['']!.properties).length === 0) delete this.result.propertyGroups[''];

        return {
            namespace: (this.result.namespace as (TGame extends PapyrusGame.Fallout4 | PapyrusGame.Fallout76 | PapyrusGame.Starfield ? string : never) | null) ?? null,
            namespaceName: this.result.namespaceName ?? (() => { throw new PapyrusParserError('Script has no name! (triggering prop: namespaceName)', 0, document) })(),
            nameWithoutNamespace: this.result.nameWithoutNamespace ?? (() => { throw new PapyrusParserError('Script has no name! (triggering prop: nameWithoutNamespace)', 0, document) })(),
            isBetaOnly: this.result.isBetaOnly ?? false,
            isDebugOnly: this.result.isDebugOnly ?? false,
            isHidden: this.result.isHidden ?? false,
            default: (this.result.default ?? null) as (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never),
            isNative: this.result.isNative as (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never),
            isConditional: this.result.isConditional ?? false,
            isConst: (this.result.isConst ?? false) as (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? boolean : never) | false,
            documentationComment: this.result.documentationComment ?? null,
            documentationString: this.result.documentationString ?? null,
            extends: this.result.extends ?? null,
            imports: this.result.imports,
            propertyGroups: this.result.propertyGroups,
            structs: this.result.structs as (TGame extends Exclude<PapyrusGame, PapyrusGame.SkyrimSE> ? Record<Lowercase<string>, PapyrusScriptStruct<TGame>> : never) | (TGame extends PapyrusGame.SkyrimSE ? null : never),
            events: this.result.events,
            functions: this.result.functions,
        };
    }

    // eslint-disable-next-line no-shadow
    static parseScript<TGame extends PapyrusGame>(game: TGame, document: PapyrusScriptDiscoveredDocument): PapyrusScript<TGame> {
        const parser = new PapyrusScriptParser(game);
        return parser.parseScript(document);
    }

    replaceFunctionImplementationWithGuard(script: PapyrusScriptDiscoveredDocument){
        const originalSourceCode = script.sourceCode;
        this.isReplacingLogicWithGuard = true;
        const result = this.parseScript(script);
        this.document.isModified = this.document.sourceCode.toLowerCase() !== originalSourceCode.toLowerCase();
        if (this.document.isModified && !result.functions.guard) {
            this.document.sourceCode += `

Function Guard()
    Debug.MessageBox("${result.namespaceName}: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction

`;

this.document.sourceCode = this.document.sourceCode.trimEnd() + '\n';
        }
        return [this.document, result] as const;
    }

    // eslint-disable-next-line no-shadow
    static replaceFunctionImplementationWithGuard<TGame extends PapyrusGame>(game: TGame, script: PapyrusScriptDiscoveredDocument) {
        const parser = new PapyrusScriptParser(game);
        return parser.replaceFunctionImplementationWithGuard(script);
    }
}

export function parseScriptSync<TGame extends PapyrusGame>(game: TGame, script: PapyrusScriptDiscoveredDocument): PapyrusScript<TGame> {
    return PapyrusScriptParser.parseScript(game, script);
}

export function replaceFunctionImplementationWithGuard<TGame extends PapyrusGame>(game: TGame, script: PapyrusScriptDiscoveredDocument) {
    return PapyrusScriptParser.replaceFunctionImplementationWithGuard(game, script);
}
