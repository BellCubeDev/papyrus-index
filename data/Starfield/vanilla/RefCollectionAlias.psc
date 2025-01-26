Scriptname RefCollectionAlias extends Alias Native Hidden
import ObjectReference

; kmk
; add all actors in list to specified faction
Function AddToFaction(faction akFaction)
	int i = 0
	int count = GetCount()
	while i < count
		GetAt(i).TryToAddToFaction(akFaction)
		i += 1
	endwhile
endFunction

; kmk
; block activation on all refs in collection
Function BlockActivation(bool abBlocked = True, bool abHideActivateText = false)
	int i = 0
	int count = GetCount()
	while i < count
		ObjectReference theRef = GetAt(i)
		if theRef
			theRef.BlockActivation(abBlocked, abHideActivateText)
		endif
		i += 1		
	endWhile
endFunction

; kmk
; convenience function - casts the reference at aiIndex as an actor before returning it
Actor Function GetActorAt( int aiIndex )
	return GetAt(aiIndex) as Actor
endFunction

; kmk
; convenience function - casts the reference at aiIndex as an actor before returning it
SpaceshipReference Function GetShipAt( int aiIndex )
	return GetAt(aiIndex) as SpaceshipReference
endFunction

;jduvall
;convenience function
;return a random reference
ObjectReference Function GetRandom()
	return GetAt(Utility.RandomInt(0, GetCount() - 1))
EndFunction

; joshua.mcqueary
; Gets a random number of things from the collection
ObjectReference[] Function GetRandomObjects(int aiNumberToGet = 0)
	ObjectReference[] randomArray = new ObjectReference[aiNumberToGet]
	ObjectReference[] objectArray = GetArray()

	int index = 0
	While (index < aiNumberToGet && objectArray.Length > 0)
		int randIndex = Utility.RandomInt( 0, objectArray.Length - 1 )
		randomArray[index] = objectArray[randIndex]
		objectArray.Remove( randIndex )
		index += 1
	EndWhile

	return randomArray
EndFunction

; kmk
; return (first) owned object in collection
ObjectReference function GetFirstOwnedObject(Actor actorOwner)
	int i = 0
	int ownerIndex = -1
	int count = GetCount()
	while i < count && ownerIndex == -1
		if actorOwner.IsOwner(GetAt(i) as ObjectReference)
			ownerIndex = i
		endif
		i += 1
	endWhile
	if ownerIndex > -1
		return GetAt(ownerIndex)
	else
		return NONE
	endif
endFunction

; fab
; Enable everyone in the collection
function EnableAll(bool bFadeIn = false)
	int i = 0
	int count = GetCount()
	while i < count
		ObjectReference theRef = GetAt(i)
		if theRef
			theRef.EnableNoWait(bFadeIn)
		endif
		i += 1		
	endWhile
endFunction

; kmk
; Disable everyone in the collection
function DisableAll(bool bFadeOut = false)
	int i = 0
	int count = GetCount()
	while i < count
		ObjectReference theRef = GetAt(i)
		if theRef
			theRef.DisableNoWait(bFadeOut)
		endif
		i += 1		
	endWhile
endFunction


; fab
; Evaluate the packages of everyone in the collection
function EvaluateAll()
	int i = 0
	int count = GetCount()
	while i < count
		GetAt(i).TryToEvaluatePackage()
		i += 1		
	endWhile
endFunction

; kmk
; Move everyone in collection
function MoveAllTo(ObjectReference akTarget)
	int i = 0
	int count = GetCount()
	while i < count
		ObjectReference theRef = GetAt(i)
		if theRef
			theRef.MoveTo(akTarget)
		endif
		i += 1		
	endWhile
endFunction

; sc
; Move all actors to packages locations.
function MoveAllToPackageLocation()
	int i = 0
	int count = GetCount()
	while i < count
		ObjectReference current = GetAt(i)
		Actor theActor = current as Actor
		if theActor
			theActor.MoveToPackageLocation()
		else
			SpaceshipReference theShip = current as SpaceshipReference
			if (theShip)
				theShip.MoveToPackageLocation()
			endif
		endif
		i += 1		
	endWhile
endFunction


; kmk
; return true if actorOwner owns anything in the collection
bool function IsOwnedObjectInList(Actor actorOwner)
	int i = 0
	bool foundOwner = false
	int count = GetCount()
	while i < count && !foundOwner
		if actorOwner.IsOwner(GetAt(i) as ObjectReference)
			foundOwner = true
			debug.trace("IsOwnedObjectInList: item " + GetAt(i)+ " owned by " + actorOwner)
		endif
		i += 1
	endWhile
	return foundOwner
endFunction

; kmk
; return true if detectionTarget is detected by any actor in the collection
bool function IsDetectedBy(Actor detectionTarget)
	int i = 0
	bool isdetected = false
	int count = GetCount()
	while i < count && !isdetected
		Actor theActor = GetAt(i) as Actor
		if theActor && detectionTarget.IsDetectedBy(theActor)
			isdetected = true
			debug.trace("IsDetectedBy: " + detectionTarget + " is detected by " + theActor)
		endif
		i += 1
	endWhile
	return isdetected
