$ErrorActionPreference = 'Continue'
$VerbosePreference = 'Continue'

# Function to run Git commands and display output immediately
function Invoke-GitCommand {
    param(
        [string]$Command,
        [string]$Description
    )
    Write-Host "`n>>> $Description" -ForegroundColor Yellow
    $output = & powershell.exe -NoProfile -NonInteractive -Command $Command 2>&1
    $output | ForEach-Object { Write-Host $_ }
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Command failed with exit code $LASTEXITCODE" -ForegroundColor Red
        return $false
    }
    return $true
}

# Change to the correct directory
Set-Location "c:\Users\SEELANGOV\Desktop\UBE Group\EduEasy\005.Project Management file\002.Design Brief\outputs\edueasy-venture-refresh"

# Test Git commands with immediate output
Invoke-GitCommand -Command "git status" -Description "Checking Git status"
Invoke-GitCommand -Command "git remote -v" -Description "Checking Git remotes"

Write-Host "`nTerminal test completed. If you see Git command outputs above, the terminal is working correctly." -ForegroundColor Green
