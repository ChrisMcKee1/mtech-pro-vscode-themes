#!/usr/bin/env node

/**
 * M Tech Themes - Contrast Analysis Test (Optimized)
 * 
 * Analyzes themes for accessibility issues with actionable guidance:
 * - Calculates WCAG contrast ratios for syntax highlighting and UI elements
 * - Detects low-opacity selections, diffs, find system
 * - Provides clear fix suggestions for each issue
 * - Respects documented design intentions (minimalist, trade-offs)
 * 
 * Usage: node test-contrast-analysis.js [--verbose]
 */

const path = require('path');
const { analyzeContrast, hexToRgb, blendColors, calculateContrast } = require('./lib/contrast-utils');
const { printHeader, printSection, printStats, printTiming, printError, printWarning, printInfo } = require('./lib/terminal-output');
const { loadThemeFile, getAllThemeNames } = require('./lib/config-loader');
const { 
    getThemeType, 
    isMinimalistTheme, 
    hasLightTradeoff,
    getRecommendedOpacity,
    getContrastThreshold,
    getDesignNote
} = require('./lib/theme-utils');
const colors = require('./lib/terminal-colors');

function shouldDowngradeToInfo(designNote, contrast, floor = 2.5) {
    return Boolean(designNote) && typeof contrast === 'number' && contrast >= floor;
}

// Parse command line arguments
const VERBOSE = process.argv.includes('--verbose');

class ContrastAnalyzer {
    constructor() {
        this.issues = {
            critical: [],
            high: [],
            medium: [],
            info: []
        };
        
        this.stats = {
            themesAnalyzed: 0,
            criticalIssues: 0,
            highIssues: 0,
            mediumIssues: 0
        };
    }

    analyzeTheme(themeName) {
        const theme = loadThemeFile(themeName);
        
        if (!theme) {
            return null;
        }
        
        const results = {
            name: themeName,
            type: getThemeType(theme),
            issues: []
        };
        
        const bg = theme.colors?.['editor.background'] || (results.type === 'light' ? '#ffffff' : '#000000');
        
        // Analyze different aspects
        this.analyzeSyntaxHighlighting(theme, bg, results);
        this.analyzeSelectionAndDiffs(theme, bg, results);
        this.analyzeTextOnHighlights(theme, bg, results);
        this.analyzeFindSystem(theme, bg, results);
        this.analyzeScrollbars(theme, bg, results);
        this.analyzeBrackets(theme, bg, results);
        this.analyzeWelcomePage(theme, results);
        
        this.stats.themesAnalyzed++;
        return results;
    }

