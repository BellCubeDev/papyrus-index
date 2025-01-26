#
# A script to reliably scrape all native scripts from a game's vanilla scripts directory.
# ONLY USE THIS SCRIPT ON VANILLA SCRIPTS. It is NOT intended to pick up scripts from mods.
#
# For games with support for the `Native` script flag (e.g. FO4), this script will read the Scriptname header to determine if the script is native.
# For games without support for the `Native` script flag (s.g. Skyrim), this script will search for usages of the `Native` keyword elsewhere in the script.
#
# It will then copy all native scripts into the `vanilla` folder for that game in the project.
#



# Get the user's game so we know how to scrape
$gameId = $null
$gameRegistryKey = $null
$supportsNativeScriptFlag = $null
$gameScriptsPaths = "Scripts/Source"

$Title = "What game are we scraping from today?"
$Prompt = "Choose from one of the supported games:"
$Choices = [System.Management.Automation.Host.ChoiceDescription[]] @("Sk&yrimSE", "Fallout&4", "Fallout7&6", "Star&field")
$Choice = $host.UI.PromptForChoice($Title, $Prompt, $Choices, -1) # -1 means no default
switch ($choice) {
    0{  # sse
        $gameId="SkyrimSE"
        $gameRegistryKey = "HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Bethesda Softworks\Skyrim Special Edition"
        $supportsNativeScriptFlag = $false
        $gameScriptsPaths = "Source/Scripts" # Skyrim SE has a different path, probably because of a packing error
    }
    1{  # fo4
        $gameId="Fallout4"
        $gameRegistryKey = "HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Bethesda Softworks\Fallout4"
        $supportsNativeScriptFlag = $true
    }
    2{  # fo76
        $gameId="Fallout76"
        # I cannot verify this myself - $gameRegistryKey = "HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\Bethesda Softworks\Fallout76"
        $supportsNativeScriptFlag = $true
    }
    3{  # sf
        $gameId="Starfield"
        $supportsNativeScriptFlag = $true
    }
}

# Now, get the path of their scripts directory
# Try to find the path of the game from the registry but let them input a different path if the one we generate is not right
$scriptPath = $null

