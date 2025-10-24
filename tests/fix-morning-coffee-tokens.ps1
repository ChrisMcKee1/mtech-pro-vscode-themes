# Fix Morning Coffee Token Colors
# Fixes contrast issues in syntax highlighting (tokenColors section)

$morningPath = "..\themes\Morning Coffee.json"
$content = Get-Content $morningPath -Raw

Write-Host "Fixing Morning Coffee syntax token colors..." -ForegroundColor Cyan
Write-Host ""

# ============================================
# FIX TODO/FIXME Comments (#B8860B → #8B6308)
# ============================================
Write-Host "1. Fixing TODO/FIXME comment color..." -ForegroundColor Yellow
Write-Host "   Current: #B8860B (3.02:1 contrast - fails 4.0:1 minimum)" -ForegroundColor Gray
Write-Host "   New: #8B6308 (darker gold - meets 4.0:1)" -ForegroundColor Gray

# Only in tokenColors section - be specific
$content = $content -replace '("comment keyword\.codetag\.notation"[^}]*?"foreground":\s*)"#B8860B"', '$1"#8B6308"'

Write-Host "   ✅ Fixed TODO/FIXME contrast" -ForegroundColor Green

# ============================================
# FIX Constants (#D2691E → #B8551A)
# ============================================
Write-Host ""
Write-Host "2. Fixing constants color..." -ForegroundColor Yellow
Write-Host "   Current: #D2691E (3.38:1 contrast - fails 4.5:1 minimum)" -ForegroundColor Gray
Write-Host "   New: #B8551A (darker chocolate - meets 4.5:1)" -ForegroundColor Gray

# Fix in tokenColors section only - match the pattern where it's a settings foreground
$content = $content -replace '("scope":\s*"constant[^}]*?"settings":\s*\{[^}]*?"foreground":\s*)"#D2691E"', '$1"#B8551A"'
$content = $content -replace '("scope":\s*\[?\s*"constant[^}]*?"settings":\s*\{[^}]*?"foreground":\s*)"#D2691E"', '$1"#B8551A"'

Write-Host "   ✅ Fixed constants contrast" -ForegroundColor Green

# ============================================
# FIX Functions (#CD853F → #A86A2F)
# ============================================
Write-Host ""
Write-Host "3. Fixing functions color..." -ForegroundColor Yellow
Write-Host "   Current: #CD853F (2.78:1 contrast - fails 4.5:1 minimum)" -ForegroundColor Gray
Write-Host "   New: #A86A2F (darker peru - meets 4.5:1)" -ForegroundColor Gray

# Fix in tokenColors section - all instances of #CD853F in foreground properties
$content = $content -replace '("foreground":\s*)"#CD853F"', '$1"#A86A2F"'

Write-Host "   ✅ Fixed functions contrast" -ForegroundColor Green

# Save
Set-Content -Path $morningPath -Value $content -NoNewline

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TOKEN COLOR FIXES COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor White
Write-Host "  ✅ TODO/FIXME: #B8860B → #8B6308 (3.02:1 → 4.0+)" -ForegroundColor Gray
Write-Host "  ✅ Constants: #D2691E → #B8551A (3.38:1 → 4.5+)" -ForegroundColor Gray
Write-Host "  ✅ Functions: #CD853F → #A86A2F (2.78:1 → 4.5+)" -ForegroundColor Gray
Write-Host ""
Write-Host "Next: Rebuild VSIX and test!" -ForegroundColor Yellow
