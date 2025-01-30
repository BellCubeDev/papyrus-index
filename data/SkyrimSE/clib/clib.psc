ScriptName clib Hidden

function Guard()
  Debug.MessageBox("clib: Don't recompile this script!\n\nPlease get the real version from the Nexus page.")
endFunction

; Guard()ing this file was... a lot. 383 hand-placed Guard() calls.
; GG, Cecell. You're an absolute madman. No logic and this file is STILL over 2k lines.
;  - bell



import cArrayCreateBase

Int    function cGetVersion() global
  {Requirements: None}
    Guard()
endfunction

function p(String msg) global
    Guard()
endfunction
;--------------------------FORMS/OBJECT REFERENCES-----------------------------

;====== Query/Analysis
  ;>>> resolve form
Form    function cGetForm(Int decForm, String hexForm = "", String modName = "") global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Get forms from file
    ;==> If all forms from same mod
Form[]   function cArrayHexIDToForms(String[] aArray, String esXName, Bool skipNones = TRUE, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
    ;==> If all forms from same mod
Form[]   function cArrayIntIDToForms(Int[] aArray, String esXName, Bool skipNones = TRUE, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
    ;==> Each can be different mod, String[] to supply name for each
Form[]   function cArrayIntIDModNamesToForms(Int[] aArray, String[] esXName, Bool skipNones = TRUE, \
  Bool useSKSE = TRUE) global ; WORKING
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
    ;==> Each can be different mod, String[] to supply name for each
Form[]   function cArrayHexIDModNamesToForms(String[] aArray, String[] esXNames, Bool clearNones = TRUE, \
    Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
  ;>>> get type Non-SKSE relies on keywords yet covers > 10,000 items in vanilla alone
;   e.g. weapon, armor, ingredient, potion/food, book, scroll, soul gem

; Non-SKSE version only works for inventory items that use 'vendor' type keywords which means that
;   more obscure items could be missed but it covers quite a lot tbh (10,664 references)
Int     function cGetSKSEType(Form aForm, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction

  ;>>> Determine ownership
Form    function cGetOwner(ObjectReference aObjectRef) global
  {Requirements: None}
    Guard()
endfunction

Bool    function cIsPlayerOwner(ObjectReference aObjectRef, Actor playerAct = None) global
  {Requirements: None}
    Guard()
endfunction
Faction function cGetInheritedOwner(ObjectReference aObjectRef) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Object query
Bool     function cIsContainer(ObjectReference aObjectRef, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
; !simple appends "No Name-" to hexFormID return
String   function cGetItemName(Form aForm, Bool simple = False) global
  {Requirements: None}
    Guard()
endfunction
String[] function cArrayNameFromForms(Form[] aArray) global
  {Requirements: None}
    Guard()
endfunction
String[] function cArrayNameFromFL(FormList aFormList) global
  {Requirements: None}
    Guard()
endfunction

;====== FormID handling
  ;>>> number base conversion

  ; used in GetFormFromFile
Int      function cGetIntSubID(Int decForm, String hexForm = "", Form aForm = None) global
  {Requirements: None}
    Guard()
endfunction

; Returns last 3 hex digits for light or 6 in regular. Input for this function assumes some prior
;   validation. FormIDs must be 'fully loaded' (e.g. hexForm must be 8 digits). Using aForm argument
;     requires that it be currently loaded but decForm || hexForm arguments does not
String   function cGetHexSubID(Int decForm, String hexForm = "", Form aForm = None) global
  {Requirements: None}
    Guard()
endfunction
String   function cGetHexIDFromForm(Form aForm) global
  {Requirements: None}
    Guard()
endfunction
; without SKSE array creation is limited to 128!
Int[]    function cArrayHexStringsToDecimal(String[] aArray) global
  {Requirements: None}
    Guard()
endfunction
String[] function cArrayDecimalsToHexStrings(Int[] aArray) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> fairly accurate method of determining if full (loaded) FormID is vanilla or not

  ; Requires full formID of a loaded plugin
  ; Checks if the dec FormID value is between 0 and SSEEdit value for next form in Dragonborn.esm
  ; NOTE: Injected records cannot be differentiated. This does not mean the form is valid, only that it's in range
  ;   however, apart from this caveat it does confirm that it is *not* from a mod use cGetForm to test validity
Bool     function cIDInVanillaRange(Int decForm, String hexForm = "", Form aForm = None) global
  {Requirements: None}
    Guard()
endfunction

;====== Mod Functions
Bool   function cIsLight(String hexForm = "", Int decForm = 0,Form formVar = None, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction

;====== Leveled Item Lists
; all items in the form must have the same level and count
Int function cArrayAddLVLI(LeveledItem aLeveledList, Form[] aArray, Int level, Int count) global
  {Requirements: None}
    Guard()
endfunction
; accepts arrays for all three arguments, forms, levelss, countss
; Note: the levels and counts arrays use the cWrapInt function. This allows the following:
;   A 21 index form array and levels and counts arrays of 7 forms each:
;   Form[0] -> levels[0] -> counts[0]
;   ...
;   Form[6] -> levels[6] -> counts[6]
;   Form[7] -> levels[0] -> counts[0]
;   ...
;   Form[13] -> levels[6] -> counts[6]
;   Form[14] -> levels[0] -> counts[0]
; If all arrays are equal in size it will of course proceed in normal fashion
Int function cArrayAllAddLVLI(LeveledItem aLeveledList, Form[] aArray, Int[] levels, Int[] counts) global
  {Requirements: None}
    Guard()
endfunction

  ;>>> Inventory functions
Form[] function cGetAllEquippedForms(Actor aActor, Int slot = -1) global
  {Requirement: None}
    Guard()
endfunction


;========================= Map/Spatial
; Spatial ref data https://www.creationkit.com/index.php?title=Unit
;1	   1.428 cm	  0.5625"
;64:   91.41 cm	  3'
;128:  1.82m	    6' (1.0 height character)
;4096: 58.5m	  192' (dimension of a cell)
  ;>>> Map coordinates

  ;Grid Map for reference
  ;https://docs.google.com/spreadsheets/d/1yhsNb12btLWpRNRIpZ2DfjVsWR946qEZTmVML_Wi9U8/edit?usp=sharing
Int[]   function cGetCellCKCoordsArray(ObjectReference aObjectRef) global
  {Requirements: None}
    Guard()
endfunction
; Learned from Ashen thanks!!!
; Player Cell Position: https://www.nexusmods.com/skyrimspecialedition/mods/46173
; Convenience for display/messages
;Grid Map for reference
;https://docs.google.com/spreadsheets/d/1yhsNb12btLWpRNRIpZ2DfjVsWR946qEZTmVML_Wi9U8/edit?usp=sharing
String  function cGetCellXYAsString(ObjectReference aObjectRef) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Coordinate conversion (CK to XY, e.g. CK: 33, 8 == x: 135168, y: 32768)

  ; If aObjectRef is provided then xVar and yVar are overwritten by its position
  ;Grid Map for reference
  ;https://docs.google.com/spreadsheets/d/1yhsNb12btLWpRNRIpZ2DfjVsWR946qEZTmVML_Wi9U8/edit?usp=sharing
Int[]   function cGetCKCoordsFromXY(Float xVar, Float yVar, ObjectReference aObjectRef = None) global
  {Requirements: None}
    Guard()
endfunction
; If aObjectRef is provided then ckX and ckY are overwritten by its position
;Grid Map for reference
;https://docs.google.com/spreadsheets/d/1yhsNb12btLWpRNRIpZ2DfjVsWR946qEZTmVML_Wi9U8/edit?usp=sharing
Float[] function cGetCoCXYFromCKCoords(Int ckX, Int ckY, ObjectReference aObjectRef = None) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> get the distances of array of objects from object aObj
Float[] function cArrayGetDistancesObjRef(ObjectReference aObj, ObjectReference[] aArray) global
  {Requirements:None}
    Guard()
endfunction
  ;>>> .Get*() as an array && .Set*() accepts array
Float[] function cArrayGetAngle(ObjectReference aObj) global
  {Requirements: None}
    Guard()
endfunction
function cArraySetAngle(ObjectReference aObj, Float[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Float[] function cArrayGetPosition(ObjectReference aObj) global
  {Requirements: None}
    Guard()
endfunction
function cArraySetPosition(ObjectReference aObj, Float[] aArray) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Placement == PosX&&PosY&&PosZ&&AngX&&AngY&&AngZ
Float[] function cArrayGetPlacement(ObjectReference aObj) global
  {Requirements: None}
    Guard()
endfunction
function cArraySetPlacement(ObjectReference aObj, Float[] aArray) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Accepts placement array as an argument
function cArrayTranslateTo(ObjectReference aObj, Float[] pArray, Float speed = 50.0, Float maxSpeed = 0.0) global
  {Requirements: None}
    Guard()
endfunction

;========================= Conditional statements
; NOTE: These functions can't short circuit like a traditional ternary. Thus, they're most efficient if only
;   one argument is a function. If both are functions they *both* will be run before returning a value;
;   Nesting these functions is perfectly fine with numbers or operator calculations but know this: nesting
;   with multiple functions as arguments will results in *allllll* of the function being called. Use of
;   traditional if/then is recommended in those cases. Nexting ternary functions *inside* if thens works
;   great though (and will still shave lines off)
  ;>>> Single value returns
Actor    function cTernaryActor(Bool ifThis, Actor returnThis, Actor elseThis = None) global
  {Requirements: None}
    Guard()
endfunction
Alias    function cTernaryAlias(Bool ifThis, Alias returnThis, Alias elseThis = None) global
  {Requirements: None}
    Guard()
endfunction
Float    function cTernaryFloat(Bool ifThis, Float returnThis, Float elseThis = 0.0) global
  {Requirements: None}
    Guard()
endfunction
Form     function cTernaryForm(Bool ifThis, Form returnThis, Form elseThis = None) global
  {Requirements: None}
    Guard()
endfunction
Int      function cTernaryInt(Bool ifThis, Int returnThis, Int elseThis = 0) global
  {Requirements: None}
    Guard()
endfunction
ObjectReference function cTernaryObjRef(Bool ifThis, ObjectReference returnThis, ObjectReference elseThis = None) global
  {Requirements: None}
    Guard()
endfunction
String   function cTernaryString(Bool ifThis, String returnThis, String elseThis = "") global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Array returns
Actor[]  function cTernaryArrayActor(Bool ifThis, Actor[] returnThis, Actor[] elseThis) global
  {Requirements: None}
    Guard()
endfunction
Alias[]  function cTernaryArrayAlias(Bool ifThis, Alias[] returnThis, Alias[] elseThis) global
  {Requirements: None}
    Guard()
endfunction
Bool[]   function cTernaryArrayBool(Bool ifThis, Bool[] returnThis, Bool[] elseThis) global
  {Requirements: None}
    Guard()
endfunction
Float[]  function cTernaryArrayFloat(Bool ifThis, Float[] returnThis, Float[] elseThis) global
  {Requirements: None}
    Guard()
endfunction
Form[]   function cTernaryArrayForm(Bool ifThis, Form[] returnThis, Form[] elseThis) global
  {Requirements: None}
    Guard()
endfunction
Int[]    function cTernaryArrayInt(Bool ifThis, Int[] returnThis, Int[] elseThis) global
  {Requirements: None}
    Guard()
endfunction
ObjectReference[] function cTernaryArrayObjRef(Bool ifThis, ObjectReference[] returnThis, \
  ObjectReference[] elseThis) global
  {Requirements: None}
    Guard()
endfunction
String[] function cTernaryArrayString(Bool ifThis, String[] returnThis, String[] elseThis) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Simple version when returns ARE the conditions
  ;>>> Single value returns
Actor    function cIfActor(Actor this, Actor that) global
  {Requirements: None}
    Guard()
endfunction
Alias    function cIfAlias(Alias this, Alias that) global
  {Requirements: None}
    Guard()
endfunction
Float    function cIfFloat(Float this, Float that) global
  {Requirements: None}
    Guard()
endfunction
Form     function cIfForm(Form this, Form that) global
  {Requirements: None}
    Guard()
endfunction
Int      function cIfInt(Int this, Int that) global
  {Requirements: None}
    Guard()
endfunction
ObjectReference function cIfObjRef(ObjectReference this, ObjectReference that) global
  {Requirements: None}
    Guard()
endfunction
String   function cIfString(String this, String that) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Array returns
Actor[]  function cIfArrayActor(Actor[] this, Actor[] that) global
  {Requirements: None}
    Guard()
endfunction
Alias[]  function cIfArrayAlias(Alias[] this, Alias[] that) global
  {Requirements: None}
    Guard()
endfunction
Bool[]   function cIfArrayBool(Bool[] this, Bool[] that) global
  {Requirements: None}
    Guard()
endfunction
Float[]  function cIfArrayFloat(Float[] this, Float[] that) global
  {Requirements: None}
    Guard()
endfunction
Form[]   function cIfArrayForm(Form[] this, Form[] that) global
  {Requirements: None}
    Guard()
endfunction
Int[]    function cIfArrayInt(Int[] this, Int[] that) global
  {Requirements: None}
    Guard()
endfunction
ObjectReference[] function cIfArrayObjRef(ObjectReference[] this, ObjectReference[] that) global
  {Requirements: None}
    Guard()
endfunction
String[] function cIfArrayString(String[] this, String[] that) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Longer chains of conditional values
Actor  function cOrActor(Actor this, Actor that, Actor orThat2 = None, Actor orThat3 = None, Actor orThat4 = None, \
    Actor orThat5 = None, Actor orThat6 = None, Actor orThat7 = None, Actor orThat8 = None, Actor orThat9 = None) global
  {Requirements: None}
    Guard()
endfunction
Alias  function cOrAlias(Alias this, Alias that, Alias orThat2 = None, Alias orThat3 = None, Alias orThat4 = None, \
    Alias orThat5 = None, Alias orThat6 = None, Alias orThat7 = None, Alias orThat8 = None, Alias orThat9 = None) global
  {Requirements: None}
    Guard()
endfunction
Float  function cOrFloat(Float this, Float that, Float orThat2 = 0.0, Float orThat3 = 0.0, Float orThat4 = 0.0, \
    Float orThat5 = 0.0, Float orThat6 = 0.0, Float orThat7 = 0.0, Float orThat8 = 0.0, Float orThat9 = 0.0) global
  {Requirements: None}
    Guard()
endfunction
; Unnecessary really but I found it online and figured I'd include it
Form   function cOrForm(Form this, Form that, Form orThat2 = None, Form orThat3 = None, Form orThat4 = None, \
    Form orThat5 = None) global
  {Requirements: None}
    Guard()
endfunction
Int    function cOrInt(Int this, Int that, Int orThat2 = 0, Int orThat3 = 0, Int orThat4 = 0, Int orThat5 = 0) global
  {Requirements: None}
    Guard()
endfunction
ObjectReference  function cOrObjRef(ObjectReference this, ObjectReference that, ObjectReference orThat2 = None, \
  ObjectReference orThat3 = None, ObjectReference orThat4 = None, ObjectReference orThat5 = None, \
    ObjectReference orThat6 = None, ObjectReference orThat7 = None, ObjectReference orThat8 = None, \
      ObjectReference orThat9 = None) global
  {Requirements: None}
    Guard()
endfunction
String function cOrString(String this, String that, String orThat2 = "", String orThat3 = "", String orThat4 = "", \
    String orThat5 = "") global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Pseudo-switch statements
Alias  function cPseudoSwitchAlias(Int case, Alias elseDefault, Alias case0, Alias case1 = None, Alias case2 = None, \
    Alias case3 = None, Alias case4 = None, Alias case5 = None, Alias case6 = None, Alias case7 = None, \
      Alias case8 = None, Alias case9 = None) global
  {Requirements: None}
    Guard()
endfunction
Bool   function cPseudoSwitchBool(Int case, Bool elseDefault, Bool case0, Bool case1 = False, Bool case2 = False, \
    Bool case3 = False, Bool case4 = False, Bool case5 = False, Bool case6 = False, Bool case7 = False, \
      Bool case8 = False, Bool case9 = False) global
  {Requirements: None}
    Guard()
endfunction
Float  function cPseudoSwitchFloat(Int case, Float elseDefault, Float case0, Float case1 = 0.0, Float case2 = 0.0, \
    Float case3 = 0.0, Float case4 = 0.0, Float case5 = 0.0, Float case6 = 0.0, Float case7 = 0.0, \
      Float case8 = 0.0, Float case9 = 0.0) global
  {Requirements: None}
    Guard()
endfunction
Form   function cPseudoSwitchForm(Int case, Form elseDefault, Form case0, Form case1 = None, Form case2 = None, \
    Form case3 = None, Form case4 = None, Form case5 = None, Form case6 = None, Form case7 = None, \
      Form case8 = None, Form case9 = None) global
  {Requirements: None}
    Guard()
endfunction
Int    function cPseudoSwitchInt(Int case, Int elseDefault, Int case0, Int case1 = 0, Int case2 = 0, \
    Int case3 = 0, Int case4 = 0, Int case5 = 0, Int case6 = 0, Int case7 = 0, \
      Int case8 = 0, Int case9 = 0) global
  {Requirements: None}
    Guard()
endfunction
String function cPseudoSwitchString(Int case, String elseDefault, String case0, String case1 = "", String case2 = "", \
    String case3 = "", String case4 = "", String case5 = "", String case6 = "", String case7 = "", \
      String case8 = "", String case9 = "") global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Actual switch used in message.Show() output
function cActualSwitchTemplate(Int case) ; message.Show() results
  {Requirements: None}
    Guard()
endfunction

;========================= Math / Logic
  ;>>> Analysis
Bool function cIsEven(Int aInt) global
  {Requirements: None}
    Guard()
endfunction
Bool function cIsOdd(Int aInt) global
  {Requirements: None}
    Guard()
endfunction
Bool function cIsFloat(String aString) global ; may not work with very small/large numbers
  {Requirements: None}
    Guard()
endfunction
Bool function cIsInt(String aString) global
  {Requirements: None}
    Guard()
endfunction
Bool function cIsBetweenFloat(Float aValue, Float minV, Float maxV) global
  {Requirements: None}
    Guard()
endfunction
Bool function cIsBetweenInt(Int aValue, Int minV, Int maxV) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Conditional manipulation
Float function cClampFloat(Float aValue, Float minV, Float maxV, Bool usePapUtil = TRUE) global
	{Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int   function cClampInt(Int aValue, Int minV, Int maxV, Bool usePapUtil = TRUE) global
	{Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
; Adapted from PapyrusUtil function, awesome function!
Int   function cWrapIndex(Int aValue, Int endIndex, Int startIndex = 0, Bool usePapUtil = TRUE) global
	{Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
; Adapted from PapyrusUtil function, awesome function!
Int   function cWrapInt(Int aValue, Int highVal, Int lowVal = 0, Bool usePapUtil = TRUE) global
	{Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Float function cWrapFloat(Float aValue, Float maxValue, Float minValue = 0.0, Bool usePapUtil = TRUE) global
	{Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
  ;>>> Rounding

  {Requirements: None}
Float function cRoundFloat(Float aFloat, Int places = 1) global
    Guard()
endfunction
; places == places to the *left*
Int   function cRoundInt(Int aInt, Int places = 1) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Entire array calculations
Float function cArraySumFloat(Float[] aArray, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int   function cArraySumInt(Int[] aArray, Bool usePapUtil = TRUE) global
  {Requirements: None}
    Guard()
endfunction
Float function cArrayAverageFloat(Float[] aArray) global
  {Requirements: None}
    Guard()
endfunction
; remainder is dropped!
Int   function cArrayAverageInt(Int[] aArray) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Random Number Generation (no limitation aside from VM capability at this point)
Float   function cRandomNumberGenFloat(Float this, Float that, Bool usePO3 = TRUE) global
  {Requirements: None}
    Guard()
endfunction
Int     function cRandomNumberGenInt(Int this, Int that, Bool usePO3 = TRUE) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Create array of random numbers, capped at 128 indices

  ; array length capped at 128
Float[] function cArrayRandomFloats(Int arraySize = 128, Float this = 0.0, Float that = 100.0) global
  {Requirements: None}
    Guard()
endfunction
; array length capped at 128
Int[]   function cArrayRandomInts(Int arraySize = 128, Int this = 0, Int that = 100) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Hex <-> Decimal conversion
String function cD2H(Int aInt, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
Int    function cH2D(String aString) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
  ;>>> Bitwise operations (all Non-SKSE)

  ;31 bitwise operations. Returns a negative number on errors
  ;  Set iBits lower to limit the bitmask to the lower bits for efficiency - Def = 31bits
  ;    Set bOp for the bitwise operation. 0 = NOT, 1 = AND(default), 2 = OR, 3 = XOR
  ;      Set bWarn to True if you are too lazy to check the error return value, and want a notification
  ; Code from Milagros Osorio http://www.gamesas.com/bitwise-ops-t256983.html
Int function cBitwiseOp(Int i1, Int i2, Int iBits = 31, Int iOp = 1, Bool bWarn = False) Global ; Needs testing
  {Requirements: None}
    Guard()
endfunction
    ;--> cBitwiseOp provides non-SKSE functionality for these
Int function cLogicalAND(Int i1, Int i2, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
Int function cLogicalNOT(Int i1, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
Int function cLogicalOR(Int i1, Int i2, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
Int function cLogicalXOR(Int i1, Int i2, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
Int function cBitShiftL(Int aInt, Int numShifts) global
  {Requirements: None}
    Guard()
endfunction
Int function cBitShiftR(Int aInt, Int numShifts) global
  {Requirements: None}
    Guard()
endfunction

;========================= STRINGS
  ;>>> Analysis/Query

  ; Like the SKSE version, the non-SKSE version only checks the first char
  ; thank you cadpnq for the suggestion that made the non-SKSE version possible!
Bool   function cStringIsLetter(String aLetter, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
Bool   function cStringIsDigit(String aDigit, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
; This is !cStringIsDigit(aChar) && !cStringIsLetter(aChar)
; thank you cadpnq for the suggestion that made the non-SKSE version possible!
Bool   function cStringIsMiscChar(String aChar) global
  {Requirements: None}
    Guard()
endfunction
Int    function cStringFind(String inThis, String findThis, Int startIndex = 0, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
; Because the entire string must be parsed to calculate the size it is recommended to combine string handling
;   functions if possible. Non-SKSE max length 128
; thank you cadpnq for the suggestion that made the non-SKSE version possible!
Int    function cStringLength(String aString, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
; thank you cadpnq for the suggestion that made the non-SKSE version possible!
String function cStringGetNthChar(String aString, Int n, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
String function cStringSubString(String aString, Int startChar, Int numChars = 0, Bool useSKSE = TRUE) global
  {Requirements None, SKSE:Soft}
    Guard()
endfunction
  ;>>> Manipulation
String function cStringReplace(String aString, String toReplace, String withWhat = "", Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
; withThis2nd or 3rd == "*&^" allows mix/match of ""
String function cStringSetNthChar(String aString, Int a1stCharIndex, String withThis1st = "", Int a2ndCharIndex = 0, \
  String withThis2nd = "*&^", Int a3rdCharIndex = 0, String withThis3rd = "*&^") global
  {Requirements: None}
    Guard()
endfunction
  ;>>> String truncation
  ; Convenience version of cStringReplace()
String function cStringRemove(String aString, String toRemove) global
  {Requirements: None}
    Guard()
endfunction
; thank you cadpnq for the suggestion that made the non-SKSE version possible!
String function cStringLeft(String aString, Int numChars, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
; thank you cadpnq for the suggestion that made the non-SKSE version possible!
String function cStringRight(String aString, Int numChars, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
; Think of this as a combination of 'ArrayResize' a 'string length clamp' for a string
; filler can be any length desired so long as the string doesn't exceed 128 chars!
; thank you cadpnq for the suggestion that made the non-SKSE version possible!
String function cStringSetLength(String aString, Int stringLength, String filler = " ") global
  {Requirements: None}
    Guard()
endfunction
; charToTrim cannot be longer than one char (it will trim more than one just the string length can't be > 1)
; thank you cadpnq for the suggestion that made the non-SKSE version possible!
String function cStringTrimLeft(String aString, String charToTrim = " ", Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
; rewritten to allow charToTrim to be longer than one char in ***SKSE version only!*** One char only in non-SKSE
; thank you cadpnq for the suggestion that made the non-SKSE version possible!
String function cStringTrimRight(String aString, String charToTrim = " ", Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
; rewritten to allow charToTrim to be longer than one char in ***SKSE version only!*** One char only in non-SKSE
; thank you cadpnq for the suggestion that made the non-SKSE version possible!
String function cStringTrim(String aString, String charToTrim = " ", Bool useSKSE = TRUE) global ; trim both ends
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
  ;>>> String join and split
  ; for convenience ensures no comma in front
String   function cStringAddCommaList(String aString0, String aString1, String aString2 = "", \
  String aString3 = "", String aString4 = "", String aString5 = "", String aString6 = "", String aString7 = "", \
    String aString8 = "", String aString9 = "") global
  {Requirements: None}
    Guard()
endfunction
String   function cArrayJoinString(String[] aArray, String delimiterString = "", Int startIndex = 0, \
    Int numIndices = -1) global
  {Requirements: None}
    Guard()
endfunction
String   function cStringJoin(String[] aArray, String delimiterString = "", Bool usePapUtil = TRUE) global
    Guard()
endfunction
; Splits a string into an array of its characters
String[] function cStringToArray(String aString, Int numChars = -1, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
; Non-SKSE version only has to look through the *16* hex digits as opposed to all 69 ASCII chars
String[] function cStringHexToArray(String aString, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
  ;>>> Generation
String function cStringRepeat(String repeatThis, Int thisManyTimes) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Grammar/Spelling (used for dynamic message generation)

  ; useful for dynamic confirmation, progress, completion, log or error reporting messages.
  ; e.g. The function uses "save", "restore" or "remove" as an function argument.
  ; User's choice: argument == "save"
  ; 1. cConcatenate("Do you want to ", argument, "?")              == Do you want to save?
  ; 2. cConcatenate(cStringAdd_ing(argument), "...")               == Saving...
  ; 3. cConcatenate("Successfully ", cStringAdd_ed(argument), "!") == Successfully saved!
  ; now you can make a single function that adds, saves, restores, clears and/or removes something and use a single
  ;   set of dynamically constructed messages (this is just one part of that)
String function cStringAdd_ed(String aString) global ; list of words to check (expand at your leisure)
  {Requirements: None}
    Guard()
endfunction
; useful for dynamic confirmation, progress, completion, log or error reporting messages.
; e.g. The function uses "save", "restore" or "remove" as an function argument.
; User's choice: argument == "save"
; 1. cConcatenate("Do you want to ", argument, "?")              == Do you want to save?
; 2. cConcatenate(cStringAdd_ing(argument), "...")               == Saving...
; 3. cConcatenate("Successfully ", cStringAdd_ed(argument), "!") == Successfully saved!
; now you can make a single function that adds, saves, restores, clears and/or removes something and use a single
;   set of dynamically constructed messages (this is just one part of that)
String function cStringAdd_ing(String aString) global ; list of words to check (expand at your leisure)
  {Requirements: None}
    Guard()
endfunction
  ;>>> non-SKSE String parsing: Credit to cadpnq

  ; Returns next ASCII character in string without SKSE
String function cStringASCIICheck(String aString, String builtString, String[] asciiChars) global
  {Requirements: None}
    Guard()
endfunction
; Returns next hex digit in string without SKSE
String function cStringHexCheck(String aString, String builtString, String[] hexDigits) global
  {Requirements: None}
    Guard()
endfunction

;========================= FormList Functions

;Bool return is whether or not the replaced value is still there (can only remove ADDED forms)
;forceAdd forces the value to be added even if replaceThis can't be removed
; a return of TRUE == success, False == failed
Bool     function cFLReplaceValue(FormList aFormlist, Form replaceThis, Form withThis, Bool forceAdd = False) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> to/from Array
FormList function cArrayToFL(Form[] aArray, FormList aFormList, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
Form[]   function cFLToArray(FormList aFormList, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction

;========================= Array Functions

  ;>>> Analysis/Comparison/Query/Tally
Float function cArraySmallestFloat(Float[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Int   function cArraySmallestInt(Int[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Float function cArrayLargestFloat(Float[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Int   function cArrayLargestInt(Int[] aArray) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Tally
Int function cArrayCountValueActor(Actor[] aArray, Actor valueToCount = None, Bool invertIt = False, \
  Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int function cArrayCountValueAlias(Alias[] aArray, Alias valueToCount = None, Bool invertIt = False, \
  Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int function cArrayCountValueBool(Bool[] aArray, Bool valueToCount = TRUE, Bool invertIt = False, \
  Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int function cArrayCountValueFloat(Float[] aArray, Float valueToCount = 0.0, Bool invertIt = False, \
  Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int function cArrayCountValueForm(Form[] aArray, Form valueToCount = None, Bool invertIt = False, \
  Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int function cArrayCountValueInt(Int[] aArray, Int valueToCount = 0, Bool invertIt = False, \
  Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int function cArrayCountValueObjRef(ObjectReference[] aArray, ObjectReference valueToCount = None, \
  Bool invertIt = False, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int function cArrayCountValueString(String[] aArray, String valueToCount = "", Bool invertIt = False, \
  Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int function cArrayCountValueFormList(FormList aFormList, Form valueToCount = None, Bool invertIt = False) global
  {Requirements: None}
    Guard()
endfunction
    ;see also: ArraySumFloat()
    ;          ArraySumInt()
    ;          ArrayAverageFloat()
    ;          ArrayAverageInt()
  ;>>> Conversion
Bool[] function cArrayIntToBool(Int[] aArray) global
  {Requirements:None}
    Guard()
endfunction
Int[]  function cArrayBoolToInt(Int[] aArray) global
  {Requirements:None}
    Guard()
endfunction
Form[] function cArrayActorToActorBase(Actor[] aArray) global
  {Requirements:None}
    Guard()
endfunction
Form[] function cArrayObjRefToBaseObject(ObjectReference[] aArray) global
  {Requirements:None}
    Guard()
endfunction
   ;>>> Returns array of indices == valueToFind, also can provide the inverse
Int[] function cArrayGetValueIndicesActor(Actor[] aArray, Actor valueToFind = None, Bool invertIt = False) global
  {Requirements: None}
    Guard()
endfunction
Int[] function cArrayGetValueIndicesAlias(Alias[] aArray, Alias valueToFind = None, Bool invertIt = False) global
  {Requirements: None}
    Guard()
endfunction
Int[] function cArrayGetValueIndicesBool(Bool[] aArray, Bool valueToFind = False, Bool invertIt = False) global
  {Requirements: None}
    Guard()
endfunction
Int[] function cArrayGetValueIndicesFloat(Float[] aArray, Float valueToFind = 0.0, Bool invertIt = False) global
  {Requirements: None}
    Guard()
endfunction
Int[] function cArrayGetValueIndicesForm(Form[] aArray, Form valueToFind = None, Bool invertIt = False) global
  {Requirements: None}
    Guard()
endfunction
Int[] function cArrayGetValueIndicesInt(Int[] aArray, Int valueToFind = 0, Bool invertIt = False) global
  {Requirements: None}
    Guard()
endfunction
Int[] function cArrayGetValueIndicesObjRef(ObjectReference[] aArray, ObjectReference valueToFind = None, \
  Bool invertIt = False) global
  {Requirements: None}
    Guard()
endfunction
Int[] function cArrayGetValueIndicesString(String[] aArray, String valueToFind = "", Bool invertIt = False) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Yes...This is .Find() and rFind() **used for Bool invert** (first value that != aValue)
Int function cArrayFindActor(Actor[] aArray, Actor aValue = None, Int startAt = 0, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
Int function cArrayFindAlias(Alias[] aArray, Alias aValue = None, Int startAt = 0, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
Int function cArrayFindBool(Bool[] aArray, Bool aValue = False, Int startAt = 0, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
Int function cArrayFindFloat(Float[] aArray, Float aValue = 0.0, Int startAt = 0, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
Int function cArrayFindForm(Form[] aArray, Form aValue = None, Int startAt = 0, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
; kept for invertIt
Int function cArrayFindInt(Int[] aArray, Int aValue = 0, Int startAt = 0, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
; kept for invert
Int function cArrayFindObjRef(ObjectReference[] aArray, ObjectReference aValue = None, Int startAt = 0, \
  Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
; kept for invert
Int function cArrayFindString(String[] aArray, String aValue = "", Int startAt = 0, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
; use it for invertIt
; startAt requires a positive int and counts backwards from the end
Int function cArrayRFindActor(Actor[] aArray, Actor aValue = None, Int startAt = 0, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
; use it for invertIt
; startAt requires a positive int and counts backwards from the end
Int function cArrayRFindAlias(Alias[] aArray, Alias aValue = None, Int startAt = 0, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
; use it for invertIt
; startAt requires a positive int and counts backwards from the end
Int function cArrayRFindBool(Bool[] aArray, Bool aValue = False, Int startAt = 0, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
; use it for invertIt
; startAt requires a positive int and counts backwards from the end
Int function cArrayRFindFloat(Float[] aArray, Float aValue = 0.0, Int startAt = 0, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
; use it for invertIt
; startAt requires a positive int and counts backwards from the end
Int function cArrayRFindForm(Form[] aArray, Form aValue = None, Int startAt = 0, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
; use it for invertIt
; startAt requires a positive int and counts backwards from the end
Int function cArrayRFindInt(Int[] aArray, Int aValue = 0, Int startAt = 0, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
; use it for invertIt
; startAt requires a positive int and counts backwards from the end
Int function cArrayRFindObjRef(ObjectReference[] aArray, ObjectReference aValue = None, Int startAt = 0, \
  Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
; used for invertIt ; -1 == last element
Int function cArrayRFindString(String[] aArray, String aValue = "", Int startAt = -1, Bool invertIt = TRUE) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Replace value

  ; forceAll == TRUE replaces EVERYTHING with aValue
Actor[]  function cArrayReplaceActor(Actor[] aArray, Actor replaceThis, Actor withThis, Bool forceAll = False) global
  {Requirements: None}
    Guard()
endfunction
; forceAll == TRUE replaces EVERYTHING with aValue
Alias[]  function cArrayReplaceAlias(Alias[] aArray, Alias replaceThis, Alias withThis, Bool forceAll = False) global
  {Requirements: None}
    Guard()
endfunction
; forceAll == TRUE replaces EVERYTHING with aValue
Bool[]   function cArrayReplaceBool(Bool[] aArray, Bool replaceThis, Bool withThis, Bool forceAll = False) global
  {Requirements: None}
    Guard()
endfunction
; forceAll == TRUE replaces EVERYTHING with aValue
Float[]  function cArrayReplaceFloat(Float[] aArray, Float replaceThis, Float withThis, Bool forceAll = False) global
  {Requirements: None}
    Guard()
endfunction
; forceAll == TRUE replaces EVERYTHING with aValue
Form[]   function cArrayReplaceForm(Form[] aArray, Form replaceThis, Form withThis, Bool forceAll = False) global
  {Requirements: None}
    Guard()
endfunction
; forceAll == TRUE replaces EVERYTHING with aValue
Int[]    function cArrayReplaceInt(Int[] aArray, Int replaceThis, Int withThis, Bool forceAll = False) global
  {Requirements: None}
    Guard()
endfunction
; forceAll == TRUE replaces EVERYTHING with aValue
ObjectReference[] function cArrayReplaceObjRef(ObjectReference[] aArray, ObjectReference replaceThis, \
  ObjectReference withThis, Bool forceAll = False) global
  {Requirements: None}
    Guard()
endfunction
; forceAll == TRUE replaces EVERYTHING with aValue
String[] function cArrayReplaceString(String[] aArray, String replaceThis, String withThis, Bool forceAll = False) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> 1) allows return via .Find(), returnIndex == -1 returns 1st value that casts as TRUE
Actor  function cArrayReturnActor(Actor[] aArray, Int returnIndex = -1) global
  {Requirements: None}
    Guard()
endfunction
Alias  function cArrayReturnAlias(Alias[] aArray, Int returnIndex = -1) global
  {Requirements: None}
    Guard()
endfunction
Bool   function cArrayReturnBool(Bool[] aArray, Int returnIndex = -1) global
  {Requirements: None}
    Guard()
endfunction
Float  function cArrayReturnFloat(Float[] aArray, Int returnIndex = -1) global
  {Requirements: None}
    Guard()
endfunction
Form   function cArrayReturnForm(Form[] aArray, Int returnIndex = -1) global
  {Requirements: None}
    Guard()
endfunction
Int    function cArrayReturnInt(Int[] aArray, Int returnIndex = -1) global
  {Requirements: None}
    Guard()
endfunction
ObjectReference  function cArrayReturnObjRef(ObjectReference[] aArray, Int returnIndex = -1) global
  {Requirements: None}
    Guard()
endfunction
String function cArrayReturnString(String[] aArray, Int returnIndex = -1) global
  {Requirements: None}
    Guard()
endfunction
  ;cArrayFirstIndex.*() == cArrayFind.*(aArray, (None/0/0.0/""), invertIt == TRUE)
  ;>>> Analyze: returns array [0] == smallest value, [1] == its index, [2] == largest value,
  ;      [3] == its index, [4] == array length, [5] == array sum (!string), [6] == array average (!string),
  ;      (Int[] only-> [7] == remainder of average)

  ; returns array [0] == smallest value, [1] == its index, [2] == largest value, [3] == its index,
  ;   [4] == array length, [5] == array sum, [6] == array average
Float[]  function cArrayAnalyzeFloat(Float[] aArray) global
  {Requirements: None}
    Guard()
endfunction
; returns array [0] == smallest value, [1] == its index, [2] == largest value, [3] == its index,
;   [4] == array length, [5] == array sum, [6] == array average, [7] == average remainder (if any)
Int[]    function cArrayAnalyzeInt(Int[] aArray) global
  {Requirements: None}
    Guard()
endfunction
; returns array [0] == smallest value (lex), [1] == its index, [2] == largest value (lex), [3] == its index,
;   [4] == array length
String[] function cArrayAnalyzeString(String[] aArray) global
  {Requirements: None}
    Guard()
endfunction

;====== Manipulation
  ;>>>  Housekeeping (returns original)
    ;---@ Three(2 for objects) in one
Actor[]  function cArrayTidyActor(Actor[] aArray, Bool clearNone = False, Bool clearDupes = False) global
  {Requirements: None}
    Guard()
endfunction
Alias[]  function cArrayTidyAlias(Alias[] aArray, Bool clearNone = False, Bool clearDupes = False) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Float[]  function cArrayTidyFloat(Float[] aArray, Bool clearZero = False, Bool clearDupes = False,  \
    Bool sortIt = False) global
  {Requirements: None}
    Guard()
endfunction
Form[]   function cArrayTidyForm(Form[] aArray, Bool clearNone = False, Bool clearDupes = False) global
  {Requirements: None}
    Guard()
endfunction
Int[]    function cArrayTidyInt(Int[] aArray, Bool clearZero = False, Bool clearDupes = False,  \
    Bool sortIt = False) global
  {Requirements: None}
    Guard()
endfunction
ObjectReference[] function cArrayTidyObjRef(ObjectReference[] aArray, Bool clearNone = False, \
  Bool clearDupes = False) global
  {Requirements: None}
    Guard()
endfunction
String[] function cArrayTidyString(String[] aArray, Bool clearEmpty = False, Bool clearDupes = False,  \
    Bool sortIt = False) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> HowTo: RemoveValue
    ;cArrayReplace.*(replaceThis = (None,0,0.0,""), withThis = filler)
    ;cArrayClearNone.*() == cArrayRemoveValue.*(aArray, None)
    ;cArrayClearZero.*() == cArrayRemoveValue.*(aArray, 0) <- 0.0 (Int/Float)
    ;cArrayClearBlank() == cArrayRemoveValueString(aArray, "") (String)
    ;cArrayClearEmpty() == cArrayRemoveValueString(aArray, "") (String)
  ;>>> Remove duplicate records no Bool version, only returns 1-2 index array
Actor[]  function cArrayRemoveDuplicatesActor(Actor[] aArray, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Alias[]  function cArrayRemoveDuplicatesAlias(Alias[] aArray, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Float[]  function cArrayRemoveDuplicatesFloat(Float[] aArray, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Form[]   function cArrayRemoveDuplicatesForm(Form[] aArray, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int[]    function cArrayRemoveDuplicatesInt(Int[] aArray, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
ObjectReference[] function cArrayRemoveDuplicatesObjRef(ObjectReference[] aArray, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
String[] function cArrayRemoveDuplicatesString(String[] aArray, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
  ;>>> Swap Indices
function cArraySwapIndexActor(Actor[] aArray, Int index1, Int index2) global
  {Requirements: None}
    Guard()
endfunction
function cArraySwapIndexAlias(Alias[] aArray, Int index1, Int index2) global
  {Requirements: None}
    Guard()
endfunction
function cArraySwapIndexBool(Bool[] aArray, Int index1, Int index2) global
  {Requirements: None}
    Guard()
endfunction
function cArraySwapIndexFloat(Float[] aArray, Int index1, Int index2) global
  {Requirements: None}
    Guard()
endfunction
function cArraySwapIndexForm(Form[] aArray, Int index1, Int index2) global
  {Requirements: None}
    Guard()
endfunction
function cArraySwapIndexInt(Int[] aArray, Int index1, Int index2) global
  {Requirements: None}
    Guard()
endfunction
function cArraySwapIndexObjRef(ObjectReference[] aArray, Int index1, Int index2) global
  {Requirements: None}
    Guard()
endfunction
function cArraySwapIndexString(String[] aArray, Int index1, Int index2) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Remove all trailing indices == trailingValue

  ; this assumes that the last indices are not *supposed* to be trailingValue
Actor[]  function cArrayRemoveTrailingActor(Actor[] aArray, Actor trailingValue = None) global
  {Requirements: None}
    Guard()
endfunction
; this assumes that the last indices are not *supposed* to be trailingValue
Alias[]  function cArrayRemoveTrailingAlias(Alias[] aArray, Alias trailingValue = None) global
  {Requirements: None}
    Guard()
endfunction
; this assumes that the last indices are not *supposed* to be trailingValue
Bool[]   function cArrayRemoveTrailingBool(Bool[] aArray, Bool trailingValue = False) global
  {Requirements: None}
    Guard()
endfunction
; this assumes that the last indices are not *supposed* to be trailingValue
Float[]  function cArrayRemoveTrailingFloat(Float[] aArray, Float trailingValue = 0.0) global
  {Requirements: None}
    Guard()
endfunction
; this assumes that the last indices are not *supposed* to be trailingValue
Form[]   function cArrayRemoveTrailingForm(Form[] aArray, Form trailingValue = None) global
  {Requirements: None}
    Guard()
endfunction
; this assumes that the last indices are not *supposed* to be trailingValue
Int[]    function cArrayRemoveTrailingInt(Int[] aArray, Int trailingValue = 0) global
  {Requirements: None}
    Guard()
endfunction
; this assumes that the last indices are not *supposed* to be trailingValue
ObjectReference[] function cArrayRemoveTrailingObjRef(ObjectReference[] aArray, \
  ObjectReference trailingValue = None) global
  {Requirements: None}
    Guard()
endfunction
; this assumes that the last indices are not *supposed* to be trailingValue
String[] function cArrayRemoveTrailingString(String[] aArray, String trailingValue = "") global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Shift all values that cast to Bool as False to the end
Actor[]  function cArrayCompactActor(Actor[] aArray, Actor shiftValue = None) global
  {Requirements: None}
    Guard()
endfunction
Alias[]  function cArrayCompactAlias(Alias[] aArray, Alias shiftValue = None) global
  {Requirements: None}
    Guard()
endfunction
Float[]  function cArrayCompactFloat(Float[] aArray, Float shiftValue = 0.0) global
  {Requirements: None}
    Guard()
endfunction
Form[]   function cArrayCompactForm(Form[] aArray, Form shiftValue = None) global
  {Requirements: None}
    Guard()
endfunction
Int[]    function cArrayCompactInt(Int[] aArray, Int shiftValue = 0) global
  {Requirements: None}
    Guard()
endfunction
ObjectReference[] function cArrayCompactObjRef(ObjectReference[] aArray, ObjectReference shiftValue = None) global
  {Requirements: None}
    Guard()
endfunction
String[] function cArrayCompactString(String[] aArray, String shiftValue = "") global
  {Requirements: None}
    Guard()
endfunction
;--> ARRAY ORDER
  ;>>> Sort (doesn't return an array as it sorts actual array)

; Only for use as part of the cArraySortFloat function
Int function cArrayPartitionFloat(Float[] aArray, Int low, Int high) global
  {Requirements: None}
    Guard()
endfunction
function cArraySortFloat(Float[] aArray, Int low = -1, Int high = -1, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
; Only for use as part of the cArraySortInt function
Int function cArrayPartitionInt(Int[] aArray, Int low, Int high) global
  {Requirements: None}
    Guard()
endfunction
function cArraySortInt(Int[] aArray, Int low = -1, Int high = -1, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
; String QuickSort Bugged currently. Use cArrayBubbleSortString() for now
;/
Int function cArrayPartitionString(String[] aArray, Int low, Int high) global
  {Requirements: None}
  Guard()
  return -1
endfunction
function cArrayQuickSortString(String[] aArray, Int low = -1, Int high = -1) global
  {Requirements: None}
  Guard()
endfunction
/;
  ;>>> Returns new array [cArraySortFloat/Int() faster but no return]
Float[]  function cArrayBubbleSortFloat(Float[] aArray, Bool invertIt = False, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int[]    function cArrayBubbleSortInt(Int[] aArray, Bool invertIt = False, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
String[] function cArrayBubbleSortString(String[] aArray, Bool invertIt = False, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
  ;>>> Reverse order (returns new array)
Actor[]  function cArrayReverseActor(Actor[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Alias[]  function cArrayReverseAlias(Alias[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Bool[]   function cArrayReverseBool(Bool[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Float[]  function cArrayReverseFloat(Float[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Form[]   function cArrayReverseForm(Form[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Int[]    function cArrayReverseInt(Int[] aArray) global
  {Requirements: None}
    Guard()
endfunction
ObjectReference[] function cArrayReverseObjRef(ObjectReference[] aArray) global
  {Requirements: None}
    Guard()
endfunction
String[] function cArrayReverseString(String[] aArray) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> 'fill' empty values
;--> cArrayReplace.*(replaceThis = (None,0,0.0,""), withThis = filler)
  ;>>> Clear all values
;--> 'clear' == cArrayReplace.*(replaceThis = (irrelevant), withThis = (None,0,0.0,""), forceAll = TRUE)
; OR
;--> 'clear' == cArrayCreate.*()
  ;>>> Add new value to end
;--> 'push' == cArrayResize.*(newSize = aArray.length + 1, filler = new value)
  ;>>> Remove Index [allows Pop & Shift behavior] (returns new array)
;--> 'shift' mimic cArrayRemoveIndex.*(indexToRemove == 0)
;--> 'pop'   mimic cArrayRemoveIndex.*(indexToRemove == aArray.length)
  ;>>> Add new index 'unshift'
;--> use cArrayMerge.*
Actor[]  function cArrayRemoveIndexActor(Actor[] aArray, Int indexToRemove = 0, Bool usePapUtil = TRUE) global
  ; indexToRemove == -1 means the last index
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Alias[]  function cArrayRemoveIndexAlias(Alias[] aArray, Int indexToRemove = 0, Bool usePapUtil = TRUE) global
  ; indexToRemove == -1 means the last index
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Bool[]   function cArrayRemoveIndexBool(Bool[] aArray, Int indexToRemove = 0, Bool usePapUtil = TRUE) global
  ; indexToRemove == -1 means the last index
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Float[]  function cArrayRemoveIndexFloat(Float[] aArray, Int indexToRemove = 0, Bool usePapUtil = TRUE) global
  ; indexToRemove == -1 means the last index
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Form[]   function cArrayRemoveIndexForm(Form[] aArray, Int indexToRemove = 0, Bool usePapUtil = TRUE) global
  ; indexToRemove == -1 means the last index
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int[]    function cArrayRemoveIndexInt(Int[] aArray, Int indexToRemove = 0, Bool usePapUtil = TRUE) global
  ; indexToRemove == -1 means the last index
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
ObjectReference[] function cArrayRemoveIndexObjRef(ObjectReference[] aArray, Int indexToRemove = 0, \
  Bool usePapUtil = TRUE) global
  ; indexToRemove == -1 means the last index
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
String[] function cArrayRemoveIndexString(String[] aArray, Int indexToRemove = 0, Bool usePapUtil = TRUE) global
  ; indexToRemove == -1 means the last index
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
  ;>>> Supply with array of ints and this removes those IndICES then returns new array
Actor[]  function cArrayRemoveIndicesActor(Actor[] aArray, Int[] indicesToRemove, Int stopLength = 0) global
  {Requirements: None}
    Guard()
endfunction
Alias[]  function cArrayRemoveIndicesAlias(Alias[] aArray, Int[] indicesToRemove, Int stopLength = 0) global
  {Requirements: None}
    Guard()
endfunction
Bool[]   function cArrayRemoveIndicesBool(Bool[] aArray, Int[] indicesToRemove, Int stopLength = 0) global
  {Requirements: None}
    Guard()
endfunction
Float[]  function cArrayRemoveIndicesFloat(Float[] aArray, Int[] indicesToRemove, Int stopLength = 0) global
  {Requirements: None}
    Guard()
endfunction
Form[]   function cArrayRemoveIndicesForm(Form[] aArray, Int[] indicesToRemove, Int stopLength = 0) global
  {Requirements: None}
    Guard()
endfunction
Int[]    function cArrayRemoveIndicesInt(Int[] aArray, Int[] indicesToRemove, Int stopLength = 0) global
  {Requirements: None}
    Guard()
endfunction
ObjectReference[] function cArrayRemoveIndicesObjRef(ObjectReference[] aArray, Int[] indicesToRemove, \
  Int stopLength = 0) global
  {Requirements: None}
    Guard()
endfunction
String[] function cArrayRemoveIndicesString(String[] aArray, Int[] indicesToRemove, Int stopLength = 0) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> *Removes* all indices of said value (returns new array)
Actor[]  function cArrayRemoveValueActor(Actor[] aArray, Actor toRemove = None, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Alias[]  function cArrayRemoveValueAlias(Alias[] aArray, Alias toRemove = None, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Bool[]   function cArrayRemoveValueBool(Bool[] aArray, Bool toRemove = False, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Float[]  function cArrayRemoveValueFloat(Float[] aArray, Float toRemove = 0.0, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Form[]   function cArrayRemoveValueForm(Form[] aArray, Form toRemove = None, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int[]    function cArrayRemoveValueInt(Int[] aArray, Int toRemove = 0, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
ObjectReference[] function cArrayRemoveValueObjRef(ObjectReference[] aArray, ObjectReference toRemove = None, \
  Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
String[] function cArrayRemoveValueString(String[] aArray, String toRemove = "", Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
  ;>>> Array copying
    ;--> Returns new array copy
Actor[]  function cArrayCopyActor(Actor[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Alias[]  function cArrayCopyAlias(Alias[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Bool[]   function cArrayCopyBool(Bool[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Float[]  function cArrayCopyFloat(Float[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Form[]   function cArrayCopyForm(Form[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Int[]    function cArrayCopyInt(Int[] aArray) global
  {Requirements: None}
    Guard()
endfunction
ObjectReference[] function cArrayCopyObjRef(ObjectReference[] aArray) global
  {Requirements: None}
    Guard()
endfunction
String[] function cArrayCopyString(String[] aArray) global
  {Requirements: None}
    Guard()
endfunction
  ;--> Copies aArray1 to aArray2 then returns aArray2

; just copies one array to another, can be used for arrays of any size whether SKSE is installed or not
Actor[]  function cArrayCopyToActor(Actor[] aArray1, Actor[] aArray2, Actor filler = None) global
  {Requirements: None}
    Guard()
endfunction
; just copies one array to another, can be used for arrays of any size whether SKSE is installed or not
Alias[]  function cArrayCopyToAlias(Alias[] aArray1, Alias[] aArray2, Alias filler = None) global
  {Requirements: None}
    Guard()
endfunction
; just copies one array to another, can be used for arrays of any size whether SKSE is installed or not
Bool[]   function cArrayCopyToBool(Bool[] aArray1, Bool[] aArray2, Bool filler = False) global
  {Requirements: None}
    Guard()
endfunction
; just copies one array to another, can be used for arrays of any size whether SKSE is installed or not
Float[]  function cArrayCopyToFloat(Float[] aArray1, Float[] aArray2, Float filler = 0.0) global
  {Requirements: None}
    Guard()
endfunction
; just copies one array to another, can be used for arrays of any size whether SKSE is installed or not
Form[]   function cArrayCopyToForm(Form[] aArray1, Form[] aArray2, Form filler = None) global
  {Requirements: None}
    Guard()
endfunction
; just copies one array to another, can be used for arrays of any size whether SKSE is installed or not
Int[]    function cArrayCopyToInt(Int[] aArray1, Int[] aArray2, Int filler = 0) global
  {Requirements: None}
    Guard()
endfunction
; just copies one array to another, can be used for arrays of any size whether SKSE is installed or not
ObjectReference[] function cArrayCopyToObjRef(ObjectReference[] aArray1, ObjectReference[] aArray2, \
  ObjectReference filler = None) global
  {Requirements: None}
    Guard()
endfunction
; just copies one array to another, can be used for arrays of any size whether SKSE is installed or not
String[] function cArrayCopyToString(String[] aArray1, String[] aArray2, String filler = "") global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Resizing (mixed return, SKSE = resize original, vanilla = new copy)
    ; clampMinLength, clampMaxLength allows 'automated' conditional length
Actor[]  function cArrayResizeActor(Actor[] aArray, Int newSize, Actor filler = None, Int clampMinLength = -1, \
  Int clampMaxLength = -1, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Alias[]  function cArrayResizeAlias(Alias[] aArray, Int newSize, Alias filler = None, Int clampMinLength = -1, \
  Int clampMaxLength = -1, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Bool[]   function cArrayResizeBool(Bool[] aArray, Int newSize, Bool filler = False, Int clampMinLength = -1, \
  Int clampMaxLength = -1, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Float[]  function cArrayResizeFloat(Float[] aArray, Int newSize, Float filler = 0.0, Int clampMinLength = -1, \
  Int clampMaxLength = -1, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Form[]   function cArrayResizeForm(Form[] aArray, Int newSize, Form filler = None, Int clampMinLength = -1, \
  Int clampMaxLength = -1, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int[]    function cArrayResizeInt(Int[] aArray, Int newSize, Int filler = 0, Int clampMinLength = -1, \
  Int clampMaxLength = -1, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
ObjectReference[] function cArrayResizeObjRef(ObjectReference[] aArray, Int newSize, ObjectReference filler = None, \
  Int clampMinLength = -1, Int clampMaxLength = -1, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
String[] function cArrayResizeString(String[] aArray, Int newSize, String filler = "", Int clampMinLength = -1, \
  Int clampMaxLength = -1, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
  ;>>> Slice copies a portion of aArray to new array and returns it
Actor[]  function cArraySliceActor(Actor[] aArray, Int fromIndex, Int toIndex = 0, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Alias[]  function cArraySliceAlias(Alias[] aArray, Int fromIndex, Int toIndex = 0, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Bool[]   function cArraySliceBool(Bool[] aArray, Int fromIndex, Int toIndex = 0, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Float[]  function cArraySliceFloat(Float[] aArray, Int fromIndex, Int toIndex = 0, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Form[]   function cArraySliceForm(Form[] aArray, Int fromIndex, Int toIndex = 0, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
Int[]    function cArraySliceInt(Int[] aArray, Int fromIndex, Int toIndex = 0, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
ObjectReference[] function cArraySliceObjRef(ObjectReference[] aArray, Int fromIndex, Int toIndex = 0, \
  Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
String[] function cArraySliceString(String[] aArray, Int fromIndex, Int toIndex = 0, Bool usePapUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction
  ;>>> Inserts an array into another (returns new array)
Actor[]  function cArraySpliceActor(Actor[] aArray, Actor[] toInsert, Int insertAtIndex = 0) global
  {Requirements: None}
    Guard()
endfunction
Alias[]  function cArraySpliceAlias(Alias[] aArray, Alias[] toInsert, Int insertAtIndex = 0) global
  {Requirements: None}
    Guard()
endfunction
Bool[]   function cArraySpliceBool(Bool[] aArray, Bool[] toInsert, Int insertAtIndex = 0) global
  {Requirements: None}
    Guard()
endfunction
Float[]  function cArraySpliceFloat(Float[] aArray, Float[] toInsert, Int insertAtIndex = 0) global
  {Requirements: None}
    Guard()
endfunction
Form[]   function cArraySpliceForm(Form[] aArray, Form[] toInsert, Int insertAtIndex = 0) global
  {Requirements: None}
    Guard()
endfunction
Int[]    function cArraySpliceInt(Int[] aArray, Int[] toInsert, Int insertAtIndex = 0) global
  {Requirements: None}
    Guard()
endfunction
ObjectReference[] function cArraySpliceObjRef(ObjectReference[] aArray, ObjectReference[] toInsert, \
  Int insertAtIndex = 0) global
  {Requirements: None}
    Guard()
endfunction
String[] function cArraySpliceString(String[] aArray, String[] toInsert, Int insertAtIndex = 0) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> Merging (returns new array)
Actor[]  function cArrayMergeActor(Actor[] aArray1, Actor[] aArray2, Bool useSKSE = TRUE, Bool usePapUtil = TRUE) global
  {Requirements: None, SKSE:Soft, PapyrusUtil:Soft}
    Guard()
endfunction
Alias[]  function cArrayMergeAlias(Alias[] aArray1, Alias[] aArray2, Bool useSKSE = TRUE, Bool usePapUtil = TRUE) global
  {Requirements: None, SKSE:Soft, PapyrusUtil:Soft}
    Guard()
endfunction
Bool[]   function cArrayMergeBool(Bool[] aArray1, Bool[] aArray2, Bool useSKSE = TRUE, Bool usePapUtil = TRUE) global
  {Requirements: None, SKSE:Soft, PapyrusUtil:Soft}
    Guard()
endfunction
Float[]  function cArrayMergeFloat(Float[] aArray1, Float[] aArray2, Bool useSKSE = TRUE, Bool usePapUtil = TRUE) global
  {Requirements: None, SKSE:Soft, PapyrusUtil:Soft}
    Guard()
endfunction
Form[]   function cArrayMergeForm(Form[] aArray1, Form[] aArray2, Bool useSKSE = TRUE, Bool usePapUtil = TRUE) global
  {Requirements: None, SKSE:Soft, PapyrusUtil:Soft}
    Guard()
endfunction
Int[]    function cArrayMergeInt(Int[] aArray1, Int[] aArray2, Bool useSKSE = TRUE, Bool usePapUtil = TRUE) global
  {Requirements: None, SKSE:Soft, PapyrusUtil:Soft}
    Guard()
endfunction
ObjectReference[] function cArrayMergeObjRef(ObjectReference[] aArray1, ObjectReference[] aArray2, Bool useSKSE = TRUE,\
  Bool usePapUtil = TRUE) global
  {Requirements: None, SKSE:Soft, PapyrusUtil:Soft}
    Guard()
endfunction
String[] function cArrayMergeString(String[] aArray1, String[] aArray2, Bool useSKSE = TRUE, \
  Bool usePapUtil = TRUE) global
  {Requirements: None, SKSE:Soft, PapyrusUtil:Soft}
    Guard()
endfunction

;====== CREATION
  ;>>> See cStringToArray() in "String" section above
  ;>>> Array from separated values (10 each)
Actor[]  function cArrayFromActors(Actor aActor0, Actor aActor1 = None, Actor aActor2 = None, \
    Actor aActor3 = None, Actor aActor4 = None, Actor aActor5 = None, Actor aActor6 = None, Actor aActor7 = None, \
      Actor aActor8 = None, Actor aActor9 = None, Bool skipTrailingNone = TRUE) global
  {Requirements: None}
    Guard()
endfunction
Alias[]  function cArrayFromAliases(Alias aAlias0, Alias aAlias1 = None, Alias aAlias2 = None, \
    Alias aAlias3 = None, Alias aAlias4 = None, Alias aAlias5 = None, Alias aAlias6 = None, Alias aAlias7 = None, \
      Alias aAlias8 = None, Alias aAlias9 = None, Bool skipTrailingNone = TRUE) global
  {Requirements: None}
    Guard()
endfunction
Float[]  function cArrayFromFloats(Float aFloat0, Float aFloat1 = 0.0, Float aFloat2 = 0.0, \
    Float aFloat3 = 0.0, Float aFloat4 = 0.0, Float aFloat5 = 0.0, Float aFloat6 = 0.0, Float aFloat7 = 0.0, \
      Float aFloat8 = 0.0, Float aFloat9 = 0.0, Bool skipTrailingZero = TRUE) global
  {Requirements: None}
    Guard()
endfunction
Form[]   function cArrayFromForms(Form aForm0, Form aForm1 = None, Form aForm2 = None, Form aForm3 = None, \
    Form aForm4 = None, Form aForm5 = None, Form aForm6 = None, Form aForm7 = None, Form aForm8 = None, \
      Form aForm9 = None, Bool skipTrailingNone = TRUE) global
  {Requirements: None}
    Guard()
endfunction
Int[]    function cArrayFromInts(Int aInt0, Int aInt1 = 0, Int aInt2 = 0, \
    Int aInt3 = 0, Int aInt4 = 0, Int aInt5 = 0, Int aInt6 = 0, Int aInt7 = 0, \
      Int aInt8 = 0, Int aInt9 = 0, Bool skipTrailingZero = TRUE) global
  {Requirements: None}
    Guard()
endfunction
ObjectReference[]  function cArrayFromObjRefs(ObjectReference aObjRef0, ObjectReference aObjRef1 = None, \
   ObjectReference aObjRef2 = None, ObjectReference aObjRef3 = None, ObjectReference aObjRef4 = None, \
    ObjectReference aObjRef5 = None, ObjectReference aObjRef6 = None, ObjectReference aObjRef7 = None, \
      ObjectReference aObjRef8 = None, ObjectReference aObjRef9 = None, Bool skipTrailingNone = TRUE) global
  {Requirements: None}
    Guard()
endfunction
String[] function cArrayFromStrings(String aString0, String aString1 = "", String aString2 = "", \
    String aString3 = "", String aString4 = "", String aString5 = "", String aString6 = "", String aString7 = "", \
      String aString8 = "", String aString9 = "", Bool skipTrailingEmpty = TRUE) global
  {Requirements: None}
    Guard()
endfunction
  ;>>> None arrays (great for papyrus array spam handling, also 'resets' an array variable)
Actor[]       function cArrayNoneActor() global
  {Requirements: None}
    Guard()
endfunction
Alias[]       function cArrayNoneAlias() global
  {Requirements: None}
    Guard()
endfunction
Bool[]        function cArrayNoneBool() global
  {Requirements: None}
    Guard()
endfunction
Float[]       function cArrayNoneFloat() global
  {Requirements: None}
    Guard()
endfunction
Form[]        function cArrayNoneForm() global
  {Requirements: None}
    Guard()
endfunction
Int[]         function cArrayNoneInt() global
  {Requirements: None}
    Guard()
endfunction
ObjectReference[] function cArrayNoneObjectReference() global
  {Requirements: None}
    Guard()
endfunction
ObjectReference[] function cArrayNoneObjRef() global
  {Requirements: None}
    Guard()
endfunction
String[]      function cArrayNoneString() global
  {Requirements: None}
    Guard()
endfunction

;------------------------------------------------------------------------------
;-----------------------------c Laboratory Functions---------------------------
;------------------------------------------------------------------------------

  ;>>> Perform pretty much any combination of comparisons against all values in an array
  ;      62 functions for the price of 5 (int, float & String have 14 each)

;Valid operators: ==, !=, &&, ||, !&&, &&!, !&&!, !||, ||!, !||! (10 functions in one)
;  e.g. !&& == !this && that ; &&! == this && !that ; !&&! == !this && !that
Bool[] function cArrayDynamicComparisonBool(String operators, Bool this, Bool[] thatArray) global
  {Requirements: None}
    Guard()
endfunction
;Valid operators: ==, !=, &&, ||, !&&, &&!, !&&!, !||, ||!, !||! (10 functions in one)
;  e.g. !&& == !this && that ; &&! == this && !that ; !&&! == !this && !that
Bool[] function cArrayDynamicComparisonFloat(String operators, Float this, Float[] thatArray) global
  {Requirements: None}
    Guard()
endfunction
;Valid operators: ==, !=, &&, ||, !&&, &&!, !&&!, !||, ||!, !||!
;  e.g. !&& == !this && that ; &&! == this && !that ; !&&! == !this && !that
Bool[] function cArrayDynamicComparisonForm(String operators, Form this, Form[] thatArray) global
  {Requirements: None}
    Guard()
endfunction
;Valid operators: ==, !=, &&, ||, !&&, &&!, !&&!, !||, ||!, !||!
;  e.g. !&& == !this && that ; &&! == this && !that ; !&&! == !this && !that
Bool[] function cArrayDynamicComparisonInt(String operators, Int this, Int[] thatArray) global
  {Requirements: None}
    Guard()
endfunction
;Valid operators: ==, !=, &&, ||, !&&, &&!, !&&!, !||, ||!, !||!
;  e.g. !&& == !this && that ; &&! == this && !that ; !&&! == !this && !that
Bool[] function cArrayDynamicComparisonString(String operators, String this, String[] thatArray) global
  {Requirements: None}
    Guard()
endfunction
;>>> Base functions for array comparisons, 62 functions for the price of 5 (int, float & String have 14 each)

;Valid operators: ==, !=, &&, ||, !&&, &&!, !&&!, !||, ||!, !||!
;e.g. !&& == !this && that ; &&! == this && !that ; !&&! == !this && !that
Bool   function cDynamicComparisonBool(String operators, Bool this, Bool that) global
  {Requirements: None}
    Guard()
endfunction
;Valid operators: ==, !=, <, <=, >, >=, &&, ||, !&&, &&!, !&&!, !||, ||!, !||!
;e.g. !&& == !this && that ; &&! == this && !that ; !&&! == !this && !that
Bool   function cDynamicComparisonFloat(String operators, Float this, Float that) global
  {Requirements: None}
    Guard()
endfunction
;Valid operators: ==, !=, &&, ||, !&&, &&!, !&&!, !||, ||!, !||!
;e.g. !&& == !this && that ; &&! == this && !that ; !&&! == !this && !that
Bool   function cDynamicComparisonForm(String operators, Form this, Form that) global
  {Requirements: None}
    Guard()
endfunction
;Valid operators: ==, !=, <, <=, >, >=, &&, ||, !&&, &&!, !&&!, !||, ||!, !||!
;e.g. !&& == !this && that ; &&! == this && !that ; !&&! == !this && !that
Bool   function cDynamicComparisonInt(String operators, Int this, Int that) global
  {Requirements: None}
    Guard()
endfunction
;Valid operators: ==, !=, <, <=, >, >=, &&, ||, !&&, &&!, !&&!, !||, ||!, !||!
;e.g. !&& == !this && that ; &&! == this && !that ; !&&! == !this && !that
Bool   function cDynamicComparisonString(String operators, String this, String that) global
  {Requirements: None}
    Guard()
endfunction

;>>> 20 functions for the price of 3

;Valid operators: +, -, /, *, **, ^, pow
Float[]  function cArrayDynamicOperationFloat(String operation, Float this, Float[] thatArray) global
  {Requirements: None}
    Guard()
endfunction
;Valid operators: +, -, /, *, <<, leftshift, lshift, >>, rightshift, rshift, AND, NOT, OR, XOR
Int[]    function cArrayDynamicOperationInt(String operation, Int this, Int[] thatArray) global
  {Requirements: None}
    Guard()
endfunction
;Valid operators: +s, s+, +s+
String[] function cArrayDynamicOperationString(String operation, String this, String[] thatArray) global
  {Requirements: None}
    Guard()
endfunction
;>>> 20 functions for the price of 3, base functions for the array functions

;Valid operators: +, -, /, *, **, ^, pow
Float    function cDynamicOperationFloat(String operation, Float this, Float that) global
  {Requirements: None}
    Guard()
endfunction
;Valid operators: +, -, /, *, <<, leftshift, lshift, >>, rightshift, rshift, AND, NOT, OR, XOR
Int      function cDynamicOperationInt(String operation, Int this, Int that) global
  {Requirements: None}
    Guard()
endfunction
;Valid operators: +s, s+, +s+
String   function cDynamicOperationString(String operation, String this, String s) global
  {Requirements: None}
    Guard()
endfunction

  ;>>> MAP FUNCTIONS
String[] function cMapSet(String keyName, String aValue, String[] aArray) global
  {Requirements: None}
    Guard()
endfunction
String   function cMapGet(String keyName, String[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Bool     function cMapGetBool(String keyName, String[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Float    function cMapGetFloat(String keyName, String[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Form     function cMapGetForm(String keyName, String[] aArray) global
  {Requirements: SKSE}
    Guard()
endfunction
Int      function cMapGetInt(String keyName, String[] aArray) global
  {Requirements: None}
    Guard()
endfunction
String[] function cMapCreate(String keyName, String aValue = "", Int numKeyPairs = 64, Bool useSKSE = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
String[] function cMapAdd(String keyName, String aValue, String[] aArray) global
  {Requirements: None}
    Guard()
endfunction
String[] function cMapAddForm(String keyName, Form aForm, String[] aArray, Bool useSKSE = TRUE) global
  {Requirements: SKSE}
    Guard()
endfunction
Bool     function cMapHasKey(String keyName, String[] aArray) global
  {Requirements: None}
    Guard()
endfunction
Int      function cMapFirstFree(String[] aArray) global
  {Requirements: None}
    Guard()
endfunction
String[] function cMapRemove(String keyName, String[] aArray) global
  {Requirements: None}
    Guard()
endfunction


;====== Retrieve temporary data for various functions
;***CONFIRMED WORKING 21-11-02
String[] function cArrayListSkillNames() global
  {Requirements: None}
    Guard()
endfunction
;***CONFIRMED WORKING 21-11-02
String[] function cArrayHexDigits() global
  {Requirements: None}
    Guard()
endfunction
;***CONFIRMED WORKING 21-11-02
String[] function cArrayDecDigits() global
  {Requirements: None}
    Guard()
endfunction
;***CONFIRMED WORKING 21-11-02
String[] function cArrayASCIIChars() global
  {Requirements: None}
    Guard()
endfunction
String   function cASCII2Hex(String char)
    Guard()
endfunction
String   function cASCII2Binary(String char)
    Guard()
endfunction
String[] function cArrayASCIIAsBinary() global
  {Requirements: None}
    Guard()
endfunction
String[] function cArrayASCIIAsHex() global
  {Requirements: None}
    Guard()
endfunction
;***CONFIRMED WORKING 21-11-02
String[] function cArrayLetterChars() global
  {Requirements: None}
    Guard()
endfunction

; Misc reference info
;/
  --- means that it is NOT a reserved word
List of Known Reserved Strings
  Alchemy
  Alteration
  AMBER
  ---amethyst
  ---ancient
  Armor
  Arrow
  Axe
  ---band
  bandit
  Bear
  ---bird
  ---black
  Blade
  ---blank
  Block
  Book
  broken
  ---bull
  ---cabbage
  ---cairn
  ---carrot
  ---cat
  ---cattle
  ---chamber
  ---charcoal
  Circle
  Circlet
  claw
  ---claws
  Clear
  clothes
  Clothing
  ---cloud
  Conjuration
  ---cottage
  cow
  Crown
  Dawnguard
  dead
  Death
  deathBell
  Destruction
  Diamond
  DIAMONDS
  ---dibella
  ---difficulty
  Dog
  Dragon
  ---dragonborn
  draugr
  EBONY
  ---elder
  ---emerald
  Enchanting
  ---exquisite
  False
  ---farm
  ---farming
  ---feather
  ---flawless
  Forge
  ---forging
  ---fork
  Fort
  Fur
  Game
  ---garnet
  gem
  ---gems
  General
  Giant
  gold
  ---good
  ---goods
  ---green
  Guard
  ---hand
  ---handed
  ---haven
  HEAD
  ---heading
  ---hearth
  ---hearthfire
  ---hearthfires
  Heavy
  HeavyArmor
  Hide
  Horn
  Horse
  Illusion
  ---imbuing
  IMPERIAL
  ---ingot
  IRON
  ---jug
  ---keep
  ---keg
  ---learn
  ---learning
  Leather
  ---legendary
  Light
  LightArmor
  Lockpicking
  Mace
  Magic
  Mammoth
  Map
  Markarth
  Marksman
  master
  ---mead
  ---metal
  ---mine
  ---mining
  No
  ---nothing
  object
  ObjectReference
  ---oblivion
  ONE
  OneHanded
  Options
  ---orange
  Ore
  ---paper
  pelt
  Pickpocket
  plate
  ---precious
  Quest
  ---questing
  ---quests
  ---quill
  rank
  ---ranks
  Reach
  ---red
  ---reference
  Relationship
  Restoration
  Rift
  Riften
  ring
  robe
  robes
  ---ruby
  ---ruin
  ---ruins
  ---salmon
  ---sapphire
  Scroll
  Scrolls
  ---septim
  ---shack
  ---ship
  ---shrine
  Silver
  ---skill
  Sky
  ---skyrim
  Smithing
  Sneak
  Solitude
  ---soul
  ---soul gem
  SOUL GEMS
  SoulGem
  ---soulgems
  Speechcraft
  SPELL
  Sphere
  Spider
  ---stalhrim
  ---star
  STEEL
  Stone
  ---stones
  Summon
  Sword
  ---testing
  Tome
  Tree
  TRUE
  ---tusk
  TwoHanded
  ---undead
  Wall
  ---war
  ---warrior
  ---weigh
  ---weighing
  ---weighs
  Weight
  ---whirlwind
  WHITE
  Whiterun
  Windhelm
  Work
  ---yellow
  Yes

SKSE Item Type Names just a reference list
    type == 0 "kNone"
    type == 1 "kTES4"
    type == 2 "kGroup"
    type == 3 "kGMST"
    type == 4 "kKeyword"
    type == 5 "kLocationRef"
    type == 6 "kAction"
    type == 7 "kTextureSet"
    type == 8 "kMenuIcon"
    type == 9 "kGlobal"
    type == 10 "kClass"
    type == 11 "kFaction"
    type == 12 "kHeadPart"
    type == 13 "kEyes"
    type == 14 "kRace"
    type == 15 "kSound"
    type == 16 "kAcousticSpace"
    type == 17 "kSkill"
    type == 18 "kEffectSetting"
    type == 19 "kScript"
    type == 20 "kLandTexture"
    type == 21 "kEnchantment"
    type == 22 "kSpell"
    type == 23 "kScrollItem"
    type == 24 "kActivator"
    type == 25 "kTalkingActivator"
    type == 26 "kArmor"
    type == 27 "kBook"
    type == 28 "kContainer"
    type == 29 "kDoor"
    type == 30 "kIngredient"
    type == 31 "kLight"
    type == 32 "kMisc"
    type == 33 "kApparatus"
    type == 34 "kStatic"
    type == 35 "kStaticCollection"
    type == 36 "kMovableStatic"
    type == 37 "kGrass"
    type == 38 "kTree"
    type == 39 "kFlora"
    type == 40 "kFurniture"
    type == 41 "kWeapon"
    type == 42 "kAmmo"
    type == 43 "kNPC"
    type == 44 "kLeveledCharacter"
    type == 45 "kKey"
    type == 46 "kPotion"
    type == 47 "kIdleMarker"
    type == 48 "kNote"
    type == 49 "kConstructibleObject"
    type == 50 "kProjectile"
    type == 51 "kHazard"
    type == 52 "kSoulGem"
    type == 53 "kLeveledItem"
    type == 54 "kWeather"
    type == 55 "kClimate"
    type == 56 "kShaderParticleGeometryData"
    type == 57 "kReferenceEffect"
    type == 58 "kRegion"
    type == 59 "kNAVI"
    type == 60 "kCell"
    type == 61 "kReference"
    type == 62 "kCharacter"
    type == 63 "kMissileProjectile"
    type == 64 "kArrowProjectile"
    type == 65 "kGrenadeProjectile"
    type == 66 "kBeamProjectile"
    type == 67 "kFlameProjectile"
    type == 68 "kConeProjectile"
    type == 69 "kBarrierProjectile"
    type == 70 "kPHZD"
    type == 71 "kWorldSpace"
    type == 72 "kLand"
    type == 73 "kNavMesh"
    type == 74 "kTLOD"
    type == 75 "kTopic"
    type == 76 "kTopicInfo"
    type == 77 "kQuest"
    type == 78 "kIdle"
    type == 79 "kPackage"
    type == 80 "kCombatStyle"
    type == 81 "kLoadScreen"
    type == 82 "kLeveledSpell"
    type == 83 "kANIO"
    type == 84 "kWater"
    type == 85 "kEffectShader"
    type == 86 "kTOFT"
    type == 87 "kExplosion"
    type == 88 "kDebris"
    type == 89 "kImageSpace"
    type == 90 "kImageSpaceModifier"
    type == 91 "kList"
    type == 92 "kPerk"
    type == 93 "kBodyPartData"
    type == 94 "kAddonNode"
    type == 95 "kActorValueInfo"
    type == 96 "kCameraShot"
    type == 97 "kCameraPath"
    type == 98 "kVoiceType"
    type == 99 "kMaterialType"
    type == 100 "kImpactData"
    type == 101 "kImpactDataSet"
    type == 102 "kARMA"
    type == 103 "kEncounterZone"
    type == 104 "kLocation"
    type == 105 "kMessage"
    type == 106 "kRagdoll"
    type == 107 "kDefaultObject"
    type == 108 "kLightingTemplate"
    type == 109 "kMusicType"
    type == 110 "kFootstep"
    type == 111 "kFootstepSet"
    type == 112 "kStoryBranchNode"
    type == 113 "kStoryQuestNode"
    type == 114 "kStoryEventNode"
    type == 115 "kDialogueBranch"
    type == 116 "kMusicTrack"
    type == 117 "kDLVW"
    type == 118 "kWordOfPower"
    type == 119 "kShout"
    type == 120 "kEquipSlot"
    type == 121 "kRelationship"
    type == 122 "kScene"
    type == 123 "kAssociationType"
    type == 124 "kOutfit"
    type == 125 "kArt"
    type == 126 "kMaterial"
    type == 127 "kMovementType"
    type == 128 "kSoundDescriptor"
    type == 129 "kDualCastData"
    type == 130 "kSoundCategory"
    type == 131 "kSoundOutput"
    type == 132 "kCollisionLayer"
    type == 133 "kColorForm"
    type == 134 "kReverbParam"
/;

;Functions used to output error messages
function clibTrace(String functionName, String msg, Int errorLevel, Bool condition = TRUE, \
    Bool useConsoleUtil = TRUE) global
  {Requirements: None, ConsoleUtil:Soft}
    Guard()
endfunction
function cErrInvalidArg(String functionName, String argName = "", String returnValue = "", \
    Int errorLevel = 2, Bool condition = TRUE, Bool useSKSE = TRUE, Bool useConsoleUtil = TRUE) global
  {Requirements: None, ConsoleUtil:Soft}
    Guard()
endfunction
function cErrArrInitFail(String functionName, String arrayName = "newArray", String returnValue = "ArrayNone", \
    Int errorLevel = 2, Bool condition = TRUE, Bool useConsoleUtil = TRUE) global
  {Requirements: None, ConsoleUtil:Soft}
    Guard()
endfunction
function cErrReqDisabled(String functionName, String modName = "SKSE", String returnValue = "", \
    Int errorLevel = 2, Bool condition = TRUE, Bool useConsoleUtil = TRUE) global
  {Requirements: None, ConsoleUtil:Soft}
    Guard()
endfunction

;--------------------------SKSE:HARD-------------------------------------------

String   function cGetModName(String hexForm = "", Int decForm = 0,Form formVar = None) global
  {Requirements: SKSE}
    Guard()
endfunction
String   function cGetModNameForm(Form aForm) global
  {Requirements: SKSE}
    Guard()
endfunction
Bool     function cIsInAnyMenu() global ; In my experience more accurate thatn .IsInMenuMode()
  {Requirements: SKSE}
    Guard()
endfunction
Bool[]   function cArePluginsInstalled(String[] listOfPlugins) global
  {Requirements: SKSE}
    Guard()
endfunction
String[] function GetAllMods() global
    Guard()
endfunction
String[] function GetAllRegularMods() global
    Guard()
endfunction
String[] function GetAllLightMods() global
    Guard()
endfunction

;========================= Array/FL Functions

; Query
Int    function cFLFindByName(FormList aFormList, String aName, Bool bySubStr = TRUE) global
  {Requirements: SKSE}
    Guard()
endfunction

Int    function cArrayFindByNameAlias(Alias[] aArray, String aName, Bool bySubStr = TRUE) global
  {Requirements: SKSE}
    Guard()
endfunction
Int    function cArrayFindByNameActor(Actor[] aArray, String aName, Bool bySubStr = TRUE) global
  {Requirements: SKSE}
    Guard()
endfunction
Int    function cArrayFindByNameForm(Form[] aArray, String aName, Bool bySubStr = TRUE) global
  {Requirements: SKSE}
    Guard()
endfunction
Int    function cArrayFindByNameObjRef(ObjectReference[] aArray, String aName, Bool bySubStr = TRUE) global
    Guard()
endfunction

;/ WIP
function cFLAddAllTomes(FormList aFormList) global
  Guard()
endfunction
/;

  ;>>> Returns text with MCM menu color formatting
String function cColoredText(String aString, Bool ddInstalled = False, String textColorHex = "", \
    String trimWhere = "") global
  {Requirements: SKSE:Hard, SkyUI:Soft unsure if hard}
    Guard()
endfunction

Int    function cStringCountSubstring(String countThis, String inThis) global
  {Requirements: SKSE}
    Guard()
endfunction

Enchantment[]  function cArrayBaseEnchantment(Enchantment[] aArray) global
  {Requirements: SKSE}
    Guard()
endfunction

Bool     function cModPerkPoints(Int number = 1) global ; NOT compatible with Vokriinator Black!!
  {Requirements: SKSE}
    Guard()
endfunction
Int      function cTotalPerkPoints(Actor aActor, String singleSkill = "") global
  {Requirements: SKSE}
    Guard()
endfunction

String[] function cArrayStringFromKeywords(Keyword[] aArray) global
  {Requirements: SKSE}
    Guard()
endfunction

String   function cGetScriptName() global
  {Requirements: None}
    Guard()
endfunction
