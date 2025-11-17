#!/usr/bin/env node
/**
 * Analyze all themes for missing or problematic properties
 * Based on Arctic Nord v0.5.10 fixes
 */

const fs = require('fs');
const path = require('path');

// Property groups mirror docs/CONTRAST_REFERENCE.md so coverage gaps map directly to checklist rows
const PROPERTY_GROUPS = [
    {
        name: 'Selection & Highlights',
        properties: [
            'editor.selectionBackground',
            'editor.selectionHighlightBackground',
            'editor.inactiveSelectionBackground',
            'editor.findMatchBackground',
            'editor.findMatchHighlightBackground',
            'editor.findRangeHighlightBackground',
            'editor.wordHighlightBackground',
            'editor.wordHighlightStrongBackground'
        ]
    },
    {
        name: 'Diff Views',
        properties: [
            'diffEditor.insertedLineBackground',
            'diffEditor.removedLineBackground',
            'diffEditor.insertedTextBackground',
            'diffEditor.removedTextBackground'
        ]
    },
    {
        name: 'Lists & Menus',
        properties: [
            'list.hoverBackground',
            'list.hoverForeground',
            'list.focusBackground',
            'list.focusForeground',
            'list.activeSelectionBackground',
            'list.activeSelectionForeground',
            'list.activeSelectionIconForeground',
            'list.inactiveSelectionBackground',
            'list.inactiveSelectionForeground',
            'list.inactiveSelectionIconForeground',
            'menu.selectionBackground',
            'menu.selectionForeground',
            'menubar.selectionBackground',
            'menubar.selectionForeground'
        ]
    },
    {
        name: 'Buttons & Inputs',
        properties: [
            'button.background',
            'button.foreground',
            'button.hoverBackground',
            'button.secondaryHoverBackground',
            'button.secondaryHoverForeground',
            'input.background',
            'input.foreground',
            'inputOption.activeBackground',
            'inputOption.activeForeground'
        ]
    },
    {
        name: 'Tabs & Panels',
        properties: [
            'tab.activeBackground',
            'tab.activeForeground',
            'tab.hoverBackground',
            'tab.hoverForeground',
            'editorGroupHeader.tabsBackground',
            'panel.background'
        ]
    },
    {
        name: 'Status Bar',
        properties: [
            'statusBarItem.prominentBackground',
            'statusBarItem.prominentForeground',
            'statusBarItem.prominentHoverBackground',
            'statusBarItem.prominentHoverForeground',
            'statusBarItem.remoteBackground',
            'statusBarItem.remoteForeground',
            'statusBarItem.remoteHoverBackground',
            'statusBarItem.remoteHoverForeground'
        ]
    },
    {
        name: 'Scrollbars',
        properties: [
            'scrollbarSlider.background',
            'scrollbarSlider.hoverBackground',
            'scrollbarSlider.activeBackground'
        ]
    },
    {
        name: 'Focus Outlines',
        properties: [
            'list.focusOutline',
            'list.focusAndSelectionOutline',
            'list.inactiveFocusOutline'
        ]
    },
    {
        name: 'Welcome Page',
        properties: [
            'welcomePage.buttonHoverBackground',
            'welcomePage.buttonHoverForeground',
            'welcomePage.tileHoverBackground',
            'welcomePage.tileHoverForeground'
        ]
    }
];

const BACKGROUND_FOREGROUND_PAIRS = [
    { background: 'menu.selectionBackground', foreground: 'menu.selectionForeground', label: 'menu.selection' },
    { background: 'menubar.selectionBackground', foreground: 'menubar.selectionForeground', label: 'menubar.selection' },
    { background: 'list.hoverBackground', foreground: 'list.hoverForeground', label: 'list.hover' },
    { background: 'list.focusBackground', foreground: 'list.focusForeground', label: 'list.focus' },
    { background: 'list.activeSelectionBackground', foreground: 'list.activeSelectionForeground', label: 'list.activeSelection' },
    { background: 'list.inactiveSelectionBackground', foreground: 'list.inactiveSelectionForeground', label: 'list.inactiveSelection' },
    { background: 'button.background', foreground: 'button.foreground', label: 'button.default' },
    { background: 'button.secondaryHoverBackground', foreground: 'button.secondaryHoverForeground', label: 'button.secondaryHover' },
    { background: 'input.background', foreground: 'input.foreground', label: 'input.default' },
    { background: 'inputOption.activeBackground', foreground: 'inputOption.activeForeground', label: 'inputOption.active' },
    { background: 'tab.activeBackground', foreground: 'tab.activeForeground', label: 'tab.active' },
    { background: 'tab.hoverBackground', foreground: 'tab.hoverForeground', label: 'tab.hover' },
    { background: 'statusBarItem.prominentBackground', foreground: 'statusBarItem.prominentForeground', label: 'statusBar.prominent' },
    { background: 'statusBarItem.prominentHoverBackground', foreground: 'statusBarItem.prominentHoverForeground', label: 'statusBar.prominentHover' },
    { background: 'statusBarItem.remoteBackground', foreground: 'statusBarItem.remoteForeground', label: 'statusBar.remote' },
    { background: 'statusBarItem.remoteHoverBackground', foreground: 'statusBarItem.remoteHoverForeground', label: 'statusBar.remoteHover' },
    { background: 'welcomePage.buttonHoverBackground', foreground: 'welcomePage.buttonHoverForeground', label: 'welcome.buttonHover' },
    { background: 'welcomePage.tileHoverBackground', foreground: 'welcomePage.tileHoverForeground', label: 'welcome.tileHover' }
];

function analyzeTheme(themePath) {
    const themeName = path.basename(themePath, '.json');
    const themeData = JSON.parse(fs.readFileSync(themePath, 'utf8'));
    const colors = themeData.colors || {};
    
    const issues = {
        missing: [],
        contrastIssues: [],
        unpaired: []
    };
    
    // Check for missing properties
    PROPERTY_GROUPS.forEach((group) => {
        group.properties.forEach((prop) => {
            if (!colors[prop]) {
                issues.missing.push({ property: prop, category: group.name });
            }
        });
    });

    // Background/foreground pairs should exist together so hover states never fall back to editor.foreground
    BACKGROUND_FOREGROUND_PAIRS.forEach((pair) => {
        const hasBg = Boolean(colors[pair.background]);
        const hasFg = Boolean(colors[pair.foreground]);
        if (hasBg !== hasFg) {
            issues.unpaired.push({
                label: pair.label,
                missing: hasBg ? pair.foreground : pair.background
            });
        }
    });
    
    // Check for white-on-light or dark-on-dark contrast issues
    // Menu selection issues
    if (colors['menu.selectionBackground'] && colors['menu.selectionForeground']) {
        const bg = colors['menu.selectionBackground'];
        const fg = colors['menu.selectionForeground'];
        if (isLightColor(bg) && isLightColor(fg)) {
            issues.contrastIssues.push({
                property: 'menu.selection',
                problem: 'Light foreground on light background',
                bg, fg
            });
        }
    }
    
    // List hover issues
    if (colors['list.hoverBackground'] && colors['list.hoverForeground']) {
        const bg = colors['list.hoverBackground'];
        const fg = colors['list.hoverForeground'];
        if (isLightColor(bg) && isLightColor(fg)) {
            issues.contrastIssues.push({
                property: 'list.hover',
                problem: 'Light foreground on light background',
                bg, fg
            });
        }
    }
    
    // List active selection issues
    if (colors['list.activeSelectionBackground'] && colors['list.activeSelectionForeground']) {
        const bg = colors['list.activeSelectionBackground'];
        const fg = colors['list.activeSelectionForeground'];
        if (isLightColor(bg) && isLightColor(fg)) {
            issues.contrastIssues.push({
                property: 'list.activeSelection',
                problem: 'Light foreground on light background',
                bg, fg
            });
        }
    }
    
    return {
        themeName,
        isDark: themeData.type === 'dark',
        issueCount: issues.missing.length + issues.contrastIssues.length + issues.unpaired.length,
        issues
    };
}

