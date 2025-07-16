#!/usr/bin/env node

/**
 * M Tech Themes - Command Functionality Test
 * 
 * This script simulates and validates the setThemeAndIcons command functionality
 */

const fs = require('fs');
const path = require('path');

// Load the actual THEME_CONFIG from the JavaScript files
function loadThemeConfig() {
    try {
        const content = fs.readFileSync('../js/main.js', 'utf8');
        const themeConfigMatch = content.match(/const THEME_CONFIG = ({[\s\S]*?});/);
        
        if (!themeConfigMatch) {
            throw new Error('Could not find THEME_CONFIG');
        }

        // Parse the extracted config
        const configString = themeConfigMatch[1]
            .replace(/(\w+):/g, '"$1":')  // Add quotes to keys
            .replace(/'/g, '"');          // Convert single quotes to double quotes
        
        return JSON.parse(configString);
    } catch (error) {
        console.error('Failed to load THEME_CONFIG:', error.message);
        return null;
    }
}

// Simulate the getMatchingIconTheme logic
function getMatchingIconTheme(themeName, isMonochrome = false, iconThemes) {
    const baseIconTheme = `${themeName} Icons`;
    const monochromeIconTheme = `${themeName} Monochrome Icons`;
    
    if (isMonochrome && iconThemes.includes(monochromeIconTheme)) {
        return monochromeIconTheme;
    }
    
    return iconThemes.includes(baseIconTheme) ? baseIconTheme : "Classic Icons";
}

// Simulate the getThemeCategories logic
function getThemeCategories(themes) {
    const lightThemes = [
        "Light", "Filter Sun", "Tokyo Day", "Enchanted Grove",
        "Arctic Nord Light", "Cosmic Void Light",
        "Feisty Fusion Light", "Cyberpunk Neon Light"
    ];
    
    return {
        "Light Themes": themes.filter(theme => 
            lightThemes.includes(theme) ||
            theme.includes("Light") || 
            theme.includes("Sun") || 
            theme.includes("Day") ||
            theme === "Enchanted Grove"
        ),
        "Dark Themes": themes.filter(theme => 
            !lightThemes.includes(theme) &&
            !theme.includes("Light") && 
            !theme.includes("Sun") && 
            !theme.includes("Day") &&
            theme !== "Enchanted Grove"
        )
    };
}

// Simulate the setThemeAndIcons command functionality
function simulateSetThemeAndIcons(themeName, config) {
    console.log(`\n🔧 Simulating setThemeAndIcons for: "${themeName}"`);
    
    const iconTheme = getMatchingIconTheme(themeName, false, config.iconThemes);
    const monochromeIconTheme = getMatchingIconTheme(themeName, true, config.iconThemes);
    
    console.log(`   Color Theme: ${themeName}`);
    console.log(`   Icon Theme: ${iconTheme}`);
    console.log(`   Monochrome Option: ${monochromeIconTheme}`);
    
    // Check if icon theme exists in package.json
    const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
    const iconThemeExists = packageJson.contributes.iconThemes.some(icon => icon.label === iconTheme);
    
    console.log(`   Icon Theme File: ${iconThemeExists ? '✅ Exists' : '❌ Missing'}`);
    
    if (!iconThemeExists && iconTheme !== "Classic Icons") {
        console.log(`   ⚠️  Will fallback to Classic Icons`);
    }
    
    return {
        themeName,
        iconTheme,
        monochromeIconTheme,
        iconThemeExists
    };
}

// Main test function
function runTests() {
    console.log('🧪 M Tech Themes - Command Functionality Test\n');
    
    const config = loadThemeConfig();
    if (!config) {
        console.error('❌ Failed to load theme configuration');
        return false;
    }
    
    console.log(`📊 Found ${config.themes.length} themes and ${config.iconThemes.length} icon themes`);
    
    // Test theme categorization
    console.log('\n📂 Theme Categories:');
    const categories = getThemeCategories(config.themes);
    Object.entries(categories).forEach(([category, themes]) => {
        console.log(`   ${category}: ${themes.length} themes`);
        themes.forEach(theme => console.log(`     - ${theme}`));
    });
    
    // Test specific scenarios
    console.log('\n🔍 Testing Specific Scenarios:');
    
    const testScenarios = [
        'OGE Dark',
        'OGE Light', 
        'Classic',
        'Tokyo Night',
        'Cyberpunk Neon Light',
        'Filter Spectrum'
    ];
    
    const results = [];
    testScenarios.forEach(theme => {
        const result = simulateSetThemeAndIcons(theme, config);
        results.push(result);
    });
    
    // Test for potential issues
    console.log('\n⚠️  Potential Issues:');
    let issueCount = 0;
    
    config.themes.forEach(theme => {
        const expectedIcon = `${theme} Icons`;
        if (!config.iconThemes.includes(expectedIcon) && theme !== 'Classic') {
            console.log(`   Missing icon theme: ${expectedIcon} for theme "${theme}"`);
            issueCount++;
        }
    });
    
    if (issueCount === 0) {
        console.log('   ✅ No major issues found');
    }
    
    // Summary
    console.log('\n📈 Summary:');
    console.log(`   Total themes: ${config.themes.length}`);
    console.log(`   Total icon themes: ${config.iconThemes.length}`);
    console.log(`   Perfect mappings: ${config.themes.filter(theme => 
        config.iconThemes.includes(`${theme} Icons`)
    ).length}`);
    console.log(`   Missing mappings: ${issueCount}`);
    
    return issueCount === 0;
}

// Test the command structure validation
function validateCommandStructure() {
    console.log('\n🔧 Validating Command Structure:');
    
    const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
    const commands = packageJson.contributes.commands;
    
    const expectedCommands = [
        'tech_pro.select_theme',
        'tech_pro.activate_icons', 
        'tech_pro.set_theme_and_icons'
    ];
    
    expectedCommands.forEach(cmdId => {
        const found = commands.find(cmd => cmd.command === cmdId);
        if (found) {
            console.log(`   ✅ ${cmdId}: "${found.title}"`);
        } else {
            console.log(`   ❌ Missing command: ${cmdId}`);
        }
    });
}

// Run all tests
if (require.main === module) {
    const success = runTests();
    validateCommandStructure();
    
    console.log('\n' + '='.repeat(50));
    if (success) {
        console.log('🎉 All functionality tests passed!');
    } else {
        console.log('⚠️  Some issues were found - see details above');
    }
    
    process.exit(success ? 0 : 1);
} 