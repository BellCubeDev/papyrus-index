Scriptname DbFormTimer hidden
;requires DbSkseFunctions.dll

;FO4 style timers. Can have multiple timers on the same script differentiated by aiTimerID.

;Time while any menu is open and the game is paused is discounted - like Utility.Wait
Function StartTimer(Form eventReceiver, float seconds, int aiTimerID = 0) Global Native 
Function CancelTimer(Form eventReceiver, int aiTimerID = 0) Global Native 
float Function GetTimeElapsedOnTimer(Form eventReceiver, int aiTimerID = 0) Global Native 
float Function GetTimeLeftOnTimer(Form eventReceiver, int aiTimerID = 0) Global Native 

Event OnTimer(int aiTimerID)
EndEvent

;NoMenuMode, time while any menu is open, regardless if the game is paused or not is discounted.
Function StartNoMenuModeTimer(Form eventReceiver, float seconds, int aiTimerID = 0) Global Native 
Function CancelNoMenuModeTimer(Form eventReceiver, int aiTimerID = 0) Global Native 
float Function GetTimeElapsedOnNoMenuModeTimer(Form eventReceiver, int aiTimerID = 0) Global Native 
float Function GetTimeLeftOnNoMenuModeTimer(Form eventReceiver, int aiTimerID = 0) Global Native 

Event OnTimerNoMenuMode(int aiTimerID)
EndEvent

;MenuMode, time while the game is paused does count - like Utility.WaitMenuMode
Function StartMenuModeTimer(Form eventReceiver, float seconds, int aiTimerID = 0) Global Native 
Function CancelMenuModeTimer(Form eventReceiver, int aiTimerID = 0) Global Native 
float Function GetTimeElapsedOnMenuModeTimer(Form eventReceiver, int aiTimerID = 0) Global Native 
float Function GetTimeLeftOnMenuModeTimer(Form eventReceiver, int aiTimerID = 0) Global Native 

Event OnTimerMenuMode(int aiTimerID)
EndEvent

;GameTime, like utility.waitGameTime
Function StartGameTimer(Form eventReceiver, float gameHours, int aiTimerID = 0) Global Native 
Function CancelGameTimer(Form eventReceiver, int aiTimerID = 0) Global Native 
float Function GetTimeElapsedOnGameTimer(Form eventReceiver, int aiTimerID = 0) Global Native 
float Function GetTimeLeftOnGameTimer(Form eventReceiver, int aiTimerID = 0) Global Native 

Event OnTimerGameTime(int aiTimerID)
EndEvent

;/
exmaple script:

Scriptname MyQuestScript extends Quest 

Event OnInit()
	registerforKey(56) ;left alt
	Debug.Notification("MyQuestScript init")
EndEvent

Event OnkeyDown(int keyCode)
	TestTimers()
EndEvent

function TestTimers()
	DbFormTimer.StartTimer(self, 1.1, 0) ;receive OnTimer event on this script with ID '0' in 1.1 seconds, not counting when game is paused.
	DbFormTimer.StartTimer(self, 2.2, 1) ;receive OnTimer event on this script with ID '1' in 2.2 seconds,  not counting when game is paused.
	
	DbFormTimer.StartNoMenuModeTimer(self, 1.1, 0) ;receive OnTimerNoMenuMode event on this script with ID '0' in 1.1 seconds, not counting time when any menu is open.
	DbFormTimer.StartNoMenuModeTimer(self, 2.2, 1) ;receive OnTimerNoMenuMode event on this script with ID '1' in 2.2 seconds, not counting time when any menu is open.
	
	DbFormTimer.StartMenuModeTimer(self, 1.1, 0) ;receive OnTimerMenuMode event on this script with ID '0' in 1.1 seconds.
	DbFormTimer.StartMenuModeTimer(self, 2.2, 1) ;receive OnTimerMenuMode event on this script with ID '1' in 2.2 seconds.
	
	if DbFormTimer.GetTimeLeftOnGameTimer(self, 0) > 0.0 ;GameTimeTimer with ID '0' is active on this script
		DbFormTimer.CancelGameTimer(self, 0) ;cancel GameTimeTimer with ID '0'
		debug.notification("cancelled game timer 1")
		
	else ;gametimer '0' not active on this script
		DbFormTimer.StartGameTimer(self, 1.2, 0) ;receive OnTimerGameTime event on this script with ID '0' in 1.2 game hours.
		debug.notification("started game timer 1")
	Endif
	
	if DbFormTimer.GetTimeLeftOnGameTimer(self, 3) > 0.0 ;GameTimeTimer with ID '3' is active on this script
		DbFormTimer.CancelGameTimer(self, 3) ;cancel GameTimeTimer with ID '3'
		debug.notification("cancelled game timer 3")
		
	else ;gametimer '3' not active on this script
		DbFormTimer.StartGameTimer(self, 3.5, 3) ;receive OnTimerGameTime event on this script with ID '3' in 3.5 game hours.
		debug.notification("started game timer 3")
	Endif
	
EndFunction

Event OnTimer(int aiTimerID)
	Debug.Notification("timer ID [" + aiTimerID + "]")
EndEvent

Event OnTimerNoMenuMode(int aiTimerID)
	Debug.Notification("NoMenuMode timer ID [" + aiTimerID + "]")
EndEvent

Event OnTimerMenuMode(int aiTimerID)
	Debug.Notification("MenuMode timer ID [" + aiTimerID + "]")
EndEvent

Event OnTimerGameTime(int aiTimerID)
	Debug.Notification("GameTimer ID [" + aiTimerID + "]")
EndEvent
/;