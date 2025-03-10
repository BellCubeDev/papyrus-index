ScriptName Lighthouse native hidden

; Official documentation can be found here:
; https://fallout.wiki/wiki/Mod:Lighthouse_Papyrus_Extender

; ---------------------------------------------------------------------
; ActiveEffect
; ---------------------------------------------------------------------

float Function GetDuration(Actor akActor, Form akEffectForm) global native

float Function GetElapsedTime(Actor akActor, Form akEffectForm) global native

float Function GetMagnitude(Actor akActor, Form akEffectForm) global native

; ---------------------------------------------------------------------
; Actor
; ---------------------------------------------------------------------

bool Function AreHostileActorsInRange(Actor akActor, int aiMaxDistance) global native

Function DrinkPotion(Actor akActor, Potion akPotion) global native

Function ExitCover(Actor akActor) global native

MagicEffect[] Function GetActiveEffects(Actor akActor, bool abIncludeInactive) global native

Faction[] Function GetActorFactionsFromList(Actor akActor, Faction[] akFactionList) global native

int Function GetActorGunState(Actor akActor) global native

Actor[] Function GetActorsByVerticalDistance(ObjectReference akRef, int aiUpDistance, int aiDownDistance, int aiMaxRadius, bool abIncludeDead) global native

Actor[] Function GetActorsHostileToActor(Actor akActor, int aiMaxDistance, bool abIncludePlayer) global native

Actor[] Function GetActorsInRange(ObjectReference akRef, int aiMaxDistance, bool abIncludeDead) global native

Actor[] Function GetActorsTargetingActor(Actor akActor) global native

Form Function GetArmorFormOnBipedSlot(Actor akActor, int aiBipedSlot) global native

Actor Function GetClosestActorWithKeyword(ObjectReference akRef, Keyword akKeyword, bool abIgnorePlayer, bool abIncludeDead) global native

CombatStyle Function GetCombatStyle(Actor akActor) global native

Actor[] Function GetCommandedActors(Actor akActor) global native

float Function GetEncumbranceRate(Actor akActor) global native

float Function GetEquippedWeight(Actor akActor) global native

Actor[] Function GetHighActorsByRace(Race akRace, bool abIncludeDead) global native

Actor[] Function GetHighActorsInCombat() global native

Actor[] Function GetHighDeadActors(bool abNotEssential) global native

int Function GetKnockState(Actor akActor) global native

int Function GetLifeState(Actor akActor) global native

bool Function GetOffersServices(Actor akActor) global native

Package Function GetRunningPackage(Actor akActor) global native

float Function GetTimeDead(Actor akActor) global native

float Function GetTimeOfDeath(Actor akActor) global native

ObjectReference Function GetVendorContainerRef(Actor akActor) global native

Faction Function GetVendorFaction(Actor akActor) global native

int Function GetWeaponAmmoCapacity(Actor akActor) global native

int Function GetWeaponAmmoCount(Actor akActor) global native

Ammo Function GetWeaponAmmoType(Actor akActor) global native

int Function GetWeaponMagCount(Actor akActor, bool abRoundDown) global native

bool Function HasActiveMagicEffect(Actor akActor, MagicEffect akMagicEffect) global native

bool Function HasFactionFromList(Actor akActor, Faction[] akFactionList) global native

bool Function IsCrippled(Actor akActor) global native

bool Function IsFleeing(Actor akActor) global native

bool Function IsFollowing(Actor akActor) global native

bool Function IsFollowingActor(Actor akActor, Actor akFollowTarget) global native

bool Function IsInKillMove(Actor akActor) global native

bool Function IsJumping(Actor akActor) global native

bool Function IsKeywordOnArmorIndex(Actor akActor, Keyword akKeyword, int aiIndexSlot) global native

bool Function IsKeywordOnWeapon(Actor akActor, Keyword akKeyword) global native

bool Function IsPathing(Actor akActor) global native

bool Function IsPathingComplete(Actor akActor) global native

bool Function IsPathValid(Actor akActor) global native

bool Function IsQuadruped(Actor akActor) global native

bool Function IsStaggered(Actor akActor) global native

bool Function IsTakingHealthDamage(Actor akActor) global native

bool Function IsTakingRadDamage(Actor akActor) global native

bool Function IsTresspassing(Actor akActor) global native

bool Function IsUnderwater(Actor akActor) global native

Actor[] Function RemoveActorFromArray(Actor[] akActorArray, Actor akActor) global native

Function ResetInventory(Actor akActor, bool abLeveledOnly) global native

Function SetActorAttackingDisabled(Actor akActor, bool abValue) global native

Function SetDoNotShowOnStealthMeter(Actor akActor, bool abValue) global native