# If Wine is installed, get the path from the default Wine prefix.
if (Get-Command -Name wine -ErrorAction SilentlyContinue) {
    $regResult = wine reg QUERY $gameRegistryKey /v "Installed Path"
    if ($null -ne $regResult) {
        $matchedPath = [Regex]::Match($regResult, "(?<=REG_SZ\s+)\S.*").Value
        $scriptPath = winepath -u $matchedPath
        Write-Host "Found path from Wine: `"$scriptPath`"" -ForegroundColor Cyan
    }
}

# If we couldn't get the path from Wine, try whatever registry .NET can access
if ($null -eq $scriptPath) {
    $scriptPath = Get-ItemProperty -Path $gameRegistryKey -Name "Installed Path" | Select-Object -ExpandProperty "Installed Path"
    Write-Host "Found path from registry: `"$scriptPath`"" -ForegroundColor Cyan
}

$scriptPath = Join-Path -Path $scriptPath -ChildPath "Data/$gameScriptsPaths"
$isScriptPathValid = Test-Path -Path $scriptPath

Write-Host ""
if ($isScriptPathValid) {
    Write-Host "We think your vanilla scripts are located at `"$scriptPath`"" -ForegroundColor Cyan
    Write-Host "If this is correct, simply press enter. If it is not, please provide the correct path."  -ForegroundColor Yellow
    $userProvided = Read-Host "Corrected Path"
} else {
    Write-Host "We could not detect a valid path for your vanilla scripts. Please provide one" -ForegroundColor Red
    $userProvided = Read-Host "Script Path"
}

if ($userProvided -ne "") {
    $scriptPath = $userProvided
}

$isScriptPathValid = Test-Path -Path $scriptPath

while (-not $isScriptPathValid) {
    Write-Host "The path you provided does not exist. Please provide a valid path for your vanilla scripts." -ForegroundColor Red
    $userProvided = Read-Host "Script Path"
    Write-Host "User provided: $userProvided"
    if ($userProvided -ne "") {
        $scriptPath = $userProvided
    }
    $isScriptPathValid = Test-Path -Path ${scriptPath}
}




Write-Host ""
Write-Host "Scraping from $gameId at `"$scriptPath`"" -ForegroundColor Green
Write-Host ""


# Get all .psc files in the scripts directory

$nativeScripts = @()
$errorFiles = @()
$files = Get-ChildItem -Path $scriptPath -Filter "*.psc" -Recurse
foreach ($file in $files) {
    $scriptName = ''
    if ($supportsNativeScriptFlag) {
        $headerMatchContentLineCount = 3
        $headerMatchContent = $(Get-Content $file.FullName -TotalCount $headerMatchContentLineCount) -join "`n"
        $headerMatch = [Regex]::Match($headerMatchContent, "^\s*Scriptname\s+([\S:]+)(\s.*\bNative\b)?", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase  -bor [System.Text.RegularExpressions.RegexOptions]::Multiline)

        while (-not $headerMatch.Success, $headerMatchContentLineCount -lt 50) {
            $headerMatchContentLineCount *= 2
            $headerMatchContent = $(Get-Content $file.FullName -TotalCount $headerMatchContentLineCount) -join "`n"
            $headerMatch = [Regex]::Match($headerMatchContent, "^\s*Scriptname\s+([\S:]+)(\s.*\bNative\b)?", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase  -bor [System.Text.RegularExpressions.RegexOptions]::Multiline)
        }

        if (-not $headerMatch.Success) {
            Write-Host "Could not find Scriptname header in file `"$($file.FullName)`"" -ForegroundColor Yellow
            $errorFiles += $file.FullName
            continue
        }

        $scriptName = $headerMatch.Groups[1].Value

        if (-not $headerMatch.Groups[2].Success) {
            continue
        }
    } else {
        $fileContents = (Get-Content $file.FullName) -join "`n"
        $scriptName = [Regex]::Match($fileContents, "^\s*Scriptname\s+([\S:]+)", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Multiline).Captures[1].Value
        if (-not [Regex]::Match($fileContents, "\sNative\b", [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Success) {
            continue
        }
    }

    Write-Host "Path: $($file.FullName)" -ForegroundColor White
    Write-Host "Discovered native script ${scriptName}" -ForegroundColor Green
    Write-Host ""
    $nativeScripts += @{
        "Path" = $file.FullName
        "FileName" = $file.Name
        "ScriptName" = $scriptName
    }
}

if ($nativeScripts.Count -eq 0) {
    Write-Host "No native scripts found!" -ForegroundColor DarkRed
    exit 1
}


$destinationFolder = "${PSScriptRoot}/../scripts/${gameId}/vanilla/"

if (-not (Test-Path -Path $destinationFolder)) {
    New-Item -ItemType Directory -Path $destinationFolder
}

Write-Host ""
Write-Host ""
Write-Host "Found $($nativeScripts.Count) native scripts. Copying them into the scripts folder..." -ForegroundColor Green
Write-Host ""

foreach ($script in $nativeScripts) {
    $destinationPath = Join-Path -Path $destinationFolder -ChildPath ${script.FileName}
    Copy-Item -Path $script.Path -Destination $destinationPath -Force
    Write-Host "Copied ${script.ScriptName} to ${destinationPath}" -ForegroundColor Cyan
}

if (-not $supportsNativeScriptFlag) {
    Write-Host "This game does NOT support the `Native` script flag. Please verify that all scripts copied are indeed native." -ForegroundColor Red
    Write-Host "Additionally, this script almost certainly missed native scripts without any usages of the `Native` keyword (such as Skyrim's `"Action.psc`" script)." -ForegroundColor DarkRed
}
