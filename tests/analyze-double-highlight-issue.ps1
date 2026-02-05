# Analyze Double-Highlight Overlay Issue
# Identifies themes where find/word/selection highlights may obscure diff backgrounds

$themesDir = Join-Path $PSScriptRoot "..\themes"
$themes = Get-ChildItem -Path $themesDir -Filter "*.json"

Write-Host "=== Double-Highlight Overlay Analysis ===" -ForegroundColor Cyan
Write-Host "Analyzing $($themes.Count) themes for problematic highlight combinations..." -ForegroundColor Yellow
Write-Host ""

function Get-OpacityPercent($hexColor) {
    if ($hexColor -match '#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})') {
        $alphaHex = $matches[1]
        $alphaDecimal = [Convert]::ToInt32($alphaHex, 16)
        $percent = [math]::Round(($alphaDecimal / 255) * 100)
        return $percent
    }
    return 100  # Assume opaque if no alpha
}

function Get-BaseColor($hexColor) {
    if ($hexColor -match '#([0-9A-Fa-f]{6})') {
        return $matches[1].ToUpper()
    }
    return $hexColor
}

function Get-ThemeType($themeName, $themeData) {
    if ($themeData.type -eq 'light') {
        return 'light'
    }

    $explicitLight = @(
        'Enchanted Grove',
        'Arctic Nord Light',
        'Cosmic Void Light',
        'Feisty Fusion Light',
        'Neon Pink Light',
        'OGE Light',
        'Tokyo Day',
        'Filter Sun'
    )

    if ($explicitLight -contains $themeName) {
        return 'light'
    }

    if ($themeName -match 'Light|Sun|Day') {
        return 'light'
    }

    return 'dark'
}

$problematicThemes = @()

