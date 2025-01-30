Scriptname DynamicStringArrays Extends Form
;This is exactly like the DynamicArrays script but only includes string type arrays.
;Create string arrays of varying lengths (up to 128 in size) and manipulate them without skse.

;I split it up so that it would be easy to use this as a template for different types.
;Just copy the contents of this script to a new script and replace all "string" with "NewType"

;How to use:
;Let's say you attach these scripts to a MiscObject called DynamicStringArraysMisc
;Then in another script you can do:
;DynamicStringArrays stringArrays = (DynamicStringArraysMisc as form) as DynamicStringArrays
;String[] MyStringArray = stringArrays.CreateArray(50)

;This script has to be attached to a form because you can't use states with global functions.
;Note you can still only create arrays up to 128 elements

String[] Function CreateArray(int size)
    Guard()
EndFunction

;Array Utility functions. Similar to PapyrusUtil, but doesn't require skse.
;Note that these functions involve creating new arrays and cycling through the passed in arrays to get return arrays.
;As such, use sparingly and don't populate arrays with the Push functions.

;Sort the array from smallest to largest or vice versa.
;Note that if Direct == true (default) this affects the passed in akArray directly.
;So no need to do MyIntArray[] = SortIntArray(MyIntArray)
;Can just do: SortIntArray(MyIntArray)
;If Direct == false, it first copy's the array, sorts the copied array and returns the copied array so the passed in akArray is unaffected.
;If Direct == false, passed in akArray must be less than or equal to 128 elements in length.
String[] Function Sort(String[] akArray, Bool Ascending = true, Bool Direct = true)
    Guard()
EndFunction

;Resize akArray to NewSize and return New Array.
;If NewSize is less than current size, removes elements after NewSize in akArray.
;If NewSize is greater than current size, the Fill element to the end of the akArray.
String[] Function Resize(String[] akArray, int NewSize, String Fill = "")
    Guard()
EndFunction

;Join a_Array with b_Array and return new array.
;The added lengths of the arrays must be less than or equil to 128 elements.
;If greater than, the tail end of b_array is clipped off where it exceeds 128.
String[] Function Join(String[] a_Array, String[] b_Array)
    Guard()
EndFunction

;Add an element to the end of the array and return new array.
;The passed in akArray must be less than 128 elements in length.
String[] Function Push(String[] akArray, String ToPush)
    Guard()
EndFunction

;insert the ToInsert string into the array, increasing the size by one and
;moving each string after index back by one, returning the new array.
String[] Function InsertAt(String[] akArray, String ToInsert, Int Index)
    Guard()
EndFunction

;Insert the ToInsert array to the akArray at Index and return new array.
;Passed in akArray must be less than 128 elements in length.
String[] Function InsertArrayAt(String[] akArray, String[] ToInsert, Int Index)
    Guard()
EndFunction

;Remove either the first or last element from the array and return new shortened array
;Passed in array must be less than or equal to 129 elements in length.
String[] Function Shift(String[] akArray, Bool First = true)
    Guard()
EndFunction

;Remove the element at the Index of the akArray and return new array.
;Passed in array must be less than or equal to 129 elements in length.
String[] Function RemoveAt(String[] akArray, Int Index)
    Guard()
EndFunction

;Find the ToRemove element in the akArray and remove it, returning the shortened array.
;If First == true (default) finds first instance of ToRemove, otherwise finds last instance of ToRemove (rFind)
String[] Function Remove(String[] akArray, String ToRemove, Bool First = true)
    Guard()
EndFunction

;Put the elements between StartIndex and EndIndex of akArray into a new array and return said array.
String[] Function SubArray(String[] akArray, Int StartIndex, Int EndIndex)
    Guard()
EndFunction

;Remove all of the ToClear elements from the akArray and return new array.
;The length of the new array must be 128 or less, otherwise returns the akArray unedited.
String[] Function Clear(String[] akArray, String ToClear)
    Guard()
EndFunction

