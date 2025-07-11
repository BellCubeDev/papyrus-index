;/
	PAPYRUS IDNEX NOTE
	The positioning of documentation strings in this file has been altered to match Papyrus standards and to be parsable by the Papyrus Index.
/;

Scriptname BakaUtil extends ScriptObject Native

ObjectReference[] Function FilterReferencesByKeywords(ObjectReference[] aaReferences, Keyword[] aaKeywords, bool abRefrHasKeyword = true) Native Global
{ Filter the passed array of ObjectReferences for References that have at least one keyword from the passed array of Keywords if RefrHasKeyword is true,
  or Filter the passed array of ObjectReferences for References that do not have any of the keywords from the passed array of keywords if RefrHasKeyword is false }

Function OpenWebPage(string asURL, bool abFallback) Native Global
{ Open the passed URL in the Steam Overlay, or the user's desktop browser if the overlay is unavailable, and abFallback is true }

Function RegisterForPipboyLightEvent(Var akObject) Native Global

Function UnregisterForPipboyLightEvent(Var akObject) Native Global