Function SetWeaponAmmoCount(Actor akActor, int aiCount) global native

Function StowWeapon(Actor akActor) global native

; ---------------------------------------------------------------------
; ActorBase
; ---------------------------------------------------------------------

CombatStyle Function GetActorBaseCombatStyle(ActorBase akActorBase) global native

LeveledItem Function GetDeathItem(ActorBase akActorBase) global native

Faction[] Function GetFactions(ActorBase akActorBase) global native

int Function GetPerkCount(ActorBase akActorBase) global native

ActorBase[] Function GetRelationships(ActorBase akActorBase, AssociationType akAssocType) global native

bool Function HasAutoCalcStats(ActorBase akActorBase) global native

bool Function HasPCLevelMult(ActorBase akActorBase) global native

Function SetDeathItem(ActorBase akActorBase, LeveledItem akDeathItem) global native

; ---------------------------------------------------------------------
; ActorValue
; ---------------------------------------------------------------------

float Function GetFormBaseValue(Form akForm, ActorValue akActorValue) global native

; ---------------------------------------------------------------------
; Ammo
; ---------------------------------------------------------------------

float Function GetAmmoDamage(Ammo akAmmo) global native

Projectile Function GetAmmoProjectile(Ammo akAmmo) global native

Function SetAmmoDamage(Ammo akAmmo, float afDamage) global native

Function SetAmmoProjectile(Ammo akAmmo, Projectile akProjectile) global native

; ---------------------------------------------------------------------
; Armor
; ---------------------------------------------------------------------

int Function GetArmorHealth(Armor akArmor) global native

; ---------------------------------------------------------------------
; Array
; ---------------------------------------------------------------------

Actor[] Function CreateArrayActor(int aiArrSize, Actor akArrFill) global native

bool[] Function CreateArrayBool(int aiArrSize, bool abArrFill) global native

ConstructibleObject[] Function CreateArrayCOBJ(int aiArrSize, ConstructibleObject akArrFill) global native

float[] Function CreateArrayFloat(int aiArrSize, float afArrFill) global native

Form[] Function CreateArrayForm(int aiArrSize, Form akArrFill) global native

int[] Function CreateArrayInt(int aiArrSize, int aiArrFill) global native

ObjectReference[] Function CreateArrayRef(int aiArrSize, ObjectReference akArrFill) global native

String[] Function CreateArrayString(int aiArrSize, String asArrFill) global native

Actor[] Function ResizeArrayActor(Actor[] akArrayToResize, int aiArrSize, Actor akArrFill) global native

bool[] Function ResizeArrayBool(bool[] akArrayToResize, int aiArrSize, bool abArrFill) global native

ConstructibleObject[] Function ResizeArrayCOBJ(ConstructibleObject[] akArrayToResize, int aiArrSize, ConstructibleObject akArrFill) global native

float[] Function ResizeArrayFloat(float[] akArrayToResize, int aiArrSize, float afArrFill) global native

Form[] Function ResizeArrayForm(Form[] akArrayToResize, int aiArrSize, Form akArrFill) global native

int[] Function ResizeArrayInt(int[] akArrayToResize, int aiArrSize, int aiArrFill) global native

ObjectReference[] Function ResizeArrayRef(ObjectReference[] akArrayToResize, int aiArrSize, ObjectReference akArrFill) global native

String[] Function ResizeArrayString(String[] akArrayToResize, int aiArrSize, String asArrFill) global native

float[] Function SortArrayFloat(float[] akArrayToSort, bool abSortDescending, int aiStartIndex, int aiEndIndex) global native

int[] Function SortArrayInt(int[] akArrayToSort, bool abSortDescending, int aiStartIndex, int aiEndIndex) global native

string[] Function SortArrayString(string[] akArrayToSort, bool abSortDescending, int aiStartIndex, int aiEndIndex) global native

; ---------------------------------------------------------------------
; Book
; ---------------------------------------------------------------------

MatSwap Function GetBookMaterialSwap(Book akBook) global native

Perk Function GetBookPerk(Book akBook) global native

Holotape Function GetCurrentHolotape() global native

bool Function IsHolotapePlaying(Holotape akHolotape) global native

Function PauseHolotape(Holotape akHolotape) global native

Function PlayHolotape(Holotape akHolotape) global native

Function SetPerkToAdd(Book akBook, Perk akPerk) global native

; ---------------------------------------------------------------------
; Cell
; ---------------------------------------------------------------------

bool Function GetCanWaitInCell(Cell akCell) global native

String Function GetCellName(Cell akCell) global native

bool Function IsExterior(Cell akCell) global native

Function SetCellName(Cell akCell, String asName) global native

; ---------------------------------------------------------------------
; CombatStyle
; ---------------------------------------------------------------------

