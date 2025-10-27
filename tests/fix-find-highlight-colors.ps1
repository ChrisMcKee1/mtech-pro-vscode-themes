# Fix Find Highlight Colors - Theme-Aware Approach
# Uses each theme's existing diff colors as basis for find highlights
# Follows Arctic Nord pattern: same color family, slightly higher opacity

$themesDir = Join-Path $PSScriptRoot "..\themes"
$themes = Get-ChildItem -Path $themesDir -Filter "*.json"

Write-Host "=== Find Highlight Color Fix (Theme-Aware) ===" -ForegroundColor Cyan
Write-Host "Strategy: Use theme's diff insert color for find highlights" -ForegroundColor Yellow
Write-Host "Arctic Nord Pattern: Same base color, 30% for find (vs 25% for diff)" -ForegroundColor Yellow
Write-Host ""

# Theme-specific configurations
# Strategy: Use the theme's diff insert color (green/cyan) for find match highlights
# This creates visual harmony while maintaining distinction through opacity
$findHighlightConfigs = @{
    "Arctic Nord.json" = @{
        # Already correct - using cyan #88C0D0
        skip = $true
        reason = "Already uses Arctic Nord pattern correctly"
    }
    "Arctic Nord Light.json" = @{
        # Already good
        skip = $true
        reason = "Already uses theme-appropriate colors"
    }
    "Chroma Void.json" = @{
        # Already good
        skip = $true
        reason = "Already uses neutral grays appropriately"
    }
    "Copper Bloom.json" = @{
        findMatch = "#adda784d"              # Use diff insert green, 30%
        findMatchHighlight = "#adda7833"     # Same green, 20%
        findRangeHighlight = "#adda7826"     # Same green, 15%
        wordHighlight = "#adda7840"          # Same green, 25%
        wordHighlightStrong = "#adda784d"    # Same green, 30%
        reason = "Use theme's green accent (#adda78) matching diff insert"
    }
    "Cosmic Void.json" = @{
        # Already good - uses slate colors
        skip = $true
        reason = "Already uses theme-appropriate slate colors"
    }
    "Cosmic Void Light.json" = @{
        findMatch = "#0478574d"              # Use diff insert teal, 30%
        findMatchHighlight = "#04785733"     # Same teal, 20%
        findRangeHighlight = "#04785726"     # Same teal, 15%
        reason = "Use theme's teal accent (#047857) matching diff insert"
    }
    "Cyberpunk Neon.json" = @{
        findMatch = "#00ff994d"              # Use diff insert neon green, 30%
        findMatchHighlight = "#00ff9933"     # Same neon green, 20%
        findRangeHighlight = "#00ff9926"     # Same neon green, 15%
        wordHighlight = "#00ff9940"          # Same neon green, 25%
        wordHighlightStrong = "#00ff994d"    # Same neon green, 30%
        reason = "Use theme's neon green (#00ff99) - cyberpunk electric aesthetic"
    }
    "Digital Aqua.json" = @{
        findMatch = "#a2e57b4d"              # Use diff insert aqua green, 30%
        findMatchHighlight = "#a2e57b33"     # Same aqua green, 20%
        findRangeHighlight = "#a2e57b26"     # Same aqua green, 15%
        wordHighlight = "#a2e57b40"          # Same aqua green, 25%
        wordHighlightStrong = "#a2e57b4d"    # Same aqua green, 30%
        reason = "Use theme's aqua green (#a2e57b) matching diff insert"
    }
    "Enchanted Grove Dark.json" = @{
        findMatch = "#90D8964d"              # Use diff insert forest green, 30%
        findMatchHighlight = "#90D89633"     # Same forest green, 20%
        findRangeHighlight = "#90D89626"     # Same forest green, 15%
        wordHighlight = "#90D89640"          # Same forest green, 25%
        wordHighlightStrong = "#90D8964d"    # Same forest green, 30%
        reason = "Use theme's forest green (#90D896) - enchanted grove aesthetic"
    }
    "Enchanted Grove.json" = @{
        findMatch = "#A3BE8C4d"              # Use diff insert green, 30%
        findMatchHighlight = "#A3BE8C33"     # Same green, 20%
        findRangeHighlight = "#A3BE8C26"     # Same green, 15%
        wordHighlight = "#A3BE8C40"          # Same green, 25%
        wordHighlightStrong = "#A3BE8C4d"    # Same green, 30%
        reason = "Use theme's earthy green (#A3BE8C) matching diff insert"
    }
    "Evening Espresso.json" = @{
        findMatch = "#6B8E6B4d"              # Use diff insert coffee green, 30%
        findMatchHighlight = "#6B8E6B33"     # Same coffee green, 20%
        findRangeHighlight = "#6B8E6B26"     # Same coffee green, 15%
        wordHighlight = "#6B8E6B40"          # Same coffee green, 25%
        wordHighlightStrong = "#6B8E6B4d"    # Same coffee green, 30%
        reason = "Use theme's coffee green (#6B8E6B) - espresso aesthetic, replaces warm yellow"
    }
    "Feisty Fusion.json" = @{
        findMatch = "#bad7614d"              # Use diff insert fusion green, 30%
        findMatchHighlight = "#bad76133"     # Same fusion green, 20%
        findRangeHighlight = "#bad76126"     # Same fusion green, 15%
        wordHighlight = "#bad76140"          # Same fusion green, 25%
        wordHighlightStrong = "#bad7614d"    # Same fusion green, 30%
        reason = "Use theme's fusion green (#bad761) matching diff insert"
    }
    "Feisty Fusion Light.json" = @{
        findMatch = "#A3BE8C4d"              # Use diff insert Nordic green, 30%
        findMatchHighlight = "#A3BE8C33"     # Same Nordic green, 20%
        findRangeHighlight = "#A3BE8C26"     # Same Nordic green, 15%
        wordHighlight = "#A3BE8C40"          # Same Nordic green, 25%
        wordHighlightStrong = "#A3BE8C4d"    # Same Nordic green, 30%
        reason = "Use theme's Nordic green (#A3BE8C) matching diff insert"
    }
    "Graphite Bay.json" = @{
        findMatch = "#bad7614d"              # Use diff insert bay green, 30%
        findMatchHighlight = "#bad76133"     # Same bay green, 20%
        findRangeHighlight = "#bad76126"     # Same bay green, 15%
        wordHighlight = "#bad76140"          # Same bay green, 25%
        wordHighlightStrong = "#bad7614d"    # Same bay green, 30%
        reason = "Use theme's bay green (#bad761) matching diff insert"
    }
    "Morning Coffee.json" = @{
        findMatch = "#8FBC8F4d"              # Use diff insert coffee green, 30%
        findMatchHighlight = "#8FBC8F33"     # Same coffee green, 20%
        findRangeHighlight = "#8FBC8F26"     # Same coffee green, 15%
        wordHighlight = "#8FBC8F40"          # Same coffee green, 25%
        wordHighlightStrong = "#8FBC8F4d"    # Same coffee green, 30%
        reason = "Use theme's coffee green (#8FBC8F) - morning coffee aesthetic, replaces warm yellow"
    }
    "Mystic Dusk.json" = @{
        findMatch = "#34D3994d"              # Use diff insert mystic teal, 30%
        findMatchHighlight = "#34D39933"     # Same mystic teal, 20%
        findRangeHighlight = "#34D39926"     # Same mystic teal, 15%
        wordHighlight = "#34D39940"          # Same mystic teal, 25%
        wordHighlightStrong = "#34D3994d"    # Same mystic teal, 30%
        reason = "Use theme's mystic teal (#34D399) matching diff insert"
    }
    "Neon Pink Light.json" = @{
        findMatch = "#0088564d"              # Use diff insert neon teal, 30%
        findMatchHighlight = "#00885633"     # Same neon teal, 20%
        findRangeHighlight = "#00885626"     # Same neon teal, 15%
        wordHighlight = "#00885640"          # Same neon teal, 25%
        wordHighlightStrong = "#0088564d"    # Same neon teal, 30%
        reason = "Use theme's neon teal (#008856) - neon aesthetic contrast to pink"
    }
    "Obsidian Moss.json" = @{
        findMatch = "#a6e22e4d"              # Use diff insert moss green, 30%
        findMatchHighlight = "#a6e22e33"     # Same moss green, 20%
        findRangeHighlight = "#a6e22e26"     # Same moss green, 15%
        wordHighlight = "#a6e22e40"          # Same moss green, 25%
        wordHighlightStrong = "#a6e22e4d"    # Same moss green, 30%
        reason = "Use theme's moss green (#a6e22e) matching diff insert"
    }
    "OGE Dark.json" = @{
        findMatch = "#1DE9B64d"              # Use diff insert OGE cyan, 30%
        findMatchHighlight = "#1DE9B633"     # Same OGE cyan, 20%
        findRangeHighlight = "#1DE9B626"     # Same OGE cyan, 15%
        wordHighlight = "#1DE9B640"          # Same OGE cyan, 25%
        wordHighlightStrong = "#1DE9B64d"    # Same OGE cyan, 30%
        reason = "Use theme's OGE cyan (#1DE9B6) matching diff insert"
    }
    "OGE Light.json" = @{
        findMatch = "#0470474d"              # Use diff insert OGE teal, 30%
        findMatchHighlight = "#04704733"     # Same OGE teal, 20%
        findRangeHighlight = "#04704726"     # Same OGE teal, 15%
        reason = "Use theme's OGE teal (#047047) matching diff insert"
    }
    "Sandstone Light.json" = @{
        findMatch = "#2188714d"              # Use diff insert sandstone teal, 30%
        findMatchHighlight = "#21887133"     # Same sandstone teal, 20%
        findRangeHighlight = "#21887126"     # Same sandstone teal, 15%
        reason = "Use theme's sandstone teal (#218871) matching diff insert"
    }
    "Tokyo Day.json" = @{
        findMatch = "#2ECC714d"              # Use diff insert Tokyo green, 30%
        findMatchHighlight = "#2ECC7133"     # Same Tokyo green, 20%
        findRangeHighlight = "#2ECC7126"     # Same Tokyo green, 15%
        reason = "Use theme's Tokyo green (#2ECC71) matching diff insert"
    }
    "Tokyo Night.json" = @{
        findMatch = "#9ece6a4d"              # Use diff insert Tokyo neon green, 30%
        findMatchHighlight = "#9ece6a33"     # Same Tokyo neon green, 20%
        findRangeHighlight = "#9ece6a26"     # Same Tokyo neon green, 15%
        wordHighlight = "#9ece6a40"          # Same Tokyo neon green, 25%
        wordHighlightStrong = "#9ece6a4d"    # Same Tokyo neon green, 30%
        reason = "Use theme's Tokyo neon green (#9ece6a) matching diff insert"
    }
}