endFunction

; kmk
; return true if any actor in the collection has detection LOS on actorTarget
bool function HasDetectionLOS(Actor actorTarget)
	int i = 0
	bool hasLOS = false
	int count = GetCount()
	while i < count && !hasLOS
		Actor theActor = GetAt(i) as Actor
		if theActor && theActor.HasDetectionLOS(actorTarget)
			hasLOS = true
			debug.trace("HasDetectionLOS: " + theActor + " has detection LOS on " + actorTarget)
		endif
		i += 1
	endWhile
	return hasLOS
endFunction

; sc
; Open or close all refs.
Function SetOpen(bool abOpen = true)
	int i = 0
	int count = GetCount()
	while i < count
		GetAt(i).SetOpen(abOpen)
		i += 1
	endWhile
endFunction

; kmk
; lock/unlock all refs
Function Lock(bool abLock = true, bool abAsOwner = false, bool abTraverseLinkedLockables = true)
	int i = 0
	int count = GetCount()
	while i < count
		GetAt(i).Lock(abLock, abAsOwner, abTraverseLinkedLockables)
		i += 1
	endWhile
endFunction

; kmk
; convenience function - kills everything in the collection (ships or actors)
Function KillAll(ObjectReference akKiller = NONE)
	int i = 0
	int count = GetCount()
	while i < count
		GetAt(i).TryToKill(akKiller)
		i += 1
	endWhile
endFunction

; kmk
; convenience function - everything in the collection starts combat with target
Function StartCombatAll(ObjectReference akCombatTarget)
	int i = 0
	int count = GetCount()
	while i < count
		GetAt(i).TryToStartCombat(akCombatTarget)
		i += 1
	endWhile
endFunction

; kmk
; remove all actors in list to specified faction
Function RemoveFromFaction(faction akFaction)
	int i = 0
	int count = GetCount()
	while i < count
		GetAt(i).TryToRemoveFromFaction(akFaction)
		i += 1
	endwhile
endFunction

; kmk
; remove all actors in list from all factions
Function RemoveFromAllFactions()
	int i = 0
	int count = GetCount()
	while i < count
		GetAt(i).TryToRemoveFromAllFactions()
		i += 1
	endwhile
endFunction

; kmk
; Reset everyone in the collection
function ResetAll()
	int i = 0
	int count = GetCount()
	while i < count
		ObjectReference theRef = GetAt(i)
		if theRef
			theRef.Reset()
		endif
		i += 1		
	endWhile
endFunction

; wjs
; convenenience function - set ghost on everyone
Function SetGhost(bool bSetGhost = True)
	int i = 0
	int count = GetCount()
	while i < count
		GetAt(i).TryToSetGhost(bSetGhost)
		i += 1
	endwhile
endFunction

; kmk
; convenience function - sets/clears Protected on everyone
Function SetProtected(bool bSetProtected = true)
	int i = 0
	int count = GetCount()
	while i < count
		GetAt(i).TryToSetProtected(bSetProtected)
		i += 1
	endWhile
endFunction

; kmk
; convenience function - sets/clears Essential on everyone
Function SetEssential(bool bSetEssential = true)
	int i = 0
	int count = GetCount()
	while i < count
		GetAt(i).TryToSetEssential(bSetEssential)
		i += 1
	endWhile
endFunction

; bsn
; convenience function - stops combat on everyone
Function StopCombat()
	int i = 0
	int count = GetCount()
	while i < count
		GetAt(i).TryToStopCombat()
		i += 1
	endWhile
endFunction

; convenience function - stop combat alarm on everyone
Function StopCombatAlarm()
	int i = 0
	int count = GetCount()
	while i < count
		GetAt(i).TryToStopCombatAlarm()
		i += 1
	endWhile
endFunction

Function AddRefCollection(RefCollectionAlias refCollectionAliasToAdd)
	int CollectionCount = refCollectionAliasToAdd.GetCount() const
	int index = 0
	while index < CollectionCount
		addRef(refCollectionAliasToAdd.getAt(index))
		index += 1
	endWhile
endFunction

Function RemoveRefCollection(RefCollectionAlias refCollectionAliasToRemove)
	int CollectionCount = refCollectionAliasToRemove.GetCount() const
	int index = 0
	while index < CollectionCount
		RemoveRef(refCollectionAliasToRemove.GetAt(index))
		index += 1
	endWhile
endFunction

; kmk
; add an array of references to a collection
Function AddArray(ObjectReference[] refArrayToAdd)
	int index = 0
	while index < refArrayToAdd.Length
		addRef(refArrayToAdd[index])
		index += 1
	endWhile
endFunction

