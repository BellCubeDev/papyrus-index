Scriptname LeveledItem extends Form Native Hidden

; Adds the given count of the given form to the under the given level in this leveled list
Function AddForm(Form apForm, int aiLevel, int aiCount) native

; Removes all script added forms from this leveled list
Function Revert() native