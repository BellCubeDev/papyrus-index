Scriptname CustomSkills_AliasExt Hidden

; Custom Skill Increase Event
; ---------------------------

; Register an alias for the custom skill increase event.
Function RegisterForCustomSkillIncrease(Alias akReceiver) global native

; Unregisters an alias from receiving the custom skill increase event.
Function UnregisterForCustomSkillIncrease(Alias akReceiver) global native

; Copy this event to your script if you register for it.
Event OnCustomSkillIncrease(string asSkillId)
EndEvent

; Custom Skill Book Read Event
; ----------------------------

; Register an alias for the custom skill book read event.
; The default skill book behavior can optionally be replaced.
Function RegisterForCustomSkillBookRead(Alias akReceiver, bool abReplaceDefault = false) global native

; Unregisters an alias from receiving the custom skill book read event.
Function UnregisterForCustomSkillBookRead(Alias akReceiver) global native

; Copy this event to your script if you register for it.
Event OnCustomSkillBookRead(string asSkillId, int aiIncrement)
EndEvent
