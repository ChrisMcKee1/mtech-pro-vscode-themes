#!/usr/bin/env node

/**
 * M Tech Themes - Mapping Validation Test Script
 * 
 * This script validates:
 * 1. Theme-to-icon mappings work correctly
 * 2. All themes in package.json exist as files
 * 3. All icon themes in package.json exist as files
 * 4. JavaScript theme lists match package.json
 * 5. Icon theme names are consistent across configurations
 * 6. Missing mappings and orphaned files
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for better output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

class ThemeMappingValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.successes = [];
        
        // Load configuration files
        this.packageJson = this.loadJson('../package.json');
        this.mainJs = this.loadJs('../js/main.js');
        this.browserJs = this.loadJs('../js/browser.js');
        
        // Extract themes and icons from files
        this.themeFiles = this.getThemeFiles();
        this.iconFiles = this.getIconFiles();
    }

    loadJson(filePath) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            this.errors.push(`Failed to load ${filePath}: ${error.message}`);
            return null;
        }
    }

    loadJs(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Extract THEME_CONFIG using regex
            const themeConfigMatch = content.match(/const THEME_CONFIG = ({[\s\S]*?});/);
            if (!themeConfigMatch) {
                this.errors.push(`Could not find THEME_CONFIG in ${filePath}`);
                return null;
            }

            // Parse the extracted config (simple eval for testing - not recommended for production)
            const configString = themeConfigMatch[1]
                .replace(/(\w+):/g, '"$1":')  // Add quotes to keys
                .replace(/'/g, '"');          // Convert single quotes to double quotes
            
            return JSON.parse(configString);
        } catch (error) {
            this.errors.push(`Failed to parse JavaScript config from ${filePath}: ${error.message}`);
            return null;
        }
    }

    getThemeFiles() {
        try {
            return fs.readdirSync('../themes/')
                .filter(file => file.endsWith('.json'))
                .map(file => path.basename(file, '.json'));
        } catch (error) {
            this.errors.push(`Failed to read themes directory: ${error.message}`);
            return [];
        }
    }

    getIconFiles() {
        try {
            return fs.readdirSync('../icon-themes/')
                .filter(file => file.endsWith('.json'))
                .map(file => path.basename(file, '.json').replace(' icon-theme', ''));
        } catch (error) {
            this.errors.push(`Failed to read icon-themes directory: ${error.message}`);
            return [];
        }
    }

    // Simulate the getMatchingIconTheme logic
    getMatchingIconTheme(themeName, isMonochrome = false, iconThemes) {
        const baseIconTheme = `${themeName} Icons`;
        const monochromeIconTheme = `${themeName} Monochrome Icons`;
        
        if (isMonochrome && iconThemes.includes(monochromeIconTheme)) {
            return monochromeIconTheme;
        }
        
        return iconThemes.includes(baseIconTheme) ? baseIconTheme : "Classic Icons";
    }

    validatePackageJsonThemes() {
        console.log(`${colors.bold}${colors.blue}=== Validating Package.json Themes ===${colors.reset}`);
        
        if (!this.packageJson?.contributes?.themes) {
            this.errors.push("No themes found in package.json");
            return;
        }

        const packageThemes = this.packageJson.contributes.themes;
        
        packageThemes.forEach(theme => {
            const themeLabel = theme.label;
            const themePath = theme.path;
            const expectedFile = path.basename(themePath, '.json');
            
            // Check if theme file exists
            if (!this.themeFiles.includes(expectedFile)) {
                this.errors.push(`Theme file missing: ${themePath} for theme "${themeLabel}"`);
            } else {
                this.successes.push(`✓ Theme file exists: ${themeLabel} → ${themePath}`);
            }

            // Validate theme file content
            try {
                const themeContent = this.loadJson(`../${themePath}`);
                if (themeContent && themeContent.name !== themeLabel) {
                    this.warnings.push(`Theme name mismatch: package.json="${themeLabel}" vs file.name="${themeContent.name}"`);
                }
            } catch (error) {
                this.errors.push(`Failed to validate theme file ${themePath}: ${error.message}`);
            }
        });
    }

    validatePackageJsonIcons() {
        console.log(`${colors.bold}${colors.blue}=== Validating Package.json Icon Themes ===${colors.reset}`);
        
        if (!this.packageJson?.contributes?.iconThemes) {
            this.errors.push("No icon themes found in package.json");
            return;
        }

        const packageIcons = this.packageJson.contributes.iconThemes;
        
        packageIcons.forEach(icon => {
            const iconLabel = icon.label;
            const iconPath = icon.path;
            const expectedFile = path.basename(iconPath, '.json');
            
            // Check if icon file exists
            if (!fs.existsSync(`../${iconPath}`)) {
                this.errors.push(`Icon file missing: ${iconPath} for icon theme "${iconLabel}"`);
            } else {
                this.successes.push(`✓ Icon file exists: ${iconLabel} → ${iconPath}`);
            }
        });
    }

    validateJavaScriptConfigs() {
        console.log(`${colors.bold}${colors.blue}=== Validating JavaScript Configs ===${colors.reset}`);
        
        if (!this.mainJs || !this.browserJs) {
            this.errors.push("Failed to load JavaScript configuration files");
            return;
        }

        // Check if main.js and browser.js have identical configs
        const mainThemes = JSON.stringify(this.mainJs.themes?.sort());
        const browserThemes = JSON.stringify(this.browserJs.themes?.sort());
        const mainIcons = JSON.stringify(this.mainJs.iconThemes?.sort());
        const browserIcons = JSON.stringify(this.browserJs.iconThemes?.sort());

        if (mainThemes !== browserThemes) {
            this.errors.push("Theme lists differ between main.js and browser.js");
            console.log(`${colors.yellow}Main.js themes: ${this.mainJs.themes?.length || 0} items${colors.reset}`);
            console.log(`${colors.yellow}Browser.js themes: ${this.browserJs.themes?.length || 0} items${colors.reset}`);
        } else {
            this.successes.push("✓ Theme lists identical in main.js and browser.js");
        }

        if (mainIcons !== browserIcons) {
            this.errors.push("Icon theme lists differ between main.js and browser.js");
        } else {
            this.successes.push("✓ Icon theme lists identical in main.js and browser.js");
        }
    }

    validateThemeToIconMappings() {
        console.log(`${colors.bold}${colors.blue}=== Validating Theme-to-Icon Mappings ===${colors.reset}`);
        
        if (!this.mainJs?.themes || !this.mainJs?.iconThemes) {
            this.errors.push("Missing theme or icon configuration in JavaScript files");
            return;
        }

        const themes = this.mainJs.themes;
        const iconThemes = this.mainJs.iconThemes;
        
        console.log(`${colors.cyan}Testing ${themes.length} themes for icon mappings...${colors.reset}`);
        
        themes.forEach(themeName => {
            // Test normal mapping
            const normalIcon = this.getMatchingIconTheme(themeName, false, iconThemes);
            const monochromeIcon = this.getMatchingIconTheme(themeName, true, iconThemes);
            
            const expectedNormalIcon = `${themeName} Icons`;
            const expectedMonochromeIcon = `${themeName} Monochrome Icons`;
            
            // Check if expected icon exists
            if (iconThemes.includes(expectedNormalIcon)) {
                this.successes.push(`✓ ${themeName} → ${expectedNormalIcon}`);
            } else {
                this.warnings.push(`⚠ ${themeName} → fallback to ${normalIcon} (expected: ${expectedNormalIcon})`);
            }
            
            // Check monochrome mapping
            if (iconThemes.includes(expectedMonochromeIcon)) {
                this.successes.push(`✓ ${themeName} → ${expectedMonochromeIcon} (monochrome)`);
            } else {
                this.warnings.push(`⚠ ${themeName} → no monochrome variant (${expectedMonochromeIcon})`);
            }
        });
    }

    validateOrphanedFiles() {
        console.log(`${colors.bold}${colors.blue}=== Checking for Orphaned Files ===${colors.reset}`);
        
        // Get theme names from package.json
        const packageThemeNames = this.packageJson?.contributes?.themes?.map(t => 
            path.basename(t.path, '.json')
        ) || [];
        
        // Check for orphaned theme files
        this.themeFiles.forEach(themeFile => {
            if (!packageThemeNames.includes(themeFile)) {
                this.warnings.push(`⚠ Orphaned theme file: ${themeFile}.json (not in package.json)`);
            }
        });

        // Get icon names from package.json
        const packageIconNames = this.packageJson?.contributes?.iconThemes?.map(i => 
            path.basename(i.path, '.json')
        ) || [];
        
        // Check for orphaned icon files
        this.iconFiles.forEach(iconFile => {
            const iconFileName = `${iconFile} icon-theme`;
            if (!packageIconNames.includes(iconFileName)) {
                this.warnings.push(`⚠ Orphaned icon file: ${iconFile} icon-theme.json (not in package.json)`);
            }
        });
    }

    validateConsistency() {
        console.log(`${colors.bold}${colors.blue}=== Validating Overall Consistency ===${colors.reset}`);
        
        // Compare package.json themes with JavaScript config
        const packageThemeLabels = this.packageJson?.contributes?.themes?.map(t => t.label) || [];
        const jsThemes = this.mainJs?.themes || [];
        
        const packageSet = new Set(packageThemeLabels);
        const jsSet = new Set(jsThemes);
        
        // Find themes in package.json but not in JS
        packageThemeLabels.forEach(theme => {
            if (!jsSet.has(theme)) {
                this.errors.push(`Theme "${theme}" in package.json but missing from JavaScript config`);
            }
        });
        
        // Find themes in JS but not in package.json
        jsThemes.forEach(theme => {
            if (!packageSet.has(theme)) {
                this.errors.push(`Theme "${theme}" in JavaScript config but missing from package.json`);
            }
        });
        
        if (packageSet.size === jsSet.size && packageThemeLabels.every(theme => jsSet.has(theme))) {
            this.successes.push("✓ Theme lists are consistent between package.json and JavaScript config");
        }
    }

    generateReport() {
        console.log(`\n${colors.bold}${colors.magenta}=== VALIDATION REPORT ===${colors.reset}`);
        
        console.log(`\n${colors.bold}${colors.green}SUCCESSES (${this.successes.length}):${colors.reset}`);
        this.successes.forEach(success => console.log(`  ${colors.green}${success}${colors.reset}`));
        
        console.log(`\n${colors.bold}${colors.yellow}WARNINGS (${this.warnings.length}):${colors.reset}`);
        this.warnings.forEach(warning => console.log(`  ${colors.yellow}${warning}${colors.reset}`));
        
        console.log(`\n${colors.bold}${colors.red}ERRORS (${this.errors.length}):${colors.reset}`);
        this.errors.forEach(error => console.log(`  ${colors.red}${error}${colors.reset}`));
        
        // Summary
        console.log(`\n${colors.bold}=== SUMMARY ===${colors.reset}`);
        console.log(`✅ Successes: ${colors.green}${this.successes.length}${colors.reset}`);
        console.log(`⚠️  Warnings: ${colors.yellow}${this.warnings.length}${colors.reset}`);
        console.log(`❌ Errors: ${colors.red}${this.errors.length}${colors.reset}`);
        
        if (this.errors.length === 0) {
            console.log(`\n${colors.bold}${colors.green}🎉 ALL VALIDATIONS PASSED! 🎉${colors.reset}`);
        } else {
            console.log(`\n${colors.bold}${colors.red}❌ VALIDATION FAILED - Please fix the errors above${colors.reset}`);
        }
        
        return this.errors.length === 0;
    }

    runAllValidations() {
        console.log(`${colors.bold}${colors.cyan}M Tech Themes - Mapping Validation Test${colors.reset}\n`);
        
        this.validatePackageJsonThemes();
        this.validatePackageJsonIcons();
        this.validateJavaScriptConfigs();
        this.validateThemeToIconMappings();
        this.validateOrphanedFiles();
        this.validateConsistency();
        
        return this.generateReport();
    }
}

// Run the validation
if (require.main === module) {
    const validator = new ThemeMappingValidator();
    const success = validator.runAllValidations();
    process.exit(success ? 0 : 1);
}

module.exports = ThemeMappingValidator; 