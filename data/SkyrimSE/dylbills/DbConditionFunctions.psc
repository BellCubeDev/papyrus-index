scriptname DbConditionFunctions hidden

;This script allows you to create and run creation kit conditions directly from papyrus.
;Note that conditions created with this script are not saved to the save file, so you need to recreate them on load game. See example script below.
;When setting parameters, they must match the conditionFunction parameter types.
;Check the condition you're creating in the creation kit first to make sure you're setting the correct parameter types or you'll get ctds.
;For more info on conditions go here: https://ck.uesp.net/wiki/Condition_Functions

;create a new condition. ConditionId should be unique, so for example use "modPrefix_conditionName".
;int comparison options are: 
;0 = "==" 
;1 = "!="
;2 = ">" 
;3 = ">=" 
;4 = "<" 
;5 = "<="
;If the condition with the conditionId already exists, this will overwrite the condition with a new one. If overwritten, the params will have to be set again. 
;Use the ConditionExists function first to prevent this from happening.
;See below for the available int conditionFunctions.
function CreateCondition(string conditionId, int conditionFunction, int comparison = 0, float value = 1.0) Global Native

;Destroy the condition with the conditionId created with the CreateCondition function.
function DestroyCondition(string conditionId) Global Native

;Does the condition with the conditionId exist?
bool function ConditionExists(string conditionId) Global Native

;Set the nth parameter for the condition with the conditionId to the form param. paramIndex must be between 0 and 2.
bool function SetConditionParameterForm(string conditionId, form param, int paramIndex = 0) Global Native

;Set the nth parameter for the condition with the conditionId to the Alias param. paramIndex must be between 0 and 2.
bool function SetConditionParameterAlias(string conditionId, Alias param, int paramIndex = 0) Global Native

;Set the nth parameter for the condition with the conditionId to the Bool param. paramIndex must be between 0 and 2.
bool function SetConditionParameterBool(string conditionId, Bool param, int paramIndex = 0) Global Native

;Set the nth parameter for the condition with the conditionId to the Int param. paramIndex must be between 0 and 2.
bool function SetConditionParameterInt(string conditionId, Int param, int paramIndex = 0) Global Native

;Set the nth parameter for the condition with the conditionId to the Float param. paramIndex must be between 0 and 2.
bool function SetConditionParameterFloat(string conditionId, Float param, int paramIndex = 0) Global Native

;Set the nth parameter for the condition with the conditionId to the String param. paramIndex must be between 0 and 2.
bool function SetConditionParameterString(string conditionId, String param, int paramIndex = 0) Global Native

;Set the condition with the conditionId's comparison for the conditionId. 
;int comparison options are: 
;0 = "==" 
;1 = "!="
;2 = ">" 
;3 = ">=" 
;4 = "<" 
;5 = "<="
bool function SetConditionComparison(string conditionId, int comparison) Global Native

;Set the condition with the conditionId's comparison value.
bool function SetConditionValue(string conditionId, float value) Global Native 

;Run the condition with the conditionId on the optional target and evaluate. Return true if the condition is met.
bool function EvaluateCondition(string conditionId, ObjectReference target = none) Global Native 

;/Example script
I know that papyrus already has GetFactionRank, this was just an easy way to test these functions for proof of concept.
===================================================================================================================================================================================================================================================================================

Actor Property PlayerRef Auto
Faction Property TM_Faction Auto

Event OnInit()
	CreateConditions()
	Utility.wait(1)
	PlayerRef.SetFactionRank(TM_Faction, 1)
	bool FRA = IsFactionRankGreaterThan(PlayerRef, TM_Faction, 0) ;true
	bool FRB = IsFactionRankGreaterThan(PlayerRef, TM_Faction, 1) ;false
	bool FRC = IsFactionRankEqualTo(PlayerRef, TM_Faction, 1) ;true
	bool FRD = IsFactionRankEqualTo(PlayerRef, TM_Faction, 2) ;false
	Debug.MessageBox("Faction rank bools = " + FRA + " " + FRB + " " + FRC + " " + FRD)
EndEvent

;must recreate the condition on load game
Event OnLoadGameGlobal()
	CreateConditions()
EndEvent

function CreateConditions()
	; kGetFactionRank = 73,
	if !DbConditionFunctions.ConditionExists("MyMod_GetFactionRankCondition")
		DbConditionFunctions.CreateCondition("MyMod_GetFactionRankCondition", 73, 0, 1.0) ;0 = "=="
	Endif

	; kGetInZone = 445,
	if !DbConditionFunctions.ConditionExists("MyMod_GetInZoneCondition")
		DbConditionFunctions.CreateCondition("MyMod_GetInZoneCondition", 445, 0, 1.0) ;0 = "=="
	Endif

	; kGetGraphVariableInt = 675,
	if !DbConditionFunctions.ConditionExists("MyMod_GetGraphVariableInt")
		DbConditionFunctions.CreateCondition("MyMod_GetGraphVariableInt", 675, 2, 0.0) ;2 = ">"
		DbConditionFunctions.SetConditionParameterString("MyMod_GetGraphVariableInt", "iMagicEquipped")
	Endif
