---
description: "Use when writing or editing JavaScript files. Enforces commenting style: short inline comments only, no JSDoc, no comment blocks, no decorative separators."
applyTo: "**/*.js"
---
# JavaScript Commenting Style

## Rules

- Use short inline `//` comments only — placed on their own line above the code they describe
- Never add JSDoc (`/** */`), block comments (`/* */`), or decorative separators (`// ======`, `// ------`)
- Never add comments to code you didn't change
- Comments explain **why**, not **what** — skip comments that just restate the code
- Keep comments to a single line; if you need more, the code should be clearer instead

## Examples

Good:
```js
// Prevent re-entrant calls from configuration change listener
if (this._applyingTheme) {
    return;
}

// Always use standard icons, ignoring monochrome preference
const iconTheme = resolveMatchingIconTheme(selection.label, { preferMonochrome: false });
```

Bad:
```js
/**
 * Applies the given theme to the workbench.
 * @param {string} themeName - The name of the theme to apply
 * @param {object} previousState - The previous state
 * @returns {Promise<void>}
 */
async applyTheme(themeName, previousState = {}) {

// ============================================
// Theme Application Logic
// ============================================

// Set the applyingTheme flag to true
this._applyingTheme = true;
```
