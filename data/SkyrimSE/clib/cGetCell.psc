ScriptName cGetCell Hidden

function Guard()
  Debug.MessageBox("cGetCell: Don't recompile this script!\n\nPlease get the real version from the Nexus page.")
endFunction

String function cGetScriptName() global
    Guard()
endfunction

function clibTrace(String msg, Int errorLevel, Bool condition = TRUE) global
    Guard()
endfunction

Bool function cIsBetweenFloat(Float aValue, Float minV, Float maxV) global
  {Requirements: None}
    Guard()
endfunction

Int[]   function cGetCKCoordsFromXY(Float xVar, Float yVar, ObjectReference aObjectRef = None) global
  {Requirements: None}
    Guard()
endfunction

Form function cGetCellFromCoords(Int ckXVar, Int ckYVar, Float xVar = 0.0, Float yVar = 0.0) global
    Guard()
endfunction

Int function cGetCellFormIDFromCoords(Int ckXVar, Int ckYVar, Float xVar = 0.0, Float yVar = 0.0) global
    Guard()
endfunction

Bool function cIsBetweenInt(Int aValue, Int minV, Int maxV) global
  {Requirements: None}
    Guard()
endfunction
