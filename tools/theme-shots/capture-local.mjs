// Local theme screenshots via @vscode/test-web + the extension dev path.
//
// Unlike capture.mjs (which uses the PUBLISHED extension on vscode.dev and can
// show Copilot chat), this loads the LOCAL, unpublished theme so we can iterate
// before publishing. Limitation: no Copilot chat panel in this mode.
//
// It renders "Grove Night" and varies the activity-bar icon candidate via
// workbench.colorCustomizations so we can compare them side by side.
//
// Usage (from tools/theme-shots):
//   node capture-local.mjs                 # all candidates -> ./out-local
//   node capture-local.mjs --headed

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const SAMPLE_DIR = join(__dirname, "sample");
const SETTINGS = join(SAMPLE_DIR, ".vscode", "settings.json");
const OUT_DIR = join(__dirname, "out-local");
const PORT = 3720;
const HEADED = process.argv.includes("--headed");

// --theme / --icons let us screenshot any local theme; default Grove Night.
const cliArg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const THEME = cliArg("theme", "Grove Night");
const ICON_THEME = cliArg("icons", `${THEME} Icons`);
const SLUG = THEME.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// final render (activity-bar colors now baked into the theme).
const CANDIDATES = [{ id: "final" }];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function writeSettings(candidate) {
  const settings = {
    "workbench.colorTheme": THEME,
    "workbench.iconTheme": ICON_THEME,
    "workbench.startupEditor": "none",
    "editor.fontSize": 14,
    "editor.lineHeight": 22,
    "editor.fontLigatures": true,
    "editor.minimap.enabled": true,
    "editor.semanticHighlighting.enabled": true,
    "editor.bracketPairColorization.enabled": true,
    "editor.guides.bracketPairs": true,
    "window.commandCenter": true,
  };
  await mkdir(dirname(SETTINGS), { recursive: true });
  await writeFile(SETTINGS, JSON.stringify(settings, null, 2));
}

function startServer() {
  return new Promise((resolvePromise, rejectPromise) => {
    const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
    const child = spawn(
      cmd,
      [
        "@vscode/test-web",
        "--browserType=none",
        `--port=${PORT}`,
        "--extensionDevelopmentPath=" + REPO_ROOT,
        SAMPLE_DIR,
      ],
      { cwd: __dirname, shell: process.platform === "win32" }
    );
    let settled = false;
    let buffer = "";
    const onData = (data) => {
      buffer += data.toString();
      const m = buffer.match(/http:\/\/localhost:\d+\/?[^\s]*/);
      if (!settled && m) {
        settled = true;
        setTimeout(() => resolvePromise({ child, url: m[0] }), 1500);
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("exit", (code) => {
      if (!settled) rejectPromise(new Error(`test-web exited early (${code})`));
    });
    setTimeout(() => {
      if (!settled) rejectPromise(new Error("test-web start timeout"));
    }, 180_000);
  });
}

function killTree(child) {
  if (!child || child.exitCode !== null) return;
  if (process.platform === "win32") {
    spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], { shell: true });
  } else {
    child.kill("SIGKILL");
  }
}

async function captureCandidate(candidate) {
  await writeSettings(candidate);
  const { child, url } = await startServer();
  const browser = await chromium.launch({ headless: !HEADED });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await page.locator(".monaco-workbench").waitFor({ state: "visible", timeout: 60_000 });
    await sleep(6500); // theme + tokenization settle

    // close the Welcome editor, then open showcase.py from the Explorer tree
    // (web Quick Open file search is unreliable on the in-memory mount).
    await page.keyboard.press("F1");
    const palette = page.locator(".quick-input-widget .input, .quick-input-box input").first();
    await palette.waitFor({ state: "visible", timeout: 8000 });
    await page.keyboard.type("View: Close All Editors", { delay: 8 });
    await sleep(400);
    await page.keyboard.press("Enter");
    await sleep(800);

    const row = page.locator('.monaco-list-row:has-text("showcase.py")').first();
    await row.waitFor({ state: "visible", timeout: 8000 });
    await row.dblclick();
    await sleep(1800);
    await page.keyboard.press("Escape");
    await sleep(600);

    // probe actual rendered chrome colors
    const probe = await page.evaluate(() => {
      const bg = (sel) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el).backgroundColor : "(none)";
      };
      return {
        activitybar: bg(".part.activitybar"),
        sidebar: bg(".part.sidebar"),
        titlebar: bg(".part.titlebar"),
        panel: bg(".part.panel"),
        tabs: bg(".part.editor .title.tabs") || bg(".editor-group-container > .title"),
      };
    });
    console.log("    chrome:", JSON.stringify(probe));

    // --- Shot 1: base editor view ---
    const file = join(OUT_DIR, `${SLUG}-${candidate.id}.png`);
    await page.screenshot({ path: file });
    console.log(`  \u2713 ${candidate.id}  \u2192 ${file}`);

    // --- Shot 2: F1 command palette (menu / dropdown contrast) ---
    await page.keyboard.press("F1");
    await page.locator(".quick-input-widget").waitFor({ state: "visible", timeout: 8000 });
    await page.keyboard.type("Preferences: Color Theme", { delay: 6 });
    await sleep(900);
    const paletteFile = join(OUT_DIR, `${SLUG}-${candidate.id}-palette.png`);
    await page.screenshot({ path: paletteFile });
    console.log(`  \u2713 ${candidate.id} palette  \u2192 ${paletteFile}`);
    await page.keyboard.press("Escape");
    await sleep(500);

    // --- Shot 3: selection + occurrence highlight ---
    // double-click a word: selects it (selectionBackground) and highlights
    // every other occurrence (selectionHighlightBackground).
    const editor = page.locator(".monaco-editor").first();
    await editor.click();
    await page.keyboard.press("Control+Home");
    await sleep(300);
    const box = await editor.boundingBox();
    if (box) {
      await page.mouse.dblclick(box.x + 140, box.y + 150);
      await sleep(400);
      // extend with a multi-line drag selection below it for the active block
      await page.mouse.move(box.x + 120, box.y + 220);
      await page.mouse.down();
      await page.mouse.move(box.x + 460, box.y + 340, { steps: 12 });
      await page.mouse.up();
      await sleep(500);
    }
    const selFile = join(OUT_DIR, `${SLUG}-${candidate.id}-selection.png`);
    await page.screenshot({ path: selFile });
    console.log(`  \u2713 ${candidate.id} selection  \u2192 ${selFile}`);
  } finally {
    await browser.close();
    killTree(child);
    await sleep(1500);
  }
}

async function main() {
  // keep prior captures so multi-theme runs accumulate; overwrite per-slug.
  await mkdir(OUT_DIR, { recursive: true });
  for (const c of CANDIDATES) {
    try {
      await captureCandidate(c);
    } catch (err) {
      console.log(`  \u2717 ${c.id}  (${err.message})`);
    }
  }
  console.log(`\nDone \u2192 ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
