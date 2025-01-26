Scriptname Cell extends Form Native Hidden

; Enables/disables fast travel in this cell
Function EnableFastTravel(bool abEnable = true) native

; Gets the actor that owns this cell (or none if not owned by an actor)
ActorBase Function GetActorOwner() native

; Gets the faction that owns this cell (or none if not owned by a faction)
Faction Function GetFactionOwner() native

; Gets the 'parent' reference for this cell, if any (i.e. the ship if this is a ship interior/exterior cell)
ObjectReference Function GetParentRef() native

; Is this cell "attached"? (In the loaded area)
bool Function IsAttached() native

; Is this cell an interior cell?
bool Function IsInterior() native

; Is this cell currently loaded?
bool Function IsLoaded() native

; Flags the cell for reset on next load
Function Reset() native

; Sets this cell's owner as the specified actor
Function SetActorOwner(ActorBase akActor) native

; Sets this cell's owner as the specified faction
Function SetFactionOwner(Faction akFaction) native

; Sets the fog color for this cell (interior, non-sky-lit cells only)
Function SetFogColor(int aiNearRed, int aiNearGreen, int aiNearBlue, \
	int aiFarRed, int aiFarGreen, int aiFarBlue) native

; Adjusts this cell's fog near and far planes (interior, non-sky-lit cells only)
Function SetFogPlanes(float afNear, float afFar) native

; Sets the fog power for this cell (interior, non-sky-lit cells only)
Function SetFogPower(float afPower) native

; Sets the gravity scale on this cell, works on interiors only
Function SetGravityScale(float aScale) native

; Sets the OffLimits flag on this cell
Function SetOffLimits(bool abOffLimits = true) native

; Sets this cell as public or private
Function SetPublic(bool abPublic = true) native