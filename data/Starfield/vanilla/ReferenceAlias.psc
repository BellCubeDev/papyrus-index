Scriptname ReferenceAlias extends Alias Native Hidden
import ObjectReference

; Applies the alias data to the given ref without putting the ref in the alias
Function ApplyToRef(ObjectReference akRef) native

; Clears the alias - fails on non-optional aliases
Function Clear() native

; Get the object reference this alias refers to
ObjectReference Function GetReference() native

; Forces this alias to use the specified reference
Function ForceRefTo(ObjectReference akNewRef) native

; SJML -- tries to force a reference into the alias, but only if it's already empty.
;  returns true if the alias now holds the passed reference, false if it was already filled.
bool Function ForceRefIfEmpty(ObjectReference akNewRef)
	if (GetReference())
		return False
	else
		ForceRefTo(akNewRef)
		return True
	endif
EndFunction


; Autocast to Actor
Actor Function GetActorReference()
	return GetReference() as Actor
endFunction

; Convenience function
ObjectReference Function GetRef()
	return GetReference()
endFunction

; Convenience function
Actor Function GetActorRef()
	return GetActorReference()
endFunction

; Autocast to ShipReference
SpaceshipReference Function GetShipReference()
	return GetReference() as SpaceshipReference
endFunction

; Convenience function
SpaceshipReference Function GetShipRef()
	return GetShipReference()
endFunction
; Removes this data alias from the given ref
Function RemoveFromRef(ObjectReference akRef) native

; Convenience function - jduvall
bool Function TryToAddToFaction(Faction FactionToAddTo)
	bool bSuccess = false
	ObjectReference myRef = GetRef()
	if myRef
		bSuccess = myRef.TryToAddToFaction(FactionToAddTo)
	EndIf
	Return bSuccess
EndFunction

; Convenience function - jduvall
bool Function TryToRemoveFromFaction(Faction FactionToRemoveFrom)
	bool bSuccess = false
	ObjectReference myRef = GetRef()
	if myRef
		bSuccess = myRef.TryToRemoveFromFaction(FactionToRemoveFrom)
	EndIf
	Return bSuccess
EndFunction

; Convenience function - jduvall
bool Function TryToStopCombat()
	bool bSuccess = false
	ObjectReference myRef = GetRef()
	if myRef
		bSuccess = myRef.TryToStopCombat()
	EndIf
	Return bSuccess
EndFunction

; Convenience function - jduvall
bool Function TryToDisable()
	ObjectReference Ref = GetReference()

	if Ref
		Ref.Disable()
		Return True
	EndIf

	Return False
EndFunction

; Convenience function - wshen
bool Function TryToDisableNoWait()
	ObjectReference Ref = GetReference()

	if Ref
		Ref.DisableNoWait()
		Return True
	EndIf

	Return False
EndFunction

; Convenience function - jduvall
bool Function TryToEnable()
	ObjectReference Ref = GetReference()

	if Ref
		Ref.Enable()
		Return True
	EndIf

	Return False
EndFunction

; Convenience function - wshen
bool Function TryToEnableNoWait()
	ObjectReference Ref = GetReference()

	if Ref
		Ref.EnableNoWait()
		Return True
	EndIf

	Return False
EndFunction

; Convenience function - jduvall
bool Function TryToEvaluatePackage()
	bool bSuccess = false
	ObjectReference myRef = GetRef()
	if myRef
		bSuccess = myRef.TryToEvaluatePackage()
	EndIf
	Return bSuccess
EndFunction

; Convenience function - jduvall
bool Function TryToKill(ObjectReference akKiller = NONE)
	bool bSuccess = false
	ObjectReference myRef = GetRef()
	if myRef
		bSuccess = myRef.TryToKill(akKiller)
	EndIf
	Return bSuccess
EndFunction

; Convenience function - jduvall
bool Function TryToMoveTo(ObjectReference RefToMoveTo)
	ObjectReference Ref = GetReference()

	if Ref
		Ref.MoveTo(RefToMoveTo)
		Return True
	EndIf

	Return False
