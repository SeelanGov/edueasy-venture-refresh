# PowerShell script to deploy EduEasy to production

Write-Host "Building project..."
npm run build

Write-Host "Running tests..."
npm test

Write-Host "Deploying to production server..."
# TODO: Add your deployment command here, e.g., rsync, scp, or cloud CLI
# Example: scp -r dist/* user@production-server:/var/www/edueasy

Write-Host "Production deployment complete."