;jduvall
;Get count of dead actors in Collection
int Function GetCountDead()
	int iReturnCount = 0

	int i = 0
	int count = GetCount()
	while i < count
		actor actorRef = GetActorAt(i)
		if actorRef && actorRef.IsDead()
			iReturnCount += 1
		Else
			SpaceshipReference theShipRef = GetShipAt(i)
			if theShipRef && theShipRef.IsDead()
				iReturnCount += 1
			endif
		endif

		i += 1
	EndWhile

	return iReturnCount
EndFunction

;jduvall
;Get count of dead actors and/or unloaded refs in Collection
int Function GetCountDeadOr3DUnloaded()
	int iReturnCount = 0

	int i = 0
	int count = GetCount()
	while i < count
		Actor actorRef = GetAt(i) as actor
		if GetAt(i).Is3DLoaded() == false || (actorRef && actorRef.IsDead())
			iReturnCount += 1
		Else
			SpaceshipReference theShipRef = GetShipAt(i)
			if theShipRef && theShipRef.IsDead()
				iReturnCount += 1
			endif
		endif
		i += 1
	EndWhile

	return iReturnCount
EndFunction

;jduvall
;Get count of dead actors and unloaded refs in Collection
int Function GetCountAliveAnd3DLoaded()
	int iReturnCount = 0

	int i = 0
	int count = GetCount()
	while i < count
		Actor actorRef = GetAt(i) as actor
		SpaceshipReference theShipRef = GetShipAt(i)

		if GetAt(i).Is3DLoaded()
			if (actorRef == None && theShipRef == None) || (actorRef && actorRef.IsDead() == false) || (theShipRef && theShipRef.IsDead() == false)
				iReturnCount += 1
			endif
		endif

		i += 1
	EndWhile

	return iReturnCount
EndFunction

;kmk
;Get count of disabled refs in Collection
int Function GetCountDisabled()
	int iReturnCount = 0

	int i = 0
	int count = GetCount()
	while i < count
		if GetAt(i).IsDisabled()
			iReturnCount += 1
		endif

		i += 1
	EndWhile

	return iReturnCount
EndFunction

;kmk
;remove disabled refs in Collection
; returns number of refs removed
int Function RemoveDisabled()
	int iReturnCount = 0

	int i = GetCount()-1
	While (i > -1)
		ObjectReference myRef = GetAt(i)
		if myRef.IsDisabled()
			iReturnCount += 1
			RemoveRef(myRef)
		endif

		i -= 1
	EndWhile

	return iReturnCount
EndFunction


; kmk
; set an actor value on all refs in the collection
function SetValue(ActorValue akActorValue, float fValue)
	int i = 0
	int count = GetCount()
	while i < count
		actor theActor = GetActorAt(i)
		if theActor
			theActor.SetValue(akActorValue, fValue)
		Else
			SpaceshipReference theShipRef = GetShipAt(i)
			if theShipRef
				theShipRef.SetValue(akActorValue, fValue)
			endif
		endif
		i += 1
	endWhile
endFunction

; Link this RefCollectionAlias to another refCollectionAlias with this keyword.
; Limited by the number of objects in the refCollectionAlias it is called on
; If wrapLinks == true : this will not be limited by the link target, but will wrap around to the top of that list
bool function LinkCollectionTo(RefCollectionAlias LinkedRefCollectionAlias, keyword LinkKeyword = none, bool WrapLinks = false)
	int index = 0
	int LinkTargetCount = LinkedRefCollectionAlias.GetCount() const
	int CollectionCount = GetCount() const
	while index < CollectionCount
		objectReference currentRef = GetAt(index)
		if currentRef
			currentRef.SetLinkedRef(LinkedRefCollectionAlias.GetAt(index % LinkTargetCount), LinkKeyword)
		endif
		index += 1
		if !wrapLinks && index >= LinkTargetCount
			return false
		endif
	endWhile
	return true
endFunction

;lvc Set the conscious/unconscious state of a ref collection
function SetUnconscious(bool abUnconscious = true)
	int i = 0
	int iReturnCount = GetCount()

	while i < iReturnCount
		actor theActor = GetActorAt(i)
		if theActor
			theActor.SetUnconscious(abUnconscious)
		Else
			SpaceshipReference theShipRef = GetShipAt(i)
			if theShipRef
				theShipRef.SetUnconscious(abUnconscious)
			endif
		endif
		i += 1
	endwhile
endfunction

; Adds the given ref to this ref collection
Function AddRef(ObjectReference akNewRef) native

; Finds the specified reference in the collection. Returns a negative value if not found.
int Function Find(ObjectReference akFindRef) native

; Gets an array of all refs in the collection
ObjectReference[] Function GetArray() native

; Gets an array of all actors in the collection
Actor[] Function GetActorArray() native

; Gets the ref at the given index in the collection 
ObjectReference Function GetAt( int aiIndex ) native

; Gets the count of refs in the collection
int Function GetCount() native

; Empties all refs from the collection
Function RemoveAll( ) native

; Takes the specific ref out of the collection
Function RemoveRef(ObjectReference akRemoveRef ) native

; Event received when an object has been added/removed to this refcollectionalias.
Event OnAliasChanged(ObjectReference akObject, bool abRemove)
EndEvent

