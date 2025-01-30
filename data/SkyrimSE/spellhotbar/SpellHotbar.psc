scriptName SpellHotbar hidden

Form function getCurrentSelectedSpellInMenu() global native
Form function getSlottedSpell(int index) global native
bool function slotSpell(Form form, int index, int type) global native
bool function isCtrlBarEnabled() global native
bool function toggleCtrlBarEnabled() global native
bool function isShiftBarEnabled() global native
bool function toggleShiftBarEnabled() global native
bool function isAltBarEnabled() global native
bool function toggleAltBarEnabled() global native
int function getNumberOfSlots() global native
int function setNumberOfSlots(int num) global native
float function getSlotScale() global native
float function setSlotScale(float scale) global native
float function getOffsetX() global native
float function setOffsetX(float value) global native
float function getOffsetY() global native
float function setOffsetY(float value) global native
function bindMenuMoveBarLeft() global native
function bindMenuMoveBarRight() global native
int function getInheritMode(int id) global native
int function setInheritMode(int id, int mode) global native
bool function getBarEnabled(int id) native global
bool function toggleBarEnabled(int id) native global
function highlightSlot(int slot, bool error, float duration) native global
int function setHudBarShowMode(int mode) native global
int function getHudBarShowMode() native global
bool function isPlayerOnGCD() native global
function setPlayerGCD(float time) native global
function reloadResources() native global
function reloadData() native global
float function setupCastAndGetCasttime(Form form) native global
function triggerSkillCooldown(Form form) native global
bool function isPlayerOnCD(Form form) native global
function showDragBar() native global
int function setHudBarShowModeVampireLord(int mode) native global
int function getHudBarShowModeVampireLord() native global
int function setHudBarShowModeWerewolf(int mode) native global
int function getHudBarShowModeWerewolf() native global
bool function saveBarsToFile(String filenname) native global
bool function fileExists(String filenname) native global
bool function loadBarsFromFile(String filename_mod_dir, String filename_user_dir) native global
function clearBars() native global
float function getSlotSpacing() global native
float function setSlotSpacing(float spacing) global native
int function getTextShowMode() native global
int function setTextShowMode(int mode) native global
bool function isTransformedFavMenuBind() native global
bool function isDefaultBarWhenSheathed() global native
bool function toggleDefaultBarWhenSheathed() global native
bool function isDisableMenuRendering() global native
bool function toggleDisableMenuRendering() global native
