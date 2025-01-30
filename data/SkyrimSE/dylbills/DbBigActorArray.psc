scriptname DbBigActorArray extends ObjectReference 
{Actor array with max size of 16384 (128 * 128). 
Can be used as a big array or multidimensional array without skse.
Attach this script and the DynamicActorArrays script to a new form in the creation kit. I recommend a misc object. 
To create big arrays of different types, duplicate this script and replace all "Actor" with "newType".
Also do the same thing with the DynamicActorArrays script. 
Example, you would have DbBigObjectReferenceArray.psc and DynmaicObjectReferenceArrays.psc scripts attached to the same form}

Actor[] property Array0 Auto Hidden
Actor[] property Array1 Auto Hidden
Actor[] property Array2 Auto Hidden
Actor[] property Array3 Auto Hidden
Actor[] property Array4 Auto Hidden
Actor[] property Array5 Auto Hidden
Actor[] property Array6 Auto Hidden
Actor[] property Array7 Auto Hidden
Actor[] property Array8 Auto Hidden
Actor[] property Array9 Auto Hidden
Actor[] property Array10 Auto Hidden
Actor[] property Array11 Auto Hidden
Actor[] property Array12 Auto Hidden
Actor[] property Array13 Auto Hidden
Actor[] property Array14 Auto Hidden
Actor[] property Array15 Auto Hidden
Actor[] property Array16 Auto Hidden
Actor[] property Array17 Auto Hidden
Actor[] property Array18 Auto Hidden
Actor[] property Array19 Auto Hidden
Actor[] property Array20 Auto Hidden
Actor[] property Array21 Auto Hidden
Actor[] property Array22 Auto Hidden
Actor[] property Array23 Auto Hidden
Actor[] property Array24 Auto Hidden
Actor[] property Array25 Auto Hidden
Actor[] property Array26 Auto Hidden
Actor[] property Array27 Auto Hidden
Actor[] property Array28 Auto Hidden
Actor[] property Array29 Auto Hidden
Actor[] property Array30 Auto Hidden
Actor[] property Array31 Auto Hidden
Actor[] property Array32 Auto Hidden
Actor[] property Array33 Auto Hidden
Actor[] property Array34 Auto Hidden
Actor[] property Array35 Auto Hidden
Actor[] property Array36 Auto Hidden
Actor[] property Array37 Auto Hidden
Actor[] property Array38 Auto Hidden
Actor[] property Array39 Auto Hidden
Actor[] property Array40 Auto Hidden
Actor[] property Array41 Auto Hidden
Actor[] property Array42 Auto Hidden
Actor[] property Array43 Auto Hidden
Actor[] property Array44 Auto Hidden
Actor[] property Array45 Auto Hidden
Actor[] property Array46 Auto Hidden
Actor[] property Array47 Auto Hidden
Actor[] property Array48 Auto Hidden
Actor[] property Array49 Auto Hidden
Actor[] property Array50 Auto Hidden
Actor[] property Array51 Auto Hidden
Actor[] property Array52 Auto Hidden
Actor[] property Array53 Auto Hidden
Actor[] property Array54 Auto Hidden
Actor[] property Array55 Auto Hidden
Actor[] property Array56 Auto Hidden
Actor[] property Array57 Auto Hidden
Actor[] property Array58 Auto Hidden
Actor[] property Array59 Auto Hidden
Actor[] property Array60 Auto Hidden
Actor[] property Array61 Auto Hidden
Actor[] property Array62 Auto Hidden
Actor[] property Array63 Auto Hidden
Actor[] property Array64 Auto Hidden
Actor[] property Array65 Auto Hidden
Actor[] property Array66 Auto Hidden
Actor[] property Array67 Auto Hidden
Actor[] property Array68 Auto Hidden
Actor[] property Array69 Auto Hidden
Actor[] property Array70 Auto Hidden
Actor[] property Array71 Auto Hidden
Actor[] property Array72 Auto Hidden
Actor[] property Array73 Auto Hidden
Actor[] property Array74 Auto Hidden
Actor[] property Array75 Auto Hidden
Actor[] property Array76 Auto Hidden
Actor[] property Array77 Auto Hidden
Actor[] property Array78 Auto Hidden
Actor[] property Array79 Auto Hidden
Actor[] property Array80 Auto Hidden
Actor[] property Array81 Auto Hidden
Actor[] property Array82 Auto Hidden
Actor[] property Array83 Auto Hidden
Actor[] property Array84 Auto Hidden
Actor[] property Array85 Auto Hidden
Actor[] property Array86 Auto Hidden
Actor[] property Array87 Auto Hidden
Actor[] property Array88 Auto Hidden
Actor[] property Array89 Auto Hidden
Actor[] property Array90 Auto Hidden
Actor[] property Array91 Auto Hidden
Actor[] property Array92 Auto Hidden
Actor[] property Array93 Auto Hidden
Actor[] property Array94 Auto Hidden
Actor[] property Array95 Auto Hidden
Actor[] property Array96 Auto Hidden
Actor[] property Array97 Auto Hidden
Actor[] property Array98 Auto Hidden
Actor[] property Array99 Auto Hidden
Actor[] property Array100 Auto Hidden
Actor[] property Array101 Auto Hidden
Actor[] property Array102 Auto Hidden
Actor[] property Array103 Auto Hidden
Actor[] property Array104 Auto Hidden
Actor[] property Array105 Auto Hidden
Actor[] property Array106 Auto Hidden
Actor[] property Array107 Auto Hidden
Actor[] property Array108 Auto Hidden
Actor[] property Array109 Auto Hidden
Actor[] property Array110 Auto Hidden
Actor[] property Array111 Auto Hidden
Actor[] property Array112 Auto Hidden
Actor[] property Array113 Auto Hidden
Actor[] property Array114 Auto Hidden
Actor[] property Array115 Auto Hidden
Actor[] property Array116 Auto Hidden
Actor[] property Array117 Auto Hidden
Actor[] property Array118 Auto Hidden
Actor[] property Array119 Auto Hidden
Actor[] property Array120 Auto Hidden
Actor[] property Array121 Auto Hidden
Actor[] property Array122 Auto Hidden
Actor[] property Array123 Auto Hidden
Actor[] property Array124 Auto Hidden
Actor[] property Array125 Auto Hidden
Actor[] property Array126 Auto Hidden
Actor[] property Array127 Auto Hidden

