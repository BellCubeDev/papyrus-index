Scriptname DbMiscFunctions Hidden 

;/
Function MoveToLocalOffset(ObjectReference RefToMove, ObjectReference CenterRef, Float Angle, Float Distance, float afZOffset = 0.0, bool abMatchRotation = true)
ObjectReference Function PlaceAndMoveToLocalOffset(ObjectReference PlaceAtMeRef, Form akFormToPlace, int aiCount = 1, bool abForcePersist = false, bool abInitiallyDisabled = false, \
Float Angle = 0.0, Float Distance = 100.0, float afZOffset = 0.0, bool abMatchRotation = true)

Function ApplyHavokImpulseLocal(ObjectReference Ref, Float Angle, float afZ, Float afMagnitude)
Bool Function ToggleCreationKitMarkers(Bool ShowMarkers = true, ObjectReference MoveToRef = none)
ObjectReference Function CreateXMarkerRef(Bool PersistentRef = false, ObjectReference PlaceAtMeRef = none)

Function RemoveAllItems(ObjectReference Ref, ObjectReference otherContainer = none, bool abSilent = true, float delay = 0.01, \
                        bool abNoEquipped = false, bool abNoFavorited = false, bool abNoQuestItem = true) Global

Function DropAllItems(ObjectReference Ref, bool dropIndividual = false, float delay = 0.01)
Function DropIndividualItems(ObjectReference Ref, Form Item, int NumOfItems = 0, float delay = 0.01)
Function MovePlayerTo(ObjectReference Ref)
Function UnlockShout(shout akShout)
Function UnlockEquippedShout()
Bool Function LocationOrParentsHasKeyword(Location akLocation, Keyword akKeyword)
string Function GetStringIfNull(string s, string nullString = "null")
string Function GetFormName(Form akForm, string nullString = "null", string NoNameString = "no name")
Bool Function ModHasFormType(String modName, int type)
Bool Function akFormHasKeywordString(Form akForm, String akString)
Bool Function FormHasKeywordInFormList(Form akForm, Formlist akList, Bool AllKeywords = False)
Bool Function FormHasKeywordInArray(Form akForm, Keyword[] akList, Bool AllKeywords = False)
Bool Function FormHasKeywordInStorageUtilList(Form akForm, Form ObjKey, String ListKeyName, Bool AllKeywords = False)
Bool Function FormHasKeywordInJsonUtilList(Form akForm, String JsonFilePath, String ListKeyName, Bool AllKeywords = False)
Bool Function IsNumber(String akString, Bool AllowForDecimals = True, Bool AllowNegativeNumbers = True)
Int Function ClampInt(Int i, Int Min, Int Max)
Float Function ClampFloat(Float f, Float Min, Float Max)
Bool Function IsIntInRange(Int i, Int Min, Int Max)
Bool Function IsFloatInRange(Float f, Float Min, Float Max)
Bool Function IsStringIndexBetween(String s, Int Index, String StartKey, String EndKey)
String function ConvertIntToHex(int i, int minDigits = 8)
Int function ConvertHexToInt(string hex, Bool TreatAsNegative = false)
String Function GetFormIDHex(Form akForm)
Int Function IntPow(Int x, Int y)
Int Function IntSqrt(Int i)
Int Function IntAbs(Int i)
int function RoundAsInt(Float f)
float function RoundAsFloat(Float f)
Float Function RoundDownToDec(Float f, Int DecimalPlaces = 0)
String Function RoundDownToDecString(Float f, Int DecimalPlaces = 0)
Int Function CountDecimalPlaces(Float f)
Float[] Function SplitAsFloat(String s, int Max = -1, String Divider = "||")
Int[] Function SplitAsInt(String s, int Max = -1, String Divider = "||")
String[] Function SortStringArray(String[] akArray, Bool Ascending = true, Bool Direct = true)
String[] Function CopyStringArray(String[] akArray)
String Function JoinStringArray(String[] akArray, String Divider = "||", Bool IgnoreDuplicates = false)
String Function JoinFloatArray(Float[] akArray, String Divider = "||", Bool IgnoreDuplicates = false)
String Function JoinIntArray(Int[] akArray, String Divider = "||", Bool IgnoreDuplicates = false)