function isLightColor(hex) {
    if (!hex || !hex.startsWith('#')) return false;
    // Remove # and alpha channel if present
    const rgb = hex.slice(1, 7);
    const r = parseInt(rgb.substr(0, 2), 16);
    const g = parseInt(rgb.substr(2, 2), 16);
    const b = parseInt(rgb.substr(4, 2), 16);
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5; // Light if luminance > 50%
}

// Main execution
const themesDir = path.join(__dirname, '../themes');
const themeFiles = fs.readdirSync(themesDir).filter(f => f.endsWith('.json'));

console.log('========================================================');
console.log('  THEME PROPERTY ANALYSIS');
console.log('  Based on Arctic Nord v0.5.10 Fixes');
console.log('========================================================\n');

const results = themeFiles.map(file => 
    analyzeTheme(path.join(themesDir, file))
).sort((a, b) => b.issueCount - a.issueCount);

// Summary by severity
const needsFixes = results.filter(r => r.issueCount > 0);
const alreadyFixed = results.filter(r => r.issueCount === 0);

console.log(`📊 SUMMARY:`);
console.log(`   Total themes: ${results.length}`);
console.log(`   ✅ Already fixed: ${alreadyFixed.length}`);
console.log(`   ⚠️  Need fixes: ${needsFixes.length}`);
console.log('');

// Detailed report for themes needing fixes
if (needsFixes.length > 0) {
    console.log('========================================================');
    console.log('  THEMES NEEDING FIXES (Priority Order)');
    console.log('========================================================\n');
    
    needsFixes.forEach((result, index) => {
        console.log(`${index + 1}. ${result.themeName} (${result.isDark ? 'Dark' : 'Light'})`);
        console.log(`   Issues: ${result.issueCount} total\n`);
        
        if (result.issues.missing.length > 0) {
            console.log(`   Missing Properties (${result.issues.missing.length}):`);
            const byCategory = {};
            result.issues.missing.forEach(issue => {
                if (!byCategory[issue.category]) byCategory[issue.category] = [];
                byCategory[issue.category].push(issue.property);
            });
            Object.entries(byCategory).forEach(([cat, props]) => {
                console.log(`     ${cat}:`);
                props.forEach(p => console.log(`       - ${p}`));
            });
            console.log('');
        }
        
        if (result.issues.contrastIssues.length > 0) {
            console.log(`   Contrast Issues (${result.issues.contrastIssues.length}):`);
            result.issues.contrastIssues.forEach(issue => {
                console.log(`     - ${issue.property}: ${issue.problem}`);
                console.log(`       BG: ${issue.bg}, FG: ${issue.fg}`);
            });
            console.log('');
        }

        if (result.issues.unpaired.length > 0) {
            console.log(`   Background/Foreground Mismatches (${result.issues.unpaired.length}):`);
            result.issues.unpaired.forEach(issue => {
                console.log(`     - ${issue.label}: missing ${issue.missing}`);
            });
            console.log('');
        }
    });
}

// Themes already fixed
if (alreadyFixed.length > 0) {
    console.log('========================================================');
    console.log('  ✅ THEMES ALREADY COMPLIANT');
    console.log('========================================================\n');
    alreadyFixed.forEach(r => {
        console.log(`   ✓ ${r.themeName} (${r.isDark ? 'Dark' : 'Light'})`);
    });
    console.log('');
}

console.log('========================================================');
console.log('  RECOMMENDED ACTIONS');
console.log('========================================================\n');
console.log('1. Fix high-priority themes first (most issues)');
console.log('2. Apply Arctic Nord v0.5.10 pattern:');
console.log('   - Add missing menu.selection* properties');
console.log('   - Add missing list focus/outline properties');
console.log('   - Ensure light backgrounds have dark foregrounds');
console.log('3. Test each theme after fixes');
console.log('4. Run contrast analysis: .\\run-tests.cmd --contrast');
console.log('');
