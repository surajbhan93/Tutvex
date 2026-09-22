# Production Testing Script - Soft 404 Fix Verification
# Run this script AFTER deploying to production

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  TUTVEX - PRODUCTION VERIFICATION SCRIPT" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$domain = "tutvex.com"
$protocol = "https"
$baseUrl = "$protocol`://$domain"

Write-Host "Testing domain: $baseUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Valid URLs should return 200
Write-Host "[TEST 1] Valid URLs (expecting HTTP 200)" -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────────" -ForegroundColor Gray

$validUrls = @(
    "/lucknow/gomti-nagar/home-tutor",
    "/lucknow/hazratganj/jee-tutor",
    "/kanpur/civil-lines/private-tutor",
    "/kanpur/kakadeo/maths-tutor",
    "/india/noida/sector-63/one-to-one-tuition",
    "/india/noida/sector-18/private-tutor",
    "/india/agra/civil-lines/home-teacher",
    "/india/banaras/mahmoorganj/math-tutor",
    "/country/india/home-tutor",
    "/country/uk/gcse-tutor-uk"
)

$validTestResults = @()

foreach ($path in $validUrls) {
    $url = "$baseUrl$path"
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ " -NoNewline -ForegroundColor Green
            Write-Host "$path" -ForegroundColor White
            Write-Host "   Status: 200 OK" -ForegroundColor Gray
            $validTestResults += $true
        } else {
            Write-Host "❌ " -NoNewline -ForegroundColor Red
            Write-Host "$path" -ForegroundColor White
            Write-Host "   Status: $($response.StatusCode) (Expected 200!)" -ForegroundColor Red
            $validTestResults += $false
        }
    } catch {
        Write-Host "❌ " -NoNewline -ForegroundColor Red
        Write-Host "$path" -ForegroundColor White
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        $validTestResults += $false
    }
    Write-Host ""
}

# Test 2: Invalid URLs should return 404
Write-Host "[TEST 2] Invalid URLs (expecting HTTP 404)" -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────────" -ForegroundColor Gray

$invalidUrls = @(
    "/fake-city/invalid-location/tutor",
    "/lucknow/nonexistent-area/home-tutor",
    "/kanpur/fake-location/jee-tutor",
    "/india/noida/invalid-sector-999/tutor",
    "/india/invalid-city/area/tutor",
    "/country/invalid-country/service"
)

$invalidTestResults = @()

foreach ($path in $invalidUrls) {
    $url = "$baseUrl$path"
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -TimeoutSec 10
        Write-Host "❌ " -NoNewline -ForegroundColor Red
        Write-Host "$path" -ForegroundColor White
        Write-Host "   Status: $($response.StatusCode) (Expected 404!)" -ForegroundColor Red
        $invalidTestResults += $false
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 404) {
            Write-Host "✅ " -NoNewline -ForegroundColor Green
            Write-Host "$path" -ForegroundColor White
            Write-Host "   Status: 404 Not Found" -ForegroundColor Gray
            $invalidTestResults += $true
        } else {
            Write-Host "⚠️  " -NoNewline -ForegroundColor Yellow
            Write-Host "$path" -ForegroundColor White
            Write-Host "   Status: $($_.Exception.Response.StatusCode.value__) (Expected 404)" -ForegroundColor Yellow
            $invalidTestResults += $false
        }
    }
    Write-Host ""
}

# Test 3: Check canonical URLs
Write-Host "[TEST 3] Canonical URL Verification" -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────────" -ForegroundColor Gray

$canonicalTests = @(
    "/lucknow/gomti-nagar/home-tutor",
    "/india/noida/sector-63/private-tutor"
)

$canonicalTestResults = @()

foreach ($path in $canonicalTests) {
    $url = "$baseUrl$path"
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        $content = $response.Content
        
        # Extract canonical URL
        if ($content -match 'rel="canonical"\s+href="([^"]+)"') {
            $canonical = $matches[1]
            $expectedCanonical = $url
            
            if ($canonical -eq $expectedCanonical) {
                Write-Host "✅ " -NoNewline -ForegroundColor Green
                Write-Host "$path" -ForegroundColor White
                Write-Host "   Canonical: $canonical" -ForegroundColor Gray
                $canonicalTestResults += $true
            } else {
                Write-Host "❌ " -NoNewline -ForegroundColor Red
                Write-Host "$path" -ForegroundColor White
                Write-Host "   Expected: $expectedCanonical" -ForegroundColor Red
                Write-Host "   Found: $canonical" -ForegroundColor Yellow
                $canonicalTestResults += $false
            }
        } else {
            Write-Host "⚠️  " -NoNewline -ForegroundColor Yellow
            Write-Host "$path" -ForegroundColor White
            Write-Host "   No canonical URL found!" -ForegroundColor Yellow
            $canonicalTestResults += $false
        }
    } catch {
        Write-Host "❌ " -NoNewline -ForegroundColor Red
        Write-Host "$path" -ForegroundColor White
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        $canonicalTestResults += $false
    }
    Write-Host ""
}

