scriptname PapyrusUtilEx hidden
;These functions can be used to alter papyrus arrays of any type.
;Any arrays used in these functions must be initialized first, either in the creation kit or by using for example myActorArray = new Actor[1]
;Also note that this only works for arrays defined in the global scope (not defined inside of functions or events). 
;You can create new arrays using a placeholder array in the global scope and a wrapper function. See the PapyrusUtilEx_Example.psc script for more details.
;All of these functions take an akHandle parameter, which is the handle of the object the sScriptName that contains the sArrayPropertyName is attached to.
;Use the GetHandle functions below to get the handle for an object. Note that a handle for an object can change if the user changes their load order, 
;so use the GetHandle functions each time before using the other functions in this script.
;See the PapyrusUtilEx_Example.psc script for examples of how to use these functions.

string Function GetFormHandle(Form akForm) Global Native
string Function GetAliasHandle(Alias akAlias) Global Native
string Function GetActiveEffectHandle(ActiveMagicEffect akActiveEffect) Global Native

;Resize a papyrus array.
;if the array is sized to larger than before, the rest of the array is filled with the element at the fillIndex in the array.
;A value of -1 (default) for the fillIndex means the last element in the array.
;If the array is sized smaller the elements past the new size are removed from the array.
bool Function ResizeArray(string akHandle, string sScriptName, string sArrayPropertyName, int size, int fillIndex = -1) Global Native

;Remove the element at the index from the array.
;If the removeAll parameter is true, removes all elements from the array that match the element at the index 
;A value of -1 for the index (default) means the last element in the array.
;Returns the amount of elements removed, if it returns 0 it means the index wasn't valid (>= array.length)
int Function RemoveFromArray(string akHandle, string sScriptName, string sArrayPropertyName, int index = -1, bool removeAll = false) Global Native

;Remove a portion of the array. 
;If keep is true (default) it keeps the portion between the startIndex and endIndex and removes the rest. If keep is false, it removes the portion between the startIndex and endIndex.
;A value of -1 for the endIndex (default) means the last element in the array.
bool function SliceArray(string akHandle, string sScriptName, string sArrayPropertyName, int startIndex, int endIndex = -1, bool keep = true) Global Native

;Take a portion of the _A array and remove it, merging it with or replacing the _B array depending on the replace parameter.
;If keep is true (default) it keeps the portion between the startIndex and endIndex and removes the rest. If keep is false, it removes the portion between the startIndex and endIndex.
;Array _A and array _B must be the same type. Remember both arrays must be already initialized.
bool function SliceArrayOnto(string akHandle_A, string sScriptName_A, string sArrayPropertyName_A, string akHandle_B, string sScriptName_B, string sArrayPropertyName_B, int startIndex, int endIndex = -1, bool replace = false, bool keep = true) Global Native

;Merge the _A array to the end of the _B array, increasing _B array's size. The _A array is unaltered.
;Array _A and array _B must be the same type. Remember both arrays must be already initialized.
bool function MergeArrays(string akHandle_A, string sScriptName_A, string sArrayPropertyName_A, string akHandle_B, string sScriptName_B, string sArrayPropertyName_B) Global Native

;Replace the _B array with a copy of the _A array. The _A array is unaltered.
;Array _A and array _B must be the same type. Remember both arrays must be already initialized.
bool function CopyArray(string akHandle_A, string sScriptName_A, string sArrayPropertyName_A, string akHandle_B, string sScriptName_B, string sArrayPropertyName_B) Global Native

;Returns the number of instances of the element at the index that the array contains. 
;A value of -1 for the index (default) means the last element in the array.
int Function CountInArray(string akHandle, string sScriptName, string sArrayPropertyName, int index = -1) Global Native