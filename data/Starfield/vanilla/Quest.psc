Scriptname Quest extends Form Native Hidden

; non-native functions

; thread-safe way to modify a global value
; optional parameters:
; aiObjectiveID = objective ID to redisplay
; afTargetValue = value you're counting up (or down) towards -- if included, function will return TRUE when the global reaches the target value
; abCountingUp = by default, function assumes you're counting up towards the target value; make this false to count DOWN towards target value
; abCompleteObjective = by default, function assumes you're completing the objective once you reach the target value; make this false to FAIL the objective
; abRedisplayObjective = by default, function asssume you want to redisplay the objective every time the global is incremeneted; make this FALSE to only display the objectives on complete or failure
; abAllowRollbackObjective = by default, function assumes you do not want to rollback a completed objective; make this TRUE to reopen an already completed objective if aModGlobal goes below/above target value
bool Function ModObjectiveGlobal(float afModValue, GlobalVariable aModGlobal, int aiObjectiveID = -1, float afTargetValue = -1.0, bool abCountingUp = true, bool abCompleteObjective = true, bool abRedisplayObjective = true, bool abAllowRollbackObjective = false)
	aModGlobal.Mod(afModValue)
	UpdateCurrentInstanceGlobal(aModGlobal)
	debug.trace(self + " ModObjectiveGlobal: " + aModGlobal + "=" + aModGlobal.value + ", afTargetValue=" + afTargetValue + ", abAllowRollbackObjective=" + abAllowRollbackObjective)
	if aiObjectiveID >= 0
		; display/complete objectives automatically
		if afTargetValue > -1
			if (abCountingUp && aModGlobal.value >= afTargetValue) || (!abCountingUp && aModGlobal.value <= afTargetValue)
				if (abCompleteObjective)
					;debug.trace(self + " ModObjectiveGlobal: complete objective " + aiObjectiveID)
					; complete objective
					SetObjectiveCompleted(aiObjectiveID)
					return true
				Else
					;debug.trace(self + " ModObjectiveGlobal: fail objective " + aiObjectiveID)
					; fail objective
					SetObjectiveFailed(aiObjectiveID)
					return true
				Endif
			else
				; rollback objective if completed and that's allowed
				if abAllowRollbackObjective && IsObjectiveCompleted(aiObjectiveID)
					debug.trace(self + " ModObjectiveGlobal: rollback objective " + aiObjectiveID)
					SetObjectiveCompleted(aiObjectiveID, false)
				endif
				If (abRedisplayObjective)
					; redisplay objective
					SetObjectiveDisplayed(aiObjectiveID, true, true)
				Else
					SetObjectiveDisplayed(aiObjectiveID, true, false)
				endif
			endif
		elseIf (abRedisplayObjective)
			; no target value, always redisplay objective
			SetObjectiveDisplayed(aiObjectiveID, true, true)
		Else
			SetObjectiveDisplayed(aiObjectiveID, true, false)
		endif
	Else
		;if no objective is given, then we just want to know when the count has been reached
		if (abCountingUp && aModGlobal.value >= afTargetValue) || (!abCountingUp && aModGlobal.value <= afTargetValue)
			return true
		EndIf
	endif
	return false
endFunction

; kmk- for testing - sets all stages up to lastStage
function SetAllStages(int lastStage)
	int i = 0
	while i <= lastStage
		setStage(i)
		i+=1
	endWhile
endFunction

struct QuestStage
	Quest QuestToSet
	int StageToSet
endStruct

function SetQuestStage(QuestStage questStageToSet) global
	questStageToSet.QuestToSet.SetStage(questStageToSet.StageToSet)
endFunction

bool function GetQuestStageDone(QuestStage questStageToCheck) global
	return questStageToCheck.QuestToSet.GetStageDone(questStageToCheck.StageToSet)
endFunction

; WJS - function to handle objectives that might have been skipped over. For now, hide them
Function SetObjectiveSkipped(int aiObjectiveID)
	If IsObjectiveCompleted(aiObjectiveID) == false
		SetObjectiveDisplayed(aiObjectiveID, abDisplayed =False)
	Endif
