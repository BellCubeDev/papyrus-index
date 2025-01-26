Scriptname ObjectReference extends Form Native Hidden

; Function to get the ObjectReference for the ship I am in
SpaceshipReference Function GetCurrentShipRef()
	;Only ships can be parent refs right now. Might need to specify more if that changes
	ObjectReference myShip = GetParentCell().GetParentRef()
	return (myShip as SpaceshipReference)
EndFunction

; convenient way to call Lock(False) on a door
Function Unlock(bool abAsOwner = false)
	Lock(False, abAsOwner)
endFunction

bool FUNCTION rampRumble(float power = 0.5, float duration = 0.25, float falloff = 1600.0)
	; Function to shake cam/controller based on distance from player
	; should always be called on the source of the rumble,
	; as final intensity is relevant to player
	if power > 1.0 || power <= 0
; 		debug.traceStack(self + " called rampRumble() but parameter 'power' was invalid.  Must be a non-zero float less than 1.0",1)
		; throw the warning, but don't return false - value gets clamped anyway
	endif
	float playerDist = game.getplayer().getDistance(self)
	; ignore if the player is too far away
	if playerDist < falloff
		float intensity = (1 - (playerDist / falloff))
		; ramp actual intensity down based on parameter value
		intensity = intensity*power
		if intensity > 1.0
			; clamp to prevent invalid values
; 			debug.traceStack(self + " called for too much controller/camera shake.  Clamped to 1.0", 0)
			intensity = 1.0
		elseif intensity <= 0
			; clamp to prevent invalid values
; 			debug.traceStack(self + " called for too little controller/camera shake", 0)
			intensity = 0
			return false
		endif
		game.shakeCamera(game.getPlayer(), intensity)
		game.shakeController(intensity, intensity, duration)
		return true
	else
; 		debug.traceStack(self + "called for rampedRumble(), but player is too far away", 0)
		return False
	endif
endFUNCTION

; Function to know if I'm near the player (whether I can be safely enabled or disabled)
bool Function IsNearPlayer()
	Actor player = Game.GetPlayer()
	Cell targetCell = self.GetParentCell()
	Cell playerCell = player.GetParentCell()

	if (targetCell != playerCell)
		; player and target are in different cells
		if (targetCell && targetCell.IsInterior() || playerCell && playerCell.IsInterior())
			; in different cells and at least one is an interior
			;  -- we can safely enable or disable
			return false
		else
			; both in an exterior -- no means of testing
			;  worldspace at the moment, so this will do.
			if (player.GetDistance(self) > 3000)
				; pretty darned far away -- safe
				return false
			else
				; too close for comfort
				return true
			endif
		endif
	else
		; in the same cell -- err on the side of caution
		return true
	endif
endFunction

;jduvall
bool Function IsInInterior()
{Returns !IsInExterior()}
  Cell parentCell = GetParentCell()
  Return parentCell && parentCell.IsInterior()
EndFunction