int Property size = 0 Auto Hidden
int Property NumberOfArrays = 128 Auto Hidden

int Property MaxSize = 16384 AutoReadOnly Hidden
int Property MaxNumberOfArrays = 128 AutoReadOnly Hidden

;for GetNext, SetNext, GetPrevious, SetPrevious functions
Actor[] CurrentSubArray
Int CurrentIndex = -1
Int CurrentSubArrayIndex = -1
Int CurrentArrayIndex = -1

;for faster pushBack
Actor[] CurrentSizeSubArray
int CurrentSizeSubArrayIndex = -1
Int CurrentSizeArrayIndex = -1

bool busy = false 
bool property iterating = false auto

DynamicActorArrays property ActorArrays auto 

Event OnInit()
    Guard()
EndEvent

bool function isBusy()
    Guard()
EndFunction

function waitWhileBusy(float waitInterval = 0.1)
    Guard()
EndFunction

bool function IsIterating()
    Guard()
EndFunction

function waitWhileIterating(float waitInterval = 0.1)
    Guard()
EndFunction

function waitForState(Actor akState, float waitInterval = 0.1)
    Guard()
EndFunction 

;set the current index (between -1 and size)
;for use with getNext, SetNext, GetPrevious, SetPrevious functions
function SetCurrentIndex(int index)
    Guard()
Endfunction

;don't use, for internal use only
function SetCurrentSizeVariables(bool forceSetArray = false)
    Guard()
Endfunction

;CurrentIndex is used for getNext, SetNext, GetPrevious, SetPrevious functions
int function GetCurrentIndex()
    Guard()
EndFunction

;CurrentIndex is used for getNext, SetNext, GetPrevious, SetPrevious functions
int function GetCurrentArrayIndex()
    Guard()
EndFunction

