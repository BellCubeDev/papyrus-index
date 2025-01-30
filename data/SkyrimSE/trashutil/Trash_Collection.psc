ScriptName Trash_Collection Hidden
; ======================= Misc ======================= 
; CollectionType, 0 = AuxArr, 1 = RefMap
function DumpCollection(Form Holder, String CollectionName, int CollectionType) global native
function DumpAllAuxArr() global native
function DumpAllRefMap() global native
function DumpAllCollection() global native

bool function DestroyAuxArr(Form Holder, String CollectionName) global native 
bool function DestroyRefMap(Form Holder, String CollectionName) global native 

; ======================= Aux Array ======================= 
Bool function AuxArrayEmpty(Form Holder, String CollectionName) global native

Bool function AuxArrayErase(Form Holder, String CollectionName, int _index = -1) global native

int function AuxArrayGetType(Form Holder, String CollectionName, int _index = 0) global native

Bool function AuxArraySetFloat(Form Holder, String CollectionName, Float _flt, Int _index = 0) global native

Float function AuxArrayGetFloat(Form Holder, String CollectionName, Int _index = 0) global native

Bool function AuxArraySetRef(Form Holder, String CollectionName, Form _form, Int _index = 0) global native

Form function AuxArrayGetRef(Form Holder, String CollectionName, Int _index = 0) global native

form[] function AuxArrayGetRefArray(Form Holder, String CollectionName) global native

Float[] function AuxArrayGetFloatArray(Form Holder, String CollectionName) global native

Int function AuxArraySetFromFloatArray(Form Holder, String CollectionName, Float[] floatArr) global native

Int function AuxArraySetFromRefArray(Form Holder, String CollectionName, form[] FormArr) global native

Int function AuxArrayGetSize(Form Holder, String CollectionName) global native

Int function AuxArraySetFromFormList(Form Holder, String CollectionName, FormList _formlist) global native

; ======================= Ref Map ======================= 
Bool function RefMapSetFloat(Form Holder, String CollectionName, Form _key, Float _elem) global native

Float function RefMapGetFloat(Form Holder, String CollectionName, Form _key) global native

Bool function RefMapSetRef(Form Holder, String CollectionName, Form _key, Form _elem) global native

Form function RefMapGetRef(Form Holder, String CollectionName, Form _key) global native

form[] function RefMapGetRefValues(Form Holder, String CollectionName) global native

Int function RefMapGetSize(Form Holder, String CollectionName) global native

form[] function RefMapGetKeys(Form Holder, String CollectionName) global native

Bool function RefMapEraseAll(Form Holder, String CollectionName) global native

Bool function RefMapErase(Form Holder, String CollectionName, Form _key) global native

Float[] function RefMapGetFloatValues(Form Holder, String CollectionName) global native

Bool function RefMapClear(Form Holder, String CollectionName) global native

Bool function RefMapEraseInvalidKey(Form Holder, String CollectionName) global native

int function MapGetValueType(Form Holder, String CollectionName, Form _key) global native

