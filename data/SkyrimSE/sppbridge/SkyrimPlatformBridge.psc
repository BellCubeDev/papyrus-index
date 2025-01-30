scriptName SkyrimPlatformBridge extends Quest

string property CurrentlyInstalledVersion auto
ObjectReference property MessagesContainer auto
int NextMessageIndex = -1
Form[] Messages
bool[] MessageIsInMessagesContainer
float[] MessageLocks
Form property SkyrimPlatformBridge_Message1 auto
Form property SkyrimPlatformBridge_Message2 auto
Form property SkyrimPlatformBridge_Message3 auto
Form property SkyrimPlatformBridge_Message4 auto
Form property SkyrimPlatformBridge_Message5 auto
Form property SkyrimPlatformBridge_Message6 auto
Form property SkyrimPlatformBridge_Message7 auto
Form property SkyrimPlatformBridge_Message8 auto
Form property SkyrimPlatformBridge_Message9 auto
Form property SkyrimPlatformBridge_Message10 auto
Form property SkyrimPlatformBridge_Message11 auto
Form property SkyrimPlatformBridge_Message12 auto
Form property SkyrimPlatformBridge_Message13 auto
Form property SkyrimPlatformBridge_Message14 auto
Form property SkyrimPlatformBridge_Message15 auto
Form property SkyrimPlatformBridge_Message16 auto
Form property SkyrimPlatformBridge_Message17 auto
Form property SkyrimPlatformBridge_Message18 auto
Form property SkyrimPlatformBridge_Message19 auto
Form property SkyrimPlatformBridge_Message20 auto
Form property SkyrimPlatformBridge_Message21 auto
Form property SkyrimPlatformBridge_Message22 auto
Form property SkyrimPlatformBridge_Message23 auto
Form property SkyrimPlatformBridge_Message24 auto
Form property SkyrimPlatformBridge_Message25 auto
Form property SkyrimPlatformBridge_Message26 auto
Form property SkyrimPlatformBridge_Message27 auto
Form property SkyrimPlatformBridge_Message28 auto
Form property SkyrimPlatformBridge_Message29 auto
Form property SkyrimPlatformBridge_Message30 auto
Form property SkyrimPlatformBridge_Message31 auto
Form property SkyrimPlatformBridge_Message32 auto
Form property SkyrimPlatformBridge_Message33 auto
Form property SkyrimPlatformBridge_Message34 auto
Form property SkyrimPlatformBridge_Message35 auto
Form property SkyrimPlatformBridge_Message36 auto
Form property SkyrimPlatformBridge_Message37 auto
Form property SkyrimPlatformBridge_Message38 auto
Form property SkyrimPlatformBridge_Message39 auto
Form property SkyrimPlatformBridge_Message40 auto
Form property SkyrimPlatformBridge_Message41 auto
Form property SkyrimPlatformBridge_Message42 auto
Form property SkyrimPlatformBridge_Message43 auto
Form property SkyrimPlatformBridge_Message44 auto
Form property SkyrimPlatformBridge_Message45 auto
Form property SkyrimPlatformBridge_Message46 auto
Form property SkyrimPlatformBridge_Message47 auto
Form property SkyrimPlatformBridge_Message48 auto
Form property SkyrimPlatformBridge_Message49 auto
Form property SkyrimPlatformBridge_Message50 auto
Form property SkyrimPlatformBridge_Message51 auto
Form property SkyrimPlatformBridge_Message52 auto
Form property SkyrimPlatformBridge_Message53 auto
Form property SkyrimPlatformBridge_Message54 auto
Form property SkyrimPlatformBridge_Message55 auto
Form property SkyrimPlatformBridge_Message56 auto
Form property SkyrimPlatformBridge_Message57 auto
Form property SkyrimPlatformBridge_Message58 auto
Form property SkyrimPlatformBridge_Message59 auto
Form property SkyrimPlatformBridge_Message60 auto
Form property SkyrimPlatformBridge_Message61 auto
Form property SkyrimPlatformBridge_Message62 auto
Form property SkyrimPlatformBridge_Message63 auto
Form property SkyrimPlatformBridge_Message64 auto
Form property SkyrimPlatformBridge_Message65 auto
Form property SkyrimPlatformBridge_Message66 auto
Form property SkyrimPlatformBridge_Message67 auto
Form property SkyrimPlatformBridge_Message68 auto
Form property SkyrimPlatformBridge_Message69 auto
string property SkyrimPlatformBridgeCustomEventSkseModEventNamePrefix = "SkyrimPlatformBridge_Event_" autoReadonly
string property SkyrimPlatformBridgeEventMessageDelimiter = "<||>" autoReadonly
string property SkyrimPlatformBridgeEventMessagePrefix = "::SKYRIM_PLATFORM_BRIDGE_EVENT::" autoReadonly
string property SkyrimPlatformBridgeRequestMessagePrefix = "::SKYRIM_PLATFORM_BRIDGE_REQUEST::" autoReadonly
string property SkyrimPlatformBridgeResponseMessagePrefix = "::SKYRIM_PLATFORM_BRIDGE_RESPONSE::" autoReadonly
xSkyrimPlatformBridge_Listener[] ListenerScripts
int NextListenerIndex
bool property IsReady auto

string function GetCurrentVersion() global
    Guard()
endFunction

SkyrimPlatformBridge function GetPrivateAPI() global
    Guard()
endFunction

event OnInit()
    Guard()
endEvent

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; API Public Global Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

function SendEvent(string eventName, string target, string data = "", string source = "") global
    Guard()
endFunction

function Reply(string data = "", string replyId) global
    Guard()
endFunction

string function Request(string query, string target, string data = "", string source = "", float waitInterval = 0.5, float timeout = 10.0) global
    Guard()
endFunction

function ListenForEvents_Alias(string connectionName, Alias callbackAlias, string callbackFunction) global
    Guard()
endFunction

function ListenForEvents_Form(string connectionName, Form callbackForm, string callbackFunction) global
    Guard()
endFunction

function ListenForEvents_ActiveMagicEffect(string connectionName, ActiveMagicEffect callbackAME, string callbackFunction) global
    Guard()
endFunction

string function GetEventsSkseModEventName(string connectionName) global
    Guard()
endFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; API Instance Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

function SendRawMessageAPI(string text)
    Guard()
endFunction

function SendEventAPI(string eventName, string source, string target, string data, string replyID = "")
    Guard()
endFunction

function ReplyAPI(string replyId, string data)
    Guard()
endFunction

string function MakeRequestAPI(string query, string source, string target, string data, float waitInterval = 0.5, float timeout = 10.0)
    Guard()
endFunction

string function BeginRequestAPI(string query, string source, string target, string data, string replyID)
    Guard()
endFunction

string function GetUniqueReplyID()
    Guard()
endFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Private Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

function _unlockMessage(int messageIndex)
    Guard()
endFunction

int function _getAndLockNextAvailableMessageIndex()
    Guard()
endFunction

int function _incrementOrFloorNextMessageIndex()
    Guard()
endFunction

int function _tryLockNextAvailableMessageIndex(float lock)
    Guard()
endFunction

string function _getUniqueReplyId()
    Guard()
endFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Event Listeners
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

xSkyrimPlatformBridge_Listener function GetListener()
    Guard()
endFunction


Function Guard()
    Debug.MessageBox("SkyrimPlatformBridge: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
