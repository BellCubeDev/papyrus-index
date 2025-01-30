Scriptname AhzMoreHudIE Hidden
{Script used for adding custom icons to moreHUD Inventory Edition}

int Function GetVersion() global native
{Gets the version e.g 10008 for 1.0.8}

;iEquip Functions ---------------------------------------

bool Function IsIconItemRegistered(int aItemId) global native
{iEquip Only - Returns true if the Item ID is registered}

Function AddIconItem(int aItemId, string aIconName) global native
{iEquip Only - Add an Item ID with the icon that you want to display}

Function RemoveIconItem(int aItemId) global native
{iEquip Only - Removes and Item ID from the icon list}

Function AddIconItems(int[] aItemIds, string[] aIconNames) global native
{iEquip Only - Adds an array of Item ID's with the icon that you want to display}

Function RemoveIconItems(int[] aItemIds) global native
{iEquip Only - Removes an array of Item ID's from the icon list}

Int Function GetFormItemId(Form aForm) Global Native
{iEquip Only - Gets a unique Item ID from a form.  It is the CRC of the form ID and the name}

;Custom Icon Functions, The icon must exist in the 'Data/Interface/exported/moreHUDIE/baseIcons.swf'

Function RegisterIconFormList(string aKey, FormList alist) global native
{Registers a form list with this key. The key is the name of the icon.
The icon must exist in the 'Data/Interface/exported/moreHUDIE/baseIcons.swf'}

Function UnRegisterIconFormList(string aKey) global native
{Unregisters a form list with this key. The key is the name of the icon.
The icon must exist in the 'Data/Interface/exported/moreHUDIE/baseIcons.swf'}

bool Function IsIconFormListRegistered(string aKey) global native
{Returns true if the form list is registered with the key. The key is the name of the icon.
The icon must exist in the 'Data/Interface/exported/moreHUDIE/baseIcons.swf'}