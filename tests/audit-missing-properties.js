#!/usr/bin/env node
/**
 * M Tech Themes - Missing Properties Audit
 * Compares theme color properties against VS Code's latest supported properties (v1.90-v1.99+)
 */

const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, '..', 'themes');

// Load the three representative theme files
const themes = {
  'Tokyo Night': JSON.parse(fs.readFileSync(path.join(themesDir, 'Tokyo Night.json'), 'utf8')),
  'Cyberpunk Neon': JSON.parse(fs.readFileSync(path.join(themesDir, 'Cyberpunk Neon.json'), 'utf8')),
  'Sandstone Light': JSON.parse(fs.readFileSync(path.join(themesDir, 'Sandstone Light.json'), 'utf8'))
};

// Critical new properties to check - grouped by UI area
const criticalProperties = {
  'Chat / Copilot': {
    priority: 'CRITICAL',
    props: [
      'chat.requestBorder', 'chat.requestBackground', 'chat.slashCommandBackground', 'chat.slashCommandForeground',
      'chat.avatarBackground', 'chat.avatarForeground', 'chat.editedFileForeground',
      'chat.requestCodeBorder', 'chat.requestBubbleBackground', 'chat.requestBubbleHoverBackground',
      'chat.checkpointSeparator', 'chat.linesAddedForeground', 'chat.linesRemovedForeground',
      'chat.thinkingShimmer'
    ]
  },
  'Inline Chat': {
    priority: 'CRITICAL',
    props: [
      'inlineChat.foreground', 'inlineChat.background', 'inlineChat.border', 'inlineChat.shadow',
      'inlineChatInput.border', 'inlineChatInput.focusBorder', 'inlineChatInput.placeholderForeground', 'inlineChatInput.background',
      'inlineChatDiff.inserted', 'inlineChatDiff.removed'
    ]
  },
  'Inline Edit (Copilot Next Edit)': {
    priority: 'CRITICAL',
    props: [
      'inlineEdit.gutterIndicator.primaryBorder', 'inlineEdit.gutterIndicator.primaryForeground', 'inlineEdit.gutterIndicator.primaryBackground',
      'inlineEdit.gutterIndicator.secondaryBorder', 'inlineEdit.gutterIndicator.secondaryForeground', 'inlineEdit.gutterIndicator.secondaryBackground',
      'inlineEdit.gutterIndicator.successfulBorder', 'inlineEdit.gutterIndicator.successfulForeground', 'inlineEdit.gutterIndicator.successfulBackground',
      'inlineEdit.gutterIndicator.background',
      'inlineEdit.originalBackground', 'inlineEdit.modifiedBackground',
      'inlineEdit.originalChangedLineBackground', 'inlineEdit.originalChangedTextBackground',
      'inlineEdit.modifiedChangedLineBackground', 'inlineEdit.modifiedChangedTextBackground',
      'inlineEdit.originalBorder', 'inlineEdit.modifiedBorder',
      'inlineEdit.tabWillAcceptModifiedBorder', 'inlineEdit.tabWillAcceptOriginalBorder'
    ]
  },
  'Editor Action List (v1.93)': {
    priority: 'HIGH',
    props: [
      'editorActionList.background', 'editorActionList.foreground',
      'editorActionList.focusForeground', 'editorActionList.focusBackground'
    ]
  },
  'Tab Selected Properties': {
    priority: 'HIGH',
    props: [
      'tab.selectedBorderTop', 'tab.selectedBackground', 'tab.selectedForeground',
      'tab.dragAndDropBorder'
    ]
  },
  'Gauge (Copilot Status)': {
    priority: 'CRITICAL',
    props: [
      'gauge.background', 'gauge.foreground', 'gauge.border',
      'gauge.warningBackground', 'gauge.warningForeground',
      'gauge.errorBackground', 'gauge.errorForeground'
    ]
  },
  'Command Center': {
    priority: 'HIGH',
    props: [
      'commandCenter.foreground', 'commandCenter.activeForeground', 'commandCenter.inactiveForeground',
      'commandCenter.background', 'commandCenter.activeBackground',
      'commandCenter.border', 'commandCenter.activeBorder', 'commandCenter.inactiveBorder',
      'commandCenter.debuggingBackground'
    ]
  },
  'Sticky Scroll (editor/panel/sidebar/peek)': {
    priority: 'HIGH',
    props: [
      'editorStickyScroll.background', 'editorStickyScroll.border', 'editorStickyScroll.shadow',
      'editorStickyScrollGutter.background', 'editorStickyScrollHover.background',
      'panelStickyScroll.background', 'panelStickyScroll.border', 'panelStickyScroll.shadow',
      'sideBarStickyScroll.background', 'sideBarStickyScroll.border', 'sideBarStickyScroll.shadow',
      'peekViewEditorStickyScroll.background', 'peekViewEditorStickyScrollGutter.background'
    ]
  },
  'Panel Badges (v1.98)': {
    priority: 'MEDIUM',
    props: [
      'panelTitleBadge.background', 'panelTitleBadge.foreground',
      'panelTitle.border'
    ]
  },
  'Git Blame (v1.96)': {
    priority: 'MEDIUM',
    props: ['git.blame.editorDecorationForeground']
  },
  'Editor New Properties': {
    priority: 'HIGH',
    props: [
      'editor.placeholder.foreground', 'editor.compositionBorder',
      'editor.findMatchForeground', 'editor.findMatchHighlightForeground',
      'editor.foldPlaceholderForeground',
      'editor.inactiveLineHighlightBackground',
      'editorLightBulbAi.foreground',
      'editorMultiCursor.primary.foreground', 'editorMultiCursor.primary.background',
      'editorMultiCursor.secondary.foreground', 'editorMultiCursor.secondary.background'
    ]
  },
  'Ghost Text': {
    priority: 'HIGH',
    props: [
      'editorGhostText.foreground', 'editorGhostText.border', 'editorGhostText.background'
    ]
  },
  'Testing (New)': {
    priority: 'MEDIUM',
    props: [
      'testing.uncoveredBranchBackground',
      'testing.message.error.badgeBackground', 'testing.message.error.badgeBorder', 'testing.message.error.badgeForeground'
    ]
  },
  'Agent Session Colors': {
    priority: 'CRITICAL',
    props: [
      'agentSessionReadIndicator.foreground',
      'agentSessionSelectedBadge.border', 'agentSessionSelectedUnfocusedBadge.border',
      'agentStatusIndicator.background'
    ]
  },
  'Terminal New': {
    priority: 'MEDIUM',
    props: [
      'terminal.initialHintForeground', 'terminalOverviewRuler.border', 'terminalCommandGuide.foreground',
      'terminalStickyScroll.background', 'terminalStickyScroll.border', 'terminalStickyScrollHover.background'
    ]
  },
  'Minimap New': {
    priority: 'MEDIUM',
    props: ['minimap.chatEditHighlight', 'editorMinimap.inlineChatInserted']
  },
  'Markdown Alerts': {
    priority: 'HIGH',
    props: [
      'markdownAlert.note.foreground', 'markdownAlert.tip.foreground', 'markdownAlert.important.foreground',
      'markdownAlert.warning.foreground', 'markdownAlert.caution.foreground'
    ]
  },
  'SCM Graph': {
    priority: 'MEDIUM',
    props: [
      'scmGraph.foreground1', 'scmGraph.foreground2', 'scmGraph.foreground3', 'scmGraph.foreground4', 'scmGraph.foreground5',
      'scmGraph.historyItemHoverLabelForeground', 'scmGraph.historyItemRefColor',
      'scmGraph.historyItemRemoteRefColor', 'scmGraph.historyItemBaseRefColor',
      'scmGraph.historyItemHoverDefaultLabelForeground', 'scmGraph.historyItemHoverDefaultLabelBackground',
      'scmGraph.historyItemHoverAdditionsForeground', 'scmGraph.historyItemHoverDeletionsForeground'
    ]
  },
  'Activity Badges': {
    priority: 'HIGH',
    props: [
      'activityWarningBadge.foreground', 'activityWarningBadge.background',
      'activityErrorBadge.foreground', 'activityErrorBadge.background'
    ]
  },
  'Status Bar Offline': {
    priority: 'MEDIUM',
    props: [
      'statusBarItem.offlineBackground', 'statusBarItem.offlineForeground',
      'statusBarItem.offlineHoverForeground', 'statusBarItem.offlineHoverBackground'
    ]
  },
  'Output View': {
    priority: 'LOW',
    props: ['outputView.background', 'outputViewStickyScroll.background']
  },
  'Editor Gutter New': {
    priority: 'MEDIUM',
    props: [
      'editorGutter.modifiedSecondaryBackground', 'editorGutter.addedSecondaryBackground', 'editorGutter.deletedSecondaryBackground',
      'editorGutter.commentDraftGlyphForeground', 'editorGutter.itemGlyphForeground', 'editorGutter.itemBackground'
    ]
  },
  'Overview Ruler New': {
    priority: 'MEDIUM',
    props: [
      'editorOverviewRuler.inlineChatInserted', 'editorOverviewRuler.inlineChatRemoved', 'editorOverviewRuler.commentDraftForeground'
    ]
  },
  'Extension/MCP Icons': {
    priority: 'LOW',
    props: ['extensionIcon.privateForeground', 'mcpIcon.starForeground']
  },
  'Settings': {
    priority: 'LOW',
    props: ['settings.settingsHeaderHoverForeground']
  },
  'Sash Borders': {
    priority: 'LOW',
    props: ['profiles.sashBorder', 'chatManagement.sashBorder', 'aiCustomizationManagement.sashBorder']
  }
};

