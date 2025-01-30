scriptName SkyMessage hidden
{Display custom Messages with any number of buttons!}

; VS Code has a bug where the documentation of the first function isn't shown. 
; This is that function:
function Delete(int messageBoxId) global native

; Open a messagebox and return the name of the selected button.
;
; ### Get name of selected button
; ```psc
; string selectedButtonName = SkyMessage.Show("body text of message", "Ok", "Cancel", "More buttons...")
; ```
;
; ### Get index of selected button
; If you would prefer to get the `int` index of the button:
; ```psc
; string selectedButtonIndex = SkyMessage.Show("body text of message", "Ok", "Cancel", "More buttons...", getIndex = true)
; ```
;
; ### Button names
; `Show()` accepts up to 10 button names. If you would prefer to specify the button names via an array, see: `SkyMessage.ShowArray()`
;
; ### Advanced
; You can also specify a timeout. This is the number of seconds after which the function will return with the text "TIMED_OUT":
; ```psc
; string selectedButtonName = SkyMessage.Show("body text of message", "Ok", "Cancel", "More buttons...", timeoutSeconds = 69.0)
; ```
string function Show(string bodyText, string button1, string button2 = "", string button3 = "", string button4 = "", string button5 = "", string button6 = "", string button7 = "", string button8 = "", string button9 = "", string button10 = "", bool getIndex = false, float waitInterval = 0.1, float timeoutSeconds = 0.0) global
    Guard()
endFunction

; Open a messagebox and return the name of the selected button, given a string array of button names.
;
; _Useful for when you are not hard-coding the names of the buttons!_
;
; #### Button names
; Any string array should work for button names.
; ```psc
; string[] buttons = new string[2]
; buttons[0] = "Ok"
; buttons[1] = "Cancel"
; ```
;
; ### Get name of selected button
; ```psc
; string selectedButtonName = SkyMessage.Show("body text of message", buttons)
; ```
;
; ### Get index of selected button
; If you would prefer to get the `int` index of the button:
; ```psc
; string selectedButtonIndex = SkyMessage.Show("body text of message", buttons, getIndex = true)
; ```
;
; ### Advanced
; You can also specify a timeout. This is the number of seconds after which the function will return with the text "TIMED_OUT":
; ```psc
; string selectedButtonName = SkyMessage.Show("body text of message", buttons, timeoutSeconds = 69.0)
; ```
string function ShowArray(string bodyText, string[] buttons, bool getIndex = false, float waitInterval = 0.1, float timeoutSeconds = 0.0) global
    Guard()
endFunction

; This created a messagebox, displays it, and **returns immediately** (_while the message is still being displayed on the screen_)
;
; To discover when the player has selected an option, you are expected to 'poll' using the function `IsMessageResultAvailable`:
;
; ### Example
; ```psc
; int messageBoxId = SkyrMessage.Show_NonBlocking("body text", "button 1", "button 2", ...)
; while ! SkyMessage.IsMessageResultAvailable(messageBoxId)
;   Utility.WaitMenuMode(1.0)
; endWhile
; ```
;
; Once `IsMessageResultAvailable` returns true, you can then find out which option the player selected via `GetResultText()` or `GetResultIndex()`
;
; ### Get name of selected button
; ```psc
; string buttonName = SkyMessage.GetResultText(messageboxId)
; ```
;
; ### Get index of selected button
; ```psc
; string buttonIndex = SkyMessage.GetResultIndex(messageboxId)
; ```
;
; ### Gotcha!
; After calling either `GetResultText()` or `GetResultIndex()`, the `messageBoxId` will become invalid, so you cannot get **BOTH** the index **and** the text. _Unless_ you use `deleteResultOnAccess = false`
; ```psc
; ; Get the index -but- keep the messageBoxId valid!
; string buttonIndex = SkyMessage.GetResultIndex(messageboxId, deleteResultOnAccess = false)
;
; ; So now you can get the name as well
; string buttonName = SkyMessage.GetResultText(messageboxId)
; ```
;
; If you ever have a reason to delete the `messageBoxId` without getting the result, you can call `SkyMessage.Delete(messageBoxId)`
int function Show_NonBlocking(string bodyText, string button1, string button2 = "", string button3 = "", string button4 = "", string button5 = "", string button6 = "", string button7 = "", string button8 = "", string button9 = "", string button10 = "") global native

; This created a messagebox, displays it, and **returns immediately** (_while the message is still being displayed on the screen_)
;
; To discover when the player has selected an option, you are expected to 'poll' using the function `IsMessageResultAvailable`:
;
; _Useful for when you are not hard-coding the names of the buttons!_
;
; #### Button names
; Any string array should work for button names.
; ```psc
; string[] buttons = new string[2]
; buttons[0] = "Ok"
; buttons[1] = "Cancel"
; ```
;
; ### Example
; ```psc
; int messageBoxId = SkyrMessage.Show_NonBlocking("body text", buttons)
; while ! SkyMessage.IsMessageResultAvailable(messageBoxId)
;   Utility.WaitMenuMode(1.0)
; endWhile
; ```
;
; Once `IsMessageResultAvailable` returns true, you can then find out which option the player selected via `GetResultText()` or `GetResultIndex()`
;
; ### Get name of selected button
; ```psc
; string buttonName = SkyMessage.GetResultText(messageboxId)
; ```
;
; ### Get index of selected button
; ```psc
; string buttonIndex = SkyMessage.GetResultIndex(messageboxId)
; ```
;
; ### Gotcha!
; After calling either `GetResultText()` or `GetResultIndex()`, the `messageBoxId` will become invalid, so you cannot get **BOTH** the index **and** the text. _Unless_ you use `deleteResultOnAccess = false`
; ```psc
; ; Get the index -but- keep the messageBoxId valid!
; string buttonIndex = SkyMessage.GetResultIndex(messageboxId, deleteResultOnAccess = false)
;
; ; So now you can get the name as well
; string buttonName = SkyMessage.GetResultText(messageboxId)
; ```
;
; If you ever have a reason to delete the `messageBoxId` without getting the result, you can call `SkyMessage.Delete(messageBoxId)`
int function ShowArray_NonBlocking(string bodyText, string[] buttons) global native

; Returns the result text from a message box created using `Show_NonBlocking()` or `ShowArray_NonBlocking()`
;
; If `IsMessageResultAvailable` is `false` or the messageBoxId is invalid, this returns `""`  
; else it returns the name of the button which was selected.
;
; Note: calling this function cleans up the stored messageBox and it will no longer be available
; unless you pass `deleteResultOnAccess = false`
string function GetResultText(int messageBoxId, bool deleteResultOnAccess = true) global native

; Returns the result index from a message box created using `Show_NonBlocking()` or `ShowArray_NonBlocking()`
;
; If `IsMessageResultAvailable` is `false` or the messageBoxId is invalid, this returns `-1`  
; else it returns the `int` index of the button which was selected.
;
; Note: calling this function cleans up the stored messageBox and it will no longer be available
; unless you pass `deleteResultOnAccess = false`
int function GetResultIndex(int messageBoxId, bool deleteResultOnAccess = true) global native

; Returns true if a messagebox created via `Show_NonBlocking()` or `ShowArray_NonBlocking()` has had a button selected.
; Returns false in all other scenarios.
bool function IsMessageResultAvailable(int messageBoxId) global native


Function Guard()
    Debug.MessageBox("SkyMessage: Dom't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction

