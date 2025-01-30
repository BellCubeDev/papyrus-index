ScriptName SPE_ObjectRef Hidden

; Return all enchanted items on the given object
Form[] Function GetEnchantedItems(ObjectReference akReference, bool abWeapons, bool abArmor, bool abWornOnly) global native
; Return all items on the given object whichs item name matches one of the given names
Form[] Function GetInventoryNamedObjects(ObjectReference akReference, String[] asNames) global native
; Return all items on the given object which includes any (or all) of the given keywords
Form[] Function GetItemsByKeyword(ObjectReference akReference, Keyword[] akKeywords, bool abMatchAll) global native

; Remove all items in akForms from akReference, optionally moving them to akTarget. Returns the number of items removed
int Function RemoveItems(ObjectReference akReference, Form[] akForms, ObjectReference akTarget) global native

; Return IteamHealthPercent of akForm. Alternative to ObjecReference.GetItemHealthPercent for items stored in a container (range: 0.0 - 1.6)
float Function GetTemperFactor(ObjectReference akReference, Form akForm) global native

; GetDistance between akReference and akTarget using absolute positions, s.t. interior cells are considered accordingly
float Function GetTravelDistance(ObjectReference akReference, ObjectReference akTarget) global native
; Return absolute positions of akReference. That is, the position of the reference with respect to the adjacent exterior worldspace (if any)
float Function GetAbsPosX(ObjectReference akReference) global native
float Function GetAbsPosY(ObjectReference akReference) global native
float Function GetAbsPosZ(ObjectReference akReference) global native
