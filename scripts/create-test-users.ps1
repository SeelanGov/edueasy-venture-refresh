# EduEasy Test User Creation Script (PowerShell)
# This script creates test users for all roles in the system

param(
    [string]$ServiceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY
)

Write-Host "🚀 Creating EduEasy Test Users..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Supabase project configuration
$SUPABASE_URL = "https://pensvamtfjtpsaoeflbx.supabase.co"

# Check if service role key is provided
if ([string]::IsNullOrEmpty($ServiceRoleKey)) {
    Write-Host "❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required" -ForegroundColor Red
    Write-Host "Please set it with: `$env:SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To get your service role key:" -ForegroundColor Yellow
    Write-Host "1. Go to https://supabase.com/dashboard/project/pensvamtfjtpsaoeflbx/settings/api" -ForegroundColor Cyan
    Write-Host "2. Copy the 'service_role' key (not the anon key)" -ForegroundColor Cyan
    exit 1
}

# Function to create a user
function Create-User {
    param(
        [string]$Email,
        [string]$Role,
        [string]$DisplayName
    )
    
    Write-Host "📧 Creating $DisplayName: $Email" -ForegroundColor Cyan
    
    $body = @{
        email = $Email
        password = "Test1234!"
        email_confirm = $true
        user_metadata = @{
            role = $Role
            display_name = $DisplayName
        }
    } | ConvertTo-Json -Depth 3
    
    try {
        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users" `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $ServiceRoleKey"
                "Content-Type" = "application/json"
            } `
            -Body $body
        
        Write-Host "✅ $DisplayName created successfully" -ForegroundColor Green
        Write-Host "   Email: $Email" -ForegroundColor Gray
        Write-Host "   Password: Test1234!" -ForegroundColor Gray
        Write-Host "   Role: $Role" -ForegroundColor Gray
    }
    catch {
        Write-Host "❌ Failed to create $DisplayName" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Create test users for all roles
Write-Host "👥 Creating test users for all roles..." -ForegroundColor Yellow
Write-Host ""

Create-User -Email "admin@edueasy.co" -Role "admin" -DisplayName "System Administrator"
Create-User -Email "student@edueasy.co" -Role "student" -DisplayName "Test Student"
Create-User -Email "sponsor@edueasy.co" -Role "sponsor" -DisplayName "Test Sponsor"
Create-User -Email "institution@edueasy.co" -Role "institution" -DisplayName "Test Institution"
Create-User -Email "counselor@edueasy.co" -Role "counselor" -DisplayName "Test Counselor"
Create-User -Email "nsfas@edueasy.co" -Role "nsfas" -DisplayName "Test NSFAS"

Write-Host "🎉 Test user creation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Login Credentials Summary:" -ForegroundColor Yellow
Write-Host "==============================" -ForegroundColor Yellow
Write-Host "All users use password: Test1234!" -ForegroundColor White
Write-Host ""
Write-Host "👨‍💼 Admin: admin@edueasy.co" -ForegroundColor Cyan
Write-Host "👨‍🎓 Student: student@edueasy.co" -ForegroundColor Cyan
Write-Host "💰 Sponsor: sponsor@edueasy.co" -ForegroundColor Cyan
Write-Host "🏫 Institution: institution@edueasy.co" -ForegroundColor Cyan
Write-Host "👨‍🏫 Counselor: counselor@edueasy.co" -ForegroundColor Cyan
Write-Host "🏛️ NSFAS: nsfas@edueasy.co" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔗 Login URL: http://localhost:3000/login" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Important Notes:" -ForegroundColor Yellow
Write-Host "- These are test users only" -ForegroundColor Gray
Write-Host "- Change passwords in production" -ForegroundColor Gray
Write-Host "- Users are created with email confirmation bypassed" -ForegroundColor Gray
Write-Host "- Check Supabase Auth logs to verify creation" -ForegroundColor Gray 