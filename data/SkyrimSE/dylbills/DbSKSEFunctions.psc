Scriptname DbSkseFunctions Hidden
;compiled with CommonLib NG, so should work with Skyrim SE and AE

Float Function GetVersion() Global Native

bool function LoadMostRecentSaveGame() Global Native

;get and set text from system clipboard, for copy / paste functionality
String Function GetClipBoardText() Global Native
Bool Function SetClipBoardText(String s) Global Native

;is the string c char whitespace? Uses c++ isspace function
Bool Function IsWhiteSpace(String c) Global Native
int Function CountWhiteSpaces(String s) Global Native

;does the mod have at least 1 form of formType?
Bool Function ModHasFormType(String modName, int formType) Global Native

;returns new form array that contains the forms of the passed in akForms array, but sorted.
;Sort options are as follows. Note, to sort by editor Id reliably, po3 tweaks must be installed.
;1 = by form name ascending,
;2 = by form name descending,
;3 = by form editor Id name ascending,
;4 = by form editor Id name descending,
;5 = by form Id ascending,
;6 = by form Id descending
Form[] Function SortFormArray(Form[] akForms, int sortOption = 1) Global Native

;returns new form array that contains the forms in akList
;Sort options are as follows. Note, to sort by editor Id reliably, po3 tweaks must be installed.
;1 = by form name ascending,
;2 = by form name descending,
;3 = by form editor Id name ascending,
;4 = by form editor Id name descending,
;5 = by form Id ascending,
;6 = by form Id descending
Form[] Function FormListToArray(Formlist akList, int sortOption = 0) Global Native

;Add forms in akForms array to akList
Function AddFormsToList(Form[] akForms, Formlist akList) Global Native

;if maxCharacters is greater than 0, limits the number of characters for descriptions.
;If a description exceeds maxCharacters, adds the overMaxCharacterSuffix to the end of the description.
;if newLineReplacer is not empty "", replaces new lines in description with newLineReplacer
;if noneStringType is 1 and a description is empty, "", gets editorID instead of the description
;if noneStringType is 2 and a description is empty, "", gets form ID instead of the description
;if akForm is none, returns nullFormString
String Function GetFormDescription(form akForm, int maxCharacters = 0, string overMaxCharacterSuffix = "...", string newLineReplacer = " ", int noneStringType = 0, string nullFormString = "Null") Global Native

;get form descriptions for akForms.
;if maxCharacters is greater than 0, limits the number of characters for descriptions.
;If a description exceeds maxCharacters, adds the overMaxCharacterSuffix to the end of the description.
;if noneStringType is 1 and a description is empty, "", gets editorID instead of the description
;if noneStringType is 2 and a description is empty, "", gets form ID instead of the description
;if akForm is none, sets nullFormString for that form.
;Sort options are as follows. Note, to sort by editor Id reliably, po3 tweaks must be installed.
;0 = not sorted,
;1 = sorted by description ascending,
;2 = sorted by description descending,
;3 = by form name ascending,
;4 = by form name descending,
;5 = by form editor Id name ascending,
;6 = by form editor Id name descending,
;7 = by form Id ascending,
;8 = by form Id descending
String[] Function GetFormDescriptions(Form[] akForms, int sortOption = 0, int maxCharacters = 0, string overMaxCharacterSuffix = "...", string newLineReplacer = " ", int noneStringType = 0, string nullFormString = "Null") Global Native

;get form descriptions for forms in akFormList.
;if maxCharacters is greater than 0, limits the number of characters for descriptions.
;If a description exceeds maxCharacters, adds the overMaxCharacterSuffix to the end of the description.
;if noneStringType is 1 and a description is empty, "", gets editorID instead of the description
;if noneStringType is 2 and a description is empty, "", gets form ID instead of the description
;if akForm is none, sets nullFormString for that form.
;Sort options are as follows. Note, to sort by editor Id reliably, po3 tweaks must be installed.
;0 = not sorted,
;1 = sorted by description ascending,
;2 = sorted by description descending,
;3 = by form name ascending,
;4 = by form name descending,
;5 = by form editor Id name ascending,
;6 = by form editor Id name descending,
;7 = by form Id ascending,
;8 = by form Id descending
String[] Function GetFormDescriptionsFromList(Formlist akFormList, int sortOption = 0, int maxCharacters = 0, string overMaxCharacterSuffix = "...", string newLineReplacer = " ", int noneStringType = 0, string nullFormString = "Null") Global Native

;get form names for akForms
;if noneStringType is 1 and a name is empty, "", gets editorID instead of name
;if noneStringType is 2 and a name is empty, "", gets form ID instead of name
;if a form is none, sets nullFormString for that form
;Sort options are as follows. 0 = not sorted, 1 = sorted by name ascending, 2 = sorted by name descending.
String[] Function GetFormNames(Form[] akForms, int sortOption = 0, int noneStringType = 0, string nullFormString = "Null") Global Native

