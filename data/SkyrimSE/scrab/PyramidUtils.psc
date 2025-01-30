Scriptname PyramidUtils Hidden
{
  Legacy Script for compatibility. All functions here have been moved into corresponding SPE_ scripts
}

; Actor
Function SetActorCalmed(Actor akActor, bool abCalmed) global
    Guard()
EndFunction
Function SetActorFrozen(Actor akTarget, bool abFrozen) global
    Guard()
EndFunction
Actor[] Function GetDetectedBy(Actor akActor) global
    Guard()
EndFunction
Keyword[] Function WornHasKeywords(Actor akActor, Keyword[] akKwds) global
    Guard()
EndFunction
Keyword[] Function WornHasKeywordStrings(Actor akActor, String[] akKwds) global
    Guard()
EndFunction
Function Dismount(Actor akTarget) global
    Guard()
EndFunction

; Inventory Processing
Form[] Function GetItemsByKeyword(ObjectReference akContainer, Keyword[] akKeywords, bool abMatchAll = false) global
    Guard()
EndFunction
Form[] Function FilterFormsByKeyword(Form[] akForms, Keyword[] akKeywords, bool abMatchAll = false, bool abInvert = false) global
    Guard()
EndFunction
Form[] Function FilterFormsByGoldValue(Form[] akForms, int aiValue, bool abGreaterThan = true, bool abEqual = true) global
    Guard()
EndFunction
Form[] Function FilterByEnchanted(ObjectReference akContainer, Form[] akForms, bool abEnchanted = true) global
    Guard()
EndFunction
Form[] Function FilterByEquippedSlot(Form[] akForms, int[] aiSlots, bool abAll = false) global
    Guard()
EndFunction
Int Function RemoveForms(ObjectReference akFromCont, Form[] akForms, ObjectReference akToCont = none) global
    Guard()
EndFunction

; Form Processing
bool Function FormHasKeyword(Form akItem, Keyword[] akKwds, bool abAll = false) global
    Guard()
EndFunction
bool Function FormHasKeywordStrings(Form akItem, String[] akKwds, bool abAll = false) global
    Guard()
EndFunction

; Player
Actor Function GetPlayerSpeechTarget() global
    Guard()
EndFunction

; String Processing
String Function ReplaceAt(String asStr, int aiIndex, String asReplace) global
    Guard()
EndFunction

; Input
String Function GetButtonForDXScanCode(int aiCode) global
    Guard()
EndFunction
Function RegisterForAllAlphaNumericKeys(Form akForm) global
    Guard()
EndFunction

Form[] Function GetInventoryNamedObjects(ObjectReference akContainer, String[] asNames) global
    Guard()
EndFunction

; unlike ObjecReference.GetItemHealthPercent, this will work on items in a container (range: 0.0-1.6)
float Function GetTemperFactor(ObjectReference akContainer, Form akItem) global
    Guard()
EndFunction

; geography
ObjectReference Function GetQuestMarker(Quest akQuest) global
    Guard()
EndFunction

; if cell is exterior gets worldspace like normal, if interior looks for external doors and their worldspace
WorldSpace[] Function GetExteriorWorldSpaces(Cell akCell) global
    Guard()
EndFunction
Location[] Function GetExteriorLocations(Cell akCell) global
    Guard()
EndFunction

; unlike GetDistance this works even when one or both refs are in an interior or another cell
float Function GetTravelDistance(ObjectReference akRef1, ObjectReference akRef2) global
    Guard()
EndFunction

; uses worldspace offsets to get absolute position on external refs
float Function GetAbsPosX(ObjectReference akRef) global
    Guard()
EndFunction
float Function GetAbsPosY(ObjectReference akRef) global
    Guard()
EndFunction
float Function GetAbsPosZ(ObjectReference akRef) global
    Guard()
EndFunction

; misc
GlobalVariable Function GetGlobal(String asEditorID) global
    Guard()
EndFunction

; custom console proxy functions - ignore these
String Function ConsoleGetAbsPos(Form akRef) global
    Guard()
EndFunction

String Function ConsoleGetPlayerAbsDist(Form akRef) global
    Guard()
EndFunction

; Script Version Number
; This will no longer change and is only meant for backwards compatibility with mods made while this script was a standalone mod
Float Function GetVersion() global
    Guard()
EndFunction


Function Guard()
    Debug.MessageBox("PyramidUtils: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
