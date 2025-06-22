Scriptname SEA_BarterFunctions

Function ResetCurrency() Global Native
Function RegisterFormForAllEvents(Form a_kForm) Global Native
Bool Function SetCurrency(Form a_kNewCurrency) Global Native
Bool Function SetCurrencyConsole(String a_sNewCurrencyEditorID) Global Native
Form Function GetCurrency() Global Native

Function SetTrainingOverrides(bool a_bOverrideMultiplier, Float a_bMultOverride, Bool a_bOverrideBase, Float a_bBaseOverride) Global Native
Function SetTrainingOverridesConsole(String a_sOverrideMultiplier, String a_sMultOverride, String a_sOverrideBase, String a_sBaseOverride) Global Native

;/
Events
/;
Event OnCustomPurchase(Form a_kCurrency)

EndEvent

Event OnCustomSale(Form a_kCurrency)

EndEvent

Event OnCustomCurrencyFail(Form a_kCurrency)

EndEvent

Event OnCurrencySwap(Form a_kOldCurrency, Form a_kNewCurrency)

EndEvent

Event OnCurrencyRevert(Form a_kOldCurrency)

EndEvent

Event OnCustomBarterMenu(Actor a_kSeller)

EndEvent