# Script to resolve nested repository issue
Write-Host "Resolving nested repository issue..." -ForegroundColor Green

# Check if the nested directory exists
if (Test-Path -Path "edueasy-venture-refresh") {
    Write-Host "Found nested repository at edueasy-venture-refresh" -ForegroundColor Yellow
    
    # Create a backup directory if it doesn't exist
    if (-not (Test-Path -Path "backup")) {
        New-Item -Path "backup" -ItemType Directory | Out-Null
        Write-Host "Created backup directory" -ForegroundColor Cyan
    }
    
    # Create a timestamp for the backup
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = "backup\nested_repo_$timestamp"
    New-Item -Path $backupDir -ItemType Directory | Out-Null
    
    # Copy important files from the nested repository to the backup
    Write-Host "Backing up important files from nested repository..." -ForegroundColor Yellow
    
    # Check if .github/workflows exists in the nested repo
    if (Test-Path -Path "edueasy-venture-refresh\.github\workflows") {
        # Create the directory structure in the backup
        New-Item -Path "$backupDir\.github\workflows" -ItemType Directory -Force | Out-Null
        
        # Copy workflow files
        Copy-Item -Path "edueasy-venture-refresh\.github\workflows\*" -Destination "$backupDir\.github\workflows\" -Recurse
        Write-Host "Backed up workflow files" -ForegroundColor Cyan
    }
    
    # Check for other important directories and files
    $importantDirs = @("src", "public", "scripts", "supabase")
    foreach ($dir in $importantDirs) {
        if (Test-Path -Path "edueasy-venture-refresh\$dir") {
            New-Item -Path "$backupDir\$dir" -ItemType Directory -Force | Out-Null
            Copy-Item -Path "edueasy-venture-refresh\$dir\*" -Destination "$backupDir\$dir\" -Recurse
            Write-Host "Backed up $dir directory" -ForegroundColor Cyan
        }
    }
    
    # Copy important config files
    $configFiles = @("package.json", "tsconfig.json", "vite.config.ts", "tailwind.config.ts")
    foreach ($file in $configFiles) {
        if (Test-Path -Path "edueasy-venture-refresh\$file") {
            Copy-Item -Path "edueasy-venture-refresh\$file" -Destination "$backupDir\"
            Write-Host "Backed up $file" -ForegroundColor Cyan
        }
    }
    
    # Compare the CI/CD workflow files
    if ((Test-Path -Path ".github\workflows\ci-cd.yml") -and (Test-Path -Path "edueasy-venture-refresh\.github\workflows\ci-cd.yml")) {
        Write-Host "`nComparing CI/CD workflow files..." -ForegroundColor Yellow
        
        $mainWorkflow = Get-Content -Path ".github\workflows\ci-cd.yml" -Raw
        $nestedWorkflow = Get-Content -Path "edueasy-venture-refresh\.github\workflows\ci-cd.yml" -Raw
        
        if ($mainWorkflow -ne $nestedWorkflow) {
            Write-Host "The CI/CD workflow files are different!" -ForegroundColor Red
            Write-Host "Please manually review the differences and merge them if needed." -ForegroundColor Red
            
            # Save the differences to a file
            $diffFile = "$backupDir\workflow_diff.txt"
            "Main workflow:" | Out-File -FilePath $diffFile
            $mainWorkflow | Out-File -FilePath $diffFile -Append
            "`n`nNested workflow:" | Out-File -FilePath $diffFile -Append
            $nestedWorkflow | Out-File -FilePath $diffFile -Append
            
            Write-Host "Differences saved to $diffFile" -ForegroundColor Cyan
        } else {
            Write-Host "The CI/CD workflow files are identical." -ForegroundColor Green
        }
    }
    
    # Remove the nested repository
    Write-Host "`nRemoving nested repository..." -ForegroundColor Yellow
    Remove-Item -Path "edueasy-venture-refresh" -Recurse -Force
    Write-Host "Nested repository removed" -ForegroundColor Green
    
    Write-Host "`nNested repository issue resolved!" -ForegroundColor Green
    Write-Host "Important files have been backed up to $backupDir" -ForegroundColor Green
    Write-Host "Please review the backup and ensure all necessary files are preserved." -ForegroundColor Yellow
} else {
    Write-Host "No nested repository found at edueasy-venture-refresh" -ForegroundColor Green
}