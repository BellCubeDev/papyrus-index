scriptname PerkEntryPointExtender hidden


;Returns a 4 length array of integers representing the current version.
int[] function GetVersion() native global

int function GetVersionInt() global
    Guard()
endFunction


;The void perk entry point. Currently, applying a leveled list is the only known entry point
function ApplyPerkEntryPoint(Actor target, string entry_point, Form[] args, string category = "", int channel = 1, int handle = 0) native global


;Get's the string result of a perk entry point. Set activation label is currently the only known entry point
string function ApplyPerkEntryPointString(Actor target, string entry_point, Form[] args, string out_value = "",string category = "", int channel = 1, int handle = 0) native global


;Gets the float value of a perk entry point.
float function ApplyPerkEntryPointFloat(Actor target, string entry_point, Form[] args, float base_value, string category = "", int channel = 1, int handle = 0) native global


;Gets the form/forms value of a perk entry point. Should Kernals patch to allow multiple entries exist, this will return multiple entries.
Form[] function ApplyPerkEntryPointForm(Actor target, string entry_point, Form[] args, string category = "", int channel = 1, int handle = 0) native global


;Identical to the form version, just uses it as spells (there will never likely be a difference, but this will cast them for you)
Spell[] function ApplyPerkEntryPointSpell(Actor target, string entry_point, Form[] args, string category = "", int channel = 1, int handle = 0) native global

;Parameters
;-target: Perk owner
;-entry_point: Entry point to parse, case insensitive
;-args: Arguments coinciding with the targets (minus perk owner) in the perk entry point menu.
;-category(optional): The user designated category for execution. During, only perks from that category designated by having "GROUP__<category>"
;  in the name.
;-channel(optional): Deprecated. The rank in of perk entries to search through to apply. A channel of 0 will search through all ranks except those of 1. A rank of 1 or
;  having no category does nothing. This method is only used in legacy entry points. It's advised to use keywords instead.
;-handle(optional): The handle for conditions that specifically requires Entry Points. This will prevent certain entry points from crashing and provide more 
;  functionality toward replicating others.

;/
;Specific argument type requirements will be exposed at a later point

;;;;;;;;;;;;;;;;;;;;;;;;
; Requires 2 Arguments ;
;;;;;;;;;;;;;;;;;;;;;;;;

	Mod Attack Damage
	Adjust Limb Damage
	Apply Combat Hit Spell
	Apply Reanimate Spell
	Apply Weapon Swing Spell
	Calculate My Critical Hit Chance
	Calculate My Critical Hit Damage
	Can Pickpocket Equipped Item
	Mod Incoming Damage
	Mod Poison Dose Count
	Mod Power Attack Damage
	Mod Secondary Value Weight
	Mod Soul Gem Enchanting
	Mod Spell Magnitude
	Mod Spell Duration
	Mod Target Damage Resistance
	Modify Enchantment Power
	Modify Enemy Critical Hit Chance
	Modify Sneak Attack Mult
	Modify Max Pickpocket Chance
	Modify Soul Pct Captured To Weapon
	Should Apply Placed Item


;;;;;;;;;;;;;;;;;;;;;;;
; Requires 1 Argument ;
;;;;;;;;;;;;;;;;;;;;;;;

	Allow Mount Actor
	Mod Bashing Damage
	Apply Bashing Spell
	Calculate Mine Explode Chance
	Can Dual Cast Spell
	Filter Activation
	Get Should Attack
	Mod Armor Weight
	Mod Bribe Amount
	Mod Detection Light
	Mod Detection Movement
	Mod Favor Points
	Mod Incoming Spell Magnitude
	Mod Incoming Spell Duration
	Mod Incoming Stagger
	Mod Player Intimidation
	Mod Power Attack Stamina
	Mod Soul Gem Recharge
	Mod Spell Casting Sound Event
	Mod Spell Cost
	Mod Target Stagger
	Modify Armor Rating
	Modify Bow Zoom
	Modify Buy Prices
	Modify Commanded Actor Limit
	Modify Detection Sneak Skill
	Modify Ingredients Harvested
	Modify Initial Ingredient Effects Learned
	Modify Lockpick Sweet Spot
	Modify Lockpicking Crime Chance
	Modify Lockpicking Key Reward Chance
	Modify Player Magic Slowdown
	Modify Potions Created
	Modify Sell Prices
	Modify Spell Range (Target Loc.)
	Modify Telekinesis Damage
	Modify Tempering Health
	Modify Ward Magicka Absorption Pct
	Set Activate Label
	Set Sweep Attack
	Activate


