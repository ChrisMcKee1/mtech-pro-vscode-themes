# Fix Scrollbar Opacity for All Themes
# Applies theme-appropriate semi-transparent scrollbars (25%/40%/50-80%)
# Respects each theme's unique color identity

$themesDir = Join-Path $PSScriptRoot "..\themes"
$themes = Get-ChildItem -Path $themesDir -Filter "*.json"

Write-Host "=== Scrollbar Opacity Fix ===" -ForegroundColor Cyan
Write-Host "Processing $($themes.Count) themes..." -ForegroundColor Yellow
Write-Host ""

# Theme-specific scrollbar configurations
# Format: @{ background, hover, active } with theme-appropriate colors
$scrollbarConfigs = @{
    "Arctic Nord.json" = @{
        background = "#4C566A40"    # Nord Polar Night 2, 25%
        hover = "#D8DEE966"          # Nord Snow Storm 2, 40%
        active = "#88C0D080"         # Nord Frost cyan, 50%
        reason = "Nord palette: gray/snow/frost progression"
    }
    "Arctic Nord Light.json" = @{
        background = "#4C566A40"     # Nord Polar Night 2, 25%
        hover = "#2E344099"          # Nord Polar Night 1, 60%
        active = "#5E81AC99"         # Nord blue, 60%
        reason = "Light theme needs darker scrollbar for visibility"
    }
    "Chroma Void.json" = @{
        background = "#70707040"     # Already correct: 25%
        hover = "#70707060"          # Already correct: 38%
        active = "#70707080"         # Already correct: 50%
        reason = "Already uses proper translucent gray - SKIP"
    }
    "Copper Bloom.json" = @{
        background = "#5b535340"     # Copper brown, 25%
        hover = "#72696a66"          # Copper medium, 40%
        active = "#c3b7b880"         # Copper light, 50%
        reason = "Copper-toned scrollbars matching theme warmth"
    }
    "Cosmic Void.json" = @{
        background = "#47556940"     # Slate gray, 25%
        hover = "#7C8CA166"          # Slate blue-gray, 40%
        active = "#7C8CA180"         # Already correct: 50%
        reason = "Cosmic slate progression"
    }
    "Cosmic Void Light.json" = @{
        background = "#1E293B40"     # Already correct: 25%
        hover = "#1E293B99"          # Already correct: 60%
        active = "#1E293B8C"         # Already correct: 55%
        reason = "Already uses proper translucent slate - SKIP"
    }
    "Cyberpunk Neon.json" = @{
        background = "#33333340"     # Dark gray, 25%
        hover = "#77777766"          # Medium gray, 40%
        active = "#00ff9980"         # Neon cyan, 50%
        reason = "Cyberpunk: neutral base with neon active state"
    }
    "Digital Aqua.json" = @{
        background = "#1e252e40"     # Deep blue-gray, 25%
        hover = "#2d3a4666"          # Medium blue-gray, 40%
        active = "#4dd0e180"         # Aqua cyan, 50%
        reason = "Aqua theme: blue-gray with cyan accent"
    }
    "Enchanted Grove.json" = @{
        background = "#34593340"     # Forest green, 25%
        hover = "#4a755066"          # Medium green, 40%
        active = "#a3be8c80"         # Light green, 50%
        reason = "Forest theme: earthy greens"
    }
    "Enchanted Grove Dark.json" = @{
        background = "#1a2a1a40"     # Dark forest, 25%
        hover = "#2d4a2d66"          # Medium forest, 40%
        active = "#a3be8c80"         # Light green, 50%
        reason = "Dark forest theme: deeper greens"
    }
    "Evening Espresso.json" = @{
        background = "#3c2f2f40"     # Coffee brown, 25%
        hover = "#5a474766"          # Medium brown, 40%
        active = "#c4a57b80"         # Cream, 50%
        reason = "Espresso theme: warm coffee tones"
    }
    "Feisty Fusion.json" = @{
        background = "#2a2a2e40"     # Dark gray, 25%
        hover = "#9cd1bb66"          # Fusion cyan, 40%
        active = "#ff9b5e80"         # Fusion orange, 50%
        reason = "Fusion theme: cool cyan hover, warm orange active"
    }
    "Feisty Fusion Light.json" = @{
        background = "#2a2a2e40"     # Dark overlay, 25%
        hover = "#50a39966"          # Darker cyan, 40%
        active = "#e8844c99"         # Darker orange, 60%
        reason = "Light fusion: darker accents for visibility"
    }
    "Graphite Bay.json" = @{
        background = "#37414b40"     # Blue-gray, 25%
        hover = "#4d5f6f66"          # Medium blue-gray, 40%
        active = "#7fa2b880"         # Bay blue, 50%
        reason = "Bay theme: cool blue-gray progression"
    }
    "Morning Coffee.json" = @{
        background = "#3e322640"     # Coffee brown, 25%
        hover = "#5a453466"          # Medium brown, 40%
        active = "#d4a57480"         # Cream, 50%
        reason = "Coffee theme: warm brown tones"
    }
    "Mystic Dusk.json" = @{
        background = "#2d2a3e40"     # Purple-gray, 25%
        hover = "#3d3a5266"          # Medium purple-gray, 40%
        active = "#b4a0d680"         # Mystic purple, 50%
        reason = "Mystic theme: purple-gray progression"
    }
    "Neon Pink Light.json" = @{
        background = "#2a2a2e40"     # Dark overlay, 25%
        hover = "#ff55aa99"          # Neon pink, 60%
        active = "#ff2288CC"         # Hot pink, 80%
        reason = "Neon light theme: high contrast pink accents"
    }
    "Obsidian Moss.json" = @{
        background = "#2d3a2d40"     # Moss green-gray, 25%
        hover = "#3d4a3d66"          # Medium moss, 40%
        active = "#8fa38f80"         # Light moss, 50%
        reason = "Obsidian moss: earthy green-gray"
    }
    "OGE Dark.json" = @{
        background = "#2a2d3140"     # Dark blue-gray, 25%
        hover = "#3d434d66"          # Medium gray, 40%
        active = "#6b89a680"         # OGE blue, 50%
        reason = "OGE dark: blue-gray progression"
    }
    "OGE Light.json" = @{
        background = "#2a2d3140"     # Dark overlay, 25%
        hover = "#3d434d99"          # Dark gray, 60%
        active = "#4a6d8cCC"         # OGE blue, 80%
        reason = "OGE light: dark overlays for visibility"
    }
    "Sandstone Light.json" = @{
        background = "#a0826040"     # Sandstone tan, 25%
        hover = "#8a704e99"          # Darker tan, 60%
        active = "#6d5838CC"         # Dark brown, 80%
        reason = "Sandstone light: warm tan progressively darker"
    }
    "Tokyo Day.json" = @{
        background = "#8c868040"     # Light gray, 25%
        hover = "#5a586099"          # Medium gray, 60%
        active = "#3a3a4cCC"         # Dark blue-gray, 80%
        reason = "Tokyo day: light to dark progression"
    }
    "Tokyo Night.json" = @{
        background = "#414a6640"     # Tokyo blue-gray, 25%
        hover = "#545c7b66"          # Medium blue, 40%
        active = "#7aa2f780"         # Tokyo cyan, 50%
        reason = "Tokyo night: neon-soaked blue progression"
    }
}

