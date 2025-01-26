Scriptname Utility Native Hidden

; Calls a global function specified by name. Note that the compiler cannot check that the function
; exists, nor that the parameters are the right type. It will also not be able to auto-cast, so
; you must pre-cast the parameters to the right type (derived or parent types won't work). Will
; error if the function or script type are not valid or don't exist
Var Function CallGlobalFunction(string asScriptName, string asFuncName, Var[] aParams) native global

; Calls a global function specified by name without waiting for it to return. Note that the compiler
; cannot check that the function exists, nor that the parameters are the right type. It will also not
; be able to auto-cast, so you must pre-cast the parameters to the right type (derived or parent
; types won't work). Will error if the function or script type are not valid or don't exist
Function CallGlobalFunctionNoWait(string asScriptName, string asFuncName, Var[] aParams) native global

; Converts a float game time (in terms of game days passed) to a string detailing the date
; and time it represents in "MM/DD/YYYY HH:MM" format. A 24-hour clock is used, and the function
; is latent (due to issues in the current architecture with returning strings from code)
string Function GameTimeToString(float afGameTime) native global

; Obtains the current game time in terms of game days passed (same as the global variable)
float Function GetCurrentGameTime() native global

; Obtains the number of seconds since the application started (the same timer that WaitMenuPause uses)
; Does not take into account menu-paused, or VM frozen time
; Most useful for determining how long something took to run
float Function GetCurrentRealTime() native global

; Obtains the ID number of the current running stack
int Function GetCurrentStackID() native global debugOnly

; Int to Hex converter. General use, but mainly for converting GetFormID which returns an Int to get the Hex ID
String Function IntToHex(int IntID) global native

; Returns whether the game is currently in menu-paused or not
bool Function IsGameMenuPaused() native global

; Generates a random floating point number between afMin and afMax (inclusive)
float Function RandomFloat(float afMin = 0.0, float afMax = 1.0) native global

; Generates an array of pseudorandom floating point numbers from a specific seed between afMin and afMax (inclusive)
float[] Function RandomFloatsFromSeed(int aiSeed, int aiCount, float afMin = 0.0, float afMax = 1.0) native global

; Generates a random integer between aiMin and aiMax (inclusive)
int Function RandomInt(int aiMin = 0, int aiMax = 100) native global

; Generates an array of pseudorandom integer numbers from a specific seed between aiMin and aiMax (inclusive)
int[] Function RandomIntsFromSeed(int aiSeed, int aiCount, int aiMin = 0, int aiMax = 100) native global

; Set the given INI by type
function SetINIFloat(string ini, float value) native global debugOnly
function SetINIInt(string ini, int value) native global debugOnly
function SetINIBool(string ini, bool value) native global debugOnly
function SetINIString(string ini, string value) native global debugOnly

; String parsing functions
int[] Function SplitStringChars(string aString) native global

; Waits for the specified amount of time (latent). Timer will not run during menu mode
Function Wait(float afSeconds) native global

; Waits for the specified amount of game time (latent)
Function WaitGameTime(float afHours) native global

; Waits for the specified amount of time (latent) - Timer WILL run during menu mode
Function WaitMenuPause(float afSeconds) native global

; Frame rate capture functions only available in beta version

; Gets you a string describing the frame rate for a certain number of frames
; (String will be no longer than 1K characters long, separated by commas)
string Function CaptureFrameRate(int numFrames) native global debugOnly

; Sends the passed in test data to the tests website.
Function EnterTestData(string astestType, string astestMatter, string astestDetails, string astestResultContext, string astestResult) native global debugOnly

; Sends the start up times to the tests website.
Function PostStartUpTimes() native global debugOnly

; Starts or ends a frame rate capture -- then you can get the min or max since 
; frame capture started at any time
Function StartFrameRateCapture() native global debugOnly
Function EndFrameRateCapture() native global debugOnly
float Function GetAverageFrameRate() native global debugOnly
float Function GetMinFrameRate() native global debugOnly
float Function GetMaxFrameRate() native global debugOnly

; Memory tracking functions - only available if memory tracking is turned on
string Function GetCurrentMemory() native global debugOnly ; Must be called first, it sets up the memory stats used by the other functions
int Function GetBudgetCount() native global debugOnly
string Function GetCurrentBudget(int aiBudgetNumber) native global debugOnly
string Function GetBudgetLimit(int aiBudgetNumber) native global debugOnly
bool Function OverBudget(int aiBudgetNumber) native global debugOnly
string Function GetBudgetName(int aiBudgetNumber) native global debugOnly

; Expiry (Expiration Day) helper functions...

; returns a float representing days in the future from now (in terms of GameDaysPassed - where 1 = 24 hours)
;**DaysFromNow**: how many days in the future should the expiration date be?
;**LocalPlanet**: (optional, ignored if none) will scale DaysFromNow so that it will reflect local day length on planet is if different than universal 24 standard
;**MaxUniversalDays**: (optional, ignored if <= 0) - no matter the local day length scale, this is the max (24 hour) days you want to add - useful for tidally locked planets, or planets with exceptionally long days
;**FutureStartDay**: (optional, ignored if < GameDaysPassed) - the start day to add DaysFromNow to.
float Function ExpiryDay(float DaysFromNow, Planet LocalPlanet = none, float MaxUniversalDays = -1.0, float FutureStartDay = -1.0) global
    float startDay = math.Max(FutureStartDay, Utility.GetCurrentGameTime())

    float localPlanetDayMult = 1.0
	if  LocalPlanet
		localPlanetDayMult = 24 / LocalPlanet.GetDayLength()
	endif

    float globalDaysToAdd = DaysFromNow * localPlanetDayMult

	if MaxUniversalDays > 0
		globalDaysToAdd = Math.Min(globalDaysToAdd, MaxUniversalDays)
	endif

    float expiryDay = startDay + globalDaysToAdd

	return  expiryDay
EndFunction

; checks to see if the passed in value is less than the current day
bool Function HasExpiryDayPassed(float afExpiryDay) global
	return GetCurrentGameTime() >= afExpiryDay
EndFunction

; returns hours until specified LOCAL target hour (local equivalent of 24-hour time, 0.0-24.0)
float Function GetHoursUntilLocalHour(float afTargetHourLocal) global
	float dayLength = 24.0 ; default if no planet
	Planet currentPlanet = Game.GetPlayer().GetCurrentPlanet()
	if currentPlanet
		dayLength = currentPlanet.GetDayLength()
	EndIf
	float currentTime = 0.0
	if currentPlanet
		currentTime = Game.GetLocalTime() ; returns local time normalized to 24 hours, so 12 always = noon, 24 = midnight, etc.
	Else
		float currentGameTime = GetCurrentGameTime()
	 	currentTime = (currentGameTime - Math.Floor(currentGameTime))*24.0
	endif

	float hoursUntil = 0.0
	if afTargetHourLocal > currentTime
		hoursUntil = afTargetHourLocal - currentTime
	Else
		hoursUntil = 24.0 - currentTime + afTargetHourLocal
	EndIf

	; scale hours until to local day length
	float realHoursUntil = hoursUntil * dayLength/24.0

	debug.trace(" GetHoursUntilLocalHour: local day Length=" + dayLength + ", currentTime=" + currentTime)
	debug.trace("     hoursUntil (24 hour day)=" + hoursUntil + ", realHoursUntil (local day length)=" + realHoursUntil)
	return realHoursUntil
endFunction


;returns first player in list of refs passed in (mainly for use in distance check events)
ObjectReference Function GetFirstPlayer(ObjectReference refToCheck01, ObjectReference refToCheck02, ObjectReference refToCheck03 = NONE, ObjectReference refTocheck04 = NONE) global
	ObjectReference thePlayer = Game.GetPlayer()
	ObjectReference foundPlayerRef = NONE

	ObjectReference[] refsToCheck = new ObjectReference[4]
	refsToCheck[0] = refToCheck01
	refsToCheck[1] = refToCheck02
	refsToCheck[2] = refToCheck03
	refsToCheck[3] = refToCheck04
	; etc. if we need more

	int i = 0
	While (foundPlayerRef == NONE && i < refsToCheck.length)
		if refsToCheck[i] == thePlayer
			foundPlayerRef = refsToCheck[i]
		endif
		i += 1
	EndWhile

	return foundPlayerRef
EndFunction

;returns first non-player in list of refs passed in (mainly for use in distance check events)
ObjectReference Function GetFirstNonPlayer(ObjectReference refToCheck01, ObjectReference refToCheck02, ObjectReference refToCheck03 = NONE, ObjectReference refTocheck04 = NONE) global
	ObjectReference thePlayer = Game.GetPlayer()
	ObjectReference foundNonPlayerRef = NONE

	ObjectReference[] refsToCheck = new ObjectReference[4]
	refsToCheck[0] = refToCheck01
	refsToCheck[1] = refToCheck02
	refsToCheck[2] = refToCheck03
	refsToCheck[3] = refToCheck04
	; etc. if we need more

	int i = 0
	While (foundNonPlayerRef == NONE && i < refsToCheck.length)
		if refsToCheck[i] != thePlayer
			foundNonPlayerRef = refsToCheck[i]
		endif
		i += 1
	EndWhile

	return foundNonPlayerRef
EndFunction