; The following events are received if the object the alias points at receives the events. The
; sender of each event is the specific ref or actor in the collection that fired the event:

;------------------------------------------------------------------------------
; Events from object references below
;------------------------------------------------------------------------------

; Event received when this reference is activated
Event OnActivate(ObjectReference akSenderRef, ObjectReference akActionRef)
EndEvent

; Event received when the produced resource on an Workshop producer/builder has changed.
Event OnBuilderMenuSelect(ObjectReference akSenderRef, ActorValue akActorValue)
EndEvent

; Event received when this object's parent cell is attached
Event OnCellAttach(ObjectReference akSenderRef)
EndEvent

; Event received when this object's parent cell is detached
Event OnCellDetach(ObjectReference akSenderRef)
EndEvent

; Event received when every object in this object's parent cell is loaded (TODO: Find restrictions)
Event OnCellLoad(ObjectReference akSenderRef)
EndEvent

; Event received when this object is closed
Event OnClose(ObjectReference akSenderRef, ObjectReference akActionRef)
EndEvent

; Event received when this object enters, exits, or changes containers
Event OnContainerChanged(ObjectReference akSenderRef, ObjectReference akNewContainer, ObjectReference akOldContainer)
EndEvent

; Event received when a reference has a crew member assigned.
Event OnCrewAssigned(ObjectReference akSenderRef, Actor akCrew, ObjectReference akAssignmentRef, ObjectReference akPreviousAssignmentRef)
EndEvent

; Event received when a reference has a crew member dismissed.
Event OnCrewDismissed(ObjectReference akSenderRef, Actor akCrew, ObjectReference akPreviousAssignmentRef)
EndEvent

; Event received when this reference is destroyed
Event OnDestroyed(ObjectReference akSenderRef, ObjectReference akDestroyer)
EndEvent

; Event received when this reference's destruction stage has changed
Event OnDestructionStageChanged(ObjectReference akSenderRef, int aiOldStage, int aiCurrentStage)
EndEvent

; Event received when this furniture is entered.
Event OnEnterFurniture(ObjectReference akSenderRef, Actor akActionRef)
EndEvent

; Event received when this object is equipped by an actor
Event OnEquipped(ObjectReference akSenderRef, Actor akActor)
EndEvent

; Event received when this furniture is exited.
Event OnExitFurniture(ObjectReference akSenderRef, ObjectReference akActionRef)
EndEvent

; Event received when this object is grabbed by the player
Event OnGrab(ObjectReference akSenderRef)
EndEvent

; Event received when an item is added to this object's inventory. If the item is a persistant reference, akItemReference will
; point at it - otherwise the parameter will be None. For valid Transfer Reasons please refer to the wiki.
Event OnItemAdded(ObjectReference akSenderRef, Form akBaseItem, int aiItemCount, ObjectReference akItemReference, ObjectReference akSourceContainer, int aiTransferReason)
EndEvent

; Event received when an item is removed from this object's inventory. If the item is a persistant reference, akItemReference
; will point at it - otherwise the parameter will be None. For valid Transfer Reasons please refer to the wiki.
Event OnItemRemoved(ObjectReference akSenderRef, Form akBaseItem, int aiItemCount, ObjectReference akItemReference, ObjectReference akDestContainer, int aiTransferReason)
EndEvent

; Event recieved when this object is completely loaded - will be fired every time this object is loaded
Event OnLoad(ObjectReference akSenderRef)
EndEvent

; Event received when the lock on this object changes
Event OnLockStateChanged(ObjectReference akSenderRef)
EndEvent

; Received when this map marker is discovered
Event OnMapMarkerDiscovered(ObjectReference akSenderRef)
EndEvent

; Event received when an item has been repaired
Event OnObjectRepaired(ObjectReference akSenderRef, ObjectReference akReference)
EndEvent

; Event received when an item has been destroyed
Event OnObjectDestroyed(ObjectReference akSenderRef, ObjectReference akReference)
EndEvent

; Event received when this object is opened
Event OnOpen(ObjectReference akSenderRef, ObjectReference akActionRef)
EndEvent

; Event received when an Outpost item loses power
Event OnOutpostItemPowerOff(ObjectReference akSenderRef, ObjectReference akPoweredItem)
EndEvent

; Event received when an Outpost item receives power
Event OnOutpostItemPowerOn(ObjectReference akSenderRef, ObjectReference akPoweredItem, ObjectReference akPowerGenerator)
EndEvent

; Event that occurs when the Pipboy enters/leaves the outer-radius of this radio ref
Event OnPipboyRadioDetection(ObjectReference akSenderRef, bool abDetected)
EndEvent

; Event received when a workshop item receives power
Event OnPowerOn(ObjectReference akSenderRef, ObjectReference akPowerGenerator)
EndEvent

; Event received when a workshop loses all power
Event OnPowerOff(ObjectReference akSenderRef)
EndEvent

; Received if the quick container opens
Event OnQuickContainerOpened(ObjectReference akSenderRef)
EndEvent