EndFunction

; Convenience function - jduvall
bool Function TryToReset()
	ObjectReference Ref = GetReference()

	if Ref
		Ref.Reset()
		Return True
	EndIf

	Return False
EndFunction

; Convenience function - sjml
bool Function TryToClear()
	if (GetReference())
		Clear()
		return True
	endif

	return False
EndFunction

; Convenience function - jduvall
bool Function TryToDelete()
	ObjectReference Ref = GetReference()

	if Ref
		Ref.Delete()
		return true
	EndIf

	return false
EndFunction



; Convenience function - jduvall
location Function TryToGetCurrentLocation()
	ObjectReference Ref = GetReference()

	if Ref
		return Ref.GetCurrentLocation()
	EndIf

	return None
EndFunction

; Convenience function - jduvall
float Function TryToGetActorValue(ActorValue ActorValueToGet)
	TryToGetValue(ActorValueToGet)
EndFunction

; Convenience function - jduvall
float Function TryToGetValue(ActorValue akAV)
	ObjectReference Ref = GetReference()

	if Ref
		Return Ref.GetValue(akAV)
	EndIf

	Return 0 ;NOTE: THIS MAY BE AN EXPECTED VALUE AS WELL

EndFunction


; Convenience function - jduvall
bool Function TryToSetActorValue(ActorValue ValueToSet, float afValue)
	Return TryToSetValue(ValueToSet, afValue)
EndFunction

; Convenience function - jduvall
bool Function TryToSetValue(ActorValue akAV, float afValue)
	ObjectReference Ref = GetReference()

	if Ref
		Ref.SetValue(akAV, afValue)
		Return True
	EndIf

	Return False
EndFunction

; Convenience function - jduvall
bool Function TryIsLocked()
	ObjectReference Ref = GetReference()

	if Ref
		Return Ref.IsLocked()
	EndIf

	Return False
EndFunction

; kmk - convenience function for actor/ship
Function TryToSetPlayerResistingArrest()
	Actor guardActor = GetActorRef()
	if guardActor
		guardActor.SetPlayerResistingArrest()
	Else
		SpaceshipReference guardShip = GetShipRef()
		if guardShip
			guardShip.SetPlayerResistingArrest()
		endif
	EndIf
EndFunction

; kmk - convenience function for actor/ship
Function TryToSendPlayerToJail(bool abRemoveInventory = true, bool abRealJail = false)
	Faction crimeFaction
	Actor guardActor = GetActorRef()
	if guardActor
		crimeFaction = guardActor.GetCrimeFaction()
	Else
		SpaceshipReference guardShip = GetShipRef()
		if guardShip
			crimeFaction = guardShip.GetCrimeFaction()
		endif
	EndIf
	debug.trace(self + " TryToSendPlayerToJail: crimeFaction=" + crimeFaction + " abRemoveInventory=" + abRemoveInventory + " abRealJail=" + abRealJail)
	if crimeFaction
		crimeFaction.SendPlayerToJail(abRemoveInventory, abRealJail)
	endif
EndFunction

; kmk - convenience function for actor/ship
Function TryToPlayerPayFine(bool abRemoveStolenItems = true, bool abGoToJail = true)
	Faction crimeFaction = TryToGetCrimeFaction()
	if crimeFaction
		debug.trace(self + "TryToPlayerPayFine: crimeFaction=" + crimeFaction + " abRemoveStolenItems=" + abRemoveStolenItems + ", abGoToJail=" + abGoToJail)
		crimeFaction.PlayerPayCrimeGold(abRemoveStolenItems=abRemoveStolenItems, abGoToJail=abGoToJail)
	endif
EndFunction

; kmk - convenience function for ship
; does nothing if called on actor
Function TryToSendSmugglingAlarm()
	SpaceshipReference guardShip = GetShipRef()
	if guardShip
		guardShip.SendSmugglingAlarm()
	endif
EndFunction

; scornett - Convenience function for ships.
; Does nothing if either reference is an actor.
bool Function TryToInstantDock(ReferenceAlias akTarget)
	SpaceshipReference selfShipRef = GetShipRef()
	SpaceshipReference targetShipRef = akTarget.GetShipRef()
	if selfShipRef && targetShipRef
		return selfShipRef.InstantDock(targetShipRef)
	Else
		return False
	EndIf
EndFunction

; scornett
bool Function TryToMoveNear(ObjectReference akTarget, int positionVal=0, int distanceVal=0, int facingVal=0)
	ObjectReference Ref = GetReference()
	if Ref && akTarget
		Ref.MoveNear(akTarget, positionVal, distanceVal, facingVal)
		return True
	Else
		return False
	EndIf
EndFunction


Faction Function TryToGetCrimeFaction()
	Faction crimeFaction
	Actor actorRef = GetActorRef()
	if actorRef
		crimeFaction = actorRef.GetCrimeFaction()
	Else
		SpaceshipReference shipRef = GetShipRef()
		if shipRef
			crimeFaction = shipRef.GetCrimeFaction()
		endif
	EndIf
	return crimeFaction
EndFunction

; kmk - first clears, then refills alias (so alias will be empty if nothing is found by RefillAlias call)
Function ClearAndRefillAlias()
	Clear()
	RefillAlias()
endFunction

; Event received when an object has been added/removed to this referencealias 
Event OnAliasChanged(ObjectReference akObject, bool abRemove)
EndEvent

; The following events are received if the object the alias points at receives the events:

;------------------------------------------------------------------------------
; Events from object references below
;------------------------------------------------------------------------------

; Event received when this reference is activated
Event OnActivate(ObjectReference akActionRef)
EndEvent

; Event received when the produced resource on an Workshop producer/builder has changed.
Event OnBuilderMenuSelect(ActorValue akActorValue)
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

; Event received when an item is added to this object's inventory. If the item is a persistant reference, akItemReference will
; point at it - otherwise the parameter will be None. For valid Transfer Reasons please refer to the wiki.
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

; Received when this map marker is discovered
Event OnMapMarkerDiscovered()
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
Event OnPlayerDialogueTarget()
EndEvent

; Event received when a workshop item receives power
Event OnPowerOn(ObjectReference akPowerGenerator)
EndEvent

; Event received when a workshop loses all power
Event OnPowerOff()
EndEvent

; Received if the quick container opens
Event OnQuickContainerOpened()
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

; Received when this object is scanned
Event OnScanned()
EndEvent

; Event received when this reference is sold by an actor
Event OnSell(Actor akSeller)
EndEvent

; Event received when a spell is cast by this object
Event OnSpellCast(Form akSpell)
EndEvent

; Received if terminal object has menu item clicked
Event OnTerminalMenuItemRun(int auiMenuItemID, TerminalMenu akTerminalBase, ObjectReference akTerminalRef)
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

; Event that iakNewLinkRefs triggered when the target for a cargo link on workshop item changes.
Event OnWorkshopCargoLinkChanged(ObjectReference akOldTarget, ObjectReference akNewTarget)
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

;------------------------------------------------------------------------------
; Events from actors only below
;------------------------------------------------------------------------------

; Event received when this actor activates a ref
Event OnActorActivatedRef(ObjectReference akActivatedRef)
EndEvent

; Event received when affinity event is run
Event OnAffinityEvent(AffinityEvent akAffinityEvent, ActorValue akActorValue, GlobalVariable akReactionValue, ObjectReference akTarget)
EndEvent

; Event that is triggered when this actor adds another actor to its combat list.
Event OnCombatListAdded(Actor akTarget)
EndEvent

; Event that is triggered when this actor removes another actor from its combat list.
Event OnCombatListRemoved(Actor akTarget)
EndEvent

