Scriptname SPE_Actor Hidden

; Maps this actor to their corresponding havok behavior class, possible values are:
; Human
; Wolf
; Dog
; Chicken
; Hare
; FlameAtronach
; FrostAtronach
; StormAtronach
; Bear
; Chaurus
; Cow
; Deer
; ChaurusHunter
; Gargoyle
; Lurker
; Boar
; DwarvenBallista
; Seeker
; Netch
; Riekling
; AshHopper
; Dragon
; DragonPriest
; Draugr
; DwarvenSphere
; DwarvenSpider
; DwarvenCenturion
; Falmer
; Spider
; Giant
; Goat
; Hagraven
; Horker
; Horse
; IceWraith
; Mammoth
; Mudcrab
; Sabrecat
; Skeever
; Slaughterfish
; Spriggan
; Troll
; VampireLord
; Werewolf
; Wispmother
; Wisp
String Function GetRaceType(Actor akActor) global native

; Calm this actor. Calmed actors will ignore ongoing combat and not be attacked by anyone.
; (This behaves similar to Acheron's paficiation, beware however that both systems are indepnendent from another)
Function SetActorCalmed(Actor akActpr, bool abDoCalm) global native
bool Function IsActorCalmed(Actor akActor) global native
; Disable an actors collision
Function SetActorFrozen(Actor akActor, bool abDoFreeze) global native
bool Function IsActorFrozen(Actor akActor) global native

; Get all actors this actor is currently detecting
Actor[] Function GetDetectedActors(Actor akActor) global native
; Get all actors that are currently detecting this actor
Actor[] Function GetDetectedBy(Actor akActor) global native

; Get all currently worn forms, optionally filtered by slot mask
; aiSlotMask: Sum of slot masks to check. An armor is returned if it occupies any of the specified slots
; See Armor.psc or https://ck.uesp.net/wiki/Slot_Masks_-_Armor for a list of masks
Form[] Function GetWornForms(Actor akActor) global native
Armor[] Function GetWornArmor(Actor akActor, int aiSlotMask = 0) global native
; Same as WornHasKeyword(), but allows to specify multiple keywords
; The string variant allows to search for substrings in keywords if abMatchPartial is true
; Returns all keywords that are present on any worn form, in case of abMatchPartial = true, returns the first match
Keyword[] Function WornHasKeywords(Actor akActor, Keyword[] akKeywords) global native
Keyword[] Function WornHasKeywordStrings(Actor akActor, String[] asKeywords, bool abMatchPartial) global native

; Get the players current dialogue target
Actor Function GetPlayerSpeechTarget() global native

; Unmount this actor
Function Dismount(Actor akActor) global native