;get form names for forms in akFormList
;if noneStringType is 1 and a name is empty, "", gets editorID instead of name
;if noneStringType is 2 and a name is empty, "", gets form ID instead of name
;if a form is none, sets nullFormString for that form
;Sort options are as follows. 0 = not sorted, 1 = sorted by name ascending, 2 = sorted by name descending.
String[] Function GetFormNamesFromList(Formlist akFormList, int sortOption = 0, int noneStringType = 0, string nullFormString = "Null") Global Native

;Get form editor Id name.
;If akForm is none, returns nullFormString
string function GetFormEditorId(Form akForm, string nullFormString = "Null") Global Native

;get form editor id names for akForms
;if a form is none, sets nullFormString for that form
;Sort options are as follows. 0 = not sorted, 1 = sorted by name ascending, 2 = sorted by name descending.
;Note, to get editor Ids reliably, po3 tweaks must be installed.
string[] function GetFormEditorIds(Form[] akForms, int sortOption = 0, string nullFormString = "Null") Global Native

;get form editor id names for forms in akFormList
;if a form is none, sets nullFormString for that form
;Sort options are as follows. 0 = not sorted, 1 = sorted by name ascending, 2 = sorted by name descending.
;Note, to get editor Ids reliably, po3 tweaks must be installed.
string[] function GetFormEditorIdsFromList(Formlist akFormList, int sortOption = 0, string nullFormString = "Null") Global Native

;Sort options are as follows. 0 = not sorted, 1 = sorted by name ascending, 2 = sorted by name descending.
String[] Function GetLoadedModNames(int sortOption = 0) Global Native

;Sort options are as follows. 0 = not sorted, 1 = sorted by name ascending, 2 = sorted by name descending.
String[] Function GetLoadedLightModNames(int sortOption = 0) Global Native

;Get all loaded mod names, (regular mods and light mods)
;Sort options are as follows. 0 = not sorted, 1 = sorted by name ascending, 2 = sorted by name descending.
String[] Function GetAllLoadedModNames(int sortOption = 0) Global Native

;get loaded mod descriptions.
;if maxCharacters is greater than 0, limits the number of characters for descriptions.
;If a description exceeds maxCharacters, adds the overMaxCharacterSuffix to the end of the description.
;Sort options are as follows. 0 = not sorted, 1 = sorted by Description ascending, 2 = sorted by Description descending, 3 sorted by mod name ascending, 4 = sorted by mod name descending.
String[] Function GetLoadedModDescriptions(int sortOption = 0, int maxCharacters = 0, string overMaxCharacterSuffix = "...", string newLineReplacer = " ") Global Native

;get loaded light mod descriptions.
;if maxCharacters is greater than 0, limits the number of characters for descriptions.
;If a description exceeds maxCharacters, adds the overMaxCharacterSuffix to the end of the description.
;Sort options are as follows. 0 = not sorted, 1 = sorted by Description ascending, 2 = sorted by Description descending, 3 sorted by mod name ascending, 4 = sorted by mod name descending.
String[] Function GetLoadedLightModDescriptions(int sortOption = 0, int maxCharacters = 0, string overMaxCharacterSuffix = "...", string newLineReplacer = " ") Global Native

;get all loaded mod descriptions, (regular mods and light mods)
;if maxCharacters is greater than 0, limits the number of characters for descriptions.
;If a description exceeds maxCharacters, adds the overMaxCharacterSuffix to the end of the description.
;Sort options are as follows. 0 = not sorted, 1 = sorted by Description ascending, 2 = sorted by Description descending, 3 sorted by mod name ascending, 4 = sorted by mod name descending.
String[] Function GetAllLoadedModDescriptions(int sortOption = 0, int maxCharacters = 0, string overMaxCharacterSuffix = "...", string newLineReplacer = " ") Global Native

;get all constructible objects that create the createdObject.
;if none is passed in, get's all constructible objects in game.
ConstructibleObject[] Function GetAllConstructibleObjects(Form createdObject) global native

;Get all armors in game that use the slotMask
Armor[] Function GetAllArmorsForSlotMask(int slotMask) global native

WorldSpace function GetCellWorldSpace(cell akCell) global native

Location Function GetCellLocation(cell akCell) global native

;Get all interior cells in game that match the akLocation and or akOwner
;if matchMode == 0, get all cells in game where either the passed in akLocation or akOwner match.
;if matchMode == 1, get all cells in game where both the passed in akLocation and akOwner match.
;if matchMode == anything else, get all interior cells in game
cell[] Function GetAllInteriorCells(Location akLocation, Actorbase akOwner, int matchMode = 0) global native

;Get all exterior cells in game that match the akLocation and or akWorldSpace
;if matchMode == 0, get all cells in game where either the passed in akLocation or akWorldSpace match.
;if matchMode == 1, get all cells in game where both the passed in akLocation and akWorldSpace match.
;if matchMode == anything else, get all interior cells in game
cell[] Function GetAllExteriorCells(Location akLocation, WorldSpace akWorldSpace, int matchMode = 0) global native

;Get all cells currently attached
cell[] Function GetAttachedCells() global native

