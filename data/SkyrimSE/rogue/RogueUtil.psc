scriptname RogueUtil


;Returns a 4 length array of integers representing the current version.
int[] function GetVersion() native global

int function GetVersionInt() global
    Guard()
endFunction

Function Guard()
    Debug.MessageBox("RogueUtil: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