;CurrentIndex is used for getNext, SetNext, GetPrevious, SetPrevious functions
int function GetCurrentSubArrayIndex()
    Guard()
EndFunction

;current sub array set internally. (Array0, Array1, Array2 ect. Matches the CurrentSubArrayIndex)
;used for getNext, SetNext, GetPrevious, SetPrevious functions
Actor[] function GetCurrentSubArray()
    Guard()
EndFunction 

int function GetSize()
    Guard()
Endfunction

int function GetMaxSize()
    Guard()
EndFunction

int function GetNumberOfArrays()
    Guard()
EndFunction

int function GetMaxNumberOfArrays()
    Guard()
EndFunction

;create a multi dimensional array with numberOfSubArrays of subArraySize
;BigArrayForm should have this script attached and the DynamicActorArrays script attached
DbBigActorArray function CreateMultiArray(Form BigArrayForm, int numberOfSubArrays = 1, int subArraySize = 1, Actor fillElement = None, bool persistent = true, bool abInitiallyDisabled = true) Global
    Guard()
EndFunction

;create a big Actor array with a max size of 16384
;this script and the DynamicActorArrays script should be attached to the BigArrayForm
DbBigActorArray function Create(Form BigArrayForm, int akSize = 0, Actor fillElement = None, bool persistent = true, bool abInitiallyDisabled = true) Global
    Guard()
EndFunction 

bool function resize(int newSize, Actor fillElement = None)
    Guard()
EndFunction

int function Find(Actor toFind)
    Guard()
EndFunction

int function RFind(Actor toFind)
    Guard()
EndFunction

bool function pushBack(Actor element)
    Guard()
EndFunction

;get the next element in the big array. Add 1 to currentIndex and get the element
;if the current index is already at the last valid element (size - 1), goes to the first index in the array (0).
Actor Function GetNext()
    Guard()
Endfunction

;set the next element in the big array. Add 1 to currentIndex and set the element
;if the current index is already at the last valid element (size - 1), goes to the first index in the array (0).
Function SetNext(Actor element)
    Guard()
EndFunction

;Get the previous element in the big array. Subtract 1 to currentIndex and get the element
;if the current index is at the first element (0), goes to the last valid index in the array (size - 1).
Actor Function GetPrevious()
    Guard()
Endfunction 

;Set the previous element in the big array. Subtract 1 to currentIndex and set the element
;if the current index is at the first element (0), goes to the last valid index in the array (size - 1).
Function SetPrevious(Actor element)
    Guard()
Endfunction

;Set the element at the index in the big array and set CurrentIndex to index (for getNext, setNext, GetPrevious and SetPrevious functions)
Actor function GetAt(int index)
    Guard()
EndFunction

;Set the element at the index in the large array and set CurrentIndex (for getNext, setNext, GetPrevious and SetPrevious functions)
bool function SetAt(int index, Actor element)
    Guard()
EndFunction

;use sparingly, pushback is much faster.
bool function InsertAt(int index, Actor element)
    Guard()
EndFunction

;get the last element of the big array and remove it, reducing the size by 1
Actor function Pop()
    Guard()
EndFunction

;remove the Actor at the index, reducing the size by 1 and moving each element after the index back by 1. 
;returns the Actor that's currently at the index
Actor function RemoveAt(int index)
    Guard()
EndFunction

function Clear()
    Guard()
EndFunction

function Destroy()
    Guard()
EndFunction

int[] function GetSubIndexesForIndex(int index)
    Guard()
EndFunction

;get Nth array in this object (0 to 100)
;if akSize > 0, set's the size of subArray to akSize before returning
Actor[] Function GetNthSubArray(int index, int akSize = 0)
    Guard()
EndFunction

Actor[] Function GetArray(int akSize = 0)
    Guard()
EndFunction 

State A1
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array1 = ActorArrays.CreateArray(akSize)
        Endif
        return Array1
    EndFunction
EndState

State A2
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array2 = ActorArrays.CreateArray(akSize)
        Endif
        return Array2
    EndFunction
EndState

State A3
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array3 = ActorArrays.CreateArray(akSize)
        Endif
        return Array3
    EndFunction
EndState

