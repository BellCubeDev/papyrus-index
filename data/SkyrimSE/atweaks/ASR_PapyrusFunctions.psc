scriptName ASR_PapyrusFunctions hidden

Function CastSpellItemMult(Actor akSource, Spell akSpell, Enchantment akEnchantment, Potion akPotion, Ingredient akIngredient, ObjectReference akTarget, float a_effectiveness, float a_override)  global native
; will cast the form you give it to a MagicItem then spell cast it

Function CastSpellMult(Actor akSource, Form MagicItem, ObjectReference akTarget, float a_effectiveness, float a_override)  global native

bool Function GetEffectWasDualCast(ActiveMagicEffect a_activeEffect) global native

Function AdjustActiveEffectMagnitude(ActiveMagicEffect a_activeEffect, Float a_power) global native
; only works on mgef's that are not flagged with recover and will not work for all archetypes currently

Function AdjustActiveEffectDuration(ActiveMagicEffect a_activeEffect, Float a_duration) global native
; remaining duration 

bool Function GetEnchantCostOverrideFlag(Enchantment a_enchant) global native

Function SetEnchantCostOverrideFlag(Enchantment a_enchant, Bool ValueToSet) global native

int Function GetEnchantCostOverrideValue(Enchantment a_enchant) global native

int Function GetEnchantChargeOverrideValue(Enchantment a_enchant) global native

Function setEnchantCostOverrideValue(Enchantment a_enchant, Int CostOverride) global native

Function setEnchantChargeOverrideValue(Enchantment a_enchant, Int ChargeOverride) global native

