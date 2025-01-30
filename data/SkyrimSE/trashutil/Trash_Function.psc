Scriptname Trash_Function Hidden

; =================== MISC ===================
    
int Function GetIntMax() Global Native
    
float Function GetFloatMax() Global Native
    
int Function GetIntMin() Global Native
    
float Function GetFloatMin() Global Native

; =================== Debug ===================
Function ConsoleInfo(string _str) Global Native

string Function GetFormIDString(form _form) Global Native
    
string Function ToHexString(int _num) Global Native
    
Function PrintFlt(float _flt) Global Native
    
Function PrintForm(Form _form) Global Native

Function DumpFormArray(Form[] _FormArr) Global Native
    
Function DumpRefArray(ObjectReference[] _RefArr) Global Native
    
Function DumpIntArray(int[] _IntArr) Global Native
    
Function DumpFloatArray(float[] _form) Global Native

; =================== Distance ===================
float Function GetDistance2D(ObjectReference A_ref, ObjectReference B_ref) Global Native
float Function GetDistanceFromPoint2D(ObjectReference _ref,float x, float y) Global Native
float Function GetDistanceBetweenPoints2D(float A_x, float A_y, float B_x, float B_y) Global Native

float Function GetDistance3D(ObjectReference A_ref, ObjectReference B_ref) Global Native
float Function GetDistanceFromPoint3D(ObjectReference _ref, float x, float y, float z) Global Native
float Function GetDistanceBetweenPoints3D(float A_x, float A_y, float A_z, float B_x, float B_y, float B_z) Global Native

bool Function GetInSameCellOrWorldSpace(ObjectReference A_ref, ObjectReference B_ref) Global Native

; =================== Pos ===================
float[] Function GetPosAsArray(ObjectReference _obj) Global Native

Function SetPosAlt(ObjectReference _obj,float x,float y,float z,bool transform = False) Global Native
    
Function SetPosFromArray(ObjectReference _obj, float[] PosArr,bool transform = False) Global Native
    
; =================== HeadingAngle ===================
float Function GetHeadingPointAngle(ObjectReference _obj,float x,float y,float z,bool a_abs = false) Global Native

float Function GetHeadingAngleBetweenPoints(float A_x, float A_y, float A_z, float ang_z, float B_x, float B_y,float B_z, bool a_abs = False) Global Native

float Function GetHeadingAngleX(ObjectReference fst_ref, ObjectReference sec_ref,  bool a_abs = false) Global Native

float Function GetHeadingPointAngleX(ObjectReference _ref,float _x, float _y, float _z, bool a_abs = false) Global Native

float Function GetHeadingAngleBetweenPointsX(float A_x, float A_y, float A_z, float ang_x, float B_x, float B_y,float B_z, bool a_abs = False) Global Native

; =================== SpellMatter ===================
Form[] Function InstantCastToActors(ObjectReference _Caster,Form _Spell,float _Radius = 0.0,bool _BlameCaster=False,bool _CastToCaster = false,ObjectReference _Center = None) Global Native

Form[] Function InstantCastToActorsWithFilter(ObjectReference _Caster,Form _Spell, float _Radius = 0.0,bool _BlameCaster = false, bool _CastToCaster = false,ObjectReference _Center = None, Form Keyword_or_FormList =None,bool _MatchAllKeywords = False) Global Native

Form[] Function InstantCastToActorsWithFilterAlt(ObjectReference _Caster,Form _Spell, float _Radius = 0.0,bool _BlameCaster = false, bool _CastToCaster = false,ObjectReference _Center = None,Keyword[] Keyword_Arr = None,bool _MatchAllKeywords = False) Global Native

; =================== Sound ===================
; _Sound must be a Sound Descriptor(SNDR)
bool Function PlaySoundAtPoint (Form _Sound,float x,float y,float z) Global Native

; =================== TimeMultSetter ===================
Function SetSlowTimeMult(float _WorldTimeMult = 0.0, float _PlayerOnlyTimeMult = 1.0, bool _Setter = true) Global Native
    
float Function GetSlowTimeMult(bool _GetWorldTimeMult = true) Global Native

; =================== ApplyHit ===================
    
Function ApplyMeleeHit(Actor _attacker,Actor _victim,bool lefthand = false) Global Native
    
Function ApplyHit(Actor _attacker,Actor _victim,Weapon _weapon,bool _applyench = true) Global Native
