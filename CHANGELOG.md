# M Tech Pro for Visual Studio Code Changelog

## Changelog

### 2.2.0 - Theme Revolution & Enhanced Experience

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
- **Enhanced**: Improved comment accessibility in Arctic Nord theme

**🔧 Enhanced Extension Capabilities**
- **New**: Status bar integration showing current M Tech theme
- **New**: Categorized theme picker (Dark Themes / Light Themes)
- **New**: Enhanced theme descriptions and quick pick interface
- **New**: Workspace-aware theme preferences
- **New**: Improved error handling and user notifications
- **New**: Better icon theme matching logic with monochrome support

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