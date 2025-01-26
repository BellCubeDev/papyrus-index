Scriptname SoundCategorySnapshot extends Form Native Hidden

; Push this snapshot to the sound category snapshot priority-stack
Function Push( float afTransitionSecs = 1.0 ) native

; Remove this snapshot from the sound category snapshot stack
Function Remove() native