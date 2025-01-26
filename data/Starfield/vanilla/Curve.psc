Scriptname Curve extends Form Native Hidden

; Check whether the given input value is within the range of defined values for the curve.
bool Function HasValueAt(float afInput) native

; Get the output value for the given input value.  
; NOTE: Depending on the curve edge setting, it will clamp/mirror/repeat. Use HasValueAt first if you need to check if its within range.
float Function GetValueAt(float afInput) native

;jduvall
;gets an array of values for a given array of inputs
float[] Function GetValues(float[] Inputs)
    float[] values = new float[Inputs.Length]

    int i = 0
    While (i < Inputs.length)
        values[i] = GetValueAt(Inputs[i])
        i += 1
    EndWhile

    return values
EndFunction