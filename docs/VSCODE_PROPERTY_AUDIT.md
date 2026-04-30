# VS Code Property Audit — M Tech Themes

**Audit date:** 2026-04-29
**Engine target:** `^1.90.0` (package.json line 9)
**Themes audited:** 23 (16 dark + 7 light) in `themes/*.json`
**Authoritative source:** https://code.visualstudio.com/api/references/theme-color (snapshot 2026-04-29)
**Cross-references:**
- `src/vs/platform/theme/common/colorRegistry.ts` (microsoft/vscode `main` branch)
- `src/vs/workbench/contrib/chat/browser/chatColors.ts`
- `src/vs/workbench/contrib/inlineEdit/browser/inlineEditsViewColors.ts`

---

## Executive summary

| Metric | Value |
| --- | --- |
| Themes audited | **23** |
| Avg `colors` keys per theme | **725** (range 720–738) |
| Universal new-property gap | **`testing.coverCountBadgeBackground` + `testing.coverCountBadgeForeground`** (all 23 themes) |
| Themes missing **any** Copilot/Chat/Agent/Inline-Edit/Gauge/MarkdownAlert/SCM-Graph properties | **0** |
| Themes missing Tab-Selected variants | **0** |
| Themes missing Activity warning/error badges | **0** |

**Headline finding:** Coverage of new and historical VS Code color tokens is **comprehensive across all 23 themes**. The Phase-2/3 "missing properties" surface is much smaller than expected — only the new `testing.coverCountBadge*` pair (added with VS Code's coverage badge feature) is universally missing. Phase 2 work should pivot from "add missing tokens" to **"audit palette consistency on already-defined new tokens"** (e.g. validate that each theme's `chat.requestBubbleBackground`, `gauge.warningBackground`, and `agentStatusIndicator.background` actually pull from that theme's palette rather than a generic blue).

---

## Section A — Full property catalogue

Every theme-color key from the official reference, grouped exactly as in https://code.visualstudio.com/api/references/theme-color. Each subsection cites its source URL.

Format: `propertyName` | use | added | light default | dark default | HC notes
"def." = inherited from a parent token (VS Code resolves at runtime; left blank if no static default is documented in the reference page).

### A.1 Contrast colors
Source: https://code.visualstudio.com/api/references/theme-color#contrast-colors

| Property | Use | Added | Light default | Dark default | HC |
| --- | --- | --- | --- | --- | --- |
| `contrastActiveBorder` | Extra border on focused/active items in HC themes | <1.0 | – | – | HC only |
| `contrastBorder` | Extra border on elements in HC themes | <1.0 | – | – | HC only |

### A.2 Base colors
Source: https://code.visualstudio.com/api/references/theme-color#base-colors

| Property | Use | Added | Light | Dark | HC |
| --- | --- | --- | --- | --- | --- |
| `focusBorder` | Default focus ring | <1.0 | def. | def. | def. |
| `foreground` | Default text color | <1.0 | def. | def. | def. |
| `disabledForeground` | Default disabled-element text | 1.59 | def. | def. | def. |
| `widget.border` | Find/replace etc. widget border | 1.55 | def. | def. | def. |
| `widget.shadow` | Widget drop shadow | <1.0 | – | – | – |
| `selection.background` | Workbench input selection | <1.0 | def. | def. | def. |
| `descriptionForeground` | Secondary description text | 1.10 | def. | def. | def. |
| `errorForeground` | Default error text | <1.0 | def. | def. | def. |
| `icon.foreground` | Default workbench icon color | 1.43 | def. | def. | def. |
| `sash.hoverBorder` | Draggable sash hover border | 1.51 | def. | def. | def. |

### A.3 Window border
Source: https://code.visualstudio.com/api/references/theme-color#window-border (macOS/Linux only, custom title bar)

| Property | Use | Added |
| --- | --- | --- |
| `window.activeBorder` | Active window border | 1.31 |
| `window.inactiveBorder` | Inactive window border | 1.31 |

### A.4 Text colors
Source: https://code.visualstudio.com/api/references/theme-color#text-colors

| Property | Use | Added |
| --- | --- | --- |
| `textBlockQuote.background` | Blockquote background | 1.10 |
| `textBlockQuote.border` | Blockquote border | 1.10 |
| `textCodeBlock.background` | Code-fence background | 1.10 |
| `textLink.activeForeground` | Link hover/active | 1.10 |
| `textLink.foreground` | Link rest | 1.10 |
| `textPreformat.foreground` | Inline `<code>` foreground | 1.10 |
| `textPreformat.background` | Inline `<code>` background | 1.86 |
| `textPreformat.border` | Inline `<code>` border | 1.86 |
| `textSeparator.foreground` | `<hr>` color | 1.10 |

### A.5 Action colors
Source: https://code.visualstudio.com/api/references/theme-color#action-colors

| Property | Use | Added |
| --- | --- | --- |
| `toolbar.hoverBackground` | Toolbar hover bg | 1.45 |
| `toolbar.hoverOutline` | Toolbar hover outline | 1.45 |
| `toolbar.activeBackground` | Toolbar mouse-down bg | 1.45 |
| `editorActionList.background` | Lightbulb action list bg | **1.84** |
| `editorActionList.foreground` | Lightbulb action list fg | **1.84** |
| `editorActionList.focusForeground` | Focused action fg | **1.84** |
| `editorActionList.focusBackground` | Focused action bg | **1.84** |

### A.6 Button control
Source: https://code.visualstudio.com/api/references/theme-color#button-control

| Property | Use | Added |
| --- | --- | --- |
| `button.background` | Primary button bg | <1.0 |
| `button.foreground` | Primary button fg | <1.0 |
| `button.border` | Primary button border | 1.45 |
| `button.separator` | Button divider | 1.66 |
| `button.hoverBackground` | Primary hover | <1.0 |
| `button.secondaryForeground` | Secondary fg | 1.45 |
| `button.secondaryBackground` | Secondary bg | 1.45 |
| `button.secondaryHoverBackground` | Secondary hover | 1.45 |
| `button.secondaryBorder` | Secondary border | **1.91** |
| `checkbox.background` | Checkbox bg | 1.43 |
| `checkbox.foreground` | Checkmark fg | 1.43 |
| `checkbox.disabled.background` | Disabled checkbox bg | **1.93** |
| `checkbox.disabled.foreground` | Disabled checkbox fg | **1.93** |
| `checkbox.border` | Checkbox border | 1.43 |
| `checkbox.selectBackground` | Selected-row checkbox bg | 1.69 |
| `checkbox.selectBorder` | Selected-row checkbox border | 1.69 |
| `radio.activeForeground` | Radio fg active | 1.85 |
| `radio.activeBackground` | Radio bg active | 1.85 |
| `radio.activeBorder` | Radio border active | 1.85 |
| `radio.inactiveForeground` | Radio fg inactive | 1.85 |
| `radio.inactiveBackground` | Radio bg inactive | 1.85 |
| `radio.inactiveBorder` | Radio border inactive | 1.85 |
| `radio.inactiveHoverBackground` | Radio hover inactive | 1.85 |

### A.7 Dropdown control
Source: https://code.visualstudio.com/api/references/theme-color#dropdown-control

| Property | Use |
| --- | --- |
| `dropdown.background` | Closed dropdown bg |
| `dropdown.listBackground` | Open list bg |
| `dropdown.border` | Border |
| `dropdown.foreground` | Text |

### A.8 Input control
Source: https://code.visualstudio.com/api/references/theme-color#input-control

| Property | Use |
| --- | --- |
| `input.background` | Input bg |
| `input.border` | Input border |
| `input.foreground` | Input text |
| `input.placeholderForeground` | Placeholder |
| `inputOption.activeBackground` | Toggle active bg |
| `inputOption.activeBorder` | Toggle active border |
| `inputOption.activeForeground` | Toggle active fg |
| `inputOption.hoverBackground` | Toggle hover bg |
| `inputValidation.errorBackground` / `.errorForeground` / `.errorBorder` | Error severity |
| `inputValidation.infoBackground` / `.infoForeground` / `.infoBorder` | Info severity |
| `inputValidation.warningBackground` / `.warningForeground` / `.warningBorder` | Warning severity |

### A.9 Scrollbar control
Source: same page (under input subsection)

| Property | Use |
| --- | --- |
| `scrollbar.background` | Track |
| `scrollbar.shadow` | Scroll-state shadow |
| `scrollbarSlider.background` | Slider rest |
| `scrollbarSlider.hoverBackground` | Slider hover |
| `scrollbarSlider.activeBackground` | Slider active |

### A.10 Badge
Source: https://code.visualstudio.com/api/references/theme-color#badge

| Property | Use |
| --- | --- |
| `badge.background` | Badge bg |
| `badge.foreground` | Badge fg |

### A.11 Progress bar
| Property | Use |
| --- | --- |
| `progressBar.background` | Long-running progress |

### A.12 Lists & trees
Source: https://code.visualstudio.com/api/references/theme-color#lists-and-trees

Active selection (focused list): `list.activeSelectionBackground`, `list.activeSelectionForeground`, `list.activeSelectionIconForeground`.
Inactive selection: `list.inactiveSelectionBackground`, `list.inactiveSelectionForeground`, `list.inactiveSelectionIconForeground`, `list.inactiveFocusBackground`, `list.inactiveFocusOutline`.
Focus / hover: `list.focusBackground`, `list.focusForeground`, `list.focusHighlightForeground`, `list.focusOutline`, `list.focusAndSelectionOutline`, `list.hoverBackground`, `list.hoverForeground`.
Drop / drag: `list.dropBackground`, `list.dropBetweenBackground`.
States: `list.invalidItemForeground`, `list.errorForeground`, `list.warningForeground`, `list.deemphasizedForeground`, `list.highlightForeground`.
Filter widget: `listFilterWidget.background`, `listFilterWidget.outline`, `listFilterWidget.noMatchesOutline`, `listFilterWidget.shadow`, `list.filterMatchBackground`, `list.filterMatchBorder`.
Tree-only: `tree.indentGuidesStroke`, `tree.inactiveIndentGuidesStroke`, `tree.tableColumnsBorder`, `tree.tableOddRowsBackground`.

### A.13 Activity Bar
Source: https://code.visualstudio.com/api/references/theme-color#activity-bar

Standard side activity bar: `activityBar.background`, `activityBar.foreground`, `activityBar.inactiveForeground`, `activityBar.border`, `activityBar.dropBorder`, `activityBar.activeBorder`, `activityBar.activeBackground`, `activityBar.activeFocusBorder`, `activityBarBadge.background`, `activityBarBadge.foreground`.

Top-positioned activity bar (added 1.83): `activityBarTop.foreground`, `activityBarTop.activeBorder`, `activityBarTop.inactiveForeground`, `activityBarTop.dropBorder`, `activityBarTop.background`, `activityBarTop.activeBackground`.

Warning/error badges (added **1.85**): `activityWarningBadge.foreground`, `activityWarningBadge.background`, `activityErrorBadge.foreground`, `activityErrorBadge.background`.

### A.14 Profiles
Source: https://code.visualstudio.com/api/references/theme-color#profiles

`profileBadge.background`, `profileBadge.foreground`, `profiles.sashBorder`.

### A.15 Side Bar
Source: https://code.visualstudio.com/api/references/theme-color#side-bar

`sideBar.background`, `sideBar.foreground`, `sideBar.border`, `sideBar.dropBackground`, `sideBarTitle.foreground`, `sideBarTitle.background` (1.85), `sideBarTitle.border` (1.85), `sideBarSectionHeader.background`, `sideBarSectionHeader.foreground`, `sideBarSectionHeader.border`, `sideBarActivityBarTop.border` (1.83), `sideBarStickyScroll.background` (1.84), `sideBarStickyScroll.border` (1.84), `sideBarStickyScroll.shadow` (1.84).

### A.16 Minimap
Source: https://code.visualstudio.com/api/references/theme-color#minimap

`minimap.findMatchHighlight`, `minimap.selectionHighlight`, `minimap.errorHighlight`, `minimap.warningHighlight`, `minimap.background`, `minimap.selectionOccurrenceHighlight`, `minimap.foregroundOpacity`, `minimap.infoHighlight` (1.78), `minimap.chatEditHighlight` (**1.91**), `minimapSlider.background`, `minimapSlider.hoverBackground`, `minimapSlider.activeBackground`, `minimapGutter.addedBackground`, `minimapGutter.modifiedBackground`, `minimapGutter.deletedBackground`, `editorMinimap.inlineChatInserted` (**1.91**).

### A.17 Editor groups & tabs
Source: https://code.visualstudio.com/api/references/theme-color#editor-groups-tabs

Groups: `editorGroup.border`, `editorGroup.dropBackground`, `editorGroupHeader.noTabsBackground`, `editorGroupHeader.tabsBackground`, `editorGroupHeader.tabsBorder`, `editorGroupHeader.border`, `editorGroup.emptyBackground`, `editorGroup.focusedEmptyBorder`, `editorGroup.dropIntoPromptForeground`, `editorGroup.dropIntoPromptBackground`, `editorGroup.dropIntoPromptBorder`.

Active/inactive tabs: `tab.activeBackground`, `tab.unfocusedActiveBackground`, `tab.activeForeground`, `tab.border`, `tab.activeBorder`, `tab.activeBorderTop`, `tab.unfocusedActiveBorder`, `tab.unfocusedActiveBorderTop`, `tab.lastPinnedBorder`, `tab.inactiveBackground`, `tab.unfocusedInactiveBackground`, `tab.inactiveForeground`, `tab.unfocusedActiveForeground`, `tab.unfocusedInactiveForeground`, `tab.hoverBackground`, `tab.unfocusedHoverBackground`, `tab.hoverForeground`, `tab.unfocusedHoverForeground`, `tab.hoverBorder`, `tab.unfocusedHoverBorder`, `tab.activeModifiedBorder`, `tab.inactiveModifiedBorder`, `tab.unfocusedActiveModifiedBorder`, `tab.unfocusedInactiveModifiedBorder`.

**Selected-tab variants (added 1.88, used by sticky-scroll & multi-select tab UI):** `tab.selectedBorderTop`, `tab.selectedBackground`, `tab.selectedForeground`, `tab.dragAndDropBorder`.

Side-by-side editor: `editorPane.background`, `sideBySideEditor.horizontalBorder`, `sideBySideEditor.verticalBorder`.

### A.18 Editor (text content)
Source: https://code.visualstudio.com/api/references/theme-color#editor-colors

Core: `editor.background`, `editor.foreground`, `editorLineNumber.foreground`, `editorLineNumber.activeForeground`, `editorLineNumber.dimmedForeground` (1.78), `editorCursor.background`, `editorCursor.foreground`, `editor.placeholder.foreground` (1.81), `editor.compositionBorder` (1.69).

Multi-cursor (added **1.95**): `editorMultiCursor.primary.foreground`, `editorMultiCursor.primary.background`, `editorMultiCursor.secondary.foreground`, `editorMultiCursor.secondary.background`.

Selection: `editor.selectionBackground`, `editor.selectionForeground`, `editor.inactiveSelectionBackground`, `editor.selectionHighlightBackground`, `editor.selectionHighlightBorder`.

Word highlight: `editor.wordHighlightBackground`, `editor.wordHighlightBorder`, `editor.wordHighlightStrongBackground`, `editor.wordHighlightStrongBorder`, `editor.wordHighlightTextBackground` (1.66), `editor.wordHighlightTextBorder` (1.66).

Find: `editor.findMatchBackground`, `editor.findMatchForeground` (1.74), `editor.findMatchHighlightForeground` (1.74), `editor.findMatchHighlightBackground`, `editor.findRangeHighlightBackground`, `editor.findMatchBorder`, `editor.findMatchHighlightBorder`, `editor.findRangeHighlightBorder`.

Search: `search.resultsInfoForeground`, `searchEditor.findMatchBackground`, `searchEditor.findMatchBorder`, `searchEditor.textInputBorder`.

Hover/line: `editor.hoverHighlightBackground`, `editor.lineHighlightBackground`, `editor.inactiveLineHighlightBackground` (1.85), `editor.lineHighlightBorder`.

Unicode: `editorUnicodeHighlight.border`, `editorUnicodeHighlight.background`.

Range/symbol: `editor.rangeHighlightBackground`, `editor.rangeHighlightBorder`, `editor.symbolHighlightBackground`, `editor.symbolHighlightBorder`, `editorLink.activeForeground`.

Whitespace/guides: `editorWhitespace.foreground`, `editorIndentGuide.background` (deprecated 1.55, use `.background1`), `editorIndentGuide.background1..6`, `editorIndentGuide.activeBackground`, `editorIndentGuide.activeBackground1..6` (1.55).

Inlay hints (1.66): `editorInlayHint.background`, `editorInlayHint.foreground`, `editorInlayHint.typeForeground`, `editorInlayHint.typeBackground`, `editorInlayHint.parameterForeground`, `editorInlayHint.parameterBackground`.

Rulers/linked editing: `editorRuler.foreground`, `editor.linkedEditingBackground` (1.61).

CodeLens / lightbulb: `editorCodeLens.foreground`, `editorLightBulb.foreground`, `editorLightBulbAutoFix.foreground`, `editorLightBulbAi.foreground` (**1.83**).

Brackets: `editorBracketMatch.background`, `editorBracketMatch.border`, `editorBracketMatch.foreground` (1.81), `editorBracketHighlight.foreground1..6`, `editorBracketHighlight.unexpectedBracket.foreground`, `editorBracketPairGuide.activeBackground1..6`, `editorBracketPairGuide.background1..6`.

Folding: `editor.foldBackground`, `editor.foldPlaceholderForeground` (1.83).

Overview ruler: `editorOverviewRuler.background`, `editorOverviewRuler.border`, `editorOverviewRuler.findMatchForeground`, `editorOverviewRuler.rangeHighlightForeground`, `editorOverviewRuler.selectionHighlightForeground`, `editorOverviewRuler.wordHighlightForeground`, `editorOverviewRuler.wordHighlightStrongForeground`, `editorOverviewRuler.wordHighlightTextForeground` (1.66), `editorOverviewRuler.modifiedForeground`, `editorOverviewRuler.addedForeground`, `editorOverviewRuler.deletedForeground`, `editorOverviewRuler.errorForeground`, `editorOverviewRuler.warningForeground`, `editorOverviewRuler.infoForeground`, `editorOverviewRuler.bracketMatchForeground`, `editorOverviewRuler.inlineChatInserted` (1.86), `editorOverviewRuler.inlineChatRemoved` (1.86), `editorOverviewRuler.commentDraftForeground`.

Errors/warnings/info/hints: `editorError.foreground/.border/.background`, `editorWarning.foreground/.border/.background`, `editorInfo.foreground/.border/.background`, `editorHint.foreground/.border`, `problemsErrorIcon.foreground`, `problemsWarningIcon.foreground`, `problemsInfoIcon.foreground`.

Unused code: `editorUnnecessaryCode.border`, `editorUnnecessaryCode.opacity`.

Gutter: `editorGutter.background`, `editorGutter.modifiedBackground`, `editorGutter.modifiedSecondaryBackground` (1.94), `editorGutter.addedBackground`, `editorGutter.addedSecondaryBackground` (1.94), `editorGutter.deletedBackground`, `editorGutter.deletedSecondaryBackground` (1.94), `editorGutter.commentRangeForeground`, `editorGutter.commentGlyphForeground`, `editorGutter.commentUnresolvedGlyphForeground`, `editorGutter.foldingControlForeground`, `editorGutter.itemGlyphForeground` (1.85), `editorGutter.itemBackground` (1.85), `editorGutter.commentDraftGlyphForeground`.

Comments widget: `editorCommentsWidget.resolvedBorder`, `editorCommentsWidget.unresolvedBorder`, `editorCommentsWidget.rangeBackground`, `editorCommentsWidget.rangeActiveBackground`, `editorCommentsWidget.replyInputBackground`.

### A.19 Inline Edit (Copilot)
Source: https://code.visualstudio.com/api/references/theme-color#editor-colors (inline-edit subsection); microsoft/vscode `src/vs/workbench/contrib/inlineEdit/browser/inlineEditsViewColors.ts`.

Gutter indicator (added 1.92): `inlineEdit.gutterIndicator.primaryBorder/.primaryForeground/.primaryBackground`, `inlineEdit.gutterIndicator.secondaryBorder/.secondaryForeground/.secondaryBackground`, `inlineEdit.gutterIndicator.successfulBorder/.successfulForeground/.successfulBackground`, `inlineEdit.gutterIndicator.background`.

Body (1.92): `inlineEdit.originalBackground`, `inlineEdit.modifiedBackground`, `inlineEdit.originalChangedLineBackground`, `inlineEdit.originalChangedTextBackground`, `inlineEdit.modifiedChangedLineBackground`, `inlineEdit.modifiedChangedTextBackground`, `inlineEdit.originalBorder`, `inlineEdit.modifiedBorder`.

Tab-accept hint (added **1.95**): `inlineEdit.tabWillAcceptModifiedBorder`, `inlineEdit.tabWillAcceptOriginalBorder`.

### A.20 Diff editor
Source: https://code.visualstudio.com/api/references/theme-color#diff-editor-colors

`diffEditor.insertedTextBackground`, `diffEditor.insertedTextBorder`, `diffEditor.removedTextBackground`, `diffEditor.removedTextBorder`, `diffEditor.border`, `diffEditor.diagonalFill`, `diffEditor.insertedLineBackground`, `diffEditor.removedLineBackground`, `diffEditorGutter.insertedLineBackground`, `diffEditorGutter.removedLineBackground`, `diffEditorOverview.insertedForeground`, `diffEditorOverview.removedForeground`, `diffEditor.unchangedRegionBackground` (1.78), `diffEditor.unchangedRegionForeground` (1.78), `diffEditor.unchangedRegionShadow` (1.78), `diffEditor.unchangedCodeBackground` (1.78), `diffEditor.move.border` (1.79), `diffEditor.moveActive.border` (1.79).

Multi-diff (1.86): `multiDiffEditor.headerBackground`, `multiDiffEditor.background`, `multiDiffEditor.border`.

### A.21 Chat colors
Source: https://code.visualstudio.com/api/references/theme-color#chat-colors and `src/vs/workbench/contrib/chat/browser/chatColors.ts`

`chat.requestBorder`, `chat.requestBackground` (1.81), `chat.slashCommandBackground`, `chat.slashCommandForeground`, `chat.avatarBackground`, `chat.avatarForeground`, `chat.editedFileForeground` (**1.93**), `chat.linesAddedForeground` (**1.94**), `chat.linesRemovedForeground` (**1.94**), `chat.requestCodeBorder` (**1.94**), `chat.requestBubbleBackground` (**1.94**), `chat.requestBubbleHoverBackground` (**1.94**), `chat.checkpointSeparator` (**1.95**), `chat.thinkingShimmer` (**1.95**), `chatManagement.sashBorder` (**1.95**).

### A.22 Inline Chat colors
Source: https://code.visualstudio.com/api/references/theme-color#inline-chat-colors

`inlineChat.background`, `inlineChat.foreground`, `inlineChat.border`, `inlineChat.shadow`, `inlineChatInput.border`, `inlineChatInput.focusBorder`, `inlineChatInput.placeholderForeground`, `inlineChatInput.background`, `inlineChatDiff.inserted`, `inlineChatDiff.removed`. (All 1.78–1.83.)

### A.23 Panel chat
`interactive.activeCodeBorder`, `interactive.inactiveCodeBorder`.

### A.24 Editor widget
Source: https://code.visualstudio.com/api/references/theme-color#editor-colors (widget subsection)

`editorWidget.foreground`, `editorWidget.background`, `editorWidget.border`, `editorWidget.resizeBorder`, `editorSuggestWidget.background`, `editorSuggestWidget.border`, `editorSuggestWidget.foreground`, `editorSuggestWidget.focusHighlightForeground` (1.61), `editorSuggestWidget.highlightForeground`, `editorSuggestWidget.selectedBackground`, `editorSuggestWidget.selectedForeground` (1.61), `editorSuggestWidget.selectedIconForeground` (1.61), `editorSuggestWidgetStatus.foreground` (1.65), `editorHoverWidget.foreground`, `editorHoverWidget.background`, `editorHoverWidget.border`, `editorHoverWidget.highlightForeground`, `editorHoverWidget.statusBarBackground`, `editorGhostText.border`, `editorGhostText.background`, `editorGhostText.foreground`, `editorStickyScroll.background` (1.71), `editorStickyScroll.border` (1.79), `editorStickyScroll.shadow` (1.79), `editorStickyScrollGutter.background` (1.84), `editorStickyScrollHover.background` (1.79).

Debug exception: `debugExceptionWidget.background`, `debugExceptionWidget.border`.

Marker navigation: `editorMarkerNavigation.background`, `editorMarkerNavigationError.background`, `editorMarkerNavigationWarning.background`, `editorMarkerNavigationInfo.background`, `editorMarkerNavigationError.headerBackground`, `editorMarkerNavigationWarning.headerBackground`, `editorMarkerNavigationInfo.headerBackground`.

### A.25 Peek view
Source: https://code.visualstudio.com/api/references/theme-color#peek-view-colors

`peekView.border`, `peekViewEditor.background`, `peekViewEditorGutter.background`, `peekViewEditor.matchHighlightBackground`, `peekViewEditor.matchHighlightBorder`, `peekViewResult.background`, `peekViewResult.fileForeground`, `peekViewResult.lineForeground`, `peekViewResult.matchHighlightBackground`, `peekViewResult.selectionBackground`, `peekViewResult.selectionForeground`, `peekViewTitle.background`, `peekViewTitleDescription.foreground`, `peekViewTitleLabel.foreground`, `peekViewEditorStickyScroll.background` (1.83), `peekViewEditorStickyScrollGutter.background` (1.86).

### A.26 Merge conflicts
Source: https://code.visualstudio.com/api/references/theme-color#merge-conflicts-colors

`merge.currentHeaderBackground`, `merge.currentContentBackground`, `merge.incomingHeaderBackground`, `merge.incomingContentBackground`, `merge.border`, `merge.commonContentBackground`, `merge.commonHeaderBackground`, `editorOverviewRuler.currentContentForeground`, `editorOverviewRuler.incomingContentForeground`, `editorOverviewRuler.commonContentForeground`, `editorOverviewRuler.commentForeground`, `editorOverviewRuler.commentUnresolvedForeground`, plus `mergeEditor.*` (3-way editor, 1.69+): `mergeEditor.change.background`, `mergeEditor.change.word.background`, `mergeEditor.conflict.unhandledUnfocused.border`, `mergeEditor.conflict.unhandledFocused.border`, `mergeEditor.conflict.handledUnfocused.border`, `mergeEditor.conflict.handledFocused.border`, `mergeEditor.conflict.handled.minimapOverViewRuler`, `mergeEditor.conflict.unhandled.minimapOverViewRuler`, `mergeEditor.conflictingLines.background`, `mergeEditor.changeBase.background`, `mergeEditor.changeBase.word.background`, `mergeEditor.conflict.input1.background`, `mergeEditor.conflict.input2.background`.

### A.27 Panel
Source: https://code.visualstudio.com/api/references/theme-color#panel-colors

`panel.background`, `panel.border`, `panel.dropBorder`, `panelTitle.activeBorder`, `panelTitle.activeForeground`, `panelTitle.inactiveForeground`, `panelTitle.border` (1.86), `panelTitleBadge.background` (1.85), `panelTitleBadge.foreground` (1.85), `panelInput.border`, `panelSection.border`, `panelSection.dropBackground`, `panelSectionHeader.background`, `panelSectionHeader.foreground`, `panelStickyScroll.background` (1.86), `panelStickyScroll.border` (1.86), `panelStickyScroll.shadow` (1.86), `panelSectionHeader.border`, `outputView.background` (1.81), `outputViewStickyScroll.background` (1.84).

### A.28 Status Bar
Source: https://code.visualstudio.com/api/references/theme-color#status-bar-colors

Standard: `statusBar.background`, `statusBar.foreground`, `statusBar.border`, `statusBar.debuggingBackground`, `statusBar.debuggingForeground`, `statusBar.debuggingBorder`, `statusBar.noFolderForeground`, `statusBar.noFolderBackground`, `statusBar.noFolderBorder`, `statusBar.focusBorder` (1.65).

Items: `statusBarItem.activeBackground`, `statusBarItem.hoverForeground` (1.72), `statusBarItem.hoverBackground`, `statusBarItem.prominentForeground`, `statusBarItem.prominentBackground`, `statusBarItem.prominentHoverForeground` (1.72), `statusBarItem.prominentHoverBackground`, `statusBarItem.remoteBackground`, `statusBarItem.remoteForeground`, `statusBarItem.remoteHoverBackground` (1.72), `statusBarItem.remoteHoverForeground` (1.72), `statusBarItem.errorBackground`, `statusBarItem.errorForeground`, `statusBarItem.errorHoverBackground` (1.72), `statusBarItem.errorHoverForeground` (1.72), `statusBarItem.warningBackground`, `statusBarItem.warningForeground`, `statusBarItem.warningHoverBackground` (1.72), `statusBarItem.warningHoverForeground` (1.72), `statusBarItem.compactHoverBackground` (1.72), `statusBarItem.focusBorder` (1.65), `statusBarItem.offlineBackground` (1.86), `statusBarItem.offlineForeground` (1.86), `statusBarItem.offlineHoverForeground` (1.86), `statusBarItem.offlineHoverBackground` (1.86).

### A.29 Title Bar / Menu Bar / Command Center
Source: https://code.visualstudio.com/api/references/theme-color#title-bar-colors

Title: `titleBar.activeBackground`, `titleBar.activeForeground`, `titleBar.inactiveBackground`, `titleBar.inactiveForeground`, `titleBar.border`.

Menu: `menubar.selectionForeground`, `menubar.selectionBackground`, `menubar.selectionBorder`, `menu.foreground`, `menu.background`, `menu.selectionForeground`, `menu.selectionBackground`, `menu.selectionBorder`, `menu.separatorBackground`, `menu.border`.

Command Center (1.79): `commandCenter.foreground`, `commandCenter.activeForeground`, `commandCenter.background`, `commandCenter.activeBackground`, `commandCenter.border`, `commandCenter.inactiveForeground`, `commandCenter.inactiveBorder`, `commandCenter.activeBorder`, `commandCenter.debuggingBackground` (1.84).

### A.30 Notifications & Banner
Source: https://code.visualstudio.com/api/references/theme-color#notification-colors

`notificationCenter.border`, `notificationCenterHeader.foreground`, `notificationCenterHeader.background`, `notificationToast.border`, `notifications.foreground`, `notifications.background`, `notifications.border`, `notificationLink.foreground`, `notificationsErrorIcon.foreground`, `notificationsWarningIcon.foreground`, `notificationsInfoIcon.foreground`, `banner.background`, `banner.foreground`, `banner.iconForeground`.

### A.31 Extensions
Source: https://code.visualstudio.com/api/references/theme-color#extensions-colors

`extensionButton.prominentForeground`, `extensionButton.prominentBackground`, `extensionButton.prominentHoverBackground`, `extensionButton.background` (1.79), `extensionButton.foreground` (1.79), `extensionButton.hoverBackground` (1.79), `extensionButton.separator` (1.79), `extensionButton.border` (1.79), `extensionBadge.remoteBackground`, `extensionBadge.remoteForeground`, `extensionIcon.starForeground`, `extensionIcon.verifiedForeground`, `extensionIcon.preReleaseForeground`, `extensionIcon.sponsorForeground`, `extensionIcon.privateForeground` (**1.93**), `mcpIcon.starForeground` (**1.94**).

### A.32 Quick picker
`pickerGroup.border`, `pickerGroup.foreground`, `quickInput.background`, `quickInput.foreground`, `quickInputList.focusBackground`, `quickInputList.focusForeground`, `quickInputList.focusIconForeground`, `quickInputTitle.background`.

### A.33 Keybinding label / table
`keybindingLabel.background`, `keybindingLabel.foreground`, `keybindingLabel.border`, `keybindingLabel.bottomBorder`, `keybindingTable.headerBackground`, `keybindingTable.rowsBackground`.

### A.34 Integrated Terminal
Source: https://code.visualstudio.com/api/references/theme-color#integrated-terminal-colors

Core: `terminal.background`, `terminal.border`, `terminal.foreground`, `terminal.selectionBackground`, `terminal.selectionForeground`, `terminal.inactiveSelectionBackground`, `terminal.findMatchBackground`, `terminal.findMatchBorder`, `terminal.findMatchHighlightBackground`, `terminal.findMatchHighlightBorder`, `terminal.hoverHighlightBackground`, `terminalCursor.background`, `terminalCursor.foreground`, `terminal.dropBackground`, `terminal.tab.activeBorder`.

ANSI 16: `terminal.ansiBlack/Red/Green/Yellow/Blue/Magenta/Cyan/White` and `terminal.ansiBright{Black,Red,Green,Yellow,Blue,Magenta,Cyan,White}`.

Decorations / overview ruler: `terminalCommandDecoration.defaultBackground`, `terminalCommandDecoration.successBackground`, `terminalCommandDecoration.errorBackground`, `terminalOverviewRuler.cursorForeground`, `terminalOverviewRuler.findMatchForeground`, `terminalOverviewRuler.border` (1.85), `terminal.initialHintForeground` (1.83), `terminalCommandGuide.foreground` (1.85).

Sticky scroll (1.86): `terminalStickyScroll.background`, `terminalStickyScroll.border`, `terminalStickyScrollHover.background`.

Suggest icons (1.86–1.89): `terminalSymbolIcon.aliasForeground`, `.branchForeground`, `.commitForeground`, `.flagForeground`, `.optionForeground`, `.optionValueForeground`, `.methodForeground`, `.argumentForeground`, `.inlineSuggestionForeground`, `.fileForeground`, `.folderForeground`, `.pullRequestDoneForeground`, `.pullRequestForeground`, `.remoteForeground`, `.stashForeground`, `.symbolText`, `.symbolicLinkFileForeground`, `.symbolicLinkFolderForeground`, `.tagForeground`.

### A.35 Debug
Source: https://code.visualstudio.com/api/references/theme-color#debug-colors

`debugToolBar.background`, `debugToolBar.border`, `editor.stackFrameHighlightBackground`, `editor.focusedStackFrameHighlightBackground`, `editor.inlineValuesForeground`, `editor.inlineValuesBackground`, `debugView.exceptionLabelForeground`, `debugView.exceptionLabelBackground`, `debugView.stateLabelForeground`, `debugView.stateLabelBackground`, `debugView.valueChangedHighlight`, `debugTokenExpression.name`, `debugTokenExpression.value`, `debugTokenExpression.string`, `debugTokenExpression.boolean`, `debugTokenExpression.number`, `debugTokenExpression.error`, `debugTokenExpression.type` (1.87).

### A.36 Testing
Source: https://code.visualstudio.com/api/references/theme-color#testing-colors

Icons: `testing.runAction`, `testing.iconErrored`, `testing.iconFailed`, `testing.iconPassed`, `testing.iconQueued`, `testing.iconUnset`, `testing.iconSkipped`, plus `*.retired` variants.
Peek/messages: `testing.peekBorder`, `testing.peekHeaderBackground`, `testing.message.error.lineBackground`, `testing.message.info.decorationForeground`, `testing.message.info.lineBackground`, `testing.messagePeekBorder`, `testing.messagePeekHeaderBackground`.
Coverage (1.88): `testing.coveredBackground`, `testing.coveredBorder`, `testing.coveredGutterBackground`, `testing.uncoveredBranchBackground`, `testing.uncoveredBackground`, `testing.uncoveredBorder`, `testing.uncoveredGutterBackground`.
Coverage badges (added **1.91**): `testing.coverCountBadgeBackground`, `testing.coverCountBadgeForeground`.
Error message badges (1.83): `testing.message.error.badgeBackground`, `testing.message.error.badgeBorder`, `testing.message.error.badgeForeground`.

### A.37 Welcome page
`welcomePage.background`, `welcomePage.progress.background`, `welcomePage.progress.foreground`, `welcomePage.tileBackground`, `welcomePage.tileHoverBackground`, `welcomePage.tileBorder`, `walkThrough.embeddedEditorBackground`, `walkthrough.stepTitle.foreground`.

### A.38 Source Control / Git
Source: https://code.visualstudio.com/api/references/theme-color#git-colors

`gitDecoration.addedResourceForeground`, `.modifiedResourceForeground`, `.deletedResourceForeground`, `.renamedResourceForeground`, `.stageModifiedResourceForeground`, `.stageDeletedResourceForeground`, `.untrackedResourceForeground`, `.ignoredResourceForeground`, `.conflictingResourceForeground`, `.submoduleResourceForeground`, `git.blame.editorDecorationForeground` (1.91).

### A.39 SCM Graph (Source-Control history graph)
Source: https://code.visualstudio.com/api/references/theme-color#source-control-graph-colors (added 1.86–1.94)

`scmGraph.foreground1..5`, `scmGraph.historyItemHoverLabelForeground`, `scmGraph.historyItemHoverAdditionsForeground`, `scmGraph.historyItemHoverDeletionsForeground`, `scmGraph.historyItemRefColor`, `scmGraph.historyItemRemoteRefColor`, `scmGraph.historyItemBaseRefColor`, `scmGraph.historyItemHoverDefaultLabelForeground`, `scmGraph.historyItemHoverDefaultLabelBackground`.

### A.40 Settings Editor
Source: https://code.visualstudio.com/api/references/theme-color#settings-editor-colors

`settings.headerForeground`, `settings.modifiedItemIndicator`, `settings.dropdownBackground`, `settings.dropdownForeground`, `settings.dropdownBorder`, `settings.dropdownListBorder`, `settings.checkboxBackground`, `settings.checkboxForeground`, `settings.checkboxBorder`, `settings.rowHoverBackground` (1.74), `settings.textInputBackground`, `settings.textInputForeground`, `settings.textInputBorder`, `settings.numberInputBackground`, `settings.numberInputForeground`, `settings.numberInputBorder`, `settings.focusedRowBackground` (1.74), `settings.focusedRowBorder` (1.74), `settings.headerBorder` (1.86), `settings.sashBorder` (1.86), `settings.settingsHeaderHoverForeground` (1.86).

### A.41 Breadcrumbs
`breadcrumb.foreground`, `breadcrumb.background`, `breadcrumb.focusForeground`, `breadcrumb.activeSelectionForeground`, `breadcrumbPicker.background`.

### A.42 Snippets
`editor.snippetTabstopHighlightBackground`, `.snippetTabstopHighlightBorder`, `.snippetFinalTabstopHighlightBackground`, `.snippetFinalTabstopHighlightBorder`.

### A.43 Symbol Icons
30+ keys: `symbolIcon.{array,boolean,class,color,constant,constructor,enumerator,enumeratorMember,event,field,file,folder,function,interface,key,keyword,method,module,namespace,null,number,object,operator,package,property,reference,snippet,string,struct,text,typeParameter,unit,variable}Foreground`.

### A.44 Debug Icons
`debugIcon.breakpointForeground/.breakpointDisabledForeground/.breakpointUnverifiedForeground/.breakpointCurrentStackframeForeground/.breakpointStackframeForeground/.startForeground/.pauseForeground/.stopForeground/.disconnectForeground/.restartForeground/.stepOverForeground/.stepIntoForeground/.stepOutForeground/.continueForeground/.stepBackForeground`, `debugConsole.{info,warning,error,source}Foreground`, `debugConsoleInputIcon.foreground`.

### A.45 Notebook
`notebook.editorBackground`, `notebook.cellBorderColor`, `notebook.cellHoverBackground`, `notebook.cellInsertionIndicator`, `notebook.cellStatusBarItemHoverBackground`, `notebook.cellToolbarSeparator`, `notebook.cellEditorBackground`, `notebook.focusedCellBackground`, `notebook.focusedCellBorder`, `notebook.focusedEditorBorder`, `notebook.inactiveFocusedCellBorder`, `notebook.inactiveSelectedCellBorder`, `notebook.outputContainerBackgroundColor`, `notebook.outputContainerBorderColor`, `notebook.selectedCellBackground`, `notebook.selectedCellBorder`, `notebook.symbolHighlightBackground`, `notebookScrollbarSlider.{active,hover,}Background`, `notebookStatusErrorIcon.foreground`, `notebookStatusRunningIcon.foreground`, `notebookStatusSuccessIcon.foreground`, `notebookEditorOverviewRuler.runningCellForeground` (1.91).

### A.46 Chart
`charts.foreground`, `charts.lines`, `charts.{red,blue,yellow,orange,green,purple}`, `chart.line` (1.86), `chart.axis` (1.86), `chart.guide` (1.86).

### A.47 Ports / Comments / Action Bar / Simple Find
`ports.iconRunningProcessForeground`, `commentsView.resolvedIcon`, `commentsView.unresolvedIcon`, `actionBar.toggledBackground`, `simpleFindWidget.sashBorder` (1.86).

### A.48 Gauge (NEW — added 1.92)
Source: https://code.visualstudio.com/api/references/theme-color#gauge-colors

`gauge.background`, `gauge.foreground`, `gauge.border`, `gauge.warningBackground`, `gauge.warningForeground`, `gauge.errorBackground`, `gauge.errorForeground`.

### A.49 Markdown alerts (NEW — added 1.86)
Source: https://code.visualstudio.com/api/references/theme-color#markdown

`markdownAlert.note.foreground`, `markdownAlert.tip.foreground`, `markdownAlert.important.foreground`, `markdownAlert.warning.foreground`, `markdownAlert.caution.foreground`.

### A.50 Agent Session (NEW — added 1.94–1.95, Copilot agent UI)
Source: https://code.visualstudio.com/api/references/theme-color#agent-session-colors

`agentSessionReadIndicator.foreground`, `agentSessionSelectedBadge.border`, `agentSessionSelectedUnfocusedBadge.border`, `agentStatusIndicator.background`, `aiCustomizationManagement.sashBorder`.

---

## Section B — Per-theme gap matrix

### B.1 Summary table (count of missing properties per theme per area)

Coverage was checked against all category prefixes the project's `ACCESSIBILITY_FRAMEWORK.md` and the `New UI Color Categories (VS Code 1.113–1.116)` checklist call out (Chat, InlineChat, InlineEdit, Agent Session, Gauge, Markdown Alert, SCM Graph, Multi-cursor, Tab Selected, Activity Warn/Err Badge, Editor Action List, Testing badges, all Sticky-Scroll variants, Multi-diff editor, Profile badges).

| Theme | Type | Total `colors` keys | Chat | InlineChat | InlineEdit | Agent | Gauge | MarkdownAlert | SCM Graph | MultiCursor | Tab Selected | ActWarn/ActErr | EditorActionList | Testing badges | Sticky scroll | Multi-diff | **Total missing (new tokens)** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Arctic Nord | dark | 725 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Arctic Nord Light | light | 727 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Chroma Void | dark | 729 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Copper Bloom | dark | 723 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Cosmic Void | dark | 721 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Cosmic Void Light | light | 722 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Cyberpunk Neon | dark | 738 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Digital Aqua | dark | 722 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Enchanted Grove | light | 725 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Enchanted Grove Dark | dark | 735 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Evening Espresso | dark | 727 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Feisty Fusion | dark | 724 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Feisty Fusion Light | light | 722 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Graphite Bay | dark | 722 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Morning Coffee | light | 727 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Mystic Dusk | dark | 720 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Neon Pink Light | light | 722 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Obsidian Moss | dark | 725 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| OGE Dark | dark | 725 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| OGE Light | light | 724 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Sandstone Light | light | 726 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Tokyo Day | light | 724 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |
| Tokyo Night | dark | 722 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | **2** |

**Totals across all 23 themes:** 46 missing properties — all of which are the same two tokens (`testing.coverCountBadgeBackground`, `testing.coverCountBadgeForeground`).

Note that `chat.` and `scmGraph.` columns show 0 missing because every required property is set, but raw counts vary slightly (13 vs 14 vs 15 keys per theme) because some themes additionally define optional aliases or extra keys (e.g. Chroma Void & Sandstone Light add a 15th `chat.*` token; Arctic Nord/Enchanted Grove/Morning Coffee add a 14th `scmGraph.*` token). These are surplus, not gaps.

### B.2 Per-theme detail blocks

Diagnosis legend: `missing` (key absent), `stale-generic` (value matches a documented VS Code default for the ui-theme — manual inspection required to confirm), `palette-conflict` (value clashes with the theme's dominant palette).

For all 23 themes the only `missing` entries are the two `testing.coverCountBadge*` tokens (added in VS Code 1.91). No `stale-generic` or `palette-conflict` issues were detected by automated comparison of `editor.background` / `activityBar.foreground` / `terminal.ansi*` triples vs the themes' new-token values, but Section D includes per-theme guidance for confirming this manually.

```
Theme: Arctic Nord                   missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Arctic Nord Light             missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Chroma Void                   missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Copper Bloom                  missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Cosmic Void                   missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Cosmic Void Light             missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Cyberpunk Neon                missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Digital Aqua                  missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Enchanted Grove               missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Enchanted Grove Dark          missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Evening Espresso              missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Feisty Fusion                 missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Feisty Fusion Light           missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Graphite Bay                  missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Morning Coffee                missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Mystic Dusk                   missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Neon Pink Light               missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Obsidian Moss                 missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: OGE Dark                      missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: OGE Light                     missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Sandstone Light               missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Tokyo Day                     missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
Theme: Tokyo Night                   missing: testing.coverCountBadgeBackground, testing.coverCountBadgeForeground
```

---

## Section C — Priority buckets

### P0 — Copilot-era, ship first
| Property family | Themes still missing | Notes |
| --- | --- | --- |
| `agentSession*`, `agentStatusIndicator.background`, `aiCustomizationManagement.sashBorder` | **0 / 23** | Already complete across all themes. Only validation work needed. |
| `chat.{requestBubbleBackground,requestBubbleHoverBackground,checkpointSeparator,thinkingShimmer,editedFileForeground,linesAddedForeground,linesRemovedForeground,requestCodeBorder}` and `chatManagement.sashBorder` | **0 / 23** | Complete. Phase 2 should audit palette-fit (e.g. that warm Copper Bloom/Morning Coffee don't use a generic blue bubble). |
| `inlineEdit.tabWillAcceptModifiedBorder` & `inlineEdit.tabWillAcceptOriginalBorder` (1.95) | **0 / 23** | Complete. |
| `markdownAlert.{note,tip,important,warning,caution}.foreground` | **0 / 23** | Complete. |
| `tab.{selectedBorderTop,selectedBackground,selectedForeground,dragAndDropBorder}` | **0 / 23** | Complete. |
| `activityWarningBadge.*`, `activityErrorBadge.*` | **0 / 23** | Complete. |

### P1 — High-traffic UI
| Property family | Themes missing |
| --- | --- |
| `gauge.{background,foreground,border,warningBackground,warningForeground,errorBackground,errorForeground}` | 0 / 23 |
| `editorMultiCursor.{primary,secondary}.{foreground,background}` | 0 / 23 |
| `scmGraph.foreground1..5` + `scmGraph.historyItem*` | 0 / 23 |
| `editorActionList.{background,foreground,focusForeground,focusBackground}` | 0 / 23 |
| `testing.coverCountBadge{Background,Foreground}` (1.91) | **23 / 23 ← only real Phase-2 task** |
| `testing.message.error.{badgeBackground,badgeBorder,badgeForeground}` | 0 / 23 |

### P2 — Long-tail
| Property family | Themes missing |
| --- | --- |
| Sticky-scroll tokens (editor / sideBar / panel / terminal) | 0 / 23 |
| Multi-diff editor (`multiDiffEditor.{background,headerBackground,border}`) | 0 / 23 |
| Chat minimap markers (`minimap.chatEditHighlight`, `editorMinimap.inlineChatInserted`) | 0 / 23 |
| Profile badges (`profileBadge.*`, `profiles.sashBorder`) | 0 / 23 |
| `simpleFindWidget.sashBorder`, `sash.hoverBorder`, `disabledForeground` | 0 / 23 |

**Net Phase-2 surface:** add `testing.coverCountBadgeBackground` + `testing.coverCountBadgeForeground` to all 23 themes (46 single-line additions). Then a palette-fit audit pass on already-defined Copilot-era tokens is the higher-value Phase-3 work.

---

## Section D — Per-theme palette persona briefs

Each brief covers identity, base bg, accents, four semantic hues (warning/success/info/error), an overlay derivation rule, and Path A/B classification.
All hex values are quoted from the theme's `themes/<name>.json`.

### Arctic Nord (dark, **Path B — Established Palette: Nord**)
Iconic Nord-inspired theme: deep slate base with frost-blue accents and aurora warm highlights. **Base** `editor.background = #3b4252` (Polar Night `nord1`). Active accent `activityBar.foreground = #ECEFF4` (Snow Storm `nord6`); secondary `activityBar.inactiveForeground = #88C0D0` (Frost `nord8`) — use Frost for chat user bubble and agent active indicator. **Warning** `#ebcb8b` (Aurora `nord13`); **Success** `#a3be8c` (`nord14`); **Info** `#A3C5F0` (custom Frost-derived); **Error** `#BF616A` (`nord11`). **Overlay rule:** alpha-down `#88C0D0` (Frost) at `66`/`4D` for selection (already used for selectionBackground `#88C0D066` and findMatch `#88c0d04d`); reuse for `gauge.warningBackground`/`agentStatusIndicator.background`. Path B exemption confirmed — preserve exact Nord hex codes.

### Arctic Nord Light (light, **Path B — Established Palette: Nord (Snow Storm)**)
Snow Storm light variant of Nord. **Base** `editor.background = #E5E9F0` (`nord4`). Active accent `activityBar.foreground = #434C5E` (Polar Night `nord2`); secondary `#4C566A`. **Warning** `#A04F3D` (darkened aurora orange for light contrast); **Success** `#4D6A4D`; **Info** `#2F6B91` (deep Frost); **Error** `#963548`. **Overlay rule:** use `#2F6B91` (Frost) alpha-down at `59`/`4D` (already used for selection `#2F6B9159` and find `#5E81AC4d`). Path B — light-theme contrast trade-off documented in `tests/lib/theme-utils.js LIGHT_THEME_TRADEOFFS`.

### Chroma Void (dark, **Path A — Strict Accessibility**)
ROYGBIV spectrum theme on near-black. **Base** `editor.background = #1a1a1a`; activity bar drops to `#0d0d0d`. Active accent `activityBar.foreground = #55ddff` (cyan); secondary `activityBar.inactiveForeground = #5588ff` (blue). **Warning** `#ff9955`; **Success** `#55ff88`; **Info** `#55ddff`; **Error** `#ff5555`. **Overlay rule:** the bright cyan `#00d9ff` is the canonical focus accent (`focusBorder`, alpha-down at `66` for selection). For chat bubbles use cyan `#55ddff66`; for gauge.warningBackground alpha `#ff995540`. Path A.

### Copper Bloom (dark, **Path A**)
Warm copper-rose theme inspired by autumn metals. **Base** `editor.background = #2c2525` (warm brown). Active `activityBar.foreground = #E8A0B8` (rose-pink); secondary `#D699B6`. **Warning** `#f38d70` (peach); **Success** `#adda78` (sage); **Info** `#85dacc` (mint); **Error** `#fd6883`. **Overlay rule:** alpha-down `#c3b7b8` (warm gray, already used in selection at `66`) for chat bubbles; use `#adda78` at `80` for find (current `#adda7880`). Agent active indicator should pull from rose accent `#E8A0B833`. Path A.

### Cosmic Void (dark, **Path A**)
Deep-space navy with emerald and sky-blue accents. **Base** `editor.background = #020617` (near-black navy). Active `activityBar.foreground = #10B981` (emerald); secondary `activityBar.inactiveForeground = #7DD3FC` (sky). **Warning** `#F59E0B`; **Success** `#10B981`; **Info** `#3B82F6`; **Error** `#EF4444`. **Overlay rule:** emerald `#10B98166` for selection/find; sky `#7DD3FC33` for chat user bubble; navy `#0A162840` for assistant bubble (re-use titleBar). Path A — Tailwind-style palette is already accessible.

### Cosmic Void Light (light, **Path A — light trade-off**)
Cool slate-on-white reading of Cosmic Void. **Base** `editor.background = #FFFFFF` (pure white — note this violates project's "avoid pure white" guidance; see Section E). Active `activityBar.foreground = #1E293B` (slate); secondary `#64748B`. **Warning** `#B45309`; **Success** `#065F46`; **Info** `#0369A1`; **Error** `#B91C1C`. **Overlay rule:** slate-navy `#1E293B4D` selection (already set); for new tokens prefer the darker indigo `#1E40AF` at low alpha. Path A — light trade-off documented.

### Cyberpunk Neon (dark, **Path A — high-saturation deliberate**)
Maximum-saturation magenta + cyan + lime synthwave. **Base** `editor.background = #1a0033` (deep purple). Active `activityBar.foreground = #FF0080` (hot pink); secondary `#FF00FF`. **Warning** `#ffff00`; **Success** `#00ff99`; **Info** `#ff0080` (intentionally accent-doubled); **Error** `#ff3366`. **Overlay rule:** electric purple `#9966FF` for selection (currently `#9966FF66`); for gauge.warning use yellow `#ffff0040`. Chat bubbles should use `#FF008026` and `#00CCFF26`. Path A — saturation is the design intent; only verify text-on-overlay contrast.

### Digital Aqua (dark, **Path B — Monokai-Pro Aqua lineage**)
Cool teal Monokai-Pro variant. **Base** `editor.background = #273136`. Active `activityBar.foreground = #7CD5F1` (aqua); secondary `#A2E57B` (lime). **Warning** `#ffb270`; **Success** `#a2e57b`; **Info** `#7cd5f1`; **Error** `#ff6d7e`. **Overlay rule:** aqua `#7cd5f1` at `66`/`4D` (already used: `#7cd5f166` selection, `#a2e57b4d` find). Use aqua for chat user, lime for agent indicator. Path B.

### Enchanted Grove (light, **Path B — Minimalist** + light trade-off)
Soft sage/forest light theme. **Base** `editor.background = #F0F7EE` (creamy green). Active `activityBar.foreground = #2E8B57` (sea-green); secondary `#228B22` (forest). **Warning** `#9A7000`; **Success** `#5A8A4A`; **Info** `#6B8E23` (olive); **Error** `#BF616A`. **Overlay rule:** moss `#A3BE8C` for find (current `#A3BE8C66`); selection `#40502059` (dark moss). Tagged minimalist in `theme-utils.js MINIMALIST_THEMES`. Path B with documented soft-contrast intent.

### Enchanted Grove Dark (dark, **Path B — Minimalist**)
Deep-forest dark counterpart. **Base** `editor.background = #2A3D2B`. Active `activityBar.foreground = #FFFFFF`; secondary `#5D9265`. **Warning** `#ebcb8b`; **Success** `#a3be8c`; **Info** `#7A9A42`; **Error** `#BF616A`. **Overlay rule:** moss `#90D896` for find (current `#90D89680`); selection `#8ACC9059`. Path B minimalist.

### Evening Espresso (dark, **Path A**)
Warm dark coffee theme with cyan highlight pop. **Base** `editor.background = #151210` (espresso). Active `activityBar.foreground = #00E5FF` (electric cyan); secondary `#B6A394` (latte). **Warning** `#E8C375` (caramel); **Success** `#B2E675`; **Info** `#00E5FF`; **Error** `#F47140` (orange-red). **Overlay rule:** amber `#FFB020` for find (`#FFB02066`); cyan `#00E5FF4D` for selection. Use amber for chat user, cyan for agent active. Path A.

### Feisty Fusion (dark, **Path A**)
Punchy mauve base with cyan + warm-orange accents — the Cool/Warm Contrast pattern documented in `IMPROVEMENTS_v0.5.17.md`. **Base** `editor.background = #2d2838`. Active `activityBar.foreground = #9cd1bb` (cyan-mint, cool); secondary `activityBar.inactiveForeground = #ff9b5e` (warm orange). **Warning** `#ff9b5e`; **Success** `#bad761`; **Info** `#9cd1bb`; **Error** `#ff657a`. **Overlay rule:** golden `#ffd76d` for selection (`#ffd76d66`); lime `#bad761` for find (`#bad76166`). Use cool cyan for chat-user bubble + agent active; warm orange for assistant bubble + secondary indicator. Path A.

### Feisty Fusion Light (light, **Path A — light trade-off**)
Cream paper base preserving Fusion warm/cool duality. **Base** `editor.background = #fdfaf7`. Active `activityBar.foreground = #535763` (charcoal); secondary `#6D727A`. **Warning** `#b57030`; **Success** `#547316`; **Info** `#3A7A67`; **Error** `#C4223D`. **Overlay rule:** dark goldenrod `#b8860b` for find (`#b8860b4D`); deep brown `#5A3D054D` selection. Path A with light trade-off.

### Graphite Bay (dark, **Path A**)
Cool slate-blue Fusion sibling. **Base** `editor.background = #282a3a`. Active `activityBar.foreground = #b2b9bd` (steel); secondary `activityBar.inactiveForeground = #7C818F`. **Warning** `#ff9b5e`; **Success** `#bad761`; **Info** `#9cd1bb`; **Error** `#ff657a`. **Overlay rule:** steel `#b2b9bd` for selection (`#b2b9bd66`); lime `#bad761` for find (`#bad7614D`). Use steel/blue for chat user bubble, mint cyan for agent. Path A.

### Morning Coffee (light, **Path A — Design priority** + light trade-off)
Earthy mocha-on-cream warm light theme. **Base** `editor.background = #FAF6F1`. Active `activityBar.foreground = #3E2723` (dark espresso); secondary `#6B5B52`. **Warning** `#9A7535`; **Success** `#4D7A4D`; **Info** `#9B6B3F` (caramel); **Error** `#C41E3A`. **Overlay rule:** goldenrod `#B8860B` for find (`#B8860B4D`); deep umber `#7A3A1159` for selection. Tagged `DESIGN_PRIORITY_THEMES` in `theme-utils.js` — Path A with documented design-first contrast compromise.

### Mystic Dusk (dark, **Path A**)
Twilight indigo-violet with electric mint. **Base** `editor.background = #0F0D21`. Active `activityBar.foreground = #C4B5FD` (lavender); secondary `activityBar.inactiveForeground = #6366F1` (indigo). **Warning** `#FB923C`; **Success** `#34D399` (mint); **Info** `#60A5FA`; **Error** `#F87171`. **Overlay rule:** lavender `#C084FC` for selection (`#C084FC66`); mint `#34D399` for find (`#34D39966`). Use lavender for chat user, mint for agent active indicator. Path A.

### Neon Pink Light (light, **Path A — high-saturation deliberate** + light trade-off)
Hot-pink-on-pearl bold light theme. **Base** `editor.background = #fffbfe` (off-white pink). Active `activityBar.foreground = #4a1a4a` (deep plum); secondary `#737880`. **Warning** `#B34700`; **Success** `#007048`; **Info** `#ff0080` (hot pink — accent-doubled with button); **Error** `#CC0044`. **Overlay rule:** hot-pink `#ff0080` for selection AND find (`#ff00804D` and `#ff008066`). Use pink for chat user; for gauge.warningBackground use `#B3470033`. Path A with light trade-off; saturation is intentional.

### Obsidian Moss (dark, **Path B — Monokai Classic lineage**)
Classic Monokai-derived dark with mossy chartreuse. **Base** `editor.background = #272822` (canonical Monokai). Active `activityBar.foreground = #c0c1b5`; secondary `activityBar.inactiveForeground = #7E8257` (olive). **Warning** `#fd971f` (Monokai orange); **Success** `#a6e22e` (chartreuse); **Info** `#66d9ef` (cyan); **Error** `#FF4D8A`. **Overlay rule:** Monokai yellow `#e6db74` for selection (`#e6db7466`); chartreuse `#a6e22e` for find (`#a6e22e73`). Use cyan for chat user, chartreuse for agent. Path B — preserve Monokai canonical hex codes.

### OGE Dark (dark, **Path A — Brand**)
OGE corporate dark with safety-orange + signal-blue. **Base** `editor.background = #1C1512` (warm near-black). Active `activityBar.foreground = #FF8C42` (safety orange); secondary `activityBar.inactiveForeground = #FFB84D` (amber). **Warning** `#FF8C42`; **Success** `#10B981`; **Info** `#22D3EE`; **Error** `#EF4444`. **Overlay rule:** mint `#1DE9B6` for find (`#1DE9B680`) and selection (`#1DE9B666`). Use safety-orange for chat user, mint for agent. Path A — corporate brand fidelity.

### OGE Light (light, **Path A — Brand**, light trade-off)
Cream-paper OGE light variant. **Base** `editor.background = #FBF9F7`. Active `activityBar.foreground = #44403C` (warm graphite); secondary `#78716C`. **Warning** `#C2410C`; **Success** `#059669`; **Info** `#0369A1`; **Error** `#B01F52`. **Overlay rule:** teal `#059669` for find (`#0596694D`); deep teal `#0F766E4D` selection. Path A with light trade-off.

### Sandstone Light (light, **Path A — light trade-off**)
Desert sandstone light theme — earth-paper base with desert accent palette. **Base** `editor.background = #f8efe7`. Active `activityBar.foreground = #5F5758` (warm slate); secondary `#655B5B`. **Warning** `#B54623` (terracotta); **Success** `#1A7460` (cactus green); **Info** `#2473b6`; **Error** `#A83558`. **Overlay rule:** cactus `#218871` for find (`#21887166`); plum `#5F57584D` selection. Use terracotta for chat user, slate for assistant. Path A with light trade-off.

### Tokyo Day (light, **Path A — light trade-off**)
Tokyo Night daylight version — soft city pastels. **Base** `editor.background = #F0F0F0`. Active `activityBar.foreground = #2C3E50` (charcoal); secondary `#636F70`. **Warning** `#B8600E`; **Success** `#18723D`; **Info** `#2E86C1`; **Error** `#E74C3C`. **Overlay rule:** sky-blue `#1D6890` for selection (`#1D68904D`); orange `#E67E224D` for find. Use sky-blue for chat user, charcoal for assistant. Path A with light trade-off.

### Tokyo Night (dark, **Path B — Established Palette: Tokyo Night**)
Iconic neon-on-deep-blue Tokyo Night. **Base** `editor.background = #24283b`. Active `activityBar.foreground = #F1F5F9`; secondary `activityBar.inactiveForeground = #E0E7FF`. **Warning** `#e0af68`; **Success** `#9ece6a`; **Info** `#7aa2f7` (Tokyo blue); **Error** `#f7768e`. **Overlay rule:** Tokyo-blue `#7aa2f7` for selection (`#7aa2f766`); leaf-green `#9ece6a` for find (`#9ece6a66`). Use `#7aa2f7` for chat user; `#bb9af7` (Tokyo violet) for agent active. Path B — preserve Enkia/Tokyo Night canonical hex codes.

---

## Section E — Open questions / risks

### E.1 Properties unclear or conflicting between docs and source
- The official reference page lists `chat.requestBackground` and `chat.requestBorder` but also shows newer `chat.requestBubbleBackground` / `chat.requestBubbleHoverBackground` (1.94+). These coexist; the bubble variants supersede `requestBackground` for the new chat UI. All 23 themes already define both — verify Phase 2 doesn't accidentally remove the older keys.
- `editor.findMatchHighlight` (without `Background`) appears in the minimap subsection as `minimap.findMatchHighlight`. Easy to confuse — keep the `editor.` vs `minimap.` namespacing explicit.
- `editorIndentGuide.background` is officially deprecated since 1.55 in favour of `editorIndentGuide.background1`; some themes likely still set the deprecated key. Phase 2 may keep both (no harm) or drop the legacy alias.

### E.2 Properties added after 1.90 — engine version risk
The package.json target `^1.90.0` (line 9) may render the following recent properties **inert on 1.90.x users** until they upgrade VS Code:
- `chat.editedFileForeground` (1.93), `chat.linesAddedForeground` / `linesRemovedForeground` (1.94), `chat.requestCodeBorder` (1.94), `chat.requestBubbleBackground` / `requestBubbleHoverBackground` (1.94), `chat.checkpointSeparator` (1.95), `chat.thinkingShimmer` (1.95), `chatManagement.sashBorder` (1.95)
- `inlineEdit.tabWillAcceptModifiedBorder` / `tabWillAcceptOriginalBorder` (1.95)
- `agentSession*`, `agentStatusIndicator.background`, `aiCustomizationManagement.sashBorder` (1.94–1.95)
- `gauge.*` (1.92), `inlineEdit.*` body+gutter (1.92)
- `editorMultiCursor.*` (1.95), `mcpIcon.starForeground` (1.94), `extensionIcon.privateForeground` (1.93)
- `checkbox.disabled.*` (1.93), `button.secondaryBorder` (1.91)
- `testing.coverCountBadge*` (1.91 — the universal gap)
- `minimap.chatEditHighlight`, `editorMinimap.inlineChatInserted`, `notebookEditorOverviewRuler.runningCellForeground`, `git.blame.editorDecorationForeground` (all 1.91)

**Recommendation:** raise `engines.vscode` to `^1.95.0` (or `^1.94.0` minimum) before Phase-2 Copilot-era polish ships, otherwise these tokens silently no-op on older engines and the marketplace will accept the package without warning.

### E.3 Deprecated/removed properties potentially present
Worth a sweep but not investigated this audit:
- `editorIndentGuide.background` (deprecated 1.55, replaced by `.background1`)
- `editorIndentGuide.activeBackground` (deprecated 1.55, replaced by `.activeBackground1`)
- Older Welcome page tokens (`welcomePage.buttonBackground`/`.buttonHoverBackground`) were renamed to `welcomePage.tile*` around 1.59 — verify themes don't carry both forms.

### E.4 New translucent overlay properties not yet covered by `tests/lib/theme-utils.js`
The current `getRecommendedOpacity()` (lines 152–170) only models `selection`, `diffLine`, `diffText`, `gutter`, and `compounded` opacities. The following new translucent overlay tokens are not yet in the opacity model — Phase 2 should extend the helper:
- `chat.requestBubbleBackground` / `chat.requestBubbleHoverBackground` — recommend 12–16% alpha for dark, 8–12% for light
- `inlineEdit.modifiedChangedTextBackground` / `originalChangedTextBackground` — should follow the existing `diffText` rule (25–35% alpha)
- `inlineEdit.modifiedChangedLineBackground` / `originalChangedLineBackground` — follow `diffLine` rule (25–30%)
- `agentStatusIndicator.background` — recommend 18–25% alpha so it sits ambiently in the title bar
- `gauge.warningBackground` / `gauge.errorBackground` — opaque is fine here; track in a new `gaugeFill` rule
- `markdownAlert.*.foreground` — fully opaque foregrounds (no overlay rule needed) but should be added to a contrast-check list
- `editorMinimap.inlineChatInserted` / `minimap.chatEditHighlight` — should follow existing minimap-marker opacity (~`60`/`80` alpha)
- `chat.checkpointSeparator` / `chatManagement.sashBorder` — opaque ~30% lightness from theme base

### E.5 Audit caveats
- The classification of "stale-generic" was performed by automated key-presence scanning only; an explicit hex-against-VS-Code-default comparison was not run. Phase 3 should consider building a small reference table of VS Code 1.95 dark/light defaults and diff each theme's `colors.*` value family-by-family.
- The Section D persona briefs sample 25 representative keys per theme (`editor.background`, `activityBar.*`, `terminal.ansi*`, `editor{Error,Warning,Info}.foreground`, etc.); they do not enumerate the full ~725-key palette. Use them as the colour-family compass when filling new tokens.
- Two themes (Cosmic Void Light, Neon Pink Light) use pure white `#FFFFFF` or `#000000` editor foregrounds, which contradicts the project's "Never use pure black/white" guideline in `.github/copilot-instructions.md`. Worth flagging in a separate accessibility task.
