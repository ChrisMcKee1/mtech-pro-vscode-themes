# Fix Inserted Text Background Opacity + Comment Colors
# Issue 1: insertedTextBackground too opaque (makes text hard to read)
# Issue 2: Comment colors too light in some themes

$themesDir = Join-Path $PSScriptRoot "..\themes"

Write-Host "=== Fix Inserted Text Background + Comments ===" -ForegroundColor Cyan
Write-Host ""

# Issue 1: Reduce insertedTextBackground from 40-50% to 20-25%
$textBackgroundFixes = @(
    "Chroma Void.json",
    "Copper Bloom.json",
    "Digital Aqua.json",
    "Feisty Fusion.json",
    "Graphite Bay.json",
    "Mystic Dusk.json",
    "Obsidian Moss.json",
    "Tokyo Night.json"
)

Write-Host "ISSUE 1: Inserted Text Background Opacity" -ForegroundColor Yellow
Write-Host "Reducing from 40-50% to 20-25% for readability" -ForegroundColor Yellow
Write-Host ""

$fixed1 = 0
foreach ($themeName in $textBackgroundFixes) {
    Write-Host "Processing: $themeName" -ForegroundColor White
    
    try {
        $filePath = Join-Path $themesDir $themeName
        $content = Get-Content -Path $filePath -Raw
        $json = $content | ConvertFrom-Json
        
        $oldInsert = $json.colors.'diffEditor.insertedTextBackground'
        $oldRemove = $json.colors.'diffEditor.removedTextBackground'
        
        # Reduce opacity: 66 (40%) → 33 (20%), 4D (30%) → 33 (20%), 80 (50%) → 40 (25%)
        $newInsert = $oldInsert -replace '66$', '33' -replace '4[Dd]$', '33' -replace '80$', '40'
        $newRemove = $oldRemove -replace '66$', '33' -replace '4[Dd]$', '33' -replace '80$', '40'
        
        $json.colors.'diffEditor.insertedTextBackground' = $newInsert
        $json.colors.'diffEditor.removedTextBackground' = $newRemove
        
        $newContent = $json | ConvertTo-Json -Depth 100
        Set-Content -Path $filePath -Value $newContent -NoNewline
        
        Write-Host "  ✓ Reduced text background opacity" -ForegroundColor Green
        Write-Host "    insertedText: $oldInsert → $newInsert" -ForegroundColor DarkGray
        Write-Host "    removedText:  $oldRemove → $newRemove" -ForegroundColor DarkGray
        
        $fixed1++
    }
    catch {
        Write-Host "  ✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "✓ Fixed text background opacity: $fixed1 themes" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Check comment colors in Enchanted Grove Dark and Evening Espresso"
