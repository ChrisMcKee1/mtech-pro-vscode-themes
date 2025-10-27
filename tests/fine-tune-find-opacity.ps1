# Fine-tune Find Opacity for Remaining 7 Themes
# Reduce find match from 30% (4D) to 26% (43) to get combined under 50%

$themesDir = Join-Path $PSScriptRoot "..\themes"

$themesToFix = @(
    "Copper Bloom.json",
    "Digital Aqua.json",
    "Enchanted Grove Dark.json",
    "Graphite Bay.json",
    "Mystic Dusk.json",
    "Tokyo Night.json"
)

Write-Host "=== Fine-Tune Find Opacity (30% → 26%) ===" -ForegroundColor Cyan
Write-Host "Target: Combined opacity ~49% (under 50% threshold)" -ForegroundColor Yellow
Write-Host ""

$updated = 0

foreach ($themeName in $themesToFix) {
    Write-Host "Processing: $themeName" -ForegroundColor White
    
    try {
        $filePath = Join-Path $themesDir $themeName
        $content = Get-Content -Path $filePath -Raw
        $json = $content | ConvertFrom-Json
        
        # Get current values
        $currentFind = $json.colors.'editor.findMatchBackground'
        $currentHighlight = $json.colors.'editor.findMatchHighlightBackground'
        
        # Replace opacity: 4D (30%) → 43 (26%)
        $newFind = $currentFind -replace '4[Dd]$', '43'
        $newHighlight = $currentHighlight -replace '33$', '2b'  # 20% → 17%
        
        $json.colors.'editor.findMatchBackground' = $newFind
        $json.colors.'editor.findMatchHighlightBackground' = $newHighlight
        
        # Also update range highlight
        $json.colors.'editor.findRangeHighlightBackground' = $json.colors.'editor.findRangeHighlightBackground' -replace '26$', '20'  # 15% → 13%
        
        # Update word highlights if they exist
        if ($json.colors.'editor.wordHighlightBackground') {
            $json.colors.'editor.wordHighlightBackground' = $json.colors.'editor.wordHighlightBackground' -replace '40$', '3a'  # 25% → 23%
            $json.colors.'editor.wordHighlightStrongBackground' = $json.colors.'editor.wordHighlightStrongBackground' -replace '4[Dd]$', '43'  # 30% → 26%
        }
        
        # Save
        $newContent = $json | ConvertTo-Json -Depth 100
        Set-Content -Path $filePath -Value $newContent -NoNewline
        
        Write-Host "  ✓ Reduced opacity: 30% → 26%" -ForegroundColor Green
        Write-Host "    findMatch: $currentFind → $newFind" -ForegroundColor DarkGray
        Write-Host "    Combined with 30% diff = ~49%" -ForegroundColor Cyan
        
        $updated++
    }
    catch {
        Write-Host "  ✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "✓ Updated: $updated themes" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Run analyze-double-highlight-issue.ps1 to verify"