;Get forms currently favorited by the player
;formTypeMatchMode 1 = forms who match a type in formTypes.
;formTypeMatchMode 0 = forms that match none of the types in formTypes.
;formTypeMatchMode -1 (or if formTypes == none) = formType filter is ignored completely, get all favorited forms regardless of type.
Form[] function GetFavorites(int[] formTypes = none, int formTypeMatchMode = 1) Global Native

;Get all forms who's name (with GetName()) match the sFormName.
;nameMatchMode 0 = exact match, 1 = name contains sFormName.
;formTypeMatchMode 1 = forms who match a type in formTypes.
;formTypeMatchMode 0 = forms that match none of the types in formTypes.
;formTypeMatchMode -1 (or if formTypes == none) = formType filter is ignored completely, get all forms regardless of type that match (or contain) sFormName.
Form[] Function GetAllFormsWithName(string sFormName, int nameMatchMode = 0, int[] formTypes = none, int formTypeMatchMode = 1) Global Native

;formTypeMatchMode 1 = forms that have a type in formTypes.
;formTypeMatchMode 0 = forms that do not have a type in formTypes.
;formTypeMatchMode -1 (or if formTypes == none) = formType filter is ignored completely, get all forms regardless of type that have the script with sScriptName attached
Form[] Function GetAllFormsWithScriptAttached(string sScriptName, int[] formTypes = none, int formTypeMatchMode = 0) Global Native

Alias[] Function GetAllAliasesWithScriptAttached(string sScriptName) Global Native

ReferenceAlias[] Function GetAllRefAliasesWithScriptAttached(string sScriptName, bool onlyQuestObjects = false, bool onlyFilled = false) Global Native

;Get all quests in game currently being tracked by the player.
Quest[] Function GetAllActiveQuests() Global Native

;Get all ReferenceAlias's in game.
;if onlyQuestObjects is true, only gets ref alias's that have the Quest Object box checked
;if onlyFilled is true, only gets ref alias's that are filled with a valid object reference.
ReferenceAlias[] function GetAllRefaliases(bool onlyQuestObjects = false, bool onlyFilled = false) global native

;Get all quest object references in game
ObjectReference[] function GetAllQuestObjectRefs() Global Native

;Get all quest object references in the containerRef
ObjectReference[] function GetQuestObjectRefsInContainer(ObjectReference containerRef) Global Native

TextureSet Function GetProjectileBaseDecal(projectile akProjectile) Global Native
Bool Function SetProjectileBaseDecal(projectile akProjectile, TextureSet decalTextureSet) Global Native

Explosion Function GetProjectileBaseExplosion(projectile akProjectile) Global Native
Bool Function SetProjectileBaseExplosion(projectile akProjectile, Explosion akExplosion) Global Native

Float Function GetProjectileBaseCollisionRadius(projectile akProjectile) Global Native
Bool Function SetProjectileBaseCollisionRadius(projectile akProjectile, Float radius) Global Native

Float Function GetProjectileBaseCollisionConeSpread(projectile akProjectile) Global Native
Bool Function SetProjectileBaseCollisionConeSpread(projectile akProjectile, Float coneSpread) Global Native

;get the type of the projectileRef
;projectile types are: 1 = Missile, 2 = Grenade, 3 = Beam, 4 = Flamethrower, 5 = Cone, 6 = Barrier, 7 = Arrow, 0 = unrecognized.
int function GetProjectileRefType(ObjectReference projectileRef) Global Native

;get projectiles currently attached to the ref
;only works if the ref is an actor
Projectile[] Function GetAttachedProjectiles(ObjectReference ref) Global Native

;get projectile object references attached to the ref
;only works if the ref is not an actor
Projectile[] Function GetAttachedProjectileRefs(ObjectReference ref) Global Native

;get all projectile object references that hit the ref that match the conditions.
;projectileTypes are: 1 = Missile, 2 = Grenade, 3 = Beam, 4 = Flamethrower, 5 = Cone, 6 = Barrier, 7 = Arrow.
;if the projectileType param is none of those types, returns all projectiles that have hit the ref regardless of type.
ObjectReference[] function GetAllHitProjectileRefsOfType(ObjectReference ref, bool only3dLoaded = true, bool onlyEnabled = true, int projectileType = 7) Global Native

;get all projectile object references that were shot by the ref that match the conditions.
;projectileTypes are: 1 = Missile, 2 = Grenade, 3 = Beam, 4 = Flamethrower, 5 = Cone, 6 = Barrier, 7 = Arrow.
;if the projectileType param is none of those types, returns all projectiles that the ref has shot regardless of type.
ObjectReference[] function GetAllShotProjectileRefsOfType(ObjectReference ref, bool only3dLoaded = true, bool onlyEnabled = true, int projectileType = 7) Global Native

;get recent projectile object references that hit the ref that match the conditions.
;projectileTypes are: 1 = Missile, 2 = Grenade, 3 = Beam, 4 = Flamethrower, 5 = Cone, 6 = Barrier, 7 = Arrow.
;if the projectileType param is none of those types, returns all recent projectiles that have hit the ref regardless of type.
;requires iMaxArrowsSavedPerReference to be set to greater than 0 in DbSkseFunctions.ini
ObjectReference[] function GetRecentProjectileHitRefs(ObjectReference ref, bool only3dLoaded = true, bool onlyEnabled = true, int projectileType = 7) Global Native

