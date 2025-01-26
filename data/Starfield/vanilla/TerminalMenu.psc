Scriptname TerminalMenu extends Form Native Hidden

; Event called when a terminal menu item is run, with the specified target and terminal owner (in parallel with the fragment)
Event OnTerminalMenuItemRun(int auiMenuItemID, TerminalMenu akTerminalBase, ObjectReference akTerminalRef)
EndEvent

; Event called when this terminal menu is entered, with the specified target
Event OnTerminalMenuEnter(TerminalMenu akTerminalBase, ObjectReference akTerminalRef)
EndEvent

; Adds a dynamic menu item to the TerminalMenu of the specified reference
Function AddDynamicMenuItem(ObjectReference aTerminalRef, int aiTemplateIndex, int aiItemID, Form[] akTagReplacementForms) native

; Adds a dynamic body text item to the TerminalMenu of the specified reference
Function AddDynamicBodyTextItem(ObjectReference aTerminalRef, int aiTemplateIndex, int aiItemID, Form[] akTagReplacementForms) native

; Clears all dynamic menu items from the specified reference
Function ClearDynamicMenuItems(ObjectReference aTerminalRef) native

; Clears all dynamic body text items from the specified reference
Function ClearDynamicBodyTextItems(ObjectReference aTerminalRef) native

; Get the current terminal reference being used by the player
ObjectReference Function GetCurrentTerminalObjectRef() native global