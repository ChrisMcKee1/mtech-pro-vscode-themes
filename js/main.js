"use strict";

const vscode = require("vscode");

// Theme configuration with simplified names
const THEME_CONFIG = {
    name: "techThemes-VSCode",
    themes: [
        "Classic",
        "Filter Octagon",
        "Filter Ristretto", 
        "Filter Spectrum",
        "Filter Machine",
        "Light",
        "Filter Sun",
        "Cyberpunk Neon",
        "Cyberpunk Neon Light",
        "Tokyo Night",
        "Tokyo Day",
        "Arctic Nord",
        "OGE Dark",
        "OGE Light",
        "Feisty Fusion",
        "Feisty Fusion Light",
        "Cosmic Void",
        "Cosmic Void Light",
        "Enchanted Grove",
        "Enchanted Grove Dark",
        "Filter Moon"
    ],
    iconThemes: [
        "Classic Icons",
        "Filter Octagon Icons",
        "Filter Ristretto Icons", 
        "Filter Spectrum Icons",
        "Filter Machine Icons",
        "Light Icons",
        "Filter Sun Icons",
        "Cyberpunk Neon Icons",
        "Cyberpunk Neon Light Icons",
        "Tokyo Night Icons",
        "Tokyo Day Icons",
        "Arctic Nord Icons",
        "Arctic Nord Light Icons",
        "OGE Icons",
        "OGE Dark Icons",
        "OGE Light Icons",
        "Feisty Fusion Icons",
        "Feisty Fusion Light Icons",
        "Cosmic Void Icons",
        "Cosmic Void Light Icons",
        "Enchanted Grove Icons",
        "Enchanted Grove Dark Icons",
        "Filter Moon Icons"
    ],
    description: "M Tech Themes and color scheme for Visual Studio Code",
    version: "0.2.1",
    author: "tech"
};

class ThemeManager {
    constructor(context, vscode) {
        this.context = context;
        this.vscode = vscode;
        this.globalState = this.context.globalState;
        this.workspaceState = this.context.workspaceState;
        this.init();
    }

    init() {
        this.loadConfiguration();
        return this.getState();
    }

    loadConfiguration() {
        const workbenchConfig = this.vscode.workspace.getConfiguration("workbench");
        this.currentVersion = THEME_CONFIG.version;
        this.currentColorTheme = workbenchConfig.colorTheme;
        this.currentIconTheme = workbenchConfig.iconTheme;

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
        const iconThemeName = this.getMatchingIconTheme(themeName);
        const workbenchConfig = this.vscode.workspace.getConfiguration("workbench");
        const currentIconTheme = workbenchConfig.iconTheme;

        try {
        // Update color theme if it changed
        if (themeName !== previousState.colorTheme) {
                await workbenchConfig.update("colorTheme", themeName, vscode.ConfigurationTarget.Global);
                
                // Show notification for successful theme change
                vscode.window.showInformationMessage(`✨ Applied ${themeName} theme!`);
        }

            // Update icon theme if needed and user has tech icons
            if (this.isTechIconTheme(currentIconTheme) && iconThemeName !== previousState.iconTheme) {
                await workbenchConfig.update("iconTheme", iconThemeName, vscode.ConfigurationTarget.Global);
            }

            // Save theme preference for workspace
            this.workspaceState.update("preferredTheme", themeName);
            
            this.init();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to apply theme: ${error.message}`);
        }
    }

    getMatchingIconTheme(themeName) {
        const baseIconTheme = `${themeName} Icons`;
        const monochromeIconTheme = `${themeName} Monochrome Icons`;
        
        // Check if monochrome version exists in config
        const hasMonochrome = THEME_CONFIG.iconThemes.includes(monochromeIconTheme);
        
        if (this.fileIconsMonochrome && hasMonochrome) {
            return monochromeIconTheme;
        }
        
        return THEME_CONFIG.iconThemes.includes(baseIconTheme) ? baseIconTheme : "Classic Icons";
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
        return iconTheme && THEME_CONFIG.iconThemes.includes(iconTheme);
    }

    isTechTheme(themeName = "") {
        const checkTheme = themeName || this.currentColorTheme;
        return THEME_CONFIG.themes.includes(checkTheme);
    }

    get istechTheme() {
        return this.isTechTheme();
    }

    get istechIcons() {
        return this.isTechIconTheme(this.currentIconTheme);
}

    // Get theme categories for better organization
    getThemeCategories() {
        const lightThemes = [
            "Light", "Filter Sun", "Tokyo Day", "Enchanted Grove",
            "Arctic Nord Light", "Cosmic Void Light",
            "Feisty Fusion Light", "Cyberpunk Neon Light"
        ];
        
        return {
            "Light Themes": THEME_CONFIG.themes.filter(theme => 
                lightThemes.includes(theme) ||
                theme.includes("Light") || 
                theme.includes("Sun") || 
                theme.includes("Day") ||
                theme === "Enchanted Grove"
            ),
            "Dark Themes": THEME_CONFIG.themes.filter(theme => 
                !lightThemes.includes(theme) &&
                !theme.includes("Light") && 
                !theme.includes("Sun") && 
                !theme.includes("Day") &&
                theme !== "Enchanted Grove"
            )
        };
    }
}

// Enhanced update messages with new themes
const UPDATE_MESSAGES = {
    install: {
        title: "🎨 Thanks for installing M Tech Themes — Enjoy the refreshed themes!",
        actions: [
            { label: "browse themes", id: "SELECT-THEME" },
            { label: "learn more", id: "OPEN-WEBSITE" }
        ]
    },
    "0.1.0": {
        title: "✨ M Tech Themes 0.1.0: New brand, new beginning!",
        detail: "Featuring simplified names, comprehensive theme collection, and enhanced accessibility.",
        actions: [
            { label: "browse themes", id: "SELECT-THEME" },
            { label: "learn more", id: "OPEN-WEBSITE" }
        ]
    },
    "0.2.1": {
        title: "🔧 M Tech Themes 0.2.1: Chat Interface Polish & Build Scripts!",
        features: [
            "✅ **Validated All Themes**: Confirmed all 21 themes have proper chat interface properties",
            "🛠️ **Added Build Scripts**: New npm scripts for easier extension building",
            "🎨 **Chat Interface**: Perfect integration with Cursor AI and GitHub Copilot",
            "📦 **Build Tools**: Multiple build options (npm run build, build-extension, package, vsce-package)"
        ]
    },
    "0.2.0": {
        title: "🚀 M Tech Themes 0.2.0: Enhanced Theme & Icon Management!",
        detail: "New 'Set Theme and Icons' command, complete OGE theme support, and improved theme-to-icon mapping system.",
        actions: [
            { label: "try new command", id: "SELECT-THEME" },
            { label: "browse themes", id: "SELECT-THEME" },
            { label: "learn more", id: "OPEN-WEBSITE" }
        ]
    }
};

class ExtensionManager {
    constructor(vscode) {
        this.vscode = vscode;
        this.themeManager = null;
        this.updateTimeout = null;
        this.statusBarItem = null;
    }

    activate(context) {
        this.themeManager = new ThemeManager(context, this.vscode);

        // Create status bar item for quick theme switching
        this.createStatusBarItem();

        // Register enhanced commands
        const commands = {
            "tech_pro.select_theme": () => this.selectTheme(),
            "tech_pro.activate_icons": () => this.activateIcons(),
            "tech_pro.set_theme_and_icons": () => this.setThemeAndIcons(),
            "tech_pro.enter_license": () => this.showThemeInfo() // Repurposed for theme info
        };

        Object.keys(commands).forEach(commandName => {
            const disposable = this.vscode.commands.registerCommand(commandName, commands[commandName]);
            context.subscriptions.push(disposable);
        });

        // Enhanced configuration change listener
        this.vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration("workbench.colorTheme") || 
                event.affectsConfiguration("workbench.iconTheme") ||
                event.affectsConfiguration("techThemes")) {
                
            const previousState = this.themeManager.getState();
            const currentState = this.themeManager.init();
            
            if (this.themeManager.istechTheme) {
                this.themeManager.applyTheme(currentState.colorTheme, previousState);
                }
                
                this.updateStatusBarItem();
            }
        });

        // Show update messages for tech themes/icons
        if (this.themeManager.istechTheme || this.themeManager.istechIcons) {
            this.showUpdateMessage();
        }

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
        
        // Add category headers and themes
        Object.entries(categories).forEach(([category, themes]) => {
            allThemes.push({
                label: `--- ${category} ---`,
                kind: this.vscode.QuickPickItemKind.Separator
            });
            
            themes.forEach(theme => {
                const isCurrentTheme = theme === this.themeManager.currentColorTheme;
                allThemes.push({
                    label: theme,
                    description: isCurrentTheme ? "$(check) Current" : "",
                    detail: this.getThemeDescription(theme)
                });
        });
        });

        const selection = await this.vscode.window.showQuickPick(allThemes, {
            placeHolder: "Select M Tech Theme",
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (selection && selection.label !== this.themeManager.currentColorTheme) {
            await this.themeManager.applyTheme(selection.label);
            this.updateStatusBarItem();
            }
    }

    getThemeDescription(themeName) {
        const descriptions = {
            "Classic": "Original M Tech Theme",
            "Arctic Nord": "Cool Nordic-inspired colors",
            "Cyberpunk Neon": "Vibrant cyber colors",
            "Cyberpunk Neon Light": "Vibrant cyber colors for light environments",
            "Tokyo Night": "Urban night atmosphere",
            "Tokyo Day": "Bright urban daytime",
            "Enchanted Grove": "Nature-inspired forest theme",
            "Enchanted Grove Dark": "Dark forest atmosphere",
            "Cosmic Void": "Deep space theme",
            "Cosmic Void Light": "Deep space theme for light environments",
            "Feisty Fusion": "Energetic warm colors",
            "Feisty Fusion Light": "Energetic warm colors for light environments",
            "Filter Moon": "Cool moonlit tones",
            "Filter Sun": "Bright sunny atmosphere",
            "OGE Dark": "Oil, Gas & Energy industry theme - dark mode",
            "OGE Light": "Oil, Gas & Energy industry theme - light mode"
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
        
        // Add category headers and themes
        Object.entries(categories).forEach(([category, themes]) => {
            allThemes.push({
                label: `--- ${category} ---`,
                kind: this.vscode.QuickPickItemKind.Separator
            });
            
            themes.forEach(theme => {
                const isCurrentTheme = theme === this.themeManager.currentColorTheme;
                const matchingIconTheme = this.themeManager.getMatchingIconTheme(theme);
                allThemes.push({
                    label: theme,
                    description: isCurrentTheme ? "$(check) Current" : "",
                    detail: `${this.getThemeDescription(theme)} • Icons: ${matchingIconTheme}`
                });
            });
        });

        const selection = await this.vscode.window.showQuickPick(allThemes, {
            placeHolder: "Select M Tech Theme and Icons",
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (selection && selection.label !== this.themeManager.currentColorTheme) {
            const workbenchConfig = this.vscode.workspace.getConfiguration("workbench");
            const iconTheme = this.themeManager.getMatchingIconTheme(selection.label);
            
            try {
                // Apply both theme and icons together
                await Promise.all([
                    workbenchConfig.update("colorTheme", selection.label, this.vscode.ConfigurationTarget.Global),
                    workbenchConfig.update("iconTheme", iconTheme, this.vscode.ConfigurationTarget.Global)
                ]);
                
                this.vscode.window.showInformationMessage(`✨ Applied ${selection.label} theme and ${iconTheme}!`);
                this.updateStatusBarItem();
                
                // Save theme preference for workspace
                this.themeManager.workspaceState.update("preferredTheme", selection.label);
                this.themeManager.init();
                
            } catch (error) {
                this.vscode.window.showErrorMessage(`Failed to apply theme and icons: ${error.message}`);
            }
        }
    }

    showThemeInfo() {
        const currentTheme = this.themeManager.currentColorTheme;
        const message = this.themeManager.istechTheme 
            ? `Current theme: ${currentTheme}\nVersion: ${THEME_CONFIG.version}`
            : "M Tech Themes are available! Use the theme selector to switch.";
            
        vscode.window.showInformationMessage(message, "Browse Themes").then(selection => {
            if (selection === "Browse Themes") {
                this.selectTheme();
            }
        });
    }

    showUpdateMessage() {
        const lastVersionShown = this.themeManager.globalState.get("lastVersionUpdateShown", "0.0.0");
        
        if (THEME_CONFIG.version !== lastVersionShown) {
            let messageKey;
            if (lastVersionShown && lastVersionShown !== "0.0.0") {
                messageKey = THEME_CONFIG.version;
            } else {
                messageKey = "install";
            }
            
            this.showVersionMessage(messageKey);
            this.themeManager.updateGlobalState("lastVersionUpdateShown", THEME_CONFIG.version);
        }
    }

    async showVersionMessage(messageKey) {
        const messageConfig = UPDATE_MESSAGES[messageKey];
        if (!messageConfig?.title) return;

        const actionLabels = messageConfig.actions ? messageConfig.actions.map(action => action.label) : [];
        
        const selection = await this.vscode.window.showInformationMessage(
            messageConfig.title,
            { detail: messageConfig.detail, modal: false },
            ...actionLabels
        );

        const selectedAction = messageConfig.actions?.find(action => action.label === selection);
        const actionId = selectedAction?.id?.toUpperCase();

        switch (actionId) {
            case "OPEN-WEBSITE":
                this.openWebsite();
                break;
            case "SELECT-THEME":
                this.selectTheme();
                break;
            case "ACTIVATE-THEME":
                this.themeManager.applyTheme("Classic");
                break;
        }
    }

    openWebsite() {
        this.vscode.env.openExternal(this.vscode.Uri.parse("https://github.com/ChrisMcKee1/mtech-pro-vscode-themes"));
    }

    deactivate() {
        clearTimeout(this.updateTimeout);
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
