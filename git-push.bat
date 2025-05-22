@echo off
echo Starting Git operations...

echo 1. Checking git status...
git status

echo 2. Adding modified files...
git add .github/workflows/ci-cd.yml
git add src/integrations/supabase/client.ts
git add scripts/verify-env.js
git add public/env-test.html
git add package.json

echo 3. Committing changes...
git commit -m "Fix Supabase environment variables issue"

echo 4. Pushing to GitHub...
git push

echo Git operations completed.