EndFunction


;jduvall - convenience function - uncompletes, unfails and displays the objective
Function SetObjectiveActive(int aiObjective,  bool abForceRedisplay = true)
	;int 	aiObjective 			the objective id to display
;bool 	abForceRedisplay 		should the objective be re-displayed (if already)? (default: true)

	if IsObjectiveFailed(aiObjective)
		SetObjectiveFailed(aiObjective, false)
	endif
	if IsObjectiveCompleted(aiObjective)
		SetObjectiveCompleted(aiObjective, false)
	endif

	SetObjectiveDisplayed(aiObjective, abForce = abForceRedisplay)

EndFunction

; native functions

; Flags all objectives as complete
Function CompleteAllObjectives() native

; Flags this quest as completed
Function CompleteQuest() native

; Flags all objectives as failed
Function FailAllObjectives() native

; Obtains the specified alias on the quest
Alias Function GetAlias(int aiAliasID) native

; Obtains the id of the highest completed stage on this quest
int Function GetCurrentStageID() native

; Returns the array of object reference targets pertinent to the current quest stage
ObjectReference[] Function GetCurrentStageTargets() native

; Alias for GetCurrentStage - obtains the highest completed stage on this quest
int Function GetStage()
  return GetCurrentStageID()
EndFunction

;gets the remaining time for the quest timer if any
float Function GetQuestTimeRemaining() native

; Alias for IsStageDone - checks to see whether the given stage is done or not
bool Function GetStageDone(int aiStage)
  return IsStageDone(aiStage)
EndFunction

; Checks to see if the specified objective exists on the quest
bool Function HasObjective(int aiObjective) native

; Is this quest "active" (tracked by the player)?
bool Function IsActive() native

; Checks to see if the quest is completed
bool Function IsCompleted() native

; Checks to see if the specified objective is completed
bool Function IsObjectiveCompleted(int aiObjective) native

; Checks to see if the specified objective is displayed
bool Function IsObjectiveDisplayed(int aiObjective) native

; Checks to see if the specified objective is failed
bool Function IsObjectiveFailed(int aiObjective) native

; Sets the specified objective to be displayed at the top of the player's objective list
Function SetObjectiveDisplayedAtTop(int aiObjective) native

;Checks if the quest timer is paused; returns true if paused otherwise false which means the timer is running
bool Function IsQuestTimerPaused() native

; Checks to see if the quest is running
bool Function IsRunning() native

; Obtains whether the specified stage is done or not
bool Function IsStageDone(int aiStage) native

; Checks to see if the quest is enabled but not running yet
bool Function IsStarting() native

; Checks to see if the quest is not enabled anymore but still shutting down
bool Function IsStopping() native

; Checks to see if the quest is no longer enabled or running
bool Function IsStopped() native

; Modifies a quest timer
; The timer is modified by the given afModValue can be negative or positive but not 0
Function ModQuestTimer(float afModValue) native

;Pauses the quest timer if abPause is true, resumes it if false. If the timer was already in the requested state nothing happens.
Function PauseQuestTimer(bool abPause = true) native

;Removes PCM locations requested by this quest.
Function RemoveRequestedPCMQuestLocations() native

; Resets the quest
Function Reset() native

; Flags this quest as "active" (tracked by the player)
Function SetActive(bool abActive = true) native

; Set the quest to the requested stage ID - returns true if stage exists and was set.
; This function is latent and will wait for the quest to start up before returning (if it needed to be started)
bool Function SetCurrentStageID(int aiStageID) native

; Sets the specified objective to completed or not
Function SetObjectiveCompleted(int aiObjective, bool abCompleted = true) native

; Sets the specified objective to displayed or hidden - if abForce is true, will display the objective even if it has already been displayed
Function SetObjectiveDisplayed(int aiObjective, bool abDisplayed = true, bool abForce = false) native

; Sets the specified objective to failed or not
Function SetObjectiveFailed(int aiObjective, bool abFailed = true) native

