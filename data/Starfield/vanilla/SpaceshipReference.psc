Scriptname SpaceshipReference extends ObjectReference Native Hidden

;Adds the specified perk to this actor
Function AddPerk(Perk akPerk, bool abNotify=false) native

; Adds this spaceship to a faction at rank 0 if they aren't already in it
Function AddToFaction(Faction akFaction)
    if (!IsInFaction(akFaction))
        SetFactionRank(akFaction, 0)
    endif
EndFunction

; Tests if the spaceship is allowed to land at the given marker based on the maximum allowed ship size.
bool Function CanLandAtMarker(ObjectReference akLandingMarker) native

; Retrieves the ships contraband status. (Only checks ships cargo if abCheckWholeShip is false)
; -1 - Below shielded inventory limit
;  0 - At shielded inventory limit
;  1 - Above shielded inventory limit
int Function CheckContrabandStatus(bool abCheckWholeShip = true) native

; disable this spaceship with grav jump FX
Function DisableWithGravJump() native

; disable this spaceship with grav jump FX. Does NOT wait for the FX to finish
Function DisableWithGravJumpNoWait() native

; disable this spaceship after playing a takeoff or landing animation (whichever is appropriate)
Function DisableWithTakeOffOrLanding() native

; disable this spaceship after playing a takeoff or landing animation (whichever is appropriate). Does NOT wait for the animation to complete
Function DisableWithTakeOffOrLandingNoWait() native

; Enable/disable repairing the spaceship part associated with the given System Health actor value
; If no part is specified, all the parts will be affected
;pass true to enable repairing the part(s), false to disable it
Function EnablePartRepair(ActorValue aSystemHealth, bool abEnable = true) native

;evaluate this spaceships packages.
Function EvaluatePackage(bool abResetAI = false) native

;enable or disable the AI for this ship
Function EnableAI(bool abEnable = true, bool abPauseVoice = false) native

; enable this spaceship with grav jump FX
bool Function EnableWithGravJump() native

; enable this spaceship with grav jump FX - does not wait for 3d to load
bool Function EnableWithGravJumpNoWait() native

; enable this spaceship and land it at its currently linked landing marker
bool Function EnableWithLanding() native

; enable this spaceship and land it at its currently linked landing marker. Does not wait for the animation to complete or the 3d to load
bool Function EnableWithLandingNoWait() native

; gets all the combat targets for this spaceship
SpaceshipReference[] Function GetAllCombatTargets() native

;gets the current combat target
SpaceshipReference Function GetCombatTarget() native

; Retrieves the ships contraband weight. (Only checks ships cargo if abCheckWholeShip is false)
float Function GetContrabandWeight(bool abCheckWholeShip = true) native

; Get the faction this ship reports crimes to
Faction Function GetCrimeFaction() native

; Gets this spaceships's current AI package
Package Function GetCurrentPackage() native

; Gets all exterior references for this spaceship which are load doors
ObjectReference[] Function GetExteriorLoadDoors() native

; Gets this spaceship's exterior references filtered by the given keyword
ObjectReference[] Function GetExteriorRefs(keyword apKeyword) native

; Obtains this spaceship's rank with the specified faction - returns -1 if the spaceship is not a member
int Function GetFactionRank(Faction akFaction) native

;returns the faction reation to the other actor
; 0 - Neutral
; 1 - Enemy
; 2 - Ally
; 3 - Friend
int Function GetActorFactionReaction(Actor akOtherActor) native

; Retrieve all the spaceships currently docked with this spaceship
SpaceshipReference[] Function GetDockedShips() native

;returns the faction reation to the other spaceship
; 0 - Neutral
; 1 - Enemy
; 2 - Ally
; 3 - Friend
int Function GetFactionReaction(SpaceshipReference akOther) native

; Retrieve the first spaceship docked with this spaceship, if any
SpaceshipReference Function GetFirstDockedShip() native

;get this ship's killer
ObjectReference Function GetKiller() native

; Gets all exterior references for this spaceship which are ramps
ObjectReference[] Function GetLandingRamps() native

;get the level of this spaceship
int Function GetLevel() native

