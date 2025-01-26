Scriptname SoundCategory extends Form Native Hidden

; Mutes all sounds in this category
Function Mute() Native

; Pasues all sounds in this category
Function Pause() Native

; Sets a frequency modifier on all sounds in this category (from 0 to 1)
Function SetFrequency(float afFrequencyCoeffecient) Native

; Sets a volume modifier for all sounds in this category (from 0 to 1)
Function SetVolume(float afVolume) Native

; Unmutes all sounds in this category
Function UnMute() Native

; Unpauses all sounds in this category (that were paused)
Function UnPause() Native
