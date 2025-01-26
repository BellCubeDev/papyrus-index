Scriptname Math Native Hidden

; Calculates the absolute value of the passed in value - N for N, and N for (-N)
float Function abs(float afValue) global native

; Calculates the arccosine of the passed in value, returning degrees
float Function acos(float afValue) global native

; Calculates the arcsine of the passed in value, returning degrees
float Function asin(float afValue) global native

; Calculates the arctangent of the passed in value, returning degrees
float Function atan(float afValue) global native

; Calculates the ceiling of the passed in value - the smallest integer greater than or equal to the value
int Function Ceiling(float afValue) global native

; Calculates the cosine of the passed in value (in degrees)
float Function cos(float afValue) global native

; Converts degrees to radians
float Function DegreesToRadians(float afDegrees) global native

; Calculates the floor of the passed in value - the largest integer less than or equal to the value
int Function Floor(float afValue) global native

; Calculates x raised to the y power
float Function pow(float x, float y) global native

; Converts radians to degrees
float Function RadiansToDegrees(float afRadians) global native

; Calculates the sine of the passed in value (in degrees)
float Function sin(float afValue) global native

; Calculate the square root of the passed in value
float Function sqrt(float afValue) global native

; Calculates the tangent of the passed in value (in degrees)
float Function tan(float afValue) global native

; return the max of the two numbers
float Function Max(float afValue1, float afValue2) global
	if afValue1 > afValue2
		return afValue1
	else
		return afValue2
	endif
endFunction

; return the min of the two numbers
float Function Min(float afValue1, float afValue2) global
	if afValue1 < afValue2
		return afValue1
	else
		return afValue2
	endif
endFunction

;return clamped value
float Function Clamp(float ValueToClamp, float afValueMin, float afValueMax) global
	return  Max(Min(ValueToClamp, afValueMax), afValueMin)
EndFunction

; return a normalized value between 0 and 1
float Function Normalize(float afValue, float afMin, float afMax) global
	return (afValue - afmin) / (afMax - afMin)
EndFunction

;rounds away from zero if decimal part is >= 0.5 otherwise rounds towards zero
int Function Round(float afValueToRound) global
	int trunc = afValueToRound as int

	if abs(afValueToRound) - abs(trunc) >= 0.5
		if afValueToRound < 0
			return trunc - 1
		else
			return trunc + 1
		endif
	endif

	return trunc

EndFunction

;extracts the value of a number at a particular position (0-based, one's place is 0)
;examples:
;ExtractDigit(567, 0) == 7
;ExtractDigit(567, 1) == 6
;ExtractDigit(567, 2) == 5
;ExtractDigit(567, 999) == -1
;ExtractDigit(567, 999, 0) == 0
int Function ExtractDigit(int number, int position, int NonExistentDigit = -1) global

	;this is a number with all the digits to the left of the position
	;for example 567 with position 1 == 56
	int leftDigits = number / pow(10, position) as int

	if leftDigits < 1 ;we don't have a digit at that position
		return NonExistentDigit
	else
		return leftDigits % 10
	endif

EndFunction

; return a number days for a number of hours - useful for doing math with GameDaysPassed, etc.
float Function HoursAsDays(float afHours) global
	return afHours / 24.0
EndFunction

; return a number days for a number of minutes - useful for doing math with GameDaysPassed, etc.
float Function MinutesAsDays(float afMinutes) global
	return afMinutes / 24.0 / 60.0
EndFunction

; return a number of days for a number of seconds - useful for doing math with GameDaysPassed, etc.
float Function SecondsAsDays(float afSeconds) global
	return afSeconds / 24.0 / 60.0 / 60.0
EndFunction

; return a number of hours for a number of days - useful for doing math with GameDaysPassed, etc.
float Function DaysAsHours(float afDays) global
	return afDays * 24.0
EndFunction

; return a number of Minutes for a number of days - useful for doing math with GameDaysPassed, etc.
float Function DaysAsMinutes(float afDays) global
	return afDays * 24.0 * 60.0
EndFunction

; return a number of Seconds for a number of days - useful for doing math with GameDaysPassed, etc.
float Function DaysAsSeconds(float afDays) global
	return afDays * 24.0 * 60.0 * 60.0
EndFunction