# M Tech Themes - Custom Instructions for AI Coding Agents

## Overview

This VS Code extension provides 31 professional color themes with matching icon packs, distributed as VSIX via GitHub releases. These instructions help AI agents understand the codebase architecture, maintain consistency, and follow accessibility best practices when modifying or creating themes.

**Purpose**: Guide AI coding agents to be immediately productive in this codebase by providing essential knowledge about architecture patterns, critical workflows, and project-specific conventions that aren't obvious from file inspection alone.

## Quick Reference

**Key Files**: `package.json`, `js/shared/themeConfig.js`, `js/main.js`, `js/browser.js`, `themes/*.json`, `icon-themes/*.json`  
**Last committed theme refresh**: 0.14.6; read `package.json` for the current version  
**Last reviewed VS Code stable baseline**: 1.133, with two separately tracked preview chat-find keys (engine target `^1.94.0`)  
**Theme snapshot at 0.14.6**: 31 color themes / 61 icon themes / 954 color keys per theme; recompute full key sets for each maintenance run  
**Test Command**: `cd tests && .\run-tests.cmd [--quick|--contrast|--status|--full]`  
**Theme Preview**: F1 → "Developer: Reload Window"  
**Repository**: [mtech-pro-vscode-themes](../README.md)  
**Test Documentation**: `tests/TEST_SUITE_DOCUMENTATION.md`  
**Latest Improvements**: `IMPROVEMENTS_v0.11.0.md`

## Custom Agent Runtime Contract

The four roles have separate host-targeted profiles in `.github/agents`. Keep each pair's Markdown body identical; only the host-specific frontmatter should differ.

| Host | Profile files | Target | Model spelling |
| --- | --- | --- | --- |
| VS Code Local | Original `*.agent.md` files without the `-copilot` suffix | `vscode` | `GPT-6 Astra (copilot)` |
| Copilot CLI/app/cloud | `*-copilot.agent.md` | `github-copilot` | `gpt-6-astra` |

Use `M-Tech-Theme-Engineer` in the VS Code Local picker and `m-tech-theme-engineer-copilot` for the app automation or CLI. The Copilot specialists are `theme-analyst-copilot`, `ui-ux-expert-copilot`, and `theme-implementer-copilot`. A Copilot/Agent Host session inside VS Code is not the Local harness; select the profile for the executing runtime, not merely the window hosting it.

For CLI selection, use the filename stem, for example `copilot --agent m-tech-theme-engineer-copilot --model gpt-6-astra`. The weekly app workflow must also set `model: gpt-6-astra` and select that coordinator. Explicit per-call and user-level subagent overrides can outrank profile settings: request Astra for delegated calls where supported, report conflicting routing, and never substitute another model family to get an unattended run working.

VS Code Local resolves model display/qualified names, not the CLI's canonical ID. These profiles intentionally use a single model string: CLI 1.0.83 added model lists and `model-policy: required` on September 4, but an app's bundled runtime or the cloud service may differ. Do not add version-gated fields to every profile or claim a portable fail-closed model policy.

The coordinator is explicitly selectable but not automatically inferred as a subagent. Specialists remain manually selectable and available for delegation. VS Code's `agents` allowlist and non-submitting handoffs are Local metadata; Copilot profiles instead use the documented common fields and a bounded routing contract. Specialists have no delegation tool. Do not rely on unverified CLI enforcement of VS Code-only attributes.

Tool lists use scoped capabilities rather than user-specific Azure/MCP installations. VS Code's auditor additionally enables its `browser` tools. GitHub cloud currently does not map the `web` and `todo` aliases; use permitted read-only source retrieval via execution or a concise checklist when needed. Unavailable tools are not automatically installed. Shell access is not an enforceable read-only boundary, even for a profile without `edit`.

Before unattended use, inspect the loaded file origins, available tools, and model selection in VS Code's customizations diagnostics or the corresponding host. Restart CLI sessions to discover new profiles; do not assume an existing session hot-reloads them. YAML parsing confirms structure, not runtime model entitlement, effective overrides, or successful execution. Report those limits honestly.

References reviewed September 4, 2026:
- [VS Code custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [VS Code subagents](https://code.visualstudio.com/docs/agents/run/subagents)
- [GitHub custom agent configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [Copilot CLI agent selection and reload](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli)
- [CLI release changes](https://github.com/github/copilot-cli/blob/main/changelog.md)
- [VS Code model-name resolver at the reviewed source revision](https://github.com/microsoft/vscode/blob/167a0e8fe5c84676e8f500481394808abc4ce545/src/vs/workbench/contrib/chat/common/languageModels.ts)

## Critical Architecture Patterns

### 1. Theme-Icon Pairing System (Core Invariant)

Every theme MUST have a matching icon theme via naming convention:
- Color theme `"Tokyo Night"` → Icon theme `"Tokyo Night Icons"`
- Monochrome variant → `"Tokyo Night Monochrome Icons"`
- Fallback → `"Classic Icons"` (when specific icons don't exist)

**Implementation in `js/shared/themeConfig.js`**, consumed by both extension hosts:
```javascript
function getMatchingIconTheme(themeName, options = {}) {
    const preferMonochrome = Boolean(options.preferMonochrome);
    const baseIconTheme = `${themeName} Icons`;
    const monochromeIconTheme = `${themeName} Monochrome Icons`;

    if (preferMonochrome && ICON_THEME_SET.has(monochromeIconTheme)) {
        return monochromeIconTheme;
    }
    return ICON_THEME_SET.has(baseIconTheme) ? baseIconTheme : "Classic Icons";
}
```

### 2. Manifest and Shared Configuration (Critical Synchronization)

Theme registrations MUST stay synchronized between:
1. `package.json` → `contributes.themes[]` and `contributes.iconThemes[]`
2. `js/shared/themeConfig.js` → `THEMES`, `ICON_THEMES`, and light-theme classification

Both `js/main.js` and `js/browser.js` import this shared module. Verify both consumers; do not introduce duplicate configuration arrays into either entrypoint.

**When adding or removing themes**: Update the manifest and shared metadata together with the corresponding JSON files. Color-only changes do not require registration changes.

### 3. File Naming Convention (Case-Sensitive)

- Theme files: `themes/Theme Name.json` (spaces allowed)
- Icon theme files: `icon-themes/Theme Name icon-theme.json` (lowercase "icon-theme")
- Icon theme ID in package.json: `"Theme Name Icons"` (capitalized, no hyphen)

## Key Workflows

### Testing Theme Consistency

The test suite provides automated validation and accessibility analysis. **Full documentation**: `tests/TEST_SUITE_DOCUMENTATION.md`

```bash
cd tests

# Quick structure validation (DEFAULT) - 2-3 seconds
.\run-tests.cmd --quick

# Full accessibility analysis - 5-10 seconds
.\run-tests.cmd --contrast

# Refactor progress dashboard - 1 second
.\run-tests.cmd --status

# Run all tests - 10-15 seconds
.\run-tests.cmd --full

# Show available modes
.\run-tests.cmd --help
```

**Test Modes**:

- **`--quick`** (default): Fast structure validation
  - Theme-icon pairing correctness
  - File existence verification
  - Manifest and shared configuration synchronization
  - Orphaned file detection
  - Command functionality simulation

- **`--contrast`**: Automated WCAG accessibility analysis
  - Calculates contrast ratios for syntax highlighting (4.5:1 minimum)
  - Validates UI elements (selection, diffs, brackets - 3:1 minimum)
  - Detects low-opacity overlays (invisible selections/diffs)
  - Identifies missing visual hierarchy (find system, scrollbars)
  - Prioritizes themes by refactor urgency (URGENT/HIGH/MEDIUM/LOW/CLEAN)

- **`--status`**: Refactor progress tracking
  - Parses docs/ACCESSIBILITY_FRAMEWORK.md for completed refactors
  - Shows grade improvements (D- → A-, percentage points gained)
  - Lists pending themes needing work
  - Estimates remaining effort

- **`--full`**: Comprehensive pre-release validation
  - Runs all tests sequentially
  - Use before packaging VSIX

### Unattended Audit Gates

- On Windows, run the modes above from `tests`. On other hosts, run the existing Node entrypoints from that same directory: `node test-command-functionality.js`, `node test-mapping-validation.js`, and `node validate-keys.js` for structure; `node test-contrast-analysis.js` for contrast; add `node test-refactor-status.js` for the full suite. Stop on a failed command; do not install a new runner merely to execute these scripts.
- The current contrast CLI prints findings but does not set a failing exit code for them. Read the actual critical/high counts and require every intended theme to be analyzed. Exit code zero, sample output in a prompt, or a historical PASS is not evidence of accessibility compliance.
- For targeted measurements, reuse the exported `ContrastAnalyzer` in `tests/test-contrast-analysis.js` and the existing loaders/helpers in `tests/lib`. `tests/analyze-theme-properties.js` does not exist.
- Parse complete JSON objects, check duplicate keys, and compare key sets rather than line counts. `tests/validate-keys.js` uses a static allowlist; it neither discovers new upstream keys nor proves complete theme coverage. Update it with verified key changes.
- Legacy audit catalogs can be stale: `tests/comprehensive-property-audit.js` still lists the intentionally omitted singular indent-guide keys. Do not automatically implement every reported gap.
- Do not weaken thresholds or expand palette exemptions to clear a failure. Separate a reproducible analyzer defect from a theme defect. Missing execution, incomplete source coverage, or unavailable required visual evidence must remain explicit blockers.
- Screenshot tooling lives in `tools/theme-shots`. Its local capture script writes sample settings and does not expose Copilot chat. Scope those writes explicitly and never claim it reviewed an unavailable surface.
- Before release, require current structure, contrast, and affected-surface evidence. Scheduled maintenance does not authorize commits, pushes, merges, version bumps, publishing, credential changes, or deletion of releases. Read-only release checks must compare the actual Marketplace version with the expected release, accounting for bounded indexing delay; `--skip-duplicate` success is not publication proof.

### Building VSIX
No build step required for theme JSON. Manual VSIX creation via:
1. Ensure `package.json` version is updated
2. Package with `vsce package` (if installed)
3. Distribute via GitHub releases

### Theme Structure
Themes use VS Code's standard color token format:
- `colors`: UI elements (e.g., `"activityBar.background": "#161613"`)
- `tokenColors`: Syntax highlighting with TextMate scopes

Example scope pattern from `Classic.json`:
```json
{"scope": ["keyword.control"], "settings": {"foreground": "#f92672"}}
```

### Architectural Principles & Design Standards

**The 60-30-10 Rule & Visual Hierarchy**:
- **60% Dominant Base**: Primary background colors (editor, workbench). Avoid pure black (`#000000`) or pure white (`#FFFFFF`). Use deep neutrals or soft off-whites.
- **30% Secondary**: Structural UI elements (Activity Bar, Side Bar, inactive tabs). Use tints/shades of the base color, not entirely new hues.
- **10% Accent**: Highly saturated colors for active states, primary buttons, and critical markers.

**Alpha Channel & Overlays (RGBA)**:
- Use 8-digit hex codes (`#RRGGBBAA`) for overlapping elements.
- **Diffs & Find Matches**: Must use significant transparency (low alpha) so underlying syntax highlighting is not obliterated.
- **The Selection Conundrum**: `editor.selectionHighlightBackground` (background matches) must have significantly lower opacity than `editor.selectionBackground` (active selection) to maintain spatial awareness.

**Syntax Highlighting & Semantic Tokens**:
- **Semantic Highlighting**: Always opt-in by setting `"semanticHighlighting": true` in the theme JSON.
- **Token Grouping**: Avoid "color overloading" (kaleidoscope effect). Group tokens by structural hierarchy (e.g., all types share a color family).
- **Bracket Pairs**: Define `editorBracketHighlight.foreground1-6`. Avoid overly saturated colors that compete with keywords.

**Terminal & The ANSI Paradox**:
- In dark themes, `terminal.ansiBlack` and `terminal.ansiBrightBlack` must be mapped to a lighter gray/white to be visible against dark backgrounds.
- In light themes, `terminal.ansiWhite` must be heavily darkened.


**The "Two Paths" Paradigm (Accessibility vs. Aesthetics)**:
When evaluating or refactoring themes, we recognize two distinct paths:
- **Path A (Strict Accessibility)**: Enforce strict WCAG 4.5:1 contrast for syntax and 3:1 for UI. This is the default for most themes to ensure maximum readability.
- **Path B (Established Palette Exemption)**: For themes based on established, iconic color palettes (e.g., Nord, Dracula), we allow softer contrast (minimum 3.0:1 for syntax) to preserve the exact hex codes and aesthetic identity of the original palette. This is a deliberate, beautiful design tradeoff. However, actual bugs (like invisible find highlights or screaming comment punctuation) must still be fixed.

**WCAG Contrast Requirements**:
- Normal text: **4.5:1** minimum contrast ratio (text to background)
- UI elements: **3:1** minimum contrast ratio
- High contrast themes: **7:1** for critical text
- Selection highlights: **3:1** against regular background, text must remain readable

**Critical Accessibility Rules**:
1. **Never use pure black (#000000)** - use dark gray/blue-tinted backgrounds (e.g., `#1e1e1e`, `#272822`)
2. **Test highlighted text** - selection colors must not make text unreadable
3. **Visible scrollbars** - define `scrollbarSlider.background`, `hoverBackground`, and `activeBackground`. Keep unobtrusive at rest, high contrast on hover/active.
4. **Color blindness** - don't rely on red/green alone; use icons, shapes, or lightness differences
5. **Semi-transparent overlays** - use alpha channels for find matches, line highlights (e.g., `#FFCC0033`)
6. **High contrast mode** - use `editorUnnecessaryCode.border` instead of opacity reduction

**Automated Testing Workflow**:
1. **Before refactoring**: Run `.\run-tests.cmd --contrast` to identify all accessibility issues
2. **During development**: Run `.\run-tests.cmd --quick` for fast validation (2-3s)
3. **After refactoring**: Run `.\run-tests.cmd --contrast` to verify fixes
4. **Track progress**: Run `.\run-tests.cmd --status` to see completed vs pending themes
5. **Pre-release**: Run `.\run-tests.cmd --full` for comprehensive validation

**Accessibility Tracking**:
- **docs/ACCESSIBILITY_FRAMEWORK.md**: Comprehensive accessibility framework and theme case studies
- **docs/CONTRAST_REFERENCE.md**: Detailed WCAG contrast requirements and property checklists
- **tests/TEST_SUITE_DOCUMENTATION.md**: Test suite capabilities and automation details
- **IMPROVEMENTS_v0.5.17.md**: Latest improvements documentation (v0.5.17-0.5.19)

**Manual Verification** (after automated tests pass):
- Reload window (F1 → Developer: Reload Window)
- Activate refactored theme
- Test in TypeScript/JavaScript/Python files
- Use `Developer: Inspect Editor Tokens` to verify syntax coloring
- Check diff views, terminal ANSI colors, and all UI panels
- Validate scrollbar visibility in all states (rest/hover/active)

### New UI Color Tokens (VS Code baseline 1.131)

All 31 themes are validated against the **VS Code 1.131** Theme Color Reference. The token groups below are **already defined across all 31 themes** — do NOT re-research them as "missing"; only adjust their values if a palette clash is reported:

- **Agent Session**: `agentSessionReadIndicator.foreground`, `agentStatusIndicator.*`, `agentSessionSelectedBadge.border`
- **Chat expansion**: `chat.thinkingShimmer`, `chat.requestBubbleBackground`, `chat.checkpointSeparator`, `chat.linesAddedForeground/linesRemovedForeground`, `chat.editedFileForeground`, `chatManagement.sashBorder`
- **Inline Edit**: `inlineEdit.tabWillAcceptModifiedBorder/tabWillAcceptOriginalBorder`
- **Gauge**: `gauge.background/foreground/border`, `gauge.warning*`, `gauge.error*`
- **Markdown Alerts**: `markdownAlert.note/tip/important/warning/caution.foreground`
- **Tab selected variants**: `tab.selectedBorderTop/selectedBackground/selectedForeground/dragAndDropBorder`
- **Activity bar badges**: `activityWarningBadge.*`, `activityErrorBadge.*`
- **Editor multi-cursor**: `editorMultiCursor.primary/secondary.foreground/background`
- **SCM Graph**: `scmGraph.foreground1-5`, `scmGraph.historyItem*`
- **Editor Action List**: `editorActionList.background/foreground/focusForeground/focusBackground`
- **Testing badges**: `testing.coverCountBadge*`, `testing.message.error.badge*`

#### Tokens added in the 1.124 modernization pass

The following groups were added to **all themes**, each value sourced from the same theme's existing palette so colors stay on-brand:

- **`terminalSymbolIcon.*`** (19 tokens) — terminal IntelliSense / suggest-widget icons. Mapping convention: `method/argument/option*` ← `symbolIcon.*` syntax hues; `branch/commit/tag/pullRequest*/remote/stash` ← `gitDecoration.*` / `charts.*` accent family; `file/folder/symbolicLink*` ← `symbolIcon.file/folderForeground`; `symbolText/inlineSuggestion` ← `editorGhostText.foreground` (muted).
- **`sideBarTitle.background` / `sideBarTitle.border`** — side bar title-bar chrome. Map to `sideBar.background` / `sideBar.border`.
- **`chart.line` / `chart.axis` / `chart.guide`** (singular new chart component) — map `chart.line` ← `charts.lines`; `axis`/`guide` ← `editorIndentGuide.background`.
- **Stragglers**: `editorOverviewRuler.commentForeground/commentUnresolvedForeground` (no theme defines `editorGutter.commentRangeForeground`, so these fall back to `charts.blue` / `charts.orange`), `actionBar.toggledBackground` ← `inputOption.activeBackground`, `tree.tableColumnsBorder` ← `tree.indentGuidesStroke`, `tree.tableOddRowsBackground` ← `list.hoverBackground`, `list.dropBetweenBackground` ← `list.dropBackground`.

**Workbench selection note (issue #5)**: the VS Code **Search view** and other workbench input fields use the workbench-wide `selection.background`, NOT `editor.selectionBackground`. Keep `selection.background` alpha visible — **dark themes ≥ ~35% (`0x59`), light themes ≥ ~30% (`0x4D`)** — or text selection in Search becomes invisible. Values below ~25% (`0x40`) are a FAIL.

**Future-research guidance**: before adding "new" tokens, diff the [Theme Color Reference](https://code.visualstudio.com/api/references/theme-color) against a representative theme (e.g. `themes/Tokyo Night.json`) with grep — most of the modern surface is already covered.

#### 1.125 → 1.131 sync pass (v0.14.5)

Releases 1.125–1.131 were Agent Host / Agents-window releases and shipped **no "Theming" sections**. The entire net theming surface across those seven releases was one token:

- **`chat.dictationActiveMicGlow`** (new in 1.131) — accent glow on the mic while dictation is listening. Registered in `src/vs/workbench/contrib/chat/common/widget/chatColors.ts`. Mapped in every theme to that theme's existing `agentsVoice.speakingForeground` so the dictation accent matches the voice accent.

**Five keys were removed** as confirmed-invalid (not registered anywhere in `microsoft/vscode`, silently ignored by VS Code): `minimap.foreground` (real token is `minimap.foregroundOpacity`), `editorCommentsWidget.clearForeground`, `editorCommentsWidget.rangeActiveBorder`, `editorCommentsWidget.rangeBorder` (the real pair is `rangeBackground` / `rangeActiveBackground`), and `editorStickyScroll.scrollbarShadow` (real token is `editorStickyScroll.shadow`, which the themes already define).

⚠️ **`strongForeground` is REAL** — it is registered in `src/vs/platform/theme/common/colors/baseColors.ts` and is simply absent from the docs page. Do not "clean it up".

⚠️ **Indent guides are already migrated.** All themes define `editorIndentGuide.background1-6` / `activeBackground1-6` and deliberately omit the deprecated `editorIndentGuide.background` / `activeBackground`. Do not re-add the deprecated pair.

**The `agents*` / `activeSessionView*` / `inactiveSessionView*` / `agentFeedback*` / `browser.border` families are unverifiable** against `microsoft/vscode` — they appear to belong to a separate agent-sessions surface. VS Code ignores unknown keys silently, so they are harmless. **Leave them alone** unless you can positively confirm they are dead.

**Validator drift warning**: `tests/validate-keys.js` uses a **hardcoded** `VALID_KEYS` allowlist, not the live reference. It reported PASS for a year while five fake keys sat in all themes. When you add or remove a color key, you MUST update that allowlist too, or the test is meaningless.

## Recent Improvements (v0.5.17-0.5.19)

### Sidebar Icon Color Strategy

**Key Learning**: Sidebar navigation icons (`activityBar.foreground`/`inactiveForeground`) are critical for theme identity and require careful color selection.

**Successful Patterns**:

1. **Cool/Warm Contrast** (Feisty Fusion v0.5.18):
   - Active icons: Cyan blue `#9cd1bb` (cool contrast)
   - Inactive icons: Warm orange `#ff9b5e` (maintains fusion warmth)
   - **Rationale**: Cool active vs warm inactive creates sophisticated visual hierarchy
   - Inspired by cyan text colors visible in code

2. **Spectrum Identity** (Filter Spectrum v0.5.17 → v0.5.19):
   - **v0.5.17**: Initial violet `#aa55ff`/magenta `#ff55dd` (user feedback: "pink doesn't look good")
   - **v0.5.19**: Refined to cyan `#55ddff`/blue `#5588ff` (core spectrum colors)
   - **Rationale**: Blue/cyan are fundamental ROYGBIV colors, more professional than pink

**Design Guidelines**:
- Match sidebar colors to theme's core palette (not arbitrary choices)
- Consider temperature contrast (cool vs warm) for visual hierarchy
- User feedback is critical - pink/violet can be polarizing
- Test visibility against theme's background colors

**Implementation Example** (4 properties to update):
```json
{
  "activityBar.foreground": "#55ddff",           // Active (primary accent)
  "activityBar.inactiveForeground": "#5588ff",   // Inactive (secondary)
  "activityBarTop.foreground": "#55ddff",        // Top bar active
  "activityBarTop.inactiveForeground": "#5588ff" // Top bar inactive
}
```

### Filter Spectrum Complete Overhaul (v0.5.17)

**Changes**: 194 color properties - transformed from "very ugly" to professional rainbow theme

**Key Improvements**:
- Deeper blacks (`#0d0d0d`, `#1a1a1a`, `#252525`) for contrast
- Full ROYGBIV spectrum progression (Red → Orange → Yellow → Green → Cyan → Blue → Violet → Magenta)
- Bright cyan accent (`#00d9ff`) for selections replacing jarring orange
- Complete spectrum ANSI terminal colors
- Proper 30/40/50% diff opacity hierarchy

**Documentation**: See `IMPROVEMENTS_v0.5.17.md` for complete details

## Common Modifications

### Adding a New Theme
1. Create `themes/New Theme.json` with color definitions
2. Create `icon-themes/New Theme icon-theme.json` (or reuse existing mappings)
3. Add to `package.json`:
   ```json
   {"label": "New Theme", "uiTheme": "vs-dark", "path": "./themes/New Theme.json"}
   {"label": "New Theme Icons", "id": "New Theme Icons", "path": "./icon-themes/New Theme icon-theme.json"}
   ```
4. Add `"New Theme"` to `THEMES` in `js/shared/themeConfig.js`; update light-theme classification if needed
5. Add `"New Theme Icons"` to `ICON_THEMES` in that same module; verify both host entrypoints still consume the shared configuration
6. **Validate with automated tests**:
   ```bash
   cd tests
   .\run-tests.cmd --quick      # Verify structure (2-3s)
   .\run-tests.cmd --contrast   # Check accessibility (5-10s)
   ```
7. Fix any issues identified by contrast analysis
8. Manual verification: Reload window, test in multiple languages

### Updating Theme Colors
Edit JSON directly in `themes/*.json`. Changes apply immediately on reload (F1 → "Developer: Reload Window").

### Extension Commands
Three registered commands in `js/main.js`:
- `tech_pro.select_theme` → Category picker (Light/Dark sections)
- `tech_pro.activate_icons` → Apply matching icon theme for current color theme
- `tech_pro.set_theme_and_icons` → Atomically set both theme + icons

## Theme Design Best Practices

### Color Palette Guidelines

**Background Colors**:
- Dark themes: Use off-black (e.g., `#272822`, `#1e1e1e`) never pure `#000000`
- Light themes: Use off-white or light gray to reduce glare, avoid pure `#FFFFFF` if possible
- Example: Classic uses `#272822` (dark gray-green), Night Owl uses dark blue-gray

**Syntax Color Strategy**:
- Limit palette to 4-6 main hues for consistency
- Common assignments: blue (keywords), green (strings), orange/yellow (constants), red (errors)
- Avoid neon/pure saturated colors on dark backgrounds (causes glare)
- Ensure color distinction for colorblind users (don't rely on red/green alone)

**Critical UI Elements** (must be clearly visible):
- Selection: `editor.selectionBackground` with **3:1** contrast, text readable on highlight
- Scrollbars: Define all states (`scrollbarSlider.background/hover/active`)
- Current line: `editor.lineHighlightBackground` with subtle transparency
- Find matches: Use semi-transparent overlays (e.g., `rgba(255, 204, 0, 0.2)`)
- Error/warning indicators: High contrast red/yellow even in low-contrast themes

### Light vs Dark Theme Differences

**Don't simply invert colors** - each requires separate optimization:

**Dark Theme Specifics**:
- Use slightly desaturated colors (softer on eyes in low light)
- Higher brightness text (`#fdfff1` vs pure white)
- Muted UI chrome to keep focus on editor content
- Example: Tokyo Night uses neon-soaked colors on dark blue-black

**Light Theme Specifics**:
- Requires different contrast tuning (more critical than dark)
- Use darker, more saturated accent colors
- Avoid pure white backgrounds (slight gray/warm tint better)
- Test in bright environments - colors may wash out
- Example: Filter Sun uses energetic brightness with proper contrast

### Multi-Language Testing

Always test themes across:
- JavaScript/TypeScript (complex syntax)
- Python (indentation-heavy)
- HTML/CSS (markup + styling)
- Markdown (mixed formatting)
- JSON (nested structures)
- Use `Developer: Inspect Editor Tokens` to verify token coloring

### Incremental Color Changes

When adjusting existing themes:
- **Status**: Run `.\run-tests.cmd --contrast` to see all accessibility problems
2. **Prioritize fixes**: Focus on URGENT/HIGH priority issues first
3. Change one color family at a time (e.g., all string colors)
4. **Quick validation**: Run `.\run-tests.cmd --quick` after each change (2-3s)
5. Test in real code files, not just samples
6. Verify related UI elements (status bar, tabs, panels)
7. Check both active/inactive states
8. **Verify fixes**: Run `.\run-tests.cmd --contrast` to confirm all issues resolved
9. **Track progress**: Run `.\run-tests.cmd --status` to update refactor tracking

**Common fixes identified by automated analysis**:
- Low-contrast comments: 2.3-2.8:1 → darken by 30-40%
- Invisible selections: 10-15% opacity → increase to 30-35% (dark) / 30% (light)
- Invisible diffs: 10% opacity → increase to 30% (dark) / 25% (light)
- Missing find hierarchy: all identical → use 30%/20%/15%/25%/30% tiers
- Bracket invisibility: adjust saturated colors for light themes

## Project-Specific Conventions

### Theme Categorization
Light themes detected via keywords OR explicit list:
```javascript
const lightThemes = ["Filter Sun", "Tokyo Day", "Enchanted Grove", ...];
theme.includes("Light") || theme.includes("Sun") || lightThemes.includes(theme)
```

### Version Update Messages
`UPDATE_MESSAGES` object in `js/main.js` shows notifications on version changes. Uses `globalState` to track last shown version.

### Icon Theme Structure
Icons use font glyphs (`tech_pro_icons.woff`). Each icon defined via:
- `fontCharacter`: Unicode point (e.g., `"\\F101"`)
- `fontColor`: Theme color (e.g., `"#ab9df2"`)

File associations via `fileExtensions`, `fileNames`, and `languageIds` maps.

## Learning from Successful Themes

**Why Popular Themes Succeed**:

- **One Dark Pro** (7M+ installs): Balanced dark gray background with moderate contrast, harmonious colors, minimalist feel. Shows less is more.
- **Dracula Official** (5M+ installs): Dark purple background + vibrant neon accents. High contrast makes syntax pop. "Vibrant yet soothing" balance.
- **GitHub Theme** (8M+ installs): Familiar, clean, no-frills. Multiple variants (light/dark/high-contrast/colorblind). Proves neutrality works.
- **Night Owl** (2M+ installs): Explicitly designed for accessibility and colorblind users. Muted palette on dark blue background. Meaningful contrast over flashiness.
- **Shades of Purple** (1M+ installs): Bold creative standout with deep purple + neon. Shows playful themes can work if contrast is solid.

**Key Lessons**:
- Successful themes have a **clear design philosophy** (minimalist, vibrant, nostalgic, etc.)
- They offer **variants** for different preferences (dark/light/high-contrast/colorblind)
- They maintain **consistent branding** across the palette
- They prioritize **readability** while expressing personality
- They **iterate based on feedback** (Dracula Soft, Night Owl Light adjustments)

## Gotchas & Common Pitfalls

**Shared Configuration**:
- `main.js` and `browser.js` import the same `THEME_CONFIG` from `js/shared/themeConfig.js`.
- Keep the manifest and shared metadata synchronized when adding/removing themes.
- `browser.js` is the web extension host; do not recreate a separate theme list there.

**Naming Issues**:
- Icon file suffix: `icon-theme.json` NOT `Icon-Theme.json`
- Case sensitivity: Theme labels in package.json must match `THEME_CONFIG` exactly
- No hyphen in package.json icon ID: `"Theme Name Icons"` not `"Theme-Name-Icons"`

**Monochrome Fallback**:
- Not all themes have monochrome icons
- Check `THEME_CONFIG.iconThemes` list before assuming monochrome exists
- Fallback to `"Classic Icons"` if specific icon theme missing

## Related Resources

**VS Code Theme Documentation**:
- [Theme Color Reference](https://code.visualstudio.com/api/references/theme-color)
- [Color Theme Guide](https://code.visualstudio.com/api/extension-guides/color-theme)
- [Icon Theme Guide](https://code.visualstudio.com/api/extension-guides/file-icon-theme)

**Accessibility Guidelines**:
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [VS Code Accessibility](https://code.visualstudio.com/docs/editor/accessibility)

**Community References**:
- [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme)
- [Dracula Official](https://draculatheme.com/)
- [Night Owl](https://marketplace.visualstudio.com/items?itemName=sdras.night-owl)
- [GitHub Theme](https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme)