;get the last projectile object reference that hit the ref that match the conditions.
;projectileTypes are: 1 = Missile, 2 = Grenade, 3 = Beam, 4 = Flamethrower, 5 = Cone, 6 = Barrier, 7 = Arrow.
;if the projectileType param is none of those types, returns the last projectile that hit the ref regardless of type
;requires iMaxArrowsSavedPerReference to be set to greater than 0 in DbSkseFunctions.ini
ObjectReference function GetLastProjectileHitRef(ObjectReference ref, bool only3dLoaded = true, bool onlyEnabled = true, int projectileType = 7) Global Native

;get recent projectile object references that were shot by the ref that match the conditions.
;projectileTypes are: 1 = Missile, 2 = Grenade, 3 = Beam, 4 = Flamethrower, 5 = Cone, 6 = Barrier, 7 = Arrow.
;if the projectileType param is none of those types, returns all recent projectiles that the ref has shot regardless of type.
;requires iMaxArrowsSavedPerReference to be set to greater than 0 in DbSkseFunctions.ini
ObjectReference[] function GetRecentProjectileShotRefs(ObjectReference ref, bool only3dLoaded = true, bool onlyEnabled = true, int projectileType = 7) Global Native

;get the last projectile object reference that was shot by the ref that match the conditions.
;projectileTypes are: 1 = Missile, 2 = Grenade, 3 = Beam, 4 = Flamethrower, 5 = Cone, 6 = Barrier, 7 = Arrow.
;if the projectileType param is none of those types, returns the last projectile was shot by the ref regardless of type
;requires iMaxArrowsSavedPerReference to be set to greater than 0 in DbSkseFunctions.ini
ObjectReference function GetLastProjectileShotRef(ObjectReference ref, bool only3dLoaded = true, bool onlyEnabled = true, int projectileType = 7) Global Native

;get the object reference(s) that the projectileRef hit (collided with). Most of the time this is 1 object, sometimes it's more.
ObjectReference[] function GetProjectileHitRefs(ObjectReference projectileRef) Global Native

;get the object reference that shot the projectileRef
ObjectReference function GetProjectileShooter(ObjectReference projectileRef) Global Native

;Get the ammo that the projectileRef was shot with if any
Ammo function GetProjectileAmmoSource(ObjectReference projectileRef) Global Native

;Get the poison the projectileRef was shot with if any
Potion function GetProjectilePoison(ObjectReference projectileRef) Global Native

;Get the enchantment the projectileRef was shot with if any
Enchantment function GetProjectileEnchantment(ObjectReference projectileRef) Global Native

;Get the magic item that shot the projectileRef if any
;Most likely a spell or shout
Form function GetProjectileMagicSource(ObjectReference projectileRef) Global Native

;Get the weapon that the projectileRef was shot from if any
;Most likely a bow or crossbow.
Weapon function GetProjectileWeaponSource(ObjectReference projectileRef) Global Native

; Get the damage of the weapon that shot the projectileRef if any
float function GetProjectileWeaponDamage(ObjectReference projectileRef) Global Native

;get the explosion for the projectileRef, if any.
Explosion function GetProjectileExplosion(ObjectReference projectileRef) Global Native

float function GetProjectilePower(ObjectReference projectileRef) Global Native

float function GetProjectileDistanceTraveled(ObjectReference projectileRef) Global Native

;impactResults are: 0 = none, 1 = destroy, 2 = bounce, 3 = impale, 4 = stick
int function GetProjectileImpactResult(ObjectReference projectileRef) Global Native

;get the node names that the projectileRef has hit.
;these only seem to be valid if the projectileRef hit an actor.
;i.e "NPC Head [Head]", "NPC Spine1 [Spn1]" ect.
string[] function GetProjectileNodeHitNames(ObjectReference projectileRef) Global Native

; get the collision layers the projectileRef has collided with
int[] function GetProjectileCollidedLayers(ObjectReference projectileRef) Global Native

; get names of the collision layers the projectileRef has collided with
string[] function GetProjectileCollidedLayerNames(ObjectReference projectileRef) Global Native

; get the string of the collision layer. i.e "Biped", "static", "trees" ect
; names are as follows:
; Unidentified = 0,
; Static = 1,
; AnimStatic = 2,
; Transparent = 3,
; Clutter = 4,
; Weapon = 5,
; Projectile = 6,
; Spell = 7,
; Biped = 8,
; Trees = 9,
; Props = 10,
; Water = 11,
; Trigger = 12,
; Terrain = 13,
; Trap = 14,
; NonCollidable = 15,
; CloudTrap = 16,
; Ground = 17,
; Portal = 18,
; DebrisSmall = 19,
; DebrisLarge = 20,
; AcousticSpace = 21,
; ActorZone = 22,
; ProjectileZone = 23,
; GasTrap = 24,
; ShellCasting = 25,
; TransparentWall = 26,
; InvisibleWall = 27,
; TransparentSmallAnim = 28,
; ClutterLarge = 29,
; CharController = 30,
; StairHelper = 31,
; DeadBip = 32,
; BipedNoCC = 33,
; AvoidBox = 34,
; CollisionBox = 35,
; CameraSphere = 36,
; DoorDetection = 37,
; ConeProjectile = 38,
; Camera = 39,
; ItemPicker = 40,
; LOS = 41,
; PathingPick = 42,
; Unused0 = 43,
; Unused1 = 44,
; SpellExplosion = 45,
; DroppingPick = 46
string function GetCollisionLayerName(int layer) Global Native

