# PowerShell script to deploy EduEasy to production
param (
    [string]$ServerUser = $env:PRODUCTION_SERVER_USER,
    [string]$ServerIP = $env:PRODUCTION_SERVER_IP,
    [string]$ServerPath = $env:PRODUCTION_SERVER_PATH
)

# Validate parameters
if (-not $ServerUser -or -not $ServerIP -or -not $ServerPath) {
    Write-Error "Missing required parameters. Please provide ServerUser, ServerIP, and ServerPath."
    Write-Error "Usage: ./deploy-production.ps1 -ServerUser user -ServerIP 192.168.1.1 -ServerPath /var/www/edueasy"
    exit 1
}

Write-Host "Building project for production..."
npm run build

Write-Host "Running tests..."
npm test

Write-Host "Deploying to production server at $ServerIP..."

# Check if we're on Windows or Unix-like system
if ($IsWindows -or $env:OS -match "Windows") {
    # For Windows, use scp
    Write-Host "Using SCP for Windows deployment..."
    
    # Ensure dist directory exists
    if (-not (Test-Path -Path "dist")) {
        Write-Error "Build directory 'dist' not found. Build may have failed."
        exit 1
    }
    
    # Create a temporary script to run the scp command
    $tempScript = [System.IO.Path]::GetTempFileName() + ".ps1"
    
    # Write the scp command to the temporary script
    @"
    # SCP the files to the server
    scp -r dist/* ${ServerUser}@${ServerIP}:${ServerPath}
"@ | Out-File -FilePath $tempScript
    
    # Execute the temporary script
    & $tempScript
    
    # Remove the temporary script
    Remove-Item -Path $tempScript -Force
} else {
    # For Unix-like systems, use rsync
    Write-Host "Using rsync for Unix-like deployment..."
    rsync -avz --delete dist/ ${ServerUser}@${ServerIP}:${ServerPath}
}

# Notify deployment completion
Write-Host "Production deployment complete."
Write-Host "Application is now live at https://edueasy.com"
