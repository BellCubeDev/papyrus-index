scriptname PapyrusUtil Hidden

; Get version of papyrus DLL library. Version 4.6 will return 46.
int function GetVersion() global native

; Get version of compiled papyrus scripts which should match return from GetVersion()
int function GetScriptVersion() global
    Guard()
endFunction

; ##
; ## Array manipulation utilities
; ##

; Few extra array types not provided by SKSE normally to help avoid having to use and cast Form arrays
Actor[] function ActorArray(int size, Actor filler = none) global native
Actor[] function ResizeActorArray(Actor[] ArrayValues, int toSize, Actor filler = none) global native
ObjectReference[] function ObjRefArray(int size, ObjectReference filler = none) global native
ObjectReference[] function ResizeObjRefArray(ObjectReference[] ArrayValues, int toSize, ObjectReference filler = none) global native

; ## Append a value to the end of the given array and return the new array.
; ## NOTE: The array has to be recreated each time you call this. For the sake of memory usage and performance, DO NOT use these to build up an array through a loop,
; ##       in such a situation it is significantly faster to create the full length array first and then fill it. Best to limit to only the occasional need.
float[] function PushFloat(float[] ArrayValues, float push) global native
int[] function PushInt(int[] ArrayValues, int push) global native
; bool[] function PushBool(bool[] ArrayValues, bool push) global native ; // Bugged - Non-native version available below
string[] function PushString(string[] ArrayValues, string push) global native
Form[] function PushForm(Form[] ArrayValues, Form push) global native
Alias[] function PushAlias(Alias[] ArrayValues, Alias push) global native
Actor[] function PushActor(Actor[] ArrayValues, Actor push) global native
ObjectReference[] function PushObjRef(ObjectReference[] ArrayValues, ObjectReference push) global native

; ## Removes all elements from the given array matching the provided value and returns the shortened array.
float[] function RemoveFloat(float[] ArrayValues, float ToRemove) global native
int[] function RemoveInt(int[] ArrayValues, int ToRemove) global native
; bool[] function RemoveBool(bool[] ArrayValues, bool ToRemove) global native ; // Bugged - Non-native version available below
string[] function RemoveString(string[] ArrayValues, string ToRemove) global native
Form[] function RemoveForm(Form[] ArrayValues, Form ToRemove) global native
Alias[] function RemoveAlias(Alias[] ArrayValues, Alias ToRemove) global native
Actor[] function RemoveActor(Actor[] ArrayValues, Actor ToRemove) global native
ObjectReference[] function RemoveObjRef(ObjectReference[] ArrayValues, ObjectReference ToRemove) global native

; ## Removes all duplicate elements from the given array and returns the shortened array with only a single instance of all element values.
float[] function RemoveDupeFloat(float[] ArrayValues) global native
int[] function RemoveDupeInt(int[] ArrayValues) global native
string[] function RemoveDupeString(string[] ArrayValues) global native
Form[] function RemoveDupeForm(Form[] ArrayValues) global native
Alias[] function RemoveDupeAlias(Alias[] ArrayValues) global native
Actor[] function RemoveDupeActor(Actor[] ArrayValues) global native
ObjectReference[] function RemoveDupeObjRef(ObjectReference[] ArrayValues) global native

; ## Get an array of values from ArrayValues1 that ARE NOT among the values of ArrayValues2. Duplicates are removed by default.
; ## Setting CompareBoth = true will change the behavior to also include the reverse comparison of ArrayValues2 values that are not present in ArrayValues1.
; ## Setting IncludeDupes = true will allow the resulting array to include duplicate entries of the same value if they were also duplicated in the input arrays.
float[] function GetDiffFloat(float[] ArrayValues1, float[] ArrayValues2, bool CompareBoth = false, bool IncludeDupes = false) global native
int[] function GetDiffInt(int[] ArrayValues1, int[] ArrayValues2, bool CompareBoth = false, bool IncludeDupes = false) global native
string[] function GetDiffString(string[] ArrayValues1, string[] ArrayValues2, bool CompareBoth = false, bool IncludeDupes = false) global native
Form[] function GetDiffForm(Form[] ArrayValues1, Form[] ArrayValues2, bool CompareBoth = false, bool IncludeDupes = false) global native
Alias[] function GetDiffAlias(Alias[] ArrayValues1, Alias[] ArrayValues2, bool CompareBoth = false, bool IncludeDupes = false) global native
Actor[] function GetDiffActor(Actor[] ArrayValues1, Actor[] ArrayValues2, bool CompareBoth = false, bool IncludeDupes = false) global native
ObjectReference[] function GetDiffObjRef(ObjectReference[] ArrayValues1, ObjectReference[] ArrayValues2, bool CompareBoth = false, bool IncludeDupes = false) global native

; ## Get an array of values that are present in both ArrayValues1 and ArrayValues2.
float[] function GetMatchingFloat(float[] ArrayValues1, float[] ArrayValues2) global native
int[] function GetMatchingInt(int[] ArrayValues1, int[] ArrayValues2) global native
string[] function GetMatchingString(string[] ArrayValues1, string[] ArrayValues2) global native
Form[] function GetMatchingForm(Form[] ArrayValues1, Form[] ArrayValues2) global native
Alias[] function GetMatchingAlias(Alias[] ArrayValues1, Alias[] ArrayValues2) global native
Actor[] function GetMatchingActor(Actor[] ArrayValues1, Actor[] ArrayValues2) global native
ObjectReference[] function GetMatchingObjRef(ObjectReference[] ArrayValues1, ObjectReference[] ArrayValues2) global native

; ## Returns the number of instances an array has an element equal to the given value
int function CountFloat(float[] ArrayValues, float EqualTo) global native
int function CountInt(int[] ArrayValues, int EqualTo) global native
int function CountBool(bool[] ArrayValues, bool EqualTo) global native
int function CountString(string[] ArrayValues, string EqualTo) global native
int function CountForm(Form[] ArrayValues, Form EqualTo) global native
int function CountAlias(Alias[] ArrayValues, Alias EqualTo) global native
int function CountActor(Actor[] ArrayValues, Actor EqualTo) global native
int function CountObjRef(ObjectReference[] ArrayValues, ObjectReference EqualTo) global native

; ## Returns two arrays combined into one, optionally also removing any duplicate occurrences of a value.
float[] function MergeFloatArray(float[] ArrayValues1, float[] ArrayValues2, bool RemoveDupes = false) global native
int[] function MergeIntArray(int[] ArrayValues1, int[] ArrayValues2, bool RemoveDupes = false) global native
; bool[] function MergeBoolArray(bool[] ArrayValues1, bool[] ArrayValues2, bool RemoveDupes = false) global native ; // Bugged - Non-native version available below
string[] function MergeStringArray(string[] ArrayValues1, string[] ArrayValues2, bool RemoveDupes = false) global native
Form[] function MergeFormArray(Form[] ArrayValues1, Form[] ArrayValues2, bool RemoveDupes = false) global native
Alias[] function MergeAliasArray(Alias[] ArrayValues1, Alias[] ArrayValues2, bool RemoveDupes = false) global native
Actor[] function MergeActorArray(Actor[] ArrayValues1, Actor[] ArrayValues2, bool RemoveDupes = false) global native
ObjectReference[] function MergeObjRefArray(ObjectReference[] ArrayValues1, ObjectReference[] ArrayValues2, bool RemoveDupes = false) global native

; ## Returns a sub section of an array indicated by a starting and ending index.
; ## The default argument "int EndIndex = -1" clamps the to the end of the array. Equivalent of setting EndIndex = (ArrayValues.Length - 1)
float[] function SliceFloatArray(float[] ArrayValues, int StartIndex, int EndIndex = -1) global native
int[] function SliceIntArray(int[] ArrayValues, int StartIndex, int EndIndex = -1) global native
; bool[] function SliceBoolArray(bool[] ArrayValues, int StartIndex, int EndIndex = -1) global native ; // Bugged - Non-native version available below
string[] function SliceStringArray(string[] ArrayValues, int StartIndex, int EndIndex = -1) global native
Form[] function SliceFormArray(Form[] ArrayValues, int StartIndex, int EndIndex = -1) global native
Alias[] function SliceAliasArray(Alias[] ArrayValues, int StartIndex, int EndIndex = -1) global native
Actor[] function SliceActorArray(Actor[] ArrayValues, int StartIndex, int EndIndex = -1) global native
ObjectReference[] function SliceObjRefArray(ObjectReference[] ArrayValues, int StartIndex, int EndIndex = -1) global native


