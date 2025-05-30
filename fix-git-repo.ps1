# Script to fix Git repository issues
Write-Host "Starting Git repository fix..." -ForegroundColor Green

# 1. Backup nested repository if it exists
if (Test-Path -Path "edueasy-venture-refresh\.git") {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = "backup\nested_repo_$timestamp"
    
    Write-Host "Creating backup directory..." -ForegroundColor Yellow
    New-Item -Path $backupDir -ItemType Directory -Force | Out-Null
    
    Write-Host "Backing up nested repository..." -ForegroundColor Yellow
    Copy-Item -Path "edueasy-venture-refresh\*" -Destination $backupDir -Recurse -Force
    
    Write-Host "Removing nested repository..." -ForegroundColor Yellow
    Remove-Item -Path "edueasy-venture-refresh" -Recurse -Force
}

# 2. Clean any existing Git initialization
if (Test-Path -Path ".git") {
    Write-Host "Removing existing Git repository..." -ForegroundColor Yellow
    Remove-Item -Path ".git" -Recurse -Force
}

# 3. Initialize new Git repository
Write-Host "Initializing new Git repository..." -ForegroundColor Yellow
git init

# 4. Add remote
Write-Host "Adding remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/SeelanGov/edueasy-venture-refresh

# 5. Fetch remote repository
Write-Host "Fetching remote repository..." -ForegroundColor Yellow
git fetch origin

# 6. Create and checkout main branch
Write-Host "Setting up main branch..." -ForegroundColor Yellow
git checkout -b main

# 7. Stage all changes
Write-Host "Staging changes..." -ForegroundColor Yellow
git add .

# 8. Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "feat(ci-cd): implement comprehensive CI/CD pipeline

- Enhanced GitHub Actions workflow with staging and production
- Updated package.json scripts for CI/CD support
- Added comprehensive documentation in docs/ci-cd.md
- Configured Prettier and ESLint for code quality
- Added TypeScript strict mode configurations
- Implemented pre-commit hooks with husky and lint-staged
- Added deployment scripts for staging and production
- Enhanced test configuration and coverage reporting"

# 9. Push to remote
Write-Host "Pushing to remote repository..." -ForegroundColor Yellow
git push -u origin main --force

Write-Host "Git repository fix completed!" -ForegroundColor Green