;kkuhlmann:
bool function MoveToIfUnloaded(ObjectReference akTarget, float afXOffset = 0.0, float afYOffset = 0.0, float afZOffset = 0.0)
{Calls MoveTo if the calling ObjectReference is currently unloaded. Doesn't do anything if it IS loaded. No waiting or while loops. Returns true if it does the moveto}
	if !Is3DLoaded()
		MoveTo(akTarget, afXOffset, afYOffset, afZOffset)
		return true
	else
		return false
	endif
endFunction

; Returns if this reference has the specified location ref type (for backwards compatibility with function rename
bool Function HasRefType(LocationRefType akRefType)
	return HasLocRefType( akRefType )
EndFunction

;jduvall:
function MoveToWhenUnloaded(ObjectReference akTarget, float afXOffset = 0.0, float afYOffset = 0.0, float afZOffset = 0.0)
{DEPRECATED: DO NOT USE. Calls MoveTo if both the calling ObjectReference and the akTarget ObjectReference have current locations that are not loaded.}
	while self.GetCurrentLocation().IsLoaded() || akTarget.GetCurrentLocation().IsLoaded()
		;do nothing
; 		debug.trace(self + "MoveToWhenUnloaded() waiting for current location and target location to be unloaded before moving. If called by a quest stage fragment, this may cause that quest stage to not complete until this function finishes (and if it's a startup stage, the quest will not report itself as running until the stage finishes.).", 1)
		Utility.Wait(5)	;when this function is threaded we can increase this wait time... I set it lower for testing purposes so it reevaluates faster when I need to purge cell buffers in the Civil War when calling moveto on the player between Civil War campaigns
	EndWhile
	self.MoveTo(akTarget, afXOffset, afYOffset, afZOffset)
EndFunction

; Property to obtain the current X position of the object
float Property X
  float Function get()
    return GetPositionX()
  EndFunction
EndProperty

; Property to obtain the current Y position of the object
float Property Y
  float Function get()
    return GetPositionY()
  EndFunction
EndProperty

; Property to obtain the current Z position of the object
float Property Z
  float Function get()
    return GetPositionZ()
  EndFunction
EndProperty

; Have akActivator activate this reference. If abDefaultProcessingOnly is true then any block will be bypassed
; and no OnActivate event will be sent. The function returns true if default processing ran, and succeeded. If
; default processing has been blocked, will always return false.
bool Function Activate(ObjectReference akActivator, bool abDefaultProcessingOnly = false) native

; Sets up a dependent animated object
; This function should be used only with a coder supervision.  It is left undocumented because it can cause dangling pointers as well as very broken functionality
; for the dependent object if used improperly.
bool Function AddDependentAnimatedObjectReference( ObjectReference akDependent ) native

; Adds a dynamically created terminal menu item to a terminal ref.
Function AddDynamicTerminalMenuItem(TerminalMenu akTemplateSource, int aiTemplateIndex, int aiItemID, Form[] akTagReplacementForms) native

; Creates an item, fills an alias with that item, then adds it to this container. 
; aiCount can be greater than 1 if we are adding to a RefCollection. 
Function AddAliasedItem(Form akItemToAdd, Alias akAlias, int aiCount = 1, bool abSilent = true)
	AddAliasedItemWithKeywords(akItemToAdd, akAlias, aiCount, abSilent)
EndFunction

ObjectReference Function AddAliasedItemSingle(Form akItemToAdd, Alias akAlias, bool abSilent = true)
	return AddAliasedItemWithKeywordsSingle(akItemToAdd, akAlias, abSilent)
EndFunction

Function AddAliasedItemWithKeywords(Form akItemToAdd, Alias akAlias, int aiCount = 1, bool abSilent = true, Keyword[] keywords = NONE)
	int added = 0
	while added < aiCount
		AddAliasedItemWithKeywordsSingle(akItemToAdd, akAlias, abSilent, keywords)
		added += 1;
	endWhile
EndFunction

ObjectReference Function AddAliasedItemWithKeywordsSingle(Form akItemToAdd, Alias akAlias, bool abSilent = true, Keyword[] keywords = NONE)
	ObjectReference itemRef = self.PlaceAtMe(akFormToPlace = akItemToAdd, abInitiallyDisabled = true, akAliasToFill = akAlias)
	if itemRef != NONE
		if keywords != NONE && keywords.Length > 0
			int i = 0
			while i < keywords.Length
				itemRef.AddKeyword(keywords[i])
				i += 1
			endWhile
		endif
		self.AddItem(itemRef, 1, abSilent)
	else
		Debug.Trace("Failed to place " + akItemToAdd + " at " + self)
	endif
	return itemRef
EndFunction

; Adds the specified base object or object reference to this object reference's container/inventory
; Note that you cannot add more then one copy of a reference to a container (a warning will be printed if you try)
Function AddItem(Form akItemToAdd, int aiCount = 1, bool abSilent = false) native

; Adds a keyword to this reference
Function AddKeyword(Keyword apKeyword) native

; Adds a gets the key for the given locked reference and adds it to this reference's inventory
Function AddKeyIfNeeded(ObjectReference aLockedRef) native

; Adds the specified spell to this reference - returns true on success
bool Function AddSpell(Spell akSpell, bool abVerbose=true) native

; Adds the given text replacement pair to this ref
Function AddTextReplacementData(string asTokenLabel, Form akForm) native

; Adds the given text replacement value to this ref
Function AddTextReplacementValue(string asTokenLabel, float aValue) native

; Adds this reference (which is a map marker) to the map, optionally making it available for fast travel
Function AddToMap(bool abAllowFastTravel = false) native

; KMK - replacement function to also scan the map marker so it shows clearly on the compass
Function AddToMapScanned(bool abAllowFastTravel = false)
	SetScanned(true)
	AddToMap(abAllowFastTravel)
EndFunction

; Add a transfer link from this reference to another.
bool Function AddTransferLink(ObjectReference akTarget) native

;Assigns the specified actor as a member of the references crew
Function AssignCrew(Actor aCrewMember) native

; Add conveyor belt to this reference
Function ApplyConveyorBelt( string aTarget, float aLinVelX, float aLinVelY, float aLinVelZ, bool abOn = true, bool abReverse = false ) native

; Apply an impulse to this reference
Function ApplyHavokImpulse(float afX, float afY, float afZ, float afMagnitude) native

; Add fan motor to this reference
Function ApplyFanMotor( string aTarget, float aAxisX, float aAxisY, float aAxisZ, float aForce, bool abOn = true) native

;Are all refs in refsToCheck in this trigger?
bool Function AreAllInTrigger(ObjectReference[] refsToCheck) native

;Are any refs in refsToCheck in this trigger?
bool Function AreAnyInTrigger(ObjectReference[] refsToCheck) native

; Set fan motor on.
Function FanMotorOn( bool abOn = true) native

; Check if fan motor on.
bool Function IsFanMotorOn(  ) native

; Attach a mod to this reference
bool Function AttachMod(ObjectMod akMod, int aiAttachIndex = 0) native

; Attach a mod to an inventory item in this reference's inventory
bool Function AttachModToInventoryItem(Form akItem, ObjectMod akMod) native

; Attach this reference to the specified parent (only works on created refs)
Function AttachTo(ObjectReference akParent) native

; Turns on and off blocking of normal activation - OnActivate events will still be sent
Function BlockActivation(bool abBlocked = true, bool abHideActivateText = false) native

; Calculate's this references encounter level based on the requested difficulty level
; 0 - Easy
; 1 - Medium
; 2 - Hard
; 3 - Very Hard
; 4 - None
int Function CalculateEncounterLevel(int aiDifficulty = 4) native

; Can the map marker be fast traveled to?
bool Function CanFastTravelToMarker() native

; Can the reference produce resources for a Workshop?
bool Function CanProduceForWorkshop() native

; Clears all effects of destruction from this object
Function ClearDestruction() native

; Clears dynamically created terminal menu items from a terminal ref.
Function ClearDynamicTerminalMenuItems() native

; Clears this object from data on all invalid locations
Function ClearFromOldLocations() native

; Set conveyor belt on.
Function ConveyorBeltOn( bool abOn = true ) native

; Get the count of all instantiated Actors (across all process levels) that link to this reference. 
; The actor must link to this ref with a keyworded linkedref using the keyword (apLinkKeyword).
; Can optionally specify another keyword (apExcludeKeyword); actors with a linkedref using that keyword will be skipped when building the array.
; (NOTE: if you're also necessarily going to call GetActorsLinkedToMe, just do that and check its size, instead of calling this.)
int Function CountActorsLinkedToMe( Keyword apLinkKeyword = None, Keyword apExcludeKeyword = None ) native

;This function  counts the number of linked refs that are in a linked Ref chain (ie object is linked to A, A is linked to B, etc. this then counts all the linked refs.)
;Aborts early if it detects a loop
int Function CountLinkedRefChain(keyword apKeyword = None, int maxExpectedLinkedRefs = 100)	native

; Get the count of all instantiated ObjectReferences that link to this reference. 
; They must link to this ref with a keyworded linkedref, using the keyword (apLinkKeyword).
; Can optionally specify another keyword (apExcludeKeyword); refs with a linkedref using that keyword will be skipped when building the array.
; (NOTE: if you're also necessarily going to call GetRefsLinkedToMe, just do that and check its size, instead of calling this.)
int Function CountRefsLinkedToMe( Keyword apLinkKeyword = None, Keyword apExcludeKeyword = None ) native

; Create a detection event at this reference, with the specified owner. Sound level is between 0 and 100
Function CreateDetectionEvent(Actor akOwner, int aiSoundLevel = 0 ) native

; Damages this object and advances the destruction stage - does not return until the object is damaged
Function DamageObject(float afDamage) native

; Damages the given actor value
Function DamageValue(ActorValue akAV, float afDamage) native

; Delets this object
Function Delete() native

; Disables this object - fading out if requested
Function Disable(bool abFadeOut = false) native

; Disables all of the references that are linked, in a chain, to this one. (But NOT this one)
; Does not wait for everything to disable before returning
Function DisableLinkChain(Keyword apKeyword = None, bool abFadeOut = false) native

; Disables this object - fading out if requested. Does NOT wait for the fade or disable to finish
Function DisableNoWait(bool abFadeOut = false) native

; Dispel a spell from this reference
bool Function DispelSpell( Spell akSpell ) native

; Drops this reference from the container it is in. If silent, will not display a message to the
; player if it was in the player's inventory
Function Drop(bool abSilent = false) native

; Drops the first object from this object's inventory
ObjectReference Function DropFirstObject(bool abInitiallyDisabled = false) native

; Drops the specified object from this object's inventory (will not drop references)
ObjectReference Function DropObject(Form akObject, int aiCount = 1) native

; Enables this object - fading in if requested
bool Function Enable(bool abFadeIn = false) native

; Enables the ability to fast travel to this marker - or disables it. Note that if you disable
; fast travel the player will see "You haven't discovered this location" as an error message
Function EnableFastTravel(bool abEnable = true) native

; Enables all of the references that are linked, in a chain, to this one. (But NOT this one)
; Does not wait for everything to enable before returning
Function EnableLinkChain(Keyword apKeyword = None, bool abFadeIn = false) native

; Enables this object - fading in if requested. Does NOT wait for the fade or enable to finish
bool Function EnableNoWait(bool abFadeIn = false) native

; Finds all references to objects in the given list in the loaded area within the given radius of the calling
; ref and returns an array of them
ObjectReference[] Function FindAllReferencesOfType(Form akObjectOrList, float afRadius) native

; Finds all references with the given keyword(s) in the loaded area within the given radius of the calling
; ref and returns an array of them
ObjectReference[] Function FindAllReferencesWithKeyword(Form akKeywordOrList, float afRadius) native

; Forcibly adds / removes the ragdoll for a reference to the world
Function ForceAddRagdollToWorld() native
Function ForceRemoveRagdollFromWorld() native

; Gets the ActorBase that matches the supplied ActorValue at the ObjectReference's owning Workshop or None if not found.
ActorBase Function GetActorBaseForResource(ActorValue akAV) native

; Gets the ActorBase that owns this object (or None if not owned by an ActorBase)
; CAUTION: if owned by an Actor Ref, this will return the ActorBase of that Actor ref.
ActorBase Function GetActorOwner() native

; Gets the Actor (reference) that owns this object (or None if not owned by an Actor)
Actor Function GetActorRefOwner() native

; Get an array of all instantiated Actors (across all process levels) that link to this reference. 
; The actor must link to this ref with a keyworded linkedref using the keyword (apLinkKeyword).
; Can optionally specify another keyword (apExcludeKeyword); actors with a linkedref using that keyword will be skipped when building the array.
Actor[] Function GetActorsLinkedToMe( Keyword apLinkKeyword = None, Keyword apExcludeKeyword = None ) native

; gets all the crew members for this reference
Actor[] Function GetAllCrewMembers() native

; Get an array of all references currently in the trigger
ObjectReference[] Function GetAllRefsInTrigger() native

; Get the current X angle of this object
float Function GetAngleX() native

; Get the current Y angle of this object
float Function GetAngleY() native

; Get the current Z angle of this object
float Function GetAngleZ() native

; Get a variable from the reference's animation graph (if applicable). Bool version.
bool Function GetAnimationVariableBool(string arVariableName) native

; Get a variable from the reference's animation graph (if applicable). Int version.
int Function GetAnimationVariableInt(string arVariableName) native

; Get a variable from the reference's animation graph (if applicable). Float version.
float Function GetAnimationVariableFloat(string arVariableName) native

; Returns the base object this reference represents
Form Function GetBaseObject() native

; Gets the base value of the specified actor value - returns 0 and logs an error if the value is unknown
float Function GetBaseValue(ActorValue akAV) native

; Gets the array of actor bases placed by the biome with a scan percentage less than or equal to specified, between 0.0 and 1.0
ActorBase[] Function GetBiomeActors(float afMaxPercentageKnown = 1.0) native

; Gets the array of flora placed by the biome with a scan percentage less than or equal to specified
Flora[] Function GetBiomeFlora(float afMaxPercentageKnown = 1.0) native

; Returns the object's current destruction stage
int Function GetCurrentDestructionStage() native

; Returns this reference's current location
Location Function GetCurrentLocation() native

; Returns this reference's current planet if any
Planet Function GetCurrentPlanet() native

; Returns the scene this reference is currently in - if any
Scene Function GetCurrentScene() native

; KMK convenience function
float Function GetDayLength()
	float dayLength = 24.0 ; default
	Planet myPlanet = GetCurrentPlanet()
	if myPlanet
		dayLength = myPlanet.GetDayLength()
	endif
	debug.trace(self + "GetDayLength on planet " + myPlanet + "=" + dayLength)
	return dayLength
endFunction

; Get the color of the debug text
int[] Function GetDebugTextColor() native debugOnly

; Get the font size of the debug text
int Function GetDebugTextSize() native debugOnly

; Get the text string of the debug text
string Function GetDebugTextString() native debugOnly

; Get the list of destructible objects for an Outpost Beacon reference.
ObjectReference[] Function GetDestructibleOutpostObjects() native

; Calculates the distance between this reference and another - both must either be in the same interior, or same worldspace
float Function GetDistance(ObjectReference akOther) native

; Returns this reference's editor location
Location Function GetEditorLocation() native

; Gets the faction that owns this object (or None if not owned by a Faction)
Faction Function GetFactionOwner() native

; Gets the Flora that produces the supplied ActorValue at the ObjectReference's owning Workshop or None if not found.
Flora Function GetFloraForResource(ActorValue akAV) native

; Get the current gravity for this object
float Function GetGravityScale() native

; Gets the angle between this object's heading and the other object in degrees - in the range from -180 to 180
float Function GetHeadingAngle(ObjectReference akOther) native

; Get the current height of the object
float Function GetHeight() native

; Returns the count of the single most prevalant item in this object reference's inventory that has one or all given keywords on them.
int Function GetHighestItemCountKeywords(Formlist akKeywords, bool abMustMatchAll) native

; Obtains the value of all objects in this reference's inventory
int Function GetInventoryValue() native

; Returns how many of the specified item is in this object reference's inventory
; If None is passed, it counts every item in the inventory
int Function GetItemCount(Form akItem = None) native

; Returns how many items have one or more given keywords on them, in this object reference's inventory.
int Function GetItemCountKeywords(Formlist akKeywords, bool abMustMatchAll) native

; Returns how many of the specified components are in this object reference's inventory
; If None is passed, it counts every component in the inventory
int Function GetComponentCount(Form akItem = None) native

; Returns the container this reference is in - if any
ObjectReference Function GetContainer() native

; Returns the smithed health of this object reference (1.0 == 100%)
float Function GetItemHealthPercent() native

; Returns the key base object that will unlock this object
Key Function GetKey() native

; Get the current length of the object
float Function GetLength() native

; Obtain the cell linked to us with the specified keyword (if any)
Cell Function GetLinkedCell(Keyword akKeyword) native

; Get our linked reference
ObjectReference Function GetLinkedRef(Keyword apKeyword = NONE) native

; Returns a chain of linked refs as an array,
; Aborts early if it detects a loop
ObjectReference[] Function GetLinkedRefChain(keyword apKeyword = None, int iMaxExpectedLinkedRefs = 100) native

; Get the level of the lock on this object
int Function GetLockLevel() native

; Get the location ref types for this object
LocationRefType[] Function GetLocRefTypes() native

; Returns the Nth linked ref from this reference (0 = self, 1 = GetLinkedRef, 2 = GetLinkedRef.GetLinkedRef, etc)
ObjectReference Function GetNthLinkedRef(int aiLinkedRef, Keyword apKeyword = None) native

; Get this object's mass
float Function GetMass() native

; Gets the open state of this object. Which can be one of the following:
; 0 - None
; 1 - Open
; 2 - Opening
; 3 - Closed
; 4 - Closing
int Function GetOpenState() native

; Gets the cell this object is in
Cell Function GetParentCell() native

; Gets the scan percentage of the ref between 0.0 and 1.0
float Function GetPercentageKnown() native

; Get the current X position of the object
float Function GetPositionX() native

; Get the current Y position of the object
float Function GetPositionY() native

; Get the current Z position of the object
float Function GetPositionZ() native

; Get the Cell Space position of the object
; Values are returned in the array in the order:
; position.x, position.y, position.z
float[] Function GetSpacePosition() native

; Get the Cell Space transform of the object
; Values are returned in the array in the order:
; position.x, position.y, position.z,
; xAxis.x, xAxis.y, xAxis.z,
; yAxis.x, yAxis.y, yAxis.z,
; zAxis.x, zAxis.y, zAxis.z
float[] Function GetSpaceTransform() native

; Get the frequency of this radio receiver (if it is a receiver)
float Function GetRadioFrequency() native

; Get the volume of this radio receiver (if it is a receiver)
float Function GetRadioVolume() native

; Get the total damage, if any, of the given resource or of all nonzero resource actor values.
float Function GetResourceDamage(ActorValue akValue=None) native

; Gets an array of the x,y,z of a safeRadius radius location within searchRadius of the reference, returns empty array if it fails.
float[] Function GetSafePosition(float aSearchRadius = -1.0, float aSafeRadius = -1.0 ) native

; Get this object's weight
float Function GetWeight() native

; Get the weight of all the objects in this container
float Function GetWeightInContainer() native

; Get an array of all instantiated refs that link to this reference. 
; They must link to this ref with a keyworded linkedref using the keyword (apLinkKeyword).
; Can optionally specify another keyword (apExcludeKeyword); refs with a linkedref using that keyword will be skipped when building the array.
ObjectReference[] Function GetRefsLinkedToMe( Keyword apLinkKeyword = None, Keyword apExcludeKeyword = None ) native

; Get all of the workshop objects on this Workbench owned by the given Actor.
ObjectReference[] Function GetWorkshopOwnedObjects(Actor akActor) native

; Get the total damage, if any, of the given resource on the Workshop.
float Function GetWorkshopResourceDamage(ActorValue akValue) native

; Get all of the resource-producing objects owned by this Workbench. If akAV is provided,
; only collect objects producing the corresponding resource. If aiOption is provided, use 0 for all nonzero resources, 1 for only damaged resources, 2 for only undamaged resources.
ObjectReference[] Function GetWorkshopResourceObjects(ActorValue akAV = None, int aiOption = 0) native

; Get the current scale of the object
float Function GetScale() native

; Get the autopilot ai actor for this reference if it has one
Actor Function GetSpaceshipAutopilotAI() native

; Get the target cell for this teleport ref
Cell Function GetTeleportCell() native

; Get the transition cell for this teleport ref
Cell Function GetTransitionCell() native

; Get the distance between this radio transmitter and the player
float Function GetTransmitterDistance() native

; Get the number of objects inside this trigger (throws warning if not a trigger)
int Function GetTriggerObjectCount() native

; Gets the specified actor value - returns 0 and logs an error if the value is unknown
float Function GetValue(ActorValue akAV) native

;jduvall - convenience function
;returns GetValue() cast as an int
int Function GetValueInt(ActorValue akAV)
	return GetValue(akAV) as int
EndFunction

; Gets the specified actor value as a percentage of its max value - from 0 to 1
float Function GetValuePercentage(ActorValue akAV) native

; Returns all resources that are linked to this object via actor values
Resource[] Function GetValueResources() native 

; jduvall
;Returns a GlobalVariable with a matching value to the specified actorvalue (if there is more than one match it will return the first)
;akAV: the ActorValue for which you want to return a matching GlobalVariable
;EnumGlobals: an array of possibly matching GlobalVariables to return
GlobalVariable Function GetValueEnumGlobal(ActorValue akAV, GlobalVariable[] akEnumGlobals)
	float val = GetValue(akAV)
	GlobalVariable returnVal
	int i = 0
	While (returnVal == none && i < akEnumGlobals.length)
		if  akEnumGlobals[i].GetValue() == val
			returnVal = akEnumGlobals[i]
		endif
		i += 1
	EndWhile

	return returnVal
EndFunction


; Gets the voice type for this reference. Will return None if not an actor or a talking activator
VoiceType Function GetVoiceType() native

; Get the current width of the object
float Function GetWidth() native

; Get the Workshop this reference belongs to, if any.
ObjectReference Function GetWorkshop() native


; Get this objects worldspace
WorldSpace Function GetWorldSpace() native

; Returns self cast as an actor
actor Function GetSelfAsActor()
	return self as Actor
endFunction

; jduvall - returns a reference array with just this reference in it
ObjectReference[] Function GetSingleRefArray()
	ObjectReference[] singleArray = new ObjectReference[1]
	singleArray[0] = self
	return singleArray
EndFunction

; Returns true if there was an Actor (reference) set to own this object (even if that actor was a temp and is now gone).
bool Function HasActorRefOwner() native

; Checks to see if this reference has any crew members
bool Function HasCrew() native

; Checks to see if there is a direct line-of-sight between us and the target, using the specified nodes
; If the node strings are empty, the check will be done from the roots of the objects
bool Function HasDirectLOS(ObjectReference akTarget, string asSourceNode = "", string asTargetNode = "") native

; Returns if this reference has an active effect coming from a magic effect with the specified keyword attached
bool Function HasEffectKeyword(Keyword akKeyword) native

; Returns true if this reference has the specified keyword
bool Function HasKeyword(Keyword apKeyword) native

; Returns if this reference has any of the keywords in the list attached
bool Function HasKeywordInFormList(FormList akKeywordList) native

; Returns if this reference has the specified location ref type
bool Function HasLocRefType(LocationRefType akRefType) native

;check if this refr is affected by the given effect.
bool Function HasMagicEffect(MagicEffect akMagicEffect) native

; Returns whether the reference has the given node
bool Function HasNode(string asNodeName) native

; kmk - utility function - is this ref owned in any way?
bool Function HasOwner()
	bool returnVal = false
	if HasActorRefOwner() || GetActorOwner() || GetFactionOwner()
		returnVal = true
	endif
;	debug.trace(self + " HasOwner=" + returnVal + ": HasActorRefOwner()=" + HasActorRefOwner() + ", GetActorOwner()=" + GetActorOwner() + ", GetFactionOwner()=" + GetFactionOwner())
	return returnVal
endFunction

; Returns true if this reference is on the same power grid as the compare reference.
bool Function HasSharedPowerGrid(ObjectReference akCompare) native

; Flags this reference as ignoring (or not ignoring) friendly hits
Function IgnoreFriendlyHits(bool abIgnore = true) native

; Interrupts any spell-casting this object may be doing
Function InterruptCast() native

; Checks to see if activation is currently blocked on this object
bool Function IsActivationBlocked() native

; Returns if the 3d for this object is loaded or not
bool Function Is3DLoaded() native

; Check if conveyor belt on.
bool Function IsConveyorBeltOn( ) native

; Was this object created in-game?
bool Function IsCreated() native

; kmk - returns true if specified actor is crew of this ship
bool Function IsCrew(Actor akActor)
	Actor[] crewMembers = GetAllCrewMembers()
	return (crewMembers.Find(akActor) > -1)
EndFunction

; Get the billboard flag of the debug text
bool Function IsDebugTextBillboard() native debugOnly

; Is this object currently flagged for delete?
bool Function IsDeleted() native

; Is this object destroyed?
bool Function IsDestroyed() native

; Is this object currently disabled?
bool Function IsDisabled() native

; Is this object an inaccessible door
bool Function IsDoorInaccessible() native

; Because Shane got tired of remembering which way to call this
bool Function IsEnabled()
	return !IsDisabled()
EndFunction

; Is any marker on this furniture in use?
bool Function IsFurnitureInUse(bool abIgnoreReserved = false) native

; Is a particular marker on this furniture in use?
bool Function IsFurnitureMarkerInUse(int aiMarker, bool abIgnoreReserved = false) native

; Is this object ignoring friendly hits?
bool Function IsIgnoringFriendlyHits() native

; Is this actor or talking activator currently talking to the player?
bool Function IsInDialogueWithPlayer() native

; Is refToCheck in this trigger?
bool Function IsInTrigger(ObjectReference refToCheck) native

; Is this reference in space?
bool Function IsInSpace() native

; Is the lock on this object broken?
bool Function IsLockBroken() native

; Is the lock on this object locked?
bool Function IsLocked() native

; Is the map marker visible?
bool Function IsMapMarkerVisible() native

; Is this ref owned by the given actor?
bool Function IsOwnedBy(Actor akOwner) native

; Returns if the workshop object is considered powered
bool Function IsPowered() native

; Returns if this is a quest item or not
bool Function IsQuestItem() native

; Returns if this radio receiver is on or not
bool Function IsRadioOn() native

; Returns if this object has been scanned
bool Function IsScanned() native

; Returns if the given ref is inside this teleport ref's transition cell
bool Function IsRefInTransitionCell(ObjectReference akRef) native

; Returns if the given ref's teleport area is fully loaded or not
bool Function IsTeleportAreaLoaded() native

; Returns if this ref is a spell target of the given magic item form.
bool Function IsSpellTarget(Form akMagicItemForm) native

; Returns if this reference is within the given Workshop activator's buildable area
bool Function IsWithinBuildableArea(ObjectReference akRef) native

; Executes a knock effect to an area
Function KnockAreaEffect(float afMagnitude, float afRadius) native

; Lock/unlock this object. If told to lock it, it will add a lock if it doesn't have one. If locked/unlocked as the owner on a door,
; the adjoining cell will be made public/private as appropriate. Can also optionally lock or unlock linked lockable reference
Function Lock(bool abLock = true, bool abAsOwner = false, bool abTraverseLinkedLockables = true) native

; Take an object in this ref's inventory, make a ref to it, force it into an alias, then re-add it to inventory
ObjectReference Function MakeAliasedRefFromInventory(Form akObject, Alias akAlias) native

; Make this object a radio transmitter which will repeat all transmissions sent by akTransmitterToRepeat.
Function MakeTransmitterRepeater(ObjectReference akTransmitterToRepeat, float afInnerRadius, float afOuterRadius, bool abUnlimitedRange = false) native

; Modifies the specified actor value
Function ModValue(ActorValue akAV, float afAmount) native

; KMK: convenience function to mod an actor value to a specified final value
Function ModValueTo(ActorValue akAV, float afValue)
	float currentValue = GetValue(akAV)
	float modAmount = afValue - currentValue ; how much do we need to mod to get to afValue?
	ModValue(akAV, modAmount)
EndFunction

; Moves containers content down the line to unfilled containers
Function MoveContainerContentToUnfilledContainers() native

; Moves this object to the position of the specified object, with an offset, and optionally matching its rotation
Function MoveTo(ObjectReference akTarget, float afXOffset = 0.0, float afYOffset = 0.0, float afZOffset = 0.0, bool abMatchRotation = true, bool abRotateOffset = false) native

; Moves this object to its editor location
Function MoveToMyEditorLocation() native

; Moves this object to the nearest location on a Navmesh
Function MoveToNearestNavmeshLocation() native

; Moves this object (or its specified node if asMatchNodeName is valid) to the position (and rotation) of the specified node on the specified object's 3D
Function MoveToNode(ObjectReference akTarget, string asNodeName, string asMatchNodeName = "") native

; Opens this ref's inventory using a one-way transfer menu with optional filter list
Function OpenOneWayTransferMenu(bool aIsGiveOnly, FormList aFilterList=None) native

; Create x copies of the passed in form (forcing them to persist if desired) and place them at our location, returning the last object created
ObjectReference Function PlaceAtMe(Form akFormToPlace, int aiCount = 1, bool abForcePersist = false, bool abInitiallyDisabled = false, bool abDeleteWhenAble = true, float[] akOffsetValues = none, Alias akAliasToFill = None, bool abSnapOffsetToNavmesh = true) native

; Create a copy of the passed in form and place it at our location, returning the ship created
; this must be a ship landing marker for ground placement
SpaceshipReference Function PlaceShipAtMe(Form akFormToPlace, int aiLevelMod = 4, bool abPlayFx = true, bool abForcePersist = false, bool abInitiallyDisabled = false, bool abDeleteWhenAble = true, float[] akOffsetValues = none, Alias akAliasToFill = None, Location akEncLoc = None, bool abSnapOffsetToNavmesh = true) native

; FBaudoin
; This is a version of PlaceShipAtMe that accepts offset for where the ship is placed instead of an array
SpaceshipReference Function PlaceShipAtMeOffset(Form akFormToPlace, float xOffset = 0.0, float yOffset = 0.0, float zOffset = 0.0, int aiLevelMod = 4, bool abPlayFx = true, bool abForcePersist = false, bool abInitiallyDisabled = false, bool abDeleteWhenAble = true, Alias akAliasToFill = None, Location akEncLoc = None, bool abSnapOffsetToNavmesh = true)
	float[] offset = new float[6]
	offset[0] = xOffset  	;Right(positive) and Left(negative)
	offset[1] = yOffset 	;front(positive) and behind(negative)
	offset[2] = zOffset		;up(positive) and down(negative)
 	return PlaceShipAtMe(akFormToPlace, aiLevelMod, abPlayFx, abForcePersist, abInitiallyDisabled, abDeleteWhenAble, offset, akAliasToFill, akEncLoc, abSnapOffsetToNavmesh)
EndFunction

; Create an actor at this object's location. Level mod is one of the following:
; 0 - Easy
; 1 - Medium
; 2 - Hard
; 3 - Boss
; 4 - None
Actor Function PlaceActorAtMe(ActorBase akActorToPlace, int aiLevelMod = 4, Location akEncLoc = None, bool abForcePersist = false, bool abInitiallyDisabled = false, bool abDeleteWhenAble = true, float[] akOffsetValues = none, bool abSnapOffsetToNavmesh = true) native

; Creates a duplicate of the specified actor at this reference's location, returning the created actor
Actor Function PlaceDuplicateActorAtMe(Actor akActorToDuplicate, bool abForcePersist = false, bool abInitiallyDisabled = false, bool abDeleteWhenAble = true, float[] akOffsetValues = none, Alias akAliasToFill = None, bool abSnapOffsetToNavmesh = true) native

; Create x copies of the passed in form (forcing them to persist if desired) and place them at the location of the given node, returning the last object created
ObjectReference Function PlaceAtNode(string asNodeName, Form akFormToPlace, int aiCount = 1, bool abForcePersist = false, bool abInitiallyDisabled = false, bool abDeleteWhenAble = true, bool abAttach = false) native

; Create a copy of the cell and place it at this reference's location - only works with refs in space exterior cells
; DPierce: This function will place cells at incorrect locations. See: GEN-388123
Cell Function PlaceCellAtMe(Cell akCellToCopy, RefCollectionAlias akRefCollection = None, bool abForcePersist = false, bool abDeleteWhenAble = true, bool abInitiallyDisabled = false, float[] akOffsetValues = none) native

; Get the key for the given locked ref and place one of them at this reference
ObjectReference Function PlaceLockedRefKeyAtMe( ObjectReference aLockedRef, int aiCount = 1, bool abForcePersist = false, bool abInitiallyDisabled = false, bool abDeleteWhenAble = true ) native

; Start the specified animation playing - returns true if it succeeds
bool Function PlayAnimation(string asAnimation) native

; Start the specified animation playing and wait for the specified event - returns true if succeeds
bool Function PlayAnimationAndWait(string asAnimation, string asEventName) native

; Start the specified Gamebryo animation playing - returns true if it succeeds
bool Function PlayGamebryoAnimation(string asAnimation, bool abStartOver = false, float afEaseInTime = 0.0) native

; Play the specified impact effect - returns true if it succeeds
bool Function PlayImpactEffect(ImpactDataSet akImpactEffect, string asNodeName = "", float afPickDirX = 0.0, float afPickDirY = 0.0, float afPickDirZ = -1.0, float afPickLength = 512.0, bool abApplyNodeRotation = false, bool abUseNodeLocalRotation = false) native

; Play two animations at once - one on this object, one on another object
bool Function PlaySyncedAnimationSS(string asAnimation1, ObjectReference akObj2, string asAnimation2) native

; Play two animations at once - one on this object, one on another object - and wait for both
bool Function PlaySyncedAnimationAndWaitSS(string asAnimation1, string asEvent1, ObjectReference akObj2, string asAnimation2, string asEvent2) native

; Play a terrain effect that is attached to the specified bone of this object.
Function PlayTerrainEffect(string asEffectModelName, string asAttachBoneName) native

; Pause the audio file for a ref in a scene
Function PauseAudio( ) native

; Preload only the exterior cell containing this reference
Function PreloadExteriorCell() native

; Preload the target interior or exterior area for this reference
Function PreloadTargetArea() native

; Tells this object to process a trap hitting it
Function ProcessTrapHit(ObjectReference akTrap, float afDamage, float afPushback, float afXVel, float afYVel, float afZVel, float afXPos, float afYPos, float afZPos, int aeMaterial, float afStagger) native

; Turns this object into a legendary item
Function PromoteToLegendary(int aiRank = 0, LegendaryItem akItemDefinition = None) native

; Pushes the passed-in actor away from this object, using the passed in knockback force to determine the speed
Function PushActorAway(Actor akActorToPush, float aiKnockbackForce) native

; Removes all items from this container, transferring it to the other object if passed
Function RemoveAllItems(ObjectReference akTransferTo = None, bool abKeepOwnership = false, bool abRespectTargetCapacity = false) native

; Removes all items from this container, transferring it to the other object if passed, silent param to supress warnings
Function RemoveAllItemsEx(ObjectReference akTransferTo = None, bool abKeepOwnership = false, bool abRespectTargetCapacity = false, bool abSilent = false) native

; Removes the specified count of resource from the container, scrapping items, and returning the remainder to said container.
; The function returns the number of resource actually removed from the container
int Function RemoveResources(Resource akResource, int aiCount, bool abSilent = false) native

; Removes the specified item from this object reference's inventory
; The function returns the actual number of items removed from the container
int Function RemoveItem(Form akItemToRemove, int aiCount = 1, bool abSilent = false, ObjectReference akOtherContainer = None) native

; Removes items from this object reference's inventory containing up to aiCount components
; The function returns the actual number of components removed from the container
int Function RemoveItemByComponent(Form akComponentToRemove, int aiCount = 1, bool abSilent = false, ObjectReference akOtherContainer = None) native

; Removes a keyword from this reference
Function RemoveKeyword(Keyword apKeyword) native

; Removes every single mod attached to this reference (warning, for some actors/items this will leave no rendering geometry at all!)
Function RemoveAllMods() native

; Removes every single mod attach to an item in this reference's inventory. Note that some items won't have any geometry if you do this (handmade guns)
Function RemoveAllModsFromInventoryItem(Form akItem) native

; Remove the requested mod from the reference
Function RemoveMod(ObjectMod akMod) native

; Remove the requested mod from an item in this reference's inventory
Function RemoveModFromInventoryItem(Form akItem, ObjectMod akMod) native

; Removes a previously added dependent object
; This function should be used only with a coder supervision.  It is left undocumented because it can cause dangling pointers as well as very broken functionality
; for the dependent object if used improperly.
bool Function RemoveDependentAnimatedObjectReference( ObjectReference akDependent ) native

; Removes the transfer link from this reference and another, if any.
Function RemoveTransferLink(ObjectReference akTarget) native

; Repair this object.
Function Repair() native

; Resets this object, optional place the object at the new target
Function Reset(ObjectReference akTarget = None) native

; Sets the visibility of this reference (which is a map marker) on the star map
Function SetRequiresScanning(bool abRequiresScanning = true) native

; Resets a keyword's add/remove status so the data comes from the base object and aliases
Function ResetKeyword(Keyword apKeyword) native

; Restores damage done to the actor value(up to 0 damage)
Function RestoreValue(ActorValue akAV, float afAmount) native

; Resume the audio file for a ref in a scene
Function ResumeAudio( ) native

; Set conveyor belt reverse state.
Function ReverseConveyorBelt( bool abReverse = true ) native

; Has this object "say" the specified topic, as if spoken by the specified actor (if one is
; provided), and potentially "speaking" in the player's head.
Function Say(Topic akTopicToSay, Actor akActorToSpeakAs = None, bool abSpeakInPlayersHead = false, ObjectReference akTarget = None) native

; Has this object "say" a keyworded topic, as if spoken by the specified actor (if one is
; provided), and potentially "speaking" in the player's head.
Function SayCustom(Keyword akKeywordToSay, Actor akActorToSpeakAs = None, bool abSpeakInPlayersHead = false, ObjectReference akTarget = None) native

; Has this object behave as if the specified actor attempted to steal it
Function SendStealAlarm(Actor akThief) native

; Sets this object's activate text to be the full name of the given message
Function SetActivateTextOverride(Message akText) native

; Sets this object's actor cause to the specified actor
Function SetActorCause(Actor akActor) native

; Sets this object's owner to the specified actor base - None means to remove ownership
Function SetActorOwner(ActorBase akActorBase, bool abNoCrime = false) native

; Sets this object's owner to the specified actor ref - None means to remove ownership
Function SetActorRefOwner(Actor akActor, bool abNoCrime = false) native

; Set the orientation of the object (angles are in degrees)
Function SetAngle(float afXAngle, float afYAngle, float afZAngle) native

; Set a variable on the reference's animation graph (if applicable). Bool version.
Function SetAnimationVariableBool(string arVariableName, bool abNewValue) native

; Set a variable on the reference's animation graph (if applicable). Int version.
Function SetAnimationVariableInt(string arVariableName, int aiNewValue) native

; Set a variable on the reference's animation graph (if applicable). Float version.
Function SetAnimationVariableFloat(string arVariableName, float afNewValue) native

; Sets whether this ref should send attraction-object story manager events for the specified keyword.
Function SetAttractionActive(Keyword apKeyword, bool abActive = true) native

; Set linear velocity for conveyor belt.
Function SetConveyorBeltVelocity( float afLinVelX, float afLinVelY, float afLinVelZ ) native

; Rotate carousel display case.
Function RotateCarouselDisplayCase( int aiDirection ) native

; Set the billboard flag of the debug text
Function SetDebugTextBillboard(bool abBillboard = true) native debugOnly

; Set the color of the debug text (each int is clamped between 0 and 255)
Function SetDebugTextColor(int aiRed, int aiGreen, int aiBlue, int aiAlpha = 255) native debugOnly

; Set the font size of the debug text
Function SetDebugTextSize(int aiFontSize) native debugOnly

; Set the text string of the debug text
Function SetDebugTextString(string asText) native debugOnly

; Sets this object as destroyed or not
Function SetDestroyed(bool abDestroyed = true) native

; Sets the direct-at target for this reference (or clears it if None is passed)
; Note that the object must have an animation graph with a direct-at modifier on it for this to do anything
Function SetDirectAtTarget(ObjectReference akTarget) native

; Sets a map marker as discovered
Function SetMarkerDiscovered() native

; Sets this door as inaccessible
Function SetDoorInaccessible(bool abInaccessible) native

; Sets this object's owner to the specified faction
Function SetFactionOwner(Faction akFaction, bool abNoCrime = false) native

; Marks the object as Harvested or not Harvested (if it's Flora)
Function SetHarvested(bool abHarvested) native

; Set our linked reference
Function SetLinkedRef(ObjectReference akLinkedRef, Keyword apKeyword = NONE, bool abPromoteParentRefr = true) native

; Sets the lock level on this object. Will add an unlocked lock to it if it doesn't have one
Function SetLockLevel(int aiLockLevel) native

; Sets the an in-game created reference to have the given loc ref type for the given location
Function SetLocRefType(Location akLoc, LocationRefType akRefType ) native

; Sets the category of the map marker on the star map.
Function SetMapMarkerCategory (int iCategory = 0) native

; Sets the type of the map marker on the star map
Function SetMapMarkerType(int iType = 0) native

; Sets the unexplored name of the map marker on the star map.
Function SetMapMarkerUnexploredName(Message aName) native

; Sets the map marker on the star map to allow grav jumping, defaults to true.
Function SetMarkerAllowGravJump(bool aAllowGravJump = true) native

; Sets the undiscovered visibilty on the star map
Function SetMarkerUndiscoveredVisibility(int iVisibilityEnum = 0) native

; Sets the visibility of this reference (which is a map marker) on the star map
Function SetMarkerVisibleOnStarMap(bool aVisible = true) native

; Sets the motion type of the reference
; aeMotionType: The type of motion (see properties at end of file)
; abImmediatelySimulate: If true, the object will immedately simulate (i.e. as if the player bumped into it)
Function SetMotionType(int aeMotionType, bool abImmediatelySimulate = true) native

; Sets this object reference as one that teammates will refuse to do favors on
Function SetNoFavorAllowed(bool abNoFavor = true) native

; Opens/closes this object
Function SetOpen(bool abOpen = true) native

; Sets this object's name to the given message
Function SetOverrideName(Message akText) native

; Sets the persist location on an in-game created reference
Function SetPersistLoc(Location akLoc) native

; Flags/unflags this reference as having been taken by the player
Function SetPlayerHasTaken(bool abTaken = true) native

; Set the position of the object
Function SetPosition(float afX, float afY, float afZ) native

; Turns on/off this radio receiver
Function SetRadioOn(bool abOn = true) native

; Sets the frequency of this radio receiver
Function SetRadioFrequency(float afFrequency) native

; Sets the volume of this radio receiver
Function SetRadioVolume(float afVolume) native

; Attempts to set the state of the given Workshop
bool Function SetWorkshopState(int aState) native

; Set the current scale of the object
Function SetScale(float afScale) native

; Sets the objects scanned status if it is scannable
Function SetScanned(bool abValue = true) native

; Sets the specified actor value
Function SetValue(ActorValue akAV, float afValue) native

;jduvall - convenience function
;Increments an actorvalue, and rolls it over to 0 if incremented value would exceed aiMaxValue
; sets and returns (GetValueInt(akAV) + aiIncrementAmount) % (aiMaxValue + 1)
int Function IncrementLoopingValue(ActorValue akAV, int aiMaxValue, int aiIncrementAmount = 1)
	int loopedValue = (GetValueInt(akAV) + aiIncrementAmount) % (aiMaxValue + 1)
	SetValue(akAv, loopedValue)
	return loopedValue
EndFunction


; Opens the Hangar Menu for the current reference. Mode 0 = credits (vending), Mode 1 = resources (crafting)
Function ShowHangarMenu(int aiMode = 0, Actor akVendor = None, SpaceshipReference akMenuTarget = None, bool abOpenToAvailableTab = false) native

; Opens the Workshop Builder Menu for the current reference
Function ShowWorkshopBuilderMenu() native

; Opens the Workshop Target Menu for the current reference
Function ShowWorkshopTargetMenu(bool abIncludeSameSystem = true, Keyword akSameSystemRequiredKeyword = None, bool abIncludeIntersystem = true, Keyword akIntersystemRequiredKeyword = None) native

; Makes the reference translate to the given position/orientation on a spline
Function SplineTranslateTo(float afX, float afY, float afZ, float afXAngle, float afYAngle, float afZAngle, float afTangentMagnitude, float afSpeed, float afMaxRotationSpeed = 0.0) native

; Makes the reference translate to the target ref position/orient on a spline at the given speed
Function SplineTranslateToRef(ObjectReference arTarget, float afTangentMagnitude, float afSpeed, float afMaxRotationSpeed = 0.0)
	SplineTranslateTo(arTarget.X, arTarget.Y, arTarget.Z, arTarget.GetAngleX(), arTarget.GetAngleY(), arTarget.GetAngleZ(), afTangentMagnitude, afSpeed, afMaxRotationSpeed)
endFunction

; Makes the reference translate to the target node's ref/orient on a spline at the given speed
Function SplineTranslateToRefNode(ObjectReference arTarget, string arNodeName, float afTangentMagnitude, float afSpeed, float afMaxRotationSpeed = 0.0) native

; Starts a named effect sequence on the passed in references.
; Allows you to define if you should attach the effect sequence to the reference
Function StartSequenceOnReferences(string aSequenceName, ObjectReference[] aRefs, bool aAttach) native global

; Starts a named effect sequence on the reference
; Allows you to define if you should attach the effect sequence to the reference
; Allows providing an optional weight to the sequence
Function StartSequence(string aSequenceName, bool aAttach, float afWeight = 1.0) native

; Starts/Stops Workshop mode with the given workshop ref
Function StartWorkshop(bool abStart = true) native

; Stops all sequences on the passed in references.
Function StopAllSequencesOnReferences(ObjectReference[] aRefs) native global

; Stops all sequences on the self reference.
Function StopAllSequences() native

; Stops the named sequence on the self reference.
Function StopSequence(string aSequenceName) native

; Stops the reference from moving
Function StopTranslation() native

; Makes the reference translate to the given position/orientation
; Note: Rotation speed is entirely dependent on the length of the path and the movement speed
; that is, the rotation will happen such that the reference reaches the goal orientation at the end
; of the translation.
Function TranslateTo(float afX, float afY, float afZ, float afXAngle, float afYAngle, float afZAngle, float afSpeed, float afMaxRotationSpeed = 0.0) native

; Makes the reference translate to the target ref position/orient at the given speed
Function TranslateToRef(ObjectReference arTarget, float afSpeed, float afMaxRotationSpeed = 0.0)
	TranslateTo(arTarget.X, arTarget.Y, arTarget.Z, arTarget.GetAngleX(), arTarget.GetAngleY(), arTarget.GetAngleZ(), afSpeed, afMaxRotationSpeed)
endFunction

;Unassigns the specified actor as a member of the references crew
Function UnassignCrew(Actor aCrewMember) native

; Waits for the animation graph to send the specified event
bool Function WaitForAnimationEvent(string asEventName) native

; Waits for this object's 3d to load. Returns true if the 3D loaded, or false if it was disabled, the parent cell was unloaded
; or something else is preventing it from loading its 3D
bool Function WaitFor3DLoad() native

; Convenience function to check if I'm in a location or any of its children
bool Function IsInLocation(Location akLocation)
	; cache current location to avoid changing location while this function is running (surprisingly that seems to be happening occasionally)
	Location currLoc = GetCurrentLocation()
	if currLoc == None
		return false
	else
		return akLocation != None && (akLocation.IsChild(currLoc) || currLoc == akLocation)
	endif
endFunction
; *****************************************************************************
; convenience functions for spaceships and actors
; ******************************************************************************

; Starts combat with the target if called on a spaceship or an actor AND akTarget matches what you called it on
; returns FALSE if called on something else
; abPreferredTarget - OPTIONAL (Def=false) True to set the target as the actor's preferred target
bool Function TryToStartCombat(ObjectReference akTarget, bool abPreferredTarget = false)
	bool bSuccess = false
	Actor targetActor = akTarget as Actor
	if targetActor
		Actor selfActor = self as Actor
		if selfActor
			bSuccess = true
			selfActor.StartCombat(targetActor, abPreferredTarget)
		endif
	Else
		SpaceshipReference targetShip = akTarget as SpaceshipReference
		if targetShip
			SpaceshipReference selfShip = self as SpaceshipReference
			if selfShip
				bSuccess = true
				selfShip.StartCombat(targetShip, abPreferredTarget)
			endif
		endif
	endif
	return bSuccess
endFunction

; Stops combat if called on a spaceship or an actor; 
; returns FALSE if called on something else
bool Function TryToStopCombat()
	bool bSuccess = false
	Actor selfActor = self as Actor
	if selfActor
		bSuccess = true
		selfActor.StopCombat()
	else
		SpaceshipReference selfShip = self as SpaceshipReference
		if selfShip
			bSuccess = true
			selfShip.StopCombat()
		endif
	endif
	return bSuccess
endFunction

; Stops combat and alarms if called on a spaceship or an actor; 
; returns FALSE if called on something else
bool Function TryToStopCombatAlarm()
	bool bSuccess = false
	Actor selfActor = self as Actor
	if selfActor
		bSuccess = true
		selfActor.StopCombatAlarm()
	else
		SpaceshipReference selfShip = self as SpaceshipReference
		if selfShip
			bSuccess = true
			selfShip.StopCombatAlarm()
		endif
	endif
	return bSuccess
endFunction

; Adds this actor or spaceship to a faction at rank 0 if they aren't already in it
; returns FALSE if called on something else
bool Function TryToAddToFaction(Faction akFaction)
	bool bSuccess = false
	Actor selfActor = self as Actor
	if selfActor
		bSuccess = true
		selfActor.AddToFaction(akFaction)
	else
		SpaceshipReference selfShip = self as SpaceshipReference
		if selfShip
			bSuccess = true
			selfShip.AddToFaction(akFaction)
		endif
	endif
	return bSuccess
EndFunction

; Removes this actor or spaceship from the specified faction
; returns FALSE if called on something else
bool Function TryToRemoveFromFaction(Faction akFaction)
	bool bSuccess = false
	Actor selfActor = self as Actor
	if selfActor
		bSuccess = true
		selfActor.RemoveFromFaction(akFaction)
	else
		SpaceshipReference selfShip = self as SpaceshipReference
		if selfShip
			bSuccess = true
			selfShip.RemoveFromFaction(akFaction)
		endif
	endif
	return bSuccess
endFunction

; Removes this actor or spaceship from all factions
; returns FALSE if called on something else
bool Function TryToRemoveFromAllFactions()
	bool bSuccess = false
	Actor selfActor = self as Actor
	if selfActor
		bSuccess = true
		selfActor.RemoveFromAllFactions()
	else
		SpaceshipReference selfShip = self as SpaceshipReference
		if selfShip
			bSuccess = true
			selfShip.RemoveFromAllFactions()
		endif
	endif
	return bSuccess
endFunction

; Evaluates this actor or spaceship's package
; returns FALSE if called on something else
bool Function TryToEvaluatePackage()
	bool bSuccess = false
	Actor selfActor = self as Actor
	if selfActor
		bSuccess = true
		selfActor.EvaluatePackage()
	Else
		SpaceshipReference selfShip = self as SpaceshipReference
		if selfShip
			bSuccess = true
			selfShip.EvaluatePackage()
		endif
	endif
	return bSuccess
endFunction

; Evaulate if you're able to kill the akKiller
; akKiller: The Actor or SpaceshipReference who is the guilty party in killing this one. If the type doesn't match, then the killer will be None.
; (I.e. if this is called on an actor, the killer must also be an actor)
; Returns true if this was called on an actor or spaceship and was killed.
bool Function TryToKill(ObjectReference akKiller)
	bool bSuccess = false
	Actor selfActor = self as Actor
	if selfActor
		bSuccess = true
		Actor targetActor = akKiller as Actor
		selfActor.Kill(targetActor)
	Else
		SpaceshipReference selfShip = self as SpaceshipReference
		if selfShip
			bSuccess = true
			SpaceshipReference targetShip = akKiller as SpaceshipReference
			selfShip.Kill(targetShip)
		endif
	endif
	return bSuccess
EndFunction

; Sets ghost flag on actor or spaceship
; returns FALSE if called on something else
bool Function TryToSetGhost(bool bSetGhost = True)
	bool bSuccess = false
	Actor selfActor = self as Actor
	if selfActor
		bSuccess = true
		selfActor.SetGhost(bSetGhost)
	Else
		SpaceshipReference selfShip = self as SpaceshipReference
		if selfShip
			bSuccess = true
			selfShip.SetGhost(bSetGhost)
		endif
	endif
	return bSuccess
endFunction

; Sets protected flag on actor or spaceship
; returns FALSE if called on something else
bool Function TryToSetProtected(bool bSetProtected = True)
	bool bSuccess = false
	Actor selfActor = self as Actor
	if selfActor
		bSuccess = true
		selfActor.SetProtected(bSetProtected)
	Else
		SpaceshipReference selfShip = self as SpaceshipReference
		if selfShip
			bSuccess = true
			selfShip.SetProtected(bSetProtected)
		endif
	endif
	return bSuccess
endFunction

; Sets essential flag on actor or spaceship
; returns FALSE if called on something else
bool Function TryToSetEssential(bool bSetEssential = True)
	bool bSuccess = false
	Actor selfActor = self as Actor
	if selfActor
		bSuccess = true
		selfActor.SetEssential(bSetEssential)
	Else
		SpaceshipReference selfShip = self as SpaceshipReference
		if selfShip
			bSuccess = true
			selfShip.SetEssential(bSetEssential)
		endif
	endif
	return bSuccess
endFunction


;scornett
; Convenience function that places a ship near a ref, calculating an offset position based on MoveNear's positionVal, distanceVal, and facingVal values.
SpaceshipReference Function PlaceShipNearMe(Form akFormToPlace, int positionVal=0, int distanceVal=0, int facingVal=0, int aiLevelMod = 4, bool abPlayFx = true, bool abForcePersist = false, bool abInitiallyDisabled = false, bool abDeleteWhenAble = true, Alias akAliasToFill = None)
	SpaceshipReference ship = PlaceShipAtMe(akFormToPlace, aiLevelMod, False, abForcePersist, True, abDeleteWhenAble, None,  akAliasToFill)
	ship.MoveNear(Self, positionVal, distanceVal, facingVal)
	if (!abInitiallyDisabled)
		if (abPlayFx)
			ship.EnableWithGravJump()
		Else
			ship.EnableNoWait()
		EndIf
	EndIf
	return ship
EndFunction

; scornett
; Convenience function that moves this ref near another ref, calculating an offset position for it based on the following enums:
;
; positionVal, default=0
;  - -2 = Random (0-6)
;  - -1 = Dead ahead.
;  - 0 = Tight forward arc. ("Half the distance to the outer targeting ring or less.")
;  - 1 = Wide forward arc. ("Within the outer targeting ring.")
;  - 2 = Behind you.
;  - 3 = Above you.
;  - 4 = Below you.
;  - 5 = On your left/port.
;  - 6 = On your right/starboard.
;
; distanceVal, default=0
;  - -3 = Random (2-4)
;  - -2 = Random (0-4)
;  - -1 = Very close. ("As close as possible without colliding.")
;  - 0 = Close. ("Nearby, easily visible, at a good hailing distance.")
;  - 1 = Short Range. ("Nearby, hailing looks reasonable, a good range for an ambush.")
;  - 2 = Moderate Range. ("A good range for standard combat.")
;  - 3 = Long Range. ("A smudge in the distance.")
;  - 4 = Very Long Range. ("It's out there somewhere.")
;
; facingVal, default=0
; - -3 = Totally at random.
; - -2 = Random (0-7)
; - -1 = Directly at you.
; - 0 = Towards you, small offset. ("Looking at you.")
; - 1 = Towards you, large offset. ("Looking in your general direction.")
; - 2 = Away from you, small offset.
; - 3 = Away from you, large offset.
; - 4 = Left/port side facing you.
; - 5 = Right/starboard side facing you.
; - 6 = Bottom facing you.
; - 7 = Top facing you.
;
Function MoveNear(ObjectReference akTarget, int positionVal=0, int distanceVal=0, int facingVal=0)
	float[] offsets = new float[6]

	;Calculate distance.
	float targetMaxBound = Math.Max(Self.GetWidth(), Math.Max(Self.GetHeight(), Self.GetLength()))
	float nearRefMaxBound = Math.Max(akTarget.GetWidth(), Math.Max(akTarget.GetHeight(), akTarget.GetLength()))
	float distance = targetMaxBound + nearRefMaxBound
	if (distanceVal == CONST_NearDistance_Random)
		distanceVal = Utility.RandomInt(CONST_NearDistance_Min, CONST_NearDistance_Max)
	ElseIf (distanceVal == CONST_NearDistance_RandomFar)
		distanceVal = Utility.RandomInt(CONST_NearDistance_Moderate, CONST_NearDistance_Long)
	EndIf
	if (distanceVal == CONST_NearDistance_VeryClose)
		;distance = distance + 0
	ElseIf (distanceVal == CONST_NearDistance_Close)
		distance = distance + Utility.RandomFloat(CONST_NearDistance_Close_Min, CONST_NearDistance_Close_Max)
	ElseIf (distanceVal == CONST_NearDistance_Short)
		distance = distance + Utility.RandomFloat(CONST_NearDistance_Short_Min, CONST_NearDistance_Short_Max)
	ElseIf (distanceVal == CONST_NearDistance_Moderate)
		distance = distance + Utility.RandomFloat(CONST_NearDistance_Moderate_Min, CONST_NearDistance_Moderate_Max)
	ElseIf (distanceVal == CONST_NearDistance_Long)
		distance = distance + Utility.RandomFloat(CONST_NearDistance_Long_Min, CONST_NearDistance_Long_Max)
	ElseIf (distanceVal == CONST_NearDistance_VeryLong)
		distance = distance + Utility.RandomFloat(CONST_NearDistance_VeryLong_Min, CONST_NearDistance_VeryLong_Max)
	EndIf

	;Calculate position.
	if (positionVal == CONST_NearPosition_Random)
		positionVal = Utility.RandomInt(CONST_NearPosition_Min, CONST_NearPosition_Max)
	EndIf
	if (positionVal == CONST_NearPosition_DeadAhead)
		offsets[1] = distance
	Else
		float randomOffsetCoordinate1 = Utility.RandomFloat(-1, 1)
		float randomOffsetCoordinate2 = Utility.RandomFloat(-1, 1)
		if (positionVal == CONST_NearPosition_ForwardTight)
			offsets[0] = distance * CONST_NearPosition_TightArc * randomOffsetCoordinate1
			offsets[1] = distance
			offsets[2] = distance * CONST_NearPosition_TightArc * randomOffsetCoordinate2
		ElseIf (positionVal == CONST_NearPosition_ForwardWide)
			offsets[0] = distance * CONST_NearPosition_WideArc * randomOffsetCoordinate1
			offsets[1] = distance
			offsets[2] = distance * CONST_NearPosition_WideArc * randomOffsetCoordinate2
		ElseIf (positionVal == CONST_NearPosition_Behind)
			offsets[0] = distance * CONST_NearPosition_WideArc * randomOffsetCoordinate1
			offsets[1] = -1 * distance
			offsets[2] = distance * CONST_NearPosition_WideArc * randomOffsetCoordinate2			
		ElseIf (positionVal == CONST_NearPosition_Above)
			offsets[0] = distance * CONST_NearPosition_WideArc * randomOffsetCoordinate1
			offsets[1] = distance * CONST_NearPosition_WideArc * randomOffsetCoordinate2
			offsets[2] = distance
		ElseIf (positionVal == CONST_NearPosition_Below)
			offsets[0] = distance * CONST_NearPosition_WideArc * randomOffsetCoordinate1
			offsets[1] = distance * CONST_NearPosition_WideArc * randomOffsetCoordinate2
			offsets[2] = -1 * distance
		ElseIf (positionVal == CONST_NearPosition_Left)
			offsets[0] = -1 * distance
			offsets[1] = distance * CONST_NearPosition_WideArc * randomOffsetCoordinate1
			offsets[2] = distance * CONST_NearPosition_WideArc * randomOffsetCoordinate2
		ElseIf (positionVal == CONST_NearPosition_Right)
			offsets[0] = distance
			offsets[1] = distance * CONST_NearPosition_WideArc * randomOffsetCoordinate1
			offsets[2] = distance * CONST_NearPosition_WideArc * randomOffsetCoordinate2
		EndIf
	EndIf
	
	;Calculate heading.
	if (facingVal == CONST_NearFacing_Random)
		facingVal = Utility.RandomInt(CONST_NearFacing_Min, CONST_NearFacing_Max)
	EndIf
	if (facingVal == CONST_NearFacing_TotallyRandom)
		offsets[3] = Utility.RandomFloat(0, 360)
		offsets[4] = Utility.RandomFloat(0, 360)
		offsets[5] = Utility.RandomFloat(0, 360)
	ElseIf (facingVal == CONST_NearFacing_Direct)
		offsets[3] = 0
		offsets[4] = 0
		offsets[5] = CONST_NearFacing_HeadingCorrectionToDirectFacing
	Else
		offsets[3] = CONST_NearFacing_TightAngle * Utility.RandomFloat(-1, 1)
		offsets[4] = CONST_NearFacing_TightAngle * Utility.RandomFloat(-1, 1)
		offsets[5] = CONST_NearFacing_TightAngle * Utility.RandomFloat(-1, 1)
		float randomOffset = Utility.RandomFloat(-1, 1)

		if (facingVal == CONST_NearFacing_TowardSmall)
			offsets[5] = (CONST_NearFacing_HeadingCorrectionToDirectFacing) + (CONST_NearFacing_TightAngle * randomOffset)
		ElseIf (facingVal == CONST_NearFacing_TowardLarge)
			offsets[5] = (CONST_NearFacing_HeadingCorrectionToDirectFacing) + (CONST_NearFacing_WideAngle * randomOffset)
		ElseIf (facingVal == CONST_NearFacing_AwaySmall)
			offsets[5] = (-1*CONST_NearFacing_HeadingCorrectionToDirectFacing) + (CONST_NearFacing_TightAngle * randomOffset)
		ElseIf (facingVal == CONST_NearFacing_AwayLarge)
			offsets[5] = (-1*CONST_NearFacing_HeadingCorrectionToDirectFacing) + (CONST_NearFacing_WideAngle * randomOffset)
		ElseIf (facingVal == CONST_NearFacing_LeftSideOn)
			offsets[5] = (CONST_NearFacing_HeadingCorrectionToDirectFacing+90) + (CONST_NearFacing_WideAngle * randomOffset)
		ElseIf (facingVal == CONST_NearFacing_RightSideOn)
			offsets[5] = (CONST_NearFacing_HeadingCorrectionToDirectFacing-90) + (CONST_NearFacing_WideAngle * randomOffset)
		ElseIf (facingVal == CONST_NearFacing_BottomSideOn)
			offsets[3] = -90 + (CONST_NearFacing_WideAngle * randomOffset)
		ElseIf (facingVal == CONST_NearFacing_TopSideOn)
			offsets[3] = 90 + (CONST_NearFacing_WideAngle * randomOffset)
		EndIf
	EndIf

	Form XMarker = Game.GetFormFromFile(0x0000003B, "Starfield.esm")
	ObjectReference targetMarker = akTarget.PlaceAtMe(XMarker, akOffsetValues=offsets)
	MoveTo(targetMarker)
	targetMarker.Delete()
EndFunction



; Event received when this reference is activated
Event OnActivate(ObjectReference akActionRef)
EndEvent

; Event received when this object's parent cell is attached
Event OnCellAttach()
EndEvent

; Event received when this object's parent cell is detached
Event OnCellDetach()
EndEvent

; Event received when every object in this object's parent cell is loaded (TODO: Find restrictions)
Event OnCellLoad()
EndEvent

; Event received when this object is closed
Event OnClose(ObjectReference akActionRef)
EndEvent

; Event received when this object enters, exits, or changes containers
Event OnContainerChanged(ObjectReference akNewContainer, ObjectReference akOldContainer)
EndEvent

; Event received when a crew member is assigned.
Event OnCrewAssigned(Actor akCrew, ObjectReference akAssignmentRef, ObjectReference akPreviousAssignmentRef)
EndEvent

; Event received when a crew member is dismissed.
Event OnCrewDismissed(Actor akCrew, ObjectReference akPreviousAssignmentRef)
EndEvent

; Event received when this reference is destroyed
Event OnDestroyed(ObjectReference akDestroyer)
EndEvent

; Event received when this reference's destruction stage has changed
Event OnDestructionStageChanged(int aiOldStage, int aiCurrentStage)
EndEvent

; Event received when this furniture is entered.
Event OnEnterFurniture(Actor akActionRef)
EndEvent

; Event received when this object is equipped by an actor
Event OnEquipped(Actor akActor)
EndEvent

; Event received when this furniture is exited.
Event OnExitFurniture(ObjectReference akActionRef)
EndEvent

; Event received when this object is grabbed by the player
Event OnGrab()
EndEvent

; Event received when an item is removed from this object's inventory. If the item is a persistant reference, akItemReference
; will point at it - otherwise the parameter will be None. For valid Transfer Reasons please refer to the wiki.
Event OnItemAdded(Form akBaseItem, int aiItemCount, ObjectReference akItemReference, ObjectReference akSourceContainer, int aiTransferReason)
EndEvent

; Event received when an item is removed from this object's inventory. If the item is a persistant reference, akItemReference
; will point at it - otherwise the parameter will be None. For valid Transfer Reasons please refer to the wiki.
Event OnItemRemoved(Form akBaseItem, int aiItemCount, ObjectReference akItemReference, ObjectReference akDestContainer, int aiTransferReason)
EndEvent

; Event recieved when this object is completely loaded - will be fired every time this object is loaded
Event OnLoad()
EndEvent

; Event received when the lock on this object changes
Event OnLockStateChanged()
EndEvent

; Event received when an item has been repaired
Event OnObjectRepaired(ObjectReference akReference)
EndEvent

; Event received when an item has been destroyed
Event OnObjectDestroyed(ObjectReference akReference)
EndEvent

; Event received when this object is opened
Event OnOpen(ObjectReference akActionRef)
EndEvent

; Event received when an Outpost item loses power
Event OnOutpostItemPowerOff(ObjectReference akPoweredItem)
EndEvent

; Event received when an Outpost item receives power
Event OnOutpostItemPowerOn(ObjectReference akPoweredItem, ObjectReference akPowerGenerator)
EndEvent

; Event that occurs when the Pipboy enters/leaves the outer-radius of this radio ref
Event OnPipboyRadioDetection( bool abDetected )
EndEvent

; Event received when ref goes into dialogue with player
Event OnPlayerDialogueTarget( )
EndEvent

; Event received when a workshop item receives power
Event OnPowerOn(ObjectReference akPowerGenerator)
EndEvent

; Event received when a workshop loses all power
Event OnPowerOff()
EndEvent

; Event received when this object, if a book, is read
Event OnRead()
EndEvent

; Event received when this object is released by the player
Event OnRelease()
EndEvent

; Event received when this reference is reset
Event OnReset()
EndEvent

; Event received when this reference is sold by an actor
Event OnSell(Actor akSeller)
EndEvent

; Event received when a spell is cast by this object
Event OnSpellCast(Form akSpell)
EndEvent

; Event received when translation is almost complete (from a call to TranslateTo, "almost" is determined by a gamesetting, default is 90% of the way)
Event OnTranslationAlmostComplete()
EndEvent

; Event received when translation is complete (from a call to TranslateTo)
Event OnTranslationComplete()
EndEvent

; Event received when translation is aborted (from a call to StopTranslateTo)
Event OnTranslationFailed()
EndEvent

; Event recieved when this starts hitting a target
Event OnTrapHitStart(ObjectReference akTarget, float afXVel, float afYVel, float afZVel, float afXPos, float afYPos, float afZPos, \
	int aeMaterial, bool abInitialHit, int aeMotionType)
EndEvent

; Event recieved when this stops hitting a target
Event OnTrapHitStop(ObjectReference akTarget)
EndEvent

; Event received when this trigger volume is entered
Event OnTriggerEnter(ObjectReference akActionRef)
EndEvent

; Event received when this trigger volume is left
Event OnTriggerLeave(ObjectReference akActionRef)
EndEvent

; Event received when this object is unequipped by an actor
Event OnUnequipped(Actor akActor)
EndEvent

; Event recieved when this object is being unloaded - will be fired every time this object is unloaded
Event OnUnload()
EndEvent

; Event received when the player enters or leaves Workshop FlyCam
Event OnWorkshopFlyCam(bool aStart)
EndEvent

; Event received when the player enters or leaves Workshop Mode
Event OnWorkshopMode(bool aStart)
EndEvent

; Event received when the player grabs an existing object reference for edit while in Workshop mode.
Event OnWorkshopObjectGrabbed(ObjectReference akReference)
EndEvent

; Event received when an existing workshop item is moved in the world
Event OnWorkshopObjectMoved(ObjectReference akReference)
EndEvent

; Event received when a workshop item is placed in the world
Event OnWorkshopObjectPlaced(ObjectReference akReference)
EndEvent

; Event received when a workshop item is removed ( from world and added back to workshop )
Event OnWorkshopObjectRemoved(ObjectReference akReference)
EndEvent

; Event received when a new Output Link is created at a Workshop.
Event OnWorkshopOutputLink(ObjectReference akSource, ObjectReference akTarget)
EndEvent

; Event that occurs when a workshop NPC is directed to move to another settlement
Event OnWorkshopNPCTransfer(Location akNewWorkshop, Keyword akActionKW)
EndEvent

; Received if terminal object has menu item clicked
Event OnTerminalMenuItemRun(int auiMenuItemID, TerminalMenu akTerminalBase, ObjectReference akTerminalRef)
EndEvent

; Received if the quick container opens
Event OnQuickContainerOpened()
EndEvent

; Event received when the produced resource on an Workshop producer/builder has changed.
Event OnBuilderMenuSelect(ActorValue akActorValue)
EndEvent

; Received when this object is scanned
Event OnScanned()
EndEvent

; Received when this map marker is discovered
Event OnMapMarkerDiscovered()
EndEvent

; Event that is triggered when the target for a cargo link on workshop item changes.
Event OnWorkshopCargoLinkChanged(ObjectReference akOldTarget, ObjectReference akNewTarget)
EndEvent



;Set of read-only values for the MoveNear convenience function.
int property CONST_NearPosition_Min = 0 AutoReadOnly
int property CONST_NearPosition_Max = 6 AutoReadOnly
int property CONST_NearPosition_Random = -2 AutoReadOnly
int property CONST_NearPosition_DeadAhead = -1 AutoReadOnly
int property CONST_NearPosition_ForwardTight = 0 AutoReadOnly
int property CONST_NearPosition_ForwardWide = 1 AutoReadOnly
int property CONST_NearPosition_Behind = 2 AutoReadOnly
int property CONST_NearPosition_Above = 3 AutoReadOnly
int property CONST_NearPosition_Below = 4 AutoReadOnly
int property CONST_NearPosition_Left = 5 AutoReadOnly
int property CONST_NearPosition_Right = 6 AutoReadOnly

float property CONST_NearPosition_TightArc = 0.1 AutoReadOnly
float property CONST_NearPosition_WideArc = 0.2 AutoReadOnly

int property CONST_NearDistance_Min = 0 AutoReadOnly
int property CONST_NearDistance_Max = 4 AutoReadOnly
int property CONST_NearDistance_RandomFar = -3 AutoReadOnly
int property CONST_NearDistance_Random = -2 AutoReadOnly
int property CONST_NearDistance_VeryClose = -1 AutoReadOnly
int property CONST_NearDistance_Close = 0 AutoReadOnly
int property CONST_NearDistance_Short = 1 AutoReadOnly
int property CONST_NearDistance_Moderate = 2 AutoReadOnly
int property CONST_NearDistance_Long = 3 AutoReadOnly
int property CONST_NearDistance_VeryLong = 4 AutoReadOnly

int property CONST_NearDistance_Close_Min = 200 AutoReadOnly
int property CONST_NearDistance_Close_Max = 400 AutoReadOnly
int property CONST_NearDistance_Short_Min = 600 AutoReadOnly
int property CONST_NearDistance_Short_Max = 1000 AutoReadOnly
int property CONST_NearDistance_Moderate_Min = 1200 AutoReadOnly
int property CONST_NearDistance_Moderate_Max = 2000 AutoReadOnly
int property CONST_NearDistance_Long_Min = 2500 AutoReadOnly
int property CONST_NearDistance_Long_Max = 5000 AutoReadOnly
int property CONST_NearDistance_VeryLong_Min = 6000 AutoReadOnly
int property CONST_NearDistance_VeryLong_Max = 10000 AutoReadOnly

int property CONST_NearFacing_Min = 0 AutoReadOnly
int property CONST_NearFacing_Max = 7 AutoReadOnly
int property CONST_NearFacing_TotallyRandom = -3 AutoReadOnly
int property CONST_NearFacing_Random = -2 AutoReadOnly
int property CONST_NearFacing_Direct = -1 AutoReadOnly
int property CONST_NearFacing_TowardSmall = 0 AutoReadOnly
int property CONST_NearFacing_TowardLarge = 1 AutoReadOnly
int property CONST_NearFacing_AwaySmall = 2 AutoReadOnly
int property CONST_NearFacing_AwayLarge = 3 AutoReadOnly
int property CONST_NearFacing_LeftSideOn = 4 AutoReadOnly
int property CONST_NearFacing_RightSideOn = 5 AutoReadOnly
int property CONST_NearFacing_BottomSideOn = 6 AutoReadOnly
int property CONST_NearFacing_TopSideOn = 7 AutoReadOnly

float property CONST_NearFacing_HeadingCorrectionToDirectFacing = 90.0 AutoReadOnly
float property CONST_NearFacing_TightAngle = 15.0 AutoReadOnly
float property CONST_NearFacing_WideAngle = 30.0 AutoReadOnly


; Constants for SetMotionType:
int Property Motion_Fixed = 0 AutoReadOnly
int Property Motion_Dynamic = 1 AutoReadOnly
int Property Motion_Keyframed = 2 AutoReadOnly