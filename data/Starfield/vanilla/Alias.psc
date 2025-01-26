Scriptname Alias extends ScriptObject Native Hidden

; Returns the quest that owns this alias
Quest Function GetOwningQuest() native

; Refills this alias. Function won't return until alias has been re-filled.
Function RefillAlias() native

; Refills the dependent aliases of this alias
Function RefillDependentAliases() native

; Turns on profiling for this specific object and all scripts attached to it - setting doesn't persist across saves
; Will do nothing on release console builds, and if the Papyrus:bEnableProfiling ini setting is off
Function StartObjectProfiling() native debugOnly

; Turns off profiling for this specific object and all scripts attached to it - setting doesn't persist across saves
; Will do nothing on release console builds, and if the Papyrus:bEnableProfiling ini setting is off
Function StopObjectProfiling() native debugOnly

; Event received when this alias is initialized and filled - before quest startup stage is run
; (other aliases on the same quest will also be filled)
Event OnAliasInit()
EndEvent

; Event received when the quest owning this alias is reset
Event OnAliasReset()
EndEvent

; Event received when the alias has been shut down (because the quest has been shut down)
; Note that the alias will be empty by the time this event is received
Event OnAliasShutdown()
EndEvent

; Event received when this alias has been started - after quest startup is run
Event OnAliasStarted()
EndEvent

;jduvall -- convenience function
;checks to see if there is anything in this alias
bool Function IsFilled()
	if self is ReferenceAlias
		return (self as ReferenceAlias).GetReference() != None
	elseif self is RefCollectionAlias
		return (self as RefCollectionAlias).GetCount() > 0
	elseif self is LocationAlias
		return (self as LocationAlias).GetLocation() != None
	endif
	;should be impossible, but just in case
	return false
EndFunction

;jduvall - convenience function
;checks to see if the passed in alias is the same type (ReferenceAlias, RefCollectionAlias, or LocationAlias)
bool Function IsSameType(Alias AliasToCheck)
	if self is ReferenceAlias
		return AliasToCheck is ReferenceAlias
	elseif self is RefCollectionAlias
		return AliasToCheck is RefCollectionAlias
	elseif self is LocationAlias
		return AliasToCheck is LocationAlias
	endif
	;should be impossible, but just in case
	return false
EndFunction

;jduvall - convenience function
;Copies contents of this alias over the contents of the TargetAlias, if it's the same type (both are ReferenceAlias, both are RefCollectionAliases, both are LocationAliases)
;skipIfEmpty: if true (default), it will NOT copy if this alias is empty.
;CopyOver: if true (default), it will copy over contents in TargetAlias. If false, it will only copy if TargetAlias is empty.
;returns true if it copied; returns false if it did not copy
bool Function CopyIntoAlias(Alias TargetAlias, bool SkipIfEmpty = true, bool CopyOver = true)
	if IsSameType(TargetAlias)
		if SkipIfEmpty == false || IsFilled()
			if CopyOver || TargetAlias.IsFilled() == false

				ReferenceAlias targetReferenceAlias = TargetAlias as ReferenceAlias
				if targetReferenceAlias
					targetReferenceAlias.ForceRefTo((self as ReferenceAlias).GetReference())
					return true
				endif

				RefCollectionAlias targetRefCollectionAlias = TargetAlias as RefCollectionAlias
				if targetRefCollectionAlias
					targetRefCollectionAlias.RemoveAll()
					targetRefCollectionAlias.AddRefCollection(self as RefCollectionAlias)
					return true
				endif

				LocationAlias targetLocationAlias = TargetAlias as LocationAlias
				if targetLocationAlias
					targetLocationAlias.ForceLocationTo((self as LocationAlias).GetLocation())
					return true
				endif

			endif
		endif
	endIf
		
	return false
EndFunction