; Event received when this object, if a book, is read
Event OnRead(ObjectReference akSenderRef)
EndEvent

; Event received when this object is released by the player
Event OnRelease(ObjectReference akSenderRef)
EndEvent

; Event received when this reference is reset
Event OnReset(ObjectReference akSenderRef)
EndEvent

; Received when this object is scanned
Event OnScanned(ObjectReference akSenderRef)
EndEvent

; Event received when this reference is sold by an actor
Event OnSell(ObjectReference akSenderRef, Actor akSeller)
EndEvent

; Event received when a ship initiates and completes docking with a parent
Event OnShipDock(ObjectReference akSenderRef, bool abComplete, SpaceshipReference akDocking, SpaceshipReference akParent)
EndEvent

; Event received when a ship begins or ends far travel - State { Departure = 0, Arrival = 1 }
Event OnShipFarTravel(ObjectReference akSenderRef, Location aDepartureLocation, Location aArrivalLocation, int aState)
EndEvent

; Event received when a ship grav jump event occurs - State { Initiated = 0, AnimStarted = 1, Completed = 2, Failed = 3 }
Event OnShipGravJump(ObjectReference akSenderRef, Location aDestination, int aState)
EndEvent

; Event received when a ship initiates or completes landing
Event OnShipLanding(ObjectReference akSenderRef, bool abComplete)
EndEvent

; Event received when a ship system adds or removes power
Event OnShipSystemPowerChange(ObjectReference akSenderRef, ActorValue akSystem, bool abAddPower, bool abDamageRelated)
EndEvent

; Event received when a ship initiates or completes takeoff
Event OnShipTakeOff(ObjectReference akSenderRef, bool abComplete)
EndEvent

; Event received when a ship initiates or completes undocking with a parent
Event OnShipUndock(ObjectReference akSenderRef, bool abComplete, SpaceshipReference akUndocking, SpaceshipReference akParent)
EndEvent

; Event received when a spell is cast by this object
Event OnSpellCast(ObjectReference akSenderRef, Form akSpell)
EndEvent

; Received if terminal object has menu item clicked
Event OnTerminalMenuItemRun(ObjectReference akSenderRef, int auiMenuItemID, TerminalMenu akTerminalBase, ObjectReference akTerminalRef)
EndEvent

; Event received when translation is almost complete (from a call to TranslateTo, "almost" is determined by a gamesetting, default is 90% of the way)
Event OnTranslationAlmostComplete(ObjectReference akSenderRef)
EndEvent

; Event received when translation is complete (from a call to TranslateTo)
Event OnTranslationComplete(ObjectReference akSenderRef)
EndEvent

; Event received when translation is aborted (from a call to StopTranslateTo)
Event OnTranslationFailed(ObjectReference akSenderRef)
EndEvent

; Event recieved when this starts hitting a target
Event OnTrapHitStart(ObjectReference akSenderRef, ObjectReference akTarget, float afXVel, float afYVel, float afZVel, float afXPos, float afYPos, \
	float afZPos, int aeMaterial, bool abInitialHit, int aeMotionType)
EndEvent

; Event recieved when this stops hitting a target
Event OnTrapHitStop(ObjectReference akSenderRef, ObjectReference akTarget)
EndEvent

; Event received when this trigger volume is entered
Event OnTriggerEnter(ObjectReference akSenderRef, ObjectReference akActionRef)
EndEvent

; Event received when this trigger volume is left
Event OnTriggerLeave(ObjectReference akSenderRef, ObjectReference akActionRef)
EndEvent

; Event received when this object is unequipped by an actor
Event OnUnequipped(ObjectReference akSenderRef, Actor akActor)
EndEvent

; Event recieved when this object is being unloaded - will be fired every time this object is unloaded
Event OnUnload(ObjectReference akSenderRef)
EndEvent

; Event that is triggered when the target for a cargo link on workshop item changes.
Event OnWorkshopCargoLinkChanged(ObjectReference akSenderRef, ObjectReference akOldTarget, ObjectReference akNewTarget)
EndEvent

; Event received when the player enters or leaves Workshop FlyCam
Event OnWorkshopFlyCam(ObjectReference akSenderRef, bool aStart)
EndEvent

; Event received when the player enters or leaves Workshop Mode
Event OnWorkshopMode(ObjectReference akSenderRef, bool aStart)
EndEvent

; Event received when the player grabs an existing object reference for edit while in Workshop mode.
Event OnWorkshopObjectGrabbed(ObjectReference akSenderRef, ObjectReference akReference)
EndEvent

; Event received when an existing workshop item is moved in the world
Event OnWorkshopObjectMoved(ObjectReference akSenderRef, ObjectReference akReference)
EndEvent

; Event received when a workshop item is placed in the world
Event OnWorkshopObjectPlaced(ObjectReference akSenderRef, ObjectReference akReference)
EndEvent

; Event received when a workshop item is removed ( from world and added back to workshop )
Event OnWorkshopObjectRemoved(ObjectReference akSenderRef, ObjectReference akReference)
EndEvent

