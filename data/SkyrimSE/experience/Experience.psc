ScriptName Experience hidden

; --- Public ---------

int Function GetScriptVersion() global
    Guard()
endFunction

; Verion format: Major.Minor.Patch.Build
string Function GetVersion() native global

; Adds specified amount of experience points, optionally shows meter
Function AddExperience(int points, bool meter = false) global native

; Shows middle of screen notification, optionally plays sound
Function ShowNotification(string text, string status, string sound) global native

; www.creationkit.com/index.php?title=ActorValueInfo_Script
float Function GetSkillCap(int skill) global native

; --- Settings -------

int Function GetSettingInt(string setting) global native
float Function GetSettingFloat(string setting) global native
bool Function GetSettingBool(string setting) global native
string Function GetSettingString(string setting) global native

Function SetSettingInt(string setting, int value) global native
Function SetSettingFloat(string setting, float value) global native
Function SetSettingBool(string setting, bool value) global native
Function SetSettingString(string setting, string value) global native

; Saves all setting modifications to file
Function SaveSettings() global native


Function Guard()
    Debug.MessageBox("Experience: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
