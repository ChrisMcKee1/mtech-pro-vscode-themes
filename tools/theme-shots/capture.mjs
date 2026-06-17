// Screenshots every M Tech theme using the vscode.dev theme-preview deep link.
//
// The URL https://vscode.dev/editor/theme/<extId>/<Theme%20Label> loads the
// PUBLISHED extension and applies the named theme to a sample editor. We just
// swap the label and capture a PNG per theme.
//
// Usage (from tools/theme-shots):
//   npm run setup                       # one-time: deps + Playwright Chromium
//   npm run capture                     # all 23 themes -> ./out
//   node capture.mjs --only "Copper Bloom"
//   node capture.mjs --headed           # watch it run

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdir, rm } from "node:fs/promises";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "out");
const EXT_ID = "M-Tech.theme-m-tech-vscode";
const BASE = `https://vscode.dev/editor/theme/${EXT_ID}/`;

// 16:10 gives the best marketplace framing; 2x scale keeps it razor sharp.
const VIEWPORT = { width: 1600, height: 1000 };
const SCALE = 2;

const THEMES = [
  "Obsidian Moss",
  "Graphite Bay",
  "Copper Bloom",
  "Chroma Void",
  "Digital Aqua",
  "Sandstone Light",
  "Cyberpunk Neon",
  "Tokyo Night",
  "Tokyo Day",
  "Arctic Nord",
  "Arctic Nord Light",
  "OGE Dark",
  "OGE Light",
  "Feisty Fusion",
  "Cosmic Void",
  "Enchanted Grove",
  "Enchanted Grove Dark",
  "Mystic Dusk",
  "Morning Coffee",
  "Evening Espresso",
  "Feisty Fusion Light",
  "Neon Pink Light",
  "Cosmic Void Light",
];

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const HEADED = args.includes("--headed");
const ONLY = getArg("only", null);

const themeList = ONLY ? THEMES.filter((t) => t === ONLY) : THEMES;
if (themeList.length === 0) {
  console.error(`No theme matched --only "${ONLY}". Valid labels:\n  ${THEMES.join("\n  ")}`);
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function clearNotifications(page) {
  // The theme-preview "Welcome! ... Install / Cancel" toast lands bottom-right,
  // overlapping the chat input. Clear all notifications via the command palette.
  await page.keyboard.press("F1");
  const qi = page.locator(".quick-input-widget");
  try {
    await qi.waitFor({ state: "visible", timeout: 5000 });
    await page.keyboard.type("Clear All Notifications", { delay: 8 });
    await sleep(350);
    await page.keyboard.press("Enter");
    await sleep(400);
    if (await qi.isVisible().catch(() => false)) await page.keyboard.press("Escape");
  } catch {
    /* palette unavailable */
  }

  // Belt-and-braces: click any lingering toast close (x) icons.
  const closers = page.locator(
    '.notifications-toasts .codicon-notifications-clear, .notification-toast .codicon-notifications-clear'
  );
  const n = await closers.count();
  for (let i = 0; i < n; i++) {
    try {
      await closers.nth(i).click({ timeout: 500 });
    } catch {
      /* already gone */
    }
  }
  await sleep(400);
}

async function openChatWithPrompt(page) {
  // Open the secondary side bar (chat) if it isn't already showing.
  const aux = page.locator(".part.auxiliarybar");
  const alreadyOpen = await aux.isVisible().catch(() => false);
  if (!alreadyOpen) {
    const btn = page.locator('[aria-label*="Secondary Side Bar"]').first();
    if (await btn.count()) {
      await btn.click();
    } else {
      await page.keyboard.press("Control+Alt+B");
    }
    await sleep(1500);
  }

  // Focus the chat input and type a prompt ending in "#" so the context picker
  // dropdown pops open. Try the known chat-input selectors, then fall back to
  // the last Monaco editor inside the side bar.
  const input = aux
    .locator(
      '.chat-input-container .monaco-editor, .interactive-input-editor .monaco-editor, .monaco-editor'
    )
    .last();
  try {
    await input.click({ timeout: 5000 });
    await page.keyboard.type("hello ", { delay: 35 });
    await page.keyboard.type("#", { delay: 80 });
    await sleep(1600); // let the # context picker render
  } catch {
    /* chat input not available - capture without it */
  }
}

async function captureTheme(page, label) {
  await page.goto(BASE + encodeURIComponent(label), {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  await page.locator(".monaco-workbench").waitFor({ state: "visible", timeout: 90_000 });
  // Let the extension install + theme + tokenization settle.
  await sleep(7000);
  await clearNotifications(page);
  await sleep(800);
  await openChatWithPrompt(page);

  const file = join(OUT_DIR, `${label.replace(/[^\w.-]+/g, "_")}.png`);
  await page.screenshot({ path: file });
  return file;
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: !HEADED });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
  });
  const page = await context.newPage();

  try {
    let done = 0;
    for (const label of themeList) {
      try {
        const file = await captureTheme(page, label);
        done += 1;
        console.log(`  \u2713 ${label}  \u2192 ${file}`);
      } catch (err) {
        console.log(`  \u2717 ${label}  (${err.message})`);
      }
    }
    console.log(`\nDone. ${done}/${themeList.length} themes captured \u2192 ${OUT_DIR}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
