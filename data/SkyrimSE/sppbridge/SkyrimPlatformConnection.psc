scriptName SkyrimPlatformConnection extends ReferenceAlias
{Extend to implement a 'connection' which can communicate with Skyrim Platform

```
scriptName MyConnection extends SkyrimPlatformConnection

event OnSetup()
    ; Defaults to the name of the script, e.g. MyConnection
    ConnectionName = "MyConnectionName"
endEvent

event OnConnected()
endEvent

event OnEvent(string eventName, string data)
endEvent

event OnRequest(string replyId, string query, string data)
    Reply(replyId, "Response Data")
endEvent
```
}

Actor property Player auto

string _connectionName
SkyrimPlatformBridge _bridgeAPI

bool property IsConnected auto
float property ConnectionTimeout auto
float property ConnectionAttemptTimeout auto

event OnInit()
    Guard()
endEvent

event OnPlayerLoadGame()
    Guard()
endEvent

function ConnectToSkyrimPlatform(float timeout)
    Guard()
endFunction

; Use this to configure ConnectionName (defaults to name of the script, e.g. `Foo` for a script named `FooConnection`)
;
; ```
; scriptName MyModEvents extends ConnectedToSkyrimPlatform
;
; event OnSetup()
;   ConnectionName = "MyConnectionName"
; endEvent
; ```
;
string property ConnectionName
    string function get()
        if ! _connectionName
            ; Get the scriptName of the current script
            _connectionName = StringUtil.Substring(self, 1, StringUtil.Find(self, " ") - 1)
        endIf
        return _connectionName
    endFunction
    function set(string value)
        _connectionName = value
    endFunction
endProperty

; Use this to configure ConnectionName (defaults to name of mod file, e.g. "MyMod" for "MyMod.esp")
;
; ```
; scriptName MyModEvents extends ConnectedToSkyrimPlatform
;
; event OnSetup()
;   ConnectionName = "MyConnectionName"
; endEvent
; ```
;
event OnSetup()
endEvent

function Send(string eventName, string data = "", string target = "", string source = "")
    Guard()
endFunction

string function Request(string query, string data = "", string target = "", string source = "", float waitInterval = 0.5, float timeout = 10.0) ; set back to 0.5 (the 3 interval)
    Guard()
endFunction

event OnEvent(string eventName, string data)
endEvent

event OnRequest(string replyId, string query, string data)
endEvent

event OnSkyrimPlatformEvent(string eventName, string source, string data)
    Guard()
endEvent

event OnSkyrimPlatformRequest(string replyId, string query, string data, string source)
    Guard()
endEvent

event OnConnected()
endEvent

event HandleSkyrimPlatformEvent(string messageType, string eventNameOrQuery, string source, string target, string data, string replyID)
    Guard()
endEvent

function Reply(string replyId, string data)
    Guard()
endFunction


Function Guard()
    Debug.MessageBox("SkyrimPlatformConnection: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
