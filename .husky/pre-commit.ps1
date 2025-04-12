#!/usr/bin/pwsh

Write-Host "Running pre-commit hook..."

Write-Host "Checking for staged changes to Papyrus files..."
$stagedFiles = git diff --cached --name-only --diff-filter=ACM | Where-Object { $_ -match '\.psc$' }
if ($stagedFiles.Count -ne 0) {
    Write-Host "Papyrus files detected. Checking for unstaged Papyrus changes..."
    $unstagedFiles = git diff --name-only --diff-filter=ACM | Where-Object { $_ -match '\.psc$' }
    if ($unstagedFiles.Count -ne 0) {
        Write-Host "Unstaged Papyrus changes detected. Please stage all changes before committing."
        exit 1;
    }

    Write-Host "Masking Papyrus function implementations with Guard() statements..."

    pnpm run guard-papyrus-logic
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Masking Papyrus function implementations with Guard() failed. Please fix the errors and try again."
        exit $LASTEXITCODE
    }

    Write-Host "Successfully masked Papyrus function implementations with Guard() statements. Staging new changes..."
    git add $stagedFiles
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to stage new changes. Please fix the errors and try again."
        exit $LASTEXITCODE
    }

    Write-Host "Successfully staged new changes."
    exit 0;
}
