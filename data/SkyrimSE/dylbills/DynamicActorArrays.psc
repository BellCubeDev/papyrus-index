Scriptname DynamicActorArrays Extends Form
;This is exactly like the DynamicArrays script but only includes Actor type arrays. 
;Create Actor arrays of varying lengths (up to 128 in size) and manipulate them without skse.

;I split it up so that it would be easy to use this as a template for different types.
;Just copy the contents of this script to a new script and replace all "Actor" with "NewType"

;How to use:
;Let's say you attach these scripts to a MiscObject called DynamicActorArraysMisc
;Then in another script you can do: 
;DynamicActorArrays ActorArrays = (DynamicActorArraysMisc as form) as DynamicActorArrays
;Actor[] MyActorArray = ActorArrays.CreateArray(50)

;This script has to be attached to a form because you can't use states with global functions.
;Note you can still only create arrays up to 128 elements

Actor[] Function CreateArray(int size)
    Guard()
EndFunction

;Array Utility functions. Similar to PapyrusUtil, but doesn't require skse. 
;Note that these functions involve creating new arrays and cycling through the passed in arrays to get return arrays. 
;As such, use sparingly and don't populate arrays with the Push functions. 

;Resize akArray to NewSize and return New Array. 
;If NewSize is less than current size, removes elements after NewSize in akArray. 
;If NewSize is greater than current size, the Fill element to the end of the akArray. 
Actor[] Function Resize(Actor[] akArray, int NewSize, Actor Fill = none)
    Guard()
EndFunction

;Join a_Array with b_Array and return new array. 
;The added lengths of the arrays must be less than or equil to 128 elements.
;If greater than, the tail end of b_array is clipped off where it exceeds 128.
Actor[] Function Join(Actor[] a_Array, Actor[] b_Array)
    Guard()
EndFunction

;Add an element to the end of the array and return new array. 
;The passed in akArray must be less than 128 elements in length.
Actor[] Function Push(Actor[] akArray, Actor ToPush)
    Guard()
EndFunction

;insert the ToInsert Actor into the array, increasing the size by one and 
;moving each Actor after index back by one, returning the new array.
Actor[] Function InsertAt(Actor[] akArray, Actor ToInsert, Int Index)
    Guard()
EndFunction

;Insert the ToInsert array to the akArray at Index and return new array. 
;Passed in akArray must be less than 128 elements in length.
Actor[] Function InsertArrayAt(Actor[] akArray, Actor[] ToInsert, Int Index)
    Guard()
EndFunction

;Remove either the first or last element from the array and return new shortened array
;Passed in array must be less than or equal to 129 elements in length.
Actor[] Function Shift(Actor[] akArray, Bool First = true)
    Guard()
EndFunction

;Remove the element at the Index of the akArray and return new array. 
;Passed in array must be less than or equal to 129 elements in length.
Actor[] Function RemoveAt(Actor[] akArray, Int Index)
    Guard()
EndFunction

;Find the ToRemove element in the akArray and remove it, returning the shortened array. 
;If First == true (default) finds first instance of ToRemove, otherwise finds last instance of ToRemove (rFind) 
Actor[] Function Remove(Actor[] akArray, Actor ToRemove, Bool First = true)
    Guard()
EndFunction

;Put the elements between StartIndex and EndIndex of akArray into a new array and return said array.
Actor[] Function SubArray(Actor[] akArray, Int StartIndex, Int EndIndex)
    Guard()
EndFunction

;Remove all of the ToClear elements from the akArray and return new array. 
;The length of the new array must be 128 or less, otherwise returns the akArray unedited.
Actor[] Function Clear(Actor[] akArray, Actor ToClear)
    Guard()
EndFunction

;Copy all the elements from akArray to NewArray and return NewArray. 
;Only copy's up to 128 elements. 
;different than doing ArrayA = ArrayB. 
;When doing that, altering ArrayB will also alter ArrayA. Not so with these copy functions.
Actor[] Function Duplicate(Actor[] akArray)
    Guard()
EndFunction

;count how many of the ToCount elements are in the array.
Int Function Count(Actor[] akArray, Actor ToCount)
    Guard()
EndFunction

;For the create array functions.
Actor[] Function GetArray() 
    Guard()
EndFunction