// Analyze each theme
const results = {};
for (const [themeName, themeData] of Object.entries(themes)) {
  const themeColors = Object.keys(themeData.colors || {});
  results[themeName] = { colorCount: themeColors.length };

  for (const [group, config] of Object.entries(criticalProperties)) {
    const missing = config.props.filter(p => !themeColors.includes(p));
    const present = config.props.filter(p => themeColors.includes(p));
    const emptyValues = config.props.filter(p => themeColors.includes(p) && themeData.colors[p] === '');

    results[themeName][group] = {
      priority: config.priority,
      total: config.props.length,
      missing,
      present,
      emptyValues
    };
  }
}

// Output report
console.log('\n' + '='.repeat(90));
console.log('  M TECH THEMES - MISSING PROPERTIES AUDIT REPORT');
console.log('='.repeat(90));

for (const [themeName, groups] of Object.entries(results)) {
  console.log('\n' + '#'.repeat(90));
  console.log(`  THEME: ${themeName} (${themes[themeName].type}) - ${groups.colorCount} total color properties`);
  console.log('#'.repeat(90));

  let totalMissing = 0;
  let totalChecked = 0;

  for (const [group, data] of Object.entries(groups)) {
    if (group === 'colorCount') continue;

    totalChecked += data.total;
    totalMissing += data.missing.length;

    if (data.missing.length === 0 && data.emptyValues.length === 0) {
      console.log(`\n  [${data.priority}] ${group}: \u2705 ALL ${data.total} properties defined`);
    } else {
      console.log(`\n  [${data.priority}] ${group}: \u274C ${data.missing.length}/${data.total} MISSING`);
      for (const p of data.missing) {
        console.log(`    \u274C ${p}`);
      }
      for (const p of data.emptyValues) {
        console.log(`    \u26A0\uFE0F  ${p} = "" (empty string - needs real value)`);
      }
    }
  }

  console.log(`\n  SUMMARY: ${totalMissing}/${totalChecked} properties missing`);
}

