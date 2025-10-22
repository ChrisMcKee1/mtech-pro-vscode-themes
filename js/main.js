"use strict";

const vscode = require("vscode");
const {
    THEME_CONFIG,
    getMatchingIconTheme: resolveMatchingIconTheme,
    getThemeCategories: buildThemeCategories,
    isTechIconThemeName,
    isTechThemeName
} = require("./shared/themeConfig");

class ThemeManager {
    constructor(context, vscode) {
        this.context = context;
        this.vscode = vscode;
        this.globalState = this.context.globalState;
        this.workspaceState = this.context.workspaceState;
        this._applyingTheme = false; // Guard against re-entrant applyTheme calls
        this.init();
    }

    init() {
        this.loadConfiguration();
        return this.getState();
    }

    loadConfiguration() {
        const workbenchConfig = this.vscode.workspace.getConfiguration("workbench");
        this.currentVersion = THEME_CONFIG.version;
        this.currentColorTheme = workbenchConfig.get("colorTheme");
        this.currentIconTheme = workbenchConfig.get("iconTheme");

        const techConfig = this.vscode.workspace.getConfiguration("techThemes");
        this.fileIconsMonochrome = techConfig.get("fileIconsMonochrome", false);
        this.minimal = techConfig.get("minimal", false);
    }

    getState() {
        return {
            fileIconsMonochrome: this.fileIconsMonochrome,
            iconTheme: this.currentIconTheme,
            colorTheme: this.currentColorTheme,
            version: this.currentVersion
        };
    }

