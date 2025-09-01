;/ Decompiled by Champollion V1.0.0
Source   : FISSInterface.psc
Modified : 2013-11-28 22:55:22
Compiled : 2013-11-28 22:55:24
User     : GrafConti
Computer : GRAFCONTI-PC
/;
scriptName FISSInterface extends Quest

;-- Properties --------------------------------------

;-- Variables ---------------------------------------

;-- Functions ---------------------------------------

String function endSave()

	; Empty function
endFunction

Float function getInterfaceVersion()
    Guard()
endFunction

String function getModName()

	; Empty function
endFunction

Float function loadFloat(String name)

	; Empty function
endFunction

Bool function loadBool(String name)

	; Empty function
endFunction

function saveBool(String name, Bool b)

	; Empty function
endFunction

function beginSave(String filename, String modname)

	; Empty function
endFunction

function saveString(String name, String S)

	; Empty function
endFunction

function setInfoText(String text)

	; Empty function
endFunction

; Skipped compiler generated GotoState

String function requestFilename()

	; Empty function
endFunction

String function endLoad()

	; Empty function
endFunction

; Skipped compiler generated GetState

function setText(String text)

	; Empty function
endFunction

Float function getVersion()

	; Empty function
endFunction

function setTheme(String fissInputTheme, Float fissInputScale, Float fissInputAplha)

	; Empty function
endFunction

String function loadString(String name)

	; Empty function
endFunction

Int function loadInt(String name)

	; Empty function
endFunction

function blockInput(Bool block)

	; Empty function
endFunction

String function getAllFilenamesInFolder(String path)

	; Empty function
endFunction

function forceClose()

	; Empty function
endFunction

function setTitle(String title)

	; Empty function
endFunction

String function requestUserInput(String titleMessage)

	; Empty function
endFunction

function saveInt(String name, Int i)

	; Empty function
endFunction

String function saveTextToTxtFile(String filename, String text)

	; Empty function
endFunction

function beginLoad(String filename)

	; Empty function
endFunction

function hideInfoText(Bool hide)

	; Empty function
endFunction

function saveFloat(String name, Float f)

	; Empty function
endFunction


Function Guard()
    Debug.MessageBox("FISSInterface: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
