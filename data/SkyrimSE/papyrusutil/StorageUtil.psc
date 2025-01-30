scriptname StorageUtil Hidden

;/
	MOD AUTHORS, READ!

	This script contains functions for saving and loading any amount of int, float, form and string values
	by name on a form or globally. These values can be accessed and changed from any mod which allows
	mods to become compatible with each other without adding any requirements to the other mod or its version
	other than this plugin.

	Values will stay on forms or globally until they are Unset or Cleared in case of lists. If value
	is set on a form and the object is deleted then THE value will be removed when saving game.
	If you are done with using a certain variable you should use Unset or Clear function to remove them
	but it is not required.

	Saving MCM config values here would allow other mods to change your mod settings which may
	be useful. It should also allow you to change MCM config script without worrying about versioning
	since there are no new variables in the script itself.

	Functions that start with File in the name will save values to a separate file, so that you can
	access the same values from all savegames. This may be useful for configuration settings.
   (FILE FUNCTIONS ARE DEPRECATED! USE JSONUTIL.PSC INSTEAD)

	Saved values take very little memory - expect to use less than 500 KB of physical memory even when
	setting thousands of values.

	Value names are not case sensitive, that means GetIntValue(none, "abc") == GetIntValue(none, "aBC").

	All values are separated from each other by type! That means SetIntValue(none, "abc", 1) and
	SetFloatValue(none, "abc", 2.0) create separate entries and aren't affected by each other.
	StorageUtil.SetIntValue(none, "myValue", 1)
	StorageUtil.SetFloatValue(none, "myValue", 5.0)
	int value = StorageUtil.GetIntValue(none, "myValue")
	value == 1 ; true
	value == 5 ; false

	When choosing names for variables try to remember that all mods access the same storage, so if you
	create a variable with name "Name" then many other mods could use the same variable but in different
	ways that lead to unwanted behavior. It is recommended to prefix the variable with your mod name,
	that way you can be sure nobody else will try to use the same variable in their mod. For example
	realistic needs and diseases might set hunger as "rnd_hungervalue".

	You can also use this storage to make your mod functions available to other mods, for example if
	your mod has a function that sets an Actor to be invisible you could add a script that checks:
	int i = StorageUtil.FormListCount(none, "MakeInvisible")
	while(i > 0)
		i--
		Actor make = StorageUtil.FormListGet(none, "MakeInvisible", i) as Actor
		if(make)
			MyScriptFunction(make)
		endif
		StorageUtil.FormListRemoveAt(none, "MakeInvisible", i)
	endwhile
	And the other mod could write:
	StorageUtil.FormListAdd(none, "MakeInvisible", myActor)
	to make someone invisible using your mod. But if your mod isn't present then nothing happens.
	This is just an example, I'm sure you can find better ways to implement compatibility, it would
	help to include a documentation for other modders if you do.
;/





;/
	Storage functions - values in save game file.
/;


;/ Set int/float/string/Form value globally or on any form by name and return
   the value passed, or as uninitialized variable if invalid keys given.

   ObjKey: form to save on. Set none to save globally.
   KeyName: name of value.
   value: value to set to the given keys. If zero, empty, or none are given, the key will be unset.
/;
int function SetIntValue(Form ObjKey, string KeyName, int value) global native
float function SetFloatValue(Form ObjKey, string KeyName, float value) global native
string function SetStringValue(Form ObjKey, string KeyName, string value) global native
Form function SetFormValue(Form ObjKey, string KeyName, Form value) global native


;/ Remove a previously set int/float/string/Form value on an form or globally and
   return if successful. This will return false if value didn't exist.

   ObjKey: form to remove from. Set none to remove global value.
   KeyName: name of value.
/;
bool function UnsetIntValue(Form ObjKey, string KeyName) global native;
bool function UnsetFloatValue(Form ObjKey, string KeyName) global native
bool function UnsetStringValue(Form ObjKey, string KeyName) global native
bool function UnsetFormValue(Form ObjKey, string KeyName) global native


;/ Check if int/float/string/Form value has been set on form or globally.

   ObjKey: form to check on. Set none to check global value.
   KeyName: name of value.
