/**
 * Contrast Utilities - WCAG Color Contrast Calculations
 * Shared utilities for accessibility validation across all theme analysis
 */

/**
 * Convert hex color to RGB components
 * @param {string} hex - Hex color (#RRGGBB or #RRGGBBAA)
 * @returns {{r: number, g: number, b: number, a: number}} RGB values (0-255) and alpha (0-1)
 */
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1.0;
    
    return { r, g, b, a };
}

/**
 * Calculate relative luminance per WCAG 2.1
 * @param {number} r - Red component (0-255)
 * @param {number} g - Green component (0-255)
 * @param {number} b - Blue component (0-255)
 * @returns {number} Relative luminance (0-1)
 */
function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Blend foreground color with alpha onto background
 * @param {{r: number, g: number, b: number, a: number}} foreground
 * @param {{r: number, g: number, b: number}} background
 * @returns {{r: number, g: number, b: number}} Blended color
 */
function blendColors(foreground, background) {
    const alpha = foreground.a;
    
    return {
        r: Math.round(foreground.r * alpha + background.r * (1 - alpha)),
        g: Math.round(foreground.g * alpha + background.g * (1 - alpha)),
        b: Math.round(foreground.b * alpha + background.b * (1 - alpha))
    };
}

/**
 * Calculate WCAG 2.1 contrast ratio between two colors
 * @param {{r: number, g: number, b: number}} color1
 * @param {{r: number, g: number, b: number}} color2
 * @returns {number} Contrast ratio (1-21)
 */
function calculateContrast(color1, color2) {
    const l1 = getLuminance(color1.r, color1.g, color1.b);
    const l2 = getLuminance(color2.r, color2.g, color2.b);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Analyze contrast with WCAG pass/fail thresholds
 * @param {string} foregroundHex - Foreground color
 * @param {string} backgroundHex - Background color
 * @param {boolean} hasAlpha - Whether to apply alpha blending
 * @returns {{contrast: number, passes45: boolean, passes3: boolean, opacity: number}}
 */
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

/**
 * Get contrast grade (A+ to F)
 * @param {number} contrast - Contrast ratio
 * @param {boolean} isText - Whether this is text (requires 4.5:1) or UI (requires 3:1)
 * @returns {string} Grade letter
 */
function getContrastGrade(contrast, isText = true) {
    const threshold = isText ? 4.5 : 3.0;
    const excellent = isText ? 7.0 : 4.5;
    
    if (contrast >= excellent) return 'A+';
    if (contrast >= threshold + 1) return 'A';
    if (contrast >= threshold) return 'B';
    if (contrast >= threshold - 0.5) return 'C';
    if (contrast >= threshold - 1.0) return 'D';
    return 'F';
}

module.exports = {
    hexToRgb,
    getLuminance,
    blendColors,
    calculateContrast,
    analyzeContrast,
    getContrastGrade
};