    analyzeSyntaxHighlighting(theme, background, results) {
        const tokenColors = theme.tokenColors || [];
        const bgRgb = hexToRgb(background);
        
        const isMinimalist = isMinimalistTheme(results.name);
        const hasTradeoff = hasLightTradeoff(results.name);
        const designNote = getDesignNote(results.name);
        
        // Scope categorization (research-based)
        const gitStatusScopes = ['comment.git-status', 'comment.other.git-status'];
        const jsdocScopes = ['comment storage.type', 'comment entity.name', 'comment variable', 'comment support', 'comment keyword.codetag'];
        const mainCommentScopes = ['comment', 'comment keyword', 'comment markup', 'comment string', 'comment punctuation', 'comment text'];
        
        const highContrastRequired = [
            'keyword.control', 'keyword.operator.new', 'storage.type', 'storage.modifier',
            'entity.name.function', 'entity.name.class', 'entity.name.type', 'entity.name.section',
            'support.function', 'support.class', 'support.type',
            'string', 'constant.numeric', 'constant.language', 'constant.character',
            'markup.heading'
        ];
        
        const allowedMuted = [
            'variable', 'variable.other', 'variable.parameter',
            'punctuation', 'keyword.operator', 'meta.brace', 'meta.delimiter'
        ];
        
        tokenColors.forEach((token) => {
            if (!token.settings?.foreground) return;
            
            const fg = token.settings.foreground;
            const scope = Array.isArray(token.scope) ? token.scope.join(', ') : token.scope || 'unknown';
            
            if (!fg.startsWith('#') || fg.length < 7) return;
            
            const analysis = analyzeContrast(fg, background);
            const scopeLower = scope.toLowerCase();
            
            // Handle comments specially
            if (scopeLower.includes('comment')) {
                const isGitStatus = gitStatusScopes.some(s => scopeLower.includes(s.toLowerCase()));
                const isJSDoc = jsdocScopes.some(s => scopeLower.includes(s.toLowerCase()));
                const isMainComment = mainCommentScopes.some(s => scopeLower.includes(s.toLowerCase()));
                
                if (isGitStatus) return; // Semantic indicators, skip
                
                const threshold = getContrastThreshold(results.name, 'comment');
                
                if (isMainComment && analysis.contrast < threshold) {
                    results.issues.push({
                        severity: 'critical',
                        category: 'syntax',
                        scope: scope.substring(0, 40),
                        color: fg,
                        contrast: analysis.contrast.toFixed(2),
                        required: `${threshold.toFixed(1)}:1`,
                        message: `Comment too dim: ${scope.substring(0, 40)}`,
                        fix: `Darken comment color by 30-40% to reach ${threshold.toFixed(1)}:1 minimum`
                    });
                    this.stats.criticalIssues++;
                }
                
                if (analysis.contrast > 6.0 && isMainComment) {
                    results.issues.push({
                        severity: 'medium',
                        category: 'syntax',
                        scope: scope.substring(0, 40),
                        color: fg,
                        contrast: analysis.contrast.toFixed(2),
                        message: `Comment too vivid (competes with code)`,
                        fix: `Lighten comment color to 4.0-5.0:1 range for de-emphasis`
                    });
                    this.stats.mediumIssues++;
                }
                
                return; // Skip further checks for comments
            }
            
            // Skip intentionally muted scopes
            const isMutedByDesign = allowedMuted.some(allowed => 
                scopeLower.includes(allowed.toLowerCase())
            );
            if (isMutedByDesign) return;
            
            // Check high-contrast tokens
            const requiresHighContrast = highContrastRequired.some(required => 
                scopeLower.includes(required.toLowerCase())
            );
            
            if (requiresHighContrast) {
                const isKeyword = scopeLower.includes('keyword') || scopeLower.includes('storage');
                const threshold = getContrastThreshold(results.name, isKeyword ? 'keyword' : 'text');
                
                if (analysis.contrast < threshold) {
                    if (shouldDowngradeToInfo(designNote, analysis.contrast, 3.0)) {
                        results.issues.push({
                            severity: 'info',
                            category: 'syntax',
                            scope: scope.substring(0, 40),
                            color: fg,
                            contrast: analysis.contrast.toFixed(2),
                            required: `${threshold}:1`,
                            message: `Design trade-off (${designNote}): ${scope.substring(0, 40)} at ${analysis.contrast.toFixed(2)}:1`
                        });
                    } else {
                        results.issues.push({
                            severity: 'critical',
                            category: 'syntax',
                            scope: scope.substring(0, 40),
                            color: fg,
                            contrast: analysis.contrast.toFixed(2),
                            required: `${threshold}:1`,
                            message: `Syntax token fails readability: ${scope.substring(0, 40)}`,
                            fix: `Increase contrast to ${threshold}:1 by adjusting lightness by 15-25%`
                        });
                        this.stats.criticalIssues++;
                    }
                }
            }
        });
    }

