#!/usr/bin/env node

/**
 * M Tech Themes - Contrast Analysis Test
 * 
 * Analyzes themes for accessibility issues:
 * - Calculates actual contrast ratios for syntax highlighting and UI elements
 * - Detects low-opacity selections, diffs, find system
 * - Identifies colors that fail WCAG contrast requirements
 * - Provides refactor recommendations
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m'
};

// Contrast ratio calculation helpers
function hexToRgb(hex) {
    // Handle both #RRGGBB and #RRGGBBAA formats
    hex = hex.replace('#', '');
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1.0;
    
    return { r, g, b, a };
}

function getLuminance(r, g, b) {
    // Normalize to 0-1
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function blendColors(foreground, background) {
    // Blend foreground with alpha onto background
    const alpha = foreground.a;
    
    return {
        r: Math.round(foreground.r * alpha + background.r * (1 - alpha)),
        g: Math.round(foreground.g * alpha + background.g * (1 - alpha)),
        b: Math.round(foreground.b * alpha + background.b * (1 - alpha))
    };
}

function calculateContrast(color1, color2) {
    const l1 = getLuminance(color1.r, color1.g, color1.b);
    const l2 = getLuminance(color2.r, color2.g, color2.b);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

function analyzeContrast(foregroundHex, backgroundHex, hasAlpha = false) {
    const fg = hexToRgb(foregroundHex);
    const bg = hexToRgb(backgroundHex);
    
    let effectiveColor = fg;
    
    if (hasAlpha || fg.a < 1.0) {
        effectiveColor = blendColors(fg, bg);
    }
    
    const contrast = calculateContrast(effectiveColor, bg);
    
    return {
        contrast: contrast,
        passes45: contrast >= 4.5,  // WCAG AA for normal text
        passes3: contrast >= 3.0,   // WCAG AA for large text / UI
        opacity: fg.a
    };
}

class ContrastAnalyzer {
    constructor() {
        this.issues = {
            critical: [],  // Fails 4.5:1 for text
            high: [],      // Fails 3:1 for UI elements
            medium: [],    // Low opacity issues
            info: []       // Warnings and notes
        };
        
        this.stats = {
            themesAnalyzed: 0,
            criticalIssues: 0,
            highIssues: 0,
            mediumIssues: 0
        };
    }

    analyzeTheme(themeName) {
        const themePath = path.join(__dirname, '..', 'themes', `${themeName}.json`);
        
        if (!fs.existsSync(themePath)) {
            return null;
        }
        
        try {
            const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
            const results = {
                name: themeName,
                type: theme.type || 'dark',
                issues: []
            };
            
            const bg = theme.colors?.['editor.background'] || (theme.type === 'light' ? '#ffffff' : '#000000');
            
            // Analyze common problem areas
            this.analyzeSyntaxHighlighting(theme, bg, results);
            this.analyzeSelectionAndDiffs(theme, bg, results);
            this.analyzeFindSystem(theme, bg, results);
            this.analyzeScrollbars(theme, bg, results);
            this.analyzeBrackets(theme, bg, results);
            
            this.stats.themesAnalyzed++;
            return results;
            
        } catch (error) {
            this.issues.info.push(`Failed to analyze ${themeName}: ${error.message}`);
            return null;
        }
    }

    analyzeSyntaxHighlighting(theme, background, results) {
        const tokenColors = theme.tokenColors || [];
        const bgRgb = hexToRgb(background);
        
        // Check for common high-contrast syntax tokens
        const criticalScopes = [
            'keyword', 'storage', 'support', 'entity.name', 'variable.function',
            'meta.property-name', 'markup.heading'
        ];
        
        tokenColors.forEach((token, index) => {
            if (!token.settings?.foreground) return;
            
            const fg = token.settings.foreground;
            const scope = Array.isArray(token.scope) ? token.scope.join(', ') : token.scope || 'unknown';
            
            // Skip if it's a background color or not a hex color
            if (!fg.startsWith('#') || fg.length < 7) return;
            
            const analysis = analyzeContrast(fg, background);
            
            // Check if this is a critical scope
            const isCritical = criticalScopes.some(critical => 
                scope.toLowerCase().includes(critical.toLowerCase())
            );
            
            if (isCritical && !analysis.passes45) {
                results.issues.push({
                    severity: 'critical',
                    category: 'syntax',
                    scope: scope,
                    color: fg,
                    contrast: analysis.contrast.toFixed(2),
                    required: '4.5:1',
                    message: `Syntax token fails readability: ${scope.substring(0, 40)}`
                });
                this.stats.criticalIssues++;
            }
        });
    }

    analyzeSelectionAndDiffs(theme, background, results) {
        const colors = theme.colors || {};
        const bgRgb = hexToRgb(background);
        
        // Selection
        const selection = colors['editor.selectionBackground'];
        if (selection) {
            const analysis = analyzeContrast(selection, background, true);
            
            if (!analysis.passes3) {
                results.issues.push({
                    severity: 'high',
                    category: 'selection',
                    property: 'editor.selectionBackground',
                    color: selection,
                    opacity: `${Math.round(analysis.opacity * 100)}%`,
                    contrast: analysis.contrast.toFixed(2),
                    required: '3:1',
                    message: `Selection invisible (${analysis.opacity < 0.2 ? 'too low opacity' : 'low contrast'})`
                });
                this.stats.highIssues++;
            } else if (analysis.opacity < 0.25) {
                results.issues.push({
                    severity: 'medium',
                    category: 'selection',
                    property: 'editor.selectionBackground',
                    opacity: `${Math.round(analysis.opacity * 100)}%`,
                    message: `Selection opacity low (industry standard: 30-40%)`
                });
                this.stats.mediumIssues++;
            }
        }
        
        // Diffs
        const diffInserted = colors['diffEditor.insertedLineBackground'];
        const diffRemoved = colors['diffEditor.removedLineBackground'];
        
        [
            { prop: 'diffEditor.insertedLineBackground', color: diffInserted, label: 'Inserted lines' },
            { prop: 'diffEditor.removedLineBackground', color: diffRemoved, label: 'Removed lines' }
        ].forEach(({ prop, color, label }) => {
            if (color) {
                const analysis = analyzeContrast(color, background, true);
                
                if (!analysis.passes3) {
                    results.issues.push({
                        severity: 'high',
                        category: 'diffs',
                        property: prop,
                        color: color,
                        opacity: `${Math.round(analysis.opacity * 100)}%`,
                        contrast: analysis.contrast.toFixed(2),
                        required: '3:1',
                        message: `${label} invisible (recommend 30% opacity)`
                    });
                    this.stats.highIssues++;
                }
            }
        });
    }

    analyzeFindSystem(theme, background, results) {
        const colors = theme.colors || {};
        
        const findProps = [
            'editor.findMatchBackground',
            'editor.findMatchHighlightBackground',
            'editor.wordHighlightBackground',
            'editor.wordHighlightStrongBackground'
        ];
        
        const findColors = findProps.map(prop => colors[prop]).filter(Boolean);
        
        // Check if all are identical (no hierarchy)
        if (findColors.length > 1 && new Set(findColors).size === 1) {
            results.issues.push({
                severity: 'medium',
                category: 'find',
                property: 'Find system',
                color: findColors[0],
                message: `No visual hierarchy (all ${findColors.length} properties identical)`
            });
            this.stats.mediumIssues++;
        }
        
        // Check if any are too low contrast
        findColors.forEach((color, i) => {
            const analysis = analyzeContrast(color, background, true);
            
            if (analysis.opacity < 0.2) {
                results.issues.push({
                    severity: 'medium',
                    category: 'find',
                    property: findProps[i],
                    opacity: `${Math.round(analysis.opacity * 100)}%`,
                    message: `Find highlight barely visible (recommend 30-50%)`
                });
                this.stats.mediumIssues++;
            }
        });
    }

    analyzeScrollbars(theme, background, results) {
        const colors = theme.colors || {};
        
        const scrollRest = colors['scrollbarSlider.background'];
        const scrollHover = colors['scrollbarSlider.hoverBackground'];
        const scrollActive = colors['scrollbarSlider.activeBackground'];
        
        // Check if rest and hover are identical (no feedback)
        if (scrollRest && scrollHover && scrollRest === scrollHover) {
            results.issues.push({
                severity: 'medium',
                category: 'scrollbars',
                property: 'scrollbarSlider',
                message: `No hover feedback (rest === hover)`
            });
            this.stats.mediumIssues++;
        }
    }

    analyzeBrackets(theme, background, results) {
        const colors = theme.colors || {};
        
        for (let i = 1; i <= 6; i++) {
            const bracketColor = colors[`editorBracketHighlight.foreground${i}`];
            
            if (bracketColor && bracketColor.startsWith('#')) {
                const analysis = analyzeContrast(bracketColor, background);
                
                if (!analysis.passes3) {
                    results.issues.push({
                        severity: 'critical',
                        category: 'brackets',
                        property: `editorBracketHighlight.foreground${i}`,
                        color: bracketColor,
                        contrast: analysis.contrast.toFixed(2),
                        required: '3:1',
                        message: `Bracket color ${i} fails visibility${analysis.contrast < 1.5 ? ' (nearly invisible!)' : ''}`
                    });
                    this.stats.criticalIssues++;
                }
            }
        }
    }

    generateReport() {
        console.log(`\n${colors.bold}${colors.cyan}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.bold}${colors.cyan}║         M TECH THEMES - CONTRAST ANALYSIS REPORT          ║${colors.reset}`);
        console.log(`${colors.bold}${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);
        
        console.log(`${colors.bold}Statistics:${colors.reset}`);
        console.log(`  Themes analyzed: ${this.stats.themesAnalyzed}`);
        console.log(`  ${colors.red}Critical issues: ${this.stats.criticalIssues}${colors.reset} (text fails 4.5:1)`);
        console.log(`  ${colors.yellow}High issues: ${this.stats.highIssues}${colors.reset} (UI fails 3:1)`);
        console.log(`  ${colors.blue}Medium issues: ${this.stats.mediumIssues}${colors.reset} (opacity/hierarchy)`);
    }

    printThemeResults(results) {
        if (!results || results.issues.length === 0) return;
        
        const typeIcon = results.type === 'light' ? '☀️' : '🌙';
        console.log(`\n${colors.bold}${typeIcon}  ${results.name}${colors.reset} (${results.type})`);
        console.log(`${'─'.repeat(60)}`);
        
        // Group by category
        const byCategory = {};
        results.issues.forEach(issue => {
            if (!byCategory[issue.category]) {
                byCategory[issue.category] = [];
            }
            byCategory[issue.category].push(issue);
        });
        
        Object.entries(byCategory).forEach(([category, issues]) => {
            console.log(`\n  ${colors.bold}${category.toUpperCase()}:${colors.reset}`);
            
            issues.forEach(issue => {
                const icon = issue.severity === 'critical' ? '❌' : 
                             issue.severity === 'high' ? '⚠️' : 'ℹ️';
                
                const colorMark = issue.severity === 'critical' ? colors.red :
                                  issue.severity === 'high' ? colors.yellow : colors.blue;
                
                console.log(`    ${icon} ${colorMark}${issue.message}${colors.reset}`);
                
                if (issue.color) {
                    console.log(`       Color: ${issue.color} | Contrast: ${issue.contrast || 'N/A'}`);
                }
                if (issue.opacity) {
                    console.log(`       Opacity: ${issue.opacity}`);
                }
                if (issue.required) {
                    console.log(`       Required: ${issue.required}`);
                }
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
    const analyzer = new ContrastAnalyzer();
    
    // Get all theme files
    const themesDir = path.join(__dirname, '..', 'themes');
    const themeFiles = fs.readdirSync(themesDir)
        .filter(file => file.endsWith('.json'))
        .map(file => path.basename(file, '.json'));
    
    console.log(`${colors.bold}${colors.cyan}🔬 M Tech Themes - Contrast Analysis${colors.reset}\n`);
    console.log(`Analyzing ${themeFiles.length} themes for accessibility issues...\n`);
    
    const allResults = [];
    
    // Analyze each theme
    themeFiles.forEach(themeName => {
        const results = analyzer.analyzeTheme(themeName);
        if (results && results.issues.length > 0) {
            allResults.push(results);
        }
    });
    
    // Sort by priority
    allResults.sort((a, b) => {
        const priorities = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1, 'NONE': 0 };
        const aPriority = analyzer.getRefactorPriority(a);
        const bPriority = analyzer.getRefactorPriority(b);
        return priorities[bPriority] - priorities[aPriority];
    });
    
    // Print results
    allResults.forEach(results => {
        analyzer.printThemeResults(results);
    });
    
    // Generate summary report
    analyzer.generateReport();
    
    // Refactor recommendations
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
    
    const clean = themeFiles.length - allResults.length;
    if (clean > 0) {
        console.log(`\n${colors.green}${colors.bold}✅ CLEAN (${clean}):${colors.reset} No significant issues detected`);
    }
    
    console.log('');
}

if (require.main === module) {
    main();
}

module.exports = { ContrastAnalyzer, analyzeContrast, calculateContrast };
