Write-Host "Resolving merge conflict..." -ForegroundColor Green

Write-Host "1. Adding resolved file..." -ForegroundColor Yellow
git add .github/workflows/ci-cd.yml

Write-Host "2. Committing resolved conflict..." -ForegroundColor Yellow
git commit -m "Resolve merge conflict in CI/CD workflow"

Write-Host "3. Pushing to GitHub..." -ForegroundColor Yellow
git push

Write-Host "Conflict resolution completed." -ForegroundColor Green