    analyzeSelectionAndDiffs(theme, background, results) {
        const themeColors = theme.colors || {};
        const bgRgb = hexToRgb(background);
        const hasTradeoff = hasLightTradeoff(results.name);
        const recommended = getRecommendedOpacity(results.type);
        const designNote = getDesignNote(results.name);
        
        const overlayFloor = 1.5;

        // Selection analysis
        const selection = themeColors['editor.selectionBackground'];
        if (selection) {
            const analysis = analyzeContrast(selection, background, true);
            const tradeoffLabel = designNote || (hasTradeoff ? 'Light theme trade-off - documented design decision' : 'Pragmatic overlay target');
            const fix = hasTradeoff ? null : `Increase opacity to ${Math.round(recommended.selection * 100)}% (recommended for ${results.type} themes)`;

            if (!analysis.passes3) {
                if (analysis.contrast >= overlayFloor) {
                    results.issues.push({
                        severity: 'info',
                        category: 'selection',
                        property: 'editor.selectionBackground',
                        color: selection,
                        opacity: `${Math.round(analysis.opacity * 100)}%`,
                        contrast: analysis.contrast.toFixed(2),
                        message: `${tradeoffLabel}: selection contrast ${analysis.contrast.toFixed(2)}:1 (floor ${overlayFloor}:1)`
                    });
                } else {
                    results.issues.push({
                        severity: 'high',
                        category: 'selection',
                        property: 'editor.selectionBackground',
                        color: selection,
                        opacity: `${Math.round(analysis.opacity * 100)}%`,
                        contrast: analysis.contrast.toFixed(2),
                        required: '3:1',
                        message: `Selection invisible (${analysis.opacity < 0.2 ? 'too low opacity' : 'low contrast'})`,
                        fix
                    });
                    this.stats.highIssues++;
                }
            } else if (analysis.opacity < 0.25 && !VERBOSE) {
                // Only show in verbose mode if passing but borderline
            }
            
            // Check if TOO opaque
            if (analysis.opacity > 0.60) {
                results.issues.push({
                    severity: 'critical',
                    category: 'selection',
                    property: 'editor.selectionBackground',
                    color: selection,
                    opacity: `${Math.round(analysis.opacity * 100)}%`,
                    message: `Selection TOO OPAQUE - selected text unreadable`,
                    fix: `Reduce to ${Math.round(recommended.selection * 100)}% opacity (max 60%, selected text must remain readable)`
                });
                this.stats.criticalIssues++;
            }
        }
        
        // Diff analysis
        const diffInserted = themeColors['diffEditor.insertedLineBackground'];
        const diffRemoved = themeColors['diffEditor.removedLineBackground'];
        
        [
            { prop: 'diffEditor.insertedLineBackground', color: diffInserted, label: 'Inserted lines' },
            { prop: 'diffEditor.removedLineBackground', color: diffRemoved, label: 'Removed lines' }
        ].forEach(({ prop, color, label }) => {
            if (color) {
                const analysis = analyzeContrast(color, background, true);
                const tradeoffLabel = designNote || (hasTradeoff ? 'Light theme trade-off - documented design decision' : 'Pragmatic overlay target');

                if (!analysis.passes3 && !VERBOSE) {
                    if (analysis.contrast >= overlayFloor || designNote) {
                        // Themes with a designNote (minimalist/design-first) get INFO even below floor
                        results.issues.push({
                            severity: 'info',
                            category: 'diff',
                            property: prop,
                            color: color,
                            opacity: `${Math.round(analysis.opacity * 100)}%`,
                            contrast: analysis.contrast.toFixed(2),
                            message: `${tradeoffLabel}: ${label.toLowerCase()} contrast ${analysis.contrast.toFixed(2)}:1 (floor ${overlayFloor}:1)`
                        });
                    } else {
                        results.issues.push({
                            severity: 'high',
                            category: 'diff',
                            property: prop,
                            color: color,
                            opacity: `${Math.round(analysis.opacity * 100)}%`,
                            message: `${label} invisible`,
                            fix: `Increase opacity to ${Math.round(recommended.diffLine * 100)}% (recommended for ${results.type} themes)`
                        });
                        this.stats.highIssues++;
                    }
                }
                
                if (analysis.opacity > 0.50) {
                    results.issues.push({
                        severity: 'critical',
                        category: 'diff',
                        property: prop,
                        color: color,
                        opacity: `${Math.round(analysis.opacity * 100)}%`,
                        message: `${label} TOO OPAQUE - obscures code`,
                        fix: `Reduce to ${Math.round(recommended.diffLine * 100)}% opacity (max 50%, code text must remain readable)`
                    });
                    this.stats.criticalIssues++;
                }
            }
        });
    }

    analyzeTextOnHighlights(theme, background, results) {
        const themeColors = theme.colors || {};
        const bgRgb = hexToRgb(background);
        
        let textColor = themeColors['editor.foreground'] || themeColors['foreground'] || '#ECEFF4';
        
        if (results.type === 'light') {
            textColor = themeColors['editor.foreground'] || '#2E3440';
        }
        
        const textRgb = hexToRgb(textColor);
        const selection = themeColors['editor.selectionBackground'];
        
        if (selection) {
            const selectionRgb = hexToRgb(selection);
            const blendedSelection = blendColors(selectionRgb, bgRgb);
            const textOnSelection = calculateContrast(textRgb, blendedSelection);
            
            if (textOnSelection < 3.0) {
                results.issues.push({
                    severity: 'critical',
                    category: 'text-on-highlight',
                    property: 'editor.selectionBackground',
                    color: selection,
                    textColor: textColor,
                    contrast: textOnSelection.toFixed(2),
                    required: '3:1 minimum (4.5:1 ideal)',
                    message: `Selected text UNREADABLE (${textOnSelection.toFixed(2)}:1)`,
                    fix: `Reduce selection opacity or change color - text must remain readable when highlighted`
                });
                this.stats.criticalIssues++;
            }
        }
    }

    analyzeFindSystem(theme, background, results) {
        const themeColors = theme.colors || {};
        
        const findProps = [
            'editor.findMatchBackground',
            'editor.findMatchHighlightBackground',
            'editor.findRangeHighlightBackground',
            'editor.wordHighlightBackground',
            'editor.wordHighlightStrongBackground'
        ];

        const findOpacityTargets = {
            'editor.findMatchBackground': 0.30,
            'editor.findMatchHighlightBackground': 0.20,
            'editor.findRangeHighlightBackground': 0.15,
            'editor.wordHighlightBackground': 0.25,
            'editor.wordHighlightStrongBackground': 0.30
        };
        
        const findColors = findProps.map(prop => themeColors[prop]).filter(Boolean);
        
        if (findColors.length > 1 && new Set(findColors).size === 1) {
            results.issues.push({
                severity: 'medium',
                category: 'find',
                property: 'Find system',
                color: findColors[0],
                message: `No visual hierarchy (all ${findColors.length} properties identical)`,
                fix: `Use 30%/20%/15%/25%/30% opacity tiers for clear hierarchy (match>highlight>range>word>strong)`
            });
            this.stats.mediumIssues++;
        }
        
        findColors.forEach((color, i) => {
            const analysis = analyzeContrast(color, background, true);
            const targetOpacity = findOpacityTargets[findProps[i]] ?? 0.2;
            
            if (analysis.opacity < targetOpacity && !VERBOSE) {
                results.issues.push({
                    severity: 'medium',
                    category: 'find',
                    property: findProps[i],
                    opacity: `${Math.round(analysis.opacity * 100)}%`,
                    message: `Find highlight below target opacity`,
                    fix: `Increase opacity to ${Math.round(targetOpacity * 100)}% to match hierarchy`
                });
                this.stats.mediumIssues++;
            }
        });
    }

    analyzeScrollbars(theme, background, results) {
        const themeColors = theme.colors || {};
        
        const scrollRest = themeColors['scrollbarSlider.background'];
        const scrollHover = themeColors['scrollbarSlider.hoverBackground'];
        
        if (scrollRest && scrollHover && scrollRest === scrollHover && !VERBOSE) {
            results.issues.push({
                severity: 'medium',
                category: 'scrollbars',
                property: 'scrollbarSlider',
                message: `No hover feedback (rest === hover)`,
                fix: `Make hover 10-15% brighter/darker than rest state for user feedback`
            });
            this.stats.mediumIssues++;
        }
    }

    analyzeBrackets(theme, background, results) {
        const themeColors = theme.colors || {};
        
        for (let i = 1; i <= 6; i++) {
            const bracketColor = themeColors[`editorBracketHighlight.foreground${i}`];
            
            if (bracketColor && bracketColor.startsWith('#')) {
                const analysis = analyzeContrast(bracketColor, background);
                
                if (!analysis.passes3 && !VERBOSE) {
                    results.issues.push({
                        severity: 'high',
                        category: 'brackets',
                        property: `editorBracketHighlight.foreground${i}`,
                        color: bracketColor,
                        contrast: analysis.contrast.toFixed(2),
                        message: `Bracket level ${i} fails contrast`,
                        fix: `Adjust bracket color to 3:1+ contrast (UI element minimum)`
                    });
                    this.stats.highIssues++;
                }
            }
        }
    }

