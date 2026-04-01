# Overlay Audit Plan (Selection + Diff + Find)

Status: Snapshot plan as of 2026-02-05. Core overlay opacity targets have been applied to all 21 themes (v0.5.20). This document remains as a reference for future overlay work and new themes.

**Official Source of Truth**: Always consult https://code.visualstudio.com/api/references/theme-color for the latest overlay-related color properties — new overlay tokens are added with each VS Code release.

## Scope
- Selection overlays: editor.selectionBackground
- Diff overlays: diffEditor.insertedLineBackground, diffEditor.removedLineBackground,
  diffEditor.insertedTextBackground, diffEditor.removedTextBackground,
  diffEditorGutter.insertedLineBackground, diffEditorGutter.removedLineBackground
- Find and word highlights: editor.findMatchBackground, editor.findMatchHighlightBackground,
  editor.findRangeHighlightBackground, editor.wordHighlightBackground,
  editor.wordHighlightStrongBackground
- Related supporting overlays: editor.lineHighlightBackground

## Source Of Truth
- Opacity targets and combined caps are defined in tests/lib/theme-utils.js.
- This plan assumes those targets remain the canonical values unless explicitly updated.

## Golden Rules
1. Use the same base hue family for find highlights and diff inserts to avoid color clash.
2. Keep selection and diff overlays within recommended opacities per theme type.
3. Keep combined overlays readable (selection + diff, find + diff) using the compounded cap
   from tests/lib/theme-utils.js (light vs dark).
4. Preserve text readability on highlights (selected text must remain readable).
5. Avoid warm yellow/orange find colors on green/red diffs; prefer diff insert hue instead.

## Target Opacities (Canonical)
- Dark themes: selection 30-50% (35% typical), diff line 30%, diff text 25-35%, gutter 50%, compounded 55%
- Light themes: selection 30-50% (30% typical), diff line 25%, diff text 25-35%, gutter 40%, compounded 48%
- Find hierarchy (all themes):
  - findMatch 30%
  - findMatchHighlight 20%
  - findRangeHighlight 15%
  - wordHighlight 25%
  - wordHighlightStrong 30%

## Audit Checklist
- Confirm theme type (light/dark) using tests/lib/theme-utils.js.
- Verify each overlay property exists and uses a palette-consistent base hue.
- Check opacity values against targets and adjust to maintain readability.
- Validate compounded overlays (selection + diff, find + diff) using blended math.
- Ensure text-on-highlight contrast remains readable in diff and selection states.

## Execution Plan
Phase 0: Alignment
- Align docs, test harness rules, and helper scripts to the canonical opacity spec.

Phase 1: Inventory
- For each theme, catalog current overlay colors and opacities.
- Flag conflicts with canonical opacities or hue family mismatches.

Phase 2: Apply
- Update overlays per theme, preserving theme identity.
- Keep changes minimal and consistent with each theme narrative.

Phase 3: Verify
- Run tests (run-tests.cmd --quick, --contrast) and analyze-theme-properties.js.
- Manual spot checks in VS Code (diff view + find + selection stacking).

## Notes
- If a theme requires design-first trade-offs, document the intent in
  docs/ACCESSIBILITY_FRAMEWORK.md and tests/lib/theme-utils.js.
- All overlays MUST use alpha-channel transparency (8-digit hex `#RRGGBBAA`) so underlying
  syntax highlighting remains visible.
- Path B (Established Palette Exemption) themes still require overlay fixes for invisible
  selections, diffs, and find highlights — only syntax contrast thresholds are relaxed (≥3.0:1).

## Newer Overlay-Related Properties
The following overlay properties have been added in recent VS Code releases. Check coverage
when auditing themes (fetch the official reference for the latest):
- `inlineChat.background` — Copilot inline chat overlay
- `inlineEdit.modifiedBackground` — Copilot inline edit highlights
- `chat.requestBackground` — Chat panel request background
- `multiDiffEditor.*` — Multi-diff editor overlays
- `editorStickyScroll.*` — Sticky scroll backgrounds
- `terminalStickyScroll.*` — Terminal sticky scroll

> **Always fetch**: https://code.visualstudio.com/api/references/theme-color for the complete,
> up-to-date list of overlay-related properties.