State A2
    Actor[] Function GetArray()
        Actor[] newArray = New Actor[2]
        Return newArray
    EndFunction
EndState

State A3
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[3]
        return newArray
    EndFunction
EndState

State A4
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[4]
        return newArray
    EndFunction
EndState

State A5
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[5]
        return newArray
    EndFunction
EndState

State A6
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[6]
        return newArray
    EndFunction
EndState

State A7
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[7]
        return newArray
    EndFunction
EndState

State A8
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[8]
        return newArray
    EndFunction
EndState

State A9
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[9]
        return newArray
    EndFunction
EndState

State A10
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[10]
        return newArray
    EndFunction
EndState

State A11
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[11]
        return newArray
    EndFunction
EndState

State A12
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[12]
        return newArray
    EndFunction
EndState

State A13
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[13]
        return newArray
    EndFunction
EndState

State A14
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[14]
        return newArray
    EndFunction
EndState

State A15
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[15]
        return newArray
    EndFunction
EndState

State A16
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[16]
        return newArray
    EndFunction
EndState

State A17
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[17]
        return newArray
    EndFunction
EndState

State A18
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[18]
        return newArray
    EndFunction
EndState

State A19
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[19]
        return newArray
    EndFunction
EndState

State A20
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[20]
        return newArray
    EndFunction
EndState

State A21
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[21]
        return newArray
    EndFunction
EndState

State A22
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[22]
        return newArray
    EndFunction
EndState

State A23
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[23]
        return newArray
    EndFunction
EndState

State A24
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[24]
        return newArray
    EndFunction
EndState

State A25
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[25]
        return newArray
    EndFunction
EndState

State A26
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[26]
        return newArray
    EndFunction
EndState

State A27
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[27]
        return newArray
    EndFunction
EndState

State A28
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[28]
        return newArray
    EndFunction
EndState

State A29
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[29]
        return newArray
    EndFunction
EndState

State A30
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[30]
        return newArray
    EndFunction
EndState

State A31
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[31]
        return newArray
    EndFunction
EndState

State A32
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[32]
        return newArray
    EndFunction
EndState

State A33
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[33]
        return newArray
    EndFunction
EndState

State A34
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[34]
        return newArray
    EndFunction
EndState

State A35
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[35]
        return newArray
    EndFunction
EndState

State A36
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[36]
        return newArray
    EndFunction
EndState

State A37
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[37]
        return newArray
    EndFunction
EndState

State A38
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[38]
        return newArray
    EndFunction
EndState

State A39
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[39]
        return newArray
    EndFunction
EndState

State A40
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[40]
        return newArray
    EndFunction
EndState

State A41
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[41]
        return newArray
    EndFunction
EndState

State A42
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[42]
        return newArray
    EndFunction
EndState

State A43
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[43]
        return newArray
    EndFunction
EndState

State A44
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[44]
        return newArray
    EndFunction
EndState

State A45
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[45]
        return newArray
    EndFunction
EndState

State A46
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[46]
        return newArray
    EndFunction
EndState

State A47
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[47]
        return newArray
    EndFunction
EndState

State A48
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[48]
        return newArray
    EndFunction
EndState

State A49
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[49]
        return newArray
    EndFunction
EndState

State A50
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[50]
        return newArray
    EndFunction
EndState

State A51
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[51]
        return newArray
    EndFunction
EndState

State A52
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[52]
        return newArray
    EndFunction
EndState

State A53
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[53]
        return newArray
    EndFunction
EndState

State A54
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[54]
        return newArray
    EndFunction
EndState

State A55
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[55]
        return newArray
    EndFunction
EndState

State A56
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[56]
        return newArray
    EndFunction
EndState

State A57
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[57]
        return newArray
    EndFunction
EndState

State A58
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[58]
        return newArray
    EndFunction
EndState

State A59
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[59]
        return newArray
    EndFunction
EndState

State A60
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[60]
        return newArray
    EndFunction
EndState

State A61
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[61]
        return newArray
    EndFunction
EndState

State A62
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[62]
        return newArray
    EndFunction
EndState

State A63
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[63]
        return newArray
    EndFunction
EndState

State A64
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[64]
        return newArray
    EndFunction
EndState

State A65
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[65]
        return newArray
    EndFunction
EndState

