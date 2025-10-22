/**
 * Config Loader - Centralized Configuration Loading
 * Loads package.json, JavaScript configs, and theme files with consistent error handling
 */

const fs = require('fs');
const path = require('path');

/**
 * Load and parse package.json
 * @returns {Object|null} Parsed package.json or null on error
 */
function loadPackageJson() {
    try {
        const packagePath = path.join(__dirname, '..', '..', 'package.json');
        return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    } catch (error) {
        console.error(`Failed to load package.json: ${error.message}`);
        return null;
    }
}

/**
 * Load and parse THEME_CONFIG from JavaScript files
 * @param {string} jsFile - Filename ('main.js' or 'browser.js')
 * @returns {Object|null} Parsed THEME_CONFIG or null on error
 */
function loadThemeConfig(jsFile = 'main.js') {
    try {
        const jsPath = path.join(__dirname, '..', '..', 'js', jsFile);
        const content = fs.readFileSync(jsPath, 'utf8');
        
        // Extract THEME_CONFIG using regex
        const themeConfigMatch = content.match(/const THEME_CONFIG\s*=\s*({[\s\S]*?});/);
        if (!themeConfigMatch) {
            throw new Error(`Could not find THEME_CONFIG in ${jsFile}`);
        }

        // Parse the extracted config
        // Convert JavaScript object literal to JSON-compatible format
        const configString = themeConfigMatch[1]
            .replace(/(\w+):/g, '"$1":')     // Add quotes to keys
            .replace(/'/g, '"')              // Convert single quotes to double
            .replace(/,(\s*[}\]])/g, '$1');  // Remove trailing commas
        
        return JSON.parse(configString);
    } catch (error) {
        console.error(`Failed to load THEME_CONFIG from ${jsFile}: ${error.message}`);
        return null;
    }
}

/**
 * Load both main.js and browser.js configs for comparison
 * @returns {{main: Object|null, browser: Object|null}}
 */
function loadBothConfigs() {
    return {
        main: loadThemeConfig('main.js'),
        browser: loadThemeConfig('browser.js')
    };
}

/**
 * Load a theme JSON file
 * @param {string} themeName - Theme name (without .json extension)
 * @returns {Object|null} Parsed theme or null on error
 */
function loadThemeFile(themeName) {
    try {
        const themePath = path.join(__dirname, '..', '..', 'themes', `${themeName}.json`);
        
        if (!fs.existsSync(themePath)) {
            return null;
        }
        
        return JSON.parse(fs.readFileSync(themePath, 'utf8'));
    } catch (error) {
        console.error(`Failed to load theme ${themeName}: ${error.message}`);
        return null;
    }
}

/**
 * Load analysis markdown document
 * @param {string} filename - Markdown filename (e.g., 'THEME_IMPROVEMENTS_ANALYSIS.md')
 * @returns {string} Document content or empty string on error
 */
function loadAnalysisDoc(filename) {
    try {
        const docPath = path.join(__dirname, '..', '..', filename);
        
        if (!fs.existsSync(docPath)) {
            console.warn(`Warning: ${filename} not found`);
            return '';
        }
        
        return fs.readFileSync(docPath, 'utf8');
    } catch (error) {
        console.error(`Failed to load ${filename}: ${error.message}`);
        return '';
    }
}

/**
 * Get all theme names from themes directory
 * @returns {string[]} Array of theme names (without .json extension)
 */
function getAllThemeNames() {
    try {
        const themesDir = path.join(__dirname, '..', '..', 'themes');
        return fs.readdirSync(themesDir)
            .filter(file => file.endsWith('.json'))
            .map(file => path.basename(file, '.json'))
            .sort();
    } catch (error) {
        console.error(`Failed to read themes directory: ${error.message}`);
        return [];
    }
}

/**
 * Get all icon theme names from icon-themes directory
 * @returns {string[]} Array of icon theme names (without ' icon-theme.json')
 */
function getAllIconThemeNames() {
    try {
        const iconDir = path.join(__dirname, '..', '..', 'icon-themes');
        return fs.readdirSync(iconDir)
            .filter(file => file.endsWith('.json'))
            .map(file => path.basename(file, '.json').replace(' icon-theme', ''))
            .sort();
    } catch (error) {
        console.error(`Failed to read icon-themes directory: ${error.message}`);
        return [];
    }
}

/**
 * Check if a file exists
 * @param {string} relativePath - Path relative to project root
 * @returns {boolean}
 */
function fileExists(relativePath) {
    const fullPath = path.join(__dirname, '..', '..', relativePath);
    return fs.existsSync(fullPath);
}

module.exports = {
    loadPackageJson,
    loadThemeConfig,
    loadBothConfigs,
    loadThemeFile,
    loadAnalysisDoc,
    getAllThemeNames,
    getAllIconThemeNames,
    fileExists
};