# Test 4: Sitemap verification
Write-Host "[TEST 4] Sitemap Verification" -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────────" -ForegroundColor Gray

$sitemapUrl = "$baseUrl/sitemap.xml"
$sitemapTestResult = $false

try {
    $response = Invoke-WebRequest -Uri $sitemapUrl -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        $sitemapContent = $response.Content
        $urlCount = ([regex]::Matches($sitemapContent, "<loc>")).Count
        
        Write-Host "✅ Sitemap accessible" -ForegroundColor Green
        Write-Host "   URL: $sitemapUrl" -ForegroundColor Gray
        Write-Host "   Total URLs: $urlCount" -ForegroundColor Cyan
        Write-Host "   Status: HTTP 200 OK" -ForegroundColor Gray
        
        # Check if sitemap contains tutvex.com URLs
        if ($sitemapContent -match "tutvex\.com") {
            Write-Host "   ✅ Contains tutvex.com URLs" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Does not contain tutvex.com URLs!" -ForegroundColor Yellow
        }
        
        # Check if sitemap contains invalid URLs (should not)
        if ($sitemapContent -match "yourdomain\.com") {
            Write-Host "   ❌ Still contains yourdomain.com URLs!" -ForegroundColor Red
        } else {
            Write-Host "   ✅ No yourdomain.com URLs found" -ForegroundColor Green
        }
        
        $sitemapTestResult = $true
    }
} catch {
    Write-Host "❌ Sitemap not accessible" -ForegroundColor Red
    Write-Host "   URL: $sitemapUrl" -ForegroundColor Gray
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Results Summary
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$validPassed = ($validTestResults | Where-Object { $_ -eq $true }).Count
$validTotal = $validTestResults.Count
Write-Host "Valid URLs Test:" -NoNewline
Write-Host "    $validPassed/$validTotal passed" -ForegroundColor $(if ($validPassed -eq $validTotal) { "Green" } else { "Yellow" })

$invalidPassed = ($invalidTestResults | Where-Object { $_ -eq $true }).Count
$invalidTotal = $invalidTestResults.Count
Write-Host "Invalid URLs Test:" -NoNewline
Write-Host "  $invalidPassed/$invalidTotal passed" -ForegroundColor $(if ($invalidPassed -eq $invalidTotal) { "Green" } else { "Yellow" })

$canonicalPassed = ($canonicalTestResults | Where-Object { $_ -eq $true }).Count
$canonicalTotal = $canonicalTestResults.Count
Write-Host "Canonical URLs:" -NoNewline
Write-Host "     $canonicalPassed/$canonicalTotal passed" -ForegroundColor $(if ($canonicalPassed -eq $canonicalTotal) { "Green" } else { "Yellow" })

Write-Host "Sitemap Test:" -NoNewline
Write-Host "       $(if ($sitemapTestResult) { 'PASSED' } else { 'FAILED' })" -ForegroundColor $(if ($sitemapTestResult) { "Green" } else { "Red" })

Write-Host ""

$allTestsPassed = ($validPassed -eq $validTotal) -and ($invalidPassed -eq $invalidTotal) -and ($canonicalPassed -eq $canonicalTotal) -and $sitemapTestResult

if ($allTestsPassed) {
    Write-Host "🎉 ALL TESTS PASSED! Soft 404 fix is working correctly." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Google Search Console" -ForegroundColor White
    Write-Host "2. Submit sitemap: $sitemapUrl" -ForegroundColor White
    Write-Host "3. Request re-indexing for 10-20 sample URLs" -ForegroundColor White
    Write-Host "4. Navigate to Index → Pages → Soft 404" -ForegroundColor White
    Write-Host "5. Click 'Validate Fix' button" -ForegroundColor White
    Write-Host "6. Monitor validation progress over next 2-4 weeks" -ForegroundColor White
} else {
    Write-Host "⚠️  SOME TESTS FAILED. Please review errors above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Check deployment logs for errors" -ForegroundColor White
    Write-Host "2. Verify CDN cache has been cleared" -ForegroundColor White
    Write-Host "3. Review SOFT_404_FIX_COMPLETE_REPORT.md" -ForegroundColor White
    Write-Host "4. Test individual failing URLs manually" -ForegroundColor White
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
