# Deep Coffee Themes Evaluation
# Comprehensive analysis for Morning Coffee (light) and Evening Espresso (dark)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DEEP COFFEE THEMES EVALUATION" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$morningPath = "..\themes\Morning Coffee.json"
$espressoPath = "..\themes\Evening Espresso.json"

$morning = Get-Content $morningPath -Raw | ConvertFrom-Json
$espresso = Get-Content $espressoPath -Raw | ConvertFrom-Json

Write-Host "1. CHECKING FOR COMMON ISSUES..." -ForegroundColor Yellow
Write-Host ""

# ============================================
# ISSUE CATEGORY 1: Empty/Missing Properties
# ============================================
Write-Host "   A. Empty or Invalid Properties:" -ForegroundColor Cyan

$emptyPropsEspresso = @()
$emptyPropsMorning = @()

foreach ($prop in $espresso.colors.PSObject.Properties) {
    if ($prop.Value -eq "" -or $prop.Value -eq $null) {
        $emptyPropsEspresso += $prop.Name
    }
}

foreach ($prop in $morning.colors.PSObject.Properties) {
    if ($prop.Value -eq "" -or $prop.Value -eq $null) {
        $emptyPropsMorning += $prop.Name
    }
}

if ($emptyPropsEspresso.Count -gt 0) {
    Write-Host "      Evening Espresso: $($emptyPropsEspresso.Count) empty properties" -ForegroundColor Red
    $emptyPropsEspresso | ForEach-Object { Write-Host "         - $_" -ForegroundColor Gray }
} else {
    Write-Host "      Evening Espresso: ✅ No empty properties" -ForegroundColor Green
}

if ($emptyPropsMorning.Count -gt 0) {
    Write-Host "      Morning Coffee: $($emptyPropsMorning.Count) empty properties" -ForegroundColor Red
    $emptyPropsMorning | ForEach-Object { Write-Host "         - $_" -ForegroundColor Gray }
} else {
    Write-Host "      Morning Coffee: ✅ No empty properties" -ForegroundColor Green
}

Write-Host ""

# ============================================
# ISSUE CATEGORY 2: White/Black in Dark Theme
# ============================================
Write-Host "   B. Checking for pure white/black issues:" -ForegroundColor Cyan

$whiteInDark = @()
$blackInLight = @()

foreach ($prop in $espresso.colors.PSObject.Properties) {
    if ($prop.Value -eq "#FFFFFF") {
        $whiteInDark += $prop.Name
    }
}

foreach ($prop in $morning.colors.PSObject.Properties) {
    if ($prop.Value -eq "#000000") {
        $blackInLight += $prop.Name
    }
}

if ($whiteInDark.Count -gt 0) {
    Write-Host "      Evening Espresso: ⚠️  $($whiteInDark.Count) pure white (#FFFFFF)" -ForegroundColor Red
    $whiteInDark | ForEach-Object { Write-Host "         - $_" -ForegroundColor Gray }
} else {
    Write-Host "      Evening Espresso: ✅ No pure white backgrounds" -ForegroundColor Green
}

if ($blackInLight.Count -gt 0) {
    Write-Host "      Morning Coffee: ⚠️  $($blackInLight.Count) pure black (#000000)" -ForegroundColor Red
    $blackInLight | ForEach-Object { Write-Host "         - $_" -ForegroundColor Gray }
} else {
    Write-Host "      Morning Coffee: ✅ No pure black text" -ForegroundColor Green
}

Write-Host ""

# ============================================
# ISSUE CATEGORY 3: Same Color for Background & Foreground
# ============================================
Write-Host "   C. Checking for same bg/fg (invisible text):" -ForegroundColor Cyan

$invisiblePairs = @()

# Common pairs to check
$pairsToCheck = @(
    @("input.background", "input.foreground"),
    @("list.hoverBackground", "list.hoverForeground"),
    @("list.focusBackground", "list.focusForeground"),
    @("quickInput.background", "quickInput.foreground"),
    @("dropdown.background", "dropdown.foreground"),
    @("button.background", "button.foreground"),
    @("button.secondaryBackground", "button.secondaryForeground"),
    @("menu.background", "menu.foreground"),
    @("editorWidget.background", "editorWidget.foreground"),
    @("statusBar.background", "statusBar.foreground"),
    @("sideBar.background", "sideBar.foreground"),
    @("panel.background", "panel.foreground"),
    @("titleBar.activeBackground", "titleBar.activeForeground")
)

function Remove-Opacity($color) {
    if ($color -match '^#[0-9A-Fa-f]{8}$') {
        return $color.Substring(0, 7)
    }
    return $color
}

foreach ($pair in $pairsToCheck) {
    $bgProp = $pair[0]
    $fgProp = $pair[1]
    
    # Check Evening Espresso
    $bgColor = $espresso.colors.$bgProp
    $fgColor = $espresso.colors.$fgProp
    
    if ($bgColor -and $fgColor) {
        $bgClean = Remove-Opacity $bgColor
        $fgClean = Remove-Opacity $fgColor
        
        if ($bgClean -eq $fgClean) {
            $invisiblePairs += "Evening Espresso: $bgProp = $fgProp ($bgColor)"
        }
    }
    
    # Check Morning Coffee
    $bgColor = $morning.colors.$bgProp
    $fgColor = $morning.colors.$fgProp
    
    if ($bgColor -and $fgColor) {
        $bgClean = Remove-Opacity $bgColor
        $fgClean = Remove-Opacity $fgColor
        
        if ($bgClean -eq $fgClean) {
            $invisiblePairs += "Morning Coffee: $bgProp = $fgProp ($bgColor)"
        }
    }
}

if ($invisiblePairs.Count -gt 0) {
    Write-Host "      ⚠️  Found $($invisiblePairs.Count) invisible text issues:" -ForegroundColor Red
    $invisiblePairs | ForEach-Object { Write-Host "         - $_" -ForegroundColor Gray }
} else {
    Write-Host "      ✅ No invisible text pairs found" -ForegroundColor Green
}

Write-Host ""

# ============================================
# ISSUE CATEGORY 4: Opacity Issues
# ============================================
Write-Host "   D. Checking opacity levels:" -ForegroundColor Cyan

$lowOpacityProps = @()

# Properties that should have visible opacity (30%+ for dark, 40%+ for light)
$opacityProps = @(
    "editor.selectionBackground",
    "editor.lineHighlightBackground",
    "list.hoverBackground",
    "list.activeSelectionBackground",
    "list.inactiveSelectionBackground",
    "editorLineNumber.activeForeground",
    "diffEditor.insertedTextBackground",
    "diffEditor.removedTextBackground"
)

foreach ($prop in $opacityProps) {
    # Check Evening Espresso (dark theme - min 30%)
    $color = $espresso.colors.$prop
    if ($color -and $color -match '#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})$') {
        $opacityHex = $Matches[1]
        $opacityPct = [int]"0x$opacityHex" / 255 * 100
        
        if ($opacityPct -lt 30) {
            $lowOpacityProps += "Evening Espresso: $prop = $color ($([int]$opacityPct)% - too low)"
        }
    }
    
    # Check Morning Coffee (light theme - min 40%)
    $color = $morning.colors.$prop
    if ($color -and $color -match '#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})$') {
        $opacityHex = $Matches[1]
        $opacityPct = [int]"0x$opacityHex" / 255 * 100
        
        if ($opacityPct -lt 40) {
            $lowOpacityProps += "Morning Coffee: $prop = $color ($([int]$opacityPct)% - too low)"
        }
    }
}

if ($lowOpacityProps.Count -gt 0) {
    Write-Host "      ⚠️  Found $($lowOpacityProps.Count) low opacity issues:" -ForegroundColor Red
    $lowOpacityProps | ForEach-Object { Write-Host "         - $_" -ForegroundColor Gray }
} else {
    Write-Host "      ✅ All opacity levels appropriate" -ForegroundColor Green
}

Write-Host ""

# ============================================
# ISSUE CATEGORY 5: Terminal ANSI Colors
# ============================================
Write-Host "   E. Checking terminal ANSI colors:" -ForegroundColor Cyan

$terminalProps = @(
    "terminal.ansiBlack",
    "terminal.ansiRed",
    "terminal.ansiGreen",
    "terminal.ansiYellow",
    "terminal.ansiBlue",
    "terminal.ansiMagenta",
    "terminal.ansiCyan",
    "terminal.ansiWhite",
    "terminal.ansiBrightBlack",
    "terminal.ansiBrightRed",
    "terminal.ansiBrightGreen",
    "terminal.ansiBrightYellow",
    "terminal.ansiBrightBlue",
    "terminal.ansiBrightMagenta",
    "terminal.ansiBrightCyan",
    "terminal.ansiBrightWhite"
)