EndFunction

Bool Function IsFactionRankGreaterThan(actor akActor, faction akFaction, int rank)
	DbConditionFunctions.SetConditionComparison("MyMod_GetFactionRankCondition", 2) ;2 = ">"
	DbConditionFunctions.SetConditionValue("MyMod_GetFactionRankCondition", rank as float)
	DbConditionFunctions.SetConditionParameterForm("MyMod_GetFactionRankCondition", akFaction, 0)
	return DbConditionFunctions.EvaluateCondition("MyMod_GetFactionRankCondition", akActor)
EndFunction

bool Function IsFactionRankEqualTo(actor akActor, faction akFaction, int rank)
	DbConditionFunctions.SetConditionComparison("MyMod_GetFactionRankCondition", 0) ;0 = "=="
	DbConditionFunctions.SetConditionValue("MyMod_GetFactionRankCondition", rank as float)
	DbConditionFunctions.SetConditionParameterForm("MyMod_GetFactionRankCondition", akFaction, 0)
	return DbConditionFunctions.EvaluateCondition("MyMod_GetFactionRankCondition", akActor)
EndFunction

Bool function IsActorInZone(Actor akActor, EncounterZone zone)
	DbConditionFunctions.SetConditionParameterForm("MyMod_GetInZoneCondition", zone, 0)
	return DbConditionFunctions.EvaluateCondition("MyMod_GetInZoneCondition", akActor)
EndFunction

bool Function IsMagicEquipped(actor akActor)
	return DbConditionFunctions.EvaluateCondition("MyMod_GetGraphVariableInt", akActor)
EndFunction
===================================================================================================================================================================================================================================================================================
/;

;/Condition events: 
Allows to create events for when a condition created with this script changes from true to false or vice versa on an optional akTarget.
===================================================================================================================================================================================================================================================================================
-----------------------------------------------------!!! IMPORTANT !!!----------------------------------------------------------------------------------------------------------------------------------------------------
===================================================================================================================================================================================================================================================================================
If you set parameters for the condition used in a condition event, they must be persistent!
If the parameters aren't persistent, it will cause ctds.
To make any form or variable persistent, simply save it to a script property that's defined in the global scope (outside of any functions or events). 
See the Range Events portion in DbSkseEvents.psc for more info on this.

The event name for these will be "On" + conditionId + "Changed". 
example: if you create a condition with the conditionId "MyMod_Condition", the event will be: 

Event OnMyMod_ConditionChanged(ObjectReference akTarget, bool isTrue)
EndEvent 

These events use polling to detect the change. 
Polling interval determined by the fEventPollingInterval setting in Data/SKSE/Plugins/DbSkseFunctions.ini
Events are unique to the conditionId and Target. 
So doing: 
CreateConditionEvent("MyMod_IsMovingCondition", Game.GetPlayer())
CreateConditionEvent("MyMod_IsMovingCondition", sven)
Will create 2 events with same event name: Event OnMyMod_IsMovingConditionChanged

Note these events don't have to be registered for, they are sent to all scripts that contain the event with the event name. 
See the Condition Event Example script below for more info.
/;

;Does the condition event for the condition with the conditionId and target exist?
bool function ConditionEventExists(String conditionId, ObjectReference target = none) Global Native

;Create a condition event for the condition with the conditionId on the optional target.
;Returns false if the event already exists or the condition with the conditionId wasn't found.
Bool function CreateConditionEvent(String conditionId, ObjectReference target = none) Global Native

;Destroy the condition event previously created for the condition with the conditionId on the optional target.
;Returns true if the event exists and was destroyed.
bool function DestroyConditionEvent(String conditionId, ObjectReference target = none) Global Native

;Destroy all condition events created with the CreateConditionEvent function for the condition with the conditionId and return the number destroyed.
;Note that using DestroyCondition(string conditionId) will DestroyAllConditionEvents for the conditionId as well.
int function DestroyAllConditionEvents(String conditionId) Global Native

;Count how many condition events were created with the CreateConditionEvent function for the condition with the conditionId. 
int function CountConditionEvents(String conditionId) Global Native

;/Condition Event Example script:
===================================================================================================================================================================================================================================================================================
; Actor Property PlayerRef Auto

Event OnInit()
	CreatePlayerMoveConditionEvent()
	RegisterForKey(39) ;semi colon
EndEvent 