; Event received when a new Output Link is created at a Workshop.
Event OnWorkshopOutputLink(ObjectReference akSenderRef, ObjectReference akSource, ObjectReference akTarget)
EndEvent

; Event that occurs when a workshop NPC is directed to move to another settlement
Event OnWorkshopNPCTransfer(ObjectReference akSenderRef, Location akNewWorkshop, Keyword akActionKW)
EndEvent

;------------------------------------------------------------------------------
; Events from actors only below
;------------------------------------------------------------------------------

; Event received when this actor activates a ref
Event OnActorActivatedRef(ObjectReference akSenderRef, ObjectReference akActivatedRef)
EndEvent

; Event received when affinity event is run
Event OnAffinityEvent(ObjectReference akSenderRef, AffinityEvent akAffinityEvent, ActorValue akActorValue, GlobalVariable akReactionValue, ObjectReference akTarget)
EndEvent

; Event that is triggered when this actor adds another actor to its combat list.
Event OnCombatListAdded(ObjectReference akSenderRef, Actor akTarget)
EndEvent

; Event that is triggered when this actor removes another actor from its combat list.
Event OnCombatListRemoved(ObjectReference akSenderRef, Actor akTarget)
EndEvent

; Event that is triggered when this reference's combat state against the target changes
; State is as follows:
; 0 - not in combat
; 1 - in combat
; 2 - searching
Event OnCombatStateChanged(ObjectReference akSenderRef, ObjectReference akTarget, int aeCombatState)
EndEvent

; Event received when the object completes a command in command mode.
; Type is as follows:
; 0 - None
; 1 - Call
; 2 - Follow
; 3 - Move
; 4 - Attack
; 5 - Inspect
; 6 - Retrieve
; 7 - Stay
; 8 - Release
; 9 - Heal
; 10 - Assign
; 11 - Ride
; 12 - Enter
Event OnCommandModeCompleteCommand(ObjectReference akSenderRef,  int aeCommand, ObjectReference akTarget)
EndEvent

; Event received when the player begins commanding this object 
Event OnCommandModeEnter(ObjectReference akSenderRef)
EndEvent

; Event received when the player ends commanding this object 
Event OnCommandModeExit(ObjectReference akSenderRef)
EndEvent

; Event received when the player gives object a command in command mode.
; Type is as follows:
; 0 - None
; 1 - Call
; 2 - Follow
; 3 - Move
; 4 - Attack
; 5 - Inspect
; 6 - Retrieve
; 7 - Stay
; 8 - Release
; 9 - Heal
; 10 - Assign
; 11 - Ride
; 12 - Enter
Event OnCommandModeGiveCommand(ObjectReference akSenderRef, int aeCommand, ObjectReference akTarget)
EndEvent

; Received when player dismisses teammate companion
Event OnCompanionDismiss(ObjectReference akSenderRef)
EndEvent

; Event that is triggered when this actor's consciousness state changes
Event OnConsciousnessStateChanged(ObjectReference akSenderRef, bool abUnconscious)
EndEvent

;Recieved immeadiately after a limb has become crippled or uncrippled.
Event OnCripple(ObjectReference akSenderRef, ActorValue akActorValue, bool abCrippled)
EndEvent

; Event that is triggered when this actor gets a deferred kill added
; (they were in deferred kill mode and got "killed")
Event OnDeferredKill(ObjectReference akSenderRef, Actor akKiller)
EndEvent

; Event that is triggered when this actor finishes dying (only if this alias points at an actor)
Event OnDeath(ObjectReference akSenderRef, ObjectReference akKiller)
EndEvent

; Event received when the player changes their difficulty
; Type is as follows:
; 0 - Very Easy
; 1 - Easy
; 2 - Normal
; 3 - Hard
; 4 - Very Hard
; 5 - Survival
Event OnDifficultyChanged(ObjectReference akSenderRef, int aOldDifficulty, int aNewDifficulty)
EndEvent

; Event that is triggered when this actor begins dying (only if this alias points at an actor)
Event OnDying(ObjectReference akSenderRef, ObjectReference akKiller)
EndEvent

; Event received when an actor enters bleedout. (only if this alias points at an actor)
Event OnEnterBleedout(ObjectReference akSenderRef)
EndEvent

; Event received when the player enters Outpost Beacon placeement mode.
Event OnEnterOutpostBeaconMode(ObjectReference akSenderRef)
EndEvent

; Event received when an actor enters a ship interior cell
Event OnEnterShipInterior(ObjectReference akSenderRef, ObjectReference akShip)
EndEvent

; Event received when an actor enters sneaking.
Event OnEnterSneaking(ObjectReference akSenderRef)
EndEvent

; Event received when this actor is in an Escort procedure and begins waiting for the escorted actor to catch up.
Event OnEscortWaitStart(ObjectReference akSenderRef)
EndEvent

