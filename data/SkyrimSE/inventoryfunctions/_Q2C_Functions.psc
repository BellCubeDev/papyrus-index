Scriptname _Q2C_Functions hidden

;-------------------------------------------------
;              Poison Functions
;-------------------------------------------------
; Q2C's original poison functions, updated for SKSE64
; Note a slight change in format from Q2C's original 32-bit plugin:
; Worn_PoisonWeapon has become WornObjectSetPoison,
; Worn_GetPoison has become WornObjectGetPoisonCharges etc

; Valid Hand Slot:
; 0 - Left
; 1 - Right

; this is already done by SKSE, so just forward on to that version
Potion Function WornObjectGetPoison(Actor akActor, int aiHandSlot, int aiSlotMask)										global
    Guard()
endFunction

int Function 	WornObjectSetPoison(Actor akActor, int aiHandSlot, int aiSlotMask, Potion akPoison, int aiCharges = 1) 	global native
{
	Applies akPoison to weapon in aiHandSlot.  Note the item MUST be a weapon, or the function will fail and return -1
	Returns: The number of poison charges the weapon now has (which should be the same as aiCharges)
			or -1 if unsuccessful
}

Function WornObjectRemovePoison(Actor akActor, int aiHandSlot, int aiSlotMask) 											global native
{
	Remove the poison from the weapon in aiHandSlot
}

int Function 	WornObjectGetPoisonCharges(Actor akActor, int aiHandSlot, int aiSlotMask) 								global native
{
	Get the number of poison charges on the weapon in aiHandSlot
	Returns: The number of charges, or -1 if unsuccessful for any reason
			(eg the item is not a weapon, or no poison applied)
}

int Function	WornObjectSetPoisonCharges(Actor akActor, int aiHandSlot, int aiSlotMask, int aiCharges = 1) 			global native
{
	Set the number of poison charges on the weapon in aiHandSlot
	Returns: The number of poison charges now on the weapon in aiHandSlot (which should be the same as aiCharges)
			or -1 if unsuccessful for any reason (eg the item is not a weapon, or no poison applied)
}


; this is also already done by SKSE, so just forward on to that version
Potion Function GetPoison(ObjectReference akObjRef)																		global
    Guard()
endFunction

int Function 	SetPoison(ObjectReference akObjRef, Potion akPoison, int aiCharges = 1)									global native
{
	Applies akPoison to akObjRef.  Note the item MUST be a weapon, or the function will fail and return -1
	Returns: The number of poison charges the weapon now has (which should be the same as aiCharges)
			or -1 if unsuccessful
}

Function RemovePoison(ObjectReference akObjRef) 																		global native
{
	Remove the poison from the weapon akObjRef
}

int Function 	GetPoisonCharges(ObjectReference akObjRef) 																global native
{
	Get the number of poison charges on akObjRef
	Returns: The number of charges, or -1 if unsuccessful for any reason
			(eg the item is not a weapon, or no poison applied)
}

int Function	SetPoisonCharges(ObjectReference akObjRef, int aiCharges = 1) 											global native
{
	Set the number of poison charges on akObjRef
	Returns: The number of poison charges now on the weapon in aiHandSlot (which should be the same as aiCharges)
			or -1 if unsuccessful for any reason (eg the item is not a weapon, or no poison applied)
}


; These are all just shortcuts to the full WornObject versions above, sending aiSlotMask as 0
Potion Function	WornGetPoison(Actor akActor, int aiHandSlot) 															global
    Guard()
endFunction

int Function 	WornSetPoison(Actor akActor, int aiHandSlot, Potion poison, int aiCharges = 1) 							global
    Guard()
endFunction

Function	WornRemovePoison(Actor akActor, int aiHandSlot) 															global
    Guard()
endFunction

int Function 	WornGetPoisonCharges(Actor akActor, int aiHandSlot) 													global
    Guard()
endFunction

int Function  	WornSetPoisonCharges(Actor akActor, int aiHandSlot, int aiCharges = 1) 									global
    Guard()
endFunction



;-------------------------------------------------
;              Inventory Functions
;-------------------------------------------------
; Q2C's original functions, updated for SKSE64
; Note that GetNumItemsWithKeyword groups by item type
; ie, a stack of ten daggers counts as ONE toward the total, NOT ten
int Function 	GetNumItemsWithKeyword(ObjectReference akObjRef, Keyword akKeyword) 									global native
Form Function 	GetNthFormWithKeyword(ObjectReference akObjRef, Keyword akKeyword, int aiItemIndex) 					global native

; I THINK these functions will return the full number of items in the container
; ie, a stack of ten daggers actually counts as ten items
; not actually implemented in the plugin yet though
;int Function 	GetTotalNumItemsWithKeyword(ObjectReference akObjRef, Keyword akKeyword) 								global native
;int Function 	GetTotalNumItems(ObjectReference akObjRef) 																global native

; added by Kalivore - type is the SKSE itemType (eg 26 for armour, or 46 for potion)
; full list at http://www.creationkit.com/index.php?title=GetType_-_Form
int Function 	GetNumItemsOfType(ObjectReference akObjRef, int aiType)			 										global native
Form Function 	GetNthFormOfType(ObjectReference akObjRef, int aiType, int aiItemIndex) 								global native

; get total of the base gold values of items in container 
; 'base' means the extra value of enchantments/improvements on items is ignored
int Function 	GetTotalBaseGoldValue(ObjectReference akObjRef) 														global native


