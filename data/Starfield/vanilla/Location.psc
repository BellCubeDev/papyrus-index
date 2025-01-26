Scriptname Location extends Form Native Hidden

; Adds the specified keyword to the location
Function AddKeyword(Keyword akKeyword) native

; Links the given location to this one under the given keyword
Function AddLinkedLocation(Location akLoc, Keyword akKeyword) native

; Get the count of all instantiated Actors (across all process levels) who belong to this location.  
; Can optionally specify a keyword for a linkedref that they must have (apRequiredLinkedRefKeyword), and/or a linkedref keyword they must NOT have (apExcludeLinkedRefKeyword).
; (Presence or absence of the keywordless linkedref cannot be checked.)
; (NOTE: if you're also necessarily going to call GetActors, just do that and check its size, instead of calling this.)
int Function CountActors( Keyword apRequiredLinkedRefKeyword = None, Keyword apExcludeLinkedRefKeyword = None ) native

; Disables player space travel to all locations except the specified location. Can call on multiple locations.
bool Function DisableSpaceTravelToAllExcept(Quest akQuest, bool abAddLocation = true) native

; Enables player space travel to the specified location.
bool Function EnableSpaceTravel(Quest akQuest, bool abEnable = true) native

; Get an array of all instantiated Actors (across all process levels) who belong to this location.  
; Can optionally specify a keyword for a linkedref that they must have (apRequiredLinkedRefKeyword), and/or a linkedref keyword they must NOT have (apExcludeLinkedRefKeyword).
; (Presence or absence of the keywordless linkedref cannot be checked.)
Actor[] Function GetActors( Keyword apRequiredLinkedRefKeyword = None, Keyword apExcludeLinkedRefKeyword = None ) native

; Returns an array of all locations linked to this one under the given keyword
Location[] Function GetAllLinkedLocations(Keyword akKeyword) native

; Returns this location's planet
Planet Function GetCurrentPlanet() native

; Returns the float value attached to the specified keyword attached to this location
float Function GetKeywordData(Keyword akKeyword) native

; Gets this location's minimum level
int Function GetMinLevel() native

; Gets this location's maximum level
int Function GetMaxLevel() native

; Gets this location's parent locations
; Can optionally specify a keyword that the parent location must have
Location[] Function GetParentLocations(Keyword apKeyword = None) native

; Returns the number of alive references matching the specified reference type
int Function GetRefTypeAliveCount(LocationRefType akRefType) native

; Returns the number of dead references matching the specified reference type
int Function GetRefTypeDeadCount(LocationRefType akRefType) native

; Gets an actor value on location
float Function GetValue(ActorValue akActorValue) native

; Returns if these two locations have a common parent - filtered with the keyword, if provided
bool Function HasCommonParent(Location akOther, Keyword akFilter = None) native

; Returns if this location has ever been explored
bool Function HasEverBeenExplored() native

; Returns if this location has the specified reference type
bool Function HasRefType(LocationRefType akRefType) native

; Returns whether this location is flagged as "explored" or not
bool Function IsExplored() native

; Returns whether the other location is a child of this one
bool Function IsChild(Location akOther) native

; Is this location linked to the given one under the given keyword?
bool Function IsLinkedLocation(Location akLocation, Keyword akKeyword) native

; Is this location loaded in game?
bool Function IsLoaded() native

bool Function IsSameLocation(Location akOtherLocation, Keyword akKeyword = None)
{Returns true if the calling location is the same as the supplied location - if an optional keyword is supplied, it also returns true if the locations share a parent with that keyword, or if either location is a child of the other and the other has that keyword.}
;jduvall 
	bool bmatching = self == akOtherLocation
	if !bmatching && akKeyword
		bmatching = HasCommonParent(akOtherLocation, akKeyword)
		
		if !bmatching && akOtherLocation.HasKeyword(akKeyword)
			bmatching = akOtherLocation.IsChild(self) 
		elseif !bmatching && self.HasKeyword(akKeyword)
			bmatching = self.IsChild(akOtherLocation) 
		endif
		
	endif
  return bmatching
endFunction

; adds afData to the current keyword value (threadsafe)
Function ModifyKeywordData(Keyword akKeyword, float afData)
	float currentValue = GetKeywordData(akKeyword)
	SetKeywordData(akKeyword, currentValue + afData)
endFunction

; Removed the specified keyword from the location
Function RemoveKeyword(Keyword akKeyword) native

; Removes any link between this location and the given one under the given keyword
Function RemoveLinkedLocation(Location akLoc, Keyword akKeyword) native

; Forces reset on all encounter zones and interior cells which use this location
Function Reset() native

; Sets the specified keyword's data on the location
Function SetKeywordData(Keyword akKeyword, float afData) native

; Sets this location as explored or not
Function SetExplored(bool abExplored = true) native

;Set the given faction as the faction owner for this location
Function SetFactionOwner(Faction akFaction) native

; Sets this encounter zone's minimum level
Function SetMinLevel( int aiMinLevel ) native

; Sets this encounter zone's maximum level
Function SetMaxLevel( int aiMaxLevel ) native

; Forces the value of the never reset flag on this location
Function SetNeverResets(bool abFlag = true) native

; Sets an actor value on location
Function SetValue(ActorValue akActorValue, float afValue) native

Function ModValue(ActorValue akActorValue, float afAmount)
	float currentValue = GetValue(akActorValue)
	SetValue(akActorValue, currentValue + afAmount)
endFunction


; Event sent to location when its explored
Event OnLocationExplored()
EndEvent

; Event sent when a location is loaded
Event OnLocationLoaded()
EndEvent
