#!/usr/bin/env node

/**
 * M Tech Themes - Command Functionality Test
 * 
 * This script simulates and validates the setThemeAndIcons command functionality
 */

const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const sharedConfig = require('../js/shared/themeConfig');
const { getMatchingIconTheme, getFallbackIconTheme, getThemeCategories } = sharedConfig;
const packageJson = require('../package.json');

// Load the actual THEME_CONFIG from the shared module
function loadThemeConfig() {
    try {
        const sharedConfig = require('../js/shared/themeConfig');
        return sharedConfig.THEME_CONFIG;
    } catch (error) {
        console.error('Failed to load THEME_CONFIG:', error.message);
        return null;
    }
}

// Simulate the setThemeAndIcons command functionality
function simulateSetThemeAndIcons(themeName) {
    console.log(`\n🔧 Simulating setThemeAndIcons for: "${themeName}"`);
    
    const iconTheme = getMatchingIconTheme(themeName, { preferMonochrome: false });
    const monochromeIconTheme = getMatchingIconTheme(themeName, { preferMonochrome: true });
    
    console.log(`   Color Theme: ${themeName}`);
    console.log(`   Icon Theme: ${iconTheme}`);
    console.log(`   Monochrome Option: ${monochromeIconTheme}`);
    
    // Check if icon theme exists in package.json
    const iconThemeExists = packageJson.contributes.iconThemes.some(icon => icon.id === iconTheme);
    
    console.log(`   Icon Theme File: ${iconThemeExists ? '✅ Exists' : '❌ Missing'}`);
    
    assert.ok(iconThemeExists, `Unregistered icon theme: ${iconTheme}`);
    
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
    const categories = getThemeCategories();
    Object.entries(categories).forEach(([category, themes]) => {
        console.log(`   ${category}: ${themes.length} themes`);
        themes.forEach(theme => console.log(`     - ${theme}`));
    });
    
    // Test specific scenarios
    console.log('\n🔍 Testing Specific Scenarios:');
    
    const testScenarios = [
        { theme: "OGE Dark", expected: "OGE Dark Icons" },
        { theme: "OGE Light", expected: "OGE Light Icons" },
        { theme: "Obsidian Moss", expected: "Obsidian Moss Icons" },
        { theme: "Tokyo Night", expected: "Tokyo Night Icons" },
        { theme: "Cyberpunk Neon", expected: "Cyberpunk Neon Icons" },
        { theme: "Chroma Void", expected: "Chroma Void Icons" }
    ];
    if (process.argv.includes('--negative-fixture=wrong-expected')) {
        testScenarios[0].expected = 'Incorrect Icons';
    }
    const results = [];
    testScenarios.forEach(scenario => {
        const result = simulateSetThemeAndIcons(scenario.theme);
        assert.equal(result.iconTheme, scenario.expected);
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
        assert.ok(found, `Missing command: ${cmdId}`);
    });
}

function validateResolvers() {
    const { themes, iconThemes } = sharedConfig.THEME_CONFIG;
    const registered = new Set(packageJson.contributes.iconThemes.map(icon => icon.id));
    if (process.argv.includes('--negative-fixture=unregistered-fallback')) {
        registered.delete('Obsidian Moss Icons');
    }
    const normalOnly = ['America250 Dark', 'America250 Light', 'Hurricanes Dark', 'Hurricanes Light'];
    assert.equal(themes.length, 31);
    assert.deepEqual(themes.filter(theme => !registered.has(`${theme} Monochrome Icons`)), normalOnly);

    for (const preferMonochrome of [false, true]) {
        const options = { preferMonochrome };
        const fallback = preferMonochrome ? 'Obsidian Moss Monochrome Icons' : 'Obsidian Moss Icons';
        assert.equal(getFallbackIconTheme(options), fallback);
        assert.ok(registered.has(getFallbackIconTheme(options)), `Unregistered fallback: ${fallback}`);
        for (const theme of themes) {
            const expected = preferMonochrome && !normalOnly.includes(theme)
                ? `${theme} Monochrome Icons` : `${theme} Icons`;
            assert.equal(getMatchingIconTheme(theme, options), expected);
        }
        for (const theme of ['Unknown Theme', undefined]) {
            assert.equal(getMatchingIconTheme(theme, options), fallback);
        }
        assert.equal(getMatchingIconTheme('OGE', options), 'OGE Icons');
        assert.equal(getMatchingIconTheme('Light', options),
            preferMonochrome ? 'Light Monochrome Icons' : 'Light Icons');
    }
    assert.equal(registered.size, iconThemes.length, 'Icon registration count');
    assert.deepEqual([...iconThemes].sort(), [...registered].sort());
    assert.equal(getFallbackIconTheme(), 'Obsidian Moss Icons');
    console.log('\n✅ Production resolvers: 31 themes × 2 preferences, 4 normal-only, fallbacks and legacy names');
}