;Copy all the elements from akArray to NewArray and return NewArray.
;Only copy's up to 128 elements.
;different than doing ArrayA = ArrayB.
;When doing that, altering ArrayB will also alter ArrayA. Not so with these copy functions.
String[] Function Duplicate(String[] akArray)
    Guard()
EndFunction

;count how many of the ToCount elements are in the array.
Int Function Count(String[] akArray, String ToCount)
    Guard()
EndFunction

;For the create array functions.
String[] Function GetArray()
    Guard()
EndFunction

State A2
    String[] Function GetArray()
        String[] newArray = New String[2]
        Return newArray
    EndFunction
EndState

State A3
    String[] Function GetArray()
        String[] newArray = new string[3]
        return newArray
    EndFunction
EndState

State A4
    String[] Function GetArray()
        String[] newArray = new string[4]
        return newArray
    EndFunction
EndState

State A5
    String[] Function GetArray()
        String[] newArray = new string[5]
        return newArray
    EndFunction
EndState

State A6
    String[] Function GetArray()
        String[] newArray = new string[6]
        return newArray
    EndFunction
EndState

State A7
    String[] Function GetArray()
        String[] newArray = new string[7]
        return newArray
    EndFunction
EndState

State A8
    String[] Function GetArray()
        String[] newArray = new string[8]
        return newArray
    EndFunction
EndState

State A9
    String[] Function GetArray()
        String[] newArray = new string[9]
        return newArray
    EndFunction
EndState

State A10
    String[] Function GetArray()
        String[] newArray = new string[10]
        return newArray
    EndFunction
EndState

State A11
    String[] Function GetArray()
        String[] newArray = new string[11]
        return newArray
    EndFunction
EndState

State A12
    String[] Function GetArray()
        String[] newArray = new string[12]
        return newArray
    EndFunction
EndState

State A13
    String[] Function GetArray()
        String[] newArray = new string[13]
        return newArray
    EndFunction
EndState

State A14
    String[] Function GetArray()
        String[] newArray = new string[14]
        return newArray
    EndFunction
EndState

State A15
    String[] Function GetArray()
        String[] newArray = new string[15]
        return newArray
    EndFunction
EndState

State A16
    String[] Function GetArray()
        String[] newArray = new string[16]
        return newArray
    EndFunction
EndState

State A17
    String[] Function GetArray()
        String[] newArray = new string[17]
        return newArray
    EndFunction
EndState

State A18
    String[] Function GetArray()
        String[] newArray = new string[18]
        return newArray
    EndFunction
EndState

State A19
    String[] Function GetArray()
        String[] newArray = new string[19]
        return newArray
    EndFunction
EndState

State A20
    String[] Function GetArray()
        String[] newArray = new string[20]
        return newArray
    EndFunction
EndState

State A21
    String[] Function GetArray()
        String[] newArray = new string[21]
        return newArray
    EndFunction
EndState

State A22
    String[] Function GetArray()
        String[] newArray = new string[22]
        return newArray
    EndFunction
EndState

State A23
    String[] Function GetArray()
        String[] newArray = new string[23]
        return newArray
    EndFunction
EndState

State A24
    String[] Function GetArray()
        String[] newArray = new string[24]
        return newArray
    EndFunction
EndState

State A25
    String[] Function GetArray()
        String[] newArray = new string[25]
        return newArray
    EndFunction
EndState

State A26
    String[] Function GetArray()
        String[] newArray = new string[26]
        return newArray
    EndFunction
EndState

State A27
    String[] Function GetArray()
        String[] newArray = new string[27]
        return newArray
    EndFunction
EndState

State A28
    String[] Function GetArray()
        String[] newArray = new string[28]
        return newArray
    EndFunction
EndState

State A29
    String[] Function GetArray()
        String[] newArray = new string[29]
        return newArray
    EndFunction
EndState

State A30
    String[] Function GetArray()
        String[] newArray = new string[30]
        return newArray
    EndFunction
EndState

State A31
    String[] Function GetArray()
        String[] newArray = new string[31]
        return newArray
    EndFunction
EndState

State A32
    String[] Function GetArray()
        String[] newArray = new string[32]
        return newArray
    EndFunction
EndState