;get the last object reference that the player activated
ObjectReference function GetLastPlayerActivatedRef() Global Native

;get the last object reference that the player activated after a menu was opened
ObjectReference function GetLastPlayerMenuActivatedRef() Global Native

;If the ref is an ashpile, gets the actor linked to it, if any. If the ref is an actor, gets the ashpile linked to it, if any.
ObjectReference function GetAshPileLinkedRef(ObjectReference ref) Global Native

;Get the closest object reference in the refs array to the ref
ObjectReference function GetClosestObjectFromRef(ObjectReference ref, ObjectReference[] refs) Global Native

;Get the index of the closest object reference in the refs array to the ref
int function GetClosestObjectIndexFromRef(ObjectReference ref, ObjectReference[] refs) Global Native

float function GetGameHoursPassed() Global Native

;Calculate how many real time seconds it will take for gameHours to pass based on current time scale.
;Example - with default time scale (20), GameHoursToRealTimeSeconds(1) returns 180.0
float Function GameHoursToRealTimeSeconds(float gameHours) Global Native

bool Function IsGamePaused() Global Native

;returns true if a menu is open, (other than the hud menu which is always open), regardless if the game is paused or not.
bool Function IsInMenu() Global Native

string Function GetLastMenuOpened() Global Native

;differs from consoleUtil.ExecuteCommand in that you can execute a targeted command on a passed in ref.
;if ref == none and command is targeted command, runs command on console selected ref like normal.
;If no console selected ref, or is not a targeted command, executes command like normal.
Function ExecuteConsoleCommand(String command, ObjectReference ref = none) Global Native

;does the ref have collision?
bool Function HasCollision(ObjectReference ref) Global Native

;toggle collision on ref using tcl console command
;requires powerofthree's Tweaks to work.
;https://www.nexusmods.com/skyrimspecialedition/mods/51073?tab=description
function ToggleCollision(ObjectReference ref) Global
    Guard()
EndFunction

;enable or disable collision on ref using tcl console command
;requires powerofthree's Tweaks to work.
Function SetCollision(ObjectReference ref, bool enabled) Global
    Guard()
EndFunction

;set the max Soul size the soulGem (base form) can hold. 0 = no soul up to 5 = grand.
Function SetSoulGemSize(SoulGem akSoulGem, int level) Global Native

;can the soulGem hold an NPC soul? I.E is it a black soul gem?
bool Function CanSoulGemHoldNPCSoul(SoulGem akSoulGem) Global Native

;set soul gem can hold npc soul, I.E make it a black soul gem or not.
Function SetSoulGemCanHoldNPCSoul(SoulGem akSoulGem, bool canHold) Global Native

;get MusicType that's currently playing
MusicType Function GetCurrentMusicType() Global Native

int Function GetNumberOfTracksInMusicType(MusicType akMusicType) Global Native

;get the current track index queued in akMusicType
int Function GetMusicTypeTrackIndex(MusicType akMusicType) Global Native

;if the akMusicType is currently playing, it will jump to the track index passed in.
Function SetMusicTypeTrackIndex(MusicType akMusicType, int index) Global Native

int Function GetMusicTypePriority(MusicType akMusicType) Global Native

Function SetMusicTypePriority(MusicType akMusicType, int priority) Global Native

;MusicTypeStatus is as follows
;kInactive = 0
;kPlaying = 1
;kPaused = 2
;kFinishing = 3
;kFinished = 4
int Function GetMusicTypeStatus(MusicType akMusicType) Global Native

Enchantment[] Function GetKnownEnchantments() Global Native
Function AddKnownEnchantmentsToFormList(Formlist akList) Global Native

String function GetWordOfPowerTranslation(WordOfPower akWord) Global Native

;add shout to player if necessary and unlock all of its Words
function UnlockShout(shout akShout) Global Native

;add and unlock all shouts to the player that match the param filters.
;default is adding and unlocking ALL shouts found in game to player
function AddAndUnlockAllShouts(int minNumberOfWordsWithTranslations = 0, bool onlyShoutsWithNames = false, bool onlyShoutsWithDescriptions = false) Global Native

; furniture workbench types are:
; None = 0,
; CreateObject = 1,
; SmithingWeapon = 2,
; Enchanting = 3,
; EnchantingExperiment = 4,
; Alchemy = 5,
; AlchemyExperiment = 6,
; SmithingArmor = 7
int Function GetFurnitureWorkbenchType(furniture akFurniture) Global Native

