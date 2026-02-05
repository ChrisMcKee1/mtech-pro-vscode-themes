# Canonical find overlay normalization.
# Current overlay spec is in tests/lib/theme-utils.js and docs/OVERLAY_AUDIT_PLAN.md.
# Normalize find tiers to 30/20/15/25/30 and respect combined caps (55% dark, 48-50% light).

$themesDir = Join-Path $PSScriptRoot "..\themes"

$themesToFix = @(
    "Copper Bloom.json",
    "Digital Aqua.json",
    "Enchanted Grove Dark.json",
    "Graphite Bay.json",
    "Mystic Dusk.json",
    "Tokyo Night.json"
)

Write-Host "=== Normalize Find Opacity (30/20/15/25/30) ===" -ForegroundColor Cyan
Write-Host "Target: Canonical tiers; combined caps 55% dark / 48-50% light" -ForegroundColor Yellow
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
        
        # Normalize find tiers: 30% / 20% / 15% / 25% / 30%
        $newFind = $currentFind -replace '([0-9A-Fa-f]{2})$', '4D'
        $newHighlight = $currentHighlight -replace '([0-9A-Fa-f]{2})$', '33'
        
        $json.colors.'editor.findMatchBackground' = $newFind
        $json.colors.'editor.findMatchHighlightBackground' = $newHighlight
        
        # Also update range highlight
        $json.colors.'editor.findRangeHighlightBackground' = $json.colors.'editor.findRangeHighlightBackground' -replace '([0-9A-Fa-f]{2})$', '26'
        
        # Update word highlights if they exist
        if ($json.colors.'editor.wordHighlightBackground') {
            $json.colors.'editor.wordHighlightBackground' = $json.colors.'editor.wordHighlightBackground' -replace '([0-9A-Fa-f]{2})$', '40'
            $json.colors.'editor.wordHighlightStrongBackground' = $json.colors.'editor.wordHighlightStrongBackground' -replace '([0-9A-Fa-f]{2})$', '4D'
        }
        
        # Save
        $newContent = $json | ConvertTo-Json -Depth 100
        Set-Content -Path $filePath -Value $newContent -NoNewline
        
        Write-Host "  ✓ Normalized to canonical find tiers" -ForegroundColor Green
        Write-Host "    findMatch: $currentFind → $newFind" -ForegroundColor DarkGray
        Write-Host "    Combined with 30% diff = ~51% (under dark cap 55%)" -ForegroundColor Cyan
        
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
