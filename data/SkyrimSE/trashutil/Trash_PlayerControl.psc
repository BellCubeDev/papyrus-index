scriptName Trash_PlayerControl Hidden

; |flag = 0 -X | flag =1 -Y | flag =2 -X&&Y | flag =3 -X||Y | other -X||Y
bool Function IsReverseMove(int flag = -1) global native

; |flag = 0 -X | flag =1 -Y | flag =2 -X&&Y | flag =3 -X||Y | other -X||Y
bool Function IsReverseLook(int flag = -1) global native

; |flag = 0 -X | flag =1 -Y | other = -X||Y 
bool Function IsMoveDisabled(int flag = -1) global native

; |flag = 0 -X | flag =1 -Y | other = -X&&Y 
Function SetMoveDisabled(bool _Disabled = False,int flag = -1) global native

; |flag = 0 -X | flag =1 -Y | flag =2 -X&&Y | flag =3 -X||Y | other -X||Y
bool Function IsLookMoveScale(int flag = -1) global native

; |flag = 0 -X | flag =1 -Y | other =2 -X&Y 
float Function GetLookMoveScale(int flag = -1) Global Native

; |flag = 0 -X | flag =1 -Y | flag =2 -X&Y | other -X&Y
Function LookMoveScale( float a_scale = 1.0,int flag = -1) global native
    
; |flag = 0 -X | flag =1 -Y | other -X&Y
int Function GetMoveDirection(int flag = -1) global native

; |flag = 0 -X | flag =1 -Y | flag =2 -X&Y | other -X&Y
int Function GetLookMoveDirection(int flag = -1) global native

; |flag = 0 -X | flag =1 -Y | flag =2 -X&Y | other -X&Y
; _direction == 0 it will not apply any overwrite
Function SetMoveOverwrite(int _direction=0 ,int flag = -1) global native

; |flag = 0 -X | flag =1 -Y | other -X||Y
int Function GetMoveOverwrite(int flag = -1) global native

; |flag = 0 -X | flag =1 -Y | flag =2 -X&Y | other -X||Y
; movement == 0 it will not apply any overwrite
Function SetLookMoveOverwrite(float _movement = 0.0,int flag = -1) global native

; |flag = 0 -X | flag =1 -Y | other -X||Y
float Function GetLookMoveOverwrite(int flag = -1) global native   
    
; |flag = 0 -X | flag =1 -Y | flag =2 -X&Y | other -X&Y
Function ReverseMove(bool _Reverse = False, int flag = -1) global native
    
; |flag = 0 -X | flag =1 -Y | flag =2 -X&Y | other -X&Y
Function ReverseLook(bool _Reverse = False, int flag = -1) global native
    
Function SetAllReverse(bool _ReverseAll = False) global native