$updated = 0
$skipped = 0
$errors = 0

foreach ($themeFile in $themes) {
    $themeName = $themeFile.Name
    Write-Host "Processing: $themeName" -ForegroundColor White
    
    if (-not $findHighlightConfigs.ContainsKey($themeName)) {
        Write-Host "  ⚠️  No config defined - SKIPPING" -ForegroundColor Yellow
        $skipped++
        Write-Host ""
        continue
    }
    
    $config = $findHighlightConfigs[$themeName]
    
    if ($config.skip) {
        Write-Host "  ✓ $($config.reason) - SKIPPING" -ForegroundColor Green
        $skipped++
        Write-Host ""
        continue
    }
    
    try {
        $filePath = $themeFile.FullName
        $content = Get-Content -Path $filePath -Raw
        $json = $content | ConvertFrom-Json
        
        # Store original values
        $originalFindMatch = $json.colors.'editor.findMatchBackground'
        $originalFindHighlight = $json.colors.'editor.findMatchHighlightBackground'
        
        # Apply new find highlight colors
        $json.colors.'editor.findMatchBackground' = $config.findMatch
        $json.colors.'editor.findMatchHighlightBackground' = $config.findMatchHighlight
        $json.colors.'editor.findRangeHighlightBackground' = $config.findRangeHighlight
        
        # Update word highlights if specified (not all themes need this)
        if ($config.wordHighlight) {
            $json.colors.'editor.wordHighlightBackground' = $config.wordHighlight
            $json.colors.'editor.wordHighlightStrongBackground' = $config.wordHighlightStrong
        }
        
        # Convert back to JSON
        $newContent = $json | ConvertTo-Json -Depth 100
        Set-Content -Path $filePath -Value $newContent -NoNewline
        
        Write-Host "  ✓ Updated find highlight colors" -ForegroundColor Green
        Write-Host "    Strategy: $($config.reason)" -ForegroundColor Cyan
        Write-Host "    findMatch: $originalFindMatch → $($config.findMatch)" -ForegroundColor DarkGray
        Write-Host "    findHighlight: $originalFindHighlight → $($config.findMatchHighlight)" -ForegroundColor DarkGray
        
        $updated++
    }
    catch {
        Write-Host "  ✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $errors++
    }
    
    Write-Host ""
}

Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "✓ Updated: $updated themes" -ForegroundColor Green
Write-Host "⊘ Skipped: $skipped themes (already correct)" -ForegroundColor Yellow
Write-Host "✗ Errors:  $errors themes" -ForegroundColor Red
Write-Host ""
Write-Host "Key improvements:" -ForegroundColor Cyan
Write-Host "• Coffee themes: Warm yellow → Coffee green (matches persona)" -ForegroundColor White
Write-Host "• Cyberpunk: Random pink → Neon green (electric aesthetic)" -ForegroundColor White
Write-Host "• Enchanted Grove: Neutral → Forest green (magical forest)" -ForegroundColor White
Write-Host "• All themes: Combined opacity now ~48% (vs 60-74% before)" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: .\analyze-double-highlight-issue.ps1 (verify fixes)" -ForegroundColor White
Write-Host "2. Test manually: Open diff view, use Ctrl+F to search" -ForegroundColor White
Write-Host "3. Run: cd .. && .\run-tests.cmd --quick" -ForegroundColor White
