ScriptName ShazdehUtils Hidden

;----------------------------------------------------------------------------------------------------------
;Actor
;----------------------------------------------------------------------------------------------------------

Bool Function HasAnyPerkInList(Actor akActor, FormList akList) Global Native

Bool Function HasAllPerksInList(Actor akActor, FormList akList) Global Native


;----------------------------------------------------------------------------------------------------------
;Clipboard
;----------------------------------------------------------------------------------------------------------

Bool Function SetClipboard(String asText) Global Native

String Function GetClipboard() Global Native


;----------------------------------------------------------------------------------------------------------
;Forms
;----------------------------------------------------------------------------------------------------------

; Finds form by either its Editor ID, or by Form ID
Form Function LookupFormSmart(String asID) Global Native

; returns the 4 character Form signature
String Function GetFormTypeString(Form akForm) Global Native

Bool Function HasAnyKeywordInList(Form akForm, FormList akList) Global Native

Bool Function HasAllKeywordsInList(Form akForm, FormList akList) Global Native

; akForm can be either: Spell, Potion, Ingredient, Scroll, Enchantment
Bool Function FormHasMagicEffect(Form akForm, MagicEffect akEffect) Global Native

; akForm can be either: Spell, Potion, Ingredient, Scroll, Enchantment
Bool Function FormHasMagicEffectKeyword(Form akForm, Keyword akKeyword) Global Native

Form Function GetFormWithStrongestEffect(ObjectReference akSource, MagicEffect akEffect, Int aiFormType, Keyword akKeywordFilter = None) Global Native

Form Function GetFormWithWeakestEffect(ObjectReference akSource, MagicEffect akEffect, Int aiFormType, Keyword akKeywordFilter = None) Global Native

Potion Function GetStrongestPotion(ObjectReference akSource, MagicEffect akEffect, Keyword akKeywordFilter = None) Global
    Guard()
EndFunction

Spell Function GetStrongestSpell(ObjectReference akSource, MagicEffect akEffect, Keyword akKeywordFilter = None) Global
    Guard()
EndFunction

Potion Function GetWeakestPotion(ObjectReference akSource, MagicEffect akEffect, Keyword akKeywordFilter = None) Global
    Guard()
EndFunction

Spell Function GetWeakestSpell(ObjectReference akSource, MagicEffect akEffect, Keyword akKeywordFilter = None) Global
    Guard()
EndFunction

; Recursive HasForm that checks FormList(s) within akList as well
Bool Function FormlistHasFormDeep(FormList akList, Form akForm) Global Native

; akFormFilter can be:
;   None;
;   a Keyword (only trasnfer items with that keyword);
;   or a FormList (only transfer items within that FormList),
;   or Form
Function TransferItems(ObjectReference akSource, ObjectReference akTarget, Int aiCount = -1, Int aiFormType = 0, Form akFormFilter = None, Bool abExcludeWorn = True, Bool abExcludeFavorites = True, Bool abExcludeQuestItems = True) Global Native

Int Function GetItemCountInContainersArray(ObjectReference[] aReferences, Form akForm) Global Native

Int Function GetItemCountInContainersList(FormList akList, Form akForm) Global Native

Function TransferItemFromContainersArray(FormList akList, ObjectReference[] akRef, Form akItem, Int aiCount) Global Native

Function TransferItemFromContainersList(FormList akList, ObjectReference akRef, Form akItem, Int aiCount) Global Native


;----------------------------------------------------------------------------------------------------------
;Gamepad
;----------------------------------------------------------------------------------------------------------

; Game.IsUsingGamepad() return false if the last pressed key is from keyboard,
; whereas this strictly checks whether gamepad is connected.
Bool Function IsGamepadConnected() Global Native

; Simulate pressing the left thumb stick on gamepad
Function SimulateLeftStickInput(Float afXValue = 0.0, Float afYValue = 0.0) Global Native


;----------------------------------------------------------------------------------------------------------
;ObjectReference
;----------------------------------------------------------------------------------------------------------

; used for teleport doors, gives you the other door connected to this Reference
ObjectReference Function GetLinkedDoor(ObjectReference akRef) Global Native

Function Guard()
    Debug.MessageBox("ShazdehUtils: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