foreach ($themeFile in $themes) {
    try {
        $content = Get-Content -Path $themeFile.FullName -Raw | ConvertFrom-Json
        $colors = $content.colors
        $themeName = [System.IO.Path]::GetFileNameWithoutExtension($themeFile.Name)
        $themeType = Get-ThemeType -themeName $themeName -themeData $content
        $combinedCap = if ($themeType -eq 'light') { 50 } else { 55 }
        $lineHighlightCap = if ($themeType -eq 'light') { 25 } else { 20 }
        
        # Extract relevant properties
        $diffInserted = $colors.'diffEditor.insertedLineBackground'
        $diffRemoved = $colors.'diffEditor.removedLineBackground'
        $findMatch = $colors.'editor.findMatchBackground'
        $findHighlight = $colors.'editor.findMatchHighlightBackground'
        $lineHighlight = $colors.'editor.lineHighlightBackground'
        $selection = $colors.'editor.selectionBackground'
        $wordHighlight = $colors.'editor.wordHighlightBackground'
        
        # Calculate opacity levels
        $diffInsertedOpacity = Get-OpacityPercent $diffInserted
        $diffRemovedOpacity = Get-OpacityPercent $diffRemoved
        $findMatchOpacity = Get-OpacityPercent $findMatch
        $findHighlightOpacity = Get-OpacityPercent $findHighlight
        $lineHighlightOpacity = Get-OpacityPercent $lineHighlight
        $selectionOpacity = Get-OpacityPercent $selection
        $wordHighlightOpacity = Get-OpacityPercent $wordHighlight
        
        # Get base colors (without alpha)
        $findMatchBase = Get-BaseColor $findMatch
        $diffInsertedBase = Get-BaseColor $diffInserted
        $diffRemovedBase = Get-BaseColor $diffRemoved
        
        # Calculate combined opacity (overlay math: 1 - (1-a)*(1-b))
        $combinedFindDiffInsert = [math]::Round(100 * (1 - ((1 - $findMatchOpacity/100) * (1 - $diffInsertedOpacity/100))))
        $combinedFindDiffRemove = [math]::Round(100 * (1 - ((1 - $findMatchOpacity/100) * (1 - $diffRemovedOpacity/100))))
        
        # Detect problematic patterns
        $issues = @()
        
        # Issue 1: Find match overlay too opaque (>50% combined)
        if ($combinedFindDiffInsert -gt $combinedCap) {
            $issues += "Find+DiffInsert = ${combinedFindDiffInsert}% (over cap ${combinedCap}%)"
        }
        if ($combinedFindDiffRemove -gt $combinedCap) {
            $issues += "Find+DiffRemove = ${combinedFindDiffRemove}% (over cap ${combinedCap}%)"
        }
        
        # Issue 2: Find match base color clashes with diff colors (warm yellows/oranges on green/red)
        if ($findMatchBase -match '^(FF|EE|DD|CC|BB).*([89ABCDEF][0-9A-F])$') {
            # Warm yellow/orange find highlight
            $issues += "Warm find color ($findMatchBase) may clash with diff colors"
        }
        
        # Issue 3: Very high opacity find matches (>60%)
        if ($findMatchOpacity -gt 60) {
            $issues += "findMatch ${findMatchOpacity}% opacity (too opaque, obscures text)"
        }
        
        # Issue 4: Line highlight + diff combination too dark
        if ($lineHighlightOpacity -gt $lineHighlightCap -and ($diffInsertedOpacity + $lineHighlightOpacity) -gt $combinedCap) {
            $issues += "LineHighlight+Diff too dark (combined ~$($diffInsertedOpacity + $lineHighlightOpacity)% cap ${combinedCap}%)"
        }
        
        if ($issues.Count -gt 0) {
            $problematicThemes += [PSCustomObject]@{
                Theme = $themeFile.Name
                ThemeType = $themeType
                DiffInsert = "$diffInserted ($diffInsertedOpacity%)"
                DiffRemove = "$diffRemoved ($diffRemovedOpacity%)"
                FindMatch = "$findMatch ($findMatchOpacity%)"
                CombinedInsert = "${combinedFindDiffInsert}%"
                CombinedRemove = "${combinedFindDiffRemove}%"
                CombinedCap = "${combinedCap}%"
                Issues = $issues -join " | "
            }
        }
        
    }
    catch {
        Write-Host "ERROR processing $($themeFile.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "=== PROBLEMATIC THEMES ===" -ForegroundColor Red
Write-Host ""

if ($problematicThemes.Count -eq 0) {
    Write-Host "✓ No themes with double-highlight issues detected!" -ForegroundColor Green
}
else {
    foreach ($theme in $problematicThemes) {
        Write-Host "$($theme.Theme)" -ForegroundColor Yellow
        Write-Host "  Diff Insert:  $($theme.DiffInsert)" -ForegroundColor DarkGray
        Write-Host "  Diff Remove:  $($theme.DiffRemove)" -ForegroundColor DarkGray
        Write-Host "  Find Match:   $($theme.FindMatch)" -ForegroundColor DarkGray
        Write-Host "  Theme Type:  $($theme.ThemeType)" -ForegroundColor DarkGray
        Write-Host "  Combined Cap: $($theme.CombinedCap)" -ForegroundColor DarkGray
        Write-Host "  Combined Insert: $($theme.CombinedInsert)" -ForegroundColor $(if ([int]$theme.CombinedInsert.TrimEnd('%') -gt [int]$theme.CombinedCap.TrimEnd('%')) { "Red" } else { "Yellow" })
        Write-Host "  Combined Remove: $($theme.CombinedRemove)" -ForegroundColor $(if ([int]$theme.CombinedRemove.TrimEnd('%') -gt [int]$theme.CombinedCap.TrimEnd('%')) { "Red" } else { "Yellow" })
        Write-Host "  Issues: $($theme.Issues)" -ForegroundColor Cyan
        Write-Host ""
    }
    
    Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
    Write-Host "Problematic themes: $($problematicThemes.Count)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "=== ARCTIC NORD (GOOD EXAMPLE) ===" -ForegroundColor Green
    Write-Host "Diff Insert: #88C0D04D (30% cyan - subtle)" -ForegroundColor DarkGray
    Write-Host "Find Match:  #88C0D04D (30% cyan - same color family)" -ForegroundColor DarkGray
    Write-Host "Combined:    ~51% (text remains readable, under dark cap 55%)" -ForegroundColor DarkGray
    Write-Host "Strategy:    Uses SAME base color (#88C0D0) for both overlays" -ForegroundColor DarkGray
    Write-Host ""
}

Write-Host "=== RECOMMENDATIONS ===" -ForegroundColor Cyan
Write-Host "1. Use SAME base color for find highlights and diff backgrounds" -ForegroundColor White
Write-Host "2. Use canonical find tiers: 30/20/15/25/30 (find/hi/range/word/strong)" -ForegroundColor White
Write-Host "3. Keep combined opacity <= 55% (dark) / <= 50% (light, 48% preferred)" -ForegroundColor White
Write-Host "4. Avoid warm yellows/oranges on green diffs (color clash)" -ForegroundColor White
Write-Host "5. Test in actual diff view with Ctrl+F active" -ForegroundColor White
