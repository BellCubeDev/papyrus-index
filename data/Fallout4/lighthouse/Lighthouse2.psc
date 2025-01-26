ScriptName Lighthouse2 native hidden

; ---------------------------------------------------------------------
; Actor
; ---------------------------------------------------------------------

float Function GetActorSubmersionLevel(Actor akActor) global native

Cell Function GetCurrentAIProcessDestinationCell(Actor akActor) global native

float Function GetCurrentAIProcessDestinationRadius(Actor akActor) global native

Worldspace Function GetCurrentAIProcessDestinationWorldSpace(Actor akActor) global native

; ---------------------------------------------------------------------
; Cell
; ---------------------------------------------------------------------

float Function GetCellWaterHeight(Cell akCell) global native

; ---------------------------------------------------------------------
; Light
; ---------------------------------------------------------------------

float Function GetLightFade(Light akLight) global native

float Function GetLightFlickerPeriod(Light akLight) global native

float Function GetLightFlickerIntensityAmp(Light akLight) global native

float Function GetLightFlickerMovementAmp(Light akLight) global native

float Function GetLightFOV(Light akLight) global native

int Function GetLightRadius(Light akLight) global native

int[] Function GetLightRGB(Light akLight) global native

int Function GetLightType(Light akLight) global native

Function SetLightRGB(Light akLight, int[] akRGB) global native

; ---------------------------------------------------------------------
; Sound
; ---------------------------------------------------------------------

Function ClearFollowedObject(int aiSoundID) global native

bool Function FadeInPlay(int aiSoundID, int aiMilliseconds) global native

bool Function FadeOutAndRelease(int aiSoundID, int aiMilliseconds) global native

bool Function FadeTo(int aiSoundID, int aiVolume, int aiMilliseconds) global native

int Function GetSoundDuration(int aiSoundID) global native

int Function GetLoopType(int aiSoundID) global native

int Function GetPlaybackPosition(int aiSoundID) global native

int Function GetSoundType(int aiSoundID) global native

float Function GetVolume(int aiSoundID) global native

bool Function IsEnvelopeLoop(int aiSoundID) global native

bool Function IsPaused(int aiSoundID) global native

bool Function IsPlaying(int aiSoundID) global native

bool Function IsReady(int aiSoundID) global native

bool Function IsValid(int aiSoundID) global native

Function MultiSeek(int[] akSoundIDs, int aiMilliseconds) global native

bool Function Pause(int aiSoundID) global native

bool Function Play(int aiSoundID) global native

bool Function PlayAfter(int aiSoundID, int aiMilliseconds) global native

Function Seek(int aiSoundID, int a_milliseconds) global native

bool Function SetFrequency(int aiSoundID, float afFrequency) global native

bool Function SetFrequencyVariance(int aiSoundID, int aiVariance) global native

bool Function SetPosition(int aiSoundID, float afX, float afY, float afZ) global native

Function SetPriority(int aiSoundID, int aiPriority) global native

bool Function SetStaticAttenuation(int aiSoundID, int aiStaticAttenuation) global native

bool Function SetVolume(int aiSoundID, float afVolume) global native

bool Function Stop(int aiSoundID) global native

Function SyncPlayback(int[] akSoundIDs, int aiParentSoundID) global native