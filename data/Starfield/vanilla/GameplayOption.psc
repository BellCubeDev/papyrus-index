Scriptname GameplayOption extends Form Native Hidden

; Get the numerical reward value for the current setting on this GameplayOption form
float Function GetRewardValue() native

; Get this GameplayOption form's current value. Bools are represented as 0 for false and non-zero for true
float Function GetValue() native

; Get the sum total of all active XP modifiers across every GameplayOption
float Function GetXPTotal() native global

; Notify native code that script is finished updating values related to GameplayOptions and may operate on the new state
Function NotifyGameplayOptionUpdateFinished() native global