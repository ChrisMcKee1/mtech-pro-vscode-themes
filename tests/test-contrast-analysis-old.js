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
        
        // Design intention detection: Minimalist themes with documented lower contrast philosophy
        this.minimalistThemes = [
            'Arctic Nord',           // Nord spec: intentionally softer contrast for minimalism
            'Arctic Nord Light',     
            'Enchanted Grove',       // Nature themes: organic, softer feel
            'Enchanted Grove Dark'
        ];
        
        // Light theme trade-offs (documented design decisions from systematic refactoring)
        // These themes accept slightly lower contrast due to mathematical opacity limitations:
        // - Very bright backgrounds (#FFFFFF, #FBF9F7) require MUCH darker colors at safe opacity
        // - 50% opacity triggers "TOO OPAQUE" warnings, but 45% can't reach 3:1 with available colors
        // - Accepting 2.2-2.8:1 range as design trade-off similar to other light themes in collection
        this.lightThemeTradeoffs = [
            'OGE Light',         // Renewable energy theme: selection/diff at 45% reaches ~2.4:1
            'Cosmic Void Light', // Pure white background: selection at 40% reaches ~2.4:1
            'Filter Sun'         // Established light theme baseline: 3 issues accepted
        ];
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
            this.analyzeTextOnHighlights(theme, bg, results);  // NEW: Check text readability on highlights
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
        
        // DESIGN INTENTION DETECTION (Research: Minimize false positives for intentional design choices)
        // Established minimalist themes with documented lower contrast philosophy
        const minimalistThemes = this.minimalistThemes;
        const isMinimalistTheme = minimalistThemes.some(name => results.name.includes(name));
        
        // Light theme trade-offs - reference class property
        const hasLightTradeoff = this.lightThemeTradeoffs.some(name => results.name.includes(name));
        
        // Relaxed threshold for intentional minimalist design (research: "tone down keyword brightness")
        const minimalistKeywordThreshold = 3.5;  // WCAG AA Large Text threshold
        
        // Research-based categorization (Syntax coding research.md):
        // COMMENTS SPECIAL CASE - Industry research shows 3.5-4.0:1 is standard for de-emphasis
        // (Dracula 3.03:1, Monokai 3.03:1, Night Owl 3.87:1, One Dark Pro 2.32:1)
        const commentThresholdStandard = 4.0;     // Legible but de-emphasized
        const commentThresholdMinimalist = 3.5;   // Intentional soft contrast
        const commentTooVividThreshold = 6.0;     // Comments competing with code
        
        // SCOPE CATEGORIZATION v2 - Distinguish semantic scopes from readability concerns
        // Research: Not all "comment.*" scopes serve the same purpose
        
        // Git status scopes - SEMANTIC INDICATORS (exempt from comment rules)
        const gitStatusScopes = [
            'comment.git-status',
            'comment.other.git-status'
        ];
        
        // JSDoc/nested scopes - SYNTAX HIGHLIGHTING within comments (allow higher contrast)
        const jsdocScopes = [
            'comment storage.type',
            'comment entity.name',
            'comment variable',
            'comment support',
            'comment keyword.codetag'  // TODO/FIXME tags
        ];
        
        // Main comment scopes - READABILITY FOCUSED (enforce 4.0-6.0:1)
        const mainCommentScopes = [
            'comment',
            'comment keyword',
            'comment markup',
            'comment string',
            'comment punctuation',
            'comment text'
        ];
        
        // HIGH CONTRAST REQUIRED (4.5:1) - these should "pop" and be easily readable
        const highContrastRequired = [
            // NOTE: 'comment' removed - handled separately with lower threshold
            'keyword.control',   // Research: distinct color for structure (but minimalist themes can use 3.5:1)
            'keyword.operator.new',
            'storage.type',      // Research: type keywords (class, function, int, etc.)
            'storage.modifier',  // Research: public, static, const, etc.
            'entity.name.function',   // Research: warm color that pops
            'entity.name.class',      // Research: separate color from variables
            'entity.name.type',       // Research: classes and types distinct
            'entity.name.section',    // Research: headings, important definitions
            'support.function',       // Research: built-in functions (cyan/teal)
            'support.class',          // Research: built-in classes
            'support.type',           // Research: built-in types
            'string',                 // Research: distinct color, easy to spot
            'constant.numeric',       // Research: numbers should catch the eye
            'constant.language',      // Research: true/false/null/undefined
            'constant.character',     // Research: character literals
            'markup.heading'          // Research: headings in markdown
        ];
        
        // ALLOWED TO BE MUTED - research says these should NOT steal attention
        const allowedMuted = [
            'variable',              // Research: DEFAULT foreground (no special color)
            'variable.other',        // Research: most common - keep neutral
            'variable.parameter',    // Research: can be italic but not bright
            'punctuation',           // Research: gray out to reduce noise
            'keyword.operator',      // Research: operators middle-ground or default
            'meta.brace',            // Research: braces low-key prevents clutter
            'meta.delimiter'         // Research: commas/semicolons inconspicuous
        ];
        
        tokenColors.forEach((token, index) => {
            if (!token.settings?.foreground) return;
            
            const fg = token.settings.foreground;
            const scope = Array.isArray(token.scope) ? token.scope.join(', ') : token.scope || 'unknown';
            
            // Skip if it's a background color or not a hex color
            if (!fg.startsWith('#') || fg.length < 7) return;
            
            const analysis = analyzeContrast(fg, background);
            
            // SPECIAL HANDLING FOR COMMENTS (v2: Categorized by purpose)
            const scopeLower = scope.toLowerCase();
            const isCommentScope = scopeLower.includes('comment');
            
            if (isCommentScope) {
                // Categorize comment scope type
                const isGitStatus = gitStatusScopes.some(s => scopeLower.includes(s.toLowerCase()));
                const isJSDoc = jsdocScopes.some(s => {
                    const parts = s.toLowerCase().split(' ');
                    return parts.every(part => scopeLower.includes(part));
                });
                const isMainComment = mainCommentScopes.some(s => {
                    const pattern = s.toLowerCase();
                    return scopeLower === pattern || scopeLower.startsWith(pattern + ' ') || scopeLower.startsWith(pattern + '.');
                });
                
                // Git status scopes: EXEMPT (semantic indicators, not readability)
                if (isGitStatus) {
                    // Skip entirely - these are status UI elements
                    return;
                }
                
                // JSDoc scopes: Allow higher contrast (provides clarity within comments)
                if (isJSDoc) {
                    // Only flag if EXTREMELY low (below minimalist threshold)
                    if (analysis.contrast < commentThresholdMinimalist) {
                        results.issues.push({
                            severity: 'medium',
                            category: 'syntax',
                            scope: scope,
                            color: fg,
                            contrast: analysis.contrast.toFixed(2),
                            required: `${commentThresholdMinimalist}:1`,
                            message: `JSDoc too dim: ${scope.substring(0, 40)} (should be readable for API clarity)`
                        });
                        this.stats.mediumIssues++;
                    }
                    // Skip "too vivid" check for JSDoc - intentionally highlighted
                    return;
                }
                
                // Main comments: Apply standard de-emphasis rules (4.0-6.0:1)
                if (isMainComment) {
                    const commentThreshold = isMinimalistTheme ? commentThresholdMinimalist : commentThresholdStandard;
                    const passes = analysis.contrast >= commentThreshold;
                    
                    if (!passes) {
                        // Comment too low contrast (below minimalist threshold)
                        results.issues.push({
                            severity: 'high',
                            category: 'syntax',
                            scope: scope,
                            color: fg,
                            contrast: analysis.contrast.toFixed(2),
                            required: `${commentThreshold}:1`,
                            message: `Comment fails legibility: ${scope.substring(0, 40)} (research: 4.0:1 standard, 3.5:1 minimalist)`
                        });
                        this.stats.highIssues++;
                    } else if (analysis.contrast > commentTooVividThreshold) {
                        // Comment too vivid (competing with code syntax)
                        results.issues.push({
                            severity: 'medium',
                            category: 'syntax',
                            scope: scope,
                            color: fg,
                            contrast: analysis.contrast.toFixed(2),
                            required: `< ${commentTooVividThreshold}:1`,
                            message: `Comment TOO VIVID: ${scope.substring(0, 40)} (competing with code - reduce to 4.0-6.0:1)`
                        });
                        this.stats.mediumIssues++;
                    } else if (analysis.contrast >= commentThresholdMinimalist && analysis.contrast < commentThresholdStandard) {
                        // Comment in minimalist range (acceptable for minimalist themes)
                        const designNote = isMinimalistTheme 
                            ? ' (minimalist design - acceptable)' 
                            : ' (consider increasing to 4.0:1 for legibility)';
                        results.issues.push({
                            severity: 'info',
                            category: 'syntax',
                            scope: scope,
                            color: fg,
                            contrast: analysis.contrast.toFixed(2),
                            required: `${commentThresholdStandard}:1`,
                            message: `Comment de-emphasized: ${scope.substring(0, 40)}${designNote}`
                        });
                    }
                    
                    // Skip further checks for main comments (already handled)
                    return;
                }
                
                // Catch-all for other comment scopes: Apply lenient check
                if (analysis.contrast < commentThresholdMinimalist) {
                    results.issues.push({
                        severity: 'info',
                        category: 'syntax',
                        scope: scope,
                        color: fg,
                        contrast: analysis.contrast.toFixed(2),
                        required: `${commentThresholdMinimalist}:1`,
                        message: `Other comment scope: ${scope.substring(0, 40)} (consider review)`
                    });
                }
                
                // Skip further checks for all comment scopes
                return;
            }
            
            // Check if explicitly allowed to be muted (research principle)
            const isMutedByDesign = allowedMuted.some(allowed => 
                scope.toLowerCase().includes(allowed.toLowerCase())
            );
            
            // Skip muted tokens - they SHOULD have lower contrast per research
            if (isMutedByDesign) return;
            
            // Check if this requires high contrast
            const requiresHighContrast = highContrastRequired.some(required => 
                scope.toLowerCase().includes(required.toLowerCase())
            );
            
            // Apply design-aware threshold (research: minimalist themes can use softer keywords)
            const isKeywordScope = scope.toLowerCase().includes('keyword.control') || 
                                   scope.toLowerCase().includes('storage.type') ||
                                   scope.toLowerCase().includes('storage.modifier');
            const threshold = (isMinimalistTheme && isKeywordScope) ? minimalistKeywordThreshold : 4.5;
            const passes = analysis.contrast >= threshold;
            
            if (requiresHighContrast && !passes) {
                // Add design note for minimalist themes near threshold
                const designNote = (isMinimalistTheme && analysis.contrast >= 3.0) 
                    ? ' (minimalist design - acceptable if intentional)' 
                    : '';
                
                results.issues.push({
                    severity: 'critical',
                    category: 'syntax',
                    scope: scope,
                    color: fg,
                    contrast: analysis.contrast.toFixed(2),
                    required: `${threshold}:1`,
                    message: `Syntax token fails readability: ${scope.substring(0, 40)}${designNote}`
                });
                this.stats.criticalIssues++;
            }
        });
    }

    analyzeSelectionAndDiffs(theme, background, results) {
        const colors = theme.colors || {};
        const bgRgb = hexToRgb(background);
        
        // Check if this is a light theme with documented trade-offs
        const hasLightTradeoff = this.lightThemeTradeoffs.some(name => results.name.includes(name));
        
        // Selection
        const selection = colors['editor.selectionBackground'];
        if (selection) {
            const analysis = analyzeContrast(selection, background, true);
            
            // Check if selection is invisible (too transparent)
            if (!analysis.passes3) {
                // Add note for documented light theme trade-offs
                const tradeoffNote = hasLightTradeoff 
                    ? ' (light theme trade-off - documented design decision)' 
                    : '';
                
                results.issues.push({
                    severity: 'high',
                    category: 'selection',
                    property: 'editor.selectionBackground',
                    color: selection,
                    opacity: `${Math.round(analysis.opacity * 100)}%`,
                    contrast: analysis.contrast.toFixed(2),
                    required: '3:1',
                    message: `Selection invisible (${analysis.opacity < 0.2 ? 'too low opacity' : 'low contrast'})${tradeoffNote}`
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
            
            // CRITICAL: Check if selection is TOO opaque (obscures selected text)
            // Must be able to read text THROUGH the selection highlight
            if (analysis.opacity > 0.60) {
                results.issues.push({
                    severity: 'critical',
                    category: 'selection',
                    property: 'editor.selectionBackground',
                    color: selection,
                    opacity: `${Math.round(analysis.opacity * 100)}%`,
                    message: `Selection TOO OPAQUE - selected text unreadable (max 60%, recommend 30-40%)`
                });
                this.stats.criticalIssues++;
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
                
                // Check if diff is invisible (too transparent)
                if (!analysis.passes3) {
                    // Add note for documented light theme trade-offs
                    const tradeoffNote = hasLightTradeoff 
                        ? ' (light theme trade-off - documented design decision)' 
                        : '';
                    
                    results.issues.push({
                        severity: 'high',
                        category: 'diffs',
                        property: prop,
                        color: color,
                        opacity: `${Math.round(analysis.opacity * 100)}%`,
                        contrast: analysis.contrast.toFixed(2),
                        required: '3:1',
                        message: `${label} invisible (recommend 30% opacity)${tradeoffNote}`
                    });
                    this.stats.highIssues++;
                }
                
                // CRITICAL: Check if diff is TOO opaque (obscures code text)
                // Research principle: 30% opacity for diffs to maintain text readability
                if (analysis.opacity > 0.50) {
                    results.issues.push({
                        severity: 'critical',
                        category: 'diffs',
                        property: prop,
                        color: color,
                        opacity: `${Math.round(analysis.opacity * 100)}%`,
                        message: `${label} TOO OPAQUE - obscures code text (max 50%, recommend 30%)`
                    });
                    this.stats.criticalIssues++;
                }
            }
        });
    }

    analyzeTextOnHighlights(theme, background, results) {
        const colors = theme.colors || {};
        const bgRgb = hexToRgb(background);
        
        // Determine text color (try multiple properties)
        let textColor = colors['editor.foreground'] || 
                        colors['foreground'] || 
                        '#ECEFF4';  // Default for dark themes
        
        // Light theme detection - use dark text
        if (results.type === 'light' || results.name.includes('Light') || results.name.includes('Sun') || results.name.includes('Day')) {
            textColor = colors['editor.foreground'] || '#2E3440';  // Dark text for light themes
        }
        
        const textRgb = hexToRgb(textColor);
        
        // Check selection
        const selection = colors['editor.selectionBackground'];
        if (selection) {
            const selectionRgb = hexToRgb(selection);
            
            // Blend selection with background
            const blendedSelection = blendColors(selectionRgb, bgRgb);
            const textOnSelection = calculateContrast(textRgb, blendedSelection);
            
            // CRITICAL: Text must remain readable when selected (minimum 3:1 for UI, ideally 4.5:1)
            if (textOnSelection < 3.0) {
                results.issues.push({
                    severity: 'critical',
                    category: 'text-on-highlight',
                    property: 'editor.selectionBackground',
                    color: selection,
                    textColor: textColor,
                    contrast: textOnSelection.toFixed(2),
                    required: '3:1 minimum (4.5:1 ideal)',
                    message: `Selected text UNREADABLE (${textOnSelection.toFixed(2)}:1) - reduce selection opacity or change color`
                });
                this.stats.criticalIssues++;
            } else if (textOnSelection < 4.5) {
                results.issues.push({
                    severity: 'medium',
                    category: 'text-on-highlight',
                    property: 'editor.selectionBackground',
                    textColor: textColor,
                    contrast: textOnSelection.toFixed(2),
                    message: `Selected text readability marginal (${textOnSelection.toFixed(2)}:1) - consider reducing opacity for 4.5:1`
                });
                this.stats.mediumIssues++;
            }
            
            // Check compounding: selection + diff
            const diffInserted = colors['diffEditor.insertedLineBackground'];
            if (diffInserted) {
                const diffRgb = hexToRgb(diffInserted);
                
                // Calculate combined opacity
                const selOpacity = selectionRgb.a;
                const diffOpacity = diffRgb.a;
                const combinedOpacity = 1 - (1 - selOpacity) * (1 - diffOpacity);
                
                // Blend diff onto selection-blended background
                const blendedDiff = blendColors(diffRgb, blendedSelection);
                const textOnCompounded = calculateContrast(textRgb, blendedDiff);
                
                if (combinedOpacity > 0.70) {
                    results.issues.push({
                        severity: 'critical',
                        category: 'text-on-highlight',
                        property: 'selection + diff compounding',
                        selectionOpacity: `${Math.round(selOpacity * 100)}%`,
                        diffOpacity: `${Math.round(diffOpacity * 100)}%`,
                        combinedOpacity: `${Math.round(combinedOpacity * 100)}%`,
                        message: `COMPOUNDING TOO HIGH (${Math.round(combinedOpacity * 100)}%) - text obscured in diff views (max 70%, recommend 60%)`
                    });
                    this.stats.criticalIssues++;
                } else if (textOnCompounded < 3.0) {
                    results.issues.push({
                        severity: 'critical',
                        category: 'text-on-highlight',
                        property: 'selection + diff compound',
                        textColor: textColor,
                        contrast: textOnCompounded.toFixed(2),
                        combinedOpacity: `${Math.round(combinedOpacity * 100)}%`,
                        message: `Text UNREADABLE when selection + diff compound (${textOnCompounded.toFixed(2)}:1) - reduce opacities`
                    });
                    this.stats.criticalIssues++;
                }
            }
        }
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