Function SetCombatStyleValue(CombatStyle akCombatStyle, int aiIndexValue, float afValue) global native

Function SetFormCombatStyle(Form akForm, CombatStyle akCombatStyle) global native

; ---------------------------------------------------------------------
; Debug
; ---------------------------------------------------------------------

; READ THIS FIRST!
; https://fallout.wiki/wiki/Mod:Lighthouse_Papyrus_Extender/Debug#CrashTheGame
Function CrashTheGame(String asModName, String asCrashReason) global native

Function DoNothing() global native

string Function GetGameDirectory() global native

; Current version: (1, 13, 0)
int[] Function GetLighthouseVersion() global native

int[] Function GetSystemTime() global native

; ---------------------------------------------------------------------
; Faction
; ---------------------------------------------------------------------

ObjectReference Function GetFactionVendorContainerRef(Faction akFaction) global native

; ---------------------------------------------------------------------
; Form
; ---------------------------------------------------------------------

Function ClearRecordFlag(Form akForm, int aiFlag) global native

int Function GetContainerFlags(Form akForm) global native

Form Function GetFormByEditorID(String asEditorID) global native

String Function GetFormEditorID(Form akForm) global native

int Function GetFormType(Form akForm) global native

float Function GetFormWeight(Form akForm) global native

ConstructibleObject[] Function GetParentCOBJs(Form akForm, Keyword akWorkshopKeyword, Keyword akCategoryKeyword) global native

bool Function IsContainerFlagSet(Form akForm, int aiFlag) global native

bool Function IsDynamicForm(Form akForm) global native

bool Function IsFormInMod(Form akForm, String asModName) global native

bool Function IsRecordFlagSet(Form akForm, int aiFlag) global native

Function SetRecordFlag(Form akForm, int aiFlag) global native

; ---------------------------------------------------------------------
; Game
; ---------------------------------------------------------------------

Actor[] Function GetActorsByProcessingLevel(int aiProccessLevel) global native

int Function GetNumActorsInHigh() global native

; ---------------------------------------------------------------------
; Hazard
; ---------------------------------------------------------------------

Function ClearHazardFlag(Hazard akHazard, int aiFlag) global native

String Function GetHazardArt(Hazard akHazard) global native

ImageSpaceModifier Function GetHazardIMOD(Hazard akHazard) global native

float Function GetHazardIMODRadius(Hazard akHazard) global native

ImpactDataSet Function GetHazardIPDS(Hazard akHazard) global native

float Function GetHazardLifetime(Hazard akHazard) global native

Light Function GetHazardLight(Hazard akHazard) global native

int Function GetHazardLimit(Hazard akHazard) global native

float Function GetHazardRadius(Hazard akHazard) global native

Sound Function GetHazardSound(Hazard akHazard) global native

Spell Function GetHazardSpell(Hazard akHazard) global native

float Function GetHazardTargetInterval(Hazard akHazard) global native

bool Function IsHazardFlagSet(Hazard akHazard, int aiFlag) global native

Function SetHazardArt(Hazard akHazard, String asPath) global native

Function SetHazardFlag(Hazard akHazard, int aiFlag) global native

Function SetHazardIMOD(Hazard akHazard, ImageSpaceModifier akIMOD) global native

Function SetHazardIMODRadius(Hazard akHazard, float afRadius) global native

Function SetHazardIPDS(Hazard akHazard, ImpactDataSet akIPDS) global native

Function SetHazardLifetime(Hazard akHazard, float afLifetime) global native

Function SetHazardLight(Hazard akHazard, Light akLight) global native

Function SetHazardLimit(Hazard akHazard, int aiLimit) global native

Function SetHazardRadius(Hazard akHazard, float afRadius) global native

Function SetHazardSound(Hazard akHazard, Sound akSound) global native

Function SetHazardSpell(Hazard akHazard, Spell akspell) global native

Function SetHazardTargetInterval(Hazard akHazard, float afInterval) global native

; ---------------------------------------------------------------------
; Keyword
; ---------------------------------------------------------------------

ObjectReference Function FindClosestReferenceWithKeyword(ObjectReference akOriginRef, ObjectReference[] akRefArray, Keyword akKeyword) global native

bool Function IsKeywordInNPCForm(Form akForm, Keyword akKeyword) global native

Keyword[] Function RemoveKeywordFromArray(Keyword[] akKeywordArray, Keyword akKeyword) global native

; ---------------------------------------------------------------------
; LeveledList
; ---------------------------------------------------------------------

GlobalVariable Function GetChanceNoneGlobal(LeveledItem akLeveledList) global native

int Function GetLeveledListChanceNone(LeveledItem akLeveledList) global native

bool Function GetUseAll(LeveledItem akLeveledList) global native

