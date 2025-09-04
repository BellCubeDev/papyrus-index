Scriptname CustomSkills Hidden

; Get the current Custom Skills API version.
; Current version: 3
int Function GetAPIVersion() global native

; Open the custom skill menu for the given skill or group (config file).
Function OpenCustomSkillMenu(string asSkillId) global native

; Displays the training menu for the given skill, maximum level, and trainer actor.
Function ShowTrainingMenu(string asSkillId, int aiMaxLevel, Actor akTrainer) global native

; Advance the given skill by the provided amount of skill usage.
Function AdvanceSkill(string asSkillId, float afMagnitude) global native

; Increment the given skill by one point.
Function IncrementSkill(string asSkillId) global native

; Increment the given skill by the given number of points.
Function IncrementSkillBy(string asSkillId, int aiCount) global native

; Get the display name of the given skill.
string Function GetSkillName(string asSkillId) global native

; Get the current level of the given skill.
int Function GetSkillLevel(string asSkillId) global native

; Displays the skill increase message on the HUD for the given skill and level.
Function ShowSkillIncreaseMessage(string asSkillId, int aiSkillLevel) global native

; Reload configurations. For debug usage only.
Function DebugReload() global native
