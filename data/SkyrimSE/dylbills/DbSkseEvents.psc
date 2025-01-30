Scriptname DbSkseEvents hidden
;/
These are global events. The eventreceiver is what receives the event.

Filters:
You can pass in one form paramFilter to compare with the event.
the paramFilterIndex chooses which parameter to compare. 0 is the first form param, 1 is the second ect.

example script:
Scriptname MyQuestScript extends Quest

Weapon Property IronSword Auto
Ammo Property IronArrow Auto
Projectile Property ArrowIronProjectile Auto

Event Oninit()
	DbSkseEvents.RegisterFormForGlobalEvent("OnHitGlobal", Self, game.GetPlayer(), 0) 	 ;compare player with 'Attacker'. Registers for when the player hits anything
	DbSkseEvents.RegisterFormForGlobalEvent("OnHitGlobal", Self, game.GetPlayer(), 1) 	 ;compare player with 'Target'. Registers for when the player is hit by anything
	DbSkseEvents.RegisterFormForGlobalEvent("OnHitGlobal", Self, IronSword, 2) 		  	 ;compare IronSword with 'Source'. Register for when anything is hit with an IronSword.
	DbSkseEvents.RegisterFormForGlobalEvent("OnHitGlobal", Self, IronArrow, 3) 		  	 ;compare IronArrow with 'akAmmo'. Register for when anything is hit with an IronArrow.
	DbSkseEvents.RegisterFormForGlobalEvent("OnHitGlobal", Self, ArrowIronProjectile, 4) ;compare ArrowIronProjectile with 'akProjectile'. Register for when anything is hit with an ArrowIronProjectile. (this is unreliable, better to compare akAmmo when possible.)
	DbSkseEvents.RegisterFormForGlobalEvent("OnHitGlobal", Self) 						 ;no param comparison. Register for ALL hit events. Use this sparingly!!!
EndEvent

Event OnHitGlobal(ObjectReference Attacker, ObjectReference Target, Form Source, Ammo akAmmo, Projectile akProjectile, bool abPowerAttack, bool abSneakAttack, bool abBashAttack, bool abHitBlocked)

	Debug.MessageBox("Attacker = " + Attacker.getDisplayName() + "\nTarget = " + Target.GetDisplayName() + "\nSource = " + Source.GetName() + "\nAmmo = " + akAmmo.getName() + "\nProjectile = " + akProjectile.getName())

EndEvent


Note that scripts attached to ReferenceAlias's or ActiveMagicEffects will receive the event if the reference they're filled with is registered for the event.
Example:

Scriptname MyRefAliasScript extends ReferenceAlias

Event OnInit()
	;these two lines achieve the same thing
    DbSkseEvents.RegisterAliasForGlobalEvent("OnWaitStartGlobal", self)
    DbSkseEvents.RegisterFormForGlobalEvent("OnWaitStartGlobal", self.GetReference())
EndEvent

Same goes for ActiveMagicEffects:
Scriptname MyRefAliasScript extends ReferenceAlias

Event OnEffectStart(Actor akTarget, Actor akCaster)
	;these two lines achieve the same thing
    DbSkseEvents.RegisterAliasForGlobalEvent("OnWaitStartGlobal", self)
    DbSkseEvents.RegisterFormForGlobalEvent("OnWaitStartGlobal", akTarget)
EndEvent
/;

;form ==================================================================================================================================================
Bool Function IsFormRegisteredForGlobalEvent(String asEvent, Form eventReceiver, Form paramFilter = none, int paramFilterIndex = 0) global Native
function RegisterFormForGlobalEvent(String asEvent, Form eventReceiver, Form paramFilter = none, int paramFilterIndex = 0) global Native
function UnregisterFormForGlobalEvent(String asEvent, Form eventReceiver, Form paramFilter = none, int paramFilterIndex = 0) global Native
function UnregisterFormForGlobalEvent_All(String asEvent, Form eventReceiver) global Native

;returns true if registering, or false if unregistering.
bool function ToggleGlobalEventOnForm(String sEvent, form eventReceiver, form paramFilter = none, int paramFilterIndex = 0) global
    Guard()
EndFunction