State A33
    String[] Function GetArray()
        String[] newArray = new string[33]
        return newArray
    EndFunction
EndState

State A34
    String[] Function GetArray()
        String[] newArray = new string[34]
        return newArray
    EndFunction
EndState

State A35
    String[] Function GetArray()
        String[] newArray = new string[35]
        return newArray
    EndFunction
EndState

State A36
    String[] Function GetArray()
        String[] newArray = new string[36]
        return newArray
    EndFunction
EndState

State A37
    String[] Function GetArray()
        String[] newArray = new string[37]
        return newArray
    EndFunction
EndState

State A38
    String[] Function GetArray()
        String[] newArray = new string[38]
        return newArray
    EndFunction
EndState

State A39
    String[] Function GetArray()
        String[] newArray = new string[39]
        return newArray
    EndFunction
EndState

State A40
    String[] Function GetArray()
        String[] newArray = new string[40]
        return newArray
    EndFunction
EndState

State A41
    String[] Function GetArray()
        String[] newArray = new string[41]
        return newArray
    EndFunction
EndState

State A42
    String[] Function GetArray()
        String[] newArray = new string[42]
        return newArray
    EndFunction
EndState

State A43
    String[] Function GetArray()
        String[] newArray = new string[43]
        return newArray
    EndFunction
EndState

State A44
    String[] Function GetArray()
        String[] newArray = new string[44]
        return newArray
    EndFunction
EndState

State A45
    String[] Function GetArray()
        String[] newArray = new string[45]
        return newArray
    EndFunction
EndState

State A46
    String[] Function GetArray()
        String[] newArray = new string[46]
        return newArray
    EndFunction
EndState

State A47
    String[] Function GetArray()
        String[] newArray = new string[47]
        return newArray
    EndFunction
EndState

State A48
    String[] Function GetArray()
        String[] newArray = new string[48]
        return newArray
    EndFunction
EndState

State A49
    String[] Function GetArray()
        String[] newArray = new string[49]
        return newArray
    EndFunction
EndState

State A50
    String[] Function GetArray()
        String[] newArray = new string[50]
        return newArray
    EndFunction
EndState

State A51
    String[] Function GetArray()
        String[] newArray = new string[51]
        return newArray
    EndFunction
EndState

State A52
    String[] Function GetArray()
        String[] newArray = new string[52]
        return newArray
    EndFunction
EndState

State A53
    String[] Function GetArray()
        String[] newArray = new string[53]
        return newArray
    EndFunction
EndState

State A54
    String[] Function GetArray()
        String[] newArray = new string[54]
        return newArray
    EndFunction
EndState

State A55
    String[] Function GetArray()
        String[] newArray = new string[55]
        return newArray
    EndFunction
EndState

State A56
    String[] Function GetArray()
        String[] newArray = new string[56]
        return newArray
    EndFunction
EndState

State A57
    String[] Function GetArray()
        String[] newArray = new string[57]
        return newArray
    EndFunction
EndState

State A58
    String[] Function GetArray()
        String[] newArray = new string[58]
        return newArray
    EndFunction
EndState

State A59
    String[] Function GetArray()
        String[] newArray = new string[59]
        return newArray
    EndFunction
EndState

State A60
    String[] Function GetArray()
        String[] newArray = new string[60]
        return newArray
    EndFunction
EndState

State A61
    String[] Function GetArray()
        String[] newArray = new string[61]
        return newArray
    EndFunction
EndState

State A62
    String[] Function GetArray()
        String[] newArray = new string[62]
        return newArray
    EndFunction
EndState

State A63
    String[] Function GetArray()
        String[] newArray = new string[63]
        return newArray
    EndFunction
EndState

State A64
    String[] Function GetArray()
        String[] newArray = new string[64]
        return newArray
    EndFunction
EndState

State A65
    String[] Function GetArray()
        String[] newArray = new string[65]
        return newArray
    EndFunction
EndState

State A66
    String[] Function GetArray()
        String[] newArray = new string[66]
        return newArray
    EndFunction
EndState

