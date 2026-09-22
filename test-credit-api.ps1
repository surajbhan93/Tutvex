# Test Credit API Endpoints
# Usage: .\test-credit-api.ps1

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Testing Credit API Endpoints" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Get auth token from .env.local
$envFile = ".\tutoredge-frontend\.env.local"
if (Test-Path $envFile) {
    Write-Host "Reading environment file..." -ForegroundColor Yellow
} else {
    Write-Host "Error: .env.local not found!" -ForegroundColor Red
    exit 1
}

# Prompt for auth token
Write-Host ""
Write-Host "Please provide your JWT token:" -ForegroundColor Yellow
Write-Host "(Login to the app, open browser DevTools > Application > Local Storage > Look for 'token')" -ForegroundColor Gray
$token = Read-Host "Token"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "Error: Token required!" -ForegroundColor Red
    exit 1
}

$baseUrl = "http://localhost:3001"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Test 1: GET /wallet/credits" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/wallet/credits" -Method Get -Headers $headers
    Write-Host "Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 5
    Write-Host ""
    Write-Host "✅ Available Credits: $($response.data.availableCredits)" -ForegroundColor Green
    Write-Host "✅ Free Credits: $($response.data.freeCreditsAvailable)/$($response.data.freeCreditsTotal)" -ForegroundColor Green
    Write-Host "✅ Purchased Credits: $($response.data.purchasedCreditsAvailable)" -ForegroundColor Green
    Write-Host "✅ Used Credits: $($response.data.usedCredits)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Test 2: GET /wallet/summary" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/wallet/summary" -Method Get -Headers $headers
    Write-Host "Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 5
    Write-Host ""
    Write-Host "✅ Available Credits: $($response.data.credits.availableCredits)" -ForegroundColor Green
    Write-Host "✅ Free Credits: $($response.data.credits.freeCreditsAvailable)/$($response.data.credits.freeCreditsTotal)" -ForegroundColor Green
    Write-Host "✅ Purchased Credits: $($response.data.credits.purchasedCreditsAvailable)" -ForegroundColor Green
    Write-Host "✅ Used Credits: $($response.data.credits.usedCredits)" -ForegroundColor Green
    Write-Host "✅ Wallet Balance: ₹$($response.data.wallet.availableBalance)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Restart backend server if not auto-reloading" -ForegroundColor White
Write-Host "2. Refresh browser at /tutor/dashboard" -ForegroundColor White
Write-Host "3. Check credit display shows correct values" -ForegroundColor White
Write-Host ""