;get the base object of this spaceship, either the created one for a leveled ship or the editor saved one for a non leveled ship.
SpaceshipBase Function GetLeveledSpaceshipBase() native

;get the no bleedout recovery status for this ship
bool Function GetNoBleedoutRecovery() native

;Gets the number of parts of a specific type
;valid aiShipPartIDs 0 - Weapons, 1 - Engine, 2 - Shields, 3 - Gravdrive, 4 - Generator
int Function GetPartCount(int aiShipPartID) native

;Gets the amount of power allocated to a given part
;valid aiShipPartIDs 0 - Weapons, 1 - Engine, 2 - Shields, 3 - Gravdrive, 4 - Generator
int Function GetPartPower(int aiShipPartID, int aiShipPartIndex) native

;Gets the spaceships maximum weight capacity by summing normal and shielded cargo capacity.
float Function GetShipMaxCargoWeight() native

; Returns the weapon associated with a weapon group part
Weapon Function GetWeaponGroupBaseObject(ActorValue aWeaponGroupSystemHealth) native

; Checks to see if this speaceship has the given Perk
bool Function HasPerk(Perk akPerk) native

;Instantly docks the spaceship with a target which can be another ship or a docking port
bool Function InstantDock(ObjectReference akTarget) native

;Instantly undocks a spaceship
Function InstantUndock() native

; Returns whether this spaceship's AI is enabled.
bool Function IsAIEnabled() native

; Returns if this spaceship is alarmed or not
bool Function IsAlarmed() native

; Returns if this spaceship is alerted or not
bool Function IsAlerted() native

;check if this spaceship is dead
bool Function IsDead() native

; Returns if this spaceship is detected by the other one
bool Function IsDetectedBy(SpaceshipReference akOther) native

; Get whether this spaceship is currently docked
bool Function IsDocked() native

; Get whether this spaceship is currently docked with a given target
bool Function IsDockedWith(SpaceshipReference akTarget) native

; Get whether this spaceship is docked as a child
bool Function IsDockedAsChild() native

;get if this spaceship is considered essential
;Included actors are anyone in the ship's interior or exterior
bool Function IsEssential(bool abIncludeActors = true) native 

;check if the ship is set to be a ghost
bool Function IsGhost() native

; Is this spaceship hostile to another spaceship?
bool Function IsHostileToSpaceship(SpaceshipReference akSpaceship) native

;check if the ship is in combat.
bool Function IsInCombat() native

; Checks to see if this spaceship is a member of the specified faction
bool Function IsInFaction(Faction akFaction) native

;check if this spaceship is in a scene
bool Function IsInScene() native

;check if this spaceship is landed
bool Function IsLanded() native

;get if this spaceship is considered protected
;Included actors are anyone in the ship's interior or exterior
bool Function IsProtected(bool abIncludeActors = true) native

;check if this spaceship's ramp is connected to the surrounding navmesh yet
bool Function IsRampDown() native

;kill this ship with akKiller as the source of the kill
Function Kill(SpaceshipReference akKiller = none) native

;kill this ship with akKiller as the source of the kill even if the ship or any on board actors are essential.
Function KillEssential(SpaceshipReference akKiller = none) native

;kill this ship with akKiller as the source of the kill but do not generate story events
Function KillSilent(SpaceshipReference akKiller = none) native

;modifies the faction rank by the given amount
Function ModFactionRank(Faction akFaction, int aiAmount) native

; Pop this spaceship to the initial location for a package. 
Function MoveToPackageLocation( ) native

; Opens this ship's inventory.
Function OpenInventory() native

;Lock the power allocation of a specific part to keep the AI from modifying it
;valid aiShipPartIDs 0 - Weapons, 1 - Engine, 2 - Shields, 3 - Gravdrive, 4 - Generator
;pass -1 to aiShipPartIndex to lock/unlock the power of all the parts of the specified type
;This will also keep the AI from repairing a damaged part
Function LockPowerAllocation(int aiShipPartID, int aiShipPartIndex, bool abLock = true) native

