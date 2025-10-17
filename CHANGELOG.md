# M Tech Themes for Visual Studio Code Changelog

## Changelog

### 0.5.10 - Arctic Nord UI Menu & Selection Fixes

**🔧 Critical Menu Text Visibility Fix**
- **Fixed**: Arctic Nord - Context menu and menubar text now readable when hovering/selecting (white-on-light issue resolved)
- **Root Cause**: Missing `menu.selectionBackground` and incorrect white text color on light selection backgrounds
- **Changes**:
  - Added `menu.selectionBackground`: `#ECEFF4` (light gray)
  - Fixed `menu.selectionForeground`: `#FFFFFF` → `#2E3440` (white to dark)
  - Added `menubar.selectionBackground`: `#ECEFF4` (light gray)
  - Fixed `menubar.selectionForeground`: `#FFFFFF` → `#2E3440` (white to dark)
  - Fixed `editor.selectionBackground`: `#88c0d0cc` → `#5E81ACcc` (lighter cyan to darker blue for better text contrast)
  - Fixed `editor.selectionHighlightBackground`: Adjusted proportionally
  - Fixed `editor.inactiveSelectionBackground`: Adjusted proportionally

**📚 Documentation Consolidation**
- **Removed**: Redundant documentation files (THEME_CONTRAST_GUIDELINES_V2_SUMMARY.md, VSCODE_THEME_RESEARCH_FINDINGS.md)
- **Retained**: THEME_CONTRAST_GUIDELINES.md (comprehensive reference), THEME_IMPROVEMENTS_ANALYSIS.md (detailed analysis)
- **Result**: Cleaner documentation structure with no duplication

### 0.5.8 - Arctic Nord GitLens Fix & VS Code Theme Compliance

**🔧 Critical GitLens Fix**
- **Fixed**: Arctic Nord Dark - GitLens commit row hover text now readable (white-on-white issue resolved)
- **Root Cause**: `list.focusForeground` was overriding `list.hoverForeground` when rows had both focus and hover states
- **Solution**: Changed `list.focusForeground` from `#FFFFFF` to `#ECEFF4` (Nord Snow Storm) for proper contrast

**🎨 VS Code Theme Property Compliance**
- **Removed**: Invalid theme properties `scmGraph.historyItemHoverBackground` and `scmGraph.historyItemHoverForeground` (not official VS Code properties)
- **Research**: Comprehensive analysis of official VS Code Theme Color Reference documentation
- **Finding**: GitLens commit rows use standard list properties, not custom scmGraph hover properties

**✨ Arctic Nord Enhancements (Both Dark & Light)**
- **Added**: `list.focusAndSelectionOutline` - Nord Frost blue outline for selected+focused items
- **Added**: `list.focusOutline` - Visible focus indicators matching Nordic aesthetic
- **Added**: `list.activeSelectionIconForeground` - Icon colors for selected items
- **Added**: `list.inactiveSelectionIconForeground` - Icon colors for inactive selections
- **Added**: `list.inactiveFocusBackground` - Distinct background for inactive focus states
- **Added**: `list.inactiveFocusOutline` - Subtle outline for inactive focus
- **Optimized**: All scmGraph colors now use official Nord palette (Nord 0-15 specification)
  - `scmGraph.foreground2`: Updated to Nord 12 Orange (`#D08770`)
  - `scmGraph.foreground3`: Updated to Nord 13 Yellow (`#EBCB8B`)
  - `scmGraph.foreground4`: Updated to Nord 14 Green (`#A3BE8C`)
  - `scmGraph.foreground5`: Updated to Nord Frost Blue (`#88C0D0` dark, `#5E81AC` light)
  - `scmGraph.historyItemRefColor`: Updated to Nord 15 Purple (`#B48EAD`)
- **Standardized**: `list.highlightForeground` now uses Nord Frost blue for consistency
- **Standardized**: `list.warningForeground` now uses proper Nord 13 Yellow (`#EBCB8B`)
- **Improved**: `quickInput.foreground` uses darker Nord colors for better readability

**📚 Documentation Research**
- Fetched and analyzed official VS Code Theme Color Reference (https://code.visualstudio.com/api/references/theme-color)
- Identified all valid scmGraph properties vs. invalid custom properties
- Confirmed GitLens uses standard list/tree properties for commit row rendering
- Property precedence: focus state can override hover state without proper configuration

**🎯 Arctic Nord Palette Compliance**
All changes maintain strict adherence to official Nord color specification:
- Polar Night (dark backgrounds): nord0-nord3
- Snow Storm (light backgrounds): nord4-nord6
- Frost (blue accents): nord7-nord10
- Aurora (colorful accents): nord11-nord15

### 0.2.3 - Cosmic Void Visibility Fixes

**🔧 Bug Fixes**
- **Fixed**: Cosmic Void selected item text visibility issues - improved contrast for better readability
- **Fixed**: Cosmic Void warning/error annotations now distinct from scrollbar colors - addresses accessibility concerns for users over 50
- **Enhanced**: Scrollbar colors made more opaque and distinct from error indicators
- **Improved**: Overview ruler and minimap error/warning colors for better visibility
- **Addresses**: GitHub issues [#1](https://github.com/ChrisMcKee1/mtech-pro-vscode-themes/issues/1) and [#2](https://github.com/ChrisMcKee1/mtech-pro-vscode-themes/issues/2)

### 0.1.0 - Fresh Start & New Brand

**🚀 Brand New Release - M Tech Themes**
- **Rebranded**: Complete rebrand from M Tech Pro to M Tech Themes
- **Fresh Start**: Reset to version 0.1.0 for a new beginning
- **Simplified Package**: New package name `theme-m-tech-vscode`
