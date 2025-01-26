Scriptname Planet extends Form Native Hidden

; Get the atmosphere type keyword for this planet
Keyword Function GetAtmosphereType() native

; Get the day length in hours for this planet
float Function GetDayLength() native

; Get the gravity multiplier for this planet
float Function GetGravity() native

; Keyword Types are as Follows:
; 0 -NONE
; 1 -Component Tech Level
; 2 -Attach Point
; 3 -Component Property
; 4 -Instantiation Filter
; 5 -Mod Association
; 6 -Sound
; 7 -Anim Archetype
; 8 -Function Call
; 9 -Recipe Filter
; 10-Attraction Type
; 11-Dialogue Subtype
; 12-Quest Target
; 13-Anim Flavor
; 14-Anim Gender
; 15-Anim Face
; 16-Quest Group
; 17-Anim Injured
; 18-Dispel Effect
; 19-Crowd Target
; 20-Exclusive Location Encounter Type
; 21-WeaponHolster
; 22-HUD Marker Override
; 23-Interaction Root Offset
; 24-Misc Item Quality
; 25-Component Quantity
; 26-Quest Type
; 27-Faction Type
; 28-Traversal
; 29-Inventory Category
; 30-Form Link
; 31-Manufacturer
; 32-UI Icon Personal Effect
; 33-UI Icon Environment Effect
; 34-Primitive Type
; 35-Planet Type
; 36-Planet Atmosphere Type
; 37-Planet Atmosphere Toxicity
; 38-Planet Gravity Type
; 39-Planet Water Abundance
; 40-Planet Water Quality
; 41-Planet Magnetosphere
; 42-Planet Flora Probability
; 43-Planet Fauna Probability
; 44-Planet Traits
; 45-Planet Temperature Type
; 46-Planet Pressure Type
; 47-Planet Flora Abundance
; 48-Planet Fauna Abundance
; 49-Biome Marker Type
; 50-Hand Scanner Info Type
; 51-Ship Module Class type
; 52-Layered Material Swap Key
; 53-UI Icon Star Power
; 54-Mission Type
; 55-Sound Engine
; 56-Sound Engine Mod
; 57-Sound Cockpit
; 58-Sound Grav Drive
; 59-Perk Trait Restriction
; 60-Sound CCT Skin
; 61-Sound CCT Size
; 62-Sound CCT Speed
; 63-PhotoMode Category
; 64-Exclude From GI / Raytracing
; 65-Include In GI / Raytracing
; 66-Hair Color
; 67-Facial Hair Color
; 68-Eye Color
; 69-Biome Houdini Style
; 70-Anim Flavor (AnimObject)
; 71-Brow Color
; 72-Hair SubType
; 73-Facial Hair SubType
; 74-Brow SubType
; 75-AVMS Condition Sequence
; 76-Biome Creature Type
; 77-Ship Module Upgrade
; 78-Display Name
; 79-AVMS Appearance Variation Mod
; 80-UI Icon Treatment
; 81-Form Pair
; 82-Item Description
; 83-Weapon Type Display

; Get all of the keywords of the given type on this planet
Keyword[] Function GetKeywordTypeList(int aType) native

; Get the pressure value for this planet
float Function GetPressure() native

; Get the survey percent for this planet
float Function GetSurveyPercent() native

; Get the temperature value for this planet
float Function GetTemperature() native

; Get the planet type keyword for this planet
Keyword Function GetType() native

; Check if a planet trait is known
bool Function IsTraitKnown(Keyword aKeyword) native

; Set a planet trait as known by the player
Function SetTraitKnown(Keyword aKeyword, bool abKnown = true) native

; Get the location for this planet
Location Function GetLocation() native
