#!/usr/bin/env node

/**
 * M Tech Themes - Mapping Validation Test (Optimized)
 * 
 * Validates:
 * 1. Theme-to-icon mappings work correctly  
 * 2. All themes in package.json exist as files
 * 3. All icon themes in package.json exist as files
 * 4. JavaScript theme lists match package.json
 * 5. Icon theme names are consistent across configurations
 * 6. Missing mappings and orphaned files
 */

const path = require('path');
const fs = require('fs');
const assert = require('node:assert/strict');
const { printHeader, printSection, printSuccess, printWarning, printError, printInfo, printStats, printTiming } = require('./lib/terminal-output');
const { loadPackageJson, loadBothConfigs, fileExists, getAllThemeNames, getAllIconThemeNames } = require('./lib/config-loader');
const { getMatchingIconTheme, getFallbackIconTheme } = require('../js/shared/themeConfig');
const colors = require('./lib/terminal-colors');

function validateIconResources(theme, owningPath, counts) {
    const definitions = theme.iconDefinitions;
    assert.ok(definitions && typeof definitions === 'object', `${owningPath}: missing iconDefinitions`);
    const checkResource = resource => {
        assert.ok(typeof resource === 'string' && resource.length > 0, `${owningPath}: empty resource path`);
        const resolved = path.resolve(path.dirname(owningPath), resource);
        assert.ok(fs.existsSync(resolved), `Missing resource: ${resolved}`);
        const stat = fs.statSync(resolved);
        assert.ok(stat.isFile() && stat.size > 0, `Empty or invalid resource: ${resolved}`);
    };
    const fonts = theme.fonts || [];
    const fontIds = new Set();
    for (const font of fonts) {
        assert.ok(font.id && !fontIds.has(font.id), `${owningPath}: invalid or duplicate font ID`);
        fontIds.add(font.id);
        assert.ok(Array.isArray(font.src) && font.src.length > 0, `${owningPath}: missing font sources`);
        for (const source of font.src) {
            checkResource(source.path);
            counts.fontSources++;
        }
    }
    for (const [id, definition] of Object.entries(definitions)) {
        if (definition.iconPath !== undefined) {
            checkResource(definition.iconPath);
            counts.images++;
        }
        if (definition.fontId !== undefined || definition.fontCharacter !== undefined) {
            assert.ok(fontIds.has(definition.fontId ?? fonts[0]?.id), `${owningPath}: invalid font reference in ${id}`);
        }
        if (definition.fontCharacter !== undefined) {
            assert.ok(typeof definition.fontCharacter === 'string' && definition.fontCharacter.length > 0,
                `${owningPath}: empty glyph in ${id}`);
            counts.glyphs++;
        }
    }
    const defaults = ['file', 'folder', 'folderExpanded', 'rootFolder', 'rootFolderExpanded'];
    const mappings = ['fileExtensions', 'fileNames', 'languageIds', 'folderNames',
        'folderNamesExpanded', 'rootFolderNames', 'rootFolderNamesExpanded'];
    const checkTarget = (target, location) => {
        assert.ok(typeof target === 'string' && Object.hasOwn(definitions, target),
            `${owningPath}: invalid association ${location} -> ${target}`);
        counts.associations++;
    };
    const visit = (associations, prefix = '') => {
        for (const key of defaults) {
            if (Object.hasOwn(associations, key)) checkTarget(associations[key], `${prefix}${key}`);
        }
        for (const key of mappings) {
            for (const [name, target] of Object.entries(associations[key] || {})) {
                checkTarget(target, `${prefix}${key}.${name}`);
            }
        }
        for (const variant of ['light', 'highContrast']) {
            if (associations[variant]) visit(associations[variant], `${prefix}${variant}.`);
        }
    };
    visit(theme);
}

class ThemeMappingValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.successes = [];
        
        // Load configuration files
        this.packageJson = loadPackageJson();
        const configs = loadBothConfigs();
        this.mainJs = configs.main;
        this.browserJs = configs.browser;
        
        // Extract themes and icons from files
        this.themeFiles = getAllThemeNames();
        this.iconFiles = getAllIconThemeNames();
    }

    validatePackageJsonThemes() {
        printSection('Validating Package.json Themes');
        
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
            if (!fileExists(themePath)) {
                printError(`Theme file missing: ${themePath} for "${themeLabel}"`, `Create themes/${expectedFile}.json`);
                this.errors.push(`Theme file missing: ${themePath}`);
            } else {
                if (process.argv.includes('--verbose')) {
                    printSuccess(`Theme file exists: ${themeLabel}`, themePath);
                }
                this.successes.push(`✓ Theme file exists: ${themeLabel} → ${themePath}`);
            }
        });
    }

    validatePackageJsonIcons() {
        printSection('Validating Package.json Icon Themes');
        
        if (!this.packageJson?.contributes?.iconThemes) {
            this.errors.push("No icon themes found in package.json");
            return;
        }

        const packageIcons = this.packageJson.contributes.iconThemes;
        const counts = { jsons: 0, images: 0, glyphs: 0, fontSources: 0, associations: 0 };
        
        packageIcons.forEach(icon => {
            const iconLabel = icon.label;
            const iconPath = icon.path;
            
            // Check if icon file exists
            if (!fileExists(iconPath)) {
                printError(`Icon file missing: ${iconPath} for "${iconLabel}"`, `Create icon-themes/${path.basename(iconPath)}`);
                this.errors.push(`Icon file missing: ${iconPath}`);
            } else {
                try {
                    const owningPath = path.resolve(__dirname, '..', iconPath);
                    const theme = JSON.parse(fs.readFileSync(owningPath, 'utf8'));
                    // Negative fixtures change only this parsed in-memory copy.
                    if (icon.id === 'OGE Icons') {
                        if (process.argv.includes('--negative-fixture=missing-resource')) {
                            theme.fonts[0].src[0].path = './missing-icon-repair-fixture.woff';
                        }
                        if (process.argv.includes('--negative-fixture=invalid-font')) {
                            theme.iconDefinitions._file_dark.fontId = 'missing-font';
                        }
                        if (process.argv.includes('--negative-fixture=invalid-association')) {
                            theme.highContrast = { light: { file: '_missing_icon' } };
                        }
                    }
                    validateIconResources(theme, owningPath, counts);
                    counts.jsons++;
                } catch (error) {
                    printError(error.message);
                    this.errors.push(error.message);
                }
                if (process.argv.includes('--verbose')) {
                    printSuccess(`Icon file exists: ${iconLabel}`, iconPath);
                }
                this.successes.push(`✓ Icon file exists: ${iconLabel} → ${iconPath}`);
            }
        });
        printInfo(`Icon resources: ${counts.jsons} JSONs, ${counts.glyphs} glyphs, ${counts.fontSources} font sources, ${counts.images} images, ${counts.associations} association references`);
    }

    validateJavaScriptConfigs() {
        printSection('Validating JavaScript Configs');
        
        if (!this.mainJs || !this.browserJs) {
            printError("Failed to load JavaScript configuration files", "Check js/main.js and js/browser.js for syntax errors");
            this.errors.push("Failed to load JavaScript configuration files");
            return;
        }

        // Check if main.js and browser.js have identical configs
        // Create copies to sort since the arrays are frozen
        const mainThemes = JSON.stringify([...this.mainJs.themes].sort());
        const browserThemes = JSON.stringify([...this.browserJs.themes].sort());
        const mainIcons = JSON.stringify([...this.mainJs.iconThemes].sort());
        const browserIcons = JSON.stringify([...this.browserJs.iconThemes].sort());

        if (mainThemes !== browserThemes) {
            printError("Theme lists differ between main.js and browser.js", "Sync THEME_CONFIG.themes array in both files");
            this.errors.push("Theme lists differ between main.js and browser.js");
            console.log(`  ${colors.dim}Main.js themes: ${this.mainJs.themes?.length || 0} items${colors.reset}`);
            console.log(`  ${colors.dim}Browser.js themes: ${this.browserJs.themes?.length || 0} items${colors.reset}`);
        } else {
            printSuccess("Theme lists identical in main.js and browser.js");
            this.successes.push("✓ Theme lists identical in main.js and browser.js");
        }

        if (mainIcons !== browserIcons) {
            printError("Icon theme lists differ between main.js and browser.js", "Sync THEME_CONFIG.iconThemes array in both files");
            this.errors.push("Icon theme lists differ between main.js and browser.js");
        } else {
            printSuccess("Icon theme lists identical in main.js and browser.js");
            this.successes.push("✓ Icon theme lists identical in main.js and browser.js");
        }
    }

    validateThemeToIconMappings() {
        printSection('Validating Theme-to-Icon Mappings');
        
        if (!this.mainJs?.themes || !this.mainJs?.iconThemes) {
            printError("Missing theme or icon configuration", "Check THEME_CONFIG in js/main.js");
            this.errors.push("Missing theme or icon configuration in JavaScript files");
            return;
        }

        const themes = this.mainJs.themes;
        const iconThemes = this.mainJs.iconThemes;
        
        console.log(`${colors.dim}Testing ${themes.length} themes for icon mappings...${colors.reset}`);
        
        themes.forEach(themeName => {
            const expectedNormalIcon = `${themeName} Icons`;
            const expectedMonochromeIcon = `${themeName} Monochrome Icons`;
            
            // Check if expected icon exists
            if (iconThemes.includes(expectedNormalIcon)) {
                if (process.argv.includes('--verbose')) {
                    printSuccess(`${themeName} → ${expectedNormalIcon}`);
                }
                this.successes.push(`✓ ${themeName} → ${expectedNormalIcon}`);
            } else {
                const fallbackIcon = getMatchingIconTheme(themeName, { preferMonochrome: false });
                printWarning(`${themeName} → fallback to ${fallbackIcon}`, null);
                this.warnings.push(`⚠ ${themeName} → fallback to ${fallbackIcon} (expected: ${expectedNormalIcon})`);
            }
            
            // Check monochrome mapping (optional feature, so use INFO not WARNING)
            if (!iconThemes.includes(expectedMonochromeIcon)) {
                printInfo(`${themeName} → no monochrome icons (optional feature)`);
                this.warnings.push(`⚠ ${themeName} → no monochrome variant (${expectedMonochromeIcon})`);
            }
            try {
                assert.equal(getMatchingIconTheme(themeName), expectedNormalIcon);
                assert.equal(getMatchingIconTheme(themeName, { preferMonochrome: true }),
                    iconThemes.includes(expectedMonochromeIcon) ? expectedMonochromeIcon : expectedNormalIcon);
            } catch (error) {
                printError(error.message);
                this.errors.push(error.message);
            }
        });
    }

    validateOrphanedFiles() {
        printSection('Checking for Orphaned Files');
        
        // Get theme names from package.json
        const packageThemeNames = this.packageJson?.contributes?.themes?.map(t => 
            path.basename(t.path, '.json')
        ) || [];
        
        // Check for orphaned theme files
        const orphanedThemes = this.themeFiles.filter(file => !packageThemeNames.includes(file));
        
        if (orphanedThemes.length > 0) {
            orphanedThemes.forEach(themeFile => {
                printWarning(`Orphaned theme file: ${themeFile}.json`, `Add to package.json contributes.themes`);
                this.warnings.push(`⚠ Orphaned theme file: ${themeFile}.json (not in package.json)`);
            });
        } else {
            printSuccess("No orphaned theme files");
        }

        // Get icon names from package.json
        const packageIconNames = this.packageJson?.contributes?.iconThemes?.map(i => 
            path.basename(i.path, '.json')
        ) || [];
        
        // Check for orphaned icon files
        const orphanedIcons = this.iconFiles.filter(file => {
            const iconFileName = `${file} icon-theme`;
            return !packageIconNames.includes(iconFileName);
        });
        
        if (orphanedIcons.length > 0) {
            orphanedIcons.forEach(iconFile => {
                printWarning(`Orphaned icon file: ${iconFile} icon-theme.json`, `Add to package.json contributes.iconThemes`);
                this.warnings.push(`⚠ Orphaned icon file: ${iconFile} icon-theme.json (not in package.json)`);
            });
        } else {
            printSuccess("No orphaned icon files");
        }
    }

    validateConsistency() {
        printSection('Validating Overall Consistency');
        
        // Compare package.json themes with JavaScript config
        const packageThemeLabels = this.packageJson?.contributes?.themes?.map(t => t.label) || [];
        const jsThemes = this.mainJs?.themes || [];
        try {
            const registeredIcons = this.packageJson.contributes.iconThemes.map(icon => icon.id);
            assert.deepEqual([...registeredIcons].sort(), [...this.mainJs.iconThemes].sort());
            assert.equal(new Set(registeredIcons).size, registeredIcons.length, 'Duplicate icon registrations');
            for (const preferMonochrome of [false, true]) {
                assert.ok(registeredIcons.includes(getFallbackIconTheme({ preferMonochrome })),
                    'Fallback icon theme must be registered');
            }
        } catch (error) {
            printError(error.message);
            this.errors.push(error.message);
        }
        
        const packageSet = new Set(packageThemeLabels);
        const jsSet = new Set(jsThemes);
        
        // Find themes in package.json but not in JS
        packageThemeLabels.forEach(theme => {
            if (!jsSet.has(theme)) {
                printError(`Theme "${theme}" in package.json but missing from JavaScript`, `Add "${theme}" to THEME_CONFIG.themes in js/main.js and js/browser.js`);
                this.errors.push(`Theme "${theme}" in package.json but missing from JavaScript config`);
            }
        });
        
        // Find themes in JS but not in package.json
        jsThemes.forEach(theme => {
            if (!packageSet.has(theme)) {
                printError(`Theme "${theme}" in JavaScript but missing from package.json`, `Add theme entry to package.json contributes.themes`);
                this.errors.push(`Theme "${theme}" in JavaScript config but missing from package.json`);
            }
        });
        
        if (packageSet.size === jsSet.size && packageThemeLabels.every(theme => jsSet.has(theme))) {
            printSuccess("Theme lists are consistent between package.json and JavaScript config");
            this.successes.push("✓ Theme lists are consistent between package.json and JavaScript config");
        }
    }

    generateReport() {
        console.log(`\n${colors.bold}${colors.magenta}═══ VALIDATION REPORT ═══${colors.reset}\n`);
        
        printStats({
            successes: this.successes.length,
            warnings: this.warnings.length,
            errors: this.errors.length
        });
        
        if (this.errors.length === 0) {
            console.log(`\n${colors.bold}${colors.green}🎉 ALL VALIDATIONS PASSED! 🎉${colors.reset}\n`);
        } else {
            console.log(`\n${colors.bold}${colors.red}❌ VALIDATION FAILED - Please fix the errors above${colors.reset}\n`);
        }
        
        return this.errors.length === 0;
    }

    runAllValidations() {
        const startTime = Date.now();
        
        printHeader('M TECH THEMES - MAPPING VALIDATION TEST');
        
        this.validatePackageJsonThemes();
        this.validatePackageJsonIcons();
        this.validateJavaScriptConfigs();
        this.validateThemeToIconMappings();
        this.validateOrphanedFiles();
        this.validateConsistency();
        
        const success = this.generateReport();
        
        printTiming(startTime, 'Validation completed in');
        
        return success;
    }
}

// Run the validation
if (require.main === module) {
    const validator = new ThemeMappingValidator();
    const success = validator.runAllValidations();
    process.exit(success ? 0 : 1);
}

module.exports = ThemeMappingValidator;
