Scriptname Keyword Extends Form Native Hidden

; Sends this keyword as a story event to the story manager
Function SendStoryEvent(Location akLoc = None, ObjectReference akRef1 = None, ObjectReference akRef2 = None, int aiValue1 = 0, \
	int aiValue2 = 0) native

; Sends this keyword as a story event to the story manager and waits for it to be processed. Returns the array of quests that were started if any.
Quest[] Function SendStoryEventAndWait(Location akLoc = None, ObjectReference akRef1 = None, ObjectReference akRef2 = None, \
	int aiValue1 = 0, int aiValue2 = 0) native