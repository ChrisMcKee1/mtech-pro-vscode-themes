#!/usr/bin/env node
/**
 * M Tech Themes - Workbench Key Validator (reverse validation)
 *
 * Validates that EVERY key in each theme's `colors{}` block is a real VS Code
 * workbench color key, as published in the official Theme Color Reference:
 *   https://code.visualstudio.com/api/references/theme-color
 *
 * Unlike comprehensive-property-audit.js (which checks for MISSING keys), this
 * script catches INVALID / dead / typo'd keys that VS Code silently ignores.
 *
 * Scope: only the `colors{}` object. `tokenColors` (TextMate) and
 * `semanticTokenColors` are NOT workbench keys and are intentionally skipped.
 */

const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.join(__dirname, '..', 'themes');

// Expand a numbered family, e.g. series('editorBracketHighlight.foreground', 1, 6)
function series(prefix, from, to, suffix = '') {
  const out = [];
  for (let i = from; i <= to; i++) out.push(`${prefix}${i}${suffix}`);
  return out;
}

// ─── Complete official workbench color allowlist (VS Code Theme Color Reference) ───
const VALID_KEYS = new Set([
  // Recently added VS Code tokens (registerColor, current source)
  'agentsMobileDiff.addedForeground', 'agentsMobileDiff.deletedForeground', 'agentsMobileDiff.modifiedForeground',
  'browser.border', 'strongForeground', 'minimap.foreground', 'editorStickyScroll.scrollbarShadow',
  'chat.inputWorkingBorderColor1', 'chat.inputWorkingBorderColor2', 'chat.inputWorkingBorderColor3',
  'editorCommentsWidget.clearForeground', 'editorCommentsWidget.rangeActiveBorder', 'editorCommentsWidget.rangeBorder',
  'testing.coveredMinimapBackground', 'testing.uncoveredMinimapBackground',
  // Contrast colors
  'contrastActiveBorder', 'contrastBorder',
  // Base colors
  'focusBorder', 'foreground', 'disabledForeground', 'widget.border', 'widget.shadow',
  'selection.background', 'descriptionForeground', 'errorForeground', 'icon.foreground', 'sash.hoverBorder',
  // Window border
  'window.activeBorder', 'window.inactiveBorder',
  // Text colors
  'textBlockQuote.background', 'textBlockQuote.border', 'textCodeBlock.background',
  'textLink.activeForeground', 'textLink.foreground',
  'textPreformat.foreground', 'textPreformat.background', 'textPreformat.border', 'textSeparator.foreground',
  // Action colors
  'toolbar.hoverBackground', 'toolbar.hoverOutline', 'toolbar.activeBackground',
  'editorActionList.background', 'editorActionList.foreground', 'editorActionList.focusForeground', 'editorActionList.focusBackground',
  // Button control
  'button.background', 'button.foreground', 'button.border', 'button.separator', 'button.hoverBackground',
  'button.secondaryForeground', 'button.secondaryBackground', 'button.secondaryHoverBackground', 'button.secondaryBorder',
  'checkbox.background', 'checkbox.foreground', 'checkbox.disabled.background', 'checkbox.disabled.foreground',
  'checkbox.border', 'checkbox.selectBackground', 'checkbox.selectBorder',
  'radio.activeForeground', 'radio.activeBackground', 'radio.activeBorder',
  'radio.inactiveForeground', 'radio.inactiveBackground', 'radio.inactiveBorder', 'radio.inactiveHoverBackground',
  // Dropdown control
  'dropdown.background', 'dropdown.listBackground', 'dropdown.border', 'dropdown.foreground',
  // Input control
  'input.background', 'input.border', 'input.foreground', 'input.placeholderForeground',
  'inputOption.activeBackground', 'inputOption.activeBorder', 'inputOption.activeForeground', 'inputOption.hoverBackground',
  'inputValidation.errorBackground', 'inputValidation.errorForeground', 'inputValidation.errorBorder',
  'inputValidation.infoBackground', 'inputValidation.infoForeground', 'inputValidation.infoBorder',
  'inputValidation.warningBackground', 'inputValidation.warningForeground', 'inputValidation.warningBorder',
  // Scrollbar control
  'scrollbar.background', 'scrollbar.shadow',
  'scrollbarSlider.activeBackground', 'scrollbarSlider.background', 'scrollbarSlider.hoverBackground',
  // Badge
  'badge.foreground', 'badge.background',
  // Progress bar
  'progressBar.background',
  // Lists and trees
  'list.activeSelectionBackground', 'list.activeSelectionForeground', 'list.activeSelectionIconForeground',
  'list.dropBackground', 'list.focusBackground', 'list.focusForeground', 'list.focusHighlightForeground',
  'list.focusOutline', 'list.focusAndSelectionOutline', 'list.highlightForeground',
  'list.hoverBackground', 'list.hoverForeground',
  'list.inactiveSelectionBackground', 'list.inactiveSelectionForeground', 'list.inactiveSelectionIconForeground',
  'list.inactiveFocusBackground', 'list.inactiveFocusOutline', 'list.invalidItemForeground',
  'list.errorForeground', 'list.warningForeground',
  'listFilterWidget.background', 'listFilterWidget.outline', 'listFilterWidget.noMatchesOutline', 'listFilterWidget.shadow',
  'list.filterMatchBackground', 'list.filterMatchBorder', 'list.deemphasizedForeground', 'list.dropBetweenBackground',
  'tree.indentGuidesStroke', 'tree.inactiveIndentGuidesStroke', 'tree.tableColumnsBorder', 'tree.tableOddRowsBackground',
  // Activity Bar
  'activityBar.background', 'activityBar.dropBorder', 'activityBar.foreground', 'activityBar.inactiveForeground',
  'activityBar.border', 'activityBarBadge.background', 'activityBarBadge.foreground',
  'activityBar.activeBorder', 'activityBar.activeBackground', 'activityBar.activeFocusBorder',
  'activityBarTop.foreground', 'activityBarTop.activeBorder', 'activityBarTop.inactiveForeground',
  'activityBarTop.dropBorder', 'activityBarTop.background', 'activityBarTop.activeBackground',
  'activityWarningBadge.foreground', 'activityWarningBadge.background', 'activityErrorBadge.foreground', 'activityErrorBadge.background',
  // Profiles
  'profileBadge.background', 'profileBadge.foreground', 'profiles.sashBorder',
  // Side Bar
  'sideBar.background', 'sideBar.foreground', 'sideBar.border', 'sideBar.dropBackground',
  'sideBarTitle.foreground', 'sideBarSectionHeader.background', 'sideBarSectionHeader.foreground', 'sideBarSectionHeader.border',
  'sideBarActivityBarTop.border', 'sideBarTitle.background', 'sideBarTitle.border',
  'sideBarStickyScroll.background', 'sideBarStickyScroll.border', 'sideBarStickyScroll.shadow',
  // Minimap
  'minimap.findMatchHighlight', 'minimap.selectionHighlight', 'minimap.errorHighlight', 'minimap.warningHighlight',
  'minimap.background', 'minimap.selectionOccurrenceHighlight', 'minimap.foregroundOpacity',
  'minimap.infoHighlight', 'minimap.chatEditHighlight',
  'minimapSlider.background', 'minimapSlider.hoverBackground', 'minimapSlider.activeBackground',
  'minimapGutter.addedBackground', 'minimapGutter.modifiedBackground', 'minimapGutter.deletedBackground',
  'editorMinimap.inlineChatInserted',
  // Editor Groups & Tabs
  'editorGroup.border', 'editorGroup.dropBackground', 'editorGroupHeader.noTabsBackground',
  'editorGroupHeader.tabsBackground', 'editorGroupHeader.tabsBorder', 'editorGroupHeader.border',
  'editorGroup.emptyBackground', 'editorGroup.focusedEmptyBorder',
  'editorGroup.dropIntoPromptForeground', 'editorGroup.dropIntoPromptBackground', 'editorGroup.dropIntoPromptBorder',
  'tab.activeBackground', 'tab.unfocusedActiveBackground', 'tab.activeForeground', 'tab.border', 'tab.activeBorder',
  'tab.selectedBorderTop', 'tab.selectedBackground', 'tab.selectedForeground', 'tab.dragAndDropBorder',
  'tab.unfocusedActiveBorder', 'tab.activeBorderTop', 'tab.unfocusedActiveBorderTop', 'tab.lastPinnedBorder',
  'tab.inactiveBackground', 'tab.unfocusedInactiveBackground', 'tab.inactiveForeground',
  'tab.unfocusedActiveForeground', 'tab.unfocusedInactiveForeground',
  'tab.hoverBackground', 'tab.unfocusedHoverBackground', 'tab.hoverForeground', 'tab.unfocusedHoverForeground',
  'tab.hoverBorder', 'tab.unfocusedHoverBorder',
  'tab.activeModifiedBorder', 'tab.inactiveModifiedBorder', 'tab.unfocusedActiveModifiedBorder', 'tab.unfocusedInactiveModifiedBorder',
  'editorPane.background', 'sideBySideEditor.horizontalBorder', 'sideBySideEditor.verticalBorder',
  // Editor colors
  'editor.background', 'editor.foreground',
  'editorLineNumber.foreground', 'editorLineNumber.activeForeground', 'editorLineNumber.dimmedForeground',
  'editorCursor.background', 'editorCursor.foreground',
  'editorMultiCursor.primary.foreground', 'editorMultiCursor.primary.background',
  'editorMultiCursor.secondary.foreground', 'editorMultiCursor.secondary.background',
  'editor.placeholder.foreground', 'editor.compositionBorder',
  'editor.selectionBackground', 'editor.selectionForeground', 'editor.inactiveSelectionBackground',
  'editor.selectionHighlightBackground', 'editor.selectionHighlightBorder',
  'editor.wordHighlightBackground', 'editor.wordHighlightBorder',
  'editor.wordHighlightStrongBackground', 'editor.wordHighlightStrongBorder',
  'editor.wordHighlightTextBackground', 'editor.wordHighlightTextBorder',
  'editor.findMatchBackground', 'editor.findMatchForeground', 'editor.findMatchHighlightForeground',
  'editor.findMatchHighlightBackground', 'editor.findRangeHighlightBackground',
  'editor.findMatchBorder', 'editor.findMatchHighlightBorder', 'editor.findRangeHighlightBorder',
  'search.resultsInfoForeground',
  'searchEditor.findMatchBackground', 'searchEditor.findMatchBorder', 'searchEditor.textInputBorder',
  'editor.hoverHighlightBackground',
  'editor.lineHighlightBackground', 'editor.inactiveLineHighlightBackground', 'editor.lineHighlightBorder',
  'editorUnicodeHighlight.border', 'editorUnicodeHighlight.background',
  'editorLink.activeForeground',
  'editor.rangeHighlightBackground', 'editor.rangeHighlightBorder',
  'editor.symbolHighlightBackground', 'editor.symbolHighlightBorder',
  'editorWhitespace.foreground',
  'editorIndentGuide.background', 'editorIndentGuide.activeBackground',
  ...series('editorIndentGuide.background', 1, 6), ...series('editorIndentGuide.activeBackground', 1, 6),
  'editorInlayHint.background', 'editorInlayHint.foreground', 'editorInlayHint.typeForeground', 'editorInlayHint.typeBackground',
  'editorInlayHint.parameterForeground', 'editorInlayHint.parameterBackground',
  'editorRuler.foreground', 'editor.linkedEditingBackground',
  'editorCodeLens.foreground',
  'editorLightBulb.foreground', 'editorLightBulbAutoFix.foreground', 'editorLightBulbAi.foreground',
  'editorBracketMatch.background', 'editorBracketMatch.border', 'editorBracketMatch.foreground',
  ...series('editorBracketHighlight.foreground', 1, 6), 'editorBracketHighlight.unexpectedBracket.foreground',
  ...series('editorBracketPairGuide.activeBackground', 1, 6), ...series('editorBracketPairGuide.background', 1, 6),
  'editor.foldBackground', 'editor.foldPlaceholderForeground',
  'editorOverviewRuler.background', 'editorOverviewRuler.border',
  'editorOverviewRuler.findMatchForeground', 'editorOverviewRuler.rangeHighlightForeground',
  'editorOverviewRuler.selectionHighlightForeground', 'editorOverviewRuler.wordHighlightForeground',
  'editorOverviewRuler.wordHighlightStrongForeground', 'editorOverviewRuler.wordHighlightTextForeground',
  'editorOverviewRuler.modifiedForeground', 'editorOverviewRuler.addedForeground', 'editorOverviewRuler.deletedForeground',
  'editorOverviewRuler.errorForeground', 'editorOverviewRuler.warningForeground', 'editorOverviewRuler.infoForeground',
  'editorOverviewRuler.bracketMatchForeground',
  'editorOverviewRuler.inlineChatInserted', 'editorOverviewRuler.inlineChatRemoved',
  'editorOverviewRuler.commentDraftForeground',
  'editorOverviewRuler.currentContentForeground', 'editorOverviewRuler.incomingContentForeground', 'editorOverviewRuler.commonContentForeground',
  'editorOverviewRuler.commentForeground', 'editorOverviewRuler.commentUnresolvedForeground',
  'editorError.foreground', 'editorError.border', 'editorError.background',
  'editorWarning.foreground', 'editorWarning.border', 'editorWarning.background',
  'editorInfo.foreground', 'editorInfo.border', 'editorInfo.background',
  'editorHint.foreground', 'editorHint.border',
  'problemsErrorIcon.foreground', 'problemsWarningIcon.foreground', 'problemsInfoIcon.foreground',
  'editorUnnecessaryCode.border', 'editorUnnecessaryCode.opacity',
  'editorGutter.background', 'editorGutter.modifiedBackground', 'editorGutter.modifiedSecondaryBackground',
  'editorGutter.addedBackground', 'editorGutter.addedSecondaryBackground',
  'editorGutter.deletedBackground', 'editorGutter.deletedSecondaryBackground',
  'editorGutter.commentRangeForeground', 'editorGutter.commentGlyphForeground', 'editorGutter.commentUnresolvedGlyphForeground',
  'editorGutter.foldingControlForeground', 'editorGutter.itemGlyphForeground', 'editorGutter.itemBackground',
  'editorGutter.commentDraftGlyphForeground',
  'editorCommentsWidget.resolvedBorder', 'editorCommentsWidget.unresolvedBorder',
  'editorCommentsWidget.rangeBackground', 'editorCommentsWidget.rangeActiveBackground', 'editorCommentsWidget.replyInputBackground',
  // Inline edits
  'inlineEdit.gutterIndicator.primaryBorder', 'inlineEdit.gutterIndicator.primaryForeground', 'inlineEdit.gutterIndicator.primaryBackground',
  'inlineEdit.gutterIndicator.secondaryBorder', 'inlineEdit.gutterIndicator.secondaryForeground', 'inlineEdit.gutterIndicator.secondaryBackground',
  'inlineEdit.gutterIndicator.successfulBorder', 'inlineEdit.gutterIndicator.successfulForeground', 'inlineEdit.gutterIndicator.successfulBackground',
  'inlineEdit.gutterIndicator.background',
  'inlineEdit.originalBackground', 'inlineEdit.modifiedBackground',
  'inlineEdit.originalChangedLineBackground', 'inlineEdit.originalChangedTextBackground',
  'inlineEdit.modifiedChangedLineBackground', 'inlineEdit.modifiedChangedTextBackground',
  'inlineEdit.originalBorder', 'inlineEdit.modifiedBorder',
  'inlineEdit.tabWillAcceptModifiedBorder', 'inlineEdit.tabWillAcceptOriginalBorder',
  // Diff editor colors
  'diffEditor.insertedTextBackground', 'diffEditor.insertedTextBorder',
  'diffEditor.removedTextBackground', 'diffEditor.removedTextBorder',
  'diffEditor.border', 'diffEditor.diagonalFill',
  'diffEditor.insertedLineBackground', 'diffEditor.removedLineBackground',
  'diffEditorGutter.insertedLineBackground', 'diffEditorGutter.removedLineBackground',
  'diffEditorOverview.insertedForeground', 'diffEditorOverview.removedForeground',
  'diffEditor.unchangedRegionBackground', 'diffEditor.unchangedRegionForeground', 'diffEditor.unchangedRegionShadow',
  'diffEditor.unchangedCodeBackground', 'diffEditor.move.border', 'diffEditor.moveActive.border',
  'multiDiffEditor.headerBackground', 'multiDiffEditor.background', 'multiDiffEditor.border',
  // Chat colors
  'chat.requestBorder', 'chat.requestBackground', 'chat.slashCommandBackground', 'chat.slashCommandForeground',
  'chat.avatarBackground', 'chat.avatarForeground', 'chat.editedFileForeground',
  'chat.linesAddedForeground', 'chat.linesRemovedForeground', 'chat.requestCodeBorder',
  'chat.requestBubbleBackground', 'chat.requestBubbleHoverBackground', 'chat.checkpointSeparator',
  'chat.thinkingShimmer', 'chatManagement.sashBorder',
  // Inline Chat colors
  'inlineChat.background', 'inlineChat.foreground', 'inlineChat.border', 'inlineChat.shadow',
  'inlineChatInput.border', 'inlineChatInput.focusBorder', 'inlineChatInput.placeholderForeground', 'inlineChatInput.background',
  'inlineChatDiff.inserted', 'inlineChatDiff.removed',
  // Panel Chat colors
  'interactive.activeCodeBorder', 'interactive.inactiveCodeBorder',
  // Editor widget colors
  'editorWidget.foreground', 'editorWidget.background', 'editorWidget.border', 'editorWidget.resizeBorder',
  'editorSuggestWidget.background', 'editorSuggestWidget.border', 'editorSuggestWidget.foreground',
  'editorSuggestWidget.focusHighlightForeground', 'editorSuggestWidget.highlightForeground',
  'editorSuggestWidget.selectedBackground', 'editorSuggestWidget.selectedForeground', 'editorSuggestWidget.selectedIconForeground',
  'editorSuggestWidgetStatus.foreground',
  'editorHoverWidget.foreground', 'editorHoverWidget.background', 'editorHoverWidget.border',
  'editorHoverWidget.highlightForeground', 'editorHoverWidget.statusBarBackground',
  'editorGhostText.border', 'editorGhostText.background', 'editorGhostText.foreground',
  'editorStickyScroll.background', 'editorStickyScroll.border', 'editorStickyScroll.shadow',
  'editorStickyScrollGutter.background', 'editorStickyScrollHover.background',
  'debugExceptionWidget.background', 'debugExceptionWidget.border',
  'editorMarkerNavigation.background', 'editorMarkerNavigationError.background',
  'editorMarkerNavigationWarning.background', 'editorMarkerNavigationInfo.background',
  'editorMarkerNavigationError.headerBackground', 'editorMarkerNavigationWarning.headerBackground', 'editorMarkerNavigationInfo.headerBackground',
  // Peek view colors
  'peekView.border', 'peekViewEditor.background', 'peekViewEditorGutter.background',
  'peekViewEditor.matchHighlightBackground', 'peekViewEditor.matchHighlightBorder',
  'peekViewResult.background', 'peekViewResult.fileForeground', 'peekViewResult.lineForeground',
  'peekViewResult.matchHighlightBackground', 'peekViewResult.selectionBackground', 'peekViewResult.selectionForeground',
  'peekViewTitle.background', 'peekViewTitleDescription.foreground', 'peekViewTitleLabel.foreground',
  'peekViewEditorStickyScroll.background', 'peekViewEditorStickyScrollGutter.background',
  // Merge conflicts colors
  'merge.currentHeaderBackground', 'merge.currentContentBackground',
  'merge.incomingHeaderBackground', 'merge.incomingContentBackground',
  'merge.border', 'merge.commonContentBackground', 'merge.commonHeaderBackground',
  'mergeEditor.change.background', 'mergeEditor.change.word.background',
  'mergeEditor.conflict.unhandledUnfocused.border', 'mergeEditor.conflict.unhandledFocused.border',
  'mergeEditor.conflict.handledUnfocused.border', 'mergeEditor.conflict.handledFocused.border',
  'mergeEditor.conflict.handled.minimapOverViewRuler', 'mergeEditor.conflict.unhandled.minimapOverViewRuler',
  'mergeEditor.conflictingLines.background', 'mergeEditor.changeBase.background', 'mergeEditor.changeBase.word.background',
  'mergeEditor.conflict.input1.background', 'mergeEditor.conflict.input2.background',
  // Panel colors
  'panel.background', 'panel.border', 'panel.dropBorder',
  'panelTitle.activeBorder', 'panelTitle.activeForeground', 'panelTitle.inactiveForeground', 'panelTitle.border',
  'panelTitleBadge.background', 'panelTitleBadge.foreground',
  'panelInput.border', 'panelSection.border', 'panelSection.dropBackground',
  'panelSectionHeader.background', 'panelSectionHeader.foreground', 'panelSectionHeader.border',
  'panelStickyScroll.background', 'panelStickyScroll.border', 'panelStickyScroll.shadow',
  'outputView.background', 'outputViewStickyScroll.background',
  // Status Bar colors
  'statusBar.background', 'statusBar.foreground', 'statusBar.border',
  'statusBar.debuggingBackground', 'statusBar.debuggingForeground', 'statusBar.debuggingBorder',
  'statusBar.noFolderForeground', 'statusBar.noFolderBackground', 'statusBar.noFolderBorder',
  'statusBarItem.activeBackground', 'statusBarItem.hoverForeground', 'statusBarItem.hoverBackground',
  'statusBarItem.prominentForeground', 'statusBarItem.prominentBackground',
  'statusBarItem.prominentHoverForeground', 'statusBarItem.prominentHoverBackground',
  'statusBarItem.remoteBackground', 'statusBarItem.remoteForeground',
  'statusBarItem.remoteHoverBackground', 'statusBarItem.remoteHoverForeground',
  'statusBarItem.errorBackground', 'statusBarItem.errorForeground',
  'statusBarItem.errorHoverBackground', 'statusBarItem.errorHoverForeground',
  'statusBarItem.warningBackground', 'statusBarItem.warningForeground',
  'statusBarItem.warningHoverBackground', 'statusBarItem.warningHoverForeground',
  'statusBarItem.compactHoverBackground', 'statusBarItem.focusBorder', 'statusBar.focusBorder',
  'statusBarItem.offlineBackground', 'statusBarItem.offlineForeground',
  'statusBarItem.offlineHoverForeground', 'statusBarItem.offlineHoverBackground',
  // Title Bar colors
  'titleBar.activeBackground', 'titleBar.activeForeground', 'titleBar.inactiveBackground', 'titleBar.inactiveForeground', 'titleBar.border',
  // Menu Bar colors
  'menubar.selectionForeground', 'menubar.selectionBackground', 'menubar.selectionBorder',
  'menu.foreground', 'menu.background', 'menu.selectionForeground', 'menu.selectionBackground',
  'menu.selectionBorder', 'menu.separatorBackground', 'menu.border',
  // Command Center colors
  'commandCenter.foreground', 'commandCenter.activeForeground', 'commandCenter.background', 'commandCenter.activeBackground',
  'commandCenter.border', 'commandCenter.inactiveForeground', 'commandCenter.inactiveBorder', 'commandCenter.activeBorder',
  'commandCenter.debuggingBackground',
  // Notification colors
  'notificationCenter.border', 'notificationCenterHeader.foreground', 'notificationCenterHeader.background',
  'notificationToast.border', 'notifications.foreground', 'notifications.background', 'notifications.border',
  'notificationLink.foreground', 'notificationsErrorIcon.foreground', 'notificationsWarningIcon.foreground', 'notificationsInfoIcon.foreground',
  // Banner colors
  'banner.background', 'banner.foreground', 'banner.iconForeground',
  // Extensions colors
  'extensionButton.prominentForeground', 'extensionButton.prominentBackground', 'extensionButton.prominentHoverBackground',
  'extensionButton.background', 'extensionButton.foreground', 'extensionButton.hoverBackground',
  'extensionButton.separator', 'extensionButton.border',
  'extensionBadge.remoteBackground', 'extensionBadge.remoteForeground',
  'extensionIcon.starForeground', 'extensionIcon.verifiedForeground', 'extensionIcon.preReleaseForeground',
  'extensionIcon.sponsorForeground', 'extensionIcon.privateForeground', 'mcpIcon.starForeground',
  // Quick picker colors
  'pickerGroup.border', 'pickerGroup.foreground', 'quickInput.background', 'quickInput.foreground',
  'quickInputList.focusBackground', 'quickInputList.focusForeground', 'quickInputList.focusIconForeground',
  'quickInputTitle.background',
  // Keybinding label colors
  'keybindingLabel.background', 'keybindingLabel.foreground', 'keybindingLabel.border', 'keybindingLabel.bottomBorder',
  // Keyboard shortcut table colors
  'keybindingTable.headerBackground', 'keybindingTable.rowsBackground',
  // Integrated Terminal colors
  'terminal.background', 'terminal.border', 'terminal.foreground',
  'terminal.ansiBlack', 'terminal.ansiBlue', 'terminal.ansiBrightBlack', 'terminal.ansiBrightBlue',
  'terminal.ansiBrightCyan', 'terminal.ansiBrightGreen', 'terminal.ansiBrightMagenta', 'terminal.ansiBrightRed',
  'terminal.ansiBrightWhite', 'terminal.ansiBrightYellow', 'terminal.ansiCyan', 'terminal.ansiGreen',
  'terminal.ansiMagenta', 'terminal.ansiRed', 'terminal.ansiWhite', 'terminal.ansiYellow',
  'terminal.selectionBackground', 'terminal.selectionForeground', 'terminal.inactiveSelectionBackground',
  'terminal.findMatchBackground', 'terminal.findMatchBorder', 'terminal.findMatchHighlightBackground', 'terminal.findMatchHighlightBorder',
  'terminal.hoverHighlightBackground', 'terminalCursor.background', 'terminalCursor.foreground', 'terminal.dropBackground',
  'terminal.tab.activeBorder',
  'terminalCommandDecoration.defaultBackground', 'terminalCommandDecoration.successBackground', 'terminalCommandDecoration.errorBackground',
  'terminalOverviewRuler.cursorForeground', 'terminalOverviewRuler.findMatchForeground',
  'terminalStickyScroll.background', 'terminalStickyScroll.border', 'terminalStickyScrollHover.background',
  'terminal.initialHintForeground', 'terminalOverviewRuler.border', 'terminalCommandGuide.foreground',
  'terminalSymbolIcon.aliasForeground', 'terminalSymbolIcon.branchForeground', 'terminalSymbolIcon.commitForeground',
  'terminalSymbolIcon.flagForeground', 'terminalSymbolIcon.optionForeground', 'terminalSymbolIcon.optionValueForeground',
  'terminalSymbolIcon.methodForeground', 'terminalSymbolIcon.argumentForeground', 'terminalSymbolIcon.inlineSuggestionForeground',
  'terminalSymbolIcon.fileForeground', 'terminalSymbolIcon.folderForeground',
  'terminalSymbolIcon.pullRequestDoneForeground', 'terminalSymbolIcon.pullRequestForeground',
  'terminalSymbolIcon.remoteForeground', 'terminalSymbolIcon.stashForeground', 'terminalSymbolIcon.symbolText',
  'terminalSymbolIcon.symbolicLinkFileForeground', 'terminalSymbolIcon.symbolicLinkFolderForeground', 'terminalSymbolIcon.tagForeground',
  // Debug colors
  'debugToolBar.background', 'debugToolBar.border',
  'editor.stackFrameHighlightBackground', 'editor.focusedStackFrameHighlightBackground',
  'editor.inlineValuesForeground', 'editor.inlineValuesBackground',
  'debugView.exceptionLabelForeground', 'debugView.exceptionLabelBackground',
  'debugView.stateLabelForeground', 'debugView.stateLabelBackground', 'debugView.valueChangedHighlight',
  'debugTokenExpression.name', 'debugTokenExpression.value', 'debugTokenExpression.string',
  'debugTokenExpression.boolean', 'debugTokenExpression.number', 'debugTokenExpression.error', 'debugTokenExpression.type',
  'debugIcon.breakpointForeground', 'debugIcon.breakpointDisabledForeground', 'debugIcon.breakpointUnverifiedForeground',
  'debugIcon.breakpointCurrentStackframeForeground', 'debugIcon.breakpointStackframeForeground',
  'debugIcon.startForeground', 'debugIcon.pauseForeground', 'debugIcon.stopForeground', 'debugIcon.disconnectForeground',
  'debugIcon.restartForeground', 'debugIcon.stepOverForeground', 'debugIcon.stepIntoForeground',
  'debugIcon.stepOutForeground', 'debugIcon.continueForeground', 'debugIcon.stepBackForeground',
  'debugConsole.infoForeground', 'debugConsole.warningForeground', 'debugConsole.errorForeground', 'debugConsole.sourceForeground',
  'debugConsoleInputIcon.foreground',
  // Testing colors
  'testing.runAction', 'testing.iconErrored', 'testing.iconFailed', 'testing.iconPassed',
  'testing.iconQueued', 'testing.iconUnset', 'testing.iconSkipped',
  'testing.iconErrored.retired', 'testing.iconFailed.retired', 'testing.iconPassed.retired',
  'testing.iconQueued.retired', 'testing.iconUnset.retired', 'testing.iconSkipped.retired',
  'testing.peekBorder', 'testing.peekHeaderBackground',
  'testing.message.error.lineBackground', 'testing.message.info.decorationForeground', 'testing.message.info.lineBackground',
  'testing.messagePeekBorder', 'testing.messagePeekHeaderBackground',
  'testing.coveredBackground', 'testing.coveredBorder', 'testing.coveredGutterBackground',
  'testing.uncoveredBranchBackground', 'testing.uncoveredBackground', 'testing.uncoveredBorder', 'testing.uncoveredGutterBackground',
  'testing.coverCountBadgeBackground', 'testing.coverCountBadgeForeground',
  'testing.message.error.badgeBackground', 'testing.message.error.badgeBorder', 'testing.message.error.badgeForeground',
  // Welcome page colors
  'welcomePage.background', 'welcomePage.progress.background', 'welcomePage.progress.foreground',
  'welcomePage.tileBackground', 'welcomePage.tileHoverBackground', 'welcomePage.tileBorder',
  'walkThrough.embeddedEditorBackground', 'walkthrough.stepTitle.foreground',
  // Git colors
  'gitDecoration.addedResourceForeground', 'gitDecoration.modifiedResourceForeground', 'gitDecoration.deletedResourceForeground',
  'gitDecoration.renamedResourceForeground', 'gitDecoration.stageModifiedResourceForeground', 'gitDecoration.stageDeletedResourceForeground',
  'gitDecoration.untrackedResourceForeground', 'gitDecoration.ignoredResourceForeground',
  'gitDecoration.conflictingResourceForeground', 'gitDecoration.submoduleResourceForeground', 'git.blame.editorDecorationForeground',
  // Source Control Graph colors
  'scmGraph.historyItemHoverLabelForeground',
  ...series('scmGraph.foreground', 1, 5),
  'scmGraph.historyItemHoverAdditionsForeground', 'scmGraph.historyItemHoverDeletionsForeground',
  'scmGraph.historyItemRefColor', 'scmGraph.historyItemRemoteRefColor', 'scmGraph.historyItemBaseRefColor',
  'scmGraph.historyItemHoverDefaultLabelForeground', 'scmGraph.historyItemHoverDefaultLabelBackground',
  // Settings Editor colors
  'settings.headerForeground', 'settings.modifiedItemIndicator',
  'settings.dropdownBackground', 'settings.dropdownForeground', 'settings.dropdownBorder', 'settings.dropdownListBorder',
  'settings.checkboxBackground', 'settings.checkboxForeground', 'settings.checkboxBorder',
  'settings.rowHoverBackground', 'settings.textInputBackground', 'settings.textInputForeground', 'settings.textInputBorder',
  'settings.numberInputBackground', 'settings.numberInputForeground', 'settings.numberInputBorder',
  'settings.focusedRowBackground', 'settings.focusedRowBorder', 'settings.headerBorder', 'settings.sashBorder',
  'settings.settingsHeaderHoverForeground',
  // Breadcrumbs colors
  'breadcrumb.foreground', 'breadcrumb.background', 'breadcrumb.focusForeground',
  'breadcrumb.activeSelectionForeground', 'breadcrumbPicker.background',
  // Snippets colors
  'editor.snippetTabstopHighlightBackground', 'editor.snippetTabstopHighlightBorder',
  'editor.snippetFinalTabstopHighlightBackground', 'editor.snippetFinalTabstopHighlightBorder',
  // Symbol Icons colors
  'symbolIcon.arrayForeground', 'symbolIcon.booleanForeground', 'symbolIcon.classForeground', 'symbolIcon.colorForeground',
  'symbolIcon.constantForeground', 'symbolIcon.constructorForeground', 'symbolIcon.enumeratorForeground', 'symbolIcon.enumeratorMemberForeground',
  'symbolIcon.eventForeground', 'symbolIcon.fieldForeground', 'symbolIcon.fileForeground', 'symbolIcon.folderForeground',
  'symbolIcon.functionForeground', 'symbolIcon.interfaceForeground', 'symbolIcon.keyForeground', 'symbolIcon.keywordForeground',
  'symbolIcon.methodForeground', 'symbolIcon.moduleForeground', 'symbolIcon.namespaceForeground', 'symbolIcon.nullForeground',
  'symbolIcon.numberForeground', 'symbolIcon.objectForeground', 'symbolIcon.operatorForeground', 'symbolIcon.packageForeground',
  'symbolIcon.propertyForeground', 'symbolIcon.referenceForeground', 'symbolIcon.snippetForeground', 'symbolIcon.stringForeground',
  'symbolIcon.structForeground', 'symbolIcon.textForeground', 'symbolIcon.typeParameterForeground', 'symbolIcon.unitForeground',
  'symbolIcon.variableForeground',
  // Notebook colors
  'notebook.editorBackground', 'notebook.cellBorderColor', 'notebook.cellHoverBackground', 'notebook.cellInsertionIndicator',
  'notebook.cellStatusBarItemHoverBackground', 'notebook.cellToolbarSeparator', 'notebook.cellEditorBackground',
  'notebook.focusedCellBackground', 'notebook.focusedCellBorder', 'notebook.focusedEditorBorder',
  'notebook.inactiveFocusedCellBorder', 'notebook.inactiveSelectedCellBorder',
  'notebook.outputContainerBackgroundColor', 'notebook.outputContainerBorderColor',
  'notebook.selectedCellBackground', 'notebook.selectedCellBorder', 'notebook.symbolHighlightBackground',
  'notebookScrollbarSlider.activeBackground', 'notebookScrollbarSlider.background', 'notebookScrollbarSlider.hoverBackground',
  'notebookStatusErrorIcon.foreground', 'notebookStatusRunningIcon.foreground', 'notebookStatusSuccessIcon.foreground',
  'notebookEditorOverviewRuler.runningCellForeground',
  // Chart colors
  'charts.foreground', 'charts.lines', 'charts.red', 'charts.blue', 'charts.yellow', 'charts.orange', 'charts.green', 'charts.purple',
  'chart.line', 'chart.axis', 'chart.guide',
  // Ports colors
  'ports.iconRunningProcessForeground',
  // Comments View colors
  'commentsView.resolvedIcon', 'commentsView.unresolvedIcon',
  // Action Bar colors
  'actionBar.toggledBackground',
  // Simple Find Widget colors
  'simpleFindWidget.sashBorder',
  // Gauge colors
  'gauge.background', 'gauge.foreground', 'gauge.border',
  'gauge.warningBackground', 'gauge.warningForeground', 'gauge.errorBackground', 'gauge.errorForeground',
  // Markdown
  'markdownAlert.note.foreground', 'markdownAlert.tip.foreground', 'markdownAlert.important.foreground',
  'markdownAlert.warning.foreground', 'markdownAlert.caution.foreground',
  // Agent Session colors
  'agentSessionReadIndicator.foreground', 'agentSessionSelectedBadge.border', 'agentSessionSelectedUnfocusedBadge.border',
  'agentStatusIndicator.background', 'aiCustomizationManagement.sashBorder',
  // Agent Sessions window shell (VS Code main / 1.128-dev, src/vs/sessions/common/theme.ts)
  'agents.background', 'agentsPanel.background', 'agentsPanel.foreground', 'agentsPanel.border',
  'agentsGradient.tintColor', 'agentFeedbackEditorWidget.background', 'agentFeedbackEditorWidget.border',
  'agentFeedbackInputWidget.border', 'agentsUpdateButton.downloadingBackground', 'agentsUpdateButton.downloadedBackground',
  'agentsChatInput.background', 'agentsChatInput.foreground', 'agentsChatInput.border', 'agentsChatInput.focusBorder',
  'agentsChatInput.placeholderForeground', 'agentsNewSessionButton.background', 'agentsNewSessionButton.foreground',
  'agentsNewSessionButton.border', 'agentsNewSessionButton.hoverBackground', 'agentsBadge.background', 'agentsBadge.foreground',
  'agentsUnreadBadge.background', 'agentsUnreadBadge.foreground', 'activeSessionView.background', 'inactiveSessionView.background',
  'activeSessionView.foreground', 'inactiveSessionView.foreground',
  // Agents voice speaking indicator (VS Code main, src/vs/workbench/contrib/agentsVoice/common/agentsVoiceColors.ts)
  'agentsVoice.speakingForeground', 'agentsVoice.speakingBackground',
]);