; Event that is triggered when this actor's combat state against the target changes
; State is as follows:
; 0 - not in combat
; 1 - in combat
; 2 - searching
Event OnCombatStateChanged(ObjectReference akTarget, int aeCombatState)
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
Event OnCommandModeCompleteCommand(int aeCommandType, ObjectReference akTarget)
EndEvent

; Event received when the player begins commanding this object
Event OnCommandModeEnter()
EndEvent

; Event received when the player ends commanding this object
Event OnCommandModeExit()
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
Event OnCommandModeGiveCommand(int aeCommandType, ObjectReference akTarget)
EndEvent

; Received when player dismisses teammate companion
Event OnCompanionDismiss()
EndEvent

; Event that is triggered when this actor's consciousness state changes
Event OnConsciousnessStateChanged(bool abUnconscious)
EndEvent

; Event received when a reference has a crew member assigned.
Event OnCrewAssigned(Actor akCrew, ObjectReference akAssignmentRef, ObjectReference akPreviousAssignmentRef)
EndEvent

; Event received when a reference has a crew member dismissed.
Event OnCrewDismissed(Actor akCrew, ObjectReference akPreviousAssignmentRef)
EndEvent

;Recieved immeadiately after a limb has become crippled or uncrippled.
Event OnCripple(ActorValue akActorValue, bool abCrippled)
EndEvent

; Event that is triggered when this actor gets a deferred kill added
; (they were in deferred kill mode and got "killed")
Event OnDeferredKill(Actor akKiller)
EndEvent

; Event that is triggered when this actor finishes dying (only if this alias points at an actor)
Event OnDeath(ObjectReference akKiller)
EndEvent

; Event received when the player changes their difficulty
; Type is as follows:
; 0 - Very Easy
; 1 - Easy
; 2 - Normal
; 3 - Hard
; 4 - Very Hard
; 5 - Survival
Event OnDifficultyChanged(int aOldDifficulty, int aNewDifficulty)
EndEvent

; Event that is triggered when this actor begins dying (only if this alias points at an actor)
Event OnDying(ObjectReference akKiller)
EndEvent

; Event that is triggered when an actor has been "killed" with EM weapons (the actor is still alive)
Event OnUnconscious(ObjectReference akAttacker)
EndEvent   

; Event received when an actor enters bleedout. (only if this alias points at an actor)
Event OnEnterBleedout()
EndEvent

; Event received when the player enters Outpost Beacon placeement mode.
Event OnEnterOutpostBeaconMode()
EndEvent

; Event received when an actor enters a ship interior cell
Event OnEnterShipInterior(ObjectReference akShip)
EndEvent

; Event received when an actor enters sneaking.
Event OnEnterSneaking()
EndEvent

; Event received when this actor is in an Escort procedure and begins waiting for the escorted actor to catch up.
Event OnEscortWaitStart()
EndEvent

; Event received when this actor is in an Escort procedure and stops waiting because the escorted actor has caught up.
Event OnEscortWaitStop()
EndEvent

; Event received when an actor exits a ship interior cell
Event OnExitShipInterior(ObjectReference akShip)
EndEvent

; Event received when a player follower is warped
Event OnPlayerFollowerWarp(ObjectReference akFollower)
EndEvent

; Event that is triggered when this actor leaves the furniture
Event OnGetUp(ObjectReference akFurniture)
EndEvent

; Event that is triggered when the actors home ship is set.
Event OnHomeShipSet(SpaceshipReference akShip, SpaceshipReference akPrevious)
EndEvent

; Event that is triggered when the player is arrested.
Event OnPlayerArrested(ObjectReference akGuard, Location akLocation, int aeCrimeType )
EndEvent

; Event that is triggered when the player assaults someone.
Event OnPlayerAssaultActor(ObjectReference akVictim, Location akLocation, bool aeCrime )
EndEvent

; Event received when the player plots a failed starmap route
; Type is as follows:
; 0 - Success
; 1 - Insufficient Fuel
; 2 - Out of Range
; 3 - Unexplored System
Event OnPlayerFailedPlotRoute(int aeFailedPlotReason)
EndEvent