// Cross-theme summary
console.log('\n' + '='.repeat(90));
console.log('  CROSS-THEME MISSING PROPERTY SUMMARY');
console.log('='.repeat(90));

const allMissing = {};
for (const [group, config] of Object.entries(criticalProperties)) {
  for (const prop of config.props) {
    const missingIn = Object.entries(results)
      .filter(([_, groups]) => groups[group] && groups[group].missing.includes(prop))
      .map(([name]) => name);
    if (missingIn.length > 0) {
      if (!allMissing[config.priority]) allMissing[config.priority] = [];
      allMissing[config.priority].push({ prop, group, missingIn });
    }
  }
}

for (const priority of ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']) {
  if (allMissing[priority] && allMissing[priority].length > 0) {
    console.log(`\n  --- ${priority} PRIORITY ---`);
    for (const entry of allMissing[priority]) {
      const themeList = entry.missingIn.length === 3 ? 'ALL THEMES' : entry.missingIn.join(', ');
      console.log(`  ${entry.prop.padEnd(58)} [${themeList}]`);
    }
  }
}

// Check for empty-string values across themes (defined but blank)
console.log('\n' + '='.repeat(90));
console.log('  EMPTY-STRING VALUES (defined but blank - need real colors)');
console.log('='.repeat(90));

for (const [themeName, themeData] of Object.entries(themes)) {
  const empties = Object.entries(themeData.colors || {}).filter(([k, v]) => v === '');
  if (empties.length > 0) {
    console.log(`\n  ${themeName}:`);
    for (const [key, val] of empties) {
      console.log(`    ${key}`);
    }
  }
}

// Total counts
console.log('\n' + '='.repeat(90));
console.log('  TOTALS');
console.log('='.repeat(90));

let grandTotalProps = 0;
for (const config of Object.values(criticalProperties)) {
  grandTotalProps += config.props.length;
}

for (const [themeName, groups] of Object.entries(results)) {
  let missing = 0;
  for (const [group, data] of Object.entries(groups)) {
    if (group === 'colorCount') continue;
    missing += data.missing.length;
  }
  console.log(`  ${themeName.padEnd(20)} ${missing}/${grandTotalProps} missing (${((missing/grandTotalProps)*100).toFixed(1)}%)`);
}

console.log('\n  Properties checked: ' + grandTotalProps);
console.log('');