; jduvall - convenience function
; fails the objective if it's not completed
Function SetObjectiveFailedIfNotCompleted(int aiObjective)
	if IsObjectiveCompleted(aiObjective) == false
		SetObjectiveFailed(aiObjective)
	endif
EndFunction

; Alias of SetCurrentStage - Set the quest to the requested stage
; This function is latent and will wait for the quest to start up before returning (if it needed to be started)
bool Function SetStage(int aiStage)
  return SetCurrentStageID(aiStage)
EndFunction

; Sets the quest to the requested stage. Will NOT wait for the quest to start up, or for fragments to run. As such, it cannot return whether
; the stage was set or not, unlike SetStage or SetCurrentStageID
Function SetStageNoWait(int aiStage) native

; Starts the quest - returns whether the quest was able to be started or not
; This function is latent and will wait for the quest to start up before returning
bool Function Start() native

; Starts the quest - returns whether the quest was able to be started or not
; This function does not wait for aliases to fill or fragments to run and returns immediately
bool Function StartNoWait() native

;Starts this quests timer with the given time or the time saved on the quest itself if none was given.
;Will reset the timer with the new time if the timer was running.
Function StartQuestTimer(float afTimeInHours = -1.0) native

; Stops the quest
Function Stop() native

;stop the running quest timer
;Will trigger OnQuestTimerEnd
Function StopQuestTimer() native

; Updates current instance's value for the given global
bool Function UpdateCurrentInstanceGlobal( GlobalVariable aUpdateGlobal ) native

; Event received when a mission-type quest is accepted via the mission board
Event OnMissionAccepted()
EndEvent

; Event received when the quest is initalized, aliases are filled, and it is about to run the startup stage
Event OnQuestInit()
EndEvent

; Event received when the quest has been shut down
; Note that the aliases will be empty by the time this event is received
Event OnQuestShutdown()
EndEvent

; Event received when the quest has been started
Event OnQuestStarted()
EndEvent

;Event received when the quest is rejected
Event OnQuestRejected()
EndEvent

;aiReason values for OnQuestTimer***** are 0=timer expired, 1=stage triggered, 2=script
;Event received when the quest timer has started
Event OnQuestTimerStart(int aiReason)
EndEvent

;Event received when the quest timer has ended
Event OnQuestTimerEnd(int aiReason)
EndEvent

;Event received when the quest timer has been paused
Event OnQuestTimerPause(int aiReason)
EndEvent

;Event received when the quest timer has resumed
Event OnQuestTimerResume(int aiReason)
EndEvent

;Event received when the quest timer has be modded
Event OnQuestTimerMod(int aiReason)
EndEvent

; Event received when the quest owning this alias is reset
Event OnReset()
EndEvent

; Event received when a quest stage is set (in parallel with the fragment)
Event OnStageSet(int auiStageID, int auiItemID)
EndEvent

; Event called when a speech challenge is completed (won or lost).
Event OnSpeechChallengeCompletion(SpeechChallengeObject akSpeechChallenge, bool abSuccess)
EndEvent

; Story manager events - fired in parallel with the quest startup stage

Event OnStoryActivateActor(Location akLocation, ObjectReference akActor)
EndEvent

Event OnStoryActorAttach(ObjectReference akActor, Location akLocation)
EndEvent

Event OnStoryAddToPlayer(ObjectReference akOwner, ObjectReference akContainer, \
	Location akLocation, Form akItemBase, int aiAcquireType, int aiValue)
EndEvent

Event OnStoryArrest(ObjectReference akArrestingGuard, ObjectReference akCriminal, \
	Location akLocation, int aiCrime)
EndEvent

Event OnStoryAssaultActor(ObjectReference akVictim, ObjectReference akAttacker, \
	Location akLocation, bool abCrime)
EndEvent

Event OnStoryAttractionObject(ObjectReference akActor, ObjectReference akObject, \
	Location akLocation, bool abCommanded)
EndEvent

Event OnStoryBribeNPC(ObjectReference akActor, int aiAmount)
EndEvent

Event OnStoryCastMagic(ObjectReference akCastingActor, ObjectReference akSpellTarget, \
	Location akLocation, Form akSpell)
