"use strict";

// Centralized theme metadata shared across Node and web extension hosts.
const THEMES = Object.freeze([
    "Classic",
    "Filter Octagon",
    "Filter Ristretto",
    "Filter Spectrum",
    "Filter Machine",
    "Filter Sun",
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
    "Filter Moon"
]);

const ICON_THEMES = Object.freeze([
    "Classic Icons",
    "Filter Octagon Icons",
    "Filter Ristretto Icons",
    "Filter Spectrum Icons",
    "Filter Machine Icons",
    "Filter Sun Icons",
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
    "Filter Moon Icons"
]);

const THEME_SET = new Set(THEMES);
const ICON_THEME_SET = new Set(ICON_THEMES);
const LIGHT_THEME_HINTS = new Set([
    "Filter Sun",
    "Tokyo Day",
    "Enchanted Grove",
    "Arctic Nord Light",
    "Cosmic Void Light",
    "Feisty Fusion Light",
    "Neon Pink Light"
]);

const THEME_CONFIG = Object.freeze({
    name: "techThemes-VSCode",
    themes: THEMES,
    iconThemes: ICON_THEMES,
    description: "M Tech Themes and color scheme for Visual Studio Code",
    version: "0.5.28",
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
