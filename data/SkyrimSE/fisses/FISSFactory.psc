;/ Decompiled by Champollion V1.0.0
Source   : FISSFactory.psc
Modified : 2013-10-25 18:33:55
Compiled : 2013-10-25 18:33:58
User     : GrafConti
Computer : GRAFCONTI-PC
/;
scriptName FISSFactory

;-- Properties --------------------------------------

;-- Variables ---------------------------------------

;-- Functions ---------------------------------------

FISSInterface function getFISS() global
    Guard()
endFunction

; Skipped compiler generated GetState

function onEndState()
{Event received when this state is switched away from}
    Guard()
endFunction

; Skipped compiler generated GotoState

function onBeginState()
{Event received when this state is switched to}
    Guard()
endFunction


Function Guard()
    Debug.MessageBox("FISSFactory: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