/;
bool function HasIntValue(Form ObjKey, string KeyName) global native
bool function HasFloatValue(Form ObjKey, string KeyName) global native
bool function HasStringValue(Form ObjKey, string KeyName) global native
bool function HasFormValue(Form ObjKey, string KeyName) global native


;/ Get previously saved int/float/string/Form value on form or globally.

   ObjKey: form to get from. Set none to get global value.
   KeyName: name of value.
   [optional] missing: if value has not been set, return this value instead.
/;
int function GetIntValue(Form ObjKey, string KeyName, int missing = 0) global native
float function GetFloatValue(Form ObjKey, string KeyName, float missing = 0.0) global native
string function GetStringValue(Form ObjKey, string KeyName, string missing = "") global native
Form function GetFormValue(Form ObjKey, string KeyName, Form missing = none) global native

;/ Plucks a previously saved int/float/string/Form value on form or globally.
   Returning the value stored, then removing it from storage.

   ObjKey: form to pluck from. Set none to get global value.
   KeyName: name of value.
   [optional] missing: if value has not been set, return this value instead.
/;
int function PluckIntValue(Form ObjKey, string KeyName, int missing = 0) global native
float function PluckFloatValue(Form ObjKey, string KeyName, float missing = 0.0) global native
string function PluckStringValue(Form ObjKey, string KeyName, string missing = "") global native
Form function PluckFormValue(Form ObjKey, string KeyName, Form missing = none) global native

;/ Get previously saved int/float/string/Form value on form or globally.

   ObjKey: form to get from. Set none to get global value.
   KeyName: name of value.
   amount: +/- the amount to adjust the current value by

   given keys will be initialized to given amount if it does not exist
/;
int function AdjustIntValue(Form ObjKey, string KeyName, int amount) global native
float function AdjustFloatValue(Form ObjKey, string KeyName, float amount) global native


;/ Add an int/float/string/Form to a list on form or globally and return
   the value's new index. Index can be -1 if we were unable to add
   the value.

   ObjKey: form to add to. Set none to add global value.
   KeyName: name of value.
   value: value to add.
   [optional] allowDuplicate: allow adding value to list if this value already exists in the list.
/;
int function IntListAdd(Form ObjKey, string KeyName, int value, bool allowDuplicate = true) global native
int function FloatListAdd(Form ObjKey, string KeyName, float value, bool allowDuplicate = true) global native
int function StringListAdd(Form ObjKey, string KeyName, string value, bool allowDuplicate = true) global native
int function FormListAdd(Form ObjKey, string KeyName, Form value, bool allowDuplicate = true) global native

;/ Get a value from list by index on form or globally.
   This will return 0 as value if there was a problem.

   ObjKey: form to get value on. Set none to get global list value.
   KeyName: name of list.
   index: index of value in the list.
/;
int function IntListGet(Form ObjKey, string KeyName, int index) global native
float function FloatListGet(Form ObjKey, string KeyName, int index) global native
string function StringListGet(Form ObjKey, string KeyName, int index) global native
Form function FormListGet(Form ObjKey, string KeyName, int index) global native

;/ Set a value in list by index on form or globally.
   This will return the previous value or 0 if there was a problem.

   ObjKey: form to set value on. Set none to set global list value.
   KeyName: name of list.
   index: index of value in the list.
   value: value to set to.
/;
int function IntListSet(Form ObjKey, string KeyName, int index, int value) global native
float function FloatListSet(Form ObjKey, string KeyName, int index, float value) global native
string function StringListSet(Form ObjKey, string KeyName, int index, string value) global native
Form function FormListSet(Form ObjKey, string KeyName, int index, Form value) global native

;/ Plucks a value from list by index on form or globally.
   The index is removed from the list's storage after returning it's value.

   ObjKey: form to pluck value from. Set none to get global list value.
   KeyName: name of list.
   index: index of value in the list.
   [optional] missing: if index has not been set, return this value instead.
/;
int function IntListPluck(Form ObjKey, string KeyName, int index, int missing) global native
float function FloatListPluck(Form ObjKey, string KeyName, int index, float missing) global native
string function StringListPluck(Form ObjKey, string KeyName, int index, string missing) global native
Form function FormListPluck(Form ObjKey, string KeyName, int index, Form missing) global native

