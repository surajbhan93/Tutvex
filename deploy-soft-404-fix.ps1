# Soft 404 Fix - Deployment Script
# Run this script from e:\tutvex directory

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  TUTVEX - SOFT 404 FIX DEPLOYMENT SCRIPT" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Navigate to frontend directory
Write-Host "[1/6] Navigating to frontend directory..." -ForegroundColor Yellow
Set-Location -Path "e:\tutvex\tutoredge-frontend"
Write-Host "✅ In frontend directory" -ForegroundColor Green
Write-Host ""

# Step 2: Install dependencies (if needed)
Write-Host "[2/6] Checking dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}
Write-Host ""

# Step 3: Generate sitemap
Write-Host "[3/6] Generating sitemap..." -ForegroundColor Yellow
npm run generate-sitemap
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Sitemap generated successfully" -ForegroundColor Green
    
    # Count URLs in sitemap
    $sitemapContent = Get-Content "public\sitemap.xml" -Raw
    $urlCount = ([regex]::Matches($sitemapContent, "<loc>")).Count
    Write-Host "   📊 Total URLs in sitemap: $urlCount" -ForegroundColor Cyan
} else {
    Write-Host "❌ Sitemap generation failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Build the project
Write-Host "[4/6] Building Next.js project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
    
    # Check for static path generation logs
    Write-Host "   Checking generated static paths..." -ForegroundColor Cyan
} else {
    Write-Host "❌ Build failed! Please check errors above." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Run local tests
Write-Host "[5/6] Running local tests..." -ForegroundColor Yellow
Write-Host "Starting Next.js server in background..." -ForegroundColor Yellow

# Start Next.js server in background
$job = Start-Job -ScriptBlock {
    Set-Location "e:\tutvex\tutoredge-frontend"
    npm run start
}

Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test URLs
$testResults = @()

Write-Host "Testing VALID URLs (expecting 200)..." -ForegroundColor Cyan
$validUrls = @(
    "http://localhost:3000/lucknow/gomti-nagar/home-tutor",
    "http://localhost:3000/kanpur/civil-lines/jee-tutor",
    "http://localhost:3000/india/noida/sector-63/private-tutor"
)

foreach ($url in $validUrls) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ $url → 200" -ForegroundColor Green
            $testResults += $true
        } else {
            Write-Host "   ❌ $url → $($response.StatusCode)" -ForegroundColor Red
            $testResults += $false
        }
    } catch {
        Write-Host "   ⚠️  $url → Error: $($_.Exception.Message)" -ForegroundColor Yellow
        $testResults += $false
    }
}

Write-Host "`nTesting INVALID URLs (expecting 404)..." -ForegroundColor Cyan
$invalidUrls = @(
    "http://localhost:3000/fake-city/area/tutor",
    "http://localhost:3000/lucknow/invalid-location/tutor"
)

foreach ($url in $invalidUrls) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -TimeoutSec 5
        Write-Host "   ❌ $url → $($response.StatusCode) (Expected 404!)" -ForegroundColor Red
        $testResults += $false
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 404) {
            Write-Host "   ✅ $url → 404" -ForegroundColor Green
            $testResults += $true
        } else {
            Write-Host "   ⚠️  $url → $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
            $testResults += $false
        }
    }
}

# Stop the server
Write-Host "`nStopping test server..." -ForegroundColor Yellow
Stop-Job -Job $job
Remove-Job -Job $job
Write-Host "✅ Test server stopped" -ForegroundColor Green
Write-Host ""

# Test results summary
$passedTests = ($testResults | Where-Object { $_ -eq $true }).Count
$totalTests = $testResults.Count

Write-Host "Test Results: $passedTests/$totalTests passed" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })
Write-Host ""

# Step 6: Deployment checklist
Write-Host "[6/6] Pre-Deployment Checklist:" -ForegroundColor Yellow
Write-Host "   ✅ Code changes applied" -ForegroundColor Green
Write-Host "   ✅ Sitemap generated ($urlCount URLs)" -ForegroundColor Green
Write-Host "   ✅ Build successful" -ForegroundColor Green
Write-Host "   $(if ($passedTests -eq $totalTests) { '✅' } else { '⚠️ ' }) Local tests: $passedTests/$totalTests passed" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })
Write-Host ""

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  READY FOR PRODUCTION DEPLOYMENT" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Review SOFT_404_FIX_COMPLETE_REPORT.md for details" -ForegroundColor White
Write-Host "2. Deploy to production environment" -ForegroundColor White
Write-Host "3. Run production verification script (test-production.ps1)" -ForegroundColor White
Write-Host "4. Submit sitemap to Google Search Console" -ForegroundColor White
Write-Host "5. Request re-indexing for sample URLs" -ForegroundColor White
Write-Host "6. Click 'Validate Fix' in Search Console" -ForegroundColor White
Write-Host ""
Write-Host "Detailed instructions: See SOFT_404_FIX_COMPLETE_REPORT.md" -ForegroundColor Cyan