State A67
    String[] Function GetArray()
        String[] newArray = new string[67]
        return newArray
    EndFunction
EndState

State A68
    String[] Function GetArray()
        String[] newArray = new string[68]
        return newArray
    EndFunction
EndState

State A69
    String[] Function GetArray()
        String[] newArray = new string[69]
        return newArray
    EndFunction
EndState

State A70
    String[] Function GetArray()
        String[] newArray = new string[70]
        return newArray
    EndFunction
EndState

State A71
    String[] Function GetArray()
        String[] newArray = new string[71]
        return newArray
    EndFunction
EndState

State A72
    String[] Function GetArray()
        String[] newArray = new string[72]
        return newArray
    EndFunction
EndState

State A73
    String[] Function GetArray()
        String[] newArray = new string[73]
        return newArray
    EndFunction
EndState

State A74
    String[] Function GetArray()
        String[] newArray = new string[74]
        return newArray
    EndFunction
EndState

State A75
    String[] Function GetArray()
        String[] newArray = new string[75]
        return newArray
    EndFunction
EndState

State A76
    String[] Function GetArray()
        String[] newArray = new string[76]
        return newArray
    EndFunction
EndState

State A77
    String[] Function GetArray()
        String[] newArray = new string[77]
        return newArray
    EndFunction
EndState

State A78
    String[] Function GetArray()
        String[] newArray = new string[78]
        return newArray
    EndFunction
EndState

State A79
    String[] Function GetArray()
        String[] newArray = new string[79]
        return newArray
    EndFunction
EndState

State A80
    String[] Function GetArray()
        String[] newArray = new string[80]
        return newArray
    EndFunction
EndState

State A81
    String[] Function GetArray()
        String[] newArray = new string[81]
        return newArray
    EndFunction
EndState

State A82
    String[] Function GetArray()
        String[] newArray = new string[82]
        return newArray
    EndFunction
EndState

State A83
    String[] Function GetArray()
        String[] newArray = new string[83]
        return newArray
    EndFunction
EndState

State A84
    String[] Function GetArray()
        String[] newArray = new string[84]
        return newArray
    EndFunction
EndState

State A85
    String[] Function GetArray()
        String[] newArray = new string[85]
        return newArray
    EndFunction
EndState

State A86
    String[] Function GetArray()
        String[] newArray = new string[86]
        return newArray
    EndFunction
EndState

State A87
    String[] Function GetArray()
        String[] newArray = new string[87]
        return newArray
    EndFunction
EndState

State A88
    String[] Function GetArray()
        String[] newArray = new string[88]
        return newArray
    EndFunction
EndState

State A89
    String[] Function GetArray()
        String[] newArray = new string[89]
        return newArray
    EndFunction
EndState

State A90
    String[] Function GetArray()
        String[] newArray = new string[90]
        return newArray
    EndFunction
EndState

State A91
    String[] Function GetArray()
        String[] newArray = new string[91]
        return newArray
    EndFunction
EndState

State A92
    String[] Function GetArray()
        String[] newArray = new string[92]
        return newArray
    EndFunction
EndState

State A93
    String[] Function GetArray()
        String[] newArray = new string[93]
        return newArray
    EndFunction
EndState

State A94
    String[] Function GetArray()
        String[] newArray = new string[94]
        return newArray
    EndFunction
EndState

State A95
    String[] Function GetArray()
        String[] newArray = new string[95]
        return newArray
    EndFunction
EndState

State A96
    String[] Function GetArray()
        String[] newArray = new string[96]
        return newArray
    EndFunction
EndState

State A97
    String[] Function GetArray()
        String[] newArray = new string[97]
        return newArray
    EndFunction
EndState

State A98
    String[] Function GetArray()
        String[] newArray = new string[98]
        return newArray
    EndFunction
EndState

State A99
    String[] Function GetArray()
        String[] newArray = new string[99]
        return newArray
    EndFunction
EndState

State A100
    String[] Function GetArray()
        String[] newArray = new string[100]
        return newArray
    EndFunction
EndState

State A101
    String[] Function GetArray()
        String[] newArray = new string[101]
        return newArray
    EndFunction