;return string will be an actor value skill such as "smithing", "enchanting" ect.
String Function GetFurnitureWorkbenchSkillString(furniture akFurniture) Global Native

;/
valid skills for use with the 'string skill' params in following book functions
aggression
confidence
energy
morality
mood
assistance
onehanded
twohanded
marksman
block
smithing
heavyarmor
lightarmor
pickpocket
lockpicking
sneak
alchemy
speechcraft
alteration
conjuration
destruction
illusion
restoration
enchanting
health
magicka
stamina
healrate
magickarate
staminarate
speedmult
inventoryweight
carryweight
criticalchance
meleedamage
unarmeddamage
mass
voicepoints
voicerate
damageresist
poisonresist
resistfire
resistshock
resistfrost
resistmagic
resistdisease
perceptioncondition
endurancecondition
leftattackcondition
rightattackcondition
leftmobilitycondition
rightmobilitycondition
braincondition
paralysis
invisibility
nighteye
detectliferange
waterbreathing
waterwalking
ignorecrippledlimbs
fame
infamy
jumpingbonus
wardpower
rightitemcharge
armorperks
shieldperks
warddeflection
variable01
variable02
variable03
variable04
variable05
variable06
variable07
variable08
variable09
variable10
bowspeedbonus
favoractive
favorsperday
favorsperdaytimer
leftitemcharge
absorbchance
blindness
weaponspeedmult
shoutrecoverymult
bowstaggerbonus
telekinesis
favorpointsbonus
lastbribedintimidated
lastflattered
movementnoisemult
bypassvendorstolencheck
bypassvendorkeywordcheck
waitingforplayer
onehandedmodifier
twohandedmodifier
marksmanmodifier
blockmodifier
smithingmodifier
heavyarmormodifier
lightarmormodifier
pickpocketmodifier
lockpickingmodifier
sneakingmodifier
alchemymodifier
speechcraftmodifier
alterationmodifier
conjurationmodifier
destructionmodifier
illusionmodifier
restorationmodifier
enchantingmodifier
onehandedskilladvance
twohandedskilladvance
marksmanskilladvance
blockskilladvance
smithingskilladvance
heavyarmorskilladvance
lightarmorskilladvance
pickpocketskilladvance
lockpickingskilladvance
sneakingskilladvance
alchemyskilladvance
speechcraftskilladvance
alterationskilladvance
conjurationskilladvance
destructionskilladvance
illusionskilladvance
restorationskilladvance
enchantingskilladvance
leftweaponspeedmultiply
dragonsouls
combathealthregenmultiply
onehandedpowermodifier
twohandedpowermodifier
marksmanpowermodifier
blockpowermodifier
smithingpowermodifier
heavyarmorpowermodifier
lightarmorpowermodifier
pickpocketpowermodifier
lockpickingpowermodifier
sneakingpowermodifier
alchemypowermodifier
speechcraftpowermodifier
alterationpowermodifier
conjurationpowermodifier
destructionpowermodifier
illusionpowermodifier
restorationpowermodifier
enchantingpowermodifier
dragonrend
attackdamagemult
healratemult
magickarate
staminarate
werewolfperks
vampireperks
grabactoroffset
grabbed
deprecated05
reflectdamage
/;

string function GetBookSkill(book akBook) Global Native

;sets the skill book teaches. If skill is "", removes TeachesSkill flag from book. (Book will no longer teach a skill.)
;not save persistent, use a load game event for maintenance
function SetBookSkill(book akBook, string skill) Global Native

;get all books that teach the skill
book[] function GetSkillBooksForSkill(string skill) Global Native

;add all books that teach skill to akList
function AddSkillBookForSkillToList(string skill, formlist akList) Global Native

;Sets spell book tome teaches. If akSpell is none, removes TeachesSpell flag from book. (Book will no longer teach a spell.)
;not save persistent, use a load game event for maintenance
function SetBookSpell(book akBook, spell akSpell) Global Native

;get the first spell tome found that teaches akSpell, or none if not found.
Book function GetSpellTomeForSpell(spell akSpell) Global Native

;get all spell tomes that teach akSpell, or empty array if none found.
Book[] function GetSpellTomesForSpell(spell akSpell) Global Native

;add all spell tomes that teach akSpell to akList
function AddSpellTomesForSpellToList(spell akSpell, FormList akList) Global Native

;if read is true, set akBook  as 'read', otherwise set akBook as 'unread'
;if read is false and akBook is a skill book, the skill from the book can be increased again when reading.
function SetBookRead(book akBook, bool read) Global Native

;if read is true, set all books in game as 'read', otherwise set all books in game as 'unread'
function SetAllBooksRead(bool read) Global Native

;get source that the ActiveMagicEffect came from
;Could be a spell, enchantment, potion, or ingredient. Use GetType() to find out which.
Form Function GetActiveEffectSource(ActiveMagicEffect akEffect) Global Native