;/ Gets the value of the very first element in a list, and subsequently removes the index afterward.

   ObjKey: form to shift value from. Set none to get global list value.
   KeyName: name of list to shift it's first value from.
/;
int function IntListShift(Form ObjKey, string KeyName) global native
float function FloatListShift(Form ObjKey, string KeyName) global native
string function StringListShift(Form ObjKey, string KeyName) global native
Form function FormListShift(Form ObjKey, string KeyName) global native

;/ Gets the value of the very last element in a list, and subsequently removes the index afterward.

   ObjKey: form to pop value from. Set none to get global list value.
   KeyName: name of list to pop off it's last value.
/;
int function IntListPop(Form ObjKey, string KeyName) global native
float function FloatListPop(Form ObjKey, string KeyName) global native
string function StringListPop(Form ObjKey, string KeyName) global native
Form function FormListPop(Form ObjKey, string KeyName) global native

;/ Adjust the existing value of a list by the given amount.

   ObjKey: form to set value on. Set none to set global list value.
   KeyName: name of list.
   index: index of value in the list.
   amount: +/- the amount to adjust the lists current index value by.

   returns 0 if index does not exists
/;
int function IntListAdjust(Form ObjKey, string KeyName, int index, int amount) global native
float function FloatListAdjust(Form ObjKey, string KeyName, int index, float amount) global native

;/ Insert an int/float/string/Form to a list on form or globally and return
   if successful.

   ObjKey: form to add to. Set none to add global value.
   KeyName: name of value.
   index: position in list to put the value. 0 is first entry in list.
   value: value to add.
/;
bool function IntListInsert(Form ObjKey, string KeyName, int index, int value) global native
bool function FloatListInsert(Form ObjKey, string KeyName, int index, float value) global native
bool function StringListInsert(Form ObjKey, string KeyName, int index, string value) global native
bool function FormListInsert(Form ObjKey, string KeyName, int index, Form value) global native


;/ Remove a previously added int/float/string/Form value from a list on form
   or globally and return how many instances of this value were removed.

   ObjKey: form to remove from. Set none to remove global value.
   KeyName: name of value.
   value: value to remove.
   [optional] allowInstances: remove all instances of this value in a list.
/;
int function IntListRemove(Form ObjKey, string KeyName, int value, bool allInstances = false) global native
int function FloatListRemove(Form ObjKey, string KeyName, float value, bool allInstances = false) global native
int function StringListRemove(Form ObjKey, string KeyName, string value, bool allInstances = false) global native
int function FormListRemove(Form ObjKey, string KeyName, Form value, bool allInstances = false) global native


;/ Clear a list of values (unset) on an form or globally and
   return the previous size of list.

   ObjKey: form to clear on. Set none to clear global list.
   KeyName: name of list.
/;
int function IntListClear(Form ObjKey, string KeyName) global native
int function FloatListClear(Form ObjKey, string KeyName) global native
int function StringListClear(Form ObjKey, string KeyName) global native
int function FormListClear(Form ObjKey, string KeyName) global native

;/ Remove a value from list by index on form or globally and
   return if we were successful in doing so.

   ObjKey: form to remove from. Set none to remove global value.
   KeyName: name of list.
   index: index of value in the list.
/;
bool function IntListRemoveAt(Form ObjKey, string KeyName, int index) global native
bool function FloatListRemoveAt(Form ObjKey, string KeyName, int index) global native
bool function StringListRemoveAt(Form ObjKey, string KeyName, int index) global native
bool function FormListRemoveAt(Form ObjKey, string KeyName, int index) global native

;/ Get size of a list on form or globally.

   ObjKey: form to check on. Set none to check global list.
   KeyName: name of list.
/;
int function IntListCount(Form ObjKey, string KeyName) global native
int function FloatListCount(Form ObjKey, string KeyName) global native
int function StringListCount(Form ObjKey, string KeyName) global native
int function FormListCount(Form ObjKey, string KeyName) global native

;/ Get the number of occurrences of a specific value within a list.

   ObjKey: form to check on. Set none to check global list.
   KeyName: name of list.
   value: value to look for.
   [optional] exclude: if true, function will return number of elements NOT equal to value.
