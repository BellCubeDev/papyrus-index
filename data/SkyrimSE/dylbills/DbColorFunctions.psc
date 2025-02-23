Scriptname DbColorFunctions Hidden 

;get random rgb color in int array.
Int[] Function GetRandomRGB() Global
    Guard()
EndFunction 

;get a random hsl color in int array.
Int[] Function GetRandomHSL() Global
    Guard()
EndFunction

int[] function colorHexToRGB(string colorHex) Global
    Guard()
EndFunction

String function RGBToColorHex(int[] rgb) Global
    Guard()
EndFunction

;Convert R G B to single int (base 10 instead of base 16 for hex)
Int Function RGBToInt(Int R, Int G, Int B) Global
    Guard()
EndFunction   

;Opposite of RGBToInt. Convert RGBInt (base 10) to seperate R G B values and return float array. [0] = R, [1] = G, [2] = B
Int[] Function IntToRGB(Int RGBInt) Global
    Guard()
EndFunction

Int[] Function ColorIntToHSL(Int iColor) Global
    Guard()
EndFunction

;rgb / hsl conversion functions I wrote from following this guide: 
;https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
;convert RGB to HSL format and return in int array. [0] = H [1] = S [2] = L 
;S and L are ints between 0 and 100 (percent)
int[] Function RGBToHSL(int R, int G, int B) Global 
    Guard()
EndFunction 

;convert HSL to RGB format and return in int array. [0] = R [1] = G [2] = B 
;S and L input should be between 0 and 100 (percent)
Int[] Function HSLToRGB(int H, int S, int L) Global
    Guard()
EndFunction


float Function RGBMin(float r, float g, float b) Global
    Guard()
Endfunction


float Function RGBMax(float r, float g, float b) Global
    Guard()
EndFunction  

Float Function RGBChannel(Float t1, Float t2, Float c) Global 
    Guard()
EndFunction

Float Function RGB_ClampBetween0and1(float f) Global
    Guard()
EndFunction 

;for use in text replacement, such as in books, or MCM text. 
;Adds color font to string
String Function AddColorFont(String s, Int iColor) Global
    Guard()
EndFunction




Function Guard()
    Debug.MessageBox("DbColorFunctions: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
