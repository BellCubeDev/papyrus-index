Scriptname DbMiscFunctionsSSE Hidden

Import DbMiscFunctions

;Get all file paths in directory, including files in sub folders. 
;If Fullpath == true (default) get's full paths, e.g Data/Interface/MyFile.txt 
;Otherwise gets e.g MyFile.txt 
;Requires skse and papyrusUtil.
String[] Function GetAllFilesInFolder(string directory, string extension="*", Bool FullPath = true) Global
    Guard()
EndFunction 

;Get all folder paths in directory, including sub folders. 
;Requires skse and papyrusUtil.
String[] Function GetAllFoldersInFolder(String directory) Global
    Guard()
EndFunction

;Write all of the file paths found in the Directory, including files in sub folders to the OutputFilePath. 
;If NullString != none, will only write file paths not found in the NullString
;If AllowDuplicates == false (default), only writes file paths not already present in the OutputFilePath
;Requires skse and PapyrusUtil
Function WriteAllFilePathsToFile(String OutputFilePath, String Directory, string extension="*", Bool FullPath = true, String NullString = "", Bool AllowDuplicates = False) Global
    Guard()
EndFunction

;Write all of the Folder paths found in the Directory, including sub folders, to the OutputFolderPath. 
;If NullString != none, will only write Folder paths not found in the NullString
;If AllowDuplicates == false (default), only writes Folder paths not already present in the OutputFolderPath
;Requires skse and PapyrusUtil
Function WriteAllFolderPathsToFile(String OutputFilePath, String Directory, String NullString = "", Bool AllowDuplicates = False) Global
    Guard()
EndFunction

Function Guard()
    Debug.MessageBox("DbMiscFunctionsSSE: Don't recompile scripts from the Papyrus Index! Please use the scripts provided by the mod author.")
EndFunction