State A4
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array4 = ActorArrays.CreateArray(akSize)
        Endif
        return Array4
    EndFunction
EndState

State A5
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array5 = ActorArrays.CreateArray(akSize)
        Endif
        return Array5
    EndFunction
EndState

State A6
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array6 = ActorArrays.CreateArray(akSize)
        Endif
        return Array6
    EndFunction
EndState

State A7
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array7 = ActorArrays.CreateArray(akSize)
        Endif
        return Array7
    EndFunction
EndState

State A8
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array8 = ActorArrays.CreateArray(akSize)
        Endif
        return Array8
    EndFunction
EndState

State A9
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array9 = ActorArrays.CreateArray(akSize)
        Endif
        return Array9
    EndFunction
EndState

State A10
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array10 = ActorArrays.CreateArray(akSize)
        Endif
        return Array10
    EndFunction
EndState

State A11
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array11 = ActorArrays.CreateArray(akSize)
        Endif
        return Array11
    EndFunction
EndState

State A12
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array12 = ActorArrays.CreateArray(akSize)
        Endif
        return Array12
    EndFunction
EndState

State A13
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array13 = ActorArrays.CreateArray(akSize)
        Endif
        return Array13
    EndFunction
EndState

State A14
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array14 = ActorArrays.CreateArray(akSize)
        Endif
        return Array14
    EndFunction
EndState

State A15
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array15 = ActorArrays.CreateArray(akSize)
        Endif
        return Array15
    EndFunction
EndState

State A16
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array16 = ActorArrays.CreateArray(akSize)
        Endif
        return Array16
    EndFunction
EndState

State A17
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array17 = ActorArrays.CreateArray(akSize)
        Endif
        return Array17
    EndFunction
EndState

State A18
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array18 = ActorArrays.CreateArray(akSize)
        Endif
        return Array18
    EndFunction
EndState

State A19
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array19 = ActorArrays.CreateArray(akSize)
        Endif
        return Array19
    EndFunction
EndState

State A20
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array20 = ActorArrays.CreateArray(akSize)
        Endif
        return Array20
    EndFunction
EndState

State A21
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array21 = ActorArrays.CreateArray(akSize)
        Endif
        return Array21
    EndFunction
EndState

State A22
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array22 = ActorArrays.CreateArray(akSize)
        Endif
        return Array22
    EndFunction
EndState

State A23
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array23 = ActorArrays.CreateArray(akSize)
        Endif
        return Array23
    EndFunction
EndState

State A24
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array24 = ActorArrays.CreateArray(akSize)
        Endif
        return Array24
    EndFunction
EndState

State A25
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array25 = ActorArrays.CreateArray(akSize)
        Endif
        return Array25
    EndFunction
EndState

State A26
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array26 = ActorArrays.CreateArray(akSize)
        Endif
        return Array26
    EndFunction
EndState

State A27
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array27 = ActorArrays.CreateArray(akSize)
        Endif
        return Array27
    EndFunction
EndState

State A28
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array28 = ActorArrays.CreateArray(akSize)
        Endif
        return Array28
    EndFunction
EndState

State A29
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array29 = ActorArrays.CreateArray(akSize)
        Endif
        return Array29
    EndFunction
EndState

State A30
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array30 = ActorArrays.CreateArray(akSize)
        Endif
        return Array30
    EndFunction
EndState

State A31
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array31 = ActorArrays.CreateArray(akSize)
        Endif
        return Array31
    EndFunction
EndState

State A32
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array32 = ActorArrays.CreateArray(akSize)
        Endif
        return Array32
    EndFunction
EndState

State A33
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array33 = ActorArrays.CreateArray(akSize)
        Endif
        return Array33
    EndFunction
EndState

State A34
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array34 = ActorArrays.CreateArray(akSize)
        Endif
        return Array34
    EndFunction
EndState

State A35
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array35 = ActorArrays.CreateArray(akSize)
        Endif
        return Array35
    EndFunction
EndState

State A36
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array36 = ActorArrays.CreateArray(akSize)
        Endif
        return Array36
    EndFunction
EndState

State A37
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array37 = ActorArrays.CreateArray(akSize)
        Endif
        return Array37
    EndFunction
