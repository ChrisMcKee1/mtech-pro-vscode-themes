#!/usr/bin/env node
/**
 * Analyze all themes for missing or problematic properties
 * Based on Arctic Nord v0.5.10 fixes
 */

const fs = require('fs');
const path = require('path');

// Critical properties that must exist for proper UI functionality
const REQUIRED_PROPERTIES = {
    menu: [
        'menu.selectionBackground',
        'menu.selectionForeground',
        'menubar.selectionBackground',
        'menubar.selectionForeground'
    ],
    list: [
        'list.activeSelectionBackground',
        'list.activeSelectionForeground',
        'list.activeSelectionIconForeground',
        'list.hoverBackground',
        'list.hoverForeground',
        'list.focusAndSelectionOutline',
        'list.focusOutline',
        'list.inactiveFocusOutline',
        'list.inactiveSelectionIconForeground'
    ],
    editor: [
        'editor.selectionBackground',
        'editor.selectionHighlightBackground',
        'editor.inactiveSelectionBackground'
    ]
};

function analyzeTheme(themePath) {
    const themeName = path.basename(themePath, '.json');
    const themeData = JSON.parse(fs.readFileSync(themePath, 'utf8'));
    const colors = themeData.colors || {};
    
    const issues = {
        missing: [],
        contrastIssues: []
    };
    
    // Check for missing properties
    Object.entries(REQUIRED_PROPERTIES).forEach(([category, props]) => {
        props.forEach(prop => {
            if (!colors[prop]) {
                issues.missing.push({ property: prop, category });
            }
        });
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
        issueCount: issues.missing.length + issues.contrastIssues.length,
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
