ScriptName SPE_Interface Hidden

; Print the given String into the consosle
Function PrintConsole(String asText) native global

; Return the name of the custom menu
String Function GetMenuName() native global
; Open/close a custom menu under the given filepath
; The difference between this menu and the one provided by SKSE is that this one will *not* pause the game while open
bool Function OpenCustomMenu(String asFilePath) native global
Function CloseCustomMenu() native global

; Return the string representation of the given key code
String Function GetButtonForDXScanCode(int aiKeyCode) native global