; Make the spaceship attempt to path to a reference, latent version
; Note: this method doesn't return until the goal is reached or pathing
; failed or was interrupted (by another request for instance)
; Return values (see Actor for PathingResult properties):
; 0 - Success
; 1 - Failure
; 2 - Stopped
; 3 - Cleared
; 4 - Timeout
int Function PathToReference(ObjectReference aTarget, float afNormalizedSpeed, float afNormalizedRotationSpeed, float afTargetRadius=-1.0, bool abHardRadius=false) native

;remove the ship from the all factions
Function RemoveFromAllFactions() native

;remove the ship from the given faction
Function RemoveFromFaction(Faction akFaction) native

; Removes the specified perk from this spaceship
Function RemovePerk(Perk akPerk) native

; Has this spaceship behave as if assaulted
Function SendAssaultAlarm() native

; Have the ship behave as if pirated
Function SendPiracyAlarm() native

; Have this spaceship behave as if they detected the player smuggling
Function SendSmugglingAlarm(bool abCheckWholeShip = true) native

; Sets the spaceship in an alerted state
Function SetAlert(bool abAlerted = true) native

; Sets this ship to be attacked by all other ships on sight
Function SetAttackShipOnSight(bool abAttackOnSight = true) native

; Tells pathing to avoid the player (which it already does by default) or not (for use in scenes where the player is meant to be an incorporeal observer).
Function SetAvoidPlayer(bool abAvoid = true) native

; Sets the combatstyle for this spaceship
Function SetCombatStyle(CombatStyle akCombatStyle) native

; Sets the faction this spaceship reports crimes to
Function SetCrimeFaction(Faction akFaction) native

;set if this spaceship is considered essential
Function SetEssential(bool abEssential) native

; Sets this spaceship's rank with the specified faction
Function SetFactionRank(Faction akFaction, int aiRank) native

;sets if this spaceship is a ghost
Function SetGhost(bool abIsGhost = true) native

;set the no bleedout recovery status for this ship; pass true to prevent recovery
Function SetNoBleedoutRecovery(bool abBleedoutRecoveryNotAllowed = true) native

;Sets this spaceship to not effect the detection level on the stealth meter if they are not hostile to the player
Function SetNotShowOnStealthMeter(bool abNotShow = true) native

;Sets the amount of power allocated to a given part
;valid aiShipPartIDs 0 - Weapons, 1 - Engine, 2 - Shields, 3 - Gravdrive, 4 - Generator
;specify -1 for the aiShipPartIndex to set the power of all the parts of the specified type (such as weapons)
Function SetPartPower(int aiShipPartID, int aiShipPartIndex, int aiPower) native

; Sets the player as resisting arrest from this spaceships's faction
Function SetPlayerResistingArrest() native

;set if this spaceship is considered protected
Function SetProtected(bool abProtected) native

; Opens the Barter menu
Function ShowBarterMenu() native

;start combat with the given target
Function StartCombat(SpaceshipReference akTarget, bool abPreferTarget = false) native

;stops combat for this spaceship
Function StopCombat() native

; Stops all combat and alarms against this spaceship
Function StopCombatAlarm() native

