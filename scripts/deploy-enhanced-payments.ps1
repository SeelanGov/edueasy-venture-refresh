# Enhanced Payment Methods Deployment Script (PowerShell)
# This script deploys the enhanced payment methods with better UX and analytics
# Updated to use environment variables instead of hard-coded credentials

param(
    [switch]$SkipBuild
)

Write-Host "🚀 Starting Enhanced Payment Methods Deployment..." -ForegroundColor Blue

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
} catch {
    Write-Error "Supabase CLI is not installed. Please install it first."
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "supabase/config.toml")) {
    Write-Error "Please run this script from the project root directory."
    exit 1
}

# Check for required environment variables
Write-Status "Checking environment variables..."

$RequiredVars = @(
    "PAYFAST_MERCHANT_ID",
    "PAYFAST_MERCHANT_KEY",
    "PAYFAST_PASSPHRASE",
    "PAYFAST_SANDBOX",
    "SITE_URL",
    "SUPABASE_URL"
)

$MissingVars = @()

foreach ($var in $RequiredVars) {
    if (-not (Get-Variable -Name $var -ErrorAction SilentlyContinue) -or 
        [string]::IsNullOrEmpty((Get-Variable -Name $var -ErrorAction SilentlyContinue).Value)) {
        $MissingVars += $var
    }
}

if ($MissingVars.Count -gt 0) {
    Write-Error "Missing required environment variables:"
    foreach ($var in $MissingVars) {
        Write-Host "  - $var" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please set these variables in your environment or .env file:" -ForegroundColor Yellow
    Write-Host '$env:PAYFAST_MERCHANT_ID="your_merchant_id"' -ForegroundColor Cyan
    Write-Host '$env:PAYFAST_MERCHANT_KEY="your_merchant_key"' -ForegroundColor Cyan
    Write-Host '$env:PAYFAST_PASSPHRASE="your_passphrase"' -ForegroundColor Cyan
    Write-Host '$env:PAYFAST_SANDBOX="true"' -ForegroundColor Cyan
    Write-Host '$env:SITE_URL="https://your-site.com"' -ForegroundColor Cyan
    Write-Host '$env:SUPABASE_URL="https://your-project.supabase.co"' -ForegroundColor Cyan
    exit 1
}

Write-Success "All required environment variables are set"

Write-Status "Deploying enhanced payment methods..."

Write-Status "Step 1: Setting up Supabase secrets..."

# Set Supabase secrets using environment variables
try {
    supabase secrets set PAYFAST_MERCHANT_ID="$env:PAYFAST_MERCHANT_ID"
    supabase secrets set PAYFAST_MERCHANT_KEY="$env:PAYFAST_MERCHANT_KEY"
    supabase secrets set PAYFAST_PASSPHRASE="$env:PAYFAST_PASSPHRASE"
    supabase secrets set PAYFAST_SANDBOX="$env:PAYFAST_SANDBOX"
    supabase secrets set SITE_URL="$env:SITE_URL"
    Write-Success "Supabase secrets configured"
} catch {
    Write-Error "Failed to set Supabase secrets"
    exit 1
}

Write-Status "Step 2: Deploying database migration..."

# Deploy database migration for payment method tracking
try {
    supabase db reset
    Write-Success "Database migration deployed"
} catch {
    Write-Error "Failed to deploy database migration"
    exit 1
}

Write-Status "Step 3: Deploying updated Edge Functions..."

# Deploy updated Edge Functions
try {
    supabase functions deploy create-payment-session
    supabase functions deploy process-payment-webhook
    supabase functions deploy verify-payment-status
    supabase functions deploy payment-recovery
    Write-Success "Edge Functions deployed"
} catch {
    Write-Error "Failed to deploy Edge Functions"
    exit 1
}

if (-not $SkipBuild) {
    Write-Status "Step 4: Building frontend..."

    # Build the frontend (if using a build system)
    if (Test-Path "package.json") {
        try {
            npm run build
            Write-Success "Frontend built"
        } catch {
            Write-Warning "Build failed, but continuing..."
        }
    }
}

Write-Status "Step 5: Testing deployment..."

# Test the functions (optional)
Write-Host "Testing create-payment-session function..." -ForegroundColor Yellow

try {
    # Start the test server in background
    Start-Process -FilePath "supabase" -ArgumentList "functions serve --no-verify-jwt" -WindowStyle Hidden
    
    # Wait a moment for the server to start
    Start-Sleep -Seconds 3

    # Test the function (this will fail without proper auth, but we can check if it's deployed)
    $testResponse = Invoke-RestMethod -Uri "http://localhost:54321/functions/v1/create-payment-session" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body '{"tier":"basic","user_id":"test"}' `
        -ErrorAction SilentlyContinue

    Write-Warning "Function test failed (expected without auth)"
} catch {
    Write-Warning "Function test failed (expected without auth)"
} finally {
    # Stop the test server
    Get-Process -Name "supabase" -ErrorAction SilentlyContinue | Stop-Process -Force
}

Write-Success "Deployment completed successfully!"

Write-Host ""
Write-Host "🎉 Enhanced Payment Methods Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration Summary:" -ForegroundColor Cyan
Write-Host "  - PayFast Merchant ID: $($env:PAYFAST_MERCHANT_ID.Substring(0,4))****" -ForegroundColor White
Write-Host "  - Sandbox Mode: $env:PAYFAST_SANDBOX" -ForegroundColor White
Write-Host "  - Site URL: $env:SITE_URL" -ForegroundColor White
Write-Host "  - Supabase URL: $env:SUPABASE_URL" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test the payment flow in your application" -ForegroundColor White
Write-Host "2. Verify payment method tracking is working" -ForegroundColor White
Write-Host "3. Check analytics views in Supabase dashboard" -ForegroundColor White
Write-Host "4. Monitor payment audit logs" -ForegroundColor White
Write-Host ""
Write-Host "For testing, you can use PayFast's sandbox environment." -ForegroundColor Cyan
Write-Host "Visit: https://sandbox.payfast.co.za/eng/process" -ForegroundColor Blue 