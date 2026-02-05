# NOTE: Legacy script. Current overlay spec is in tests/lib/theme-utils.js.
# Prefer batch-fix-all-opacity.js for active refactors.
# Fix Diff Opacity - 25% Standard
# Only adjust themes with 40%+ opacity down to 25% (40 hex)
# Leave themes already at 25% or below unchanged

$themesDir = Join-Path $PSScriptRoot "..\themes"

Write-Host "=== Diff Background Opacity Fix - 25% Standard ===" -ForegroundColor Cyan
Write-Host "Target: 25% opacity (40 hex) - optimal visibility" -ForegroundColor Yellow
Write-Host "Only adjusting themes with 40%+ opacity" -ForegroundColor Yellow
Write-Host ""

# Themes that need adjustment (were at 40% - too dark)
$adjustments = @{
    "Evening Espresso.json" = @{ targetOpacity = "40"; reason = "40% → 25% (was too dark)" }
    "Morning Coffee.json" = @{ targetOpacity = "40"; reason = "40% → 25% (was too dark)" }
}

# Themes to REVERT from 30% back to their original 25%
$reverts = @{
    "Arctic Nord Light.json" = @{ revertTo = "40"; reason = "Revert 30% → 25% (original was fine)" }
    "Arctic Nord.json" = @{ revertTo = "40"; reason = "Revert 30% → 25% (original was fine)" }
    "Cosmic Void Light.json" = @{ revertTo = "40"; reason = "Revert 30% → 25% (original was fine)" }
    "Neon Pink Light.json" = @{ revertTo = "40"; reason = "Revert 30% → 25% (original was fine)" }
    "OGE Light.json" = @{ revertTo = "40"; reason = "Revert 30% → 25% (original was fine)" }
    "Sandstone Light.json" = @{ revertTo = "40"; reason = "Revert 30% → 25% (original was fine)" }
    "Tokyo Day.json" = @{ revertTo = "40"; reason = "Revert 30% → 25% (original was fine)" }
    "Enchanted Grove.json" = @{ revertTo = "40"; reason = "Revert 30% → 25% (was at 19%, good opacity)" }
    "Feisty Fusion Light.json" = @{ revertTo = "40"; reason = "Revert 30% → 25% (was at 19%, good opacity)" }
}

$updated = 0
$reverted = 0
$errors = 0

