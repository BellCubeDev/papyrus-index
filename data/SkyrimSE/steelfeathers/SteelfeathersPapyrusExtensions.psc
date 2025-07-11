;/
	PAPYRUS IDNEX NOTE
	Removed from documentation comments were extra lines at the starts of comments meant for visual formatting.
	These lines did not impact the information or, when isolated to a single comment, its formatting in any way.
/;

Scriptname SteelfeathersPapyrusExtensions  Hidden

;Open the target actor's inventory in one of the following states:
;0 = regular item transfer, equivalent to OpenInventory(false), except that it actually works to open the inventory of a non-teammate
;1 = stealing from a container or coprse
;2 = pickpocketing
;3 = item transfer between teammates, equivalent to OpenInventory(true)
bool function OpenInventoryEx(Actor target, Int type) global native

;Returns the SKSE plugin's version as an array of 3 ints. Use to verify the plugin is installed and working.
;Version 1.0.0 becomes [1,0,0]
int[] function GetVersion() global native

;Get the actorBase owner of the passed-in form, if it has one.
;InventoryObjRef is the actor or container currently holding the item you want to evaluate.
;Best used within OnItemAdded() events; you don't need this for objects you pick up from the world, they already have an ObjectReference you can call GetActorOwner() on normally
actorBase function GetFormActorOwner(ObjectReference inventoryObjRef, Form item) global native

;Same as GetFormActorOwner(), but returns the faction owner of this item, if it has one.
faction function GetFormFactionOwner(ObjectReference inventoryObjRef, Form item) global native

;Returns whether this form has been stolen.
;InventoryObjRef is the actor or container currently holding the item you want to evaluate.
;Best used within OnItemAdded() events; you don't need this for objects you pick up from the world, they already have an ObjectReference you can call GetActorOwner() on normally
bool function IsFormStolen(ObjectReference inventoryObjRef, Form item) global native

;Change the actorBase that owns this form item; useful for laundering stolen items as marking them as belonging to you.
;InventoryObjRef is the actor or container currently holding the item you want to evaluate.
;Best used within OnItemAdded() events; you don't need this for objects you pick up from the world, they already have an ObjectReference you can call GetActorOwner() on normally
bool function SetFormActorOwner(ObjectReference inventoryObjRef, Form item, ActorBase owner) global native

;Same as SetFormActorOwner(), but sets the owner to the passed-in faction instead.
bool function SetFormFactionOwner(ObjectReference inventoryObjRef, Form item, Faction owner) global native

;Gets the total gold value you see for an item in your inventory, not just the base value. Allows you to fetch the actual value of enchanted items.
int function GetTotalGoldValue(Form item) global native