EndEvent

Event OnStoryChangeLocation(ObjectReference akActor, Location akOldLocation, \
	Location akNewLocation)
EndEvent

Event OnStoryExploredLocation(Location akOldLocation)
EndEvent

Event OnStoryCraftItem(ObjectReference akBench, Location akLocation, Form akCreatedItem)
EndEvent

Event OnStoryCrimeGold(ObjectReference akVictim, ObjectReference akCriminal, \
	Form akFaction, int aiGoldAmount, int aiCrime)
EndEvent

Event OnStoryCure(Form akInfection)
EndEvent

Event OnStoryDialogue(Location akLocation)
EndEvent

Event OnStoryDiscoverDeadBody(ObjectReference akActor, ObjectReference akDeadActor, \
	Location akLocation)
EndEvent

Event OnStoryEscapeJail(Location akLocation, Form akCrimeGroup)
EndEvent

Event OnStoryFlatterNPC(ObjectReference akActor)
EndEvent

Event OnStoryHackTerminal(ObjectReference akComputer, bool abSucceeded)
EndEvent

Event OnStoryHello(Location akLocation, ObjectReference akActor1, ObjectReference akActor2)
EndEvent

Event OnStoryIncreaseLevel(int aiNewLevel)
EndEvent

Event OnStoryInfection(ObjectReference akTransmittingActor, Form akInfection)
EndEvent

Event OnStoryIntimidateNPC(ObjectReference akActor)
EndEvent

Event OnStoryIronSights(ObjectReference akActor, Form akWeapon)
EndEvent


Event OnStoryJail(ObjectReference akGuard, Form akCrimeGroup, Location akLocation, \
	int aiCrimeGold)
EndEvent

Event OnStoryKillActor(ObjectReference akVictim, ObjectReference akKiller, \
	Location akLocation, int aiCrimeStatus, int aiRelationshipRank)
EndEvent

Event OnStoryLocationLoaded(Location akLocation)
EndEvent

Event OnStoryMineExplosion(ObjectReference akVictim, ObjectReference akAttacker)
EndEvent

Event OnStoryNewVoicePower(ObjectReference akActor, Form akVoicePower)
EndEvent

Event OnStoryPayFine(ObjectReference akCriminal, ObjectReference akGuard, \
	Form akCrimeGroup, int aiCrimeGold)
EndEvent

Event OnStoryPickLock(ObjectReference akActor, ObjectReference akLock, bool abCrime)
EndEvent

Event OnStoryPickPocket(ObjectReference akVictim, bool abSuccess)
EndEvent

Event OnStoryPiracyActor(ObjectReference akVictim, ObjectReference akAttacker, \
	Location akLocation, bool abCrime)
EndEvent

Event OnStoryPlayerGetsFavor(ObjectReference akActor)
EndEvent

Event OnStoryRelationshipChange(ObjectReference akActor1, ObjectReference akActor2, \
	int aiOldRelationship, int aiNewRelationship)
EndEvent

Event OnStoryRemoveFromPlayer(ObjectReference akOwner, ObjectReference akItem, \
	Location akLocation, Form akItemBase, int aiRemoveType, int aiValue)
EndEvent

Event OnStoryScript(Keyword akKeyword, Location akLocation, ObjectReference akRef1, \
	ObjectReference akRef2, int aiValue1, int aiValue2)
EndEvent

Event OnStoryServedTime(Location akLocation, Form akCrimeGroup, int aiCrimeGold, \
	int aiDaysJail)
EndEvent

Event OnStoryShipDock(ObjectReference akDockingShip, ObjectReference akDockTargetShip, \
	bool abDocking)
EndEvent

Event OnStoryShipLanding(ObjectReference akLandingShip, ObjectReference akLandingMarker)
EndEvent

Event OnStorySpeechChallengeCompletion(SpeechChallengeObject akChallenge, bool abSuccess)
EndEvent

Event OnStoryTrespass(ObjectReference akVictim, ObjectReference akTrespasser, \
	Location akLocation, bool abCrime)
EndEvent

