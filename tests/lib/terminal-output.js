/**
 * Terminal Output - Consistent Formatted Output
 * Provides consistent printing functions with severity indicators and formatting
 */

const colors = require('./terminal-colors');

/**
 * Print a fancy header box
 * @param {string} title - Header title
 * @param {number} width - Box width (default: 60)
 */
function printHeader(title, width = 60) {
    const padding = Math.max(0, Math.floor((width - title.length - 2) / 2));
    const paddedTitle = ' '.repeat(padding) + title + ' '.repeat(padding);
    
    console.log(`\n${colors.bold}${colors.cyan}╔${'═'.repeat(width)}╗${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}║${paddedTitle.padEnd(width)}║${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}╚${'═'.repeat(width)}╝${colors.reset}\n`);
}

/**
 * Print a section header
 * @param {string} name - Section name
 * @param {string} icon - Optional emoji icon
 */
function printSection(name, icon = '') {
    const prefix = icon ? `${icon}  ` : '';
    console.log(`\n${colors.bold}${prefix}${name}${colors.reset}`);
    console.log('─'.repeat(60));
}

/**
 * Print a subsection header
 * @param {string} name - Subsection name
 */
function printSubsection(name) {
    console.log(`\n${colors.bold}${colors.blue}${name}:${colors.reset}`);
}

/**
 * Print success message
 * @param {string} message - Success message
 * @param {string} detail - Optional detail text
 */
function printSuccess(message, detail = '') {
    const detailText = detail ? ` ${colors.dim}${detail}${colors.reset}` : '';
    console.log(`  ${colors.green}✓${colors.reset} ${message}${detailText}`);
}

/**
 * Print warning message with actionable guidance
 * @param {string} message - Warning message
 * @param {string} fix - Optional fix suggestion
 */
function printWarning(message, fix = '') {
    console.log(`  ${colors.yellow}⚠️ ${colors.reset}${message}`);
    if (fix) {
        console.log(`     ${colors.dim}→ FIX: ${fix}${colors.reset}`);
    }
}

/**
 * Print error message with actionable guidance
 * @param {string} message - Error message
 * @param {string} fix - Optional fix suggestion
 */
function printError(message, fix = '') {
    console.log(`  ${colors.red}❌${colors.reset} ${message}`);
    if (fix) {
        console.log(`     ${colors.dim}→ FIX: ${fix}${colors.reset}`);
    }
}

/**
 * Print info message (not a problem, just informational)
 * @param {string} message - Info message
 */
function printInfo(message) {
    console.log(`  ${colors.blue}ℹ️ ${colors.reset} ${colors.dim}${message}${colors.reset}`);
}

/**
 * Print critical issue (requires immediate attention)
 * @param {string} message - Critical message
 * @param {string} fix - Fix suggestion
 */
function printCritical(message, fix = '') {
    console.log(`  ${colors.brightRed}${colors.bold}🚨 CRITICAL:${colors.reset} ${message}`);
    if (fix) {
        console.log(`     ${colors.brightYellow}→ ACTION REQUIRED: ${fix}${colors.reset}`);
    }
}

/**
 * Print progress bar
 * @param {number} current - Current value
 * @param {number} total - Total value
 * @param {number} barLength - Bar length in characters (default: 40)
 * @returns {string} Progress percentage
 */
function printProgressBar(current, total, barLength = 40) {
    const progress = Math.round((current / total) * 100);
    const filled = Math.round((current / total) * barLength);
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
    
    console.log(`  Progress: [${colors.green}${bar}${colors.reset}] ${progress}%`);
    return `${progress}%`;
}

/**
 * Print summary stats box
 * @param {Object} stats - Statistics object
 */
function printStats(stats) {
    console.log(`\n${colors.bold}Statistics:${colors.reset}`);
    Object.entries(stats).forEach(([key, value]) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        
        // Color code based on key name
        let color = colors.white;
        if (key.includes('error') || key.includes('critical') || key.includes('fail')) {
            color = colors.red;
        } else if (key.includes('warning') || key.includes('high')) {
            color = colors.yellow;
        } else if (key.includes('success') || key.includes('pass')) {
            color = colors.green;
        }
        
        console.log(`  ${label}: ${color}${value}${colors.reset}`);
    });
}

/**
 * Print execution time
 * @param {number} startTime - Start time in milliseconds (Date.now())
 * @param {string} label - Optional label (default: "Execution time")
 */
function printTiming(startTime, label = 'Execution time') {
    const elapsed = Date.now() - startTime;
    const seconds = (elapsed / 1000).toFixed(2);
    console.log(`\n${colors.dim}${label}: ${seconds}s${colors.reset}`);
}

/**
 * Print themed issue with context
 * @param {Object} issue - Issue object with severity, category, message, etc.
 */
function printIssue(issue) {
    const { severity, category, message, color, contrast, required, fix } = issue;
    
    // Determine icon and color by severity
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
    
    console.log(`  ${icon} ${severityColor}${severity.toUpperCase()}${colors.reset}: ${message}`);
    
    // Print details
    if (category) console.log(`     ${colors.dim}Category: ${category}${colors.reset}`);
    if (color) console.log(`     ${colors.dim}Color: ${color}${colors.reset}`);
    if (contrast && required) {
        console.log(`     ${colors.dim}Contrast: ${contrast} (requires ${required})${colors.reset}`);
    }
    
    // Print fix suggestion
    if (fix) {
        console.log(`     ${colors.brightYellow}→ FIX: ${fix}${colors.reset}`);
    }
}

module.exports = {
    printHeader,
    printSection,
    printSubsection,
    printSuccess,
    printWarning,
    printError,
    printInfo,
    printCritical,
    printProgressBar,
    printStats,
    printTiming,
    printIssue
};