; -1 = not applicable or not found
; 0 = conditions not met, the active effect is not affecting the reference it's on.
; 1 = conditions met, the active effect is affecting the reference it's on
int Function GetActiveMagicEffectConditionStatus(ActiveMagicEffect akEffect) Global Native

;Get casting source that the ActiveMagicEffect came from
;kLeftHand = 0,
;kRightHand = 1,
;kOther = 2, (most likely shout)
;kInstant = 3
int Function GetActiveEffectCastingSource(ActiveMagicEffect akEffect) Global Native

;get magic effects for akForm, assuming akForm is a magic item such as a spell, potion, shout, enchantment, scroll ect...
MagicEffect[] Function GetMagicEffectsForForm(Form akForm) Global Native

;is the form a magic item such as spell, potion, shout, enchantment, scroll ect...?
bool Function IsFormMagicItem(Form akForm) Global Native

;is the akMagicEffect currently affecting the ref?
;if magicSource is not none, only returns true if the activeMagicEffect matches the akMagicEffect and it's condition status is true and comes from the magicSource (spell, shout, potion ect)
;Otherwise, returns true if activeMagicEffect matches the akMagicEffect and it's condition status is true regardless of source.
bool Function IsMagicEffectActiveOnRef(ObjectReference ref, MagicEffect akMagicEffect, Form magicSource = none) Global Native

;if magicSource is not none, only dispels effects that come from the magicSource (spell, shout, potion ect)
;Otherwise, dispels all activeMagicEffects that match the akMagicEffect
Function DispelMagicEffectOnRef(ObjectReference ref, MagicEffect akMagicEffect, Form magicSource = none) Global Native

;would the akActor be stealing the akTarget if they took it?
Bool Function WouldActorBeStealing(actor akActor, ObjectReference akTarget) Global Native
Bool Function IsActorAttacking(actor akActor) Global Native
Bool Function IsActorPowerAttacking(actor akActor) Global Native
Bool Function IsActorSpeaking(actor akActor) Global Native
Bool Function IsActorBlocking(actor akActor) Global Native
Bool Function IsActorCasting(actor akActor) Global Native
Bool Function IsActorDualCasting(actor akActor) Global Native
Bool Function IsActorStaggered(actor akActor) Global Native
Bool Function IsActorRecoiling(actor akActor) Global Native
Bool Function IsActorIgnoringCombat(actor akActor) Global Native
Bool Function IsActorUndead(actor akActor) Global Native
Bool Function IsActorOnFlyingMount(actor akActor) Global Native
Bool Function IsActorAMount(actor akActor) Global Native
Bool Function IsActorInMidAir(actor akActor) Global Native
Bool Function IsActorInRagdollState(actor akActor) Global Native
Bool Function IsActorFleeing(actor akActor) Global Native
int Function GetDetectionLevel(actor akActor, actor akTarget) Global Native

;ward states are 0 = none, 1 = absorbing, 2 = break
int Function GetActorWardState(actor akActor) Global Native

String Function GetKeywordString(keyword akKeyword) Global Native

;doesn't carry over between saves. Use load game event for maintenace
function SetKeywordString(keyword akKeyword, string keywordString) Global Native

;create new forms of these types at runtime.
;carefull with these. Using these functions are like using PlaceAtMe to create permanent references.
;Making too many of these may cause save game bloat, so use sparingly.
Formlist Function CreateFormList(formlist fillerList = none) Global Native
ColorForm Function CreateColorForm(int color = 0xf) Global Native
Keyword Function CreateKeyword() Global Native
ConstructibleObject Function CreateConstructibleObject() Global Native
TextureSet Function CreateTextureSet() Global Native

;Create new sound. to set the sound, use Papyrus Extender, 'Po3_SkseFunctions.SetSoundDescriptor(newSoundMarker, akSoundDescriptor)'
Sound Function CreateSoundMarker() Global Native

;PlaySound / PlaySoundDescriptor returns instanceID like Sound.play(), but you can pass in a form, alias or activeMagicEffect to receive the OnSoundFinish Event.
;Example, if your script extends form:
;DbSkseFunctions.PlaySound(akSound, Game.GetPlayer(), 1.0, self) ;play sound and receive the OnSoundFinish event when sound finishes playing.
;You can also set a start volume.
int Function PlaySound(Sound akSound, ObjectReference akSource, float volume = 1.0, Form eventReceiverForm = none, Alias eventReceiverAlias = none, activeMagicEffect eventReceiverActiveEffect = none) Global Native
int Function PlaySoundDescriptor(SoundDescriptor akSoundDescriptor, ObjectReference akSource, float volume = 1.0, Form eventReceiverForm = none, Alias eventReceiverAlias = none, activeMagicEffect eventReceiverActiveEffect = none) Global Native

;set the sound source for the currently playing soundId to the passed in ref.
;this function will only work for sounds playing from PlaySound or PlaySoundDescriptor from this script
;I also found a strange bug. If the sound's source is the player and the player is in first person, this function will fail to set the ref as the new source.
;If however the player is in third person, this function will succeed in setting the ref as the new source for the sound instanceID
Bool Function SetSoundInstanceSource(int instanceID, ObjectReference ref) Global Native

