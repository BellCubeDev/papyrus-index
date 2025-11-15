Scriptname SWE Hidden
; ============================================================
; Dynamic Wetness - Public Papyrus API (for mod authors)
; ============================================================

; =========================
; Categories (bitmask, low 4 bits)
; =========================

; Combine by sum, e.g. Skin+Hair = 1+2 = 3
Int Property CAT_SKIN_FACE   = 1  Auto ; 1 << 0 - Skin & Face
Int Property CAT_HAIR        = 2  Auto ; 1 << 1 - Hair
Int Property CAT_ARMOR_CLOTH = 4  Auto ; 1 << 2 - Armor & Clothing
Int Property CAT_WEAPON      = 8  Auto ; 1 << 3 - Weapons
Int Property CAT_MASK_4BIT   = 15 Auto ; 0x0F - mask for all category bits

; =========================
; Behavior flags (high bits)
; =========================

; Add these to catMask (sum/OR). They live above the low 4 bits.
; Values match the native C++ (1<<16 etc.).
Int Property FLAG_PASSTHROUGH = 65536  Auto ; add after SWE blending/drying
Int Property FLAG_NO_AUTODRY  = 131072 Auto ; suppress auto-dry for affected categories
Int Property FLAG_ZERO_BASE   = 262144 Auto ; force base to 0 while active

; Skin only + all flags
; 1 + 65536 + 131072 + 262144 = 458753
Int Property MASK_SKIN_PASSTHROUGH = 458753 Auto

; =========================
; Environment mask bits (for GetEnvMask)
; =========================

Int Property ENV_WATER         = 1  Auto ; in water / submerged
Int Property ENV_WET_WEATHER   = 2  Auto ; rain/snow affecting the actor
Int Property ENV_NEAR_HEAT     = 4  Auto ; near heat source
Int Property ENV_UNDER_ROOF    = 8  Auto ; under roof/cover (heuristic)
Int Property ENV_EXTERIOR_OPEN = 16 Auto ; exterior & not under cover

; =========================
; Core functions (external wetness signal)
; =========================

; Set/update an external source (default category = Skin).
; durationSec <= 0 => infinite until cleared.
Function SetExternalWetness(Actor akActor, String key, Float value, Float durationSec = -1.0) Global Native

; Set/replace value AND categories/flags for this key.
; IMPORTANT: catMask contains both categories (low 4 bits) AND flags (high bits).
; Example: Int m = CAT_SKIN_FACE + CAT_HAIR + FLAG_PASSTHROUGH
Function SetExternalWetnessMask(Actor akActor, String key, Float value, Float durationSec = -1.0, Int catMask = 1) Global Native

; Extended variant with optional per-material overrides.
; Any negative override value => ignore (do not force/override).
Function SetExternalWetnessEx(Actor akActor, String key, Float value, Float durationSec, Int catMask, Float maxGloss = -1.0, Float maxSpec = -1.0, Float minGloss = -1.0, Float minSpec = -1.0, Float glossBoost = -1.0, Float specBoost = -1.0, Float skinHairMul = -1.0) Global Native

; Remove this external source (key is trimmed & lowercased internally).
Function ClearExternalWetness(Actor akActor, String key) Global Native

; =========================
; Queries
; =========================

; Raw: base wetness computed from water/rain etc. (0..1), before external sources.
Float Function GetBaseWetness(Actor akActor) Global Native

; Final: wetness after categories/blending/external sources (0..1).
Float Function GetFinalWetness(Actor akActor) Global Native

; Value of a specific external source key (0..1), 0 if not present.
Float Function GetExternalWetness(Actor akActor, String key) Global Native

; =========================
; Convenience / Environment
; =========================

; True if water contact is strong enough (alias of "in water" check).
Bool Function IsActorWetByWater(Actor akActor) Global Native

; Submerged fraction (0 = dry, 1 = fully submerged).
Float Function GetSubmergedLevel(Actor akActor) Global Native

; True if precipitation (rain/snow) is active and relevant for actor.
Bool Function IsWetWeatherAround(Actor akActor) Global Native

; True if actor is under roof/cover (heuristic).
Bool Function IsUnderRoof(Actor akActor) Global Native

; True if actor is near a heat source; radius in world units.
; Pass 0.0 to use the mod's configured radius.
Bool Function IsNearHeatSource(Actor akActor, Float radius = 0.0) Global Native

; True if actor is in exterior and not covered (i.e., exposed).
Bool Function IsActorInExteriorWet(Actor akActor) Global Native

; Bitmask of environment flags (see ENV_* above).
Int Function GetEnvMask(Actor akActor) Global Native