Function RemoveScriptAddedLeveledObjects(Form akLeveledListForm) global native

Function SetChanceNoneGlobal(LeveledItem akLeveledList, GlobalVariable akGlobal) global native

Function SetLeveledListChanceNone(LeveledItem akLeveledList, int aiChance) global native

; ---------------------------------------------------------------------
; Location
; ---------------------------------------------------------------------

Location[] Function GetChildLocations(Location akParentLocation) global native

String Function GetLocationName(Location akLocation) global native

; ---------------------------------------------------------------------
; Math
; ---------------------------------------------------------------------

int Function BinomialCoefficient(int n, int k) global native

float Function BinomialDistribution(int nTrials, float pChance, int kWins) global native

float Function BinomialDistributionCumulative(int nTrials, float pChance, int kWins) global native

float Function GaussianDistribution(float afMinValue, float afMaxValue) global native

float Function LogAddExp(float xValue, float yValue) global native

float Function PoissonDistribution(float lambda, int kEvents) global native

float Function PoissonCumulativeProbability(float lambda, int kEvents) global native

; ---------------------------------------------------------------------
; ObjectReference
; ---------------------------------------------------------------------

Function AddItem32(ObjectReference akRef, Form akForm, int aiCount, bool abSilent) global native

ObjectReference[] Function FilterRefArrayByKeywords(ObjectReference[] akRefArray, Keyword[] akWhitelist, Keyword[] akBlacklist) global native

float Function GetAnimationLength(ObjectReference akRef) global native

float Function GetAnimationTime(ObjectReference akRef) global native

Actor Function GetClosestActorFromRef(ObjectReference akRef, bool abIgnorePlayer, bool abIncludeDead) global native

ObjectReference Function GetDoorDestination(ObjectReference akRef) global native

Form[] Function GetInventoryItemsAsArray(ObjectReference akRef, bool[] akFilterArray, bool abMatchAll) global native

String Function GetMapMarkerName(ObjectReference akRef) global native

float Function GetWeightInContainer(ObjectReference akRef) global native

bool Function IsInWater(ObjectReference akRef) global native

bool Function SetDoorDestination(ObjectReference akRef, ObjectReference akDestinationRef) global native

Function SetHealthPercent(ObjectReference akRef, float afHealthPercent) global native

Function SetKey(ObjectReference akRef, Key akKey) global native

; ---------------------------------------------------------------------
; PlayerCharacter
; ---------------------------------------------------------------------

ObjectReference[] Function GetAllMapMarkers() global native

int Function GetFollowerCount() global native

float Function GetPlayerHeading() global native

float Function GetPlayerLooking() global native

bool Function IsInGodMode() global native

bool Function IsImmortal() global native

bool Function IsPipboyLightOn() global native

bool Function IsPlayerDetectedByHostile() global native

bool Function IsThirdPersonModelShown() global native

Function TogglePipBoyLight() global native

; ---------------------------------------------------------------------
; Projectile
; ---------------------------------------------------------------------

float Function GetProjectileDataValue(Projectile akProjectile, int aiIndexValue) global native

Function SetProjectileDataValue(Projectile akProjectile, int aiIndexValue, float afValue) global native

; ---------------------------------------------------------------------
; String
; ---------------------------------------------------------------------

int Function HexToInt(string asHexString) global native

bool Function IncludesPrefix(String asString, String asPrefix, bool abCaseSensitive) global native

bool Function IncludesSubstring(String asString, String asSubstring, bool abCaseSensitive) global native

bool Function IncludesSuffix(String asString, String asSuffix, bool abCaseSensitive) global native

string Function IntToBin(int aiNumToConvert, int aiBinWidth, bool abAddPrefix) global native

string Function IntToHex(int aiNumToConvert, int aiHexWidth, bool abAddPrefix) global native

int Function StringToInt(string asIntString) global native

String Function ToLower(String asString) global native

String Function ToUpper(String asString) global native

; ---------------------------------------------------------------------
; UI
; ---------------------------------------------------------------------

Function UpdateBarterMenu(bool bInContainer) global native

Function UpdateContainerMenu(bool bInContainer) global native

; ---------------------------------------------------------------------
; VATS
; ---------------------------------------------------------------------

float Function GetVATSCriticalCharge() global native

Function SetVATSCriticalCharge(float afCharge) global native

Function SetVATSCriticalCount(int aiCount) global native

; ---------------------------------------------------------------------
; Weather
; ---------------------------------------------------------------------

String Function GetPrecipitationType(Weather akWeather) global native

float Function GetWeatherFogData(Weather akWeather, int aiDataIndex) global native

Function SetWeatherFogData(Weather akWeather, int aiDataIndex, float akValue) global native