    async applyTheme(themeName, previousState = {}) {
        // Prevent re-entrant calls from configuration change listener
        if (this._applyingTheme) {
            return;
        }

        this._applyingTheme = true;

        try {
            const iconThemeName = resolveMatchingIconTheme(themeName, {
                preferMonochrome: this.fileIconsMonochrome
            });
            const workbenchConfig = this.vscode.workspace.getConfiguration("workbench");
            const currentIconTheme = workbenchConfig.get("iconTheme");

            // Update color theme if it changed
            if (themeName !== previousState.colorTheme && themeName !== this.currentColorTheme) {
                await workbenchConfig.update("colorTheme", themeName, vscode.ConfigurationTarget.Global);
                this.currentColorTheme = themeName;
                
                // Show notification for successful theme change
                vscode.window.showInformationMessage(`✨ Applied ${themeName} theme!`);
            }

            // Update icon theme if needed and user has tech icons
            if (isTechIconThemeName(currentIconTheme) && iconThemeName !== previousState.iconTheme && iconThemeName !== this.currentIconTheme) {
                await workbenchConfig.update("iconTheme", iconThemeName, vscode.ConfigurationTarget.Global);
                this.currentIconTheme = iconThemeName;
            }

            // Save theme preference for workspace
            this.workspaceState.update("preferredTheme", themeName);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to apply theme: ${error.message}`);
        } finally {
            this._applyingTheme = false;
        }
    }

    getMatchingIconTheme(themeName) {
        return resolveMatchingIconTheme(themeName, {
            preferMonochrome: this.fileIconsMonochrome
        });
    }

    updateGlobalState(key, value) {
        this.globalState.update(key, value);
    }

    updateWorkspaceState(key, value) {
        this.workspaceState.update(key, value);
    }

    getCurrentTimestamp() {
        return Math.floor(Date.now() / 1000);
    }

    isTechIconTheme(iconTheme = "") {
        return isTechIconThemeName(iconTheme);
    }

    isTechTheme(themeName = "") {
        const checkTheme = themeName || this.currentColorTheme;
        return isTechThemeName(checkTheme);
    }

    get istechTheme() {
        return this.isTechTheme();
    }

    get istechIcons() {
        return this.isTechIconTheme(this.currentIconTheme);
    }

    // Get theme categories for better organization
    getThemeCategories() {
        return buildThemeCategories();
    }
}

class ExtensionManager {
    constructor(vscode) {
        this.vscode = vscode;
        this.themeManager = null;
        this.statusBarItem = null;
    }

    activate(context) {
        this.themeManager = new ThemeManager(context, this.vscode);
        this.createStatusBarItem();

        // Register commands - more concise object mapping
        const commandHandlers = {
            "tech_pro.select_theme": () => this.selectTheme(),
            "tech_pro.activate_icons": () => this.activateIcons(),
            "tech_pro.set_theme_and_icons": () => this.setThemeAndIcons(),
            "tech_pro.report_issue": () => this.reportIssue()
        };

        // Register all commands
        for (const [command, handler] of Object.entries(commandHandlers)) {
            context.subscriptions.push(
                this.vscode.commands.registerCommand(command, handler)
            );
        }

        // Configuration change listener
        context.subscriptions.push(
            this.vscode.workspace.onDidChangeConfiguration((event) => {
                if (event.affectsConfiguration("workbench.colorTheme") || 
                    event.affectsConfiguration("workbench.iconTheme") ||
                    event.affectsConfiguration("techThemes")) {
                    
                    const previousState = this.themeManager.getState();
                    this.themeManager.loadConfiguration();
                    
                    // Only apply theme if using tech theme and not already applying
                    if (this.themeManager.istechTheme && !this.themeManager._applyingTheme) {
                        const currentColorTheme = this.themeManager.currentColorTheme;
                        if (currentColorTheme !== previousState.colorTheme) {
                            this.themeManager.applyTheme(currentColorTheme, previousState);
                        }
                    }
                    
                    this.updateStatusBarItem();
                }
            })
        );

        this.updateStatusBarItem();
    }

    createStatusBarItem() {
        this.statusBarItem = this.vscode.window.createStatusBarItem(
            this.vscode.StatusBarAlignment.Left, 
            100
        );
        this.statusBarItem.command = "tech_pro.select_theme";
        this.statusBarItem.tooltip = "Click to change M Tech Themes";
    }

    updateStatusBarItem() {
        if (this.themeManager.istechTheme) {
            const currentTheme = this.themeManager.currentColorTheme;
            this.statusBarItem.text = `$(paintcan) ${currentTheme}`;
            this.statusBarItem.show();
        } else {
            this.statusBarItem.hide();
        }
    }

    async selectTheme() {
        const categories = this.themeManager.getThemeCategories();
        const allThemes = [];
        
        // Add category headers and themes with enhanced visual indicators
        Object.entries(categories).forEach(([category, themes]) => {
            // Category separator (plain text only - icons don't render in separators)
            allThemes.push({
                label: category,
                kind: this.vscode.QuickPickItemKind.Separator
            });
            
            themes.forEach(theme => {
                const isCurrentTheme = theme === this.themeManager.currentColorTheme;
                const isLightTheme = category === "Light Themes";
                
                // Use light-bulb for light themes and circle-filled for dark themes
                const iconId = isLightTheme ? "light-bulb" : "circle-filled";
                
                allThemes.push({
                    label: theme,
                    description: isCurrentTheme ? "Current" : "",
                    detail: this.getThemeDescription(theme),
                    iconPath: new this.vscode.ThemeIcon(iconId)
                });
        });
        });

        const selection = await this.vscode.window.showQuickPick(allThemes, {
            title: "M Tech Themes - Select Your Theme",
            placeHolder: "Choose a light or dark theme to apply",
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (selection && selection.label) {
            await this.themeManager.applyTheme(selection.label);
            this.updateStatusBarItem();
        }
    }

    getThemeDescription(themeName) {
        const descriptions = {
            // Classic
            "Classic": "Original M Tech dark theme with balanced syntax colors",
            
            // Arctic Nord variants
            "Arctic Nord": "Cool Nordic-inspired winter palette (dark)",
            "Arctic Nord Light": "Cool Nordic-inspired winter palette (light)",
            
            // Cyberpunk variants
            "Cyberpunk Neon": "Vibrant neon cyber colors for dark environments",
            "Neon Pink Light": "Hot pink neon aesthetics for light environments",
            
            // Tokyo variants
            "Tokyo Night": "Urban night atmosphere with neon accents",
            "Tokyo Day": "Bright urban daytime clarity",
            
            // Enchanted Grove variants
            "Enchanted Grove": "Nature-inspired mystical forest (light)",
            "Enchanted Grove Dark": "Dark mystical forest atmosphere",
            
            // Cosmic Void variants
            "Cosmic Void": "Deep space exploration theme (dark)",
            "Cosmic Void Light": "Deep space theme for light environments",
            
            // Feisty Fusion variants
            "Feisty Fusion": "Energetic warm color fusion (dark)",
            "Feisty Fusion Light": "Energetic warm color fusion (light)",
            
            // Filter series
            "Filter Octagon": "Balanced industrial precision (dark)",
            "Filter Ristretto": "Concentrated espresso-inspired tones (dark)",
            "Filter Spectrum": "Full rainbow spectrum engineering (dark)",
            "Filter Machine": "Mechanical precision aesthetics (dark)",
            "Filter Moon": "Cool moonlit industrial tones (dark)",
            "Filter Sun": "Bright sunny professional atmosphere (light)",
            
            // OGE variants
            "OGE Dark": "Oil, Gas & Energy industry theme (dark)",
            "OGE Light": "Oil, Gas & Energy industry theme (light)"
        };
        return descriptions[themeName] || "Professional theme variant";
    }

    async activateIcons() {
        const workbenchConfig = this.vscode.workspace.getConfiguration("workbench");
        let iconTheme;
        
        if (this.themeManager.istechTheme) {
            iconTheme = this.themeManager.getMatchingIconTheme(this.themeManager.currentColorTheme);
        } else {
            iconTheme = "Classic Icons";
        }
        
        try {
            await workbenchConfig.update("iconTheme", iconTheme, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`✨ Applied ${iconTheme}!`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to apply icons: ${error.message}`);
        }
    }

    async setThemeAndIcons() {
        const categories = this.themeManager.getThemeCategories();
        const allThemes = [];
        
        // Add category headers and themes with enhanced visual indicators
        Object.entries(categories).forEach(([category, themes]) => {
            // Category separator (plain text only - icons don't render in separators)
            allThemes.push({
                label: category,
                kind: this.vscode.QuickPickItemKind.Separator
            });
            
            themes.forEach(theme => {
                const isCurrentTheme = theme === this.themeManager.currentColorTheme;
                const isLightTheme = category === "Light Themes";
                const matchingIconTheme = this.themeManager.getMatchingIconTheme(theme);
                
                // Use light-bulb for light themes and circle-filled for dark themes
                const iconId = isLightTheme ? "light-bulb" : "circle-filled";
                
                allThemes.push({
                    label: theme,
                    description: isCurrentTheme ? "Current" : "",
                    detail: `${this.getThemeDescription(theme)} • Icons: ${matchingIconTheme}`,
                    iconPath: new this.vscode.ThemeIcon(iconId)
                });
        });
        });

        const selection = await this.vscode.window.showQuickPick(allThemes, {
            title: "M Tech Themes - Select Theme + Icons",
            placeHolder: "Choose a theme (icons will be applied automatically)",
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (selection && selection.label) {
            await this.themeManager.applyTheme(selection.label);
            
            const iconTheme = this.themeManager.getMatchingIconTheme(selection.label);
            const workbenchConfig = this.vscode.workspace.getConfiguration("workbench");
            
            try {
                await workbenchConfig.update("iconTheme", iconTheme, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage(`✨ Applied ${selection.label} with ${iconTheme}!`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to apply theme and icons: ${error.message}`);
            }
            
            this.updateStatusBarItem();
        }
    }

    showThemeInfo() {
        const message = this.themeManager.istechTheme 
            ? `Current theme: ${this.themeManager.currentColorTheme}\nVersion: ${THEME_CONFIG.version}`
            : "M Tech Themes are available! Use the theme selector to switch.";
            
        this.vscode.window.showInformationMessage(message, "Browse Themes").then(selection => {
            if (selection === "Browse Themes") {
                this.selectTheme();
            }
        });
    }

    openWebsite() {
        this.vscode.env.openExternal(
            this.vscode.Uri.parse("https://github.com/ChrisMcKee1/mtech-pro-vscode-themes")
        );
    }

    async reportIssue() {
        // Get current theme and extension info
        const currentTheme = this.themeManager.currentColorTheme;
        const extensionVersion = THEME_CONFIG.version;
        const vscodeVersion = this.vscode.version;
        
        // Build issue template URL with pre-filled information
        const issueTitle = encodeURIComponent(`[THEME] Issue with ${currentTheme}`);
        const issueBody = encodeURIComponent(
            `## Theme Information\n\n` +
            `**Theme Name:** ${currentTheme}\n\n` +
            `**Extension Version:** ${extensionVersion}\n\n` +
            `**VS Code Version:** ${vscodeVersion}\n\n` +
            `## Issue Description\n\n` +
            `**Which element has the problem?**\n` +
            `<!-- Examples: Comments, selection highlight, scrollbars, diff colors, syntax highlighting -->\n\n` +
            `**What's wrong with it?**\n` +
            `<!-- Describe the visual problem clearly -->\n\n` +
            `## Code Example (if applicable)\n\n` +
            `**Language:**\n` +
            `<!-- JavaScript, TypeScript, Python, etc. -->\n\n` +
            `**Code Sample:**\n` +
            `\`\`\`\n` +
            `// Paste a small code example that shows the problem\n` +
            `\`\`\`\n\n` +
            `## Screenshots\n\n` +
            `**Required: Please attach screenshots showing the issue**\n` +
            `<!-- Drag and drop images here -->\n\n` +
            `## Additional Context\n\n` +
            `**What would you expect to see instead?**\n\n` +
            `**Does this happen in multiple files/languages?**\n`
        );
        
        const issueUrl = `https://github.com/ChrisMcKee1/mtech-pro-vscode-themes/issues/new?title=${issueTitle}&body=${issueBody}&labels=theme-issue,needs-triage`;
        
        // Show confirmation dialog
        const selection = await this.vscode.window.showInformationMessage(
            `Report an issue with "${currentTheme}"?`,
            { modal: false },
            "Open GitHub Issue Form",
            "Cancel"
        );
        
        if (selection === "Open GitHub Issue Form") {
            this.vscode.env.openExternal(this.vscode.Uri.parse(issueUrl));
        }
    }

    deactivate() {
        if (this.statusBarItem) {
            this.statusBarItem.dispose();
        }
    }
}

// Initialize extension
const extensionManager = new ExtensionManager(vscode);

exports.activate = function(context) {
    extensionManager.activate(context);
};

exports.deactivate = function() {
    extensionManager.deactivate();
};