EndState

State A38
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array38 = ActorArrays.CreateArray(akSize)
        Endif
        return Array38
    EndFunction
EndState

State A39
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array39 = ActorArrays.CreateArray(akSize)
        Endif
        return Array39
    EndFunction
EndState

State A40
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array40 = ActorArrays.CreateArray(akSize)
        Endif
        return Array40
    EndFunction
EndState

State A41
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array41 = ActorArrays.CreateArray(akSize)
        Endif
        return Array41
    EndFunction
EndState

State A42
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array42 = ActorArrays.CreateArray(akSize)
        Endif
        return Array42
    EndFunction
EndState

State A43
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array43 = ActorArrays.CreateArray(akSize)
        Endif
        return Array43
    EndFunction
EndState

State A44
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array44 = ActorArrays.CreateArray(akSize)
        Endif
        return Array44
    EndFunction
EndState

State A45
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array45 = ActorArrays.CreateArray(akSize)
        Endif
        return Array45
    EndFunction
EndState

State A46
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array46 = ActorArrays.CreateArray(akSize)
        Endif
        return Array46
    EndFunction
EndState

State A47
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array47 = ActorArrays.CreateArray(akSize)
        Endif
        return Array47
    EndFunction
EndState

State A48
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array48 = ActorArrays.CreateArray(akSize)
        Endif
        return Array48
    EndFunction
EndState

State A49
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array49 = ActorArrays.CreateArray(akSize)
        Endif
        return Array49
    EndFunction
EndState

State A50
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array50 = ActorArrays.CreateArray(akSize)
        Endif
        return Array50
    EndFunction
EndState

State A51
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array51 = ActorArrays.CreateArray(akSize)
        Endif
        return Array51
    EndFunction
EndState

State A52
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array52 = ActorArrays.CreateArray(akSize)
        Endif
        return Array52
    EndFunction
EndState

State A53
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array53 = ActorArrays.CreateArray(akSize)
        Endif
        return Array53
    EndFunction
EndState

State A54
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array54 = ActorArrays.CreateArray(akSize)
        Endif
        return Array54
    EndFunction
EndState

State A55
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array55 = ActorArrays.CreateArray(akSize)
        Endif
        return Array55
    EndFunction
EndState

State A56
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array56 = ActorArrays.CreateArray(akSize)
        Endif
        return Array56
    EndFunction
EndState

State A57
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array57 = ActorArrays.CreateArray(akSize)
        Endif
        return Array57
    EndFunction
EndState

State A58
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array58 = ActorArrays.CreateArray(akSize)
        Endif
        return Array58
    EndFunction
EndState

State A59
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array59 = ActorArrays.CreateArray(akSize)
        Endif
        return Array59
    EndFunction
EndState

State A60
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array60 = ActorArrays.CreateArray(akSize)
        Endif
        return Array60
    EndFunction
EndState

State A61
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array61 = ActorArrays.CreateArray(akSize)
        Endif
        return Array61
    EndFunction
EndState

State A62
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array62 = ActorArrays.CreateArray(akSize)
        Endif
        return Array62
    EndFunction
EndState

State A63
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array63 = ActorArrays.CreateArray(akSize)
        Endif
        return Array63
    EndFunction
EndState

State A64
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array64 = ActorArrays.CreateArray(akSize)
        Endif
        return Array64
    EndFunction
EndState

State A65
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array65 = ActorArrays.CreateArray(akSize)
        Endif
        return Array65
    EndFunction
EndState

State A66
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array66 = ActorArrays.CreateArray(akSize)
        Endif
        return Array66
    EndFunction
EndState

State A67
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array67 = ActorArrays.CreateArray(akSize)
        Endif
        return Array67
    EndFunction
EndState

State A68
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array68 = ActorArrays.CreateArray(akSize)
        Endif
        return Array68
    EndFunction
EndState

State A69
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array69 = ActorArrays.CreateArray(akSize)
        Endif
        return Array69
    EndFunction
EndState

State A70
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array70 = ActorArrays.CreateArray(akSize)
        Endif
        return Array70
    EndFunction
EndState