; Event that is triggered when an actor modifies a ship
Event OnPlayerModifiedShip(SpaceshipReference akShip)
EndEvent

; Event received when this actor equips something - akReference may be None if object is not persistent (only if this alias points at an actor)
Event OnItemEquipped(Form akBaseObject, ObjectReference akReference)
EndEvent

; Event received when this actor unequips something - akReference may be None if object is not persistent (only if this alias points at an actor)
Event OnItemUnequipped(Form akBaseObject, ObjectReference akReference)
EndEvent

; Event that is triggered when this actor kills another
Event OnKill(ObjectReference akVictim)
EndEvent

; Event that is triggered when this actor changes from one location to another (only if this alias points at an actor)
Event OnLocationChange(Location akOldLoc, Location akNewLoc)
EndEvent

; Received when player placed an outpost beacon
Event OnOutpostPlaced(ObjectReference akOutpostBeacon)
EndEvent

; Event received when this actor's package changes (only if this alias points at an actor)
Event OnPackageChange(Package akOldPackage)
EndEvent

; Event received when this actor's package ends (only if this alias points at an actor)
Event OnPackageEnd(Package akOldPackage)
EndEvent

; Event received when this actor starts a new package (only if this alias points at an actor)
Event OnPackageStart(Package akNewPackage)
EndEvent

;Recieved immeadiately after the limb of a robot (or other actor whose race allows sub-segment damage) has become (or ceased to be) partially crippled.
Event OnPartialCripple(ActorValue akActorValue, bool abCrippled)
EndEvent

; Event received when an actor picks a lock
Event OnPickLock(ObjectReference akLockedRef, bool abCrime, bool abSucceeded, TerminalMenu akLockedTerminalMenu, int aiTerminalMenuItem)
EndEvent

;Received when the player fails to pickpocket this actor
Event OnPickpocketFailed()
EndEvent

; Event that is triggered when the player buys a ship
Event OnPlayerBuyShip(SpaceshipReference akShip)
EndEvent

; Received when player completes research
Event OnPlayerCompleteResearch(ObjectReference akBench, Location akLocation, ResearchProject akProject)
EndEvent

; Received when player crafts an item
Event OnPlayerCraftItem(ObjectReference akBench, Location akLocation, Form akCreatedItem)
EndEvent

; Received when player creates a new robot
Event OnPlayerCreateRobot(Actor akNewRobot)
EndEvent

; Event that is triggered when the player gets crimegold .
Event OnPlayerCrimeGold(ObjectReference akVictim, Form akFaction, int aeCrimeGold, int aeCrimeType )
EndEvent

; Received when player enters vertibird
Event OnPlayerEnterVertibird( ObjectReference akVertibird)
EndEvent

; Received when player takes fall damage
Event OnPlayerFallLongDistance(float afDamage)
EndEvent

; Received when player fires a weapon out of combat and based on timer
Event OnPlayerFireWeapon(Form akBaseObject)
EndEvent

; Event that is triggered when the player goes to jail.
Event OnPlayerJail(ObjectReference akGuard, Form akFaction,  Location akLocation,int aeCrimeGold)
EndEvent

; Received when player heals his teammate
Event OnPlayerHealTeammate(Actor akTeammate)
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
Event OnPlayerItemAdded(Form akBaseObject, ObjectReference akOwner, ObjectReference akSourceContainer, int aeAcquireType)
EndEvent

; Received immediately after the player has loaded a save game. A good time to check for additional content.
Event OnPlayerLoadGame()
EndEvent

; Received when player starts loitering
Event OnPlayerLoiteringBegin()
EndEvent

; Received when player stops loitering
Event OnPlayerLoiteringEnd()
EndEvent

; Received when player mods a weapon or armor in the menu.
Event OnPlayerModArmorWeapon(Form akBaseObject, ObjectMod akModBaseObject)
EndEvent

