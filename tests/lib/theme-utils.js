/**
 * Theme Utilities - Theme Classification and Metadata
 * Provides theme type detection, categorization, and design intention identification
 */

/**
 * Light themes list (explicit + detected)
 */
const LIGHT_THEMES = [
    'Light',
    'Filter Sun',
    'Tokyo Day',
    'Enchanted Grove',
    'Arctic Nord Light',
    'Cosmic Void Light',
    'Feisty Fusion Light',
    'Cyberpunk Neon Light',
    'Neon Pink Light',
    'OGE Light'
];

/**
 * Minimalist themes with documented lower contrast philosophy
 * These themes intentionally use softer contrast for aesthetic
 */
const MINIMALIST_THEMES = [
    'Arctic Nord',
    'Arctic Nord Light',
    'Enchanted Grove',
    'Enchanted Grove Dark'
];

/**
 * Design-first themes deliberately prioritize aesthetics over strict contrast targets
 */
const DESIGN_PRIORITY_THEMES = [
    'Morning Coffee'
];

/**
 * Light themes with documented trade-offs
 * These accept slightly lower contrast due to mathematical opacity limitations
 */
const LIGHT_THEME_TRADEOFFS = [
    'Arctic Nord Light',
    'OGE Light',
    'Cosmic Void Light',
    'Enchanted Grove',
    'Feisty Fusion Light',
    'Neon Pink Light',
    'Sandstone Light',
    'Tokyo Day',
    'Filter Sun'
];

/**
 * Detect theme type from theme object or name
 * @param {Object|string} themeOrName - Theme object or theme name
 * @returns {'light'|'dark'} Theme type
 */
function getThemeType(themeOrName) {
    // If it's an object, check type property and name
    if (typeof themeOrName === 'object') {
        if (themeOrName.type === 'light') return 'light';
        if (themeOrName.type === 'dark') return 'dark';
        themeOrName = themeOrName.name || '';
    }
    
    const themeName = String(themeOrName);
    
    // Check explicit list first
    if (LIGHT_THEMES.includes(themeName)) return 'light';
    
    // Check name patterns
    if (themeName.includes('Light') || 
        themeName.includes('Sun') || 
        themeName.includes('Day')) {
        return 'light';
    }
    
    return 'dark';
}

/**
 * Check if theme is minimalist (intentionally softer contrast)
 * @param {string} themeName - Theme name
 * @returns {boolean}
 */
function isMinimalistTheme(themeName) {
    return MINIMALIST_THEMES.some(name => 
        themeName.toLowerCase().includes(name.toLowerCase())
    );
}

/**
 * Check if theme has documented light trade-offs
 * @param {string} themeName - Theme name
 * @returns {boolean}
 */
function hasLightTradeoff(themeName) {
    return LIGHT_THEME_TRADEOFFS.some(name => 
        themeName.toLowerCase().includes(name.toLowerCase())
    );
}

/**
 * Check if theme documents design-first compromises
 * @param {string} themeName
 * @returns {boolean}
 */
function hasDesignPriority(themeName) {
    return DESIGN_PRIORITY_THEMES.some(name => 
        themeName.toLowerCase().includes(name.toLowerCase())
    );
}

/**
 * Categorize themes into Light/Dark groups
 * @param {string[]} themes - Array of theme names
 * @returns {Object} Object with 'Light Themes' and 'Dark Themes' arrays
 */
function categorizeThemes(themes) {
    return {
        'Light Themes': themes.filter(theme => getThemeType(theme) === 'light'),
        'Dark Themes': themes.filter(theme => getThemeType(theme) === 'dark')
    };
}

/**
 * Get matching icon theme name for a color theme
 * @param {string} themeName - Color theme name
 * @param {boolean} isMonochrome - Whether monochrome variant requested
 * @param {string[]} availableIconThemes - Available icon theme names
 * @returns {string} Icon theme name
 */
function getMatchingIconTheme(themeName, isMonochrome = false, availableIconThemes = []) {
    const baseIconTheme = `${themeName} Icons`;
    const monochromeIconTheme = `${themeName} Monochrome Icons`;
    
    if (isMonochrome && availableIconThemes.includes(monochromeIconTheme)) {
        return monochromeIconTheme;
    }
    
    return availableIconThemes.includes(baseIconTheme) ? baseIconTheme : 'Classic Icons';
}

/**
 * Get recommended opacity values for theme type
 * @param {string} themeType - 'light' or 'dark'
 * @returns {Object} Opacity recommendations
 */
function getRecommendedOpacity(themeType) {
    if (themeType === 'light') {
        return {
            selection: 0.30,        // 30%
            diffLine: 0.25,         // 25%
            diffText: 0.35,         // 35%
            gutter: 0.40,           // 40%
            compounded: 0.48        // Combined selection + diff
        };
    }
    
    return {
        selection: 0.35,        // 35%
        diffLine: 0.30,         // 30%
        diffText: 0.40,         // 40%
        gutter: 0.50,           // 50%
        compounded: 0.55        // Combined selection + diff
    };
}

/**
 * Get WCAG contrast thresholds for theme
 * @param {string} themeName - Theme name
 * @param {string} elementType - Element type ('text', 'keyword', 'comment', 'ui')
 * @returns {number} Minimum contrast ratio
 */
function getContrastThreshold(themeName, elementType) {
    const isMinimalist = isMinimalistTheme(themeName);
    
    switch (elementType) {
        case 'comment':
            // Industry standard: 4.0-6.0:1 for de-emphasized text
            return isMinimalist ? 3.5 : 4.0;
        
        case 'keyword':
            // Minimalist themes can use 3.5:1 for keywords
            return isMinimalist ? 3.5 : 4.5;
        
        case 'text':
            // Normal text requires 4.5:1 (WCAG AA)
            return 4.5;
        
        case 'ui':
            // UI elements require 3:1 (WCAG AA)
            return 3.0;
        
        default:
            return 4.5;
    }
}

/**
 * Get design note for theme (explains special considerations)
 * @param {string} themeName - Theme name
 * @returns {string} Design note or empty string
 */
function getDesignNote(themeName) {
    if (hasDesignPriority(themeName)) {
        return 'Design-first aesthetic - intentional contrast compromise';
    }
    if (isMinimalistTheme(themeName)) {
        return 'Minimalist design - softer contrast is intentional';
    }
    
    if (hasLightTradeoff(themeName)) {
        return 'Light theme trade-off - documented design decision';
    }
    
    return '';
}

module.exports = {
    LIGHT_THEMES,
    MINIMALIST_THEMES,
    LIGHT_THEME_TRADEOFFS,
    DESIGN_PRIORITY_THEMES,
    getThemeType,
    isMinimalistTheme,
    hasLightTradeoff,
    hasDesignPriority,
    categorizeThemes,
    getMatchingIconTheme,
    getRecommendedOpacity,
    getContrastThreshold,
    getDesignNote
};
