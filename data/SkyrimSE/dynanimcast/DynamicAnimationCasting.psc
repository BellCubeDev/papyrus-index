scriptname DynamicAnimationCasting

; Register a custom spell for the name, which can be casted by @NAME in DynamicAnimationCasting.toml
bool function RegisterCustomSpell(string name, Spell spell) global native

; Select the favourite spell index to cast from @FAVOURITE spell in DynamicAnimationCasting.toml
bool function SelectFavouriteSpell(int index) global native

; Select the next or previous favourite spell to cast from @FAVOURITE spell in DynamicAnimationCasting.toml
int function NextFavouriteSpell(int delta) global native
