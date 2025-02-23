Scriptname DbIniFunctions Hidden 
;/This is for convenience to have get / set / has custom ini functions work on either SE or LE 
Uses PapyrusIniManipulator for SE or PapyrusIni for LE
These functions assume using SE PapyrusIniManipulator as default, which means file path  is relative to the Skyrim root folder. So use: "Data/MySettings.ini" for ini files in the data folder. 
PapyrusIni is relative to the data folder, so to work on either SE or LE make sure your custom ini files are in the Data folder.
If called on LE, these functions will auto convert the file paths for use with PapyrusIni. 
Note, if using these you have to have both PapyrusIniManipulator.psc and PapyrusIni.psc in your source folder to compile. 
Requires DbMiscFunctions as well.

example: in MySettings.ini you have: 
[MySection]
iMyInt=3

DbIniFunctions.GetIniInt("Data/MySettings.ini", "MySection", "iMyInt") will return 3 on both SE and LE, if PapyrusIniManipulator is installed on SE or PapyrusIni is installed on LE.

List Of Functions: 
Bool Function GetIniBool(String sFilePath, String sSection, String sKey, Bool Default = false) Global
int Function GetIniInt(String sFilePath, String sSection, String sKey, int Default = 0) Global
Float Function GetIniFloat(String sFilePath, String sSection, String sKey, Float Default = 0.0) Global
String Function GetIniString(String sFilePath, String sSection, String sKey, String Default = "") Global

Bool Function SetIniBool(String sFilePath, String sSection, String sKey, Bool Value, Bool bForce = False) Global
Bool Function SetIniInt(String sFilePath, String sSection, String sKey, Int Value, Bool bForce = False) Global
Bool Function SetIniFloat(String sFilePath, String sSection, String sKey, Float Value, Bool bForce = False) Global
Bool Function SetIniString(String sFilePath, String sSection, String sKey, String Value, Bool bForce = False) Global

Bool Function HasIniBool(String sFilePath, String sSection, String sKey) Global
Bool Function HasIniInt(String sFilePath, String sSection, String sKey) Global
Bool Function HasIniFloat(String sFilePath, String sSection, String sKey) Global
Bool Function HasIniString(String sFilePath, String sSection, String sKey) Global

String Function ConvertFilePathFromSEtoLE(String sFilePath) Global
/;

;Getters============================================================================================
Bool Function GetIniBool(String sFilePath, String sSection, String sKey, Bool Default = false) Global 
    Guard()
EndFunction 

int Function GetIniInt(String sFilePath, String sSection, String sKey, int Default = 0) Global 
    Guard()
EndFunction 

Float Function GetIniFloat(String sFilePath, String sSection, String sKey, Float Default = 0.0) Global 
    Guard()
EndFunction 

String Function GetIniString(String sFilePath, String sSection, String sKey, String Default = "") Global 
    Guard()
EndFunction 

;Setters =======================================================================================================
;if bForce == true, will add the sKey to the sSection if it doesn't exist.
Bool Function SetIniBool(String sFilePath, String sSection, String sKey, Bool Value, Bool bForce = False) Global 
    Guard()
EndFunction 

Bool Function SetIniInt(String sFilePath, String sSection, String sKey, Int Value, Bool bForce = False) Global 
    Guard()
EndFunction 

Bool Function SetIniFloat(String sFilePath, String sSection, String sKey, Float Value, Bool bForce = False) Global 
    Guard()
EndFunction 

Bool Function SetIniString(String sFilePath, String sSection, String sKey, String Value, Bool bForce = False) Global 
    Guard()
EndFunction 

;Has functions==================================================================
Bool Function HasIniBool(String sFilePath, String sSection, String sKey) Global
    Guard()
EndFunction

Bool Function HasIniInt(String sFilePath, String sSection, String sKey) Global
    Guard()
EndFunction

Bool Function HasIniFloat(String sFilePath, String sSection, String sKey) Global
    Guard()
EndFunction

Bool Function HasIniString(String sFilePath, String sSection, String sKey) Global
    Guard()
EndFunction
;==================================================================================

;used for the above functions
;Requires DbMiscFunctions and skse
String Function ConvertFilePathFromSEtoLE(String sFilePath) Global
    Guard()
Endfunction 

; used to write a function in your script to create an ini file for your mod. 
; Let's say you have a script Data/Scripts/Source/MyScript.psc 
; In the script you have a bunch of GetIni functions from this script like: 
; String MyString = DbIniFunctions.GetIniString("Data/Interface/MyMod/Settings.ini", "Strings", "MyString", "My String")
; int MyInt = DbIniFunctions.GetIniInt("Data/Interface/MyMod/Settings.ini", "Main", "MyInt", 42)
; Using this function: 'WriteForceSetIniFunction("Data/Scripts/Source/MyScript.psc", "Data/Scripts/Source/MyScript.psc", "CreateIniFile")'
; Will write this function in your script: 
; Function CreateIniFile()
;     DbIniFunctions.SetIniString("Data/Interface/MyMod/Settings.ini", "Strings", "MyString", "My String", true)
;     DbIniFunctions.SetIniInt("Data/Interface/MyMod/Settings.ini", "Main", "MyInt", 42, true)
; Endfunction
; You can then use this function to create your ini file and write all the inis in one go.
; requires skse
Function WriteForceSetIniFunction(String inputFilePath, string outputFilePath, string functionName, bool onlyInisWithDefaults = true) global
    Guard()
EndFunction

Function Guard()
    Debug.MessageBox("DbIniFunctions: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
