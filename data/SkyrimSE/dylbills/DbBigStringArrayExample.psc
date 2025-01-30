scriptname DbBigStringArrayExample extends quest
{examples of how to use DbBigStringArray as either one big array or as multidimensional arrays.}

MiscObject Property DbBigStringArrayMisc Auto
{this misc object has the DbBigStringArray and DynamicStringsArrays scripts attached}

DbBigStringArray myBigStringArray

Event OnInit()
    Guard()
EndEvent

function testPushBack()
    Guard()
EndFunction

function testBigArrayRemoveAt()
    Guard()
EndFunction

function testBigArrayInsert()
    Guard()
EndFunction

function IterateThroughBigArray_OptionA()
    Guard()
EndFunction

function IterateThroughBigArray_OptionB()
    Guard()
EndFunction

function IterateThroughBigArray_OptionC()
    Guard()
EndFunction

function ArrayResizeTest1()
    Guard()
EndFunction

function BigStringArrayResizeTest2()
    Guard()
EndFunction

function BigStringArray_A_Example()
    Guard()
EndFunction

function BigStringArray_B_Example()
    Guard()
EndFunction

DbBigStringArray multiArray3X3

Function MultiArray3X3_Example()
    Guard()
EndFunction

DbBigStringArray[] bigMultiArray3X3

function bigMultiArray3X3_Example()
    Guard()
EndFunction

DbBigStringArray[] multiArray2X2X2

Function multiArray2X2X2_Example()
    Guard()
EndFunction

function FindAndMessageInArray(string stringA, string stringB, DbBigStringArray akArray = none)
    Guard()
EndFunction

Function Guard()
    Debug.MessageBox("DbBigStringArrayExample: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