$missingTerminal = @()

foreach ($prop in $terminalProps) {
    if (-not $espresso.colors.$prop) {
        $missingTerminal += "Evening Espresso: $prop"
    }
    if (-not $morning.colors.$prop) {
        $missingTerminal += "Morning Coffee: $prop"
    }
}

if ($missingTerminal.Count -gt 0) {
    Write-Host "      ⚠️  Missing terminal colors:" -ForegroundColor Red
    $missingTerminal | ForEach-Object { Write-Host "         - $_" -ForegroundColor Gray }
} else {
    Write-Host "      ✅ All terminal ANSI colors defined" -ForegroundColor Green
}

Write-Host ""

# ============================================
# ISSUE CATEGORY 6: Scrollbar Visibility
# ============================================
Write-Host "   F. Checking scrollbar visibility:" -ForegroundColor Cyan

$scrollbarIssues = @()

$scrollbarProps = @(
    "scrollbarSlider.background",
    "scrollbarSlider.hoverBackground",
    "scrollbarSlider.activeBackground"
)

foreach ($theme in @(@{name="Evening Espresso"; obj=$espresso}, @{name="Morning Coffee"; obj=$morning})) {
    foreach ($prop in $scrollbarProps) {
        if (-not $theme.obj.colors.$prop) {
            $scrollbarIssues += "$($theme.name): Missing $prop"
        }
    }
}

if ($scrollbarIssues.Count -gt 0) {
    Write-Host "      ⚠️  Scrollbar issues:" -ForegroundColor Red
    $scrollbarIssues | ForEach-Object { Write-Host "         - $_" -ForegroundColor Gray }
} else {
    Write-Host "      ✅ All scrollbar states defined" -ForegroundColor Green
}

Write-Host ""

# ============================================
# ISSUE CATEGORY 7: Bracket Matching Colors
# ============================================
Write-Host "   G. Checking bracket matching:" -ForegroundColor Cyan

$bracketProps = @(
    "editorBracketMatch.background",
    "editorBracketMatch.border",
    "editorBracketHighlight.foreground1",
    "editorBracketHighlight.foreground2",
    "editorBracketHighlight.foreground3"
)

$missingBrackets = @()

foreach ($theme in @(@{name="Evening Espresso"; obj=$espresso}, @{name="Morning Coffee"; obj=$morning})) {
    foreach ($prop in $bracketProps) {
        if (-not $theme.obj.colors.$prop) {
            $missingBrackets += "$($theme.name): Missing $prop"
        }
    }
}

if ($missingBrackets.Count -gt 0) {
    Write-Host "      ⚠️  Bracket matching issues:" -ForegroundColor Red
    $missingBrackets | ForEach-Object { Write-Host "         - $_" -ForegroundColor Gray }
} else {
    Write-Host "      ✅ All bracket colors defined" -ForegroundColor Green
}

Write-Host ""

# ============================================
# SUMMARY
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EVALUATION SUMMARY" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$totalIssues = $emptyPropsEspresso.Count + $emptyPropsMorning.Count + 
               $whiteInDark.Count + $blackInLight.Count + 
               $invisiblePairs.Count + $lowOpacityProps.Count + 
               $missingTerminal.Count + $scrollbarIssues.Count + 
               $missingBrackets.Count

Write-Host "Total Issues Found: $totalIssues" -ForegroundColor $(if ($totalIssues -eq 0) { "Green" } else { "Red" })
Write-Host ""
Write-Host "   Empty Properties: $($emptyPropsEspresso.Count + $emptyPropsMorning.Count)" -ForegroundColor Gray
Write-Host "   White/Black Issues: $($whiteInDark.Count + $blackInLight.Count)" -ForegroundColor Gray
Write-Host "   Invisible Text Pairs: $($invisiblePairs.Count)" -ForegroundColor Gray
Write-Host "   Low Opacity: $($lowOpacityProps.Count)" -ForegroundColor Gray
Write-Host "   Missing Terminal Colors: $($missingTerminal.Count)" -ForegroundColor Gray
Write-Host "   Scrollbar Issues: $($scrollbarIssues.Count)" -ForegroundColor Gray
Write-Host "   Bracket Issues: $($missingBrackets.Count)" -ForegroundColor Gray
Write-Host ""

if ($totalIssues -eq 0) {
    Write-Host "✅ Both Coffee themes passed deep evaluation!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Issues found - review and fix above" -ForegroundColor Yellow
}