# Process adjustments (40% down to 25%)
foreach ($themeName in $adjustments.Keys) {
    $themeFile = Join-Path $themesDir $themeName
    
    if (-not (Test-Path $themeFile)) {
        Write-Host "⚠️  Not found: $themeName" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "Processing: $themeName" -ForegroundColor White
    Write-Host "  Action: $($adjustments[$themeName].reason)" -ForegroundColor DarkGray
    
    try {
        $content = Get-Content -Path $themeFile -Raw
        $modified = $false
        
        # Change 4D (30%) to 40 (25%)
        $insertedMatches = [regex]::Matches($content, '"diffEditor\.insertedLineBackground":\s*"#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})"')
        $removedMatches = [regex]::Matches($content, '"diffEditor\.removedLineBackground":\s*"#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})"')
        
        if ($insertedMatches.Count -gt 0) {
            $insertColor = $insertedMatches[0].Groups[1].Value
            $insertOldOpacity = $insertedMatches[0].Groups[2].Value
            $oldInsertFull = "#$insertColor$insertOldOpacity"
            $newInsertFull = "#${insertColor}40"
            
            $content = $content -replace [regex]::Escape("""diffEditor.insertedLineBackground"": ""$oldInsertFull"""), """diffEditor.insertedLineBackground"": ""$newInsertFull"""
            Write-Host "    insertedLine: $oldInsertFull → $newInsertFull" -ForegroundColor Green
            $modified = $true
        }
        
        if ($removedMatches.Count -gt 0) {
            $removeColor = $removedMatches[0].Groups[1].Value
            $removeOldOpacity = $removedMatches[0].Groups[2].Value
            $oldRemoveFull = "#$removeColor$removeOldOpacity"
            $newRemoveFull = "#${removeColor}40"
            
            $content = $content -replace [regex]::Escape("""diffEditor.removedLineBackground"": ""$oldRemoveFull"""), """diffEditor.removedLineBackground"": ""$newRemoveFull"""
            Write-Host "    removedLine: $oldRemoveFull → $newRemoveFull" -ForegroundColor Green
            $modified = $true
        }
        
        if ($modified) {
            Set-Content -Path $themeFile -Value $content -NoNewline
            $updated++
            Write-Host "  ✓ Updated to 25% opacity" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "  ✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $errors++
    }
    
    Write-Host ""
}

# Process reverts (30% back to 25%)
foreach ($themeName in $reverts.Keys) {
    $themeFile = Join-Path $themesDir $themeName
    
    if (-not (Test-Path $themeFile)) {
        Write-Host "⚠️  Not found: $themeName" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "Reverting: $themeName" -ForegroundColor Cyan
    Write-Host "  Action: $($reverts[$themeName].reason)" -ForegroundColor DarkGray
    
    try {
        $content = Get-Content -Path $themeFile -Raw
        $modified = $false
        
        # Change 4D (30%) back to 40 (25%)
        $insertedMatches = [regex]::Matches($content, '"diffEditor\.insertedLineBackground":\s*"#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})"')
        $removedMatches = [regex]::Matches($content, '"diffEditor\.removedLineBackground":\s*"#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})"')
        
        if ($insertedMatches.Count -gt 0) {
            $insertColor = $insertedMatches[0].Groups[1].Value
            $insertOldOpacity = $insertedMatches[0].Groups[2].Value
            
            if ($insertOldOpacity -eq "4D") {
                $oldInsertFull = "#$insertColor$insertOldOpacity"
                $newInsertFull = "#${insertColor}40"
                
                $content = $content -replace [regex]::Escape("""diffEditor.insertedLineBackground"": ""$oldInsertFull"""), """diffEditor.insertedLineBackground"": ""$newInsertFull"""
                Write-Host "    insertedLine: $oldInsertFull → $newInsertFull" -ForegroundColor Cyan
                $modified = $true
            }
        }
        
        if ($removedMatches.Count -gt 0) {
            $removeColor = $removedMatches[0].Groups[1].Value
            $removeOldOpacity = $removedMatches[0].Groups[2].Value
            
            if ($removeOldOpacity -eq "4D") {
                $oldRemoveFull = "#$removeColor$removeOldOpacity"
                $newRemoveFull = "#${removeColor}40"
                
                $content = $content -replace [regex]::Escape("""diffEditor.removedLineBackground"": ""$oldRemoveFull"""), """diffEditor.removedLineBackground"": ""$newRemoveFull"""
                Write-Host "    removedLine: $oldRemoveFull → $newRemoveFull" -ForegroundColor Cyan
                $modified = $true
            }
        }
        
        if ($modified) {
            Set-Content -Path $themeFile -Value $content -NoNewline
            $reverted++
            Write-Host "  ✓ Reverted to 25% opacity" -ForegroundColor Cyan
        } else {
            Write-Host "  ⊘ No changes needed (already at 25%)" -ForegroundColor DarkGray
        }
    }
    catch {
        Write-Host "  ✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $errors++
    }
    
    Write-Host ""
}

Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "✓ Fixed (40% → 25%): $updated themes" -ForegroundColor Green
Write-Host "↶ Reverted (30% → 25%): $reverted themes" -ForegroundColor Cyan
Write-Host "✗ Errors: $errors themes" -ForegroundColor Red
Write-Host ""
Write-Host "Standard: 40 hex (25% opacity - optimal visibility)" -ForegroundColor Cyan
Write-Host "Result: Only Evening Espresso & Morning Coffee needed fixing (were too dark at 40%)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: .\run-tests.cmd --quick" -ForegroundColor White
Write-Host "2. Reload VS Code: F1 → Developer: Reload Window" -ForegroundColor White
Write-Host "3. Test diff visibility in Evening Espresso and Morning Coffee" -ForegroundColor White
