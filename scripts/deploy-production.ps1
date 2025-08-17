# PowerShell script to deploy EduEasy to production
param (
    [string]$ServerUser = $env:PRODUCTION_SERVER_USER,
    [string]$ServerIP = $env:PRODUCTION_SERVER_IP,
    [string]$ServerPath = $env:PRODUCTION_SERVER_PATH
)

# Validate parameters
if (-not $ServerUser -or -not $ServerIP -or -not $ServerPath) {
    Write-Host "Missing required parameters. Using default values or environment variables." -ForegroundColor Yellow
    Write-Host "For manual deployment, use: ./deploy-production.ps1 -ServerUser user -ServerIP 192.168.1.1 -ServerPath /var/www/edueasy" -ForegroundColor Yellow
}

Write-Host "Building project for production..." -ForegroundColor Cyan
npm run build

Write-Host "Running tests..." -ForegroundColor Cyan
npm test

Write-Host "Deploying to production server..." -ForegroundColor Cyan

# Check if we have deployment parameters
if ($ServerUser -and $ServerIP -and $ServerPath) {
    # Check if we're on Windows or Unix-like system
    if ($IsWindows -or $env:OS -match "Windows") {
        # For Windows, use scp
        Write-Host "Using SCP for Windows deployment..." -ForegroundColor Cyan
        
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
        Write-Host "Using rsync for Unix-like deployment..." -ForegroundColor Cyan
        rsync -avz --delete dist/ ${ServerUser}@${ServerIP}:${ServerPath}
    }
    
    Write-Host "Production deployment complete." -ForegroundColor Green
    Write-Host "Application is now live at https://edueasy.com" -ForegroundColor Green
} else {
    Write-Host "Deployment skipped. Missing server information." -ForegroundColor Yellow
    Write-Host "To deploy manually, set the following environment variables:" -ForegroundColor Yellow
    Write-Host "  PRODUCTION_SERVER_USER - SSH username for the production server" -ForegroundColor Yellow
    Write-Host "  PRODUCTION_SERVER_IP - IP address of the production server" -ForegroundColor Yellow
    Write-Host "  PRODUCTION_SERVER_PATH - Path on the production server to deploy to" -ForegroundColor Yellow
    Write-Host "Or use the script parameters as shown above." -ForegroundColor Yellow
}
