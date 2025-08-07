Write-Host "🚀 Executing Deployment Recovery..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Starting deployment recovery process..." -ForegroundColor Yellow

try {
    node scripts/execute-deployment-recovery.js
    Write-Host ""
    Write-Host "✅ Deployment recovery execution completed successfully!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "❌ Deployment recovery execution failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 