;;;;;;;;;;;;;;;;;;;;;;;;;
; Requires No Arguments ;
;;;;;;;;;;;;;;;;;;;;;;;;;

	Modify Telekinesis Damage Mult
	Modify Telekinesis Distance
	Calculate Weapon Damage
	Adjust Book Skill Points
	Modify Recovered Health	
	Add Leveled List On Death
	Get Max Carry Weight
	Modify Addiction Chance
	Modify Addiction Duration
	Modify Positive Chem Duration
	Ignore Running During Detection
	Ignore Broken Lock
	Modify Enemy Critical Hit Chance
	Modify Max Placeable Mines
	Modify Recover Arrow Chance
	Modify Skill Use
	Mod Secondary Value Weight
	Mod Percent Blocked
	Mod Shield Deflect Arrows
	Mod Player Reputation
	Set Boolean Graph Variable
	Modify Falling Damage
	Modify Lockpick Level Allowed
	Set Lockpick Starting Arc
	Set Progression Picking
	Make Lockpicks Unbreakable
	Modify Alchemy Effectiveness
	Apply Weapon Swing Spell
	Apply Sneaking Spell
	Purify Alchemy Ingredients
	Modify Soul Pct Captured To Weapon
	Mod # Applied Enchantments Allowed
	Mod Shout OK
	
/;





;;;;;;;;;;;;;;;;;;;;;;;;;
;     Entry Handles	    ;
;;;;;;;;;;;;;;;;;;;;;;;;;


;These are the entry handles. Handles are used to run certain expected condition functions expected to be used for perk entry points
; and not have the game crash. Their primary function is to help determine what the game's calculation of certain entry points 
; would result in more accurately. Note that these will not persist between saves (there would be little merit in doing so).




;Creates a handle to add condition function items to
int function CreateHandle() native global;

;Closes a condition function handle.
bool function CloseHandle(int handle) native global


;Checks if a handle is valid and returns either it or a new handle id
int function ValidateHandle(int handle) native global;
;Sets a handle field to be a specific form value.
int function SetHandleItemForm(int handle, string name, Form value) native global;
int function SetHandleItemString(int handle, string name, string value) native global;

;The result of the handle item functions can be:
;  1: The check was successful
;  0: The handle didn't exist
; -1: The field name didn't exist
; -2: Bad arguments where given

;;;;;;;;;;;;;;;;;;;;;;;;;
;     Handle Fields     ;
;;;;;;;;;;;;;;;;;;;;;;;;;

;/
;-----------------;
;  String Fields  ;
;-----------------;
	-EPModSkillUsage_IsAdvanceSkill: advanceSkill is the field that shows what skill is being considered for experience.
	 It's valid values are any name of an actor value. Of note, this bit is compatible with AVG, using generated actor values.
	
	-EPModSkillUsage_IsAdvanceAction: advanceAction is the field that determines what type of action is causing experience gain. It's valid valus are as follows:
	 *NormalUsage
	 *PowerAttack
	 *Bash
	 *LockpickSuccess
	 *LockpickBroken

;-----------------;
;   Bool Fields   ;
;-----------------;

	-EPAlchemyGetMakingPoison: creatingPoison a flag field that shows whether the player is currently making a poison or potion. 
	 To observe perk entries that regularly use this condition simply use true to set the focus to a poison, false to potion.
	


;-----------------;
;   Form Fields   ;
;-----------------;

	-EPAlchemyEffectHasKeyword: stores a magic effect to tell if an effect of a potion has a certain keyword. Form given must be a MagicEffect

	-EPModSkillUsage_AdvanceObjectHasKeyword: advanceObject is a field that stores the object that caused a skill advance.
	 Form given must be able to hold keywords
	

;-----------------;
;  Unused Fields  ;
;-----------------;

	-temperingItem: Currently, temperingItem cannot be set because it uses InventoryEntryData rather than the base form. There is no representation of
	 it within papyrus and the closest you can get is an ObjectReference, so I'm leaving EPTemperingItemIsEnchanted and EPTemperingItemHasKeyword alone.
	 Use call EPs known to contain these functions at risk of crashing.


;To reiterate currently, it is ill advised to use perk entry points that use the following conditions commonly within them (without a category and channel)
; EPTemperingItemHasKeyword
; EPTemperingItemIsEnchanted

/;


Function Guard()
    Debug.MessageBox("PerkEntryPointExtender: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
