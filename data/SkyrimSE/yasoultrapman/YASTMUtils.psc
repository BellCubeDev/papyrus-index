scriptname YASTMUtils hidden

; Traps a soul and returns the caster.
;
; Useful when you need to handle soul diversion, since the returned caster may
; differ from the input caster.
;
; A return value of 'none' indicates that the soul trap has failed.
Actor function TrapSoulAndGetCaster(Actor caster, Actor victim) global native