Function PrintT(String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ", int aiSeverity = 0)

Function PrintTU(string asUserLog = "", String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ", int aiSeverity = 0)

Function PrintN(String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ")

Function PrintM(String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ")

Function PrintEvm(String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ")

Function PrintF(String FilePath, String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ")

String Function JoinStrings(String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ")

Int[] Function GetGameActorSoulLevels()
String[] Function GetGameSoulLevelNames()
Int Function GetActorSoulSize(Actor akActor)
String Function GetActorSoulSizeString(Actor akActor, String sBlackSize = "Black")
Bool Function ActorHasFormEquiped(Actor akActor, Form akForm) global 
Bool function CanInteractWith(ObjectReference ref, bool checkAshPile = true) global 
Bool Function IsActorNPC(Actor akActor)
Bool Function IsActorMoving(Actor akActor)
Form Function GetRandomFormFromRef(ObjectReference Ref, Int[] TypeArrayFilter = None, Formlist ListFilter = None, Bool TypeFilterHasType = true, Bool akListHasForm = true)
Form Function GetRandomFormFromRefA(ObjectReference Ref, Int[] TypeArrayFilter = None, Form[] ListFilter = None, Bool TypeFilterHasType = true, Bool akListHasForm = true)
Form Function GetRandomFormFromRefS(ObjectReference Ref, Int[] TypeArrayFilter = None, Form ObjKey = None, String ListKeyName = "", Bool TypeFilterHasType = true, Bool akListHasForm = true)
Form Function GetRandomFormFromRefJ(ObjectReference Ref, Int[] TypeArrayFilter = None, String JsonFilePath = "", String ListKeyName = "", Bool TypeFilterHasType = true, Bool akListHasForm = true)
Function SortActorArrayByName(Actor[] akArray, Bool Ascending = true)
Function SortObjectRefArrayByName(ObjectReference[] akArray, Bool Ascending = true)
Function SortFormArrayByName(Form[] akArray, Bool Ascending = true)
String[] Function GetActorNames(Actor[] akArray)
String[] Function GetObjectRefNames(ObjectReference[] akArray)
String[] Function GetFormNames(Form[] akArray)
String[] Function GetFormNamesFromList(Formlist akList)
String Function FormNamesInFormListToString(Formlist akList, string divider = "\n", string nullName = "null")
Form[] Function FormlistToArray(Formlist akList)
Function AddFormArrayFormsToList(Form[] akArray, Formlist akList)
float function SecondsToMinutes(float seconds) Global
float function SecondsToHours(float seconds) Global
float function MinutesToSeconds(float minutes) Global
float function MinutesToHours(float minutes) Global
float function HoursToSeconds(float Hours) Global
float function HoursToMinutes(float Hours) Global
float function GetRealMinutesPassed() Global
Bool Function WaitWhileKeyIsPressed(int keyCode, float secondsToWait) Global
Bool Function WaitWhileKeyIsPressed_interval(int keyCode, int waitCount, float waitInterval = 0.01) Global
Function RegisterFormForKeys(Form akForm, Int min = 1, Int Max = 281)
Function RegisterAliasForKeys(Alias akAlias, Int min = 1, Int Max = 281)
Function RegisterActiveMagicEffectForKeys(ActiveMagicEffect akActiveMagicEffect, Int min = 1, Int Max = 281)
int[] function GetAllKeysPressed()
Bool Function HotkeysPressed(int[] hotkeys, bool onlyTheseKeys = true)
Function SwapStrings(String[] akArray, Int IndexA, Int IndexB)
Function SwapStringsV(String[] akArray, Int IndexA, Int IndexB)
Function SwapBools(Bool[] akArray, Int IndexA, Int IndexB)
Function SwapBoolsV(Bool[] akArray, Int IndexA, Int IndexB)
Function SwapInts(Int[] akArray, Int IndexA, Int IndexB)
Function SwapIntsV(Int[] akArray, Int IndexA, Int IndexB)
Function SwapFloats(Float[] akArray, Int IndexA, Int IndexB)
Function SwapFloatsV(Float[] akArray, Int IndexA, Int IndexB)
Function SwapActors(Actor[] akArray, Int IndexA, Int IndexB)
Function SwapActorsV(Actor[] akArray, Int IndexA, Int IndexB)
Function SwapObjectReferences(ObjectReference[] akArray, Int IndexA, Int IndexB)
Function SwapObjectReferencesV(ObjectReference[] akArray, Int IndexA, Int IndexB)
Function SwapForms(Form[] akArray, Int IndexA, Int IndexB)
Function SwapFormsV(Form[] akArray, Int IndexA, Int IndexB)
int function JsonIntListPluck(string FileName, string KeyName, int index, int default = 0)
Float function JsonFloatListPluck(string FileName, string KeyName, int index, Float default = 0.0)
string function JsonStringListPluck(string FileName, string KeyName, int index, string default = "")
Form function JsonFormListPluck(String FileName, String KeyName, int index, Form default = none)
int function JsonintListShift(string FileName, string KeyName, int default = 0)
Float function JsonFloatListShift(string FileName, string KeyName, Float default = 0.0)
String function JsonStringListShift(string FileName, string KeyName, String default = "")
Form function JsonFormListShift(string FileName, string KeyName, Form default = none)
Int function JsonIntListPop(string FileName, string KeyName, int default = 0)
Float function JsonFloatListPop(string FileName, string KeyName, Float default = 0.0)
String function JsonStringListPop(string FileName, string KeyName, String default = "")
Form function JsonFormListPop(string FileName, string KeyName, Form default = none)
Function JsonIntListRemoveAllDuplicates(string FileName, string KeyName, Bool Acending = True)
Function JsonFloatListRemoveAllDuplicates(string FileName, string KeyName, Bool Acending = True)
Function JsonStringListRemoveAllDuplicates(string FileName, string KeyName, Bool Acending = True)
Function JsonFormListRemoveAllDuplicates(string FileName, string KeyName, Bool Acending = True)
String Function JsonJoinIntList(string FileName, string KeyName, string Divider = "||")
String Function JsonJoinFloatList(string FileName, string KeyName, string Divider = "||")
String Function JsonJoinStringList(string FileName, string KeyName, string Divider = "||")
String Function GetFormTypeString(Int Type, String sFilePath = "Data/interface/DbMiscFunctions/DbFormTypeStrings.txt")
String[] Function GetFormTypeStrings(String sFilePath = "Data/interface/DbMiscFunctions/DbFormTypeStrings.txt", int startIndex = 0, int endIndex = 134)
String Function GetKeyCodeString(Int keyCode, String sFilePath = "Data/interface/DbMiscFunctions/DbKeyCodeStrings.txt")
String Function GetKeyCodeStrings(int[] keys, string startBracket = "[", string endBracket = "]", string divider = "\n", bool includeInts = true)
String[] Function GetKeyCodeStringsInRange(int minKey = 1, int maxKey = 281, string startBracket = "[", string endBracket = "]", bool includeInts = true)
String Function GetModOriginFromHexID(string FormID)
String Function GetModOriginName(Form akForm)
int Function GetActorFormType(Form F)
int Function GetAudioFormType(Form F)
int Function GetCharacterFormType(Form F)
int Function GetItemFormType(Form F)
int Function GetMagicFormType(Form F)
int Function GetMiscFormType(Form F)
int Function GetSpecialEffectFormType(Form F)
int Function GetWorldDataFormType(Form F)
int Function GetWorldObjectFormType(Form F)
int Function GetInventoryItemFormType(Form F)
Int Function GetFormTypeAll(Form F)
String Function GetActorFormTypeString(Form F, String[] TypeStrings = none)
String Function GetAudioFormTypeString(Form F, String[] TypeStrings = none)
String Function GetCharacterFormTypeString(Form F, String[] TypeStrings = none)
String Function GetItemFormTypeString(Form F, String[] TypeStrings = none)
String Function GetMagicFormTypeString(Form F, String[] TypeStrings = none)
String Function GetMiscFormTypeString(Form F, String[] TypeStrings = none)
String Function GetSpecialEffectFormTypeString(Form F, String[] TypeStrings = none)
String Function GetWorldDataFormTypeString(Form F, String[] TypeStrings = none)
String Function GetWorldObjectFormTypeString(Form F, String[] TypeStrings = none)
string Function GetInventoryItemFormTypeString(Form F, String[] TypeStrings = none)
string Function GetFormTypeStringAll(Form F, String[] TypeStrings = none)
Function DisableThenEnablePlayerControls(Float Delay = 1.0)
Function UpdateActor(Actor akActor, Form akForm)
Function SwapEquipment(Actor A, Actor B)
Function SetActorValues(Actor akActor, String[] ActorValues, Float[] Values)
Function ModActorValues(Actor akActor, String[] ActorValues, Float[] Values)
Float[] Function GetActorValues(Actor akActor, String[] ActorValues, DynamicArrays DArrays = none)
String[] Function GetActorValueStrings(Actor akActor, String[] ActorValues, String[] ActorValueStrings = none, DynamicArrays DArrays = none)
String Function sGetActorValueStrings(Actor akActor, String[] ActorValues, String[] ActorValueStrings = none, String Divider = "||")
Float[] Function GetBaseActorValues(Actor akActor, String[] ActorValues, DynamicArrays DArrays = none)
String[] Function GetBaseActorValueStrings(Actor akActor, String[] ActorValues, String[] ActorValueStrings = none, DynamicArrays DArrays = none)
String Function sGetBaseActorValueStrings(Actor akActor, String[] ActorValues, String[] ActorValueStrings = none, String Divider = "||")
Float[] Function GetActorValuesFromFile(Actor akActor, String filePath = "Data/interface/DbMiscFunctions/DbActorValues.txt")
String[] Function GetActorValueStringsFromFile(Actor akActor, String filePath = "Data/interface/DbMiscFunctions/DbActorValues.txt")
String Function sGetActorValueStringsFromFile(Actor akActor, String Divider = "||", String filePath = "Data/interface/DbMiscFunctions/DbActorValues.txt")
Float[] Function GetBaseActorValuesFromFile(Actor akActor, String filePath = "Data/interface/DbMiscFunctions/DbActorValues.txt")
String[] Function GetBaseActorValueStringsFromFile(Actor akActor, String filePath = "Data/interface/DbMiscFunctions/DbActorValues.txt")
String Function sGetBaseActorValueStringsFromFile(Actor akActor, String Divider = "||", String filePath = "Data/interface/DbMiscFunctions/DbActorValues.txt")
Function AttachPapyrusScript(String akScript, ObjectReference Ref)
Function OpenMenu(string menuName)
Function CloseMenu(string menuName)
string function GetStringBetweenOuterCharacters(String s, int startIndex = 0, String leftChar = "(", string rightChar = ")")
int Function findNthInstanceInString(String s, String toFind, int nthInstance = -1, int startIndex = 0)
Int Function FindLastStringIndex(String s, String ToFind)
Int Function FindWholeWordString(String s, String ToFind, Int StartIndex = 0)
Bool Function IsCharWhiteSpace(String C)
String Function FindNextWordInString(String s, int startIndex = 0)
String Function RFindNextWordInString(String s, int startIndex = -1)
Int function FindNextNonWhiteSpaceCharIndexInString(String s, int startIndex = 0)
Int function RFindNextNonWhiteSpaceCharIndexInString(String s, int startIndex = -1)
Int Function FindNextWhiteSpaceCharIndexInString(String s, int startIndex = 0)
Int Function RFindNextWhiteSpaceCharIndexInString(String s, int startIndex = -1)
String Function FindNextNonWhiteSpaceCharInString(String s, int startIndex = 0)
String Function RFindNextNonWhiteSpaceCharInString(String s, int startIndex = -1)
String Function FindNextWhiteSpaceCharInString(String s, int startIndex = 0)
String Function RFindNextWhiteSpaceCharInString(String s, int startIndex = -1)
int Function RFindInString()
String Function RemoveWhiteSpaces(String s, Bool IncludeSpaces = True, Bool IncludeTabs = true, Bool IncludeNewLines = true)
Int Function CountWhiteSpaces(String s, Bool IncludeSpaces = True, Bool IncludeTabs = true, Bool IncludeNewLines = true)
Int Function CountStringsInString(String s, String ToFind, Bool WholeWordsOnly = false)
;string[] function SliceStringArray(string[] ArrayValues, int StartIndex, int EndIndex = -1)
Int[] Function GetPositionsOfStringInStrings(String s, String ToFind, Bool WholeWordsOnly = false)

String Function CreateRandomWord(int WordLength, string letters = "bcdfghjklmnpqrstvwxyz", string vowels = "aeiou", \
								 string pairs = "st gr ea ie ei pr qw fr cr tr vr br pl cl ")

String Function GetRandomWordFromString(String s, String Divider = " ")
String Function GetRandomWordsFromString(String s, int numOfWords, String Divider = " ")
String[] Function GetRandomWordsFromStringA(String s, int numOfWords, String Divider = " ")
String Function GetLoremipsumNoPunctuation()
String Function GetLoremipsum()
String Function RemoveDuplicateStrings(String TargetStr, String SearchStr)
String Function RemoveAllDuplicateStrings(String TargetStr, String Divider = "||", Bool IncludeDividersInResult = true)
String Function StringReplace(String TargetStr, String SearchStr, String ReplaceStr, Int Count = 0, Int StartIndex = 0)
String Function StringInsert(String TargetStr, String InsertStr, Int CharPosition = -1)
String Function StringRemoveCharAt(String s, Int Index)
String Function StringRemoveNonPrintableCharacters(String s)
String Function StringRemovePrintableCharacters(String s)
String Function AddPrefixToString(String s, String Prefix, Bool OnlyIfNotPresent = true)
String[] Function AddPrefixToStrings(String[] s, String Prefix, Bool OnlyIfNotPresent = true)
String Function RemovePrefixFromString(String s, String Prefix)
String[] Function RemovePrefixFromStrings(String[] s, String Prefix)
String Function AddSuffixToString(String s, String Suffix, Bool OnlyIfNotPresent = true)
String[] Function AddSuffixToStrings(String[] s, String Suffix, Bool OnlyIfNotPresent = true)
String Function RemoveSuffixFromString(String s, String Suffix)
String[] Function RemoveSuffixFromStrings(String[] s, String Suffix)
Function AddPrefixToFormName(Form akForm, String Prefix, Bool OnlyIfNotPresent = true)
Function AddPrefixToFormNames(Form[] akForms, String Prefix, Bool OnlyIfNotPresent = true)
Function RemovePrefixFromFormName(Form akForm, String Prefix)
Function RemovePrefixFromFormNames(Form[] akForms, String Prefix, Bool OnlyIfNotPresent = true)
Function AddSuffixToFormName(Form akForm, String Suffix, Bool OnlyIfNotPresent = true)
Function AddSuffixToFormNames(Form[] akForms, String Suffix, Bool OnlyIfNotPresent = true)
Function RemoveSuffixFromFormName(Form akForm, String Suffix)
Function RemoveSuffixFromFormNames(Form[] akForms, String Suffix, Bool OnlyIfNotPresent = true)
Bool Function StringHasPrefix(String s, String Prefix)
Bool Function StringHasSuffix(String s, String Suffix)
String Function GetStringFromFile(String StringKey, String FileContents = "", String FilePath = "", String StartKey = "[", String EndKey = "]", String Default = "", int StartIndex = 0)
int Function GetIntFromFile(String StringKey, String FileContents = "", String FilePath = "", String StartKey = "[", String EndKey = "]", int Default = -1, int StartIndex = 0)
Float Function GetFloatFromFile(String StringKey, String FileContents = "", String FilePath = "", String StartKey = "[", String EndKey = "]", Float Default = -1.0, int StartIndex = 0)
String[] Function GetAllStringsFromFile(String FileContents = "", String FilePath = "", String RangeStart = "", String RangeEnd = "", String StartKey = "[", String EndKey = "]", String[] Default = None)
Int[] Function GetAllIntsFromFile(String FileContents = "", String FilePath = "", String RangeStart = "", String RangeEnd = "", String StartKey = "[", String EndKey = "]", Int[] Default = None)
Float[] Function GetAllFloatsFromFile(String FileContents = "", String FilePath = "", String RangeStart = "", String RangeEnd = "", String StartKey = "[", String EndKey = "]", Float[] Default = None)
Bool Function PrintStringKeysToFile(String FilePathToSearch, String FilePathToPrintTo, String StartKey = "[", String EndKey = "]", String FinishedMsg = "Done Printing")
Function PrintContainerItemsToFile(ObjectReference akContainer, String FilePath, String ConfirmMessage = "")
Function WriteIDsInFormListToFile(Formlist akList, String FilePath, Bool IncludeNames = False, Bool ReplaceIdStartWith0x = true)
Function WriteIDsInFormArrayToFile(Form[] akList, String FilePath, Bool IncludeNames = False, Bool ReplaceIdStartWith0x = true)
Function WriteIDsInStorageUtilListToFile(Form ObjKey, String ListKeyName, String FilePath, Bool IncludeNames = False, Bool ReplaceIdStartWith0x = true)
Function WriteIDsInJsonUtilListToFile(String JsonFilePath, String ListKeyName, String FilePath, Bool IncludeNames = False, Bool ReplaceIdStartWith0x = true)
Function WriteAnimationVariableBoolsToFile(ObjectReference akRef, String OutputFilePath, String VariablesSourceFilePath = "Data/interface/DbMiscFunctions/DbAnimationVariableBools.txt")
Function WriteAnimationVariableIntsToFile(ObjectReference akRef, String OutputFilePath, String VariablesSourceFilePath = "Data/interface/DbMiscFunctions/DbAnimationVariableInts.txt")
Function WriteAnimationVariableFloatsToFile(ObjectReference akRef, String OutputFilePath, String VariablesSourceFilePath = "Data/interface/DbMiscFunctions/DbAnimationVariableFloats.txt")
Function WriteAllAnimationVariablesToFile(ObjectReference akRef, String OutputFilePath, String BoolVariablesSourceFilePath = "Data/interface/DbMiscFunctions/DbAnimationVariableBools.txt", \
                                                                                String IntVariablesSourceFilePath = "Data/interface/DbMiscFunctions/DbAnimationVariableInts.txt", \
                                                                                String FloatVariablesSourceFilePath = "Data/interface/DbMiscFunctions/DbAnimationVariableFloats.txt")

Function RegisterFormForAnimationEvents(Form akForm, ObjectReference akSender, String[] AnimationEvents)
Function RegisterAliasForAnimationEvents(Alias akAlias, ObjectReference akSender, String[] AnimationEvents)
Function RegisterActiveMagicEffectForAnimationEvents(ActiveMagicEffect akActiveMagicEffect, ObjectReference akSender, String[] AnimationEvents)
Function RegisterFormForAnimationEventsFromFile(Form akForm, ObjectReference akSender, String FilePath = "Data/interface/DbMiscFunctions/DbAnimationEvents.txt")
Function RegisterAliasForAnimationEventsFromFile(Alias akAlias, ObjectReference akSender, String FilePath = "Data/interface/DbMiscFunctions/DbAnimationEvents.txt")
Function RegisterActiveMagicEffectForAnimationEventsFromFile(ActiveMagicEffect akActiveMagicEffect, ObjectReference akSender, String FilePath = "Data/interface/DbMiscFunctions/DbAnimationEvents.txt")
Function RegisterFormForMenus(Form akForm, String[] Menus)
Function RegisterAliasForMenus(Alias akAlias, String[] Menus)
Function RegisterActiveMagicEffectForMenus(ActiveMagicEffect akActiveMagicEffect, String[] Menus)
Function RegisterFormForMenusFromFile(Form akForm, String FilePath = "Data/interface/DbMiscFunctions/DbMenus.txt")
Function RegisterAliasForMenusFromFile(Alias akAlias, String FilePath = "Data/interface/DbMiscFunctions/DbMenus.txt")
Function RegisterActiveMagicEffectForMenusFromFile(ActiveMagicEffect akActiveMagicEffect, String FilePath = "Data/interface/DbMiscFunctions/DbMenus.txt")
function WriteAllPscDataInFolderToFile(String SearchFolderPath, String TargetFilePath, String Divider = "\n", String DoneMessage = "Done Writing")
String Function GetPscEventNamesFromFile(String SourceFilePath, String Divider = "\n", int StartIndex = 0)
String Function GetPscFunctionNamesFromFile(String SourceFilePath, String Divider = "\n", int StartIndex = 0)
String Function GetPscDataNamesFromFile(String SourceFilePath, String NameType, String Divider = "\n", int StartIndex = 0)
String Function GetPscEventDefinitionsFromFile(String SourceFilePath, String Divider = "\n", int StartIndex = 0)
String Function GetPscFunctionDefinitionsFromFile(String SourceFilePath, String Divider = "\n", int StartIndex = 0)

String Function GetPscDataDefinitionsFromFile(String SourceFilePath, String NameType, String Divider = "\n", int StartIndex = 0)

Function WriteJsonSaveAndLoadFunctionsToFile(String SourceFilePath, String DestinationFilePath = "", \
    Bool GlobalVariablesToggle = true, Bool FloatsToggle = true, Bool StringsToggle = true, Bool IntsToggle = true, Bool BoolsToggle = true, \
    Bool GlobalVariableArraysToggle = true, Bool FloatArraysToggle = true, Bool StringArraysToggle = true, Bool IntArraysToggle = true, Bool BoolArraysToggle = true, \
    int Messages = 0, String ConfirmMessage = "Done Writing Json Functions", Bool UsePropertiesAsDefaults = True)
    
Function WriteDynamicArrayState(Int i)
/; 

;bool function IsIndexInBlockComment(string s, int index, string blockCommentStart = ";/", string blockCommentEnd = "/;") 



;Like MoveTo, but can specifify local angle / distance offset.
;If angle == 0.0, moves object in front of CenterRef by Distance
;If angle == 90.0 moves object the right of CenterRef by Distance
;If angle == -90, moves object to the left of centerRef  by Distance
;If angle == 180, moves object behind centerRef by Distance ect.
;Example: MoveToLocalOffset(MyRef, Game.GetPlayer(), 90.0, 500.0) moves MyRef 500 units to the right of the player.
;No requirements
Function MoveToLocalOffset(ObjectReference RefToMove, ObjectReference CenterRef, Float Angle, Float Distance, float afZOffset = 0.0, bool abMatchRotation = true) global  
    Guard()
EndFunction  

;PlaceAtMe but moves placed ref using MoveToLocalOffset function. PlaceAtMeRef is centerRef, new placed ref is RefToMove.
ObjectReference Function PlaceAndMoveToLocalOffset(ObjectReference PlaceAtMeRef, Form akFormToPlace, int aiCount = 1, bool abForcePersist = false, bool abInitiallyDisabled = false, \
Float Angle = 0.0, Float Distance = 100.0, float afZOffset = 0.0, bool abMatchRotation = true) global
    Guard()
Endfunction

;Apply Havok Impulse from left / right angle + Z direction. No requirements.
;Examples: 
;ApplyHavokImpulseLocal(MyRef, 0, 5, 10) applies havok impulse so the ref flies forward and up 
;ApplyHavokImpulseLocal(MyRef, 90, -5, 10) applies havok impulse so the ref flies to the right and down 
Function ApplyHavokImpulseLocal(ObjectReference Ref, Float Angle, float afZ, Float afMagnitude) Global
    Guard()
EndFunction 

;Get the full Version Text displayed in the journal menu e.g "1.5.97.0.8 (SKSE64 2.0.20 rel 65)"
;The Journal Menu system page must be open for this function to work. 
;Use RegisterForMenu("Journal Menu") and the OnMenuOpen event to ensure the Journal Menu is open.
;Or, if your mod has an MCM, this will work when the MCM Menu is open, so use OnConfigOpen in your MCM script. 
;requires skse
String Function GetSkyrimVersionFullString() Global
    Guard()
EndFunction

;Get the Skyrim Version Text displayed in the journal menu, e.g "1.5.97"
;The Journal Menu system page must be open for this function to work. 
;Use RegisterForMenu("Journal Menu") and the OnMenuOpen event to ensure the Journal Menu is open.
;Or, if your mod has an MCM, this will work when the MCM Menu is open, so use OnConfigOpen in your MCM script. 
;requires skse
String Function GetSkyrimVersion() Global
    Guard()
EndFunction

;requires skse
String Function GetSKSEVersion() Global
    Guard()
EndFunction 

;show or hide creation kit markers in Game 
;If ShowMarkers == true, shows them, otherwise hides them.
;If moveToRef == None (default), moves player to either whiterun or markarth fast travel markers.
;Must move player to new area after changing bShowMarkers ini so cells reload to display markers.
;no requirements 
Bool Function ToggleCreationKitMarkers(Bool ShowMarkers = true, ObjectReference MoveToRef = none) Global
    Guard()
EndFunction

;create new xMarker ObjectReference 
;if PlaceAtMeRef == none (default) places new marker at the player.
;no requirements
ObjectReference Function CreateXMarkerRef(Bool PersistentRef = false, ObjectReference PlaceAtMeRef = none) Global
    Guard()
EndFunction 

;unequip all items on actor with delay in between. 
;requires skse and po3's papyrus extender
Function UnequipAllItems(Actor akActor, bool abPreventEquip = false, bool abSilent = true, float delay = 0.1) Global
    Guard()
EndFunction

;remove all items from ref which must be a container or actor to optional otherContainer
;requires skse and papyrus extender and SSE 
;use Form[] Items = PO3_SKSEFunctions.AddAllInventoryItemsToArray(Ref, abNoEquipped, abNoFavorited, abNoQuestItem) for LE
Function RemoveAllItems(ObjectReference Ref, ObjectReference otherContainer = none, bool abSilent = true, float delay = 0.01, \
                        bool abNoEquipped = false, bool abNoFavorited = false, bool abNoQuestItem = true) Global
    Guard()
EndFunction

;Drop all items from ref, Ref must be a container or actor.
;If dropIndividual is true, drops multiple of the same item time individually so they don't stack. If false, items are dropped stacked. 
;Requires SKSE
Function DropAllItems(ObjectReference Ref, bool dropIndividual = false, float delay = 0.01) Global
    Guard()
EndFunction

;Like DropAllItems except uses Papyrus Extender to filter items.
;Requires skse and Papyrus Extender
;Commented out for disparity between LE and SE
;Function DropAllItems_P03(ObjectReference Ref, bool noEquipped = true, bool noFavourited = false, bool noQuestItem = false, bool dropIndividual = false, float delay = 0.01) Global
;    Form[] Items = PO3_SKSEFunctions.AddAllItemsToArray(Ref, noEquipped, noFavourited, noQuestItem) ;for SE
;    Form[] Items = PO3_SKSEFunctions.AddAllInventoryItemsToArray(Ref, noEquipped, noFavourited, noQuestItem) ;for LE
;    Int i = Items.length 
;    
;    If !dropIndividual 
;        While i > 0 
;            i -= 1
;            Form akForm = Items[i]
;            If akForm 
;                Ref.DropObject(akForm, ref.GetItemCount(akForm))
;                Utility.WaitMenuMode(delay)
;            Endif 
;        EndWhile
;    Else 
;         While i > 0 
;            i -= 1
;            Form akForm = Items[i]
;            If akForm 
;                DropIndividualItems(Ref, akForm, 0, delay)
;            Endif 
;         EndWhile
;    Endif
;EndFunction

;Drop the NumofItems from ref individually so they don't stack.
;If NumofItems == 0, drops all of the item from ref.
;No requirements
Function DropIndividualItems(ObjectReference Ref, Form Item, int NumOfItems = 0, float delay = 0.01) Global
    Guard()
EndFunction

Function MovePlayerTo(ObjectReference Ref)
    
EndFunction

;add shout to player if necessary and unlock all words of power.
;requires skse
Function UnlockShout(shout akShout) Global
    Guard()
EndFunction

;requires skse
Function UnlockEquippedShout() Global
    Guard()
EndFunction

;check if location or any of it's parents has the keyword 
;Requires Papyrus Extender && SKSE
Bool Function LocationOrParentsHasKeyword(Location akLocation, Keyword akKeyword) global
    Guard()
EndFunction

;no requirements.
string Function GetStringIfNull(string s, string nullString = "null") Global
    Guard()
EndFunction

;requires skse. Get name of form. Checks for ObjectReference. return default nullString if not found.
string Function GetFormName(Form akForm, string nullString = "null", string NoNameString = "no name") Global
    Guard()
EndFunction

;Returns true if the Mod has at least 1 form of type
;Requires papyrus extender and skse
Bool Function ModHasFormType(String modName, int type) global
    Guard()
EndFunction

;Like HasKeywordString but returns true if multiple esp's have keyWords with the same name added.
;Requires SKSE
Bool Function akFormHasKeywordString(Form akForm, String akString)  global
    Guard()
EndFunction

;If AllKeywords == false (default) returns true if the akForm has any keyword in the akList formlist. 
;If allKeywords == true, only returns true if the akForm has all keywords in the akList. 
;No requirements
Bool Function FormHasKeywordInFormList(Form akForm, Formlist akList, Bool AllKeywords = False) Global 
    Guard()
EndFunction

;If AllKeywords == false (default) returns true if the akForm has any keyword in the akList array. 
;If allKeywords == true, only returns true if the akForm has all keywords in the akList. 
;No requirements
Bool Function FormHasKeywordInArray(Form akForm, Keyword[] akList, Bool AllKeywords = False) Global
    Guard()
EndFunction

;If AllKeywords == false (default) returns true if the akForm has any keyword in the StorageUtil Form list. 
;If allKeywords == true, only returns true if the akForm has all keywords in the List. 
;Requires skse and PapyrusUtil
Bool Function FormHasKeywordInStorageUtilList(Form akForm, Form ObjKey, String ListKeyName, Bool AllKeywords = False) Global
    Guard()
EndFunction

;If AllKeywords == false (default) returns true if the akForm has any keyword in the JsonUtil Form list. 
;If allKeywords == true, only returns true if the akForm has all keywords in the List. 
;Requires skse and PapyrusUtil
Bool Function FormHasKeywordInJsonUtilList(Form akForm, String JsonFilePath, String ListKeyName, Bool AllKeywords = False) Global
    Guard()
EndFunction

;Requires SKSE
Bool Function IsNumber(String akString, Bool AllowForDecimals = True, Bool AllowNegativeNumbers = True) global
    Guard()
EndFunction     

Int Function ClampInt(Int i, Int Min, Int Max) Global
    Guard()
EndFunction 

Float Function ClampFloat(Float f, Float Min, Float Max) Global
    Guard()
EndFunction

Bool Function IsIntInRange(Int I, Int Min, Int Max) Global
    Guard()
EndFunction

Bool Function IsFloatInRange(Float f, Float Min, Float Max) Global 
    Guard()
EndFunction

;is the index in string s between the StartKey and EndKey.
;Example: 
;String s = "() (Some String)"
;Bool b = DbMiscFunctions.IsStringIndexBetween(s, 4, "(", ")") ;true
;Bool bb = DbMiscFunctions.IsStringIndexBetween(s, 2, "(", ")") ;false
;Bool bbb = DbMiscFunctions.IsStringIndexBetween(s, 0, "(", ")") ;false
;requires skse
Bool Function IsStringIndexBetween(String s, Int Index, String StartKey, String EndKey) Global
    Guard()
EndFunction

;requires skse. Convert int to hex string.
;if result string length is less than minDigits,
;adds 0's to the start for positive numbers, or f's to the start for negative numbers.
;default is 8 (for form IDs)
String function ConvertIntToHex(int i, int minDigits = 8) Global
    Guard()
EndFunction

;requires skse
;If TreatAsNegative == true, returns hex as negative number. 
;Example: 
;ConvertHexToInt("FD4", true) returns -44 
;ConvertHexToInt("FD4", false) returns 4052 
;Note that if the hex is 8 digits in length (such as form IDs) and starts with "F" it is always treated as negative natively by papyrus. 
Int function ConvertHexToInt(string hex, Bool TreatAsNegative = false) global
    Guard()
Endfunction

;For convenience. Returns the akForm ID as a hex string.
;requires SKSE. 
String Function GetFormIDHex(Form akForm) Global
    Guard()
EndFunction

;like Math.Pow, calculates x to the y power, but uses only integers which is more accurate if not needing floats.
;Only works for positive y values.
Int Function IntPow(Int x, Int y) Global
    Guard()
EndFunction

;returns floor of the square root of i.
Int Function IntSqrt(Int i) Global 
    Guard()
EndFunction

;returns absolute value of i.
Int Function IntAbs(Int i) Global 
    Guard()
EndFunction

;rounds the float input and returns int
;5.4 returns 5
;5.5 returns 6
int function RoundAsInt(Float f) Global
    Guard()
Endfunction

;rounds the float input and returns float
;5.4 returns 5.0
;5.5 returns 6.0
float function RoundAsFloat(Float f) Global
    Guard()
Endfunction

;rounds the float down to the specified decimal places
;Example: 
;RoundDownToDec(1.2345, 2) returns 1.23 
;RoundDownToDec(4.5678, 3) return 4.567
;not 100% accurate, limited by string as float conversion. 
;Example: RoundDownToDec(100.78945, 2) returns 100.779999999
Float Function RoundDownToDec(Float f, Int DecimalPlaces = 0) Global 
    Guard()
Endfunction 

;Same as RoundDownToDec but returns string instead of float. In this case RoundDownToDecString(100.78945, 2) returns "100.78"
String Function RoundDownToDecString(Float f, Int DecimalPlaces = 0) Global 
    Guard()
Endfunction 

;requires skse
Int Function CountDecimalPlaces(Float f) Global
    Guard()
EndFunction
    
;requires SKSE. Splits string by divider and returns as float array.
Float[] Function SplitAsFloat(String s, int Max = -1, String Divider = "||") Global
    Guard()
EndFunction

;requires SKSE. Splits string by divider and returns as int array.
Int[] Function SplitAsInt(String s, int Max = -1, String Divider = "||") Global
    Guard()
EndFunction

;Sort========================================================================================
;if Direct == true, sorts the passed in akArray directly
;if Direct == false, Passed in array is unaffected and returns new array (that is akArray sorted). 
;if Direct == false requires skse to create the new array.
String[] Function SortStringArray(String[] akArray, Bool Ascending = true, Bool Direct = true) Global
    Guard()
EndFunction

;requires skse.
String[] Function CopyStringArray(String[] akArray) Global
    Guard()
EndFunction

;Opposite of StringUtil.Split. Convert string array to single string, elements separated by divider.
;If IgnoreDuplicates == true, only adds an element to the string once
String Function JoinStringArray(String[] akArray, String Divider = "||", Bool IgnoreDuplicates = false) Global
    Guard()
EndFunction

;If IgnoreDuplicates == true, only adds an element to the string once
String Function JoinFloatArray(Float[] akArray, String Divider = "||", Bool IgnoreDuplicates = false) Global
    Guard()
EndFunction

;If IgnoreDuplicates == true, only adds an element to the string once
String Function JoinIntArray(Int[] akArray, String Divider = "||", Bool IgnoreDuplicates = false) Global
    Guard()
EndFunction

;These print functions are for convenience 
;Allows to trace / messagebox / notification / write to file multiple strings (up to 20) seperated by the divider
;Normally you would have to write, for instance:
;Debug.MessageBox("Player stats: " + PlayerRef.GetAv("OneHanded") + " " + PlayerRef.GetAv("OneHanded") + " " + PlayerRef.GetAv("Marksman")) ;ect...
;With PrintM you can write 
;DbMiscFunctions.PrintM("Player stats:", PlayerRef.GetAv("OneHanded"), PlayerRef.GetAv("OneHanded"), PlayerRef.GetAv("Marksman")) ;ect...

;Trace
;No requirements. 
Function PrintT(String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ", int aiSeverity = 0) Global
    Guard()
Endfunction

;TraceUser
;No requirements. 
Function PrintTU(string asUserLog = "", String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ", int aiSeverity = 0) Global
    Guard()
Endfunction

;Notification
;No requirements. 
Function PrintN(String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ") Global
    Guard()
Endfunction

;MessageBox
;No requirements. 
Function PrintM(String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ") Global
    Guard()
Endfunction

;ExtendedVanillaMenus.MessageBox
;requires ExtendedVanillaMenus and skse
Function PrintEvm(String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ") Global
    Guard()
Endfunction

;WriteToFile
;requires PapyrusUtil and skse
Function PrintF(String FilePath, String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ") Global
    Guard()
Endfunction

;Join up to 20 strings into a single string seperated by the Divider
;Stops joining at the first empty "" string it finds. 
;no requirements
String Function JoinStrings(String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ") Global
    Guard()
EndFunction

;Join all 20 strings into a single string seperated by the Divider
;no requirements
String Function JoinAllStrings(String s1 = "", String s2 = "", String s3 = "", String s4 = "", String s5 = "", String s6 = "", String s7 = "", String s8 = "", String s9 = "", String s10 = "", \
String s11 = "", String s12 = "", String s13 = "", String s14 = "", String s15 = "", String s16 = "", String s17 = "", String s18 = "", String s19 = "", String s20 = "", String Divider = " ") Global
    Guard()
EndFunction

;get the current screen resolution. 
;[0] = X or width
;[1] = Y or height
;requires skse
int[] Function GetScreenResolution() Global
    Guard()
EndFunction

;Get game settings for soul levels
;no requirements
Int[] Function GetGameActorSoulLevels() Global
    Guard()
EndFunction

;Get game setting soul level names
;no requirements
String[] Function GetGameSoulLevelNames() Global
    Guard()
EndFunction

;Get the actor soul size. 0 = petty, 1 = lesser, 2 = Common, 3 = Greater, 4 = Grand, 5 = Black (for NPCs)
;No requirements
Int Function GetActorSoulSize(Actor akActor) Global 
    Guard()
EndFunction 

;Get actor soul size as string.
;no requirements
String Function GetActorSoulSizeString(Actor akActor, String sBlackSize = "Black") Global
    Guard()
EndFunction 

;the IsEquipped function doesn't work for spells, hence the need for this function.
;no requirements
Bool Function ActorHasFormEquiped(Actor akActor, Form akForm) global 
    Guard()
EndFunction

;requires skse and DbSkseFunctions.psc version 6.7 or greater
Bool function CanInteractWith(ObjectReference ref, bool checkAshPile = true) global 
    Guard()
EndFunction

;Is the akActor an NPC? 
;no requirements
Bool Function IsActorNPC(Actor akActor) Global
    Guard()
EndFunction

;Returns true if akActor is moving. 
;I've only tested on NPC humanoid actors. Not sure if it works for other types.
;No requirements
Bool Function IsActorMoving(Actor akActor) Global 
    Guard()
EndFunction



;Get random form from Ref's inventory.  
;If TypeArrayFilter != none, filters for form types in TypeArrayFilter. If TypeFilterHasType == true (default) only allows for types in the TypeArrayFilter. If false, only allows for types NOT in the TypeArrayFilter.
;If ListFilter != none, filters for base forms in the ListFilter formlist. If akListHasForm == true (default) only allows for forms in the ListFilter formlist. If false, only allows for forms NOT in the formlist. 
;Requires SKSE
Form Function GetRandomFormFromRef(ObjectReference Ref, Int[] TypeArrayFilter = None, Formlist ListFilter = None, Bool TypeFilterHasType = true, Bool akListHasForm = true) Global
    Guard()
EndFunction

;Get random form from Ref's inventory.  
;If TypeArrayFilter != none, filters for form types in TypeArrayFilter. If TypeFilterHasType == true (default) only allows for types in the TypeArrayFilter. If false, only allows for types NOT in the TypeArrayFilter.
;If ListFilter != none, filters for base forms in the ListFilter form array. If akListHasForm == true (default) only allows for forms in the ListFilter form array. If false, only allows for forms NOT in the form array. 
;Requires SKSE
Form Function GetRandomFormFromRefA(ObjectReference Ref, Int[] TypeArrayFilter = None, Form[] ListFilter = None, Bool TypeFilterHasType = true, Bool akListHasForm = true) Global
    Guard()
EndFunction 

;Get random form from Ref's inventory.  
;If TypeArrayFilter != none, filters for form types in TypeArrayFilter. If TypeFilterHasType == true (default) only allows for types in the TypeArrayFilter. If false, only allows for types NOT in the TypeArrayFilter.
;If ListKeyName != none, filters for base forms in the StorageUtil Formlist defined by the ObjKey and ListKeyName. If akListHasForm == true (default) only allows for forms in the StorageUtil Formlist. If false, only allows for forms NOT in the StorageUtil Formlist. 
;Requires SKSE and PapyrusUtil
Form Function GetRandomFormFromRefS(ObjectReference Ref, Int[] TypeArrayFilter = None, Form ObjKey = None, String ListKeyName = "", Bool TypeFilterHasType = true, Bool akListHasForm = true) Global
    Guard()
EndFunction

;Get random form from Ref's inventory.  
;If TypeArrayFilter != none, filters for form types in TypeArrayFilter. If TypeFilterHasType == true (default) only allows for types in the TypeArrayFilter. If false, only allows for types NOT in the TypeArrayFilter.
;If JsonFilePath != none && ListKeyName != none, filters for base forms in the JsonUtil Formlist defined by the JsonFilePath and ListKeyName. If akListHasForm == true (default) only allows for forms in the JsonUtil Formlist. If false, only allows for forms NOT in the JsonUtil Formlist. 
;Requires SKSE and PapyrusUtil.
Form Function GetRandomFormFromRefJ(ObjectReference Ref, Int[] TypeArrayFilter = None, String JsonFilePath = "", String ListKeyName = "", Bool TypeFilterHasType = true, Bool akListHasForm = true) Global
    Guard()
EndFunction

;requires skse. Sort Actors in akArray by their display name.
Function SortActorArrayByName(Actor[] akArray, Bool Ascending = true) Global
    Guard()
EndFunction

;requires skse. Sort ObjectReferences in akArray by their display name.
Function SortObjectRefArrayByName(ObjectReference[] akArray, Bool Ascending = true) Global
    Guard()
EndFunction 

;requires skse. Sort Forms in akArray by their name.
Function SortFormArrayByName(Form[] akArray, Bool Ascending = true) Global
    Guard()
EndFunction 

;requires skse, put all actor names of actors in akArray to a string array and return.
String[] Function GetActorNames(Actor[] akArray) Global
    Guard()
EndFunction 

;requires skse, put all ObjectReference names of ObjectReferences in akArray to a string array and return.
String[] Function GetObjectRefNames(ObjectReference[] akArray) Global
    Guard()
EndFunction 

;requires skse, put all Form names of Forms in akArray to a string array and return.
String[] Function GetFormNames(Form[] akArray) Global
    Guard()
EndFunction 

;requires skse, put all Form names of Forms in akList to a string array and return.
String[] Function GetFormNamesFromList(Formlist akList) Global
    Guard()
EndFunction 

;requires skse, put all Form names of Forms in akList to a single string seperated by divider. Default new line.
String Function FormNamesInFormListToString(Formlist akList, string divider = "\n", string nullName = "null") Global
    Guard()
EndFunction 

;Requires skse. Add all forms in akList to new form array.
Form[] Function FormlistToArray(Formlist akList) Global 
    Guard()
EndFunction

;Add all forms in akArray to akList
Function AddFormArrayFormsToList(Form[] akArray, Formlist akList) Global
    Guard()
EndFunction 

;no requirements
float function SecondsToMinutes(float seconds) Global
    Guard()
EndFunction 

;no requirements
float function SecondsToHours(float seconds) Global
    Guard()
EndFunction

;no requirements
float function MinutesToSeconds(float minutes) Global
    Guard()
EndFunction 

;no requirements
float function MinutesToHours(float minutes) Global
    Guard()
EndFunction

;no requirements
float function HoursToSeconds(float Hours) Global
    Guard()
EndFunction

;no requirements
float function HoursToMinutes(float Hours) Global
    Guard()
EndFunction

float function GetRealSecondsPassed() Global
    Guard()
EndFunction

float function GetRealMinutesPassed() Global
    Guard()
EndFunction

;wait while the keyCode is pressed. 
;If the key is released before the secondsToWait time has elapsed, returns false. 
;If the secondsToWait time elapses and the keyCode is still pressed, returns true. 
;Requires skse
Bool Function WaitWhileKeyIsPressed(int keyCode, float secondsToWait) Global
    Guard()
EndFunction 

;Like WaitWhileKeyIsPressed but this is an interval wait version.
;Wait while the keyCode is pressed.
;Returns true if the entire waitCount finishes. 
;Returns false if the key was released before the waitCount is finished. 
;The wait interval should be a small value (default is 0.01) for this function to be accurate. 
;Requires skse
Bool Function WaitWhileKeyIsPressed_interval(int keyCode, int waitCount, float waitInterval = 0.01) Global
    Guard()
Endfunction

;requires skse, register for all keys between min and max. Default is 1 to 281, or all keys.
Function RegisterFormForKeys(Form akForm, Int min = 1, Int Max = 281) Global
    Guard()
EndFunction 

Function RegisterAliasForKeys(Alias akAlias, Int min = 1, Int Max = 281) Global
    Guard()
EndFunction 

Function RegisterActiveMagicEffectForKeys(ActiveMagicEffect akActiveMagicEffect, Int min = 1, Int Max = 281) Global
    Guard()
EndFunction     

;requires skse
int[] function GetAllKeysPressed() Global
    Guard()
EndFunction

;Are all the hotkeys pressed? 
;If onlyTheseKeys is true, (default), returns true only if all the hotkeys are pressed and no other keys are pressed.
;requires skse.
Bool Function HotkeysPressed(int[] hotkeys, bool onlyTheseKeys = true) Global
    Guard()
EndFunction

;Swap============================================================================== 
;Swap the element at IndexA with the element at IndexB in the akArray 
;The V functions (V for validate) will first clamp the indexes between 0 and the last available index in the akArray first before swapping.
;If you know for sure that the indexes are in bounds, use Swap as it's faster. If you don't know for sure, use SwapV or you might get none entries.
Function SwapStrings(String[] akArray, Int IndexA, Int IndexB) Global
    Guard()
EndFunction

Function SwapStringsV(String[] akArray, Int IndexA, Int IndexB) Global ;validate indexes first.
    Guard()
EndFunction

Function SwapBools(Bool[] akArray, Int IndexA, Int IndexB) Global
    Guard()
EndFunction

Function SwapBoolsV(Bool[] akArray, Int IndexA, Int IndexB) Global ;validate indexes first.
    Guard()
EndFunction

Function SwapInts(Int[] akArray, Int IndexA, Int IndexB) Global
    Guard()
EndFunction

Function SwapIntsV(Int[] akArray, Int IndexA, Int IndexB) Global ;validate indexes first.
    Guard()
EndFunction

Function SwapFloats(Float[] akArray, Int IndexA, Int IndexB) Global
    Guard()
EndFunction

Function SwapFloatsV(Float[] akArray, Int IndexA, Int IndexB) Global ;validate indexes first.
    Guard()
EndFunction

Function SwapActors(Actor[] akArray, Int IndexA, Int IndexB) Global
    Guard()
EndFunction

Function SwapActorsV(Actor[] akArray, Int IndexA, Int IndexB) Global ;validate indexes first.
    Guard()
EndFunction

Function SwapObjectReferences(ObjectReference[] akArray, Int IndexA, Int IndexB) Global
    Guard()
EndFunction

Function SwapObjectReferencesV(ObjectReference[] akArray, Int IndexA, Int IndexB) Global ;validate indexes first.
    Guard()
EndFunction

Function SwapForms(Form[] akArray, Int IndexA, Int IndexB) Global
    Guard()
EndFunction

Function SwapFormsV(Form[] akArray, Int IndexA, Int IndexB) Global ;validate indexes first.
    Guard()
EndFunction 
;============================================================================================ 

;================================================================================================
;JsonUtil functions, included in StorageUtil but missing from JsonUtil. Requires PapyrusUtil
;the default value is returned if unable to remove element from the json list.

;/ Plucks a value from list by index
   The index is removed from the list's storage after returning it's value.

   FileName: file to pluck value from.
   KeyName: name of list.
   index: index of value in the list.
   [optional] default: if unable to remove element from the json list, return this value instead.
/;

int function JsonIntListPluck(string FileName, string KeyName, int index, int default = 0) global 
    Guard()
EndFunction 

Float function JsonFloatListPluck(string FileName, string KeyName, int index, Float default = 0.0) global 
    Guard()
EndFunction 

string function JsonStringListPluck(string FileName, string KeyName, int index, string default = "") global 
    Guard()
EndFunction 

Form function JsonFormListPluck(String FileName, String KeyName, int index, Form default = none) global 
    Guard()
EndFunction 

;/ Gets the value of the very first element in a list, and subsequently removes the index afterward.

   FileName: file to shift value from.
   KeyName: name of list.
   [optional] default: if unable to remove element from the json list, return this value instead.
/;

int function JsonintListShift(string FileName, string KeyName, int default = 0) global 
    Guard()
EndFunction 

Float function JsonFloatListShift(string FileName, string KeyName, Float default = 0.0) global 
    Guard()
EndFunction 

String function JsonStringListShift(string FileName, string KeyName, String default = "") global 
    Guard()
EndFunction 

Form function JsonFormListShift(string FileName, string KeyName, Form default = none) global 
    Guard()
EndFunction 

;/ Gets the value of the very last element in a list, and subsequently removes the index afterward.

   FileName: file to pop value from.
   KeyName: name of list.
   [optional] default: if unable to remove element from the json list, return this value instead.
/;

Int function JsonIntListPop(string FileName, string KeyName, Int default = 0) global 
    Guard()
EndFunction  

Float function JsonFloatListPop(string FileName, string KeyName, Float default = 0.0) global 
    Guard()
EndFunction  

String function JsonStringListPop(string FileName, string KeyName, String default = "") global 
    Guard()
EndFunction  

Form function JsonFormListPop(string FileName, string KeyName, Form default = none) global 
    Guard()
EndFunction  

;remove all duplicates in Json int / float / string / form lists, leaving only 1 of each element in the list.
;If asceding == true (default) removes duplicate entries from the start of the list first, 
;Else removes duplicates from end of list first. ======================================================================================
Function JsonIntListRemoveAllDuplicates(string FileName, string KeyName, Bool Acending = True) Global
    Guard()
EndFunction

Function JsonFloatListRemoveAllDuplicates(String FileName, String KeyName, Bool Acending = True) Global
    Guard()
EndFunction

Function JsonStringListRemoveAllDuplicates(string FileName, string KeyName, Bool Acending = True) Global
    Guard()
EndFunction

Function JsonFormListRemoveAllDuplicates(String FileName, String KeyName, Bool Acending = True) Global
    Guard()
EndFunction

;Opposite of String.Split() 
;Join all elements in Json Int List to a single string seperated by divider. =================================================================================
String Function JsonJoinIntList(string FileName, string KeyName, string Divider = "||") Global
    Guard()
EndFunction

String Function JsonJoinFloatList(string FileName, string KeyName, string Divider = "||") Global
    Guard()
EndFunction

String Function JsonJoinStringList(string FileName, string KeyName, string Divider = "||") Global
    Guard()
EndFunction

;============================================================================================================================================================

;============================================================================================================

;requires skse and papyrusUtil. Get the string for a form type int. 
;Exampe: FormTypeToString(SomeMiscObj.GetType()) returns "Misc"
;can specify another file other than "Data/interface/DbFormTypeStrings.txt" if desired
String Function GetFormTypeString(Int Type, String sFilePath = "Data/interface/DbMiscFunctions/DbFormTypeStrings.txt") Global
    Guard()
EndFunction

;requires skse and papyrusUtil. 
;Get form type strings within a range.
String[] Function GetFormTypeStrings(String sFilePath = "Data/interface/DbMiscFunctions/DbFormTypeStrings.txt", int startIndex = 0, int endIndex = 134)
    Guard()
EndFunction

;requires skse and papyrusUtil. Get the string for keycode. 
;Exampe: GetKeyCodeString(28) returns "Enter"
;can specify another file other than "Data/interface/DbKeyCodeStrings.txt" if desired
String Function GetKeyCodeString(Int keyCode, String sFilePath = "Data/interface/DbMiscFunctions/DbKeyCodeStrings.txt") Global
    Guard()
EndFunction

;requires skse
String Function GetKeyCodeStrings(int[] keys, string startBracket = "[", string endBracket = "]", string divider = "\n", bool includeInts = true) Global
    Guard()
EndFunction 

;requires skse
String[] Function GetKeyCodeStringsInRange(int minKey = 1, int maxKey = 281, string startBracket = "[", string endBracket = "]", bool includeInts = true) Global
    Guard()
EndFunction

;Return mod name string that the FormID comes from. e.g "Skyrim.esm"
;assumes FormID is 8 digits long.
;Requires skse
String Function GetModOriginFromHexID(string FormID) Global
    Guard()
EndFunction

;Return mod name string that the akForm comes from. e.g "Skyrim.esm"
;Requires skse
String Function GetModOriginName(Form akForm) Global
    Guard()
EndFunction

;get common form types without SKSE =======================================================================
;These functions mimic the main Categories in the creation kit.
;GetActorFormType corresponds to the Actor category. GetAudioFormType corresponds to the Audo category ect.
;Note, can pass in ObjectReference's and it will auto get baseObject and return type.
int Function GetActorFormType(Form F) Global
    Guard()
EndFunction

int Function GetAudioFormType(Form F) Global
    Guard()
EndFunction 

int Function GetCharacterFormType(Form F) Global
    Guard()
EndFunction

int Function GetItemFormType(Form F) Global
    Guard()
EndFunction

int Function GetMagicFormType(Form F) Global
    Guard()
EndFunction

int Function GetMiscFormType(Form F) Global
    Guard()
EndFunction

int Function GetSpecialEffectFormType(Form F) Global
    Guard()
EndFunction 

int Function GetWorldDataFormType(Form F) Global
    Guard()
EndFunction 

int Function GetWorldObjectFormType(Form F) Global
    Guard()
EndFunction 

;for base item types in player inventory
int Function GetInventoryItemFormType(Form F) Global
    Guard()
EndFunction 


;includes all of the above form types
Int Function GetFormTypeAll(Form F) Global
    Guard()
EndFunction 

;Same as above but returns strings instead of ints==============================================================================
;If TypeStrings == none, returns the ScriptName of type. Can pass in string array to return different strings for translations. 
String Function GetActorFormTypeString(Form F, String[] TypeStrings = none) Global
    Guard()
EndFunction

String Function GetAudioFormTypeString(Form F, String[] TypeStrings = none) Global
    Guard()
EndFunction 

String Function GetCharacterFormTypeString(Form F, String[] TypeStrings = none) Global
    Guard()
EndFunction

String Function GetItemFormTypeString(Form F, String[] TypeStrings = none) Global
    Guard()
EndFunction

String Function GetMagicFormTypeString(Form F, String[] TypeStrings = none) Global
    Guard()
EndFunction

String Function GetMiscFormTypeString(Form F, String[] TypeStrings = none) Global
    Guard()
EndFunction

String Function GetSpecialEffectFormTypeString(Form F, String[] TypeStrings = none) Global
    Guard()
EndFunction 

String Function GetWorldDataFormTypeString(Form F, String[] TypeStrings = none) Global
    Guard()
EndFunction 

String Function GetWorldObjectFormTypeString(Form F, String[] TypeStrings = none) Global
    Guard()
EndFunction 

;for base item types in player inventory
string Function GetInventoryItemFormTypeString(Form F, String[] TypeStrings = none) Global
    Guard()
EndFunction 

;includes all of the above types.
string Function GetFormTypeStringAll(Form F, String[] TypeStrings = none) Global
    Guard()
EndFunction 
;=====================================================================

;Useful for force closing the inventory menu, or forcing the player to sheathe their weapon. 
;No requirements
Function DisableThenEnablePlayerControls(Float Delay = 1.0) Global
    Guard()
EndFunction

;add and remove akForm from actor silently. 
;This is useful for instance after changing an actors speed via akActor.SetAv("SpeedMult", 110)
;Or after changing armor model paths, or on the player after changing item names if in the inventory or container menu, will display visually the name change. 
;No requirements
Function UpdateActor(Actor akActor, Form akForm) Global
    Guard()
EndFunction 

;used to update menus while they are open. 
;Example, changing a map marker property (name, icon or visibility) while the map menu is open
function refreshMenus() Global
    Guard()
EndFunction

;requires SKSE and Papyrus Extender 
;swap all worn equipment between actor A and B.
Function SwapEquipment(Actor A, Actor B) Global
    Guard()
EndFunction

;Set all ActorValues to Values on akActor 
;no requirements
Function SetActorValues(Actor akActor, String[] ActorValues, Float[] Values) Global
    Guard()
EndFunction

;Mod all ActorValues with Values on akActor 
;no requirements
Function ModActorValues(Actor akActor, String[] ActorValues, Float[] Values) Global
    Guard()
EndFunction

;return all actor values in ActorValueStrings to float array. 
;if DArrays == none, requires skse. Can pass in DynamicArrays form to not use skse.
Float[] Function GetActorValues(Actor akActor, String[] ActorValues, DynamicArrays DArrays = none) Global
    Guard()
EndFunction

;same as GetActorValues but returns for instance "Health = 100.0" in string array instead of float values
;if ActorValueStrings == none, uses ActorValues for strings. 
;can specify ActorValueStrings for translations. Indexes in ActorValues and ActorValuesStrings should match.
;if DArrays == none, requires skse. Can pass in DynamicArrays form to not use skse.
String[] Function GetActorValueStrings(Actor akActor, String[] ActorValues, String[] ActorValueStrings = none, DynamicArrays DArrays = none) Global
    Guard()
EndFunction

;same as GetActorValueStrings but puts all values in a single string divided by Divider.
;if ActorValueStrings == none, uses ActorValues for strings. 
;can specify ActorValueStrings for translations. Indexes in ActorValues and ActorValuesStrings should match.
;no requirements
String Function sGetActorValueStrings(Actor akActor, String[] ActorValues, String[] ActorValueStrings = none, String Divider = "||") Global
    Guard()
EndFunction

;return all Base actor values in ActorValueStrings to float array. 
;if DArrays == none, requires skse. Can pass in DynamicArrays form to not use skse.
Float[] Function GetBaseActorValues(Actor akActor, String[] ActorValues, DynamicArrays DArrays = none) Global
    Guard()
EndFunction

;same as GetBaseActorValues but returns for instance "Health = 100.0" in string array instead of float values
;if ActorValueStrings == none, uses ActorValues for strings. 
;can specify ActorValueStrings for translations. Indexes in ActorValues and ActorValuesStrings should match.
;if DArrays == none, requires skse. Can pass in DynamicArrays form to not use skse.
String[] Function GetBaseActorValueStrings(Actor akActor, String[] ActorValues, String[] ActorValueStrings = none, DynamicArrays DArrays = none) Global
    Guard()
EndFunction

;same as GetBaseActorValueStrings but puts all values in a single string divided by Divider.
;if ActorValueStrings == none, uses ActorValues for strings. 
;can specify ActorValueStrings for translations. Indexes in ActorValues and ActorValuesStrings should match.
;no requirements
String Function sGetBaseActorValueStrings(Actor akActor, String[] ActorValues, String[] ActorValueStrings = none, String Divider = "||") Global
    Guard()
EndFunction

;return actor values of akActor from actor values in file to float array. 
;can specify your own file path. Look at the structure of DbActorValues.txt to make another file.
;requires skse and papyrusUtil.
Float[] Function GetActorValuesFromFile(Actor akActor, String filePath = "Data/interface/DbMiscFunctions/DbActorValues.txt") Global
    Guard()
EndFunction 

;same as GetActorValuesFromFile but returns for instance "Health = 100.0" in string array instead of float values
;can specify your own file path. Look at the structure of DbActorValues.txt to make another file.
;requires skse and papyrusUtil.
String[] Function GetActorValueStringsFromFile(Actor akActor, String filePath = "Data/interface/DbMiscFunctions/DbActorValues.txt") Global
    Guard()
EndFunction 

;same as GetActorValueStringsFromFile but puts all the values in a single string seperated by Divider
;can specify your own file path. Look at the structure of DbActorValues.txt to make another file.
;requires skse and papyrusUtil.
String Function sGetActorValueStringsFromFile(Actor akActor, String Divider = "||", String filePath = "Data/interface/DbMiscFunctions/DbActorValues.txt") Global
    Guard()
EndFunction  

;return all Base actor values in file to float array. 
;can specify your own file path. Look at the structure of DbActorValues.txt to make another file.
;requires skse and papyrusUtil.
Float[] Function GetBaseActorValuesFromFile(Actor akActor, String filePath = "Data/interface/DbMiscFunctions/DbActorValues.txt") Global
    Guard()
EndFunction 

;same as GetBaseActorValuesFromFile but returns for instance "Health = 100.0" in string array instead of float values
;can specify your own file path. Look at the structure of DbActorValues.txt to make another file.
;requires skse and papyrusUtil.
String[] Function GetBaseActorValueStringsFromFile(Actor akActor, String filePath = "Data/interface/DbMiscFunctions/DbActorValues.txt") Global
    Guard()
EndFunction 

;same as GetBaseActorValueStringsFromFile but puts all the values in a single string seperated by Divider
;can specify your own file path. Look at the structure of DbActorValues.txt to make another file.
;requires skse and papyrusUtil.
String Function sGetBaseActorValueStringsFromFile(Actor akActor, String Divider = "||", String filePath = "Data/interface/DbMiscFunctions/DbActorValues.txt") Global
    Guard()
EndFunction   

;Attach the akScript to the Ref. 
;Mostly for LE as on SE you can use the No Esp mod instead
;if ref == none, attachs akScript to the player
;requires skse and consoleUtil or DbSkseFunctions.
;DbSkseFunctions (included with this mod) only works on SE and AE
Function AttachPapyrusScript(String akScript, ObjectReference Ref) Global
    Guard()
EndFunction

;menuName must match a valid menu name in UI.psc 
;requires skse
Function OpenMenu(string menuName) Global
    Guard()
EndFunction 

Function CloseMenu(string menuName) Global
    Guard()
Endfunction

;get the string between leftChar (outer) and rightChar (outer) strings.
;leftChar and rightChar should both be a single character string.
;For instance:
;string sExample = "(A, (B + (C)), D)"
;GetStringBetweenOuterCharacters(sExample) ;returns "A, (B + (C)), D"
;GetStringBetweenOuterCharacters(sExample, 1) ;returns "B + (C)"
;requires skse
string function GetStringBetweenOuterCharacters(String s, int startIndex = 0, String leftChar = "(", string rightChar = ")") Global
    Guard()
EndFunction

;find the index of the nth instance of string toFind in string s
;if nthInstance == -1 (default), finds the last instance in string s 
;requires skse
int Function findNthInstanceInString(String s, String toFind, int nthInstance = -1, int startIndex = 0) Global
    Guard()
EndFunction

;Finds the last index of String ToFind in string s
;Example: FindLastStringIndex("The dog is the coolest dog in the world", "The") returns 30, the last instance of "the" 
;Requires skse.
Int Function FindLastStringIndex(String s, String ToFind) Global
    Guard()
EndFunction

; returns the index of the first character of toFind inside string s
; returns -1 if toFind is not part of the string or if startIndex is invalid or if the characters preceding and following ToFind in s are not whitespace
; Example 
;FindWholeWordString("TestString", "String") returns -1
;FindWholeWordString("Test String", "String") returns 5
Int Function FindWholeWordString(String s, String ToFind, Int StartIndex = 0) Global
    Guard()
EndFunction

;returns true if the single character string C is whitespace.
;requires skse
Bool Function IsCharWhiteSpace(String C) Global
    Guard()
EndFunction

;find next word in string. (Next string of non white space) from startIndex
;Examples:
;String A = FindNextWordInString("This is some text ")      ;A = "This"
;String B = FindNextWordInString("This is some text ", 12)  ;B = "text"
;String C = FindNextWordInString("This is some text ", 9)   ;C = "ome"
;requires skse
String Function FindNextWordInString(String s, int startIndex = 0) global 
    Guard()
EndFunction

;same as above but in reverse
;if startIndex is -1, startIndex is string length
;requires skse
String Function RFindNextWordInString(String s, int startIndex = -1) global 
    Guard()
EndFunction

;requires skse
Int function FindNextNonWhiteSpaceCharIndexInString(String s, int startIndex = 0) global
    Guard()
EndFunction

;same as above but in reverse
;if startIndex is -1, startIndex is string length
;requires skse
Int function RFindNextNonWhiteSpaceCharIndexInString(String s, int startIndex = -1) global
    Guard()
EndFunction

;requires skse
Int Function FindNextWhiteSpaceCharIndexInString(String s, int startIndex = 0) global
    Guard()
EndFunction

;same as above but in reverse
;if startIndex is -1, startIndex is string length
;requires skse
Int Function RFindNextWhiteSpaceCharIndexInString(String s, int startIndex = -1) global
    Guard()
EndFunction

;requires skse
String Function FindNextNonWhiteSpaceCharInString(String s, int startIndex = 0) global
    Guard()
EndFunction

;same as above but in reverse
;if startIndex is -1, startIndex is string length
;requires skse
String Function RFindNextNonWhiteSpaceCharInString(String s, int startIndex = -1) global
    Guard()
EndFunction

;requires skse
String Function FindNextWhiteSpaceCharInString(String s, int startIndex = 0) global
    Guard()
EndFunction

;same as above but in reverse
;if startIndex is -1, startIndex is string length
;requires skse
String Function RFindNextWhiteSpaceCharInString(String s, int startIndex = -1) global
    Guard()
EndFunction

int Function RFindInString()
EndFunction

;requires skse
String Function RemoveWhiteSpaces(String s, Bool IncludeSpaces = True, Bool IncludeTabs = true, Bool IncludeNewLines = true) Global
    Guard()
EndFunction

;Requires skse
Int Function CountWhiteSpaces(String s, Bool IncludeSpaces = True, Bool IncludeTabs = true, Bool IncludeNewLines = true) Global 
    Guard()
Endfunction

;Count the number of String ToFind that occures in String s. 
;If WholeWordsOnly == true, only counts where the string ToFind occures is surrounded by whiteSpace.
;requires skse
Int Function CountStringsInString(String s, String ToFind, Bool WholeWordsOnly = false) Global
    Guard()
EndFunction

;string[] function SliceStringArray(string[] ArrayValues, int StartIndex, int EndIndex = -1) global native

Int[] Function GetPositionsOfStringInStrings(String s, String ToFind, Bool WholeWordsOnly = false) Global
    Guard()
EndFunction

String Function CreateRandomWord(int WordLength, string letters = "bcdfghjklmnpqrstvwxyz", string vowels = "aeiou", \
								 string pairs = "st gr ea ie ei pr qw fr cr tr vr br pl cl ") global
    Guard()
EndFunction

String Function GetRandomWordFromString(String s, String Divider = " ") Global
    Guard()
EndFunction

String Function GetRandomWordsFromString(String s, int numOfWords, String Divider = " ") Global
    Guard()
EndFunction

String[] Function GetRandomWordsFromStringA(String s, int numOfWords, String Divider = " ") Global
    Guard()
EndFunction

String Function GetLoremipsumNoPunctuation() Global 
    Guard()
EndFunction

String Function GetLoremipsum() Global 
    Guard()
EndFunction

;remove all SearchStr instances from TragetStr except for the first instance
;requires skse
String Function RemoveDuplicateStrings(String TargetStr, String SearchStr) Global
    Guard()
EndFunction

;Remove All Duplicate strings separated by Divider. Example: 
;RemoveAllDuplicateStrings("TestString||TestString||Hmmm||TestString|| Test String ||Hmm||TestString") returns "TestString||Hmmm|| Test String ||"
;RemoveAllDuplicateStrings("TestString||TestString||Hmmm||TestString|| Test String ||Hmm||TestString", IncludeDividersInResult = false) returns "TestStringHmmm Test String "
;requires skse
String Function RemoveAllDuplicateStrings(String TargetStr, String Divider = "||", Bool IncludeDividersInResult = true) Global 
    Guard()
EndFunction

;Replace instances of the SearchStr with the ReplaceStr in the TargetStr
;Default count = 0 which means replace all instances. Otherwise only replace the Count number.
;Example: 
;String MyString = "A Yes, B Yes, C Yes"
;String MyStringB = StringReplace(MyString, "Yes", "No")
;String MyStringC = StringReplace(MyString, "Yes", "No", 2)
;MyStringB == "A No, B No, C No"
;MyStringC == "A No, B No, C Yes"
;Requires SKSE
String Function StringReplace(String TargetStr, String SearchStr, String ReplaceStr, Int Count = 0, Int StartIndex = 0) Global
    Guard()
EndFunction

;insert the InsertStr to the TargetStr at the CharPosition and return new string. 
;if CharPosition == -1, appends the InsertStr to the end of TargetStr
String Function StringInsert(String TargetStr, String InsertStr, Int CharPosition = -1) Global
    Guard()
EndFunction

;Remove a single character in String s at Index 
;Requires skse
String Function StringRemoveCharAt(String s, Int Index) Global
    Guard()
EndFunction

;Remove Non printable characters from string 
;Requires skse.
String Function StringRemoveNonPrintableCharacters(String s) Global
    Guard()
EndFunction

;Remove Non printable characters from string 
;Requires skse.
String Function StringRemovePrintableCharacters(String s) Global
    Guard()
EndFunction

;Add prefix to string s and return new string 
;If OnlyIfNotPresent == true (default) only adds the prefix if it's not already present. 
;Requires skse
String Function AddPrefixToString(String s, String Prefix, Bool OnlyIfNotPresent = true) Global
    Guard()
EndFunction

;Same as above but adds to all strings in array
;Requires skse
String[] Function AddPrefixToStrings(String[] s, String Prefix, Bool OnlyIfNotPresent = true) Global
    Guard()
EndFunction

;Remove prefix from string s, if it exists and return new string, or return s if not present
;Requires skse
String Function RemovePrefixFromString(String s, String Prefix) Global
    Guard()
EndFunction

;Same as above but removes from all strings in array
;Requires skse
String[] Function RemovePrefixFromStrings(String[] s, String Prefix) Global
    Guard()
EndFunction

;Add suffix to string s and return new string 
;If OnlyIfNotPresent == true (default) only adds the suffix if it's not already present. 
;Requires skse
String Function AddSuffixToString(String s, String Suffix, Bool OnlyIfNotPresent = true) Global
    Guard()
EndFunction

;Same as above but adds to all strings in array
;Requires skse
String[] Function AddSuffixToStrings(String[] s, String Suffix, Bool OnlyIfNotPresent = true) Global
    Guard()
EndFunction

;Remove suffix from string s, if it exists and return new string, or return s if not present
;Requires skse
String Function RemoveSuffixFromString(String s, String Suffix) Global
    Guard()
EndFunction

;Same as above but removes from all strings in array
;Requires skse
String[] Function RemoveSuffixFromStrings(String[] s, String Suffix) Global
    Guard()
EndFunction

;Add prefix to akForm's name
;If OnlyIfNotPresent == true (default) only adds the prefix if it's not already present. 
;Requires skse
Function AddPrefixToFormName(Form akForm, String Prefix, Bool OnlyIfNotPresent = true) Global
    Guard()
EndFunction

;Same as above but adds to all form names in array 
;Requires skse
Function AddPrefixToFormNames(Form[] akForms, String Prefix, Bool OnlyIfNotPresent = true) Global
    Guard()
EndFunction

;Remove prefix from akForm's name if it exists
;Requires skse
Function RemovePrefixFromFormName(Form akForm, String Prefix) Global
    Guard()
EndFunction

;Same as above but removes from all form names in array 
;Requires skse
Function RemovePrefixFromFormNames(Form[] akForms, String Prefix, Bool OnlyIfNotPresent = true) Global
    Guard()
EndFunction

;Add Suffix to akForm's name
;If OnlyIfNotPresent == true (default) only adds the Suffix if it's not already present. 
;Requires skse
Function AddSuffixToFormName(Form akForm, String Suffix, Bool OnlyIfNotPresent = true) Global
    Guard()
EndFunction

;Same as above but adds to all form names in array 
;Requires skse
Function AddSuffixToFormNames(Form[] akForms, String Suffix, Bool OnlyIfNotPresent = true) Global
    Guard()
EndFunction

;Remove Suffix from akForm's name if it exists
;Requires skse
Function RemoveSuffixFromFormName(Form akForm, String Suffix) Global
    Guard()
EndFunction

;Same as above but removes from all form names in array 
;Requires skse
Function RemoveSuffixFromFormNames(Form[] akForms, String Suffix, Bool OnlyIfNotPresent = true) Global
    Guard()
EndFunction

;Does the string have the Prefix?
;Requires skse
Bool Function StringHasPrefix(String s, String Prefix) Global
    Guard()
EndFunction

;Does the string have the Suffix?
;Requires skse
Bool Function StringHasSuffix(String s, String Suffix) Global 
    Guard()
EndFunction

; GetStringFromFile get custom string from external file or string
; finds first string between Startkey and EndKey after StringKey.
; similar to localization but no need to worry about nesting strings in a translation file this way.
; Example: Let's say you have a file Data/interface/MyStrings.txt that contains: 
; MyStringA = [My String A] 
; MyStringB = [My String B] 
;
; String MyStringB = GetStringFromFile("MyStringB", FilePath = "Data/interface/MyStrings.txt") ;Returns "My String B"
;
; To search a string instead of a file path, you can do this: 
; String MyStrings 
; MyStrings = MiscUtil.ReadFromFile("Data/interface/MyStrings.txt") 
; String MyStringB = GetStringFromFile("MyStringB", MyStrings) ;Returns "My String B"
; Note, if using the function this way, don't store MyStrings in the script, outside of events or functions. Storing large strings can cause CTD on game load. 
; If storing this way, be sure to clear the string by doing: MyStrings = "" after it's finished being used.
;
; This method will be better for performance if you need to get a lot of strings from your file, as it won't use MiscUtil.ReadFromFile everytime you use the function. 
;
; StringKeys contained in the file must be unique.
;
; If the stringkey wasn't found and the Default is "", it returns the stringKey 
; Let's say you have: 
; Some Custom Message = [Some Custome Message] 
; in the "Data/interface/MyStrings.txt file"
;
; You can do:
; debug.notification(GetStringFromFile("Some Custom Message", FilePath = "Data/interface/MyStrings.txt"))
; And it will still show "Some Custom Message" if something went wrong and it wasn't found in the file
; You can specify a default if you want something else to return if the stringKey wasn't found.
;
; Requires PapyrusUtil && SKSE
String Function GetStringFromFile(String StringKey, String FileContents = "", String FilePath = "", String StartKey = "[", String EndKey = "]", String Default = "", int StartIndex = 0) global 
    Guard()
EndFunction

;same as GetStringFromFile but returns value as int.
int Function GetIntFromFile(String StringKey, String FileContents = "", String FilePath = "", String StartKey = "[", String EndKey = "]", int Default = -1, int StartIndex = 0) global 
    Guard()
EndFunction

;same as GetStringFromFile but returns value as float.
Float Function GetFloatFromFile(String StringKey, String FileContents = "", String FilePath = "", String StartKey = "[", String EndKey = "]", Float Default = -1.0, int StartIndex = 0) global 
    Guard()
EndFunction


;Save All strings in the StartKey and Endkey brackets, between the RangeStart and RangeEnd strings from the FileContents or FilePath to a string array. 
;Example: you have a file Data/interface/MyStrings.txt that contains: 
;MyStringA = [My String A] 
;MyStringB = [My String B] 
;
;String[] MyStrings = GetAllStringsFromFile("Data/interface/MyStrings.txt")  
;MyStrings[0] will equal "My String A" and MyStrings[1] will equal "My String B"
;
;to specify a range to search you can do this: 
;
;File contains: 
;
;StringsA
;MyStringA = [My String A] 
;MyStringB = [My String B] 
;StringsAEnd 
;MyStringC = [My String C] 
;
;Using String[] MyStrings = GetAllStringsFromFile(FilePath = "Data/interface/MyStrings.txt", "StringsA", "StringsAEnd")
;Only My String A and My String B are saved to the array.
;
;If RangeStart is "", starts search at the beginning of the file. If RangeEnd is "", stops searching at the end of the file. 
;
;requires SKSE and PapyrusUtil
String[] Function GetAllStringsFromFile(String FileContents = "", String FilePath = "", String RangeStart = "", String RangeEnd = "", String StartKey = "[", String EndKey = "]", String[] Default = None) global
    Guard()
EndFunction

;Same as GetAllStringsFromFile but saves values as ints to int array
;requires SKSE and PapyrusUtil
Int[] Function GetAllIntsFromFile(String FileContents = "", String FilePath = "", String RangeStart = "", String RangeEnd = "", String StartKey = "[", String EndKey = "]", Int[] Default = None) global
    Guard()
EndFunction

;Same as GetAllStringsFromFile but saves values as floats to float array
;requires SKSE and PapyrusUtil
Float[] Function GetAllFloatsFromFile(String FileContents = "", String FilePath = "", String RangeStart = "", String RangeEnd = "", String StartKey = "[", String EndKey = "]", Float[] Default = None) global
    Guard()
EndFunction


;PrintStringKeysToFile Finds and Prints all GetString / int / floatFromString StringKeys, from FilePathToSearch to FilePathToPrintTo
;To speed up the process of making your StringKeys.txt file. 
;You can write GetStringFromFile() functions in your .psc file, and when you're finished with your script, have this function print the string keys to another .txt file. 
;
;Example, if in MyScript.psc you have: 
;Debug.Notification(GetStringFromFile("My Message A")) 
;Debug.Notification(GetStringFromFile("My Message B")) 
;Use the function: 
;
;PrintStringKeysToFile("Data/Scripts/Source/MyScript.psc", "Data/interface/MyStrings.txt") 
;
;In the MyStrings.txt file it will write: 
;
;"My Message A" = ["My Message A"]
;"My Message B" = ["My Message B"]
;
;note that the quotes are included. You'll want to get rid of them by pressing ctrl H in your text editor and replace all " with nothing so it looks like: 
;
;My Message A = [My Message A]
;My Message B = [My Message B]
;
;Otherwise the GetStringFromFile functions won't work correctly when reading from your .txt file.
;
;Requires SKSE and PapyrusUtil
Bool Function PrintStringKeysToFile(String FilePathToSearch, String FilePathToPrintTo, String StartKey = "[", String EndKey = "]", String FinishedMsg = "Done Printing") global
    Guard()
EndFunction


;Print all items in a container to the FilePath with the mod they come from included. 
;Requires SKSE
Function PrintContainerItemsToFile(ObjectReference akContainer, String FilePath, String ConfirmMessage = "") global
    Guard()
EndFunction

;Write form ID's of forms in akList to file. If ReplaceIdStartWith0x == true (default), replaces first two characters of ID with 0x.
;Requires skse and PapyrusUtil
Function WriteIDsInFormListToFile(Formlist akList, String FilePath, Bool IncludeNames = False, Bool ReplaceIdStartWith0x = true) Global
    Guard()
EndFunction

;Write form ID's of forms in akList to file. If ReplaceIdStartWith0x == true (default), replaces first two characters of ID with 0x.
;Requires skse and PapyrusUtil
Function WriteIDsInFormArrayToFile(Form[] akList, String FilePath, Bool IncludeNames = False, Bool ReplaceIdStartWith0x = true) Global
    Guard()
EndFunction

;Write form ID's of forms in storageutil formlist to file. If ReplaceIdStartWith0x == true (default), replaces first two characters of ID with 0x.
;Requires skse and PapyrusUtil
Function WriteIDsInStorageUtilListToFile(Form ObjKey, String ListKeyName, String FilePath, Bool IncludeNames = False, Bool ReplaceIdStartWith0x = true) Global 
    Guard()
EndFunction

;Write form ID's of forms in JsonUtil formlist to file. If ReplaceIdStartWith0x == true (default), replaces first two characters of ID with 0x.
;Requires skse and PapyrusUtil
Function WriteIDsInJsonUtilListToFile(String JsonFilePath, String ListKeyName, String FilePath, Bool IncludeNames = False, Bool ReplaceIdStartWith0x = true) Global 
    Guard()
EndFunction 

;Write bool animation variables of akRef found in DbAnimationVariableBools.txt to OutputFilePath.
;Can specify a different VariablesSourceFilePath if desired.
;Default variables found in DbAnimationVariableBools.txt are from https://www.creationkit.com/index.php?title=List_of_Animation_Variables
;Requires skse and papyrusutil
Function WriteAnimationVariableBoolsToFile(ObjectReference akRef, String OutputFilePath, String VariablesSourceFilePath = "Data/interface/DbMiscFunctions/DbAnimationVariableBools.txt") Global
    Guard()
Endfunction

;Write int animation variables of akRef found in DbAnimationVariableInts.txt to OutputFilePath.
;Can specify a different VariablesSourceFilePath if desired.
;Default variables found in DbAnimationVariableInts.txt are from https://www.creationkit.com/index.php?title=List_of_Animation_Variables
;Requires skse and papyrusutil
Function WriteAnimationVariableIntsToFile(ObjectReference akRef, String OutputFilePath, String VariablesSourceFilePath = "Data/interface/DbMiscFunctions/DbAnimationVariableInts.txt") Global
    Guard()
Endfunction

;Write Float animation variables of akRef found in DbAnimationVariableFloats.txt to OutputFilePath.
;Can specify a different VariablesSourceFilePath if desired.
;Default variables found in DbAnimationVariableFloats.txt are from https://www.creationkit.com/index.php?title=List_of_Animation_Variables
;Requires skse and papyrusutil
Function WriteAnimationVariableFloatsToFile(ObjectReference akRef, String OutputFilePath, String VariablesSourceFilePath = "Data/interface/DbMiscFunctions/DbAnimationVariableFloats.txt") Global
    Guard()
Endfunction

;Requires skse and papyrusutil
Function WriteAllAnimationVariablesToFile(ObjectReference akRef, String OutputFilePath, String BoolVariablesSourceFilePath = "Data/interface/DbMiscFunctions/DbAnimationVariableBools.txt", \
                                                                                String IntVariablesSourceFilePath = "Data/interface/DbMiscFunctions/DbAnimationVariableInts.txt", \
                                                                                String FloatVariablesSourceFilePath = "Data/interface/DbMiscFunctions/DbAnimationVariableFloats.txt") Global
    Guard()
EndFunction 

;register the akForm to recieve all AnimationEvents from the akSender  
;no requirements
Function RegisterFormForAnimationEvents(Form akForm, ObjectReference akSender, String[] AnimationEvents) Global
    Guard()
EndFunction

;register the akAlias to recieve all AnimationEvents from the akSender  
;no requirements
Function RegisterAliasForAnimationEvents(Alias akAlias, ObjectReference akSender, String[] AnimationEvents) Global
    Guard()
EndFunction

;register the akActiveMagicEffect to recieve all AnimationEvents from the akSender  
;no requirements
Function RegisterActiveMagicEffectForAnimationEvents(ActiveMagicEffect akActiveMagicEffect, ObjectReference akSender, String[] AnimationEvents) Global
    Guard()
EndFunction

;Register the akForm to recieve all Animation Events from akSender found in File specified by FilePath. 
;Events in the file should be separated by new line.
;Requires SKSE and PapyrusUtil
Function RegisterFormForAnimationEventsFromFile(Form akForm, ObjectReference akSender, String FilePath = "Data/interface/DbMiscFunctions/DbAnimationEvents.txt") Global
    Guard()
EndFunction

;Register the akAlias to recieve all Animation Events from akSender found in File specified by FilePath. 
;Events in the file should be separated by new line.
;Requires SKSE and PapyrusUtil
Function RegisterAliasForAnimationEventsFromFile(Alias akAlias, ObjectReference akSender, String FilePath = "Data/interface/DbMiscFunctions/DbAnimationEvents.txt") Global
    Guard()
EndFunction

;Register the akActiveMagicEffect to recieve all Animation Events from akSender found in File specified by FilePath. 
;Events in the file should be separated by new line.
;Requires SKSE and PapyrusUtil
Function RegisterActiveMagicEffectForAnimationEventsFromFile(ActiveMagicEffect akActiveMagicEffect, ObjectReference akSender, String FilePath = "Data/interface/DbMiscFunctions/DbAnimationEvents.txt") Global
    Guard()
EndFunction

;register the akForm for all Menus in string array.
;Requires SKSE
Function RegisterFormForMenus(Form akForm, String[] Menus) Global
    Guard()
EndFunction

;register the akAlias for all Menus in string array.
;Requires SKSE
Function RegisterAliasForMenus(Alias akAlias, String[] Menus) Global
    Guard()
EndFunction

;register the akActiveMagicEffect for all Menus in string array.
;Requires SKSE
Function RegisterActiveMagicEffectForMenus(ActiveMagicEffect akActiveMagicEffect, String[] Menus) Global
    Guard()
EndFunction

;Register the akForm for all menus found in File specified by FilePath. 
;Events in the file should be separated by new line.
;Requires SKSE and PapyrusUtil
Function RegisterFormForMenusFromFile(Form akForm, String FilePath = "Data/interface/DbMiscFunctions/DbMenus.txt") Global
    Guard()
EndFunction

;Register the akAlias for all menus found in File specified by FilePath. 
;Events in the file should be separated by new line.
;Requires SKSE and PapyrusUtil
Function RegisterAliasForMenusFromFile(Alias akAlias, String FilePath = "Data/interface/DbMiscFunctions/DbMenus.txt") Global
    Guard()
EndFunction

;Register the ActiveMagicEffect for all menus found in File specified by FilePath. 
;Events in the file should be separated by new line.
;Requires SKSE and PapyrusUtil
Function RegisterActiveMagicEffectForMenusFromFile(ActiveMagicEffect akActiveMagicEffect, String FilePath = "Data/interface/DbMiscFunctions/DbMenus.txt") Global
    Guard()
EndFunction

;Write all data info to TargetFilePath from all .psc files in SearchFolderPath. Writes ScriptNames, Function Names, Event Names, Function Definitions and Event Definitions.
;requires skse and papyrus util.
function WriteAllPscDataInFolderToFile(String SearchFolderPath, String TargetFilePath, String Divider = "\n", String DoneMessage = "Done Writing") Global    
    Guard()
EndFunction 

String Function GetPscEventNamesFromFile(String SourceFilePath, String Divider = "\n", int StartIndex = 0) Global
    Guard()
EndFunction

String Function GetPscFunctionNamesFromFile(String SourceFilePath, String Divider = "\n", int StartIndex = 0) Global
    Guard()
EndFunction

String Function GetPscDataNamesFromFile(String SourceFilePath, String NameType, String Divider = "\n", int StartIndex = 0) Global
    Guard()
EndFunction 


;/Get all Event or Function Definitions from source file.  
ignores commented out functions
example if the psc file has: 

Int Function AddInts(int A, int B)
    return A + B
Endfunction

Float Function AddFloats(Float A, Float B)
    return A + B 
EndFunction

GetPscFunctionDefinitionsFromFile returns: 

"Int Function AddInts(int A, int B)
Float Function AddFloats(Float A, Float B)"
/;

String Function GetPscEventDefinitionsFromFile(String SourceFilePath, String Divider = "\n", int StartIndex = 0) Global 
    Guard()
EndFunction

String Function GetPscFunctionDefinitionsFromFile(String SourceFilePath, String Divider = "\n", int StartIndex = 0) Global 
    Guard()
EndFunction

;is the index in string s between a block comment start and end
;requires skse
bool function IsIndexInBlockComment(string s, int index, string blockCommentStart = ";/", string blockCommentEnd = "/;") Global
    Guard()
EndFunction 

String Function GetPscDataDefinitionsFromFile(String SourceFilePath, String NameType, String Divider = "\n", int StartIndex = 0) Global
    Guard()
Endfunction 

;Search the SournceFilePath for String / Int / Float / Global variables, if their toggles are enabled, (outside of any events or functions) 
;and write Json Save and Load functions to DestinationFilePath for said variables. 
;If DestinationFilePath == "" it will write the functions to the SourceFilePath.
;Set Messages int to 0 to display ConfirmMessage notification when finished, set to 1 to display messagebox.
;requires skse and PapyrusUtil
Function WriteJsonSaveAndLoadFunctionsToFile(String SourceFilePath, String DestinationFilePath = "", \
    Bool GlobalVariablesToggle = true, Bool FloatsToggle = true, Bool StringsToggle = true, Bool IntsToggle = true, Bool BoolsToggle = true, \
    Bool GlobalVariableArraysToggle = true, Bool FloatArraysToggle = true, Bool StringArraysToggle = true, Bool IntArraysToggle = true, Bool BoolArraysToggle = true, \
    int Messages = 0, String ConfirmMessage = "Done Writing Json Functions", Bool UsePropertiesAsDefaults = True) global
    Guard()
    MiscUtil.WriteToFile(f, "\t" + "EndFunction" + "\n\n")
    
    MiscUtil.WriteToFile(f, "\t" + "Bool[] Function GetBoolArray()" + "\n")
    Guard()
EndFunction 



Function Guard()
    Debug.MessageBox("DbMiscFunctions: Dom't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction

