scriptname RogueUtil


;Returns a 4 length array of integers representing the current version.
int[] function GetVersion() native global

int function GetVersionInt() global
	int[] v = GetVersion();

	int result = Math.LeftShift(v[0], 23)
	result = Math.LogicalOR(Math.LeftShift(v[1], 15), result);
	result = Math.LogicalOR(Math.LeftShift(v[2], 7), result);
	result = Math.LogicalOR(v[3], result);

	return result
endFunction