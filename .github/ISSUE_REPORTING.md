# GitHub Issue Reporting Setup

## Overview

This extension now has integrated GitHub issue reporting with pre-filled templates to help users report theme problems effectively.

## What Was Implemented

### 1. GitHub Issue Templates (`.github/ISSUE_TEMPLATE/`)

Created three issue templates:

- **`theme-issue.md`** - Main template for theme color/contrast problems
  - Pre-filled fields: Theme name, extension version, VS Code version
  - Sections: Issue description, code example, screenshots, additional context
  - Labels: `theme-issue`, `needs-triage`

- **`bug-report.md`** - For extension functionality bugs (not theme colors)
  - Fields: Bug description, steps to reproduce, environment info
  - Labels: `bug`, `needs-triage`

- **`feature-request.md`** - For new theme or feature suggestions
  - Fields: Feature description, use case, proposed solution, alternatives
  - Labels: `enhancement`

- **`config.yml`** - Issue template configuration with helpful links

### 2. VS Code Extension Integration

#### package.json
- Already had `repository` and `bugs` URLs configured
- Added new command: `tech_pro.report_issue`
- **Marketplace Integration**: VS Code automatically displays a "Report Issue" button on the extension's marketplace page using the `bugs.url` field

#### js/main.js & js/browser.js
- Added `reportIssue()` method that:
  1. Captures current theme name
  2. Gets extension version from THEME_CONFIG
  3. Gets VS Code version
  4. Opens GitHub issue form with pre-filled information
  5. Shows confirmation dialog before opening browser

## How Users Report Issues

### Method 1: Via Command Palette (Recommended)
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: `M Tech Themes: report an issue`
3. Click "Open GitHub Issue Form" in the confirmation dialog
4. Browser opens with theme name, version info pre-filled
5. User adds their specific problem details and screenshots

### Method 2: Via VS Code Marketplace
1. Go to Extensions panel
2. Click on M Tech Themes extension
3. Click "Report Issue" button (automatically shown by VS Code)
4. Opens GitHub issues page

### Method 3: Directly on GitHub
1. Visit: https://github.com/ChrisMcKee1/mtech-pro-vscode-themes/issues
2. Click "New Issue"
3. Choose from the three templates

## Pre-filled Information

When using the extension command, the GitHub issue form includes:

```
Theme Name: [current active theme]
Extension Version: [from THEME_CONFIG.version]
VS Code Version: [from vscode.version]
```

Plus template sections for:
- Which element has the problem
- What's wrong with it
- Code example (language + sample)
- Screenshots (required)
- Expected behavior
- Whether it happens in multiple languages

## Template Fields Explained

The theme issue template asks for:

1. **Theme Name** - Which of the 21 themes has the problem
2. **Extension Version** - To track if it's a regression or existing issue
3. **Element Type** - Comments, selection, scrollbars, diffs, syntax highlighting
4. **Description** - Clear explanation of the visual problem
5. **Code Example** - Reproduces the exact highlighting issue
6. **Screenshots** - Visual proof (required for theme issues)
7. **Expected Behavior** - What should it look like
8. **Scope** - One file or multiple languages

## Developer Notes

### Maintaining Templates

Issue templates are in `.github/ISSUE_TEMPLATE/`:
- Edit markdown files to change template structure
- Add/remove labels in YAML frontmatter
- Update `config.yml` to add more helpful links

### Updating Pre-filled Content

Edit the `reportIssue()` method in both:
- `js/main.js` (desktop VS Code)
- `js/browser.js` (web-based VS Code - vscode.dev)

### URL Encoding

The issue URL uses `encodeURIComponent()` for:
- `title` parameter - issue title
- `body` parameter - full issue body with template
- `labels` parameter - comma-separated labels

Example generated URL:
```
https://github.com/ChrisMcKee1/mtech-pro-vscode-themes/issues/new
  ?title=[THEME]%20Issue%20with%20Arctic%20Nord
  &body=[full template with pre-filled info]
  &labels=theme-issue,needs-triage
```

### Testing the Command

1. Reload the extension window (F5 in development)
2. Run `M Tech Themes: report an issue` from command palette
3. Verify pre-filled information matches current theme
4. Check that GitHub opens with correct labels

## Benefits

✅ **Lower friction** - Users don't need to manually fill version info  
✅ **Better bug reports** - Template guides users to provide needed info  
✅ **Faster triage** - Labels auto-applied, info structured consistently  
✅ **Screenshot emphasis** - Template stresses visual proof requirement  
✅ **Multiple entry points** - Command palette, marketplace, or GitHub directly  

## Future Enhancements

Potential improvements:
- [ ] Add option to automatically capture/attach screenshot
- [ ] Include active file language in pre-fill
- [ ] Add button to theme selector UI for quick issue reporting
- [ ] Create accessibility-specific issue template
- [ ] Add diagnostic info (GPU acceleration, zoom level, etc.)
