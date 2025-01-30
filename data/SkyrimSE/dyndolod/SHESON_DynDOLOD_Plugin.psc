Scriptname SHESON_DynDOLOD_Plugin hidden

; Get version of DynDOLOD.DLL
int Function GetVersion() global native

; Get version of papyrus scripts
int Function GetScriptVersion() global
    Guard()
EndFunction

; Get required version of SKSE
int Function GetSKSEVersion() global native

; Get version of ESM plugin
int Function GetESMVersion() global native

; Get version of ESP plugin
int Function GetESPVersion() global native

; Bunch of numbers worlds file
string Function GetBoNWorlds() global native

; Bunch of numbers current LOD world data file
string Function GetBoNData() global native

; get if checks were successful
bool Function GetSuccessful() global native

; Get last message
string Function GetLastMessage() global native

; Get plugin limit
int Function GetPluginLimit() global native

; Copy of SKSE64 function
bool Function IsPluginInstalled(string file) global native

; Get current master reference
ObjectReference Function GetMyMaster() global native

; Get the current LOD worldspace EditorID
string Function GetMyLODWorld() global native

; get LOD origin cell X
int Function GetMyLODWorldX() global native

; get LOD origin cell Y
int Function GetMyLODWorldY() global native

; Get the LOD filename for EditorID of worldspace
string Function GetWorldspaceLODNameStr(string file) global native

; Gets the value for key from [config] section, none for global or LODName file
string Function GetConfig(string file = "none", string key, string default = "") global native

; Get unsigned INI setting
int Function GetINIUnsigned(string name) global native

; Set unsigned INI setting
Function SetINIUnsigned(string name, int value) global native

; get dynamic LOD enabled/disabled
bool Function GetMyActive() global native

; set dynamic LOD enable/disable
Function SetMyActive(bool value) global native

; get enable/disable large references in child worlds using parent world for LOD
bool Function GetLargeRefChildWorlds() global native

; Set enable/disable large references in child worlds using parent world for LOD
Function SetLargeRefChildWorlds(bool value) global native

; Get GlowMultiple
float Function GetGlowMultiple() global native

; Set GlowMultiple
Function SetGlowMultiple(float value) global native

; Get DragonDistance
float Function GetDragonDistance() global native

; Set DragonDistance
Function SetDragonDistance(float value) global native

; Get count of references to reset
int Function GetResetsCount() global native

; Get reference to reset at index
ObjectReference Function GetResetAt(int value) global native


Function Guard()
    Debug.MessageBox("SHESON_DynDOLOD_Plugin: Dom't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction

