/**
 * Comprehensive Theme Property Audit
 * Cross-references all 23 themes against the complete VS Code theme color reference.
 * Reports missing CRITICAL properties, missing IMPORTANT NEW properties, and empty-string values.
 */

const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.join(__dirname, '..', 'themes');

// ─── CRITICAL properties (every theme MUST have these) ───
const CRITICAL_PROPERTIES = {
  'Editor Core': [
    'editor.background', 'editor.foreground', 'editor.selectionBackground', 'editor.selectionForeground',
    'editor.inactiveSelectionBackground', 'editor.selectionHighlightBackground',
    'editor.findMatchBackground', 'editor.findMatchHighlightBackground', 'editor.findMatchForeground', 'editor.findMatchHighlightForeground',
    'editor.lineHighlightBackground', 'editor.lineHighlightBorder',
    'editor.wordHighlightBackground', 'editor.wordHighlightStrongBackground',
    'editorCursor.foreground', 'editorCursor.background',
    'editorLineNumber.foreground', 'editorLineNumber.activeForeground',
    'editorWhitespace.foreground',
    'editorIndentGuide.background', 'editorIndentGuide.activeBackground',
    'editorRuler.foreground',
    'editorBracketMatch.background', 'editorBracketMatch.border',
    'editorBracketHighlight.foreground1', 'editorBracketHighlight.foreground2', 'editorBracketHighlight.foreground3',
    'editorBracketHighlight.foreground4', 'editorBracketHighlight.foreground5', 'editorBracketHighlight.foreground6',
    'editorOverviewRuler.border',
    'editorGutter.background', 'editorGutter.modifiedBackground', 'editorGutter.addedBackground', 'editorGutter.deletedBackground',
    'editorError.foreground', 'editorWarning.foreground', 'editorInfo.foreground',
    'editorWidget.background', 'editorWidget.foreground', 'editorWidget.border',
    'editorSuggestWidget.background', 'editorSuggestWidget.foreground', 'editorSuggestWidget.selectedBackground',
    'editorHoverWidget.background', 'editorHoverWidget.foreground', 'editorHoverWidget.border',
    'editorGhostText.foreground',
  ],
  'Base Colors': [
    'focusBorder', 'foreground', 'disabledForeground', 'errorForeground', 'icon.foreground',
    'widget.border', 'widget.shadow', 'descriptionForeground', 'selection.background', 'sash.hoverBorder',
  ],
  'Activity Bar': [
    'activityBar.background', 'activityBar.foreground', 'activityBar.inactiveForeground', 'activityBar.border',
    'activityBar.activeBorder', 'activityBar.activeBackground',
    'activityBarBadge.background', 'activityBarBadge.foreground',
    'activityBarTop.foreground', 'activityBarTop.activeBorder', 'activityBarTop.inactiveForeground',
  ],
  'Side Bar': [
    'sideBar.background', 'sideBar.foreground', 'sideBar.border',
    'sideBarTitle.foreground', 'sideBarSectionHeader.background', 'sideBarSectionHeader.foreground', 'sideBarSectionHeader.border',
  ],
  'Panel': [
    'panel.background', 'panel.border',
    'panelTitle.activeForeground', 'panelTitle.inactiveForeground', 'panelTitle.activeBorder',
  ],
  'Status Bar': [
    'statusBar.background', 'statusBar.foreground', 'statusBar.border',
    'statusBar.debuggingBackground', 'statusBar.debuggingForeground',
    'statusBar.noFolderBackground',
    'statusBarItem.hoverBackground', 'statusBarItem.remoteBackground', 'statusBarItem.remoteForeground',
  ],
  'Title Bar': [
    'titleBar.activeBackground', 'titleBar.activeForeground', 'titleBar.inactiveBackground', 'titleBar.inactiveForeground', 'titleBar.border',
  ],
  'Tabs': [
    'tab.activeBackground', 'tab.activeForeground', 'tab.border',
    'tab.inactiveBackground', 'tab.inactiveForeground',
    'tab.hoverBackground', 'tab.activeBorderTop', 'tab.activeBorder',
    'editorGroupHeader.tabsBackground',
  ],
  'Input Controls': [
    'input.background', 'input.border', 'input.foreground', 'input.placeholderForeground',
    'inputOption.activeBackground', 'inputOption.activeBorder',
    'inputValidation.errorBackground', 'inputValidation.errorBorder', 'inputValidation.warningBackground', 'inputValidation.warningBorder',
  ],
  'Dropdown': [
    'dropdown.background', 'dropdown.border', 'dropdown.foreground',
  ],
  'Button': [
    'button.background', 'button.foreground', 'button.hoverBackground',
    'button.secondaryBackground', 'button.secondaryForeground', 'button.secondaryHoverBackground',
  ],
  'Badge & Progress': [
    'badge.background', 'badge.foreground',
    'progressBar.background',
  ],
  'List / Tree': [
    'list.activeSelectionBackground', 'list.activeSelectionForeground',
    'list.hoverBackground', 'list.focusBackground',
    'list.inactiveSelectionBackground', 'list.highlightForeground',
  ],
  'Scrollbar': [
    'scrollbarSlider.background', 'scrollbarSlider.hoverBackground', 'scrollbarSlider.activeBackground',
  ],
  'Peek View': [
    'peekView.border', 'peekViewEditor.background', 'peekViewResult.background',
    'peekViewEditor.matchHighlightBackground', 'peekViewResult.matchHighlightBackground',
  ],
  'Notifications': [
    'notifications.background', 'notifications.foreground', 'notifications.border',
    'notificationCenterHeader.background', 'notificationCenterHeader.foreground',
  ],
  'Command Center': [
    'commandCenter.foreground', 'commandCenter.activeForeground', 'commandCenter.background', 'commandCenter.activeBackground',
    'commandCenter.border', 'commandCenter.activeBorder', 'commandCenter.inactiveForeground', 'commandCenter.inactiveBorder',
    'commandCenter.debuggingBackground',
  ],
  'Terminal': [
    'terminal.background', 'terminal.foreground', 'terminal.border',
    'terminal.ansiBlack', 'terminal.ansiRed', 'terminal.ansiGreen', 'terminal.ansiYellow',
    'terminal.ansiBlue', 'terminal.ansiMagenta', 'terminal.ansiCyan', 'terminal.ansiWhite',
    'terminal.ansiBrightBlack', 'terminal.ansiBrightRed', 'terminal.ansiBrightGreen', 'terminal.ansiBrightYellow',
    'terminal.ansiBrightBlue', 'terminal.ansiBrightMagenta', 'terminal.ansiBrightCyan', 'terminal.ansiBrightWhite',
    'terminal.selectionBackground', 'terminal.selectionForeground',
    'terminalCursor.foreground',
  ],
  'Diff Editor': [
    'diffEditor.insertedTextBackground', 'diffEditor.removedTextBackground',
    'diffEditor.insertedLineBackground', 'diffEditor.removedLineBackground',
    'diffEditor.diagonalFill',
    'diffEditorGutter.insertedLineBackground', 'diffEditorGutter.removedLineBackground',
    'diffEditorOverview.insertedForeground', 'diffEditorOverview.removedForeground',
  ],
  'Merge Conflicts': [
    'merge.currentHeaderBackground', 'merge.currentContentBackground',
    'merge.incomingHeaderBackground', 'merge.incomingContentBackground',
  ],
  'Git Decorations': [
    'gitDecoration.addedResourceForeground', 'gitDecoration.modifiedResourceForeground', 'gitDecoration.deletedResourceForeground',
    'gitDecoration.renamedResourceForeground', 'gitDecoration.untrackedResourceForeground',
    'gitDecoration.ignoredResourceForeground', 'gitDecoration.conflictingResourceForeground',
    'gitDecoration.stageModifiedResourceForeground', 'gitDecoration.stageDeletedResourceForeground',
  ],
  'Text Colors': [
    'textLink.foreground', 'textLink.activeForeground',
    'textBlockQuote.background', 'textBlockQuote.border',
    'textCodeBlock.background', 'textPreformat.foreground',
  ],
  'Debug': [
    'debugToolBar.background',
    'debugView.exceptionLabelBackground', 'debugView.exceptionLabelForeground',
    'debugView.stateLabelBackground', 'debugView.stateLabelForeground',
    'debugTokenExpression.name', 'debugTokenExpression.value', 'debugTokenExpression.string',
    'debugTokenExpression.boolean', 'debugTokenExpression.number', 'debugTokenExpression.error',
  ],
  'Testing': [
    'testing.iconFailed', 'testing.iconPassed', 'testing.iconQueued', 'testing.iconErrored', 'testing.iconSkipped', 'testing.iconUnset',
  ],
  'Quick Pick': [
    'pickerGroup.border', 'pickerGroup.foreground',
    'quickInput.background', 'quickInput.foreground',
  ],
  'Menu': [
    'menu.foreground', 'menu.background', 'menu.selectionForeground', 'menu.selectionBackground',
  ],
  'Keybinding Label': [
    'keybindingLabel.foreground', 'keybindingLabel.background', 'keybindingLabel.border', 'keybindingLabel.bottomBorder',
  ],
  'Breadcrumb': [
    'breadcrumb.foreground', 'breadcrumb.focusForeground', 'breadcrumb.activeSelectionForeground',
    'breadcrumbPicker.background',
  ],
  'Settings': [
    'settings.headerForeground', 'settings.modifiedItemIndicator',
  ],
  'Welcome': [
    'welcomePage.tileBackground',
  ],
  'CodeLens / LightBulb / Links / Inlay Hints': [
    'editorCodeLens.foreground',
    'editorLightBulb.foreground',
    'editorLink.activeForeground',
    'editorInlayHint.foreground', 'editorInlayHint.background',
  ],
};

