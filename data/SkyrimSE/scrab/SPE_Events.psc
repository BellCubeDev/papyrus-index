ScriptName SPE_Events Hidden

; Similar to the Vanilla RegisterForAnimationEvent(). Supports payload data (Sound.NPCHumanCartRidePlayerEnter, etc).
Function RegisterForAnimationEventEx(Actor akReference, String asEventName) global native
Function RegisterForAnimationEventEx_Alias(ReferenceAlias akAlias, String asEventName) global native
Function RegisterForAnimationEventEx_MgEff(ActiveMagicEffect akMagicEffect, String asEventName) global native
Function UnregisterForAnimationEventEx(Actor akReference, String asEventName) global native
Function UnregisterForAnimationEventEx_Alias(ReferenceAlias akAlias, String asEventName) global native
Function UnregisterForAnimationEventEx_MgEff(ActiveMagicEffect akMagicEffect, String asEventName) global native

Event OnAnimationEventEx(Actor akReference, String asEventName, String asPayload)
EndEvent
