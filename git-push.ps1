Write-Host "Starting Git operations..." -ForegroundColor Green

Write-Host "1. Checking git status..." -ForegroundColor Yellow
git status

Write-Host "2. Pulling latest changes from remote..." -ForegroundColor Yellow
git pull

Write-Host "3. Adding modified files..." -ForegroundColor Yellow
git add .github/workflows/ci-cd.yml
git add src/integrations/supabase/client.ts
git add scripts/verify-env.js
git add public/env-test.html
git add package.json

Write-Host "4. Committing changes..." -ForegroundColor Yellow
git commit -m "Fix Supabase environment variables issue"

Write-Host "5. Pushing to GitHub..." -ForegroundColor Yellow
git push

Write-Host "Git operations completed." -ForegroundColor Green