State A71
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array71 = ActorArrays.CreateArray(akSize)
        Endif
        return Array71
    EndFunction
EndState

State A72
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array72 = ActorArrays.CreateArray(akSize)
        Endif
        return Array72
    EndFunction
EndState

State A73
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array73 = ActorArrays.CreateArray(akSize)
        Endif
        return Array73
    EndFunction
EndState

State A74
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array74 = ActorArrays.CreateArray(akSize)
        Endif
        return Array74
    EndFunction
EndState

State A75
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array75 = ActorArrays.CreateArray(akSize)
        Endif
        return Array75
    EndFunction
EndState

State A76
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array76 = ActorArrays.CreateArray(akSize)
        Endif
        return Array76
    EndFunction
EndState

State A77
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array77 = ActorArrays.CreateArray(akSize)
        Endif
        return Array77
    EndFunction
EndState

State A78
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array78 = ActorArrays.CreateArray(akSize)
        Endif
        return Array78
    EndFunction
EndState

State A79
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array79 = ActorArrays.CreateArray(akSize)
        Endif
        return Array79
    EndFunction
EndState

State A80
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array80 = ActorArrays.CreateArray(akSize)
        Endif
        return Array80
    EndFunction
EndState

State A81
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array81 = ActorArrays.CreateArray(akSize)
        Endif
        return Array81
    EndFunction
EndState

State A82
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array82 = ActorArrays.CreateArray(akSize)
        Endif
        return Array82
    EndFunction
EndState

State A83
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array83 = ActorArrays.CreateArray(akSize)
        Endif
        return Array83
    EndFunction
EndState

State A84
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array84 = ActorArrays.CreateArray(akSize)
        Endif
        return Array84
    EndFunction
EndState

State A85
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array85 = ActorArrays.CreateArray(akSize)
        Endif
        return Array85
    EndFunction
EndState

State A86
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array86 = ActorArrays.CreateArray(akSize)
        Endif
        return Array86
    EndFunction
EndState

State A87
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array87 = ActorArrays.CreateArray(akSize)
        Endif
        return Array87
    EndFunction
EndState

State A88
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array88 = ActorArrays.CreateArray(akSize)
        Endif
        return Array88
    EndFunction
EndState

State A89
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array89 = ActorArrays.CreateArray(akSize)
        Endif
        return Array89
    EndFunction
EndState

State A90
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array90 = ActorArrays.CreateArray(akSize)
        Endif
        return Array90
    EndFunction
EndState

State A91
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array91 = ActorArrays.CreateArray(akSize)
        Endif
        return Array91
    EndFunction
EndState

State A92
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array92 = ActorArrays.CreateArray(akSize)
        Endif
        return Array92
    EndFunction
EndState

State A93
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array93 = ActorArrays.CreateArray(akSize)
        Endif
        return Array93
    EndFunction
EndState

State A94
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array94 = ActorArrays.CreateArray(akSize)
        Endif
        return Array94
    EndFunction
EndState

State A95
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array95 = ActorArrays.CreateArray(akSize)
        Endif
        return Array95
    EndFunction
EndState

State A96
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array96 = ActorArrays.CreateArray(akSize)
        Endif
        return Array96
    EndFunction
EndState

State A97
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array97 = ActorArrays.CreateArray(akSize)
        Endif
        return Array97
    EndFunction
EndState

State A98
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array98 = ActorArrays.CreateArray(akSize)
        Endif
        return Array98
    EndFunction
EndState

State A99
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array99 = ActorArrays.CreateArray(akSize)
        Endif
        return Array99
    EndFunction
EndState

State A100
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array100 = ActorArrays.CreateArray(akSize)
        Endif
        return Array100
    EndFunction
EndState

State A101
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array101 = ActorArrays.CreateArray(akSize)
        Endif
        return Array101
    EndFunction
EndState

State A102
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array102 = ActorArrays.CreateArray(akSize)
        Endif
        return Array102
    EndFunction
EndState

State A103
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array103 = ActorArrays.CreateArray(akSize)
        Endif
        return Array103
    EndFunction
EndState

State A104
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array104 = ActorArrays.CreateArray(akSize)
        Endif
        return Array104
    EndFunction
EndState

State A105
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array105 = ActorArrays.CreateArray(akSize)
        Endif
        return Array105
    EndFunction
EndState

State A106
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array106 = ActorArrays.CreateArray(akSize)
        Endif
        return Array106
    EndFunction
EndState

State A107
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array107 = ActorArrays.CreateArray(akSize)
        Endif
        return Array107
    EndFunction
EndState

State A108
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array108 = ActorArrays.CreateArray(akSize)
        Endif
        return Array108
    EndFunction
EndState

State A109
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array109 = ActorArrays.CreateArray(akSize)
        Endif
        return Array109
    EndFunction
EndState

State A110
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array110 = ActorArrays.CreateArray(akSize)
        Endif
        return Array110
    EndFunction
EndState

State A111
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array111 = ActorArrays.CreateArray(akSize)
        Endif
        return Array111
    EndFunction
EndState

State A112
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array112 = ActorArrays.CreateArray(akSize)
        Endif
        return Array112
    EndFunction
EndState

State A113
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array113 = ActorArrays.CreateArray(akSize)
        Endif
        return Array113
    EndFunction
EndState

State A114
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array114 = ActorArrays.CreateArray(akSize)
        Endif
        return Array114
    EndFunction
EndState

State A115
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array115 = ActorArrays.CreateArray(akSize)
        Endif
        return Array115
    EndFunction
EndState

State A116
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array116 = ActorArrays.CreateArray(akSize)
        Endif
        return Array116
    EndFunction
EndState

State A117
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array117 = ActorArrays.CreateArray(akSize)
        Endif
        return Array117
    EndFunction
EndState

State A118
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array118 = ActorArrays.CreateArray(akSize)
        Endif
        return Array118
    EndFunction
EndState

State A119
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array119 = ActorArrays.CreateArray(akSize)
        Endif
        return Array119
    EndFunction
EndState

State A120
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array120 = ActorArrays.CreateArray(akSize)
        Endif
        return Array120
    EndFunction
EndState

State A121
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array121 = ActorArrays.CreateArray(akSize)
        Endif
        return Array121
    EndFunction
EndState

State A122
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array122 = ActorArrays.CreateArray(akSize)
        Endif
        return Array122
    EndFunction
EndState

State A123
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array123 = ActorArrays.CreateArray(akSize)
        Endif
        return Array123
    EndFunction
EndState

State A124
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array124 = ActorArrays.CreateArray(akSize)
        Endif
        return Array124
    EndFunction
EndState

State A125
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array125 = ActorArrays.CreateArray(akSize)
        Endif
        return Array125
    EndFunction
EndState

State A126
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array126 = ActorArrays.CreateArray(akSize)
        Endif
        return Array126
    EndFunction
EndState

State A127
    Actor[] Function GetArray(int akSize = 0)
        if akSize > 0
            Array127 = ActorArrays.CreateArray(akSize)
        Endif
        return Array127
    EndFunction
EndState

; used to write the array states in this script.
; Function WriteArrayStates(int startIndex = 0, int maxState = 99, Actor filePath) global
;     int i = startIndex
;     while i < maxState
;         Actor arrayActor = ("Array" + i)
        
;         MiscUtil.WriteToFile(filePath, "\n")
;         MiscUtil.WriteToFile(filePath, "\nState A" + i)
;         MiscUtil.WriteToFile(filePath, "\n    Actor[] Function GetArray(int akSize = 0)")
;         MiscUtil.WriteToFile(filePath, "\n        if akSize > 0")
;         MiscUtil.WriteToFile(filePath, "\n            " + arrayActor + " = ActorArrays.CreateArray(akSize)")
;         MiscUtil.WriteToFile(filePath, "\n        Endif")
;         MiscUtil.WriteToFile(filePath, "\n        return " + arrayActor)
;         MiscUtil.WriteToFile(filePath, "\n    EndFunction")
;         MiscUtil.WriteToFile(filePath, "\nEndState")
        
;         i += 1
;     EndWhile
; EndFunction

Function Guard()
    Debug.MessageBox("DbBigActorArray: Dom't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction

