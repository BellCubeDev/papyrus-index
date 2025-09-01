;/ Decompiled by Champollion V1.0.0
Source   : FISSScript.psc
Modified : 2014-02-04 03:19:06
Compiled : 2014-02-04 03:21:56
User     : GrafConti
Computer : GRAFCONTI-PC
/;
scriptName FISSScript extends FISSInterface

;-- Properties --------------------------------------

;-- Variables ---------------------------------------
String Property LoadCObject = "NULL" Auto
String Property SaveCObject = "NULL" Auto

;-- Native Functions ---------------------------------------
String Function CFissBeginLoad(String filename) global native
String Function CFissEndLoad(String cobj) global native
Bool Function CFissLoadBool(String cobj, String name) global native
String Function CFissLoadString(String cobj, String name) global native
Float Function CFissLoadFloat(String cobj, String name) global native
Int Function CFissLoadInt(String cobj, String name) global native

String Function CFissBeginSave(String filename, String modname) global native
String Function CFissEndSave(String cobj) global native
Function CFissSaveBool(String cobj, String name, Bool value) global native
Function CFissSaveString(String cobj, String name, String value) global native
Function CFissSaveFloat(String cobj, String name, Float value) global native
Function CFissSaveInt(String cobj, String name, Int value) global native

String Function CFissSaveTextToTxtFile(String filename, String text) global native

;-- Functions ---------------------------------------

Float function getVersion()
    Guard()
endFunction

function beginLoad(String filename)
    Guard()
endFunction

String function endLoad()
    Guard()
endFunction

Bool function loadBool(String name)
    Guard()
endFunction

String function loadString(String name)
    Guard()
endFunction

Float function loadFloat(String name)
    Guard()
endFunction

Int function loadInt(String name)
    Guard()
endFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

function beginSave(String filename, String modname)
    Guard()
endFunction

String function endSave()
    Guard()
endFunction

function saveBool(String name, Bool b)
    Guard()
endFunction

function saveString(String name, String S)
    Guard()
endFunction

function saveFloat(String name, Float f)
    Guard()
endFunction

function saveInt(String name, Int i)
    Guard()
endFunction

String function saveTextToTxtFile(String filename, String text)
    Guard()
endFunction


Function Guard()
    Debug.MessageBox("FISSScript: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
