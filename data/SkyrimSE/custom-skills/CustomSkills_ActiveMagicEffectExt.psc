Scriptname CustomSkills_ActiveMagicEffectExt Hidden

; Custom Skill Increase Event
; ---------------------------

; Register a magic effect for the custom skill increase event.
Function RegisterForCustomSkillIncrease(ActiveMagicEffect akReceiver) global native

; Unregisters a magic effect from receiving the custom skill increase event.
Function UnregisterForCustomSkillIncrease(ActiveMagicEffect akReceiver) global native

; Copy this event to your script if you register for it.
Event OnCustomSkillIncrease(string asSkillId)
EndEvent

; Custom Skill Book Read Event
; ----------------------------

; Register a magic effect for the custom skill book read event.
; The default skill book behavior can optionally be replaced.
Function RegisterForCustomSkillBookRead(ActiveMagicEffect akReceiver, bool abReplaceDefault = false) global native

; Unregisters a magic effect from receiving the custom skill book read event.
Function UnregisterForCustomSkillBookRead(ActiveMagicEffect akReceiver) global native

; Copy this event to your script if you register for it.
Event OnCustomSkillBookRead(string asSkillId, int aiIncrement)
EndEvent
