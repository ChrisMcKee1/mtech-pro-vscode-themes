#!/usr/bin/env node

/**
 * M Tech Themes - Refactor Status Tracker
 * 
 * Parses THEME_IMPROVEMENTS_ANALYSIS.md to track:
 * - Which themes have been refactored
 * - Grade improvements (before → after)
 * - Number of properties modified
 * - Outstanding themes needing work
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

class RefactorStatusTracker {
    constructor() {
        this.refactored = [];
        this.pending = [];
        this.allThemes = [];
    }

    loadAnalysisDocument() {
        const analysisPath = path.join(__dirname, '..', 'THEME_IMPROVEMENTS_ANALYSIS.md');
        
        if (!fs.existsSync(analysisPath)) {
            console.log(`${colors.yellow}Warning: THEME_IMPROVEMENTS_ANALYSIS.md not found${colors.reset}`);
            return '';
        }
        
        return fs.readFileSync(analysisPath, 'utf8');
    }

    loadAllThemes() {
        const themesDir = path.join(__dirname, '..', 'themes');
        this.allThemes = fs.readdirSync(themesDir)
            .filter(file => file.endsWith('.json'))
            .map(file => path.basename(file, '.json'))
            .sort();
    }

    parseRefactoredThemes(content) {
        // Pattern to match theme refactor sections
        // Looks for: ## Theme Name Refactor
        const sectionPattern = /##\s+(.+?)\s+Refactor/gi;
        
        let match;
        while ((match = sectionPattern.exec(content)) !== null) {
            const themeName = match[1].trim();
            const sectionStart = match.index;
            
            // Find the next section or end of document
            const nextMatch = content.indexOf('\n## ', sectionStart + 1);
            const sectionEnd = nextMatch !== -1 ? nextMatch : content.length;
            const section = content.substring(sectionStart, sectionEnd);
            
            // Extract grade information (e.g., "D- (45%) → A- (93%)")
            const gradePattern = /([A-F][+-]?)\s*\((\d+)%\)\s*[→>-]\s*([A-F][+-]?)\s*\((\d+)%\)/;
            const gradeMatch = section.match(gradePattern);
            
            // Extract properties modified count
            const propsPattern = /(\d+)\s+properties?\s+modified/i;
            const propsMatch = section.match(propsPattern);
            
            // Extract verification status
            const validationPattern = /(\d+)\s+successes?,\s*(\d+)\s+errors?/i;
            const validationMatch = section.match(validationPattern);
            
            this.refactored.push({
                name: themeName,
                gradeBefore: gradeMatch ? gradeMatch[1] : 'Unknown',
                percentBefore: gradeMatch ? parseInt(gradeMatch[2]) : 0,
                gradeAfter: gradeMatch ? gradeMatch[3] : 'Unknown',
                percentAfter: gradeMatch ? parseInt(gradeMatch[4]) : 0,
                improvement: gradeMatch ? parseInt(gradeMatch[4]) - parseInt(gradeMatch[2]) : 0,
                propertiesModified: propsMatch ? parseInt(propsMatch[1]) : 0,
                testsPass: validationMatch ? parseInt(validationMatch[1]) > 0 && parseInt(validationMatch[2]) === 0 : false
            });
        }
    }

    identifyPendingThemes() {
        const refactoredNames = this.refactored.map(r => r.name);
        
        this.pending = this.allThemes.filter(theme => {
            // Check if theme name matches any refactored theme
            return !refactoredNames.some(refactored => 
                theme.toLowerCase().includes(refactored.toLowerCase()) ||
                refactored.toLowerCase().includes(theme.toLowerCase())
            );
        });
    }

    generateReport() {
        console.log(`\n${colors.bold}${colors.cyan}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.bold}${colors.cyan}║         M TECH THEMES - REFACTOR STATUS REPORT            ║${colors.reset}`);
        console.log(`${colors.bold}${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);
        
        const totalThemes = this.allThemes.length;
        const refactoredCount = this.refactored.length;
        const pendingCount = this.pending.length;
        const progress = Math.round((refactoredCount / totalThemes) * 100);
        
        console.log(`${colors.bold}Overview:${colors.reset}`);
        console.log(`  Total themes: ${totalThemes}`);
        console.log(`  ${colors.green}Refactored: ${refactoredCount}${colors.reset} (${progress}%)`);
        console.log(`  ${colors.yellow}Pending: ${pendingCount}${colors.reset} (${100 - progress}%)`);
        
        // Progress bar
        const barLength = 40;
        const filled = Math.round((refactoredCount / totalThemes) * barLength);
        const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
        console.log(`\n  Progress: [${colors.green}${bar}${colors.reset}] ${progress}%\n`);
    }

    printRefactoredThemes() {
        if (this.refactored.length === 0) {
            console.log(`${colors.yellow}No refactored themes found in analysis document.${colors.reset}\n`);
            return;
        }
        
        console.log(`${colors.bold}${colors.green}✅ REFACTORED THEMES:${colors.reset}\n`);
        
        // Sort by improvement (largest first)
        const sorted = [...this.refactored].sort((a, b) => b.improvement - a.improvement);
        
        sorted.forEach((theme, index) => {
            const icon = theme.testsPass ? '✅' : '⚠️';
            const improvementColor = theme.improvement >= 40 ? colors.green :
                                     theme.improvement >= 20 ? colors.yellow : colors.blue;
            
            console.log(`${icon} ${colors.bold}${theme.name}${colors.reset}`);
            console.log(`   Grade: ${theme.gradeBefore} (${theme.percentBefore}%) → ` +
                        `${colors.green}${theme.gradeAfter}${colors.reset} (${theme.percentAfter}%)`);
            console.log(`   ${improvementColor}+${theme.improvement} percentage points${colors.reset} | ` +
                        `${theme.propertiesModified} properties modified`);
            
            if (!theme.testsPass) {
                console.log(`   ${colors.yellow}⚠️  Needs test validation${colors.reset}`);
            }
            
            console.log('');
        });
        
        // Statistics
        const avgImprovement = Math.round(
            this.refactored.reduce((sum, t) => sum + t.improvement, 0) / this.refactored.length
        );
        const totalProps = this.refactored.reduce((sum, t) => sum + t.propertiesModified, 0);
        
        console.log(`${colors.dim}Average improvement: +${avgImprovement} percentage points${colors.reset}`);
        console.log(`${colors.dim}Total properties modified: ${totalProps}${colors.reset}\n`);
    }

    printPendingThemes() {
        if (this.pending.length === 0) {
            console.log(`${colors.green}${colors.bold}🎉 All themes refactored!${colors.reset}\n`);
            return;
        }
        
        console.log(`${colors.bold}${colors.yellow}⏳ PENDING REFACTOR:${colors.reset}\n`);
        
        // Group by category
        const lightThemes = this.pending.filter(t => 
            t.includes('Light') || t === 'Filter Sun' || t === 'Tokyo Day'
        );
        const darkThemes = this.pending.filter(t => !lightThemes.includes(t));
        
        if (darkThemes.length > 0) {
            console.log(`  ${colors.bold}Dark Themes (${darkThemes.length}):${colors.reset}`);
            darkThemes.forEach(theme => console.log(`    🌙 ${theme}`));
            console.log('');
        }
        
        if (lightThemes.length > 0) {
            console.log(`  ${colors.bold}Light Themes (${lightThemes.length}):${colors.reset}`);
            lightThemes.forEach(theme => console.log(`    ☀️  ${theme}`));
            console.log('');
        }
    }

    printRecommendations() {
        console.log(`${colors.bold}${colors.magenta}💡 RECOMMENDATIONS:${colors.reset}\n`);
        
        if (this.pending.length > 0) {
            console.log(`  1. ${colors.bold}Run contrast analysis${colors.reset} on pending themes:`);
            console.log(`     ${colors.dim}node tests/test-contrast-analysis.js${colors.reset}\n`);
            
            console.log(`  2. ${colors.bold}Prioritize by usage${colors.reset}:`);
            console.log(`     - Popular themes: Classic, Tokyo Night, Arctic Nord`);
            console.log(`     - Light themes: Critical for daytime coding\n`);
            
            console.log(`  3. ${colors.bold}Batch similar themes${colors.reset}:`);
            console.log(`     - Filter series (Machine, Moon, Octagon, etc.)`);
            console.log(`     - Cosmic/Enchanted nature themes\n`);
        }
        
        if (this.refactored.length > 0) {
            const needsValidation = this.refactored.filter(t => !t.testsPass);
            
            if (needsValidation.length > 0) {
                console.log(`  4. ${colors.yellow}${colors.bold}Validate refactored themes:${colors.reset}`);
                needsValidation.forEach(theme => {
                    console.log(`     - ${theme.name}: Run tests and visual verification`);
                });
                console.log('');
            }
        }
        
        const avgProps = Math.round(
            this.refactored.reduce((sum, t) => sum + t.propertiesModified, 0) / Math.max(this.refactored.length, 1)
        );
        
        console.log(`  ${colors.dim}Based on completed refactors:${colors.reset}`);
        console.log(`  ${colors.dim}Average ${avgProps} properties per theme, ~30-45 min per refactor${colors.reset}\n`);
    }

    generateMarkdownSummary() {
        let md = '# M Tech Themes - Refactor Status Summary\n\n';
        md += `**Generated**: ${new Date().toISOString().split('T')[0]}\n\n`;
        
        const progress = Math.round((this.refactored.length / this.allThemes.length) * 100);
        md += `## Progress: ${this.refactored.length}/${this.allThemes.length} (${progress}%)\n\n`;
        
        if (this.refactored.length > 0) {
            md += '## Completed Refactors\n\n';
            md += '| Theme | Before | After | Improvement | Properties |\n';
            md += '|-------|--------|-------|-------------|------------|\n';
            
            const sorted = [...this.refactored].sort((a, b) => b.improvement - a.improvement);
            sorted.forEach(theme => {
                md += `| ${theme.name} | ${theme.gradeBefore} (${theme.percentBefore}%) | `;
                md += `${theme.gradeAfter} (${theme.percentAfter}%) | +${theme.improvement}pp | `;
                md += `${theme.propertiesModified} |\n`;
            });
            md += '\n';
        }
        
        if (this.pending.length > 0) {
            md += '## Pending Refactors\n\n';
            this.pending.forEach(theme => {
                md += `- [ ] ${theme}\n`;
            });
            md += '\n';
        }
        
        return md;
    }
}

// Main execution
function main() {
    const tracker = new RefactorStatusTracker();
    
    console.log(`${colors.bold}${colors.cyan}📊 M Tech Themes - Refactor Status Tracker${colors.reset}\n`);
    
    // Load data
    tracker.loadAllThemes();
    const content = tracker.loadAnalysisDocument();
    tracker.parseRefactoredThemes(content);
    tracker.identifyPendingThemes();
    
    // Generate reports
    tracker.generateReport();
    tracker.printRefactoredThemes();
    tracker.printPendingThemes();
    tracker.printRecommendations();
    
    // Optional: Save markdown summary
    const args = process.argv.slice(2);
    if (args.includes('--save')) {
        const summary = tracker.generateMarkdownSummary();
        const outputPath = path.join(__dirname, '..', 'REFACTOR_STATUS.md');
        fs.writeFileSync(outputPath, summary);
        console.log(`${colors.green}✅ Saved summary to REFACTOR_STATUS.md${colors.reset}\n`);
    }
}

if (require.main === module) {
    main();
}

module.exports = { RefactorStatusTracker };
