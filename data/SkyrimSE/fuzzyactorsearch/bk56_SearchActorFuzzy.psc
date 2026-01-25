Scriptname bk56_SearchActorFuzzy Hidden

; Useful for locating NPCs whose display names may be altered or obscured by other modifications or for other mods that may not be able to get the formID directly.
;
; Returns the FormID of an Actor whose name closely matches the input string. Supports fuzzy matching and optional filters for proximity and engine-handled status.
Int Function bk56_SearchActorFuzzy(String actorName,  Bool nearbyOnly, Bool handledOnly, Float WeightMin) global native