    analyzeWelcomePage(theme, results) {
        const themeColors = theme.colors || {};
        const designNote = getDesignNote(results.name);
        const hoverBackgroundKeys = Object.keys(themeColors)
            .filter(key => key.startsWith('welcomePage.') && key.endsWith('HoverBackground'));

        hoverBackgroundKeys.forEach((bgKey) => {
            const bgColor = themeColors[bgKey];
            if (!bgColor || typeof bgColor !== 'string' || !bgColor.startsWith('#')) {
                return;
            }

            const expectedForegroundKey = bgKey.replace('Background', 'Foreground');
            const baseKey = bgKey.replace('HoverBackground', '');
            const candidateForegroundKeys = [
                expectedForegroundKey,
                `${baseKey}Foreground`,
                'welcomePage.buttonHoverForeground',
                'welcomePage.tileHoverForeground',
                'welcomePage.buttonForeground',
                'welcomePage.tileForeground',
                'foreground',
                'editor.foreground'
            ];

            const fgKey = candidateForegroundKeys.find((key) => typeof themeColors[key] === 'string' && themeColors[key].startsWith('#'));
            const fgColor = fgKey ? themeColors[fgKey] : null;

            if (!fgColor) {
                results.issues.push({
                    severity: 'medium',
                    category: 'welcome',
                    property: bgKey,
                    message: `No matching foreground found for ${bgKey} (expected ${expectedForegroundKey})`,
                    fix: `Define ${expectedForegroundKey} or set ${baseKey}Foreground to control welcome page text color`
                });
                this.stats.mediumIssues++;
                return;
            }

            const contrast = calculateContrast(hexToRgb(bgColor), hexToRgb(fgColor));
            if (isNaN(contrast)) {
                return;
            }

            if (contrast < 4.5) {
                const severity = contrast < 3 ? 'high' : 'medium';
                const required = contrast < 3 ? '3:1' : '4.5:1';
                const floor = severity === 'high' ? 2.5 : 3.2;
                if (shouldDowngradeToInfo(designNote, contrast, floor)) {
                    results.issues.push({
                        severity: 'info',
                        category: 'welcome',
                        property: bgKey,
                        textProperty: fgKey,
                        color: bgColor,
                        textColor: fgColor,
                        contrast: contrast.toFixed(2),
                        required: `${required}`,
                        message: `Design trade-off (${designNote}): ${bgKey} vs ${fgKey} contrast ${contrast.toFixed(2)}:1`
                    });
                } else {
                    results.issues.push({
                        severity,
                        category: 'welcome',
                        property: bgKey,
                        textProperty: fgKey,
                        color: bgColor,
                        textColor: fgColor,
                        contrast: contrast.toFixed(2),
                        required: `${required}`,
                        message: `${bgKey} vs ${fgKey} contrast ${contrast.toFixed(2)}:1`,
                        fix: `Adjust ${bgKey} or ${fgKey} to reach ${required} minimum on the welcome page`
                    });
                    if (severity === 'high') {
                        this.stats.highIssues++;
                    } else {
                        this.stats.mediumIssues++;
                    }
                }
            }
        });
    }

    generateReport() {
        printHeader('M TECH THEMES - CONTRAST ANALYSIS REPORT');
        
        printStats({
            themesAnalyzed: this.stats.themesAnalyzed,
            criticalIssues: this.stats.criticalIssues,
            highIssues: this.stats.highIssues,
            mediumIssues: this.stats.mediumIssues
        });
    }

    printThemeResults(results) {
        if (!results || results.issues.length === 0) return;
        
        const typeIcon = results.type === 'light' ? '☀️' : '🌙';
        printSection(`${results.name}`, typeIcon);
        
        // Group by category
        const byCategory = {};
        results.issues.forEach(issue => {
            if (!byCategory[issue.category]) byCategory[issue.category] = [];
            byCategory[issue.category].push(issue);
        });
        
        Object.entries(byCategory).forEach(([category, issues]) => {
            console.log(`\n  ${colors.bold}${category.toUpperCase()}:${colors.reset}`);
            
            issues.forEach(issue => {
                const { severity, message, color, opacity, contrast, required, fix } = issue;
                
                let icon, severityColor;
                switch (severity) {
                    case 'critical':
                        icon = '🚨';
                        severityColor = colors.brightRed;
                        break;
                    case 'high':
                        icon = '⚠️';
                        severityColor = colors.yellow;
                        break;
                    case 'medium':
                        icon = 'ℹ️';
                        severityColor = colors.blue;
                        break;
                    default:
                        icon = '·';
                        severityColor = colors.dim;
                }
                
                console.log(`    ${icon} ${severityColor}${severity.toUpperCase()}${colors.reset}: ${message}`);
                if (color) console.log(`       ${colors.dim}Color: ${color}${colors.reset}`);
                if (opacity) console.log(`       ${colors.dim}Opacity: ${opacity}${colors.reset}`);
                if (contrast && required) console.log(`       ${colors.dim}Contrast: ${contrast} (requires ${required})${colors.reset}`);
                if (fix) console.log(`       ${colors.brightYellow}→ FIX: ${fix}${colors.reset}`);
            });
        });
    }

