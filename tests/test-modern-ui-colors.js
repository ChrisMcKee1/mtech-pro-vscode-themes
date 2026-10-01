const { loadPackageJson, loadThemeFile, getAllThemeNames } = require('./lib/config-loader');
const { hexToRgb, blendColors, calculateContrast } = require('./lib/contrast-utils');

const REQUIRED_KEYS = Object.freeze([
    'agentsCard.border',
    'agentsBottomPanel.border',
    'agentsDetail.background',
    'editor.border',
    'modernActivityBar.border',
    'modernPanel.border',
    'modernTab.activeBackground',
    'modernTab.activeForeground',
    'modernTab.hoverBackground',
    'modernTab.hoverForeground',
    'modernEditorTab.activeBackground',
    'modernEditorTab.activeActionBackground',
    'modernEditorTab.activeForeground',
    'modernEditorTab.inactiveBackground',
    'modernEditorTab.hoverBackground',
    'modernEditorTab.activeHoverBackground',
    'modernEditorTab.hoverActionBackground',
    'modernEditorTab.activeHoverActionBackground',
    'modernEditorTab.hoverForeground',
    'modernEditorTab.selectedActionBackground',
    'modernActivityBar.background',
    'modernActivityBar.inactiveBackground',
    'modernActivityBarItem.activeBackground',
    'modernActivityBarItem.activeForeground',
    'modernActivityBarItem.hoverForeground',
    'modernActivityBarItem.hoverBackground',
    'chat.statusBackground',
    'chat.sessionStateIndicator.inProgressBorder',
    'chat.sessionStateIndicator.unvisitedBorder',
    'chat.sessionStateIndicator.needsInputBorder',
    'modernUI.shellBackground',
    'modernUI.inactiveShellBackground',
    'modernSash.gripForeground',
    'chat.workingProgressStableIconForeground',
    'chat.workingProgressInsidersIconForeground',
    'editorWordWrapIndicator.foreground',
    'chat.mcpCompatibilityWarningForeground',
    'editorGroupHeader.connectedTabsBackground'
]);

// Pin upstream state-styling limitations, not palette exemptions; passing entries must be removed.
const KNOWN_LIMITATIONS = Object.freeze([
    'America250 Light', 'Arctic Nord', 'Arctic Nord Light', 'Crimson Night',
    'Cyberpunk Neon', 'Digital Aqua', 'Ember Night', 'Enchanted Grove',
    'Enchanted Grove Dark', 'Evening Espresso', 'Feisty Fusion', 'Grove Night',
    'Hurricanes Light', 'Sapphire Night', 'America250 Dark', 'Chroma Void',
    'Copper Bloom', 'Tokyo Night', 'Cosmic Void', 'Hurricanes Dark', 'OGE Dark'
]);

const MCP_STATES = Object.freeze({
    E: 'editor.background',
    H: 'list.hoverBackground',
    S: 'list.activeSelectionBackground',
    I: 'list.inactiveSelectionBackground',
    F: 'list.focusBackground',
    U: 'list.inactiveFocusBackground'
});

function color(value, key) {
    if (typeof value !== 'string' || !/^#[\da-f]{6}([\da-f]{2})?$/i.test(value)) {
        throw new Error(`${key}: missing or invalid color ${JSON.stringify(value)}`);
    }
    return hexToRgb(value);
}

function hostColor(colors, key) {
    const host = color(colors[key], key);
    if (host.a !== 1) {
        throw new Error(`${key}: host must be opaque before measuring contrast`);
    }
    return host;
}

function flattenBackground(value, host, key) {
    // The shared analyzer does not composite translucent backgrounds onto their host.
    return blendColors(color(value, key), host);
}

function foregroundContrast(value, background, opacity = 1) {
    const foreground = color(value, 'foreground');
    // Keep CSS opacity exact rather than approximating 0.85 or 0.5 with a hex alpha byte.
    return calculateContrast(blendColors({ ...foreground, a: foreground.a * opacity }, background), background);
}

