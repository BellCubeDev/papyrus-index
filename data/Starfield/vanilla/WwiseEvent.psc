Scriptname WwiseEvent extends Form Native Hidden

; A single Wwise Switch parameter
struct WwiseSwitchParam
	string GroupName	; Name of the Switch Group that contains the given State
	string StateName	; Name of the Switch State that should be activated 
endStruct

; Helper function to construct a WwiseSwitchParam
WwiseSwitchParam Function MakeNewWwiseSwitchParam(string aGroupName, string aStateName) global
	WwiseSwitchParam retval = new WwiseSwitchParam
	retval.GroupName = aGroupName
	retval.StateName = aStateName
	return retval
endFunction

; A single Wwise RTPC parameter
struct WwiseRTPCParam
	string Name		; Name of the Wwise Game Parameter to set
	float Value		; Value the Game Parameter should be set to
endStruct

; Helper function to construct a WwiseRTPCParam
WwiseRTPCParam Function MakeNewWwiseRTPCParam(string aName, float aValue) global
	WwiseRTPCParam retval = new WwiseRTPCParam
	retval.Name = aName
	retval.Value = aValue
	return retval
endFunction

; Play this sound base object from the specified source
int Function Play(ObjectReference akSource, WwiseSwitchParam[] aSwitchParams = none, WwiseRTPCParam[] aRTPCParams = none)
	return PlayImpl(akSource, ExtractSwitchGroups(aSwitchParams), ExtractSwitchStates(aSwitchParams), ExtractRTPCNames(aRTPCParams), ExtractRTPCValues(aRTPCParams))
endFunction

; Play this sound base object as a UI sound
int Function PlayUI(WwiseSwitchParam[] aSwitchParams = none, WwiseRTPCParam[] aRTPCParams = none)
	return PlayUIImpl(ExtractSwitchGroups(aSwitchParams), ExtractSwitchStates(aSwitchParams), ExtractRTPCNames(aRTPCParams), ExtractRTPCValues(aRTPCParams))
endFunction

; Play this sound base object from the specified source, and wait for it to finish
bool Function PlayAndWait(ObjectReference akSource, WwiseSwitchParam[] aSwitchParams = none, WwiseRTPCParam[] aRTPCParams = none)
	return PlayAndWaitImpl(akSource, ExtractSwitchGroups(aSwitchParams), ExtractSwitchStates(aSwitchParams), ExtractRTPCNames(aRTPCParams), ExtractRTPCValues(aRTPCParams))
endFunction

; Play this sound base object as a UI sound, and wait for it to finish
bool Function PlayUIAndWait(WwiseSwitchParam[] aSwitchParams = none, WwiseRTPCParam[] aRTPCParams = none)
	return PlayUIAndWaitImpl(ExtractSwitchGroups(aSwitchParams), ExtractSwitchStates(aSwitchParams), ExtractRTPCNames(aRTPCParams), ExtractRTPCValues(aRTPCParams))
endFunction

; Play this sound base object from the specified source and set an RTPC on the instance before playing
int Function PlayWithRTPC(ObjectReference akSource, string asRTPCName, float afRTPCValue) native

; Play this sound base object as UI and set an RTPC on the instance before playing
int Function PlayUIWithRTPC(string asRTPCName, float afRTPCValue) native

; Stops a given playback instance of a sound
Function StopInstance(int aiPlaybackInstance) native global

; Update a single RTPC value on a given playback instance of a sound
Function UpdateInstanceRTPC(int aiPlaybackInstance, string asRTPCName, float afRTPCValue) native global

; Update a set of RTPC values on a given playback instance of a sound
Function UpdateInstanceRTPCs(int aiPlaybackInstance, WwiseRTPCParam[] aRTPCParams) global
	UpdateInstanceRTPCsImpl(aiPlaybackInstance, ExtractRTPCNames(aRTPCParams), ExtractRTPCValues(aRTPCParams))
endFunction

; Sets the global value of a Wwise real-time parameter control
Function SetGlobalRTPC(string asRTPCName, float afRTPCValue) native global

; Sets a global Wwise State Group to the given named state
Function SetGlobalState(string asStateGroup, string asStateName) native global

; Called by the VM to play a UI sound by the ID of sound
Function PlayMenuSound(string asSoundID) native global


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Helper functions below are not meant for direct use
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

; For internal use only. Extracts an array of Switch Group names from an array of WwiseSwitchParam.
string[] Function ExtractSwitchGroups(WwiseSwitchParam[] aSwitchParams) global private
	string[] switchGroups
	if aSwitchParams.length > 0
		switchGroups = new string[aSwitchParams.length]
		int curSwitch = 0
		while (curSwitch < aSwitchParams.length)
			switchGroups[curSwitch] = aSwitchParams[curSwitch].GroupName
			curSwitch += 1
		endWhile
	endif
	return switchGroups
endFunction

; For internal use only. Extracts an array of Switch State names from an array of WwiseSwitchParam.
string[] Function ExtractSwitchStates(WwiseSwitchParam[] aSwitchParams) global private
	string[] switchStates
	if aSwitchParams.length > 0
		switchStates = new string[aSwitchParams.length]
		int curSwitch = 0
		while (curSwitch < aSwitchParams.length)
			switchStates[curSwitch] = aSwitchParams[curSwitch].StateName
			curSwitch += 1
		endWhile
	endif
	return switchStates
endFunction

; For internal use only. Extracts an array of RTPC names from an array of WwiseRTPCParam.
string[] Function ExtractRTPCNames(WwiseRTPCParam[] aRTPCParams) global private
	string[] rtpcNames
	if aRTPCParams.length > 0
		rtpcNames = new string[aRTPCParams.length]
		int curRTPC = 0
		while (curRTPC < aRTPCParams.length)
			rtpcNames[curRTPC] = aRTPCParams[curRTPC].Name
			curRTPC += 1
		endWhile
	endif
	return rtpcNames
endFunction

; For internal use only. Extracts an array of RTPC values from an array of WwiseRTPCParam.
float[] Function ExtractRTPCValues(WwiseRTPCParam[] aRTPCParams) global private
	float[] rtpcValues
	if aRTPCParams.length > 0
		rtpcValues = new float[aRTPCParams.length]
		int curRTPC = 0
		while (curRTPC < aRTPCParams.length)
			rtpcValues[curRTPC] = aRTPCParams[curRTPC].Value
			curRTPC += 1
		endWhile
	endif
	return rtpcValues
endFunction

; For internal use only. Users should call the Play function defined above. Play this Wwise Event from the given ObjectReference with an optional set of control parameters.
int Function PlayImpl(ObjectReference akSource, string[] aSwitchGroups, string[] aSwitchStates, string[] aRTPCNames, float[] aRTPCValues) native private

; For internal use only. Users should call the PlayUI function defined above. Plays this Wwise Event as a UI sound with an optional set of control parameters.
int Function PlayUIImpl(string[] aSwitchGroups, string[] aSwitchStates, string[] aRTPCNames, float[] aRTPCValues) native private

; For internal use only. Users should call the PlayAndWait function defined above. Play this Wwise Event from the given ObjectReference with an optional set of control parameters, and wait for it to finish before resuming execution.
bool Function PlayAndWaitImpl(ObjectReference akSource, string[] aSwitchGroups, string[] aSwitchStates, string[] aRTPCNames, float[] aRTPCValues) native private

; For internal use only. Users should call the PlayUIAndWait function defined above. Plays this Wwise Event as a UI sound with an optional set of control parameters, and wait for it to finish before resuming execution.
bool Function PlayUIAndWaitImpl(string[] aSwitchGroups, string[] aSwitchStates, string[] aRTPCNames, float[] aRTPCValues) native private

; For internal use only. Users should call the UpdateInstanceRTPCs function defined above. Updates a set of RTPC values on a given playback instance.
Function UpdateInstanceRTPCsImpl(int aiPlaybackInstance, string[] aRTPCNames, float[] aRTPCValues) native global private