EndState

State A102
    String[] Function GetArray()
        String[] newArray = new string[102]
        return newArray
    EndFunction
EndState

State A103
    String[] Function GetArray()
        String[] newArray = new string[103]
        return newArray
    EndFunction
EndState

State A104
    String[] Function GetArray()
        String[] newArray = new string[104]
        return newArray
    EndFunction
EndState

State A105
    String[] Function GetArray()
        String[] newArray = new string[105]
        return newArray
    EndFunction
EndState

State A106
    String[] Function GetArray()
        String[] newArray = new string[106]
        return newArray
    EndFunction
EndState

State A107
    String[] Function GetArray()
        String[] newArray = new string[107]
        return newArray
    EndFunction
EndState

State A108
    String[] Function GetArray()
        String[] newArray = new string[108]
        return newArray
    EndFunction
EndState

State A109
    String[] Function GetArray()
        String[] newArray = new string[109]
        return newArray
    EndFunction
EndState

State A110
    String[] Function GetArray()
        String[] newArray = new string[110]
        return newArray
    EndFunction
EndState

State A111
    String[] Function GetArray()
        String[] newArray = new string[111]
        return newArray
    EndFunction
EndState

State A112
    String[] Function GetArray()
        String[] newArray = new string[112]
        return newArray
    EndFunction
EndState

State A113
    String[] Function GetArray()
        String[] newArray = new string[113]
        return newArray
    EndFunction
EndState

State A114
    String[] Function GetArray()
        String[] newArray = new string[114]
        return newArray
    EndFunction
EndState

State A115
    String[] Function GetArray()
        String[] newArray = new string[115]
        return newArray
    EndFunction
EndState

State A116
    String[] Function GetArray()
        String[] newArray = new string[116]
        return newArray
    EndFunction
EndState

State A117
    String[] Function GetArray()
        String[] newArray = new string[117]
        return newArray
    EndFunction
EndState

State A118
    String[] Function GetArray()
        String[] newArray = new string[118]
        return newArray
    EndFunction
EndState

State A119
    String[] Function GetArray()
        String[] newArray = new string[119]
        return newArray
    EndFunction
EndState

State A120
    String[] Function GetArray()
        String[] newArray = new string[120]
        return newArray
    EndFunction
EndState

State A121
    String[] Function GetArray()
        String[] newArray = new string[121]
        return newArray
    EndFunction
EndState

State A122
    String[] Function GetArray()
        String[] newArray = new string[122]
        return newArray
    EndFunction
EndState

State A123
    String[] Function GetArray()
        String[] newArray = new string[123]
        return newArray
    EndFunction
EndState

State A124
    String[] Function GetArray()
        String[] newArray = new string[124]
        return newArray
    EndFunction
EndState

State A125
    String[] Function GetArray()
        String[] newArray = new string[125]
        return newArray
    EndFunction
EndState

State A126
    String[] Function GetArray()
        String[] newArray = new string[126]
        return newArray
    EndFunction
EndState

State A127
    String[] Function GetArray()
        String[] newArray = new string[127]
        return newArray
    EndFunction
EndState

State A128
    String[] Function GetArray()
        String[] newArray = new string[128]
        return newArray
    EndFunction
EndState

;used to write the array states in this script
; Function WriteArrayStates(int min, int max, String filePath) Global
;     int i = min
;     while i < max
;         MiscUtil.WriteToFile(filePath, "\n")
;         MiscUtil.WriteToFile(filePath, "\nState A" + i)
;         MiscUtil.WriteToFile(filePath, "\n    String[] Function GetArray()")
;         MiscUtil.WriteToFile(filePath, "\n        String[] newArray = New String[" + i + "]")
;         MiscUtil.WriteToFile(filePath, "\n        Return newArray")
;         MiscUtil.WriteToFile(filePath, "\n    EndFunction")
;         MiscUtil.WriteToFile(filePath, "\nEndState")
;         i += 1
;     Endwhile
; Endfunction


Function Guard()
    Debug.MessageBox("DynamicStringArrays: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