; Force this spaceship to takeoff immediately (if it isn't in space)
Function TakeOff() native

; Set the forward velocity of the ship as a percentage of max speed(0-1)
Function SetForwardVelocity(float aVelocity) native

; Set the autopilot of the ship unonscious or conscious
Function SetUnconscious(bool aUnconscious) native

; Set the ship to ignore friendly hits
Function SetIgnoreFriendlyHits(bool aIgnoreFriendlyHits) native

; Gets the spaceships current max grav jump range in light years
float Function GetGravJumpRange() native

; Get this ship's reactor class keyword
Keyword Function GetReactorClassKeyword() native

; Event that is triggered when this spaceship's combat state against the target changes
; State is as follows:
; 0 - not in combat
; 1 - in combat
; 2 - searching
Event OnCombatStateChanged(ObjectReference akTarget, int aeCombatState)
EndEvent

; Event that is triggered when this ship's pilot adds another ship's pilot to its combat list.
Event OnSpaceshipCombatListAdded(SpaceshipReference akTarget)
EndEvent

; Event that is triggered when this ship's pilot removes another ship's pilot from its combat list.
Event OnSpaceshipCombatListRemoved(SpaceshipReference akTarget)
EndEvent

; Event received when a ship enters the essential down state.
Event OnEnterBleedout()
EndEvent

; Event received when this spaceship is in an Escort procedure and begins waiting for the escorted spaceship to catch up.
Event OnEscortWaitStart()
EndEvent

; Event received when this spaceship is in an Escort procedure and stops waiting because the escorted spaceship has caught up.
Event OnEscortWaitStop()
EndEvent

; Event that is triggered when this spaceship changes from one location to another
Event OnLocationChange(Location akOldLoc, Location akNewLoc)
EndEvent

; Event received when a ship exits the essential down state.
Event OnRecoverFromBleedout()
EndEvent

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

; Event that is triggered when fuel has been added to this spaceship
Event OnShipRefueled(int aFuelAdded)
EndEvent

; Event that is triggered when the player scans a planet with this spaceship
Event OnShipScan(Location aPlanet, ObjectReference[] aMarkersArray)
EndEvent

; Event received when a ship system adds or removes power
Event OnShipSystemPowerChange(ActorValue akSystem, bool abAddPower, bool abDamagedRelated)
EndEvent

; Event that is triggered when one of this spaceship's systems loses a power block due to damage
Event OnShipSystemDamaged(ActorValue akSystem, int aBlocksLost, bool aElectromagneticDamage, bool aFullyDamaged)
EndEvent

; Event that is triggered when one of this spaceship's systems gains a power block due to being repaired
Event OnShipSystemRepaired(ActorValue akSystem, int aBlocksGained, bool aElectromagneticDamage)
EndEvent

; Event received when a ship initiates or completes takeoff
Event OnShipTakeOff(bool abComplete)
EndEvent

; Event that is triggered when a spaceship dies
Event OnDeath(ObjectReference akKiller)
EndEvent

; Event that is triggered when a spaceship is dying
Event OnDying(ObjectReference akKiller)
EndEvent

; Event that is triggered when a spaceship kills another spaceship
Event OnKill(ObjectReference akVictim)
EndEvent

; Event received when a ship initiates or completes undocking with a parent
Event OnShipUndock(bool abComplete, SpaceshipReference akUndocking, SpaceshipReference akParent)
EndEvent

; Event this is triggered when a ship is bought
Event OnShipBought()
EndEvent

; Event this is triggered when a ship is sold
Event OnShipSold()
EndEvent

;scornett
;Is the ship's exterior load door inaccessible? (Checks the state of the first door found, if there are multiple.)
bool Function IsExteriorLoadDoorInaccessible()
    ObjectReference[] exteriorLoadDoors = GetExteriorLoadDoors()
    if (exteriorLoadDoors.Length == 0)
        return False
    Else
        return exteriorLoadDoors[0].IsDoorInaccessible()
    EndIf
EndFunction

;scornett
;Sets the ship's exterior load door(s) inaccessible.
Function SetExteriorLoadDoorInaccessible(bool abInaccessible = true)
    ObjectReference[] exteriorLoadDoors = GetExteriorLoadDoors()
    int i = 0
    While (i < exteriorLoadDoors.Length)
        if abInaccessible == true
            exteriorLoadDoors[i].SetLockLevel(254)
            exteriorLoadDoors[i].Lock()
        Else
            exteriorLoadDoors[i].Unlock()
        EndIf
        i = i + 1
    EndWhile
EndFunction

;scornett
;Are there any actors on the ship's exterior landing deck? (That is, any actors in the trigger encompassing the landing deck and ramp?) (Checks the state of the first deck found, if there are multiple.)
bool Function IsLandingDeckClear()
    ObjectReference[] exteriorLoadDoors = GetExteriorLoadDoors()
    if (exteriorLoadDoors.Length == 0)
        return True
    Else
        ObjectReference exteriorLandingDeckTrigger = exteriorLoadDoors[0].GetLinkedRef()
        if (exteriorLandingDeckTrigger == None)
            return True
        Else
            return exteriorLandingDeckTrigger.GetTriggerObjectCount() == 0
        EndIf
    EndIf
EndFunction
