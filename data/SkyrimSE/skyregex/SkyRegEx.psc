ScriptName SkyRegEx Hidden

String Function GetVersion() Global Native

Bool Function IsMatching(String sInput, String sFilename, Int iPatternLine, Int iModLineA, Int iModLineB) Global Native
Int Function MatchCount(String sInput, String sFilename, Int iPatternLine, Int iModLineA, Int iModLineB) Global Native
Int[] Function MatchInfo(String sInput, String sFilename, Int iPatternLine, Int iModLineA, Int iModLineB) Global Native
String[] Function MatchData(String sInput, String sFilename, Int iPatternLine, Int iModLineA, Int iModLineB) Global Native

String Function MatchResult(Int[] aInfo, String[] aData, Int iMatch, Int iGroup) Global Native

String Function ReplaceWith(String sInput, String sFilename, Int iPatternLine, Int iReplaceLine, Int iModLineA, Int iModLineB) Global Native