;-------------------------------------------------
;              Ammo Functions
;-------------------------------------------------
; needed for my Arrow Sheaves mod, as there were no SKSE funcs to set Damage or IsBolt :(

Function SetIsBolt(Ammo akAmmo, bool abIsBolt)  														global native
{
Sets whether this ammo is a bolt
}

Function SetProjectile(Ammo akAmmo, Projectile akProjectile)  											global native
{
Sets the projectile associated with this ammo
--WARNING!!-- Highly untested! >:$
}

Function SetDamage(Ammo akAmmo, float afDamage)  														global native
{
Sets the base damage of this ammo
}


;----------------------------------------
;     Additional spell-listing Functions
;          also added by Kalivore
;----------------------------------------
string Function SpellSchoolAny()				global
{returns an empty string ""}
    Guard()
endFunction
string Function SpellSchoolAlteration()			global
{returns "Alteration"}
    Guard()
endFunction
string Function SpellSchoolConjuration()		global
{returns "Conjuration"}
    Guard()
endFunction
string Function SpellSchoolDestruction()		global
{returns "Destruction"}
    Guard()
endFunction
string Function SpellSchoolIllusion()			global
{returns "Illusion"}
    Guard()
endFunction
string Function SpellSchoolRestoration()		global
{returns "Restoration"}
    Guard()
endFunction

int Function SpellLevelAny() 					global
{returns -1}
    Guard()
endFunction
int Function SpellLevelNovice()					global
{returns 0 (all Novice spells I found were level 0)}
    Guard()
endFunction
int Function SpellLevelApprentice()				global
{returns 25}
    Guard()
endFunction
int Function SpellLevelAdept()					global
{returns 50}
    Guard()
endFunction
int Function SpellLevelExpert()					global
{returns 75}
    Guard()
endFunction
int Function SpellLevelMaster()					global
{returns 100}
    Guard()
endFunction

; Valid aiLevelComparison values (only applied if aiLevel >= 0):
int Function SpellLevelComparisonLt()			global
{returns -2. Means spell level must be lower than specified aiLevel to be counted}
    Guard()
endFunction
int Function SpellLevelComparisonLtEq()			global
{returns -1. Means spell level must be less than or equal to specified aiLevel to be counted}
    Guard()
endFunction
int Function SpellLevelComparisonEq()			global
{returns 0. Means spell level must be equal to specified aiLevel to be counted}
    Guard()
endFunction
int Function SpellLevelComparisonGtEq()			global
{returns 1. Means spell level must be equal to or greater than specified aiLevel to be counted}
    Guard()
endFunction
int Function SpellLevelComparisonGt()			global
{returns 2. Means spell level must be greater than specified aiLevel to be counted}
    Guard()
endFunction


Spell[] Function 	ActorGetSpells(Actor akActor, Keyword akKeyword = None, string asSchool = "", int aiLevel = -1, int aiLevelComparison = 1, bool abSearchBase = true) 		global native
{
Scans the MagicEffects of the Actor's spells, adding the Spell to the returned array if the MagicEffect matches the criteria.
Use the default values to ignore that condition (eg sending asSchool as "" means 'of any School')
NOTE: sending just the akActor (or sending all additional arguments as their default values) will now return ALL spells the Actor knows - rather than an empty list as before
Optionally will also check through the relevant ActorBase (which is more likely to be the one with the spells)
}

Spell[] Function 	ActorBaseGetSpells(ActorBase akActorBase, Keyword akKeyword = None, string asSchool = "", int aiLevel = -1, int aiLevelComparison = 1) 						global native
{
Scans the MagicEffects of the Actor's spells, adding the Spell to the returned array if the MagicEffect matches the criteria.
Use the default values to ignore that condition (eg sending asSchool as "" means 'of any School')
NOTE: sending just the akActorBase (or sending all additional arguments as their default values) will now return ALL spells set on the ActorBase - rather than an empty list as before
}


Shout[] Function 	ActorBaseGetShouts(ActorBase akActorBase, Keyword akKeyword = None) 																						global native
{
Returns an array of Shouts that match the specified Keyword.
}



;----------------------------------------
;     Additional spell-checking Functions
;          also added by Kalivore
;----------------------------------------
bool Function 	ActorHasSpell(Actor akActor, Keyword akKeyword = None, string asSchool = "", int aiLevel = -1, int aiLevelComparison = 1, bool abSearchBase = true)			global
{
Scans the MagicEffects of the Actor's spells, returning true at the first one that matches any of the supplied criteria.
NOTE: sending just the akActor (or sending all additional arguments as their default values) will return TRUE if the actor has any spell at all
Optionally will also check through the relevant ActorBase (which is more likely to be the one with the spells)
}
    Guard()
endFunction

bool Function 	ActorBaseHasSpell(ActorBase akActorBase, Keyword akKeyword = None, string asSchool = "", int aiLevel = -1, int aiLevelComparison = 1)						global
{
Scans the MagicEffects of the ActorBase's spells, returning true at the first one that matches any of the supplied criteria.
NOTE: sending just the akActorBase (or sending all additional arguments as their default values) will return TRUE if the ActorBase has any spell at all
}
    Guard()
endFunction


bool Function 	ActorBaseHasShout(ActorBase akActorBase, Keyword akKeyword)																									global
{
Scans the ActorBase's shouts, returning true at the first one that matches the specified Keyword.
}
    Guard()
endFunction


Function Guard()
    Debug.MessageBox("_Q2C_Functions: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
