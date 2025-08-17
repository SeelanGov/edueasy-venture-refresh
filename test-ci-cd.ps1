# Test CI/CD workflow locally
Write-Host "Testing CI/CD workflow locally..." -ForegroundColor Green

# Load environment variables from .env file
$envFile = ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "Set environment variable: $key" -ForegroundColor Cyan
        }
    }
}

# Run the steps from the CI/CD workflow
Write-Host "`nStep 1: Environment check" -ForegroundColor Yellow
npm run check-env

Write-Host "`nStep 2: Type check" -ForegroundColor Yellow
npm run type-check

Write-Host "`nStep 3: Lint" -ForegroundColor Yellow
npm run lint

Write-Host "`nStep 4: Build" -ForegroundColor Yellow
npm run build

Write-Host "`nCI/CD workflow test completed" -ForegroundColor Green