Scriptname CustomSkills_FormExt Hidden

; Custom Skill Increase Event
; ---------------------------

; Register a form for the custom skill increase event.
Function RegisterForCustomSkillIncrease(Form akReceiver) global native

; Unregisters a form from receiving the custom skill increase event.
Function UnregisterForCustomSkillIncrease(Form akReceiver) global native

; Copy this event to your script if you register for it.
Event OnCustomSkillIncrease(string asSkillId)
EndEvent

; Custom Skill Book Read Event
; ----------------------------

; Register a form for the custom skill book read event.
; The default skill book behavior can optionally be replaced.
Function RegisterForCustomSkillBookRead(Form akReceiver, bool abReplaceDefault = false) global native

; Unregisters a form from receiving the custom skill book read event.
Function UnregisterForCustomSkillBookRead(Form akReceiver) global native

; Copy this event to your script if you register for it.
Event OnCustomSkillBookRead(string asSkillId, int aiIncrement)
EndEvent
