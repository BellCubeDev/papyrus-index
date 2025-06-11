scriptname DbSksePersistentVariables extends Actor
;This script is attached to the player and is only used to save variables / properties to make them persistent to help prevent ctds. 
;Currently only saves the last player activated objectReference and the Last Player Menu Activated objectReference. 
;You can include these events in any of your own scripts if you wish, they don't need to be registered for.

ObjectReference Property LastPlayerActivatedRef Auto Hidden
ObjectReference Property LastPlayerMenuActivatedRef Auto Hidden

;these events are no longer sent do to performance issues. The above properties are now filled directly from c++
Event OnDbSksePlayerActivatedRef(ObjectReference ref)
    Guard()
EndEvent

Event OnDbSksePlayerActivatedMenuRef(ObjectReference ref)
    Guard()
EndEvent

Function Guard()
    Debug.MessageBox("DbSksePersistentVariables: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