; Received when the player mods a robot
Event OnPlayerModRobot(Actor akRobot, ObjectMod akModBaseObject)
EndEvent

; Event that is triggered when the player murders someone.
Event OnPlayerMurderActor(ObjectReference akVictim, Location akLocation, bool aeCrime )
EndEvent

; Event that is triggered when the player pays fine.
Event OnPlayerPayFine(ObjectReference akGuard, Form akFaction, int aeCrimeGold)
EndEvent

; Event that is triggered when the player sells a ship
Event OnPlayerSellShip(SpaceshipReference akShip)
EndEvent

; Received when player starts swimming
Event OnPlayerSwimming()
EndEvent

; Event that is triggered when the player trespassing.
Event OnPlayerTrespass(ObjectReference akVictim, Location akLocation, bool aeCrime)
EndEvent

; Received when player uses a workbench
Event OnPlayerUseWorkBench( ObjectReference akWorkBench)
EndEvent

; Event received when this actor finishes changing its race
Event OnRaceSwitchComplete()
EndEvent

; Event received when an actor exits bleedout. (only if this alias points at an actor)
Event OnRecoverFromBleedout()
EndEvent

; Event that is triggered when this actor sits in the furniture
Event OnSit(ObjectReference akFurniture)
EndEvent

; Received when player gets a speech challenge in dialogue
Event OnSpeechChallengeAvailable(ObjectReference akSpeaker)
EndEvent

; Received when player completely surveyed a planet
Event OnPlayerPlanetSurveyComplete(Planet akPlanet)
EndEvent

; Received by the player when they scan an object
Event OnPlayerScannedObject(ObjectReference akScannedRef)
EndEvent

;------------------------------------------------------------------------------
; Events from spaceships only below
;------------------------------------------------------------------------------

; Event received when a ship initiates and completes docking with a parent
Event OnShipDock(bool abComplete, SpaceshipReference akDocking, SpaceshipReference akParent)
EndEvent

; Event received when a ship begins or ends far travel - State { Departure = 0, Arrival = 1 }
Event OnShipFarTravel(Location aDepartureLocation, Location aArrivalLocation, int aState)
EndEvent

; Event received when a ship grav jump event occurs - State { Initiated = 0, AnimStarted = 1, Completed = 2, Failed = 3 }
Event OnShipGravJump(Location aDestination, int aState)
EndEvent

; Event received when a ship initiates or completes landing
Event OnShipLanding(bool abComplete)
EndEvent

; Event recieved when a ship's landing ramp has lowereed all the way and connected to the surrounding navmesh
Event OnShipRampDown()
EndEvent

; Event that is triggered when the player scans a planet with this spaceship
Event OnShipScan(Location aPlanet, ObjectReference[] aMarkersArray)
EndEvent

; Event received when a ship system adds or removes power
Event OnShipSystemPowerChange(ActorValue akSystem,bool abAddPower, bool abDamageRelated)
EndEvent

; Event received when a ship initiates or completes takeoff
Event OnShipTakeOff(bool abComplete)
EndEvent

; Event received when a ship initiates or completes undocking with a parent
Event OnShipUndock(bool abComplete, SpaceshipReference akUndocking, SpaceshipReference akParent)
EndEvent

; Event that is triggered when one of this spaceship's systems loses a power block due to damage
Event OnShipSystemDamaged(ActorValue akSystem, int aBlocksLost, bool aElectromagneticDamage, bool aFullyDamaged)
EndEvent

; Event that is triggered when one of this spaceship's systems gains a power block due to being repaired
Event OnShipSystemRepaired(ActorValue akSystem, int aBlocksGained, bool aElectromagneticDamage)
EndEvent

; Event that is triggered when fuel has been added to this spaceship
Event OnShipRefueled(int aFuelAdded)
EndEvent

; Event this is triggered when a ship is bought
Event OnShipBought()
EndEvent

; Event this is triggered when a ship is sold
Event OnShipSold()
EndEvent