; Event received when this actor is in an Escort procedure and stops waiting because the escorted actor has caught up.
Event OnEscortWaitStop(ObjectReference akSenderRef)
EndEvent

; Event received when an actor exits a ship interior cell
Event OnExitShipInterior(ObjectReference akSenderRef, ObjectReference akShip)
EndEvent

; Event received when a player follower is warped
Event OnPlayerFollowerWarp(ObjectReference akSenderRef, ObjectReference akFollower)
EndEvent

; Event that is triggered when this actor leaves the furniture
Event OnGetUp(ObjectReference akSenderRef, ObjectReference akFurniture)
EndEvent

; Event that is triggered when the actors home ship is set.
Event OnHomeShipSet(ObjectReference akSenderRef, SpaceshipReference akShip, SpaceshipReference akPrevious)
EndEvent

; Received when player placed an outpost beacon
Event OnOutpostPlaced(ObjectReference akSenderRef, ObjectReference akOutpostBeacon)
EndEvent

; Event received when the player plots a failed starmap route
; Type is as follows:
; 0 - Success
; 1 - Insufficient Fuel
; 2 - Out of Range
; 3 - Unexplored System
Event OnPlayerFailedPlotRoute(ObjectReference akSenderRef, int aeFailedPlotReason)
EndEvent

; Event that is triggered when an actor modifies a ship
Event OnPlayerModifiedShip(ObjectReference akSenderRef, SpaceshipReference akShip)
EndEvent

; Event received when this actor equips something - akReference may be None if object is not persistent (only if this alias points at an actor)
Event OnItemEquipped(ObjectReference akSenderRef, Form akBaseObject, ObjectReference akReference)
EndEvent

; Event received when this actor unequips something - akReference may be None if object is not persistent (only if this alias points at an actor)
Event OnItemUnequipped(ObjectReference akSenderRef, Form akBaseObject, ObjectReference akReference)
EndEvent

; Event that is triggered when this actor kills another
Event OnKill(ObjectReference akSenderRef, ObjectReference akVictim)
EndEvent

; Event that is triggered when this actor changes from one location to another (only if this alias points at an actor)
Event OnLocationChange(ObjectReference akSenderRef, Location akOldLoc, Location akNewLoc)
EndEvent

; Event received when this actor's package changes (only if this alias points at an actor)
Event OnPackageChange(ObjectReference akSenderRef, Package akOldPackage)
EndEvent

; Event received when this actor's package ends (only if this alias points at an actor)
Event OnPackageEnd(ObjectReference akSenderRef, Package akOldPackage)
EndEvent

; Event received when this actor starts a new package (only if this alias points at an actor)
Event OnPackageStart(ObjectReference akSenderRef, Package akNewPackage)
EndEvent

;Recieved immeadiately after the limb of a robot (or other actor whose race allows sub-segment damage) has become (or ceased to be) partially crippled.
Event OnPartialCripple(ObjectReference akSenderRef, ActorValue akActorValue, bool abCrippled)
EndEvent

; Event received when an actor picks a lock
Event OnPickLock(ObjectReference akSenderRef, ObjectReference akLockedRef, bool abCrime, bool abSucceeded, TerminalMenu akLockedTerminalMenu, int aiTerminalMenuItem)
EndEvent

;Received when the player fails to pickpocket this actor
Event OnPickpocketFailed(ObjectReference akSenderRef)
EndEvent

; Received when player completes research
Event OnPlayerCompleteResearch(ObjectReference akSenderRef, ObjectReference akBench, Location akLocation, ResearchProject akProject)
EndEvent

; Received when player crafts an item
Event OnPlayerCraftItem(ObjectReference akSenderRef, ObjectReference akBench, Location akLocation, Form akCreatedItem)
EndEvent

; Received when player creates a new robot
Event OnPlayerCreateRobot(ObjectReference akSenderRef, Actor akNewRobot)
EndEvent

; Event received when ref goes into dialogue with player
Event OnPlayerDialogueTarget(ObjectReference akSenderRef)
EndEvent

; Received when player enters vertibird
Event OnPlayerEnterVertibird(ObjectReference akSenderRef, ObjectReference akVertibird)
EndEvent

; Received when player takes fall damage
Event OnPlayerFallLongDistance(ObjectReference akSenderRef, float afDamage)
EndEvent

; Received when player fires a weapon out of combat and based on timer
Event OnPlayerFireWeapon(ObjectReference akSenderRef, Form akBaseObject)
EndEvent

; Received when player heals his teammate
Event OnPlayerHealTeammate(ObjectReference akSenderRef, Actor akTeammate)
EndEvent

; Received when the player gains an item in their inventory
; aeAcquireType is one of the following:
; 0: None
; 1: Steal
; 2: Buy
; 3: Pickpocket
; 4: Pickup
; 5: Container
; 6: Dead body
Event OnPlayerItemAdded(ObjectReference akSenderRef, Form akBaseObject, ObjectReference akOwner, ObjectReference akSourceContainer, int aeAcquireType)
EndEvent

