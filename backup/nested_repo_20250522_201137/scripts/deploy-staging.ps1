# PowerShell script to deploy EduEasy to staging

Write-Host "Building project..."
npm run build

Write-Host "Running tests..."
npm test

Write-Host "Deploying to staging server..."
# TODO: Add your deployment command here, e.g., rsync, scp, or cloud CLI
# Example: scp -r dist/* user@staging-server:/var/www/edueasy-staging

Write-Host "Staging deployment complete."