;Must recreate the condition and event on load game.
Event OnLoadGameGlobal()
	CreatePlayerMoveConditionEvent()
EndEvent

function CreatePlayerMoveConditionEvent()
	; kIsMoving = 25,
	if !DbConditionFunctions.ConditionExists("MyMod_IsMovingCondition")
		DbConditionFunctions.CreateCondition("MyMod_IsMovingCondition", 25, 0, 1.0) ;0 = "=="
	Endif
	
	if !DbConditionFunctions.ConditionEventExists("MyMod_IsMovingCondition", PlayerRef)
		;create event for when the player starts or stops moving
		DbConditionFunctions.CreateConditionEvent("MyMod_IsMovingCondition", PlayerRef)
	Endif
EndFunction

Event OnMyMod_IsMovingConditionChanged(ObjectReference target, bool isTrue)
	if (isTrue)
		Debug.Notification(target.GetDisplayName() + " started moving")
	Else 
		Debug.Notification(target.GetDisplayName() + " stopped moving")
	Endif
EndEvent 

Event OnKeyDown(int aiKeyCode)
	objectReference ref = consoleUtil.GetSelectedReference()
	if ref 
		string s
		if !DbConditionFunctions.ConditionEventExists("MyMod_IsMovingCondition", ref)
			s = "created"
			DbConditionFunctions.CreateConditionEvent("MyMod_IsMovingCondition", ref)
		else 
			s = "destroyed"
			DbConditionFunctions.DestroyConditionEvent("MyMod_IsMovingCondition", ref)
		Endif 

		int i = DbConditionFunctions.CountConditionEvents("MyMod_IsMovingCondition")
		Debug.notification("Is moving event " + s + " for " + ref.GetDisplayName() + " total events = " + i)

		if i >= 4
			i = DbConditionFunctions.DestroyAllConditionEvents("MyMod_IsMovingCondition")
			Debug.notification("Destroyed all " + i + " is moving events")
		Endif 
	Endif
EndEvent
===================================================================================================================================================================================================================================================================================
/;


