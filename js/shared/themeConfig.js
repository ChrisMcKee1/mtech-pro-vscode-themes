"use strict";

// Centralized theme metadata shared across Node and web extension hosts.
const THEMES = Object.freeze([
    "Obsidian Moss",
    "Graphite Bay",
    "Copper Bloom",
    "Chroma Void",
    "Digital Aqua",
    "Sandstone Light",
    "Cyberpunk Neon",
    "Neon Pink Light",
    "Tokyo Night",
    "Tokyo Day",
    "Arctic Nord",
    "Arctic Nord Light",
    "OGE Dark",
    "OGE Light",
    "Feisty Fusion",
    "Feisty Fusion Light",
    "Cosmic Void",
    "Cosmic Void Light",
    "Enchanted Grove",
    "Enchanted Grove Dark",
    "Mystic Dusk",
    "Morning Coffee",
    "Evening Espresso"
]);

const ICON_THEMES = Object.freeze([
    "Obsidian Moss Icons",
    "Graphite Bay Icons",
    "Copper Bloom Icons",
    "Chroma Void Icons",
    "Digital Aqua Icons",
    "Sandstone Light Icons",
    "Cyberpunk Neon Icons",
    "Neon Pink Light Icons",
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
    "Mystic Dusk Icons",
    "Morning Coffee Icons",
    "Evening Espresso Icons"
]);

const THEME_SET = new Set(THEMES);
const ICON_THEME_SET = new Set(ICON_THEMES);
const LIGHT_THEME_HINTS = new Set([
    "Sandstone Light",
    "Tokyo Day",
    "Enchanted Grove",
    "Arctic Nord Light",
    "Cosmic Void Light",
    "Feisty Fusion Light",
    "Neon Pink Light",
    "Morning Coffee",
    "OGE Light"
]);

const THEME_CONFIG = Object.freeze({
    name: "techThemes-VSCode",
    themes: THEMES,
    iconThemes: ICON_THEMES,
    description: "M Tech Themes and color scheme for Visual Studio Code",
    version: "0.6.0",
    author: "tech"
});

function isTechThemeName(themeName = "") {
    return THEME_SET.has(themeName);
}

function isTechIconThemeName(iconTheme = "") {
    return ICON_THEME_SET.has(iconTheme);
}

function getMatchingIconTheme(themeName, options = {}) {
    const preferMonochrome = Boolean(options.preferMonochrome);
    const baseIconTheme = `${themeName} Icons`;
    const monochromeIconTheme = `${themeName} Monochrome Icons`;

    if (preferMonochrome && ICON_THEME_SET.has(monochromeIconTheme)) {
        return monochromeIconTheme;
    }

    return ICON_THEME_SET.has(baseIconTheme) ? baseIconTheme : "Classic Icons";
}

function getThemeCategories() {
    const lightThemeSet = new Set(
        THEMES.filter(theme =>
            LIGHT_THEME_HINTS.has(theme) ||
            theme.includes("Light") ||
            theme.includes("Sun") ||
            theme.includes("Day")
        )
    );

    const lightThemes = Array.from(lightThemeSet);
    const darkThemes = THEMES.filter(theme => !lightThemeSet.has(theme));

    return {
        "Light Themes": lightThemes,
        "Dark Themes": darkThemes
    };
}

module.exports = {
    THEME_CONFIG,
    getMatchingIconTheme,
    getThemeCategories,
    isTechIconThemeName,
    isTechThemeName
};