;alias ==========================================================================================================================================================================
Bool function IsAliasRegisteredForGlobalEvent(String asEvent, Alias eventReceiver, Form paramFilter = none, int paramFilterIndex = 0) global Native
function RegisterAliasForGlobalEvent(String asEvent, Alias eventReceiver, Form paramFilter = none, int paramFilterIndex = 0) global Native
function UnregisterAliasForGlobalEvent(String asEvent, Alias eventReceiver, Form paramFilter = none, int paramFilterIndex = 0) global Native
function UnregisterAliasForGlobalEvent_All(String asEvent, Alias eventReceiver) global Native

;returns true if registering, or false if unregistering.
bool function ToggleGlobalEventOnAlias(String sEvent, Alias eventReceiver, form paramFilter = none, int paramFilterIndex = 0) global
    Guard()
EndFunction

;ActiveMagicEffect ===============================================================================================================================================================
Bool function IsActiveMagicEffectRegisteredForGlobalEvent(String asEvent, ActiveMagicEffect eventReceiver, Form paramFilter = none, int paramFilterIndex = 0) global Native
function RegisterActiveMagicEffectForGlobalEvent(String asEvent, ActiveMagicEffect eventReceiver, Form paramFilter = none, int paramFilterIndex = 0) global Native
function UnregisterActiveMagicEffectForGlobalEvent(String asEvent, ActiveMagicEffect eventReceiver, Form paramFilter = none, int paramFilterIndex = 0) global Native
function UnregisterActiveMagicEffectForGlobalEvent_All(String asEvent, ActiveMagicEffect eventReceiver) global Native

;returns true if registering, or false if unregistering.
bool function ToggleGlobalEventOnActiveMagicEffect(String sEvent, ActiveMagicEffect eventReceiver, form paramFilter = none, int paramFilterIndex = 0) global
    Guard()
EndFunction

;events ===========================================================================================================================================================================
;as of version 6.3 OnLoadGameGlobal doesn't have to be registered for, it is always sent.
Event OnLoadGameGlobal()
EndEvent

;put these in a script that's attached to the registered eventReceiver
;as of version 6.3 these events aren't saved to your save file so you must re-register these events when loading a game.
;You can use OnLoadGameGlobal for maintenance

Event OnWaitStartGlobal()
EndEvent

Event OnWaitStopGlobal(bool interrupted)
EndEvent

Event OnFurnitureEnterGlobal(Actor akActor, ObjectReference furnitureRef)
EndEvent

Event OnFurnitureExitGlobal(Actor akActor, ObjectReference furnitureRef)
EndEvent

Event OnActivateGlobal(ObjectReference ActivatorRef, ObjectReference ActivatedRef)
EndEvent

;event sent when a reference is locked or unlocked
Event OnLockChangedGlobal(ObjectReference akReference, bool Locked)
EndEvent

;Open and close events are for animated doors / gates, use OnActivateGlobal for more general purposes.
Event OnOpenGlobal(ObjectReference ActivatorRef, ObjectReference akActionRef)
EndEvent

Event OnCloseGlobal(ObjectReference ActivatorRef, ObjectReference akActionRef)
EndEvent

;note that OnHitGlobal sends Ammo as well as projectile.
;This is because the projectile in this event is bugged, it doesn't detect reliably.
;This sends the Ammo the attacker has equipped if the Source is a bow or crossbow.
Event OnHitGlobal(ObjectReference Attacker, ObjectReference Target, Form Source, Ammo akAmmo, Projectile akProjectile, \
	bool abPowerAttack, bool abSneakAttack, bool abBashAttack, bool abHitBlocked)
EndEvent

;impactResults are: 0 = none, 1 = destroy, 2 = bounce, 3 = impale, 4 = stick
;for collided layer see DbSkseFunctions.GetCollisionLayerName()
;projectileMarker is an xMarker that is placed at the projectile at the point of impact so you can use functions
;GetPosition, GetAngle and GetHeadingAngle to compare with the target
;damagedNodeName only works on actors. e.g "SHIELD", "NPC Head [Head]", "NPC R UpperArm [RUar]" ect.
;projectileHitTranslation is only valid for actors. projectileHitTranslation.length will be 6 if the data is valid.
;[0] = Xposition, [1] = Yposition, [2] = Zposition,
;[3] = XhitDirection, [4] = YhitDirection, [5] = ZhitDirection
;this event requires the iMaxArrowsSavedPerReference setting in DbSkseFunctions.ini to be greater than 0.
Event OnProjectileImpactGlobal(ObjectReference shooter, ObjectReference target, Form Source, Ammo ammoSource, \
	Projectile akProjectile, bool abSneakAttack, bool abHitBlocked, int impactResult, int collidedLayer, \
	float distanceTraveled, string damagedNodeName, ObjectReference projectileMarker, float[] projectileHitTranslation)