;/ valid functions for the int conditionFunction parameter
kGetWantBlocking = 0,
kGetDistance = 1,
kAddItem = 2,
kSetEssential = 3,
kRotate = 4,
kGetLocked = 5,
kGetPos = 6,
kSetPos = 7,
kGetAngle = 8,
kSetAngle = 9,
kGetStartingPos = 10,
kGetStartingAngle = 11,
kGetSecondsPassed = 12,
kActivate = 13,
kGetActorValue = 14,
kSetActorValue = 15,
kModActorValue = 16,
kSetAtStart = 17,
kGetCurrentTime = 18,
kPlayGroup = 19,
kLoopGroup = 20,
kSkipAnim = 21,
kStartCombat = 22,
kStopCombat = 23,
kGetScale = 24,
kIsMoving = 25,
kIsTurning = 26,
kGetLineOfSight = 27,
kAddSpell = 28,
kRemoveSpell = 29,
kCast = 30,
kGetButtonPressed = 31,
kGetInSameCell = 32,
kEnable = 33,
kDisable = 34,
kGetDisabled = 35,
kMenuMode = 36,
kPlaceAtMe = 37,
kPlaySound = 38,
kGetDisease = 39,
kFailAllObjectives = 40,
kGetClothingValue = 41,
kSameFaction = 42,
kSameRace = 43,
kSameSex = 44,
kGetDetected = 45,
kGetDead = 46,
kGetItemCount = 47,
kGetGold = 48,
kGetSleeping = 49,
kGetTalkedToPC = 50,
kSay = 51,
kSayTo = 52,
kGetScriptVariable = 53,
kStartQuest = 54,
kStopQuest = 55,
kGetQuestRunning = 56,
kSetStage = 57,
kGetStage = 58,
kGetStageDone = 59,
kGetFactionRankDifference = 60,
kGetAlarmed = 61,
kIsRaining = 62,
kGetAttacked = 63,
kGetIsCreature = 64,
kGetLockLevel = 65,
kGetShouldAttack = 66,
kGetInCell = 67,
kGetIsClass = 68,
kGetIsRace = 69,
kGetIsSex = 70,
kGetInFaction = 71,
kGetIsID = 72,
kGetFactionRank = 73,
kGetGlobalValue = 74,
kIsSnowing = 75,
kFastTravel = 76,
kGetRandomPercent = 77,
kRemoveMusic = 78,
kGetQuestVariable = 79,
kGetLevel = 80,
kIsRotating = 81,
kRemoveItem = 82,
kGetLeveledEncounterValue = 83,
kGetDeadCount = 84,
kAddToMap = 85,
kStartConversation = 86,
kDrop = 87,
kAddTopic = 88,
kShowMessage = 89,
kSetAlert = 90,
kGetIsAlerted = 91,
kLook = 92,
kStopLook = 93,
kEvaluatePackage = 94,
kSendAssaultAlarm = 95,
kEnablePlayerControls = 96,
kDisablePlayerControls = 97,
kGetPlayerControlsDisabled = 98,
kGetHeadingAngle = 99,
kPickIdle = 100,
kIsWeaponMagicOut = 101,
kIsTorchOut = 102,
kIsShieldOut = 103,
kCreateDetectionEvent = 104,
kIsActionRef = 105,
kIsFacingUp = 106,
kGetKnockedState = 107,
kGetWeaponAnimType = 108,
kIsWeaponSkillType = 109,
kGetCurrentAIPackage = 110,
kIsWaiting = 111,
kIsIdlePlaying = 112,
kCompleteQuest = 113,
kLock = 114,
kUnLock = 115,
kIsIntimidatedByPlayer = 116,
kIsPlayerInRegion = 117,
kGetActorAggroRadiusViolated = 118,
kGetCrimeKnown = 119,
kSetEnemy = 120,
kSetAlly = 121,
kGetCrime = 122,
kIsGreetingPlayer = 123,
kStartMisterSandMan = 124,
kIsGuard = 125,
kStartCannibal = 126,
kHasBeenEaten = 127,
kGetStaminaPercentage = 128,
kGetPCIsClass = 129,
kGetPCIsRace = 130,
kGetPCIsSex = 131,
kGetPCInFaction = 132,
kSameFactionAsPC = 133,
kSameRaceAsPC = 134,
kSameSexAsPC = 135,
kGetIsReference = 136,
kSetFactionRank = 137,
kModFactionRank = 138,
kKillActor = 139,
kResurrectActor = 140,
kIsTalking = 141,
kGetWalkSpeed = 142,
kGetCurrentAIProcedure = 143,
kGetTrespassWarningLevel = 144,
kIsTrespassing = 145,
kIsInMyOwnedCell = 146,
kGetWindSpeed = 147,
kGetCurrentWeatherPercent = 148,
kGetIsCurrentWeather = 149,
kIsContinuingPackagePCNear = 150,
kSetCrimeFaction = 151,
kGetIsCrimeFaction = 152,
kCanHaveFlames = 153,
kHasFlames = 154,
kAddFlames = 155,
kRemoveFlames = 156,
kGetOpenState = 157,
kMoveToMarker = 158,
kGetSitting = 159,
kGetFurnitureMarkerID = 160,
kGetIsCurrentPackage = 161,
kIsCurrentFurnitureRef = 162,
kIsCurrentFurnitureObj = 163,
kSetSize = 164,
kRemoveMe = 165,
kDropMe = 166,
kGetFactionReaction = 167,
kSetFactionReaction = 168,
kModFactionReaction = 169,
kGetDayOfWeek = 170,
kIgnoreCrime = 171,
kGetTalkedToPCParam = 172,
kRemoveAllItems = 173,
kWakeUpPC = 174,
kIsPCSleeping = 175,
kIsPCAMurderer = 176,
kSetCombatStyle = 177,
kPlaySound3D = 178,
kSelectPlayerSpell = 179,
kHasSameEditorLocAsRef = 180,
kHasSameEditorLocAsRefAlias = 181,
kGetEquipped = 182,
kWait = 183,
kStopWaiting = 184,
kIsSwimming = 185,
kScriptEffectElapsedSeconds = 186,
kSetCellPublicFlag = 187,
kGetPCSleepHours = 188,
kSetPCSleepHours = 189,
kGetAmountSoldStolen = 190,
kModAmountSoldStolen = 191,
kGetIgnoreCrime = 192,
kGetPCExpelled = 193,
kSetPCExpelled = 194,
kGetPCFactionMurder = 195,
kSetPCFactionMurder = 196,
kGetPCEnemyofFaction = 197,
kSetPCEnemyofFaction = 198,
kGetPCFactionAttack = 199,
kSetPCFactionAttack = 200,
kStartScene = 201,
kStopScene = 202,
kGetDestroyed = 203,
kSetDestroyed = 204,
kGetActionRef = 205,
kGetSelf = 206,
kGetContainer = 207,
kGetForceRun = 208,
kSetForceRun = 209,
kGetForceSneak = 210,
kSetForceSneak = 211,
kAdvancePCSkill = 212,
kAdvancePCLevel = 213,
kHasMagicEffect = 214,
kGetDefaultOpen = 215,
kSetDefaultOpen = 216,
kShowClassMenu = 217,
kShowRaceMenu = 218,
kGetAnimAction = 219,
kShowNameMenu = 220,
kSetOpenState = 221,
kResetReference = 222,
kIsSpellTarget = 223,
kGetVATSMode = 224,
kGetPersuasionNumber = 225,
kGetVampireFeed = 226,
kGetCannibal = 227,
kGetIsClassDefault = 228,
kGetClassDefaultMatch = 229,
kGetInCellParam = 230,
kUnusedFunction1 = 231,
kGetCombatTarget = 232,
kGetPackageTarget = 233,
kShowSpellMaking = 234,
kGetVatsTargetHeight = 235,
kSetGhost = 236,
kGetIsGhost = 237,
kEquipItem = 238,
kUnequipItem = 239,
kSetClass = 240,
kSetUnconscious = 241,
kGetUnconscious = 242,
kSetRestrained = 243,
kGetRestrained = 244,
kForceFlee = 245,
kGetIsUsedItem = 246,
kGetIsUsedItemType = 247,
kIsScenePlaying = 248,
kIsInDialogueWithPlayer = 249,
kGetLocationCleared = 250,
kSetLocationCleared = 251,
kForceRefIntoAlias = 252,
kEmptyRefAlias = 253,
kGetIsPlayableRace = 254,
kGetOffersServicesNow = 255,
kGetGameSetting = 256,
kStopCombatAlarmOnActor = 257,
kHasAssociationType = 258,
kHasFamilyRelationship = 259,
kSetWeather = 260,
kHasParentRelationship = 261,
kIsWarningAbout = 262,
kIsWeaponOut = 263,
kHasSpell = 264,
kIsTimePassing = 265,
kIsPleasant = 266,
kIsCloudy = 267,
kTrapUpdate = 268,
kShowQuestObjectives = 269,
kForceActorValue = 270,
kIncrementPCSkill = 271,
kDoTrap = 272,
kEnableFastTravel = 273,
kIsSmallBump = 274,
kGetParentRef = 275,
kPlayBink = 276,
kGetBaseActorValue = 277,
kIsOwner = 278,
kSetOwnership = 279,
kIsCellOwner = 280,
kSetCellOwnership = 281,
kIsHorseStolen = 282,
kSetCellFullName = 283,
kSetActorFullName = 284,
kIsLeftUp = 285,
kIsSneaking = 286,
kIsRunning = 287,
kGetFriendHit = 288,
kIsInCombat = 289,
kSetPackDuration = 290,
kPlayMagicShaderVisuals = 291,
kPlayMagicEffectVisuals = 292,
kStopMagicShaderVisuals = 293,
kStopMagicEffectVisuals = 294,
kResetInterior = 295,
kIsAnimPlaying = 296,
kSetActorAlpha = 297,
kEnableLinkedPathPoints = 298,
kDisableLinkedPathPoints = 299,
kIsInInterior = 300,
kForceWeather = 301,
kToggleActorsAI = 302,
kIsActorsAIOff = 303,
kIsWaterObject = 304,
kGetPlayerAction = 305,
kIsActorUsingATorch = 306,
kSetLevel = 307,
kResetFallDamageTimer = 308,
kIsXBox = 309,
kGetInWorldspace = 310,
kModPCMiscStat = 311,
kGetPCMiscStat = 312,
kGetPairedAnimation = 313,
kIsActorAVictim = 314,
kGetTotalPersuasionNumber = 315,
kSetScale = 316,
kModScale = 317,
kGetIdleDoneOnce = 318,
kKillAllActors = 319,
kGetNoRumors = 320,
kSetNoRumors = 321,
kDispel = 322,
kGetCombatState = 323,
kTriggerHitShader = 324,
kGetWithinPackageLocation = 325,
kReset3DState = 326,
kIsRidingMount = 327,
kDispelAllSpells = 328,
kIsFleeing = 329,
kAddAchievement = 330,
kDuplicateAllItems = 331,
kIsInDangerousWater = 332,
kEssentialDeathReload = 333,
kSetShowQuestItems = 334,
kDuplicateNPCStats = 335,
kResetHealth = 336,
kSetIgnoreFriendlyHits = 337,
kGetIgnoreFriendlyHits = 338,
kIsPlayersLastRiddenMount = 339,
kSetActorRefraction = 340,
kSetItemValue = 341,
kSetRigidBodyMass = 342,
kShowViewerStrings = 343,
kReleaseWeatherOverride = 344,
kSetAllReachable = 345,
kSetAllVisible = 346,
kSetNoAvoidance = 347,
kSendTrespassAlarm = 348,
kSetSceneIsComplex = 349,
kAutosave = 350,
kStartMasterFileSeekData = 351,
kDumpMasterFileSeekData = 352,
kIsActor = 353,
kIsEssential = 354,
kPreloadMagicEffect = 355,
kShowDialogSubtitles = 356,
kSetPlayerResistingArrest = 357,
kIsPlayerMovingIntoNewSpace = 358,
kGetInCurrentLoc = 359,
kGetInCurrentLocAlias = 360,
kGetTimeDead = 361,
kHasLinkedRef = 362,
kGetLinkedRef = 363,
kDamageObject = 364,
kIsChild = 365,
kGetStolenItemValueNoCrime = 366,
kGetLastPlayerAction = 367,
kIsPlayerActionActive = 368,
kSetTalkingActivatorActor = 369,
kIsTalkingActivatorActor = 370,
kShowBarterMenu = 371,
kIsInList = 372,
kGetStolenItemValue = 373,
kAddPerk = 374,
kGetCrimeGoldViolent = 375,
kGetCrimeGoldNonviolent = 376,
kShowRepairMenu = 377,
kHasShout = 378,
kAddNote = 379,
kRemoveNote = 380,
kGetHasNote = 381,
kAddToFaction = 382,
kRemoveFromFaction = 383,
kDamageActorValue = 384,
kRestoreActorValue = 385,
kTriggerHUDShudder = 386,
kGetObjectiveFailed = 387,
kSetObjectiveFailed = 388,
kSetGlobalTimeMultiplier = 389,
kGetHitLocation = 390,
kIsPC1stPerson = 391,
kPurgeCellBuffers = 392,
kPushActorAway = 393,
kSetActorsAI = 394,
kClearOwnership = 395,
kGetCauseofDeath = 396,
kIsLimbGone = 397,
kIsWeaponInList = 398,
kPlayIdle = 399,
kApplyImageSpaceModifier = 400,
kRemoveImageSpaceModifier = 401,
kIsBribedbyPlayer = 402,
kGetRelationshipRank = 403,
kSetRelationshipRank = 404,
kSetCellImageSpace = 405,
kShowChargenMenu = 406,
kGetVATSValue = 407,
kIsKiller = 408,
kIsKillerObject = 409,
kGetFactionCombatReaction = 410,
kUseWeapon = 411,
kEvaluateSpellConditions = 412,
kToggleMotionBlur = 413,
kExists = 414,
kGetGroupMemberCount = 415,
kGetGroupTargetCount = 416,
kSetObjectiveCompleted = 417,
kSetObjectiveDisplayed = 418,
kGetObjectiveCompleted = 419,
kGetObjectiveDisplayed = 420,
kSetImageSpace = 421,
kPipboyRadio = 422,
kRemovePerk = 423,
kDisableAllActors = 424,
kGetIsFormType = 425,
kGetIsVoiceType = 426,
kGetPlantedExplosive = 427,
kCompleteAllObjectives = 428,
kIsScenePackageRunning = 429,
kGetHealthPercentage = 430,
kSetAudioMultithreading = 431,
kGetIsObjectType = 432,
kShowChargenMenuParams = 433,
kGetDialogueEmotion = 434,
kGetDialogueEmotionValue = 435,
kExitGame = 436,
kGetIsCreatureType = 437,
kPlayerCreatePotion = 438,
kPlayerEnchantObject = 439,
kShowWarning = 440,
kEnterTrigger = 441,
kMarkForDelete = 442,
kSetPlayerAIDriven = 443,
kGetInCurrentLocFormList = 444,
kGetInZone = 445,
kGetVelocity = 446,
kGetGraphVariableFloat = 447,
kHasPerk = 448,
kGetFactionRelation = 449,
kIsLastIdlePlayed = 450,
kSetNPCRadio = 451,
kSetPlayerTeammate = 452,
kGetPlayerTeammate = 453,
kGetPlayerTeammateCount = 454,
kOpenActorContainer = 455,
kClearFactionPlayerEnemyFlag = 456,
kClearActorsFactionsPlayerEnemyFlag = 457,
kGetActorCrimePlayerEnemy = 458,
kGetCrimeGold = 459,
kSetCrimeGold = 460,
kModCrimeGold = 461,
kGetPlayerGrabbedRef = 462,
kIsPlayerGrabbedRef = 463,
kPlaceLeveledActorAtMe = 464,
kGetKeywordItemCount = 465,
kShowLockpickMenu = 466,
kGetBroadcastState = 467,
kSetBroadcastState = 468,
kStartRadioConversation = 469,
kGetDestructionStage = 470,
kClearDestruction = 471,
kCastImmediateOnSelf = 472,
kGetIsAlignment = 473,
kResetQuest = 474,
kSetQuestDelay = 475,
kIsProtected = 476,
kGetThreatRatio = 477,
kMatchFaceGeometry = 478,
kGetIsUsedItemEquipType = 479,
kGetPlayerName = 480,
kFireWeapon = 481,
kPayCrimeGold = 482,
kUnusedFunction2 = 483,
kMatchRace = 484,
kSetPCYoung = 485,
kSexChange = 486,
kIsCarryable = 487,
kGetConcussed = 488,
kSetZoneRespawns = 489,
kSetVATSTarget = 490,
kGetMapMarkerVisible = 491,
kResetInventory = 492,
kPlayerKnows = 493,
kGetPermanentActorValue = 494,
kGetKillingBlowLimb = 495,
kGoToJail = 496,
kCanPayCrimeGold = 497,
kServeTime = 498,
kGetDaysInJail = 499,
kEPAlchemyGetMakingPoison = 500,
kEPAlchemyEffectHasKeyword = 501,
kShowAllMapMarkers = 502,
kGetAllowWorldInteractions = 503,
kResetAI = 504,
kSetRumble = 505,
kSetNoActivationSound = 506,
kClearNoActivationSound = 507,
kGetLastHitCritical = 508,
kAddMusic = 509,
kUnusedFunction3 = 510,
kUnusedFunction4 = 511,
kSetPCToddler = 512,
kIsCombatTarget = 513,
kTriggerScreenBlood = 514,
kGetVATSRightAreaFree = 515,
kGetVATSLeftAreaFree = 516,
kGetVATSBackAreaFree = 517,
kGetVATSFrontAreaFree = 518,
kGetIsLockBroken = 519,
kIsPS3 = 520,
kIsWin32 = 521,
kGetVATSRightTargetVisible = 522,
kGetVATSLeftTargetVisible = 523,
kGetVATSBackTargetVisible = 524,
kGetVATSFrontTargetVisible = 525,
kAttachAshPile = 526,
kSetCriticalStage = 527,
kIsInCriticalStage = 528,
kRemoveFromAllFactions = 529,
kGetXPForNextLevel = 530,
kShowLockpickMenuDebug = 531,
kForceSave = 532,
kGetInfamy = 533,
kGetInfamyViolent = 534,
kGetInfamyNonViolent = 535,
kUnusedFunction5 = 536,
kSin = 537,
kCos = 538,
kTan = 539,
kSqrt = 540,
kLog = 541,
kAbs = 542,
kGetQuestCompleted = 543,
kUnusedFunction6 = 544,
kPipBoyRadioOff = 545,
kAutoDisplayObjectives = 546,
kIsGoreDisabled = 547,
kFadeSFX = 548,
kSetMinimalUse = 549,
kIsSceneActionComplete = 550,
kShowQuestStages = 551,
kGetSpellUsageNum = 552,
kForceRadioStationUpdate = 553,
kGetActorsInHigh = 554,
kHasLoaded3D = 555,
kDisableAllMines = 556,
kSetLastExtDoorActivated = 557,
kKillQuestUpdates = 558,
kIsImageSpaceActive = 559,
kHasKeyword = 560,
kHasRefType = 561,
kLocationHasKeyword = 562,
kLocationHasRefType = 563,
kCreateEvent = 564,
kGetIsEditorLocation = 565,
kGetIsAliasRef = 566,
kGetIsEditorLocAlias = 567,
kIsSprinting = 568,
kIsBlocking = 569,
kHasEquippedSpell = 570,
kGetCurrentCastingType = 571,
kGetCurrentDeliveryType = 572,
kEquipSpell = 573,
kGetAttackState = 574,
kGetAliasedRef = 575,
kGetEventData = 576,
kIsCloserToAThanB = 577,
kEquipShout = 578,
kGetEquippedShout = 579,
kIsBleedingOut = 580,
kUnlockWord = 581,
kTeachWord = 582,
kAddToContainer = 583,
kGetRelativeAngle = 584,
kSendAnimEvent = 585,
kShout = 586,
kAddShout = 587,
kRemoveShout = 588,
kGetMovementDirection = 589,
kIsInScene = 590,
kGetRefTypeDeadCount = 591,
kGetRefTypeAliveCount = 592,
kApplyHavokImpulse = 593,
kGetIsFlying = 594,
kIsCurrentSpell = 595,
kSpellHasKeyword = 596,
kGetEquippedItemType = 597,
kGetLocationAliasCleared = 598,
kSetLocationAliasCleared = 599,
kGetLocAliasRefTypeDeadCount = 600,
kGetLocAliasRefTypeAliveCount = 601,
kIsWardState = 602,
kIsInSameCurrentLocAsRef = 603,
kIsInSameCurrentLocAsRefAlias = 604,
kLocAliasIsLocation = 605,
kGetKeywordDataForLocation = 606,
kSetKeywordDataForLocation = 607,
kGetKeywordDataForAlias = 608,
kSetKeywordDataForAlias = 609,
kLocAliasHasKeyword = 610,
kIsNullPackageData = 611,
kGetNumericPackageData = 612,
kIsFurnitureAnimType = 613,
kIsFurnitureEntryType = 614,
kGetHighestRelationshipRank = 615,
kGetLowestRelationshipRank = 616,
kHasAssociationTypeAny = 617,
kHasFamilyRelationshipAny = 618,
kGetPathingTargetOffset = 619,
kGetPathingTargetAngleOffset = 620,
kGetPathingTargetSpeed = 621,
kGetPathingTargetSpeedAngle = 622,
kGetMovementSpeed = 623,
kGetInContainer = 624,
kIsLocationLoaded = 625,
kIsLocAliasLoaded = 626,
kIsDualCasting = 627,
kDualCast = 628,
kGetVMQuestVariable = 629,
kGetVMScriptVariable = 630,
kIsEnteringInteractionQuick = 631,
kIsCasting = 632,
kGetFlyingState = 633,
kSetFavorState = 634,
kIsInFavorState = 635,
kHasTwoHandedWeaponEquipped = 636,
kIsExitingInstant = 637,
kIsInFriendStateWithPlayer = 638,
kGetWithinDistance = 639,
kGetActorValuePercent = 640,
kIsUnique = 641,
kGetLastBumpDirection = 642,
kCameraShake = 643,
kIsInFurnitureState = 644,
kGetIsInjured = 645,
kGetIsCrashLandRequest = 646,
kGetIsHastyLandRequest = 647,
kUpdateQuestInstanceGlobal = 648,
kSetAllowFlying = 649,
kIsLinkedTo = 650,
kGetKeywordDataForCurrentLocation = 651,
kGetInSharedCrimeFaction = 652,
kGetBribeAmount = 653,
kGetBribeSuccess = 654,
kGetIntimidateSuccess = 655,
kGetArrestedState = 656,
kGetArrestingActor = 657,
kClearArrestState = 658,
kEPTemperingItemIsEnchanted = 659,
kEPTemperingItemHasKeyword = 660,
kGetReceivedGiftValue = 661,
kGetGiftGivenValue = 662,
kForceLocIntoAlias = 663,
kGetReplacedItemType = 664,
kSetHorseActor = 665,
kPlayReferenceEffect = 666,
kStopReferenceEffect = 667,
kPlayShaderParticleGeometry = 668,
kStopShaderParticleGeometry = 669,
kApplyImageSpaceModifierCrossFade = 670,
kRemoveImageSpaceModifierCrossFade = 671,
kIsAttacking = 672,
kIsPowerAttacking = 673,
kIsLastHostileActor = 674,
kGetGraphVariableInt = 675,
kGetCurrentShoutVariation = 676,
kPlayImpactEffect = 677,
kShouldAttackKill = 678,
kSendStealAlarm = 679,
kGetActivationHeight = 680,
kEPModSkillUsage_IsAdvanceSkill = 681,
kWornHasKeyword = 682,
kGetPathingCurrentSpeed = 683,
kGetPathingCurrentSpeedAngle = 684,
kKnockAreaEffect = 685,
kInterruptCast = 686,
kAddFormToFormList = 687,
kRevertFormList = 688,
kAddFormToLeveledList = 689,
kRevertLeveledList = 690,
kEPModSkillUsage_AdvanceObjectHasKeyword = 691,
kEPModSkillUsage_IsAdvanceAction = 692,
kEPMagic_SpellHasKeyword = 693,
kGetNoBleedoutRecovery = 694,
kSetNoBleedoutRecovery = 695,
kEPMagic_SpellHasSkill = 696,
kIsAttackType = 697,
kIsAllowedToFly = 698,
kHasMagicEffectKeyword = 699,
kIsCommandedActor = 700,
kIsStaggered = 701,
kIsRecoiling = 702,
kIsExitingInteractionQuick = 703,
kIsPathing = 704,
kGetShouldHelp = 705,
kHasBoundWeaponEquipped = 706,
kGetCombatTargetHasKeyword = 707,
kUpdateLevel = 708,
kGetCombatGroupMemberCount = 709,
kIsIgnoringCombat = 710,
kGetLightLevel = 711,
kSavePCFace = 712,
kSpellHasCastingPerk = 713,
kIsBeingRidden = 714,
kIsUndead = 715,
kGetRealHoursPassed = 716,
kUnequipAll = 717,
kIsUnlockedDoor = 718,
kIsHostileToActor = 719,
kGetTargetHeight = 720,
kIsPoison = 721,
kWornApparelHasKeywordCount = 722,
kGetItemHealthPercent = 723,
kEffectWasDualCast = 724,
kGetKnockStateEnum = 725,
kDoesNotExist = 726,
kUnequipItemSlot = 727,
kMountActor = 728,
kDismountActor = 729,
kIsOnFlyingMount = 730,
kCanFlyHere = 731,
kIsFlyingMountPatrolQueued = 732,
kIsFlyingMountFastTravelling = 733,
kIsOverEncumbered = 734,
kGetActorWarmth = 735,
/;