State A66
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[66]
        return newArray
    EndFunction
EndState

State A67
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[67]
        return newArray
    EndFunction
EndState

State A68
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[68]
        return newArray
    EndFunction
EndState

State A69
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[69]
        return newArray
    EndFunction
EndState

State A70
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[70]
        return newArray
    EndFunction
EndState

State A71
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[71]
        return newArray
    EndFunction
EndState

State A72
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[72]
        return newArray
    EndFunction
EndState

State A73
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[73]
        return newArray
    EndFunction
EndState

State A74
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[74]
        return newArray
    EndFunction
EndState

State A75
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[75]
        return newArray
    EndFunction
EndState

State A76
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[76]
        return newArray
    EndFunction
EndState

State A77
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[77]
        return newArray
    EndFunction
EndState

State A78
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[78]
        return newArray
    EndFunction
EndState

State A79
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[79]
        return newArray
    EndFunction
EndState

State A80
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[80]
        return newArray
    EndFunction
EndState

State A81
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[81]
        return newArray
    EndFunction
EndState

State A82
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[82]
        return newArray
    EndFunction
EndState

State A83
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[83]
        return newArray
    EndFunction
EndState

State A84
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[84]
        return newArray
    EndFunction
EndState

State A85
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[85]
        return newArray
    EndFunction
EndState

State A86
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[86]
        return newArray
    EndFunction
EndState

State A87
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[87]
        return newArray
    EndFunction
EndState

State A88
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[88]
        return newArray
    EndFunction
EndState

State A89
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[89]
        return newArray
    EndFunction
EndState

State A90
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[90]
        return newArray
    EndFunction
EndState

State A91
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[91]
        return newArray
    EndFunction
EndState

State A92
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[92]
        return newArray
    EndFunction
EndState

State A93
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[93]
        return newArray
    EndFunction
EndState

State A94
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[94]
        return newArray
    EndFunction
EndState

State A95
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[95]
        return newArray
    EndFunction
EndState

State A96
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[96]
        return newArray
    EndFunction
EndState

State A97
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[97]
        return newArray
    EndFunction
EndState

State A98
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[98]
        return newArray
    EndFunction
EndState

State A99
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[99]
        return newArray
    EndFunction
EndState

State A100
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[100]
        return newArray
    EndFunction
EndState

State A101
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[101]
        return newArray
    EndFunction
EndState

State A102
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[102]
        return newArray
    EndFunction
EndState

State A103
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[103]
        return newArray
    EndFunction
EndState

State A104
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[104]
        return newArray
    EndFunction
EndState

State A105
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[105]
        return newArray
    EndFunction
EndState

State A106
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[106]
        return newArray
    EndFunction
EndState

State A107
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[107]
        return newArray
    EndFunction
EndState

State A108
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[108]
        return newArray
    EndFunction
EndState

State A109
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[109]
        return newArray
    EndFunction
EndState

State A110
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[110]
        return newArray
    EndFunction
EndState

State A111
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[111]
        return newArray
    EndFunction
EndState

State A112
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[112]
        return newArray
    EndFunction
EndState

State A113
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[113]
        return newArray
    EndFunction
EndState

State A114
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[114]
        return newArray
    EndFunction
EndState

State A115
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[115]
        return newArray
    EndFunction
EndState

State A116
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[116]
        return newArray
    EndFunction
EndState

State A117
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[117]
        return newArray
    EndFunction
EndState

State A118
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[118]
        return newArray
    EndFunction
EndState

State A119
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[119]
        return newArray
    EndFunction
EndState

State A120
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[120]
        return newArray
    EndFunction
EndState

State A121
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[121]
        return newArray
    EndFunction
EndState

State A122
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[122]
        return newArray
    EndFunction
EndState

State A123
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[123]
        return newArray
    EndFunction
EndState

State A124
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[124]
        return newArray
    EndFunction
EndState

State A125
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[125]
        return newArray
    EndFunction
EndState

State A126
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[126]
        return newArray
    EndFunction
EndState

State A127
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[127]
        return newArray
    EndFunction
EndState

State A128
    Actor[] Function GetArray()
        Actor[] newArray = new Actor[128]
        return newArray
    EndFunction
EndState

Function Guard()
    Debug.MessageBox("DynamicActorArrays: Dom't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction

