# IMPROVEMENTS — v0.11.0 (VS Code Property Audit & Modernization)

**Release:** 2026-04-30
**Engine target:** raised from `^1.90.0` to `^1.94.0` so Copilot-era tokens take effect on user installs.

## Why this release

VS Code shipped many releases since the themes were last broadly audited. Each release adds new themeable color tokens — Agent Session, expanded Chat, Inline Edit, Gauge, Markdown Alerts, Tab Selected variants, Activity warning/error badges, Multi-cursor, SCM Graph, Editor Action List, Testing badges. Themes that don't define these inherit VS Code defaults, which clash with bespoke palettes. This release closes the remaining gap and tunes every Copilot-era token to its theme's persona.

## How it was done — fleet-mode delegation

This release used a 3-phase agent fleet:

1. **Phase 1 — Research & Catalogue (Claude Opus 4.7 1M).** Single research agent validated every theme-color property against the official VS Code Theme Color Reference (https://code.visualstudio.com/api/references/theme-color) plus the `microsoft/vscode` source registries (`colorRegistry.ts`, `chatColors.ts`, `inlineEditsViewColors.ts`, etc.). Output: `docs/VSCODE_PROPERTY_AUDIT.md` — 654-line audit doc covering 50+ property areas, with per-theme gap matrix, priority buckets, and palette-persona briefs.

2. **Phase 2 — Pilot (GPT-5.5).** Two pilot agents (Tokyo Night dark, Sandstone Light light) implemented the audit recommendations on their themes. Each validated every property name against VS Code docs/source before writing it. Pilots informed the fleet briefs.

3. **Phase 3 — Fleet (GPT-5.5).** 21 parallel agents, one per remaining theme. Each owned exactly one JSON file and tuned tokens to that theme's individual palette persona (Path A strict-accessibility vs Path B established-palette exemption). No programmatic colour fills — every value is a deliberate per-theme choice.

## What's new

### Universal addition (all 23 themes)
- `testing.coverCountBadgeBackground`
- `testing.coverCountBadgeForeground`

These were the only universally missing properties identified by the audit. Each theme picked palette-derived hexes with ≥4.5:1 contrast.

### Per-theme palette-fit re-tunes

Each of the 23 themes had its already-defined Copilot-era tokens audited and re-tuned where they were stale-generic or palette-conflict. The token families covered:

- **Chat:** `chat.requestBubbleBackground`, `chat.requestBubbleHoverBackground`, `chat.requestBackground`, `chat.requestBorder`, `chat.requestCodeBorder`, `chat.checkpointSeparator`, `chat.thinkingShimmer`, `chat.editedFileForeground`, `chat.linesAddedForeground`, `chat.linesRemovedForeground`, `chatManagement.sashBorder`.
- **Agent Session:** `agentStatusIndicator.background`, `agentSession*`, `aiCustomizationManagement.sashBorder`.
- **Inline Edit:** `inlineEdit.tabWillAcceptModifiedBorder`, `inlineEdit.tabWillAcceptOriginalBorder`, body/gutter overlays.
- **Gauge:** `gauge.{background,foreground,border,warningBackground,warningForeground,errorBackground,errorForeground}`.
- **Markdown alerts:** `markdownAlert.{note,tip,important,warning,caution}.foreground`.
- **Tab Selected:** `tab.{selectedBorderTop,selectedBackground,selectedForeground,dragAndDropBorder}`.
- **Activity badges:** `activityWarningBadge.*`, `activityErrorBadge.*`.
- **Multi-cursor:** `editorMultiCursor.{primary,secondary}.{foreground,background}`.
- **SCM Graph:** `scmGraph.foreground1..5`, `scmGraph.historyItem*`.
- **Editor Action List:** `editorActionList.{background,foreground,focusForeground,focusBackground}`.
- **Testing badges:** `testing.message.error.{badgeBackground,badgeBorder,badgeForeground}`.
- **Chat minimap markers:** `minimap.chatEditHighlight`, `editorMinimap.inlineChatInserted`.
- **Profile badges:** `profileBadge.*`, `profiles.sashBorder`.
- **Sticky scroll:** editor / sideBar / panel / terminal sticky-scroll tokens.

See `CHANGELOG.md` `[0.11.0]` for the per-theme one-liner of what each fleet agent re-tuned.

## Validation

- `tests\run-tests.cmd --quick` → 98 successes, 0 warnings, 0 errors.
- `tests\run-tests.cmd --contrast` → 0 critical issues. 2 HIGH-severity items flagged (Chroma Void, Cyberpunk Neon `diffEditor.removedLineBackground` opacity 27–28% vs 30% recommended) are **pre-existing** values from `[0.10.9]` HEAD, not introduced by this release.

## Engine bump

`engines.vscode` raised from `^1.90.0` to `^1.94.0`. Properties added in 1.91–1.95 (testing coverage badges, chat bubble family, inline-edit accept borders, agent session, gauge family, multi-cursor primary/secondary, etc.) now take effect for users on supported VS Code releases.

## Files touched

- `themes/*.json` — all 23 theme JSONs.
- `CHANGELOG.md` — per-theme entries + version section.
- `docs/VSCODE_PROPERTY_AUDIT.md` — new audit reference (committed).
- `package.json` — version 0.10.9 → 0.11.0; engine ^1.90.0 → ^1.94.0.
- `js/shared/themeConfig.js` — `THEME_CONFIG.version` bump.

## Outstanding follow-ups (deferred to a future release)

From audit Section E:
- Two themes use pure white/black somewhere in their palette (Cosmic Void Light, Neon Pink Light) — flagged as a separate accessibility task.
- Deprecated-key sweep (`editorIndentGuide.background`/`activeBackground` superseded by `.background1`/`.activeBackground1`; older `welcomePage.button*` renamed to `welcomePage.tile*`) — not investigated this release.
- New translucent overlay tokens are not yet modelled in `tests/lib/theme-utils.js` `getRecommendedOpacity()` — the helper still only knows selection/diff/find families. Adding chat-bubble, inline-edit, and agent-status opacity rules would tighten future contrast checks.
- The 5 dark themes with `diffEditor.removedLineBackground` at 27–28% opacity (Chroma Void, Cyberpunk Neon, Enchanted Grove Dark, Feisty Fusion, Tokyo Night) should be raised to ≥30% in a follow-up patch.