;sends the sound or soundDescriptor played and the instanceID
;only works for sounds played from PlaySound or PlaySoundDescriptor from this script
Event OnSoundFinish(Form SoundOrDescriptor, int instanceID)
EndEvent

SoundCategory Function GetParentSoundCategory(SoundCategory akSoundCategory) Global Native
SoundCategory Function GetSoundCategoryForSoundDescriptor(SoundDescriptor akSoundDescriptor) Global Native
Function SetSoundCategoryForSoundDescriptor(SoundDescriptor akSoundDescriptor, SoundCategory akSoundCategory) Global Native
Float Function GetSoundCategoryVolume(SoundCategory akSoundCategory) Global Native
Float Function GetSoundCategoryFrequency(SoundCategory akSoundCategory) Global Native

;/map marker icon types:
kNone = 0,
kCity = 1,
kTown = 2,
kSettlement = 3,
kCave = 4,
kCamp = 5,
kFort = 6,
kNordicRuins = 7,
kDwemerRuin = 8,
kShipwreck = 9,
kGrove = 10,
kLandmark = 11,
kDragonLair = 12,
kFarm = 13,
kWoodMill = 14,
kMine = 15,
kImperialCamp = 16,
kStormcloakCamp = 17,
kDoomstone = 18,
kWheatMill = 19,
kSmelter = 20,
kStable = 21,
kImperialTower = 22,
kClearing = 23,
kPass = 24,
kAlter = 25,
kRock = 26,
kLighthouse = 27,
kOrcStronghold = 28,
kGiantCamp = 29,
kShack = 30,
kNordicTower = 31,
kNordicDwelling = 32,
kDocks = 33,
kShrine = 34,
kRiftenCastle = 35,
kRiftenCapitol = 36,
kWindhelmCastle = 37,
kWindhelmCapitol = 38,
kWhiterunCastle = 39,
kWhiterunCapitol = 40,
kSolitudeCastle = 41,
kSolitudeCapitol = 42,
kMarkarthCastle = 43,
kMarkarthCapitol = 44,
kWinterholdCastle = 45,
kWinterholdCapitol = 46,
kMorthalCastle = 47,
kMorthalCapitol = 48,
kFalkreathCastle = 49,
kFalkreathCapitol = 50,
kDawnstarCastle = 51,
kDawnstarCapitol = 52,
kDLC02_TempleOfMiraak = 53,
kDLC02_RavenRock = 54,
kDLC02_BeastStone = 55,
kDLC02_TelMithryn = 56,
kDLC02_ToSkyrim = 57,
kDLC02_ToSolstheim = 58
Big Cave = 59
60 = none
Lock = 61
Flashing Arrow = 62
Flashing quest marker = 63 (don't use, it'll get stuck)
3 flashing arrows = 64
blue arrow = 65
player flashing arrow = 66
Big circle = any other value
/;

;returns true if Ref has map data.
bool function IsMapMarker(ObjectReference Ref) Global Native

;For these functions the MapMarker ObjectReference must be a map marker with map marker data.
;In other words, IsMapMarker must return true;
int function GetMapMarkerIconType(ObjectReference MapMarker) Global Native

bool function SetMapMarkerIconType(ObjectReference MapMarker, int iconType) Global Native

string function GetMapMarkerName(ObjectReference MapMarker) Global Native

bool function SetMapMarkerName(ObjectReference MapMarker, String Name) Global Native

;Get is the vanilla ObjectReference function mapMarker.IsMapMarkerVisible()
bool function SetMapMarkerVisible(ObjectReference MapMarker, bool visible) Global Native

;Get is the vanilla ObjectReference function mapMarker.CanFastTravelToMarker()
bool function SetCanFastTravelToMarker(ObjectReference MapMarker, bool canTravelTo) Global Native

Form function GetCellOrWorldSpaceOriginForRef(ObjectReference ref) Global Native

;This function is usefull if you have to move a map marker from one worldspace to another using MoveTo and have it display on the world map.
;This function will only be successfull if the passed in ref has been moved from its original worldspace or interior cell so...
;use moveto on the ref first before this function is used.
bool function SetCellOrWorldSpaceOriginForRef(ObjectReference ref, Form cellOrWorldSpace) Global Native

; get all map marker refs valid for the current world space or interior cell grid, (can potentially be viewed on the current map)
; for the filter params:
; -1 = filter is ignored
;  0 = (false) only get markers that are not visible or can't be fast traveled to
;  1 = (true)  only get markers that are visible or that can be fast traveled to
ObjectReference[] function GetCurrentMapMarkerRefs(int visibleFilter = -1, int canTravelToFilter = -1) Global Native

; get all map marker refs in game
; for the filter params:
; -1 = filter is ignored
;  0 = (false) only get markers that are not visible or can't be fast traveled to
;  1 = (true)  only get markers that are visible or that can be fast traveled to
ObjectReference[] function GetAllMapMarkerRefs(int visibleFilter = -1, int canTravelToFilter = -1) Global Native


Function Guard()
    Debug.MessageBox("DbSkseFunctions: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