// ─── IMPORTANT NEW properties (v1.90+) ───
const IMPORTANT_NEW_PROPERTIES = {
  'Chat / Copilot': [
    'chat.editedFileForeground', 'chat.requestCodeBorder', 'chat.checkpointSeparator',
    'chat.linesAddedForeground', 'chat.linesRemovedForeground', 'chat.thinkingShimmer',
    'chat.requestBorder', 'chat.requestBackground', 'chat.slashCommandBackground', 'chat.slashCommandForeground',
    'chat.avatarBackground', 'chat.avatarForeground', 'chat.requestBubbleBackground', 'chat.requestBubbleHoverBackground',
  ],
  'Inline Chat': [
    'inlineChat.foreground', 'inlineChat.background', 'inlineChat.border', 'inlineChat.shadow',
    'inlineChatInput.border', 'inlineChatInput.focusBorder', 'inlineChatInput.placeholderForeground', 'inlineChatInput.background',
    'inlineChatDiff.inserted', 'inlineChatDiff.removed',
  ],
  'Interactive': [
    'interactive.activeCodeBorder', 'interactive.inactiveCodeBorder',
  ],
  'Inline Edit': [
    'inlineEdit.gutterIndicator.primaryBorder', 'inlineEdit.gutterIndicator.primaryForeground', 'inlineEdit.gutterIndicator.primaryBackground',
    'inlineEdit.gutterIndicator.secondaryBorder', 'inlineEdit.gutterIndicator.secondaryForeground', 'inlineEdit.gutterIndicator.secondaryBackground',
    'inlineEdit.gutterIndicator.successfulBorder', 'inlineEdit.gutterIndicator.successfulForeground', 'inlineEdit.gutterIndicator.successfulBackground',
    'inlineEdit.gutterIndicator.background',
    'inlineEdit.originalBackground', 'inlineEdit.modifiedBackground',
    'inlineEdit.originalChangedLineBackground', 'inlineEdit.originalChangedTextBackground',
    'inlineEdit.modifiedChangedLineBackground', 'inlineEdit.modifiedChangedTextBackground',
    'inlineEdit.originalBorder', 'inlineEdit.modifiedBorder',
    'inlineEdit.tabWillAcceptModifiedBorder', 'inlineEdit.tabWillAcceptOriginalBorder',
  ],
  'Tabs (New)': [
    'tab.selectedBorderTop', 'tab.selectedBackground', 'tab.selectedForeground', 'tab.dragAndDropBorder',
  ],
  'Editor (New)': [
    'editor.placeholder.foreground', 'editor.compositionBorder',
    'editor.foldPlaceholderForeground', 'editor.inactiveLineHighlightBackground',
  ],
  'Editor Multi-Cursor': [
    'editorMultiCursor.primary.foreground', 'editorMultiCursor.primary.background',
    'editorMultiCursor.secondary.foreground', 'editorMultiCursor.secondary.background',
  ],
  'Editor Action List': [
    'editorActionList.background', 'editorActionList.foreground', 'editorActionList.focusForeground', 'editorActionList.focusBackground',
  ],
  'Sticky Scroll': [
    'editorStickyScroll.background', 'editorStickyScroll.border', 'editorStickyScroll.shadow',
    'editorStickyScrollGutter.background', 'editorStickyScrollHover.background',
    'panelStickyScroll.background', 'panelStickyScroll.border', 'panelStickyScroll.shadow',
    'sideBarStickyScroll.background', 'sideBarStickyScroll.border', 'sideBarStickyScroll.shadow',
  ],
  'Panel (New)': [
    'panelTitleBadge.background', 'panelTitleBadge.foreground', 'panelTitle.border',
  ],
  'Terminal (New)': [
    'terminal.initialHintForeground', 'terminalOverviewRuler.border', 'terminalCommandGuide.foreground',
    'terminalStickyScroll.background', 'terminalStickyScroll.border', 'terminalStickyScrollHover.background',
  ],
  'Gutter (New)': [
    'editorGutter.modifiedSecondaryBackground', 'editorGutter.addedSecondaryBackground', 'editorGutter.deletedSecondaryBackground',
    'editorGutter.commentDraftGlyphForeground', 'editorGutter.commentGlyphForeground', 'editorGutter.commentUnresolvedGlyphForeground',
    'editorGutter.foldingControlForeground', 'editorGutter.itemGlyphForeground', 'editorGutter.itemBackground',
  ],
  'Overview Ruler (New)': [
    'editorOverviewRuler.inlineChatInserted', 'editorOverviewRuler.inlineChatRemoved', 'editorOverviewRuler.commentDraftForeground',
  ],
  'Minimap (New)': [
    'minimap.chatEditHighlight', 'editorMinimap.inlineChatInserted',
  ],
  'Testing (New)': [
    'testing.uncoveredBranchBackground',
    'testing.message.error.badgeBackground', 'testing.message.error.badgeBorder', 'testing.message.error.badgeForeground',
  ],
  'Markdown Alerts': [
    'markdownAlert.note.foreground', 'markdownAlert.tip.foreground', 'markdownAlert.important.foreground',
    'markdownAlert.warning.foreground', 'markdownAlert.caution.foreground',
  ],
  'Git Blame': [
    'git.blame.editorDecorationForeground',
  ],
  'Agent / AI': [
    'agentSessionReadIndicator.foreground', 'agentSessionSelectedBadge.border', 'agentSessionSelectedUnfocusedBadge.border',
    'agentStatusIndicator.background', 'aiCustomizationManagement.sashBorder',
  ],
  'Gauge': [
    'gauge.background', 'gauge.foreground', 'gauge.border',
    'gauge.warningBackground', 'gauge.warningForeground', 'gauge.errorBackground', 'gauge.errorForeground',
  ],
  'SCM Graph': [
    'scmGraph.foreground1', 'scmGraph.foreground2', 'scmGraph.foreground3', 'scmGraph.foreground4', 'scmGraph.foreground5',
  ],
  'Sash Borders': [
    'profiles.sashBorder', 'chatManagement.sashBorder',
  ],
  'Extension / MCP Icons': [
    'extensionIcon.privateForeground', 'mcpIcon.starForeground',
  ],
  'Output View': [
    'outputView.background', 'outputViewStickyScroll.background',
  ],
  'Status Bar (New)': [
    'statusBarItem.offlineBackground', 'statusBarItem.offlineForeground', 'statusBarItem.offlineHoverForeground', 'statusBarItem.offlineHoverBackground',
    'statusBarItem.errorBackground', 'statusBarItem.errorForeground',
    'statusBarItem.warningBackground', 'statusBarItem.warningForeground',
    'statusBarItem.focusBorder', 'statusBar.focusBorder',
    'statusBarItem.compactHoverBackground',
  ],
  'Diff Editor (New)': [
    'diffEditor.move.border', 'diffEditor.moveActive.border',
    'diffEditor.unchangedRegionBackground', 'diffEditor.unchangedRegionForeground', 'diffEditor.unchangedCodeBackground',
    'multiDiffEditor.headerBackground', 'multiDiffEditor.background', 'multiDiffEditor.border',
  ],
  'Peek View (New)': [
    'peekViewEditorStickyScroll.background', 'peekViewEditorStickyScrollGutter.background',
  ],
  'Ghost Text (New)': [
    'editorGhostText.border', 'editorGhostText.background',
  ],
  'Light Bulb AI': [
    'editorLightBulbAi.foreground',
  ],
  'Find Widget': [
    'simpleFindWidget.sashBorder',
  ],
  'Settings (New)': [
    'settings.settingsHeaderHoverForeground',
  ],
  'Comments Widget': [
    'editorCommentsWidget.resolvedBorder', 'editorCommentsWidget.unresolvedBorder',
  ],
};

// ─── Audit logic ───
function auditThemes() {
  const themeFiles = fs.readdirSync(THEMES_DIR).filter(f => f.endsWith('.json')).sort();

  const allCriticalProps = [];
  for (const cat of Object.values(CRITICAL_PROPERTIES)) {
    allCriticalProps.push(...cat);
  }

  const allNewProps = [];
  for (const cat of Object.values(IMPORTANT_NEW_PROPERTIES)) {
    allNewProps.push(...cat);
  }

  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║          COMPREHENSIVE THEME PROPERTY AUDIT                     ║');
  console.log('║          VS Code Theme Color Reference (Complete)               ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝');
  console.log(`\nAuditing ${themeFiles.length} themes against ${allCriticalProps.length} CRITICAL + ${allNewProps.length} IMPORTANT NEW properties`);
  console.log(`Total master properties: ${allCriticalProps.length + allNewProps.length}\n`);

  const summaryData = [];

  for (const file of themeFiles) {
    const themeName = file.replace('.json', '');
    const filePath = path.join(THEMES_DIR, file);
    let themeData;
    try {
      themeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.log(`\n  *** ERROR reading ${file}: ${e.message}`);
      continue;
    }

    const colors = themeData.colors || {};
    const definedProps = Object.keys(colors);
    const definedSet = new Set(definedProps);

    // Find empty string values
    const emptyValues = definedProps.filter(p => colors[p] === '');

    // Find missing CRITICAL by category
    const missingCriticalByCategory = {};
    let totalMissingCritical = 0;
    for (const [category, props] of Object.entries(CRITICAL_PROPERTIES)) {
      const missing = props.filter(p => !definedSet.has(p));
      if (missing.length > 0) {
        missingCriticalByCategory[category] = missing;
        totalMissingCritical += missing.length;
      }
    }

    // Find missing IMPORTANT NEW by category
    const missingNewByCategory = {};
    let totalMissingNew = 0;
    for (const [category, props] of Object.entries(IMPORTANT_NEW_PROPERTIES)) {
      const missing = props.filter(p => !definedSet.has(p));
      if (missing.length > 0) {
        missingNewByCategory[category] = missing;
        totalMissingNew += missing.length;
      }
    }

    const criticalDefined = allCriticalProps.length - totalMissingCritical;
    const newDefined = allNewProps.length - totalMissingNew;

    summaryData.push({
      theme: themeName,
      totalDefined: definedProps.length,
      criticalDefined,
      criticalTotal: allCriticalProps.length,
      criticalMissing: totalMissingCritical,
      newDefined,
      newTotal: allNewProps.length,
      newMissing: totalMissingNew,
      emptyValues: emptyValues.length,
    });

    // Print theme header
    console.log('━'.repeat(70));
    console.log(`  THEME: ${themeName}`);
    console.log('━'.repeat(70));
    console.log(`  Total defined properties: ${definedProps.length}`);
    console.log(`  CRITICAL: ${criticalDefined}/${allCriticalProps.length} defined (${totalMissingCritical} missing)`);
    console.log(`  IMPORTANT NEW: ${newDefined}/${allNewProps.length} defined (${totalMissingNew} missing)`);
    if (emptyValues.length > 0) {
      console.log(`  EMPTY STRING VALUES: ${emptyValues.length}`);
    }
    console.log('');

    // Empty values
    if (emptyValues.length > 0) {
      console.log(`  ⚠ EMPTY STRING VALUES (${emptyValues.length}):`);
      for (const prop of emptyValues) {
        console.log(`    - ${prop}`);
      }
      console.log('');
    }

    // Missing critical
    if (totalMissingCritical > 0) {
      console.log(`  ✗ MISSING CRITICAL (${totalMissingCritical}):`);
      for (const [category, missing] of Object.entries(missingCriticalByCategory)) {
        console.log(`    [${category}]`);
        for (const prop of missing) {
          console.log(`      - ${prop}`);
        }
      }
      console.log('');
    } else {
      console.log('  ✓ All CRITICAL properties defined!\n');
    }

    // Missing new
    if (totalMissingNew > 0) {
      console.log(`  △ MISSING IMPORTANT NEW (${totalMissingNew}):`);
      for (const [category, missing] of Object.entries(missingNewByCategory)) {
        console.log(`    [${category}]`);
        for (const prop of missing) {
          console.log(`      - ${prop}`);
        }
      }
      console.log('');
    } else {
      console.log('  ✓ All IMPORTANT NEW properties defined!\n');
    }
  }

  // ─── SUMMARY TABLE ───
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                                    SUMMARY TABLE                                           ║');
  console.log('╠══════════════════════════════════════════╦═══════╦═════════════════╦═══════════════╦════════╣');
  console.log('║ Theme                                    ║ Total ║ Critical        ║ New           ║ Empty  ║');
  console.log('║                                          ║ Props ║ Miss / Total    ║ Miss / Total  ║ Vals   ║');
  console.log('╠══════════════════════════════════════════╬═══════╬═════════════════╬═══════════════╬════════╣');

  for (const s of summaryData) {
    const name = s.theme.padEnd(40);
    const total = String(s.totalDefined).padStart(5);
    const crit = `${String(s.criticalMissing).padStart(3)} / ${s.criticalTotal}`.padStart(15);
    const newP = `${String(s.newMissing).padStart(3)} / ${s.newTotal}`.padStart(13);
    const empty = String(s.emptyValues).padStart(6);
    console.log(`║ ${name} ║${total} ║${crit} ║${newP} ║${empty} ║`);
  }

  console.log('╚══════════════════════════════════════════╩═══════╩═════════════════╩═══════════════╩════════╝');

  // ─── CROSS-THEME CATEGORY SUMMARY ───
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║              MOST COMMONLY MISSING CRITICAL PROPERTIES          ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  const propMissCount = {};
  for (const prop of allCriticalProps) {
    propMissCount[prop] = 0;
  }
  for (const file of themeFiles) {
    const filePath = path.join(THEMES_DIR, file);
    let themeData;
    try { themeData = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { continue; }
    const colors = themeData.colors || {};
    for (const prop of allCriticalProps) {
      if (!(prop in colors)) {
        propMissCount[prop]++;
      }
    }
  }

  const sortedMissing = Object.entries(propMissCount)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sortedMissing.length === 0) {
    console.log('  All critical properties defined in every theme!');
  } else {
    console.log(`  ${'Property'.padEnd(50)} Missing In`);
    console.log(`  ${'─'.repeat(50)} ${'─'.repeat(10)}`);
    for (const [prop, count] of sortedMissing) {
      console.log(`  ${prop.padEnd(50)} ${count}/${themeFiles.length} themes`);
    }
  }

  // ─── CROSS-THEME: MOST COMMONLY MISSING NEW PROPERTIES ───
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║           MOST COMMONLY MISSING IMPORTANT NEW PROPERTIES        ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  const newPropMissCount = {};
  for (const prop of allNewProps) {
    newPropMissCount[prop] = 0;
  }
  for (const file of themeFiles) {
    const filePath = path.join(THEMES_DIR, file);
    let themeData;
    try { themeData = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { continue; }
    const colors = themeData.colors || {};
    for (const prop of allNewProps) {
      if (!(prop in colors)) {
        newPropMissCount[prop]++;
      }
    }
  }

  const sortedNewMissing = Object.entries(newPropMissCount)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sortedNewMissing.length === 0) {
    console.log('  All important new properties defined in every theme!');
  } else {
    // Group by how many themes are missing
    const universallyMissing = sortedNewMissing.filter(([, c]) => c === themeFiles.length);
    const partiallyMissing = sortedNewMissing.filter(([, c]) => c > 0 && c < themeFiles.length);

    if (universallyMissing.length > 0) {
      console.log(`  MISSING FROM ALL ${themeFiles.length} THEMES (${universallyMissing.length} properties):`);
      for (const [prop] of universallyMissing) {
        console.log(`    - ${prop}`);
      }
      console.log('');
    }

    if (partiallyMissing.length > 0) {
      console.log(`  PARTIALLY MISSING (${partiallyMissing.length} properties):`);
      console.log(`  ${'Property'.padEnd(55)} Missing In`);
      console.log(`  ${'─'.repeat(55)} ${'─'.repeat(10)}`);
      for (const [prop, count] of partiallyMissing) {
        console.log(`  ${prop.padEnd(55)} ${count}/${themeFiles.length} themes`);
      }
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log('  AUDIT COMPLETE');
  console.log('═'.repeat(70));
}

auditThemes();