EndEvent

Event OnMagicEffectAppliedGlobal(ObjectReference Caster, ObjectReference Target, MagicEffect akEffect)
Endevent

Event OnActiveMagicEffectAppliedGlobal(ObjectReference Caster, ObjectReference Target, Form akSource, MagicEffect akEffect, \
	ActiveMagicEffect akActiveEffect, int castringSource, int conditionStatus)
EndEvent

;Event sent when an ObjectReference casts a spell. Source could be a spell, enchantment, potion or ingredient.
Event OnSpellCastGlobal(ObjectReference Caster, Form Source)
Endevent

;Actor Action events. Source is the weapon / spell / shout.
;Slots are 0 = left hand, 1 = right hand, 2 = voice / power.
Event OnActorSpellCastGlobal(Actor Caster, Form Source, int slot)
Endevent

Event OnActorSpellFireGlobal(Actor Caster, Form Source, int slot)
Endevent

Event OnVoiceCastGlobal(Actor Caster, Form Source, int slot)
Endevent

Event OnVoiceFireGlobal(Actor Caster, Form Source, int slot)
Endevent

Event OnBowDrawGlobal(Actor akActor, Form Source, int slot)
Endevent

Event OnBowReleaseGlobal(Actor akActor, Form Source, int slot)
Endevent

;for draw / sheathe events, they are always sent for the right hand.
;Left hand events are only sent if there's something in the left hand, i.e spell / weapon / shield ect.
Event OnBeginDrawGlobal(Actor akActor, Form Source, int slot)
Endevent

Event OnEndDrawGlobal(Actor akActor, Form Source, int slot)
Endevent

Event OnBeginSheatheGlobal(Actor akActor, Form Source, int slot)
Endevent

Event OnEndSheatheGlobal(Actor akActor, Form Source, int slot)
Endevent

Event OnWeaponSwingGlobal(Actor akActor, Form Source, int slot)
Endevent

;type can be "FootLeft", "FootRight", "FootSprintLeft", "FootSprintRight", "JumpUp", "JumpDown" ect.
Event OnActorFootStepGlobal(Actor akActor, string type)
EndEvent

Event OnDeathGlobal(Actor Victim, Actor Killer)
EndEvent

Event OnDyingGlobal(Actor Victim, Actor Killer)
EndEvent

Event OnEnterBleedoutGlobal(Actor Victim)
Endevent

Event OnRaceSwitchCompleteGlobal(Actor akActor, Race akOldRace, Race akNewRace)
EndEvent

;Note that this can be used as ItemAdded or ItemRemoved event.
Event OnContainerChangedGlobal(ObjectReference newContainer, ObjectReference oldContainer, ObjectReference itemReference, Form baseObj, int itemCount)
EndEvent

Event OnObjectEquippedGlobal(Actor akActor, Form akBaseObject, ObjectReference akReference)
EndEvent

Event OnObjectUnequippedGlobal(Actor akActor, Form akBaseObject, ObjectReference akReference)
EndEvent

;note that this will work on the player for most cases. Exception being if stopCombat is called on the player with a script.
;internally this checks the player's combat status whenever another actor changes combat status
;and sends the event if the player combat status has changed, if the player is registered for akActor.
Event OnCombatStateChangedGlobal(Actor akActor, Actor akTarget, int aeCombatState)
EndEvent

;workbench types are:
;None = 0,
;CreateObject = 1,
;SmithingWeapon = 2,
;Enchanting = 3,
;EnchantingExperiment = 4,
;Alchemy = 5,
;AlchemyExperiment = 6,
;SmithingArmor = 7
;benchSkill will be an actor value such as "smithing", "enchanting" ect.
Event OnItemCraftedGlobal(Form itemCrafted, ObjectReference benchRef, int count, int workBenchType, string benchSkill)
EndEvent

Event OnItemsPickpocketedGlobal(Actor akTarget, Form itemTaken, int count)
Endevent

Event OnLocationClearedGlobal(Location akLocation)
EndEvent

