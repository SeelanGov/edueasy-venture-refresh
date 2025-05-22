# Script to push changes to GitHub
param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

Write-Host "Pushing changes to GitHub..." -ForegroundColor Green

# Check if there are any changes
git status

# Add all changes
Write-Host "`nAdding all changes..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "`nCommitting changes..." -ForegroundColor Yellow
git commit -m "$CommitMessage"

# Push changes
Write-Host "`nPushing changes to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`nChanges pushed to GitHub successfully!" -ForegroundColor Green