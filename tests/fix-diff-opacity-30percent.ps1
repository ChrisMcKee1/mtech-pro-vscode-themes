# NOTE: Legacy script. Current overlay spec is in tests/lib/theme-utils.js.
# Prefer batch-fix-all-opacity.js for active refactors.
# Standardize Diff Background Opacity to 30%
# Adjusts both insertedLineBackground and removedLineBackground to 4D (30% opacity)
# Preserves theme-specific colors while fixing opacity

$themesDir = Join-Path $PSScriptRoot "..\themes"

Write-Host "=== Diff Background Opacity Standardization ===" -ForegroundColor Cyan
Write-Host "Target: 30% opacity (4D hex) for all diff backgrounds" -ForegroundColor Yellow
Write-Host ""

# Themes to adjust with their current opacity values
$adjustments = @{
    "Evening Espresso.json" = @{ current = "66"; reason = "40% → 30% (too dark)" }
    "Morning Coffee.json" = @{ current = "66"; reason = "40% → 30% (too dark)" }
    "Arctic Nord Light.json" = @{ current = "40"; reason = "25% → 30% (consistency)" }
    "Arctic Nord.json" = @{ current = "40"; reason = "25% → 30% (consistency)" }
    "Cosmic Void Light.json" = @{ current = "40"; reason = "25% → 30% (consistency)" }
    "Neon Pink Light.json" = @{ current = "40"; reason = "25% → 30% (consistency)" }
    "OGE Light.json" = @{ current = "40"; reason = "25% → 30% (consistency)" }
    "Sandstone Light.json" = @{ current = "40"; reason = "25% → 30% (consistency)" }
    "Tokyo Day.json" = @{ current = "40"; reason = "25% → 30% (consistency)" }
    "Enchanted Grove.json" = @{ current = "30"; reason = "19% → 30% (recent fix)" }
    "Feisty Fusion Light.json" = @{ current = "30"; reason = "19% → 30% (recent fix)" }
}

$updated = 0
$skipped = 0
$errors = 0

foreach ($themeName in $adjustments.Keys) {
    $themeFile = Join-Path $themesDir $themeName
    
    if (-not (Test-Path $themeFile)) {
        Write-Host "⚠️  Not found: $themeName" -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    Write-Host "Processing: $themeName" -ForegroundColor White
    Write-Host "  Reason: $($adjustments[$themeName].reason)" -ForegroundColor DarkGray
    
    try {
        $content = Get-Content -Path $themeFile -Raw
        $modified = $false
        
        # Extract current colors (preserve RGB, change opacity only)
        $insertedMatches = [regex]::Matches($content, '"diffEditor\.insertedLineBackground":\s*"#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})"')
        $removedMatches = [regex]::Matches($content, '"diffEditor\.removedLineBackground":\s*"#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})"')
        
        if ($insertedMatches.Count -gt 0) {
            $insertColor = $insertedMatches[0].Groups[1].Value
            $insertOldOpacity = $insertedMatches[0].Groups[2].Value
            $oldInsertFull = "#$insertColor$insertOldOpacity"
            $newInsertFull = "#${insertColor}4D"
            
            $content = $content -replace [regex]::Escape("""diffEditor.insertedLineBackground"": ""$oldInsertFull"""), """diffEditor.insertedLineBackground"": ""$newInsertFull"""
            Write-Host "    insertedLine: $oldInsertFull → $newInsertFull" -ForegroundColor Green
            $modified = $true
        }
        
        if ($removedMatches.Count -gt 0) {
            $removeColor = $removedMatches[0].Groups[1].Value
            $removeOldOpacity = $removedMatches[0].Groups[2].Value
            $oldRemoveFull = "#$removeColor$removeOldOpacity"
            $newRemoveFull = "#${removeColor}4D"
            
            $content = $content -replace [regex]::Escape("""diffEditor.removedLineBackground"": ""$oldRemoveFull"""), """diffEditor.removedLineBackground"": ""$newRemoveFull"""
            Write-Host "    removedLine: $oldRemoveFull → $newRemoveFull" -ForegroundColor Green
            $modified = $true
        }
        
        if ($modified) {
            Set-Content -Path $themeFile -Value $content -NoNewline
            $updated++
            Write-Host "  ✓ Updated successfully" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  No changes made (pattern not found)" -ForegroundColor Yellow
            $skipped++
        }
    }
    catch {
        Write-Host "  ✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $errors++
    }
    
    Write-Host ""
}

Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "✓ Updated: $updated themes" -ForegroundColor Green
Write-Host "⊘ Skipped: $skipped themes" -ForegroundColor Yellow
Write-Host "✗ Errors:  $errors themes" -ForegroundColor Red
Write-Host ""
Write-Host "Standard opacity: 4D (30% - optimal visibility without obscuring text)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: cd tests && .\run-tests.cmd --quick" -ForegroundColor White
Write-Host "2. Manual test: Reload VS Code window (F1 → Developer: Reload Window)" -ForegroundColor White
Write-Host "3. Verify diff visibility in multiple themes" -ForegroundColor White