    getRefactorPriority(results) {
        if (!results || results.issues.length === 0) return 'NONE';
        
        const critical = results.issues.filter(i => i.severity === 'critical').length;
        const high = results.issues.filter(i => i.severity === 'high').length;
        const medium = results.issues.filter(i => i.severity === 'medium').length;
        
        if (critical >= 5 || (critical >= 2 && high >= 3)) return 'URGENT';
        if (critical >= 2 || high >= 4) return 'HIGH';
        if (critical >= 1 || high >= 2 || medium >= 5) return 'MEDIUM';
        return 'LOW';
    }
}

// Main execution
function main() {
    const startTime = Date.now();
    const analyzer = new ContrastAnalyzer();
    
    const themeNames = getAllThemeNames();
    
    console.log(`${colors.bold}${colors.cyan}🔬 M Tech Themes - Contrast Analysis${colors.reset}\n`);
    console.log(`Analyzing ${themeNames.length} themes for accessibility issues...`);
    if (VERBOSE) console.log(`${colors.dim}(--verbose mode: showing all checks)${colors.reset}`);
    console.log('');
    
    const allResults = [];
    
    // Analyze each theme
    themeNames.forEach(themeName => {
        const results = analyzer.analyzeTheme(themeName);
        if (results && results.issues.length > 0) {
            allResults.push(results);
        }
    });
    
    // Sort by priority
    allResults.sort((a, b) => {
        const priorities = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1, 'NONE': 0 };
        return priorities[analyzer.getRefactorPriority(b)] - priorities[analyzer.getRefactorPriority(a)];
    });
    
    // Print results
    allResults.forEach(results => {
        analyzer.printThemeResults(results);
    });
    
    // Generate summary
    analyzer.generateReport();
    
    // Priority queue
    console.log(`\n${colors.bold}${colors.magenta}REFACTOR PRIORITY QUEUE:${colors.reset}\n`);
    
    const urgent = allResults.filter(r => analyzer.getRefactorPriority(r) === 'URGENT');
    const high = allResults.filter(r => analyzer.getRefactorPriority(r) === 'HIGH');
    const medium = allResults.filter(r => analyzer.getRefactorPriority(r) === 'MEDIUM');
    
    if (urgent.length > 0) {
        console.log(`${colors.red}${colors.bold}🚨 URGENT (${urgent.length}):${colors.reset}`);
        urgent.forEach(r => console.log(`  - ${r.name} (${r.issues.length} issues)`));
    }
    
    if (high.length > 0) {
        console.log(`\n${colors.yellow}${colors.bold}⚠️  HIGH (${high.length}):${colors.reset}`);
        high.forEach(r => console.log(`  - ${r.name} (${r.issues.length} issues)`));
    }
    
    if (medium.length > 0) {
        console.log(`\n${colors.blue}${colors.bold}ℹ️  MEDIUM (${medium.length}):${colors.reset}`);
        medium.forEach(r => console.log(`  - ${r.name} (${r.issues.length} issues)`));
    }
    
    const clean = themeNames.length - allResults.length;
    if (clean > 0) {
        console.log(`\n${colors.green}${colors.bold}✅ CLEAN (${clean}):${colors.reset} No significant issues detected`);
    }
    
    printTiming(startTime, 'Analysis completed in');
}

if (require.main === module) {
    main();
}

module.exports = { ContrastAnalyzer, analyzeContrast };
