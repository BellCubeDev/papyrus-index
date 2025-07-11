ScriptName WSFWIdentifier native hidden

Struct PowerGridStatistics
	Bool broken
	Bool checked
	Int validNodes
	Int invalidNodes
	Int numBadGrids
	Int totalNodes
	Int totalGrids
EndStruct

;-- Functions ---------------------------------------

string Function GetReferenceName( ObjectReference ref ) global native

Function MessageReferenceName( ObjectReference ref ) global
    Guard()
EndFunction


; Completely deletes all power grids of a settlement. Recommended to use for settlements that are to be scrapped entirely.
Bool Function ResetPowerGrid( ObjectReference workshop_ref ) global native

; Checks and optionally fixes errors of settlement power grids. Takes an array of power grid indices as a filter parameter. Returns statistics data in PowerGridStatistics struct. Logs results.
; fixerrors = 0 - check settlement for power grid errors, but don't fix anything
; fixerrors = 1 - check settlement for power grid errors, and fix errors by removing bad power grids entirely (not recommended legacy feature)
; fixerrors = 2 - check settlement for power grid errors, and fix errors by cleaning bad power grids by removing invalid power nodes only (recommended)
PowerGridStatistics Function CheckAndFixPowerGridWithFilter( ObjectReference workshop_ref, Int fixerrors, Int[] gridFilter ) global native

; Checks and optionally fixes errors of settlement power grids. Returns statistics data in PowerGridStatistics struct. Logs results.
; fixerrors = 0 - check settlement for power grid errors, but don't fix anything
; fixerrors = 1 - check settlement for power grid errors, and fix errors by removing bad power grids entirely (not recommended legacy feature)
; fixerrors = 2 - check settlement for power grid errors, and fix errors by cleaning bad power grids by removing invalid power nodes only (recommended)
PowerGridStatistics Function CheckAndFixPowerGrid( ObjectReference workshop_ref, Int fixerrors ) global
    Guard()
EndFunction

; Checks errors of settlement power grids. Takes an array of power grid indices as a filter parameter. Logs results.
Bool Function ScanPowerGridWithFilter( ObjectReference workshop_ref, Int[] gridFilter ) global native

; Checks errors of settlement power grids. Logs results.
Bool Function ScanPowerGrid( ObjectReference workshop_ref ) global
    Guard()
EndFunction

; Gets the number of power grids of a settlement.
Int Function GetPowerGridCount( ObjectReference workshop_ref ) global native

; Gets the indices of good power grids of a settlement.
Int[] Function GetGoodPowerGridIndices( ObjectReference workshop_ref ) global native

; Gets the indices of bad power grids of a settlement.
Int[] Function GetBadPowerGridIndices( ObjectReference workshop_ref ) global native

; Gets the FormIDs of all invalid power nodes.
Int[] Function GetInvalidNodeFormIDs( ObjectReference workshop_ref ) global native

; Removes power nodes from all power grids by a list of FormIDs. Note that the reason it takes FormIDs instead of Object References is because most of the times these objects don't exist in the game anymore.
Int[] Function RemoveNodesFromPowerGrid( ObjectReference workshop_ref, Int[] iFormIDs ) global native

; Removes the power node of an existing Object Reference from all power grids. This is mostly for testing purposes.
Bool Function RemoveExistingObjectFromPowerGrid( ObjectReference workshop_ref, ObjectReference akRefToRemove ) global
    Guard()
EndFunction

; Gets the index of the power grid of an existing settlement object. Returns a negative number on errors.
Int Function GetPowerGridIndexForObject( ObjectReference workshop_ref, ObjectReference refObject ) global native


Function TestPowerGridFunctions( ObjectReference workshop_ref, ObjectReference akRefToRemove ) global
    Guard()
EndFunction


; convenience functions for the test function
String Function GetFormIDHex( Int thisFormID, Bool lightMaster = False ) global
    Guard()
EndFunction


Int Function GetModIndex( Int aiFormID, Bool lightMaster = False ) global
    Guard()
EndFunction


String Function DecToHex( Int n, Int lngth = 8 ) global
    Guard()
EndFunction


Int Function Mod( Int a, Int b ) global
    Guard()
EndFunction


Function Guard()
    Debug.MessageBox("WSFWIdentifier: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