;states for oldState and newState are:
;Dormant = 0,
;Displayed = 1,
;Completed = 2,
;CompletedDisplayed = 3,
;Failed = 4,
;FailedDisplayed = 5
Event OnQuestObjectiveStateChangedGlobal(Quest akQuest, string displayText, int oldState, int newState, int objectiveIndex, alias[] ojbectiveAliases)
EndEvent

;Position Player events are triggered whenever the player enters a new space, i.e fast traveling, going through a load door or a script calling MoveTo on the player.
;OnPositionPlayerStart is right before the Loading Menu opens.
;If the player is moving to an exterior the akWorldSpace will exist but the akInteriorCell will not and vice versa for moving to an interior.
;The fastTravelMarker will only exist if the player fast travels or Game.FastTravel(objectReference destination) is called
;The moveToRef will only exist if moveTo is called on the player (can be from a papyrus script or console command), ie Game.GetPlayer().moveTo(ref)
;Also note that the parameters for these PositionPlayer events only work on Skyrim SE and AE, not VR.
;The events will be sent on VR but the parameters will all be none
Event OnPositionPlayerStartGlobal(ObjectReference fastTravelMarker, ObjectReference moveToRef, WorldSpace akWorldSpace, Cell akInteriorCell)
EndEvent

;OnPositionPlayerFinish is after the game is done loading when the player moves into a new space.
;The parameters here will be the same from the last OnPositionPlayerStart event.
Event OnPositionPlayerFinishGlobal(ObjectReference fastTravelMarker, ObjectReference moveToRef, WorldSpace akWorldSpace, Cell akInteriorCell)
EndEvent

;Event triggered when the player moves from one cell to another
;Note that if the akPreviousCell is unloaded it will be none.
;This happens when the player fast travels to a new worldspace
;or when the player moves outside of the current cell grid and the previous cell is unloaded.
Event OnPlayerChangeCellGlobal(Cell akNewCell, Cell akPreviousCell)
EndEvent

;UI Item Menu Events ========================================================================================================================

;register the eventReceiver to receive the OnUiItemMenuEvent from UI item menus.
;valid menus are:
;"inventorymenu"
;"bartermenu"
;"containermenu"
;"giftmenu"
;"magicmenu"
;"crafting menu"
;"favoritesmenu"
;if menuName = "", registers for all valid item menus

;eventTypes are:
; 0 = selection changed,
; 1 = item selected,
; 2 = r button (drop, take all ect),
; 3 = f button (favorite ect).
; -1 = all types,

;for the eventTypes 1 (item selected), the event can be sent twice if there's a messagebox in between.
;for example in the crafting menu it's sent when you first click on something in the menu and again after you confirm crafting

;if the paramFilter is none, it's discounted in comparisons.

;example
;scriptname myQuestScript extends quest
;weapon property ironSword auto
;armor property ironHelmet auto

;event OnInit()
	;RegisterFormForUiItemMenuEvent("inventorymenu", self, none, 3) 		;register for when the user favorites or unfavorites anything in the inventory menu
	;RegisterFormForUiItemMenuEvent("giftmenu", self, none, 1) 				;register for when the user clicks on anything in the gift menu
	;RegisterFormForUiItemMenuEvent("containermenu", self, ironSword, 0) 	;register for when the user highlights the ironSword while the in the container menu
	;RegisterFormForUiItemMenuEvent("", self, ironHelmet, -1) 				;register for when the user highlights or clicks on or uses the R button or F button on the ironHelmet while in any item menu
	;RegisterFormForUiItemMenuEvent("", self)								;register for all events in all item menus
;EndEvent

; Event OnUiItemMenuEvent(String menuName, Form akSelectedForm, int eventType, int count, bool playerInventory, bool stolen)
;     Utility.waitMenuMode(0.5)
;     ConsoleUtil.PrintMessage(DbMiscFunctions.JoinAllStrings("OnUiItemMenuEvent event[", menuName, "] form[", DbMiscFunctions.GetFormName(akSelectedForm), \
;         "] type[", eventType, "] count[", count, "] equiped[", DbMiscFunctions.ActorHasFormEquiped(Game.GetPlayer(), akSelectedForm), \
;         "] favorited[", Game.IsObjectFavorited(akSelectedForm), "] playerInventory[", \
;         playerInventory, "]", " menuRef[", DbMiscFunctions.GetFormName(DbSkseFunctions.GetLastPlayerMenuActivatedRef()), \
;         "] stolen[", stolen, "]"))
; EndEvent