/;
int function IntListCountValue(Form ObjKey, string KeyName, int value, bool exclude = false) global native
int function FloatListCountValue(Form ObjKey, string KeyName, float value, bool exclude = false) global native
int function StringListCountValue(Form ObjKey, string KeyName, string value, bool exclude = false) global native
int function FormListCountValue(Form ObjKey, string KeyName, Form value, bool exclude = false) global native

;/ Find a value in list on form or globally and return its
   index or -1 if value was not found.

   ObjKey: form to find value on. Set none to find global list value.
   KeyName: name of list.
   value: value to search.
/;
int function IntListFind(Form ObjKey, string KeyName, int value) global native
int function FloatListFind(Form ObjKey, string KeyName, float value) global native
int function StringListFind(Form ObjKey, string KeyName, string value) global native
int function FormListFind(Form ObjKey, string KeyName, Form value) global native

;/ Find if a value in list on form or globally exists, true if it exists,
   false if it doesn't.

   ObjKey: form to find value on. Set none to find global list value.
   KeyName: name of list.
   value: value to search.
/;
bool function IntListHas(Form ObjKey, string KeyName, int value) global native
bool function FloatListHas(Form ObjKey, string KeyName, float value) global native
bool function StringListHas(Form ObjKey, string KeyName, string value) global native
bool function FormListHas(Form ObjKey, string KeyName, Form value) global native

;/ Sort an int/float/string/Form list by values in ascending order.

   ObjKey: form to sort on. Set none for global value.
   KeyName: name of value.
/;
function IntListSort(Form ObjKey, string KeyName) global native
function FloatListSort(Form ObjKey, string KeyName) global native
function StringListSort(Form ObjKey, string KeyName) global native
function FormListSort(Form ObjKey, string KeyName) global native


;/ Fills the given input array with the values of the list on form or globally,
   will fill the array until either the array or list runs out of valid indexes

   ObjKey: form to find value on. Set none to find global list value.
   KeyName: name of list.
   slice[]: an initialized array set to the slice size you want, i.e. int[] slice = new int[10]
   [optional] startIndex: the starting list index you want to start filling your slice array with
/;
function IntListSlice(Form ObjKey, string KeyName, int[] slice, int startIndex = 0) global native
function FloatListSlice(Form ObjKey, string KeyName, float[] slice, int startIndex = 0) global native
function StringListSlice(Form ObjKey, string KeyName, string[] slice, int startIndex = 0) global native
function FormListSlice(Form ObjKey, string KeyName, Form[] slice, int startIndex = 0) global native


;/ Sizes the given list to a set number of elements. If the list exists already it will be truncated
   when given fewer elements, or resized to the appropriate length with the filler argument being used as
   the default values

   Returns the number of elements truncated (signed) or added (unsigned) onto the list.

   ObjKey: form to find value on. Set none to find global list value.
   KeyName: name of list.
   toLength: The size you want to change the list to. Max length when using this function is 500.
   [optional] filler: When adding empty elements to the list this will be used as the default value
/;
int function IntListResize(Form ObjKey, string KeyName, int toLength, int filler = 0) global native
int function FloatListResize(Form ObjKey, string KeyName, int toLength, float filler = 0.0) global native
int function StringListResize(Form ObjKey, string KeyName, int toLength, string filler = "") global native
int function FormListResize(Form ObjKey, string KeyName, int toLength, Form filler = none) global native

;/ Creates a copy of array on the given storage list at the given object+key,
   overwriting any list that might already exists.

   Returns true on success.

   ObjKey: form to find value on. Set none to find global list value.
   KeyName: name of list.
   copy[]: The papyrus array with the content you wish to copy over into StorageUtil
   [optional] filler: When adding empty elements to the list this will be used as the default value
/;
bool function IntListCopy(Form ObjKey, string KeyName, int[] copy) global native
bool function FloatListCopy(Form ObjKey, string KeyName, float[] copy) global native
bool function StringListCopy(Form ObjKey, string KeyName, string[] copy) global native
bool function FormListCopy(Form ObjKey, string KeyName, Form[] copy) global native

;/ Outputs the values currently stored by the given object+key.

   Returns a new array containing the values.

   ObjKey: form to find value on. Set none to find global list value.
   KeyName: name of list.
