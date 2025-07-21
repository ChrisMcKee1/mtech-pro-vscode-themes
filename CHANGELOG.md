# M Tech Themes for Visual Studio Code Changelog

## Changelog

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

### 2.2.0 - Theme Revolution & Enhanced Experience (Legacy)

**🎨 Major Theme Naming Simplification**
- **BREAKING**: Simplified all theme names by removing redundant "M Tech Pro" prefix
  - `M Tech Pro (Arctic Nord)` → `Arctic Nord`
  - `M Tech Pro Light` → `Light`
  - `M Tech Classic` → `Classic`
  - And all other themes follow this cleaner naming pattern
- **Benefit**: Cleaner VS Code theme selector, reduced visual noise

**✨ New Themes & Variants**
- **New**: `Tokyo Day` - Bright urban daytime counterpart to Tokyo Night
- **New**: `Filter Moon` - Cool moonlit dark theme counterpart to Filter Sun
- **New**: `Enchanted Grove Dark` - Dark forest atmosphere variant
- **New**: `Feisty Fusion Light` - Light mode variant of the energetic Feisty Fusion theme
- **New**: `Cyberpunk Neon Light` - Light mode variant of the vibrant Cyberpunk Neon theme
- **New**: `Cosmic Void Light` - Light mode variant of the deep space Cosmic Void theme
- **Enhanced**: Improved comment accessibility in Arctic Nord theme

**🔧 Enhanced Extension Capabilities**
- **New**: Status bar integration showing current M Tech theme
- **New**: Categorized theme picker (Dark Themes / Light Themes)
- **New**: Enhanced theme descriptions and quick pick interface
- **New**: Workspace-aware theme preferences
- **New**: Improved error handling and user notifications
- **New**: Better icon theme matching logic with monochrome support
- **New**: Matching icon themes for all new light variants (Feisty Fusion Light Icons, Cyberpunk Neon Light Icons, Cosmic Void Light Icons)

**♿ Accessibility Improvements**
- Enhanced comment contrast in Arctic Nord theme (`#81a1c1` vs previous `#4c566a`)
- Improved readability across all themes while maintaining design integrity
- Better color contrast ratios following WCAG guidelines for developer-focused usage

**🛠️ Technical Improvements**
- Refactored extension architecture for better performance
- Enhanced configuration change detection
- Improved async/await patterns for theme switching
- Better state management between workspace and global settings
- Enhanced error recovery and user feedback

**📦 File Structure Updates**
- All theme files renamed to match new simplified naming
- All icon theme files updated accordingly
- Package.json completely updated with new theme references
- Extension commands enhanced for better user experience

**🔄 Migration Notes**
- Existing users will see cleaner theme names in their VS Code theme selector
- Previously selected themes will continue to work with new names
- Icon themes automatically match the selected color theme
- Status bar indicator helps identify when M Tech themes are active

### 2.1.0

Just adding a Change log for future use