; ## Sorts a given array's elements alphanumerically. Sorted in ascending order by default.
function SortIntArray(int[] ArrayValues, bool descending = false) global native
function SortFloatArray(float[] ArrayValues, bool descending = false) global native
function SortStringArray(string[] ArrayValues, bool descending = false) global native

; ##
; ## Shortcuts for common usage
; ##

string[] function ClearEmpty(string[] ArrayValues) global
    Guard()
endFunction
Form[] function ClearNone(Form[] ArrayValues) global
    Guard()
endFunction

int function CountFalse(bool[] ArrayValues) global
    Guard()
endFunction
int function CountTrue(bool[] ArrayValues) global
    Guard()
endFunction
int function CountNone(Form[] ArrayValues) global
    Guard()
endFunction

; ##
; ## Extra String Utilities
; ##

; ## Similar to SKSE's native StringUtil.Split() except results are whitespace trimmed. So comma, separated,list,can, be, spaced,or,not.
string[] function StringSplit(string ArgString, string Delimiter = ",") global native

; ## Opposite of StringSplit()
string function StringJoin(string[] Values, string Delimiter = ",") global native


; ##
; ## Shortcuts for some common number actions. Mostly to help cut some basic and overly verbose checks down to a single line.
; ## Making these native instead of normal globals is probably massive overkill, but why not...
; ##

; ## Return the total sum of all values stored in the given array
int function AddIntValues(int[] Values) global native
float function AddFloatValues(float[] Values) global native

; ## Returns the value clamped to the min or max when out of range
int function ClampInt(int value, int min, int max) global native
float function ClampFloat(float value, float min, float max) global native

; ## Similar to the clamp functions, only values wrap around to the other side of range instead.
; ## Mostly useful for traversing around array values by wrapping the index from end to end without having to check for it being out of range first.
; ##     i.e.: Form var = myFormArray[WrapInt(i, (myFormArray.Length - 1))]
int function WrapInt(int value, int end, int start = 0) global native
float function WrapFloat(float value, float end, float start = 0.0) global native

; ## Returns the given value signed if bool is true, unsigned if false, regardless if value started out signed or not.
int function SignInt(bool doSign, int value) global native
float function SignFloat(bool doSign, float value) global native

; ##
; ## Non-Native bool versions of some functions where SKSE version is bugged.
; ## SKSE version VMResultArray<bool> fails to be manipulated by other native functions past creation.
; ##

bool[] function ResizeBoolArray(bool[] ArrayValues, int toSize, bool filler = false) global
    Guard()
endFunction

bool[] function PushBool(bool[] ArrayValues, bool push) global
    Guard()
endFunction

bool[] function RemoveBool(bool[] ArrayValues, bool ToRemove) global
    Guard()
endFunction

bool[] function MergeBoolArray(bool[] ArrayValues1, bool[] ArrayValues2, bool RemoveDupes = false) global
    Guard()
endFunction

bool[] function SliceBoolArray(bool[] ArrayValues, int StartIndex, int EndIndex = -1) global
    Guard()
endFunction


; ##
; ## DEPRECATED: SKSE now provides their own variable sized arrays for these types - mirrored here for backwards compatibility.
; ##

float[] function FloatArray(int size, float filler = 0.0) global
    Guard()
endFunction
int[] function IntArray(int size, int filler = 0) global
    Guard()
endFunction
bool[] function BoolArray(int size, bool filler = false) global
    Guard()
endFunction
string[] function StringArray(int size, string filler = "") global
    Guard()
endFunction
Form[] function FormArray(int size, Form filler = none) global
    Guard()
endFunction
Alias[] function AliasArray(int size, Alias filler = none) global
    Guard()
endFunction

float[] function ResizeFloatArray(float[] ArrayValues, int toSize, float filler = 0.0) global
    Guard()
endFunction
int[] function ResizeIntArray(int[] ArrayValues, int toSize, int filler = 0) global
    Guard()
endFunction
string[] function ResizeStringArray(string[] ArrayValues, int toSize, string filler = "") global
    Guard()
endFunction
Form[] function ResizeFormArray(Form[] ArrayValues, int toSize, Form filler = none) global
    Guard()
endFunction
Alias[] function ResizeAliasArray(Alias[] ArrayValues, int toSize, Alias filler = none) global
    Guard()
endFunction

Function Guard()
    Debug.MessageBox("PapyrusUtil: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
