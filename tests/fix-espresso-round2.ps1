# Fix Evening Espresso - White backgrounds and text color issues
# Issues from user screenshots:
# 1. White backgrounds in inputs, settings, notebooks (#FFFFFF)
# 2. Invisible text (quickInput.foreground = #3E2723 on #3E2723 background)
# 3. Light cream text hard to read in some contexts

$espressoPath = "..\themes\Evening Espresso.json"
$content = Get-Content $espressoPath -Raw

Write-Host "Fixing Evening Espresso - Round 2..." -ForegroundColor Cyan
Write-Host ""

# ============================================
# FIX WHITE BACKGROUNDS (7 instances)
# ============================================
Write-Host "1. Fixing white backgrounds..." -ForegroundColor Yellow

# Input fields should be dark espresso, not white
$content = $content -replace '"input\.background":\s*"#FFFFFF"', '"input.background": "#2B1810"'

# Notebook editor should be dark
$content = $content -replace '"notebook\.cellEditorBackground":\s*"#FFFFFF"', '"notebook.cellEditorBackground": "#1A0F0A"'

# Settings inputs should be dark
$content = $content -replace '"settings\.checkboxBackground":\s*"#FFFFFF"', '"settings.checkboxBackground": "#2B1810"'
$content = $content -replace '"settings\.dropdownBackground":\s*"#FFFFFF"', '"settings.dropdownBackground": "#2B1810"'
$content = $content -replace '"settings\.numberInputBackground":\s*"#FFFFFF"', '"settings.numberInputBackground": "#2B1810"'
$content = $content -replace '"settings\.textInputBackground":\s*"#FFFFFF"', '"settings.textInputBackground": "#2B1810"'

# Walkthrough editor should be dark
$content = $content -replace '"walkThrough\.embeddedEditorBackground":\s*"#FFFFFF"', '"walkThrough.embeddedEditorBackground": "#1A0F0A"'

Write-Host "   ✅ Fixed 7 white backgrounds → dark coffee/espresso" -ForegroundColor Green

# ============================================
# FIX TEXT COLOR ISSUES
# ============================================
Write-Host ""
Write-Host "2. Fixing text colors..." -ForegroundColor Yellow

# CRITICAL: quickInput.foreground is same as background (invisible text!)
# Should be cream text on dark background
$content = $content -replace '"quickInput\.foreground":\s*"#3E2723"', '"quickInput.foreground": "#F5EFE7"'

# List foreground should be clearly visible
$content = $content -replace '"list\.foreground":\s*"#F5EFE7"', '"list.foreground": "#E6D7C8"'

# Dropdown foreground might need adjustment
$content = $content -replace '"dropdown\.foreground":\s*"#F5EFE7"', '"dropdown.foreground": "#E6D7C8"'

# Input option hover issues - foreground shouldn't match background
$content = $content -replace '"inputOption\.hoverBackground":\s*"#F5EFE7"', '"inputOption.hoverBackground": "#4A3228"'
$content = $content -replace '"inputOption\.hoverForeground":\s*"#F5EFE7"', '"inputOption.hoverForeground": "#F5EFE7"'

# Menu foreground for better readability
$content = $content -replace '"menu\.foreground":\s*"#F5EFE7"', '"menu.foreground": "#E6D7C8"'

# Settings foreground adjustments
$content = $content -replace '"settings\.dropdownForeground":\s*"#F5EFE7"', '"settings.dropdownForeground": "#E6D7C8"'

Write-Host "   ✅ Fixed invisible/hard-to-read text colors" -ForegroundColor Green

# ============================================
# FIX LIST ICON FOREGROUND
# ============================================
Write-Host ""
Write-Host "3. Fixing list icon colors..." -ForegroundColor Yellow

# list.activeSelectionIconForeground should be light, not dark
$content = $content -replace '"list\.activeSelectionIconForeground":\s*"#3E2723"', '"list.activeSelectionIconForeground": "#F5EFE7"'

Write-Host "   ✅ Fixed list icon visibility" -ForegroundColor Green

# ============================================
# VERIFY INPUT FOREGROUND
# ============================================
Write-Host ""
Write-Host "4. Verifying input text is light on dark backgrounds..." -ForegroundColor Yellow

# Ensure input.foreground is cream (should already be, but verify)
if ($content -match '"input\.foreground":\s*"#F5EFE7"') {
    Write-Host "   ✅ input.foreground is correct (#F5EFE7)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Fixing input.foreground" -ForegroundColor Yellow
    $content = $content -replace '"input\.foreground":\s*"[^"]*"', '"input.foreground": "#F5EFE7"'
}

# Save
Set-Content -Path $espressoPath -Value $content -NoNewline

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FIXES COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Changes made:" -ForegroundColor White
Write-Host "  1. Fixed 7 white backgrounds:" -ForegroundColor Gray
Write-Host "     - input.background: #FFFFFF → #2B1810" -ForegroundColor Gray
Write-Host "     - notebook.cellEditorBackground: #FFFFFF → #1A0F0A" -ForegroundColor Gray
Write-Host "     - settings inputs (4): #FFFFFF → #2B1810" -ForegroundColor Gray
Write-Host "     - walkThrough.embeddedEditorBackground: #FFFFFF → #1A0F0A" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Fixed invisible/hard-to-read text:" -ForegroundColor Gray
Write-Host "     - quickInput.foreground: #3E2723 → #F5EFE7 (was invisible!)" -ForegroundColor Gray
Write-Host "     - list/dropdown/menu foreground: #F5EFE7 → #E6D7C8 (better contrast)" -ForegroundColor Gray
Write-Host "     - list.activeSelectionIconForeground: #3E2723 → #F5EFE7" -ForegroundColor Gray
Write-Host ""
Write-Host "Next: Rebuild VSIX and test!" -ForegroundColor Yellow