$updated = 0
$skipped = 0
$errors = 0

foreach ($themeFile in $themes) {
    $themeName = $themeFile.Name
    Write-Host "Processing: $themeName" -ForegroundColor White
    
    # Check if we have a config for this theme
    if (-not $scrollbarConfigs.ContainsKey($themeName)) {
        Write-Host "  ⚠️  No config defined - SKIPPING" -ForegroundColor Yellow
        $skipped++
        Write-Host ""
        continue
    }
    
    $config = $scrollbarConfigs[$themeName]
    
    # Check if theme should be skipped (already correct)
    if ($config.reason -like "*SKIP*") {
        Write-Host "  ✓ Already correct - SKIPPING" -ForegroundColor Green
        Write-Host "    Reason: $($config.reason)" -ForegroundColor DarkGray
        $skipped++
        Write-Host ""
        continue
    }
    
    try {
        $filePath = $themeFile.FullName
        $content = Get-Content -Path $filePath -Raw
        
        # Parse JSON to verify it's valid
        $json = $content | ConvertFrom-Json
        
        # Check if scrollbar properties exist
        if (-not $json.colors.PSObject.Properties['scrollbarSlider.background']) {
            Write-Host "  ⚠️  No scrollbar properties found - SKIPPING" -ForegroundColor Yellow
            $skipped++
            Write-Host ""
            continue
        }
        
        # Store original values for reporting
        $originalBg = $json.colors.'scrollbarSlider.background'
        $originalHover = $json.colors.'scrollbarSlider.hoverBackground'
        $originalActive = $json.colors.'scrollbarSlider.activeBackground'
        
        # Apply new values
        $json.colors.'scrollbarSlider.background' = $config.background
        $json.colors.'scrollbarSlider.hoverBackground' = $config.hover
        $json.colors.'scrollbarSlider.activeBackground' = $config.active
        
        # Convert back to JSON with proper formatting
        $newContent = $json | ConvertTo-Json -Depth 100
        
        # Write back to file
        Set-Content -Path $filePath -Value $newContent -NoNewline
        
        Write-Host "  ✓ Updated scrollbar properties" -ForegroundColor Green
        Write-Host "    Strategy: $($config.reason)" -ForegroundColor DarkGray
        Write-Host "    background:      $originalBg → $($config.background)" -ForegroundColor DarkGray
        Write-Host "    hoverBackground: $originalHover → $($config.hover)" -ForegroundColor DarkGray
        Write-Host "    activeBackground: $originalActive → $($config.active)" -ForegroundColor DarkGray
        
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
Write-Host "⊘ Skipped: $skipped themes" -ForegroundColor Yellow
Write-Host "✗ Errors:  $errors themes" -ForegroundColor Red
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: cd tests && .\run-tests.cmd --quick" -ForegroundColor White
Write-Host "2. Manual test: Reload VS Code window (F1 → Developer: Reload Window)" -ForegroundColor White
Write-Host "3. Verify scrollbar visibility over diffs in Arctic Nord" -ForegroundColor White