function run({ loadTheme = loadThemeFile, log = console.log } = {}) {
    const summary = { hardFailures: 0, warnings: 0, themesAnalyzed: 0, skippedStates: 0 };
    const minima = new Map();
    const fail = message => {
        summary.hardFailures++;
        log(`FAIL ${message}`);
    };
    const checkRatio = (group, label, value, background, threshold) => {
        const ratio = foregroundContrast(value, background);
        if (!minima.has(group) || ratio < minima.get(group).ratio) {
            minima.set(group, { ratio, label });
        }
        if (ratio < threshold) {
            fail(`${label}: ${ratio.toFixed(3)}:1 < ${threshold}:1`);
        }
    };

    log('Modern UI color gates (VS Code 1.140.0; MCP E/H/S/I/F/U at 1.0 and exactly 0.85 opacity)');
    const registrations = loadPackageJson()?.contributes?.themes;
    const names = getAllThemeNames();
    const registeredNames = Array.isArray(registrations) ? registrations.map(theme => theme.label) : [];
    if (names.length !== 31 || registeredNames.length !== 31 ||
        new Set(registeredNames).size !== 31 || registeredNames.some(name => !names.includes(name))) {
        fail(`Expected exactly 31 registered and on-disk themes; registered=${registeredNames.length}, files=${names.length}`);
    }
    for (const name of KNOWN_LIMITATIONS) {
        if (!names.includes(name)) {
            fail(`Stale KNOWN_LIMITATIONS entry: ${name} is not an on-disk theme`);
        }
    }

    for (const name of names) {
        try {
            const theme = loadTheme(name);
            if (!theme?.colors) {
                fail(`${name}: theme could not be loaded`);
                continue;
            }
            summary.themesAnalyzed++;
            const colors = theme.colors;
            let invalid = false;
            for (const key of REQUIRED_KEYS) {
                try {
                    color(colors[key], key);
                } catch (error) {
                    fail(`${name}: ${error.message}`);
                    invalid = true;
                }
            }
            if (invalid) {
                continue;
            }

            const alphaRules = {
                'modernEditorTab.inactiveBackground': 0x00,
                'modernEditorTab.activeBackground': 0xff,
                'modernEditorTab.activeActionBackground': 0xff,
                'modernEditorTab.hoverActionBackground': 0xff,
                'modernEditorTab.activeHoverActionBackground': 0xff,
                'modernEditorTab.selectedActionBackground': 0xff,
                'chat.statusBackground': 0x14,
                'modernSash.gripForeground': 0x66
            };
            for (const [key, alpha] of Object.entries(alphaRules)) {
                if (hexToRgb(colors[key]).a !== alpha / 255) {
                    fail(`${name}: ${key} must have alpha ${alpha.toString(16).padStart(2, '0').toUpperCase()}; got ${colors[key]}`);
                }
            }

            const editor = hostColor(colors, 'editor.background');
            const hosts = new Map([
                ['editor.background', editor],
                ['sideBar.background', hostColor(colors, 'sideBar.background')],
                ['panel.background', hostColor(colors, 'panel.background')],
                ['editorWidget.background', hostColor(colors, 'editorWidget.background')]
            ]);
            const activityBar = hostColor(colors, 'activityBar.background');
            const tabHosts = [
                ['modernTab', 'sideBar.background', hosts.get('sideBar.background'), 4.5],
                ['modernTab', 'panel.background', hosts.get('panel.background'), 4.5],
                ['modernEditorTab', 'editor.background', editor, 4.5],
                ['modernActivityBarItem', 'activityBar.background', activityBar, 3]
            ];
            for (const [family, hostKey, host, threshold] of tabHosts) {
                const states = [['active', 'active'], ['hover', 'hover']];
                // Active-hover retains activeForeground in the upstream tab selectors.
                if (family === 'modernEditorTab') {
                    states.push(['active', 'activeHover']);
                }
                for (const [foregroundState, backgroundState] of states) {
                    const fgKey = `${family}.${foregroundState}Foreground`;
                    const bgKey = `${family}.${backgroundState}Background`;
                    const background = flattenBackground(colors[bgKey], host, bgKey);
                    checkRatio(family, `${name}: ${fgKey} on ${bgKey} over ${hostKey}`, colors[fgKey], background, threshold);
                }
            }
            for (const state of ['inProgress', 'unvisited', 'needsInput']) {
                const key = `chat.sessionStateIndicator.${state}Border`;
                checkRatio('chat.sessionStateIndicator', `${name}: ${key} on editor.background`, colors[key], editor, 3);
            }
            for (const channel of ['Stable', 'Insiders']) {
                const key = `chat.workingProgress${channel}IconForeground`;
                for (const [hostKey, host] of hosts) {
                    checkRatio('chat.workingProgress', `${name}: ${key} on ${hostKey}`, colors[key], host, 3);
                }
            }
            checkRatio('editorWordWrapIndicator', `${name}: editorWordWrapIndicator.foreground on editor.background`,
                colors['editorWordWrapIndicator.foreground'], editor, 3);

            const measurements = [];
            for (const [state, key] of Object.entries(MCP_STATES)) {
                if (!Object.hasOwn(colors, key)) {
                    summary.skippedStates++;
                    log(`NOTE ${name}: MCP ${state} skipped (${key} absent)`);
                    continue;
                }
                const background = flattenBackground(colors[key], editor, key);
                for (const opacity of [1, 0.85]) {
                    const ratio = foregroundContrast(colors['chat.mcpCompatibilityWarningForeground'], background, opacity);
                    measurements.push({ state, key, opacity, ratio });
                }
            }
            const worst = measurements.reduce((a, b) => a.ratio <= b.ratio ? a : b);
            const detail = `${name}: MCP worst ${worst.state} (${worst.key}) at opacity ${worst.opacity}: ${worst.ratio.toFixed(3)}:1`;
            if (KNOWN_LIMITATIONS.includes(name)) {
                if (worst.ratio >= 4.5) {
                    fail(`${detail}; stale KNOWN_LIMITATIONS entry now passes all available states`);
                } else {
                    summary.warnings++;
                    log(`WARN ${detail} < 4.5:1; pinned upstream state-styling limitation`);
                }
            } else if (worst.ratio < 4.5) {
                fail(`${detail} < 4.5:1; not in KNOWN_LIMITATIONS`);
            } else {
                log(`PASS ${detail}`);
            }

            // These design diagnostics are not accessibility gates.
            try {
                const shell = hostColor(colors, 'modernUI.shellBackground');
                const sash = foregroundContrast(colors['modernSash.gripForeground'], shell);
                const inactive = foregroundContrast(colors.foreground, editor, 0.5);
                log(`REPORT ${name}: sash/shell=${sash.toFixed(3)}:1 (upstream intentionally faint); detached inactive label/editor=${inactive.toFixed(3)}:1 (50% foreground)`);
                for (const [family, hostKey, host] of tabHosts) {
                    const active = flattenBackground(colors[`${family}.activeBackground`], host, family);
                    const hover = flattenBackground(colors[`${family}.hoverBackground`], host, family);
                    let detail = `active/host=${calculateContrast(active, host).toFixed(3)}, hover/host=${calculateContrast(hover, host).toFixed(3)}, active/hover=${calculateContrast(active, hover).toFixed(3)}`;
                    if (family === 'modernEditorTab') {
                        const activeHover = flattenBackground(colors[`${family}.activeHoverBackground`], host, family);
                        detail += `, active-hover/host=${calculateContrast(activeHover, host).toFixed(3)}, active/active-hover=${calculateContrast(active, activeHover).toFixed(3)}`;
                    }
                    log(`REPORT ${name}: ${family} over ${hostKey}: ${detail} (ratios, report-only)`);
                }
            } catch (error) {
                log(`NOTE ${name}: report-only diagnostics unavailable: ${error.message}`);
            }
        } catch (error) {
            fail(`${name}: ${error.message}`);
        }
    }

    if (summary.themesAnalyzed !== 31) {
        fail(`Expected 31 themes analyzed; got ${summary.themesAnalyzed}`);
    }
    for (const [group, { ratio, label }] of minima) {
        log(`MIN ${group}: ${ratio.toFixed(3)}:1 (${label})`);
    }
    log(`SUMMARY hard failures=${summary.hardFailures}, warnings=${summary.warnings}, themes analyzed=${summary.themesAnalyzed}, skipped MCP states=${summary.skippedStates}`);
    return summary;
}

if (require.main === module) {
    process.exitCode = run().hardFailures > 0 ? 1 : 0;
}

module.exports = { run, REQUIRED_KEYS, KNOWN_LIMITATIONS };
