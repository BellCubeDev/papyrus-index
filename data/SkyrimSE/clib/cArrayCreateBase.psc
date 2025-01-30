Scriptname cArrayCreateBase Hidden

function Guard()
  Debug.MessageBox("cArrayCreateBase: Don't recompile this script!\n\nPlease get the real version from the Nexus page.")
endFunction

Actor[] function cArrayCreateActor(Int indices, Actor filler = None, Bool usePapUtil = TRUE, \
  Bool outputTrace = TRUE, Bool useConsoleUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction

Alias[] function cArrayCreateAlias(Int indices, Alias filler = None, Bool useSKSE = TRUE, Bool outputTrace = TRUE, \
    Bool useConsoleUtil = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction

Bool[] function cArrayCreateBool(Int indices, Bool filler = False, Bool useSKSE = TRUE, Bool outputTrace = TRUE, \
    Bool useConsoleUtil = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction

Float[] function cArrayCreateFloat(Int indices, Float filler = 0.0, Bool useSKSE = TRUE, Bool outputTrace = TRUE, \
    Bool useConsoleUtil = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction

Form[] function cArrayCreateForm(Int indices, Form filler = None, Bool useSKSE = TRUE, Bool outputTrace = TRUE, \
    Bool useConsoleUtil = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction

Int[] function cArrayCreateInt(Int indices, Int filler = 0, Bool useSKSE = TRUE, Bool outputTrace = TRUE, \
    Bool useConsoleUtil = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction

ObjectReference[] function cArrayCreateObjRef(Int indices, ObjectReference filler = None) global
    Guard()
endfunction
ObjectReference[] function cArrayCreateObjectReference(Int indices, ObjectReference filler = None, Bool usePapUtil = TRUE, \
  Bool outputTrace = TRUE, Bool useConsoleUtil = TRUE) global
  {Requirements: None, PapyrusUtil:Soft}
    Guard()
endfunction

String[] function cArrayCreateString(Int indices, String filler = "", Bool useSKSE = TRUE, Bool outputTrace = TRUE, \
    Bool useConsoleUtil = TRUE) global
  {Requirements: None, SKSE:Soft}
    Guard()
endfunction
