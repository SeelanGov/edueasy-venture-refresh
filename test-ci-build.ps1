# Script to test the CI/CD build process locally
Write-Host "Testing CI/CD build process locally..." -ForegroundColor Green

# Set environment variables
$env:CI = "true"
$env:ROLLUP_SKIP_PLATFORM_SPECIFIC = "true"

# Load environment variables from .env file
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "Set environment variable: $key" -ForegroundColor Cyan
        }
    }
}

# Clean install
Write-Host "`nStep 1: Clean install" -ForegroundColor Yellow
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
npm install

# Fix Rollup dependencies
Write-Host "`nStep 2: Fix Rollup dependencies" -ForegroundColor Yellow
node scripts/fix-rollup-deps.js

# Environment check
Write-Host "`nStep 3: Environment check" -ForegroundColor Yellow
npm run check-env

# Type check
Write-Host "`nStep 4: Type check" -ForegroundColor Yellow
npm run type-check

# Lint
Write-Host "`nStep 5: Lint" -ForegroundColor Yellow
npm run lint

# Build with fallback
Write-Host "`nStep 6: Build with fallback" -ForegroundColor Yellow
try {
    Write-Host "Attempting build with standard configuration..." -ForegroundColor Cyan
    npm run build
} catch {
    Write-Host "Standard build failed, trying CI-specific build configuration..." -ForegroundColor Yellow
    $env:NODE_OPTIONS = "--max-old-space-size=4096"
    
    # Add CI-specific build script if it doesn't exist
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    if (-not $packageJson.scripts."build:ci") {
        $packageJson.scripts | Add-Member -Name "build:ci" -Value "vite build --config vite.config.ci.ts" -MemberType NoteProperty
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
        Write-Host "Added build:ci script to package.json" -ForegroundColor Cyan
    }
    
    try {
        npm run build:ci
    } catch {
        Write-Host "CI-specific build failed, trying safe build..." -ForegroundColor Yellow
        npm run build:safe
    }
}

Write-Host "`nCI/CD build test completed" -ForegroundColor Green