/;
int[] function IntListToArray(Form ObjKey, string KeyName) global native
float[] function FloatListToArray(Form ObjKey, string KeyName) global native
string[] function StringListToArray(Form ObjKey, string KeyName) global native
Form[] function FormListToArray(Form ObjKey, string KeyName) global native


;/ Outputs a randomly selected value from the given list's elements using mt19937.

   Returns the random elements value. If list is empty or doesn't exist, returns default null value.

   ObjKey: form to find value on. Set none to find global list value.
   KeyName: name of list.
/;
int function IntListRandom(Form ObjKey, string KeyName) global native
float function FloatListRandom(Form ObjKey, string KeyName) global native
string function StringListRandom(Form ObjKey, string KeyName) global native
Form function FormListRandom(Form ObjKey, string KeyName) global native

;/ Returns array of forms from list that have (or optionally don't have) the specified form types.
   For valid list of form types, see FormType.psc or http://www.creationkit.com/GetType_-_Form

   ObjKey: form to find value on. Set none to find global list value.
   KeyName: name of list.
   FormTypeIDs[]: The int papyrus array with all the form types you wish to filter for
   [optional] ReturnMatching: By default, TRUE, the output Form[] array will contain forms from list that match the form types
                              If set to FALSE, inverts the resulting array with forms that have a type that DO NOT match.
/;
Form[] function FormListFilterByTypes(Form ObjKey, string KeyName, int[] FormTypeIDs, bool ReturnMatching = true) global native
; Convenience version of FormListFilterByTypes() for when only getting a single type.
Form[] function FormListFilterByType(Form ObjKey, string KeyName, int FormTypeID, bool ReturnMatching = true) global
    Guard()
endFunction

;/ Counts each type of of any KeyName that starts with a given string prefix on all objects.

   PrefixKey: The string a KeyName must start with to be counted. Cannot be empty.
/;
int function CountIntValuePrefix(string PrefixKey) global native
int function CountFloatValuePrefix(string PrefixKey) global native
int function CountStringValuePrefix(string PrefixKey) global native
int function CountFormValuePrefix(string PrefixKey) global native

int function CountIntListPrefix(string PrefixKey) global native
int function CountFloatListPrefix(string PrefixKey) global native
int function CountStringListPrefix(string PrefixKey) global native
int function CountFormListPrefix(string PrefixKey) global native

; Performs all of the above prefix counts in one go.
int function CountAllPrefix(string PrefixKey) global native

;/ Counts each type of of any KeyName that starts with a given string prefix on all objects.

   ObjKey: form to perform the prefix count on.
   PrefixKey: The string a KeyName must start with to be counted. Cannot be empty.
/;
int function CountObjIntValuePrefix(Form ObjKey, string PrefixKey) global native
int function CountObjFloatValuePrefix(Form ObjKey, string PrefixKey) global native
int function CountObjStringValuePrefix(Form ObjKey, string PrefixKey) global native
int function CountObjFormValuePrefix(Form ObjKey, string PrefixKey) global native

int function CountObjIntListPrefix(Form ObjKey, string PrefixKey) global native
int function CountObjFloatListPrefix(Form ObjKey, string PrefixKey) global native
int function CountObjStringListPrefix(Form ObjKey, string PrefixKey) global native
int function CountObjFormListPrefix(Form ObjKey, string PrefixKey) global native

; Performs all of the above prefix counts in one go.
int function CountAllObjPrefix(Form ObjKey, string PrefixKey) global native


;/ Clears each type of of any KeyName that starts with a given string prefix on all objects.
   Returns the number of values/lists that were unset.

   PrefixKey: The string a KeyName must start with to be cleared. Cannot be empty.
/;
int function ClearIntValuePrefix(string PrefixKey) global native
int function ClearFloatValuePrefix(string PrefixKey) global native
int function ClearStringValuePrefix(string PrefixKey) global native
int function ClearFormValuePrefix(string PrefixKey) global native

int function ClearIntListPrefix(string PrefixKey) global native
int function ClearFloatListPrefix(string PrefixKey) global native
int function ClearStringListPrefix(string PrefixKey) global native
int function ClearFormListPrefix(string PrefixKey) global native

; Performs all of the above prefix clears in one go.
int function ClearAllPrefix(string PrefixKey) global native


;/ Clears each type of of any KeyName that starts with a given string prefix on specific objects.
   Returns the number of values/lists that were unset.

   ObjKey: form to perform the prefix clear on.
   PrefixKey: The string a KeyName must start with to be cleared. Cannot be empty.
/;
int function ClearObjIntValuePrefix(Form ObjKey, string PrefixKey) global native
int function ClearObjFloatValuePrefix(Form ObjKey, string PrefixKey) global native
int function ClearObjStringValuePrefix(Form ObjKey, string PrefixKey) global native
int function ClearObjFormValuePrefix(Form ObjKey, string PrefixKey) global native

int function ClearObjIntListPrefix(Form ObjKey, string PrefixKey) global native
int function ClearObjFloatListPrefix(Form ObjKey, string PrefixKey) global native
int function ClearObjStringListPrefix(Form ObjKey, string PrefixKey) global native
int function ClearObjFormListPrefix(Form ObjKey, string PrefixKey) global native

; Performs all of the above prefix clears in one go.
int function ClearAllObjPrefix(Form ObjKey, string PrefixKey) global native

;/
	Debug functions - can be helpful to find problems or for development.
/;

function debug_DeleteValues(Form ObjKey) global native
function debug_DeleteAllValues() global native

int function debug_Cleanup() global native

Form[] function debug_AllIntObjs() global native
Form[] function debug_AllFloatObjs() global native
Form[] function debug_AllStringObjs() global native
Form[] function debug_AllFormObjs() global native
Form[] function debug_AllIntListObjs() global native
Form[] function debug_AllFloatListObjs() global native
Form[] function debug_AllStringListObjs() global native
Form[] function debug_AllFormListObjs() global native

string[] function debug_AllObjIntKeys(Form ObjKey) global native
string[] function debug_AllObjFloatKeys(Form ObjKey) global native
string[] function debug_AllObjStringKeys(Form ObjKey) global native
string[] function debug_AllObjFormKeys(Form ObjKey) global native
string[] function debug_AllObjIntListKeys(Form ObjKey) global native
string[] function debug_AllObjFloatListKeys(Form ObjKey) global native
string[] function debug_AllObjStringListKeys(Form ObjKey) global native
string[] function debug_AllObjFormListKeys(Form ObjKey) global native

int function debug_GetIntObjectCount() global native
int function debug_GetFloatObjectCount() global native
int function debug_GetStringObjectCount() global native
int function debug_GetFormObjectCount() global native
int function debug_GetIntListObjectCount() global native
int function debug_GetFloatListObjectCount() global native
int function debug_GetStringListObjectCount() global native
int function debug_GetFormListObjectCount() global native

Form function debug_GetIntObject(int index) global native
Form function debug_GetFloatObject(int index) global native
Form function debug_GetStringObject(int index) global native
Form function debug_GetFormObject(int index) global native
Form function debug_GetIntListObject(int index) global native
Form function debug_GetFloatListObject(int index) global native
Form function debug_GetStringListObject(int index) global native
Form function debug_GetFormListObject(int index) global native
   
int function debug_GetIntKeysCount(Form ObjKey) global native
int function debug_GetFloatKeysCount(Form ObjKey) global native
int function debug_GetStringKeysCount(Form ObjKey) global native
int function debug_GetFormKeysCount(Form ObjKey) global native
int function debug_GetIntListKeysCount(Form ObjKey) global native
int function debug_GetFloatListKeysCount(Form ObjKey) global native
int function debug_GetStringListKeysCount(Form ObjKey) global native
int function debug_GetFormListKeysCount(Form ObjKey) global native

string function debug_GetIntKey(Form ObjKey, int index) global native
string function debug_GetFloatKey(Form ObjKey, int index) global native
string function debug_GetStringKey(Form ObjKey, int index) global native
string function debug_GetFormKey(Form ObjKey, int index) global native
string function debug_GetIntListKey(Form ObjKey, int index) global native
string function debug_GetFloatListKey(Form ObjKey, int index) global native
string function debug_GetStringListKey(Form ObjKey, int index) global native
string function debug_GetFormListKey(Form ObjKey, int index) global native




;/
   Storage functions - separate file. These are shared in all save games. Values are loaded and saved
   when savegame is loaded or saved.

   DEPRECATED v2.9: Replaced by JsonUtil functions. Existing functions here have been proxied to a shared
   json file to maintain compatibility.
/;

int function FileSetIntValue(string KeyName, int value) global
    Guard()
endFunction
float function FileSetFloatValue(string KeyName, float value) global
    Guard()
endFunction
string function FileSetStringValue(string KeyName, string value) global
    Guard()
endFunction
form function FileSetFormValue(string KeyName, Form value) global
    Guard()
endFunction

int function FileAdjustIntValue(string KeyName, int amount) global
    Guard()
endFunction
float function FileAdjustFloatValue(string KeyName, float amount) global
    Guard()
endFunction

bool function FileUnsetIntValue(string KeyName) global
    Guard()
endFunction
bool function FileUnsetFloatValue(string KeyName) global
    Guard()
endFunction
bool function FileUnsetStringValue(string KeyName) global
    Guard()
endFunction
bool function FileUnsetFormValue(string KeyName) global
    Guard()
endFunction

bool function FileHasIntValue(string KeyName) global
    Guard()
endFunction
bool function FileHasFloatValue(string KeyName) global
    Guard()
endFunction
bool function FileHasStringValue(string KeyName) global
    Guard()
endFunction
bool function FileHasFormValue(string KeyName) global
    Guard()
endFunction

int function FileGetIntValue(string KeyName, int missing = 0) global
    Guard()
endFunction
float function FileGetFloatValue(string KeyName, float missing = 0.0) global
    Guard()
endFunction
string function FileGetStringValue(string KeyName, string missing = "") global
    Guard()
endFunction
Form function FileGetFormValue(string KeyName, Form missing = none) global
    Guard()
endFunction

int function FileIntListAdd(string KeyName, int value, bool allowDuplicate = true) global
    Guard()
endFunction
int function FileFloatListAdd(string KeyName, float value, bool allowDuplicate = true) global
    Guard()
endFunction
int function FileStringListAdd(string KeyName, string value, bool allowDuplicate = true) global
    Guard()
endFunction
int function FileFormListAdd(string KeyName, Form value, bool allowDuplicate = true) global
    Guard()
endFunction

int function FileIntListAdjust(string KeyName, int index, int amount) global
    Guard()
endFunction
float function FileFloatListAdjust(string KeyName, int index, float amount) global
    Guard()
endFunction

int function FileIntListRemove(string KeyName, int value, bool allInstances = false) global
    Guard()
endFunction
int function FileFloatListRemove(string KeyName, float value, bool allInstances = false) global
    Guard()
endFunction
int function FileStringListRemove(string KeyName, string value, bool allInstances = false) global
    Guard()
endFunction
int function FileFormListRemove(string KeyName, Form value, bool allInstances = false) global
    Guard()
endFunction

int function FileIntListGet(string KeyName, int index) global
    Guard()
endFunction
float function FileFloatListGet(string KeyName, int index) global
    Guard()
endFunction
string function FileStringListGet(string KeyName, int index) global
    Guard()
endFunction
Form function FileFormListGet(string KeyName, int index) global
    Guard()
endFunction

int function FileIntListSet(string KeyName, int index, int value) global
    Guard()
endFunction
float function FileFloatListSet(string KeyName, int index, float value) global
    Guard()
endFunction
string function FileStringListSet(string KeyName, int index, string value) global
    Guard()
endFunction
Form function FileFormListSet(string KeyName, int index, Form value) global
    Guard()
endFunction

int function FileIntListClear(string KeyName) global
    Guard()
endFunction
int function FileFloatListClear(string KeyName) global
    Guard()
endFunction
int function FileStringListClear(string KeyName) global
    Guard()
endFunction
int function FileFormListClear(string KeyName) global
    Guard()
endFunction

bool function FileIntListRemoveAt(string KeyName, int index) global
    Guard()
endFunction
bool function FileFloatListRemoveAt(string KeyName, int index) global
    Guard()
endFunction
bool function FileStringListRemoveAt(string KeyName, int index) global
    Guard()
endFunction
bool function FileFormListRemoveAt(string KeyName, int index) global
    Guard()
endFunction

bool function FileIntListInsert(string KeyName, int index, int value) global
    Guard()
endFunction
bool function FileFloatListInsert(string KeyName, int index, float value) global
    Guard()
endFunction
bool function FileStringListInsert(string KeyName, int index, string value) global
    Guard()
endFunction
bool function FileFormListInsert(string KeyName, int index, Form value) global
    Guard()
endFunction

int function FileIntListCount(string KeyName) global
    Guard()
endFunction
int function FileFloatListCount(string KeyName) global
    Guard()
endFunction
int function FileStringListCount(string KeyName) global
    Guard()
endFunction
int function FileFormListCount(string KeyName) global
    Guard()
endFunction

int function FileIntListFind(string KeyName, int value) global
    Guard()
endFunction
int function FileFloatListFind(string KeyName, float value) global
    Guard()
endFunction
int function FileStringListFind(string KeyName, string value) global
    Guard()
endFunction
int function FileFormListFind(string KeyName, Form value) global
    Guard()
endFunction

bool function FileIntListHas(string KeyName, int value) global
    Guard()
endFunction
bool function FileFloatListHas(string KeyName, float value) global
    Guard()
endFunction
bool function FileStringListHas(string KeyName, string value) global
    Guard()
endFunction
bool function FileFormListHas(string KeyName, Form value) global
    Guard()
endFunction

function FileIntListSlice(string KeyName, int[] slice, int startIndex = 0) global
    Guard()
endFunction
function FileFloatListSlice(string KeyName, float[] slice, int startIndex = 0) global
    Guard()
endFunction
function FileStringListSlice(string KeyName, string[] slice, int startIndex = 0) global
    Guard()
endFunction
function FileFormListSlice(string KeyName, Form[] slice, int startIndex = 0) global
    Guard()
endFunction

int function FileIntListResize(string KeyName, int toLength, int filler = 0) global
    Guard()
endFunction
int function FileFloatListResize(string KeyName, int toLength, float filler = 0.0) global
    Guard()
endFunction
int function FileStringListResize(string KeyName, int toLength, string filler = "") global
    Guard()
endFunction
int function FileFormListResize(string KeyName, int toLength, Form filler = none) global
    Guard()
endFunction


bool function FileIntListCopy(string KeyName, int[] copy) global
    Guard()
endFunction
bool function FileFloatListCopy(string KeyName, float[] copy) global
    Guard()
endFunction
bool function FileStringListCopy(string KeyName, string[] copy) global
    Guard()
endFunction
bool function FileFormListCopy(string KeyName, Form[] copy) global
    Guard()
endFunction

function debug_SaveFile() global
    Guard()
endFunction


;/
   Currently no longer implemented, unknown if/when they will return.
/;
int function debug_FileGetIntKeysCount() global
    Guard()
endFunction

int function debug_FileGetFloatKeysCount() global
    Guard()
endFunction

int function debug_FileGetStringKeysCount() global
    Guard()
endFunction

int function debug_FileGetIntListKeysCount() global
    Guard()
endFunction

int function debug_FileGetFloatListKeysCount() global
    Guard()
endFunction

int function debug_FileGetStringListKeysCount() global
    Guard()
endFunction

string function debug_FileGetIntKey(int index) global
    Guard()
endFunction

string function debug_FileGetFloatKey(int index) global
    Guard()
endFunction

string function debug_FileGetStringKey(int index) global
    Guard()
endFunction

string function debug_FileGetIntListKey(int index) global
    Guard()
endFunction

string function debug_FileGetFloatListKey(int index) global
    Guard()
endFunction

string function debug_FileGetStringListKey(int index) global
    Guard()
endFunction

function debug_FileDeleteAllValues() global
endFunction

function debug_SetDebugMode(bool enabled) global
endFunction

bool function ImportFile(string fileName, string restrictKey = "", int restrictType = -1, Form restrictForm = none, bool restrictGlobal = false, bool keyContains = false) global
    Guard()
endFunction
bool function ExportFile(string fileName, string restrictKey = "", int restrictType = -1, Form restrictForm = none, bool restrictGlobal = false, bool keyContains = false, bool append = true) global
    Guard()
endFunction


Function Guard()
    Debug.MessageBox("StorageUtil: Dom't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction

