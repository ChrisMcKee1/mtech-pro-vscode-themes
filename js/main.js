"use strict";

const vscode = require("vscode");

// Theme configuration
const THEME_CONFIG = {
    name: "techPro-VSCode",
    themes: [
        "M Tech Pro",
        "M Tech Pro (Filter Octagon)",
        "M Tech Pro (Filter Ristretto)",
        "M Tech Pro (Filter Spectrum)",
        "M Tech Pro (Filter Machine)",
        "M Tech Pro Light",
        "M Tech Pro Light (Filter Sun)",
        "M Tech Classic",
        "M Tech Pro (Cyberpunk Neon)",
        "M Tech Pro (Tokyo Night)",
        "M Tech Pro (Arctic Nord)",
        "M Tech Pro (Feisty Fusion)",
        "M Tech Pro (Cosmic Void)",
        "M Tech Pro (Enchanted Grove)"
    ],
    description: "M Tech Pro theme and color scheme for Visual Studio Code",
    version: "2.0.6",
    author: "tech"
};

class ThemeManager {
    constructor(context, vscode) {
        this.context = context;
        this.vscode = vscode;
        this.globalState = this.context.globalState;
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

        const techConfig = this.vscode.workspace.getConfiguration("techPro");
        this.fileIconsMonochrome = techConfig.get("fileIconsMonochrome", false);
        this.minimal = techConfig.get("minimal", false);
    }

    getState() {
        return {
            fileIconsMonochrome: this.fileIconsMonochrome,
            iconTheme: this.currentIconTheme,
            colorTheme: this.currentColorTheme
        };
    }

    applyTheme(themeName, previousState = {}) {
        const iconThemeName = `${themeName}${this.fileIconsMonochrome ? " Monochrome" : ""} Icons`;
        const workbenchConfig = this.vscode.workspace.getConfiguration("workbench");
        const currentIconTheme = workbenchConfig.iconTheme;

        // Update color theme if it changed
        if (themeName !== previousState.colorTheme) {
            workbenchConfig.update("colorTheme", themeName, true);
        }

        // Update icon theme if needed
        if ((this.istechIconTheme(currentIconTheme)) && iconThemeName !== previousState.iconTheme) {
            workbenchConfig.update("iconTheme", iconThemeName, true);
        }

        this.init();
    }

    updateGlobalState(key, value) {
        this.globalState.update(key, value);
    }

    getCurrentTimestamp() {
        return Math.floor(Date.now() / 1000);
    }

    istechIconTheme(iconTheme = "") {
        return iconTheme && THEME_CONFIG.themes.includes(iconTheme?.replace?.(/ (Monochrome )?Icons$/, ""));
    }

    get istechTheme() {
        return THEME_CONFIG.themes.includes(this.currentColorTheme);
    }

    get istechIcons() {
        return this.istechIconTheme(this.currentIconTheme);
    }
}

// Simple update messages for new versions (no licensing prompts)
const UPDATE_MESSAGES = {
    install: {
        title: "Thanks for installing M Tech Pro — Enjoy!",
        actions: [
            { label: "learn more", id: "OPEN-WEBSITE" }
        ]
    },
    "2.0.2": {
        title: "✨ M Tech Pro Light is here ✨ — Enjoy!",
        actions: [
            { label: "learn more", id: "OPEN-WEBSITE" },
            { label: "activate", id: "ACTIVATE-THEME-LIGHT" }
        ]
    },
    "2.0.6": {
        title: "M Tech Pro has been updated — Enjoy!",
        actions: [
            { label: "learn more", id: "OPEN-WEBSITE" }
        ]
    }
};

class ExtensionManager {
    constructor(vscode) {
        this.vscode = vscode;
        this.themeManager = null;
        this.updateTimeout = null;
    }

    activate(context) {
        this.themeManager = new ThemeManager(context, this.vscode);

        // Register commands (removed license-related commands)
        const commands = {
            "tech_pro.select_theme": () => this.selectTheme(),
            "tech_pro.activate_icons": () => this.activateIcons()
        };

        Object.keys(commands).forEach(commandName => {
            const disposable = this.vscode.commands.registerCommand(commandName, commands[commandName]);
            context.subscriptions.push(disposable);
        });

        // Listen for configuration changes
        this.vscode.workspace.onDidChangeConfiguration(() => {
            const previousState = this.themeManager.getState();
            const currentState = this.themeManager.init();
            
            if (this.themeManager.istechTheme) {
                this.themeManager.applyTheme(currentState.colorTheme, previousState);
            }
        });

        // Show update messages for tech themes/icons
        if (this.themeManager.istechTheme || this.themeManager.istechIcons) {
            this.showUpdateMessage();
        }
    }

    selectTheme() {
        const options = [];
        THEME_CONFIG.themes.forEach(theme => {
            options.push({ label: theme });
        });

        this.vscode.window.showQuickPick(options, {
            placeHolder: "M Tech Pro theme"
        }).then(selection => {
            if (selection) {
                this.themeManager.applyTheme(selection.label);
            }
        });
    }

    activateIcons() {
        const workbenchConfig = this.vscode.workspace.getConfiguration("workbench");
        let iconTheme;
        
        if (this.themeManager.istechTheme) {
            iconTheme = `${this.themeManager.currentColorTheme}${this.themeManager.fileIconsMonochrome ? " Monochrome" : ""} Icons`;
        }
        
        workbenchConfig.update("iconTheme", iconTheme ?? "M Tech Pro Icons", true);
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
            
            this.showVersionMessage(messageKey, "vscode-update-message");
            this.themeManager.updateGlobalState("lastVersionUpdateShown", THEME_CONFIG.version);
        }
    }

    async showVersionMessage(messageKey, ref = "default") {
        const messageConfig = UPDATE_MESSAGES[messageKey];
        if (!messageConfig?.title) return;

        const actionLabels = messageConfig.actions ? messageConfig.actions.map(action => action.label) : [];
        
        const selection = await this.vscode.window.showInformationMessage(
            messageConfig.title,
            ...actionLabels
        );

        const selectedAction = messageConfig.actions?.find(action => action.label === selection);
        const actionId = selectedAction?.id?.toUpperCase();

        switch (actionId) {
            case "OPEN-WEBSITE":
                this.openWebsite();
                break;
            case "ACTIVATE-THEME":
                this.themeManager.applyTheme("M Tech Pro");
                break;
            case "ACTIVATE-THEME-LIGHT":
                this.themeManager.applyTheme("M Tech Pro Light");
                break;
        }
    }

    openWebsite() {
        this.vscode.env.openExternal("https://tech.pro");
    }

    deactivate() {
        clearTimeout(this.updateTimeout);
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