; Received immediately after the player has loaded a save game. A good time to check for additional content.
Event OnPlayerLoadGame(ObjectReference akSenderRef)
EndEvent

; Received when player starts loitering
Event OnPlayerLoiteringBegin(ObjectReference akSenderRef)
EndEvent

; Received when player stops loitering
Event OnPlayerLoiteringEnd(ObjectReference akSenderRef)
EndEvent

; Received when player mods a weapon or armor in the menu.
Event OnPlayerModArmorWeapon(ObjectReference akSenderRef, Form akBaseObject, ObjectMod akModBaseObject)
EndEvent

; Received when the player mods a robot
Event OnPlayerModRobot(ObjectReference akSenderRef, Actor akRobot, ObjectMod akModBaseObject)
EndEvent

; Received when player starts swimming
Event OnPlayerSwimming(ObjectReference akSenderRef)
EndEvent

; Received when player uses a workbench
Event OnPlayerUseWorkBench(ObjectReference akSenderRef, ObjectReference akWorkBench)
EndEvent

; Event received when this actor finishes changing its race
Event OnRaceSwitchComplete(ObjectReference akSenderRef)
EndEvent

; Event received when an actor exits bleedout. (only if this alias points at an actor)
Event OnRecoverFromBleedout(ObjectReference akSenderRef)
EndEvent

; Event that is triggered when this actor sits in the furniture
Event OnSit(ObjectReference akSenderRef, ObjectReference akFurniture)
EndEvent

; Received when player gets a speech challenge in dialogue
Event OnSpeechChallengeAvailable(ObjectReference akSenderRef, ObjectReference akSpeaker)
EndEvent

; Received when player completely surveyed a planet
Event OnPlayerPlanetSurveyComplete(ObjectReference akSenderRef, Planet akPlanet)
EndEvent

; Received by the player when they scan an object
Event OnPlayerScannedObject(ObjectReference akSenderRef, ObjectReference akScannedRef)
EndEvent

; Event that is triggered when the player is arrested.
Event OnPlayerArrested(ObjectReference akSenderRef,ObjectReference akGuard, Location akLocation, int aeCrimeType )
EndEvent

; Event that is triggered when the player assaults someone.
Event OnPlayerAssaultActor(ObjectReference akSenderRef,ObjectReference akVictim, Location akLocation, bool aeCrime )
EndEvent

; Event that is triggered when the player gets crimegold .
Event OnPlayerCrimeGold(ObjectReference akSenderRef,ObjectReference akVictim, Form akFaction, int aeCrimeGold, int aeCrimeType )
EndEvent

; Event that is triggered when the player goes to jail.
Event OnPlayerJail(ObjectReference akSenderRef,ObjectReference akGuard, Form akFaction,  Location akLocation,int aeCrimeGold)
EndEvent

; Event that is triggered when the player pays fine.
Event OnPlayerPayFine(ObjectReference akSenderRef,ObjectReference akGuard, Form akFaction, int aeCrimeGold)
EndEvent

; Event that is triggered when the player murders someone.
Event OnPlayerMurderActor(ObjectReference akSenderRef,ObjectReference akVictim, Location akLocation, bool aeCrime )
EndEvent

; Event that is triggered when the player trespassing.
Event OnPlayerTrespass(ObjectReference akSenderRef,ObjectReference akVictim, Location akLocation, bool aeCrime)
EndEvent

; Event that is triggered when the player buys a ship
Event OnPlayerBuyShip(ObjectReference akSenderRef, SpaceshipReference akShip)
EndEvent

; Event that is triggered when the player sells a ship
Event OnPlayerSellShip(ObjectReference akSenderRef, SpaceshipReference akShip)
EndEvent

;------------------------------------------------------------------------------
; Events from spaceships only below
;------------------------------------------------------------------------------

; Event this is triggered when a ship is bought
Event OnShipBought(ObjectReference akSenderRef)
EndEvent

; Event this is triggered when a ship is sold
Event OnShipSold(ObjectReference akSenderRef)
EndEvent

; Event that is triggered when one of this spaceship's systems loses a power block due to damage
Event OnShipSystemDamaged(ObjectReference akSenderRef, ActorValue akSystem, int aBlocksLost, bool aElectromagneticDamage, bool aFullyDamaged)
EndEvent

; Event that is triggered when one of this spaceship's systems gains a power block due to being repaired
Event OnShipSystemRepaired(ObjectReference akSenderRef, ActorValue akSystem, int aBlocksGained, bool aElectromagneticDamage)
EndEvent

; Event recieved when a ship's landing ramp has lowereed all the way and connected to the surrounding navmesh
Event OnShipRampDown(ObjectReference akSenderRef)
EndEvent

; Event that is triggered when fuel has been added to this spaceship
Event OnShipRefueled(ObjectReference akSenderRef, int aFuelAdded)
EndEvent

; Event that is triggered when the player scans a planet with this spaceship
Event OnShipScan(ObjectReference akSenderRef, Location aPlanet, ObjectReference[] aMarkersArray)
EndEvent