async function validateHostCommands() {
    let cases = 0;
    for (const host of ['main.js', 'browser.js']) {
        const filename = path.join(__dirname, '..', 'js', host);
        const source = fs.readFileSync(filename, 'utf8');
        for (const theme of ['Default Dark Modern', 'OGE', 'Light', undefined, ...sharedConfig.THEME_CONFIG.themes]) {
            for (const preferMonochrome of [false, true]) {
                const writes = [];
                const storageWrites = [];
                const errors = [];
                const handlers = new Map();
                const listeners = [];
                const settings = {
                    workbench: { colorTheme: theme, iconTheme: 'external-icons' },
                    techThemes: { fileIconsMonochrome: !preferMonochrome }
                };
                const disposable = { dispose() {} };
                const vscode = {
                    ConfigurationTarget: { Global: 1 },
                    StatusBarAlignment: { Left: 1 },
                    workspace: {
                        getConfiguration: section => ({
                            get: (key, fallback) => settings[section][key] ?? fallback,
                            update: async (key, value, target) => {
                                writes.push({ section, key, value, target });
                                settings[section][key] = value;
                            }
                        }),
                        onDidChangeConfiguration: listener => {
                            listeners.push(listener);
                            return disposable;
                        }
                    },
                    commands: {
                        registerCommand: (id, handler) => {
                            handlers.set(id, handler);
                            return disposable;
                        }
                    },
                    window: {
                        createStatusBarItem: () => ({ show() {}, hide() {}, dispose() {} }),
                        setStatusBarMessage() {},
                        showErrorMessage: message => errors.push(message)
                    }
                };
                const exports = {};
                vm.runInNewContext(source, {
                    exports,
                    require: id => {
                        if (id === 'vscode') return vscode;
                        if (id === './shared/themeConfig') return sharedConfig;
                        throw new Error(`Unexpected host dependency: ${id}`);
                    }
                }, { filename });
                const state = { update: (...args) => storageWrites.push(args) };
                exports.activate({ subscriptions: [], globalState: state, workspaceState: state });
                assert.equal(listeners.length, 1);
                assert.deepEqual(writes, [], `${host}: activation must not write`);

                const fire = async key => {
                    for (const listener of listeners) {
                        await listener({ affectsConfiguration: name => name === key });
                    }
                    // The host listener does not return its asynchronous applyTheme promise.
                    await new Promise(resolve => setImmediate(resolve));
                };
                settings.techThemes.fileIconsMonochrome = preferMonochrome;
                await fire('techThemes');
                if (!sharedConfig.isTechThemeName(theme)) {
                    settings.workbench.colorTheme = 'Another External Theme';
                    await fire('workbench.colorTheme');
                    settings.workbench.colorTheme = theme;
                    await fire('workbench.colorTheme');
                    await fire('workbench.iconTheme');
                }
                assert.deepEqual(writes, [], `${host}: automatic events must not write`);
                assert.deepEqual(storageWrites, []);
                const activateIcons = handlers.get('tech_pro.activate_icons');
                assert.equal(typeof activateIcons, 'function');
                await activateIcons();
                const expected = sharedConfig.isTechThemeName(theme)
                    ? getMatchingIconTheme(theme, { preferMonochrome })
                    : getFallbackIconTheme({ preferMonochrome });
                assert.deepEqual(writes, [{
                    section: 'workbench', key: 'iconTheme', value: expected, target: 1
                }], `${host}: ${theme}, monochrome=${preferMonochrome}`);
                assert.equal(settings.workbench.colorTheme, theme);
                assert.equal(settings.techThemes.fileIconsMonochrome, preferMonochrome);
                assert.deepEqual(storageWrites, []);
                assert.deepEqual(errors, []);
                exports.deactivate();
                cases++;
            }
        }
    }
    console.log(`✅ Actual host commands: ${cases} cases; preference events, automatic guards and icon-only writes`);
}

// Run all tests
if (require.main === module) {
    (async () => {
        validateResolvers();
        assert.ok(runTests(), 'Missing theme-to-icon mappings');
        validateCommandStructure();
        await validateHostCommands();
        console.log('🎉 All functionality tests passed!');
    })().catch(error => {
        console.error(error);
        process.exitCode = 1;
    });
} 