;form
Function IsFormRegisteredForUiItemMenuEvent(String menuName, Form eventReceiver, Form paramFilter = none, int eventType = -1) Global Native
Function RegisterFormForUiItemMenuEvent(String menuName, Form eventReceiver, Form paramFilter = none, int eventType = -1) Global Native
Function UnregisterFormForUiItemMenuEvent(String menuName, Form eventReceiver, Form paramFilter = none, int eventType = -1) Global Native
Function UnregisterFormForUiItemMenuEvent_All(Form eventReceiver) Global Native

;Alias
Function IsAliasRegisteredForUiItemMenuEvent(String menuName, Alias eventReceiver, Form paramFilter = none, int eventType = -1) Global Native
Function RegisterAliasForUiItemMenuEvent(String menuName, Alias eventReceiver, Form paramFilter = none, int eventType = -1) Global Native
Function UnregisterAliasForUiItemMenuEvent(String menuName, Alias eventReceiver, Form paramFilter = none, int eventType = -1) Global Native
Function UnregisterAliasForUiItemMenuEvent_All(Alias eventReceiver) Global Native

;sActiveMagicEffect
Function IsActiveMagicEffectRegisteredForUiItemMenuEvent(String menuName, ActiveMagicEffect eventReceiver, Form paramFilter = none, int eventType = -1) Global Native
Function RegisterActiveMagicEffectForUiItemMenuEvent(String menuName, ActiveMagicEffect eventReceiver, Form paramFilter = none, int eventType = -1) Global Native
Function UnregisterActiveMagicEffectForUiItemMenuEvent(String menuName, ActiveMagicEffect eventReceiver, Form paramFilter = none, int eventType = -1) Global Native
Function UnregisterActiveMagicEffectForUiItemMenuEvent_All(ActiveMagicEffect eventReceiver) Global Native

;menuName is the item menu that's currently open.
;akSelectedForm can be none if nothing is currently selected / highlighted.
;eventTypes are: -1 = all types, 0 = selection changed, 1 = item selected, 2 = r button (drop, take all ect), 3 = f button (favorite ect).
;count is the count of the item selected or highlighted, this is before the ui event is processed.
;So for example if the inventory menu is open and eventType is 2 (r button for dropped) to get the number of items dropped use: int dropped items = (count - Game.GetPlayer().GetItemCount(akSelectedForm))
;playerInventory is if the item was selected from the player's inventory and not the open container in the case of container menu, barter menu, gift menu ect.
Event OnUiItemMenuEvent(String menuName, Form akSelectedForm, int eventType, int count, bool playerInventory, bool stolen)
EndEvent

;to find if an option is greyed out, use selectedEntry.enabled
;example:
;bool isSelectionEnabled = ui.GetBool("crafting menu", "_root.Menu.InventoryLists.panelContainer.itemList.selectedEntry.enabled")

;some more info: UI paths for menu selectedEntrys

;for these menus:
;"inventorymenu"
;"bartermenu"
;"containermenu"
;"giftmenu"
;"magicmenu"
;path = "_root.Menu_mc.inventoryLists.itemList.selectedEntry"

;"crafting menu"
;path = "_root.Menu.InventoryLists.panelContainer.itemList.selectedEntry"

;"favoritesmenu"
;path = "_root.MenuHolder.Menu_mc.itemList.selectedEntry"

;here are the entry or selectedEntry variables I found in the skyui .as source files.
;selectedEntry.raceName
;selectedEntry.name
;selectedEntry.text
;selectedEntry.level
;selectedEntry.index
;selectedEntry.itemId
;selectedEntry.formId
;selectedEntry.enabled
;selectedEntry.disabled
;selectedEntry.flag
;selectedEntry.count

;selectedEntry.filterFlag
;selectedEntry.divider
;selectedEntry.id
;selectedEntry.value
;selectedEntry.handleInput
;selectedEntry.clipIndex
;selectedEntry.textFormat
;selectedEntry.handleInput
;selectedEntry.chargeAdded
;selectedEntry.itemIndex
;selectedEntry._height
;selectedEntry._width

;quest
;selectedEntry.questTargetID
;selectedEntry.completed
;selectedEntry.instance
;selectedEntry.active
;selectedEntry.objectives
;selectedEntry.type
;selectedEntry.description
;selectedEntry.stats


Function Guard()
    Debug.MessageBox("DbSkseEvents: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
