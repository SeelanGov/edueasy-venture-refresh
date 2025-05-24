# PowerShell script to check GitHub Actions workflow status
param (
    [string]$RepoOwner = "SeelanGov",
    [string]$RepoName = "edueasy-venture-refresh",
    [string]$WorkflowName = "CI/CD",
    [string]$Branch = "main",
    [string]$GithubToken = $env:GITHUB_TOKEN
)

# Validate parameters
if (-not $RepoOwner -or -not $RepoName) {
    Write-Error "Missing required parameters. Please provide RepoOwner and RepoName."
    Write-Error "Usage: ./check-ci-status.ps1 -RepoOwner owner -RepoName repo -WorkflowName 'CI/CD' -Branch main"
    exit 1
}

Write-Host "Checking CI/CD status for $RepoOwner/$RepoName on branch $Branch..." -ForegroundColor Cyan

# Build the API URL
$apiUrl = "https://api.github.com/repos/$RepoOwner/$RepoName/actions/workflows"

# Set headers
$headers = @{
    "Accept" = "application/vnd.github.v3+json"
}

# Add authorization if token is provided
if ($GithubToken) {
    $headers["Authorization"] = "token $GithubToken"
}

try {
    # Get all workflows
    $response = Invoke-RestMethod -Uri $apiUrl -Headers $headers -Method Get

    # Find the specified workflow
    $workflow = $response.workflows | Where-Object { $_.name -eq $WorkflowName }
    
    if (-not $workflow) {
        Write-Error "Workflow '$WorkflowName' not found."
        exit 1
    }
    
    # Get the runs for this workflow
    $runsUrl = $workflow.url + "/runs?branch=$Branch&per_page=5"
    $runsResponse = Invoke-RestMethod -Uri $runsUrl -Headers $headers -Method Get
    
    # Display the results
    Write-Host "`nLatest CI/CD Runs for $WorkflowName on branch $Branch:`n" -ForegroundColor Cyan
    
    $runsResponse.workflow_runs | ForEach-Object {
        $statusColor = switch ($_.conclusion) {
            "success" { "Green" }
            "failure" { "Red" }
            "cancelled" { "Yellow" }
            "skipped" { "Gray" }
            default { "White" }
        }
        
        Write-Host "Run #$($_.run_number) - $($_.created_at)" -ForegroundColor White
        Write-Host "Status: $($_.status) - $($_.conclusion)" -ForegroundColor $statusColor
        Write-Host "Triggered by: $($_.actor.login)" -ForegroundColor White
        Write-Host "URL: $($_.html_url)" -ForegroundColor Blue
        Write-Host ""
    }
    
    # Check if the latest run was successful
    $latestRun = $runsResponse.workflow_runs | Select-Object -First 1
    
    if ($latestRun.conclusion -eq "success") {
        Write-Host "✅ Latest CI/CD run was successful!" -ForegroundColor Green
    } elseif ($latestRun.conclusion -eq "failure") {
        Write-Host "❌ Latest CI/CD run failed. Please check the logs." -ForegroundColor Red
    } elseif ($latestRun.status -eq "in_progress") {
        Write-Host "⏳ CI/CD is currently running..." -ForegroundColor Yellow
    } else {
        Write-Host "⚠️ CI/CD status: $($latestRun.status) - $($latestRun.conclusion)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Error "Error checking CI/CD status: $_"
    exit 1
}