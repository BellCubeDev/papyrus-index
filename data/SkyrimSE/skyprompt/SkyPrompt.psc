Scriptname SkyPrompt

; API Version: 2.0

Int Function RegisterForSkyPromptEvent(Form akForm, int a_major, int a_minor) global native
Bool Function UnregisterFromSkyPromptEvent(Form akForm) global native
Bool Function SendPrompt(Int clientID, String text, Int eventID, Int actionID, Int type, Form refForm, Int[] devices, Int[] keys, float progress) global native
Function RemovePrompt(Int clientID, Int eventID, Int actionID) global native
Bool Function RequestTheme(Int clientID, String theme_name) global native

Event OnSkyPromptEvent(Int clientID, Int eventType, Int eventID, Int actionID, float dx, float dy, float progress)
EndEvent