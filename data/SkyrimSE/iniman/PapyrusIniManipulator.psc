ScriptName PapyrusIniManipulator Hidden

String Function GetVersion() Global Native
String Function GetTranslation(String sKey) Global Native

Bool Function IniDataExists(Int iLevel, String sPath, String sSection = "", String sKey = "") Global Native
Bool Function ClearIniData(Int iLevel, String sPath, String sSection = "", String sKey = "") Global Native
Bool Function DestroyIniData(Int iLevel, String sPath, String sSection = "", String sKey = "") Global Native
String[] Function GetIniData(Int iLevel, String sPath, String sSection = "", String sKey = "") Global Native

Bool Function PullBoolFromIni(String sPath, String sSection, String sKey, Bool bDefault = False) Global Native
Int Function PullIntFromIni(String sPath, String sSection, String sKey, Int iDefault = 0) Global Native
Float Function PullFloatFromIni(String sPath, String sSection, String sKey, Float fDefault = 0.0) Global Native
String Function PullStringFromIni(String sPath, String sSection, String sKey, String sDefault = "") Global Native

Bool Function PushBoolToIni(String sPath, String sSection = "", String sKey = "", Bool bValue = False, Bool bForce = False) Global Native
Bool Function PushIntToIni(String sPath, String sSection = "", String sKey = "", Int iValue = 0, Bool bForce = False) Global Native
Bool Function PushFloatToIni(String sPath, String sSection = "", String sKey = "", Float fValue = 0.0, Bool bForce = False) Global Native
Bool Function PushStringToIni(String sPath, String sSection = "", String sKey = "", String sValue = "", Bool bForce = False) Global Native