function auditThemes() {
  const themeFiles = fs.readdirSync(THEMES_DIR).filter(f => f.endsWith('.json')).sort();
  const offenders = {}; // key -> [themes]
  let totalInvalid = 0;
  let themesWithIssues = 0;

  console.log('============================================================');
  console.log('  WORKBENCH KEY VALIDATION (official VS Code reference)');
  console.log('============================================================\n');

  for (const file of themeFiles) {
    let theme;
    try {
      theme = JSON.parse(fs.readFileSync(path.join(THEMES_DIR, file), 'utf8'));
    } catch (e) {
      console.log(`  PARSE ERROR: ${file} -> ${e.message}`);
      totalInvalid++;
      continue;
    }
    const colors = theme.colors || {};
    const invalid = Object.keys(colors).filter(k => !VALID_KEYS.has(k));
    if (invalid.length) {
      themesWithIssues++;
      console.log(`  ${file}`);
      for (const k of invalid) {
        console.log(`     INVALID: ${k}`);
        (offenders[k] = offenders[k] || []).push(file);
        totalInvalid++;
      }
      console.log('');
    }
  }

  console.log('------------------------------------------------------------');
  if (totalInvalid === 0) {
    console.log('  RESULT: PASS - all colors keys are valid VS Code keys.');
  } else {
    console.log(`  RESULT: FAIL - ${totalInvalid} invalid key occurrence(s) in ${themesWithIssues} theme(s).`);
    console.log('\n  Invalid keys (by occurrence count):');
    Object.entries(offenders)
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([k, files]) => console.log(`     ${k}  ->  ${files.length} theme(s)`));
  }
  console.log('------------------------------------------------------------');

  return totalInvalid;
}

const code = auditThemes();
process.exit(code === 0 ? 0 : 1);
