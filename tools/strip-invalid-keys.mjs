// One-off cleanup: remove non-official workbench color keys, migrate the one
// key that carries real intent. Line-based to preserve existing formatting.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = path.join(__dirname, '..', 'themes');

// quickInputList.focusHighlightForeground is invalid, but list.focusHighlightForeground
// is the valid equivalent -> rename in place (unless valid key already present).
const MIGRATE = {
  'quickInputList.focusHighlightForeground': 'list.focusHighlightForeground',
};

// Pure deletions (not in the official VS Code Theme Color Reference, 2026-06-10).
const DELETE = new Set([
  'chat.requestBubbleForeground', 'quickInput.border', 'quickInputList.hoverBackground',
  'button.secondaryHoverForeground', 'chat.inputWorkingBorderColor1', 'chat.inputWorkingBorderColor2',
  'chatBarTitle.background', 'chatBarTitle.foreground', 'commandCenter.debuggingForeground',
  'inlineChat.regionHighlight', 'editorMinimap.inlineChatRemoved', 'panel.dropBackground',
  'scmGraph.historyItemHoverLabelBackground', 'settings.modifiedItemForeground',
  'sessionsSidebar.background', 'sessionsSidebar.border', 'sessionsSidebarHeader.background',
  'sessionsSidebarHeader.foreground', 'testing.message.error.decorationForeground',
  'testing.coveredMinimapBackground', 'testing.uncoveredMinimapBackground',
  'welcomePage.buttonBackground', 'welcomePage.buttonHoverBackground', 'welcomePage.buttonHoverForeground',
  'welcomePage.tileHoverForeground', 'welcomePage.tileShadow', 'inputOption.hoverForeground',
  'notebook.cellStatusBarItemHoverForeground', 'statusBarItem.activeForeground',
  'welcomePage.buttonForeground', 'welcomePage.foreground',
  'diffEditor.insertedTextForeground', 'diffEditor.removedTextForeground',
]);

const keyAtLineStart = (line) => {
  const m = line.match(/^\s*"([^"]+)"\s*:/);
  return m ? m[1] : null;
};

let totalDeleted = 0, totalMigrated = 0, filesChanged = 0;

for (const file of fs.readdirSync(THEMES_DIR).filter(f => f.endsWith('.json')).sort()) {
  const full = path.join(THEMES_DIR, file);
  const raw = fs.readFileSync(full, 'utf8');
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const lines = raw.split(/\r?\n/);

  // Detect the indentation slice that belongs to the colors{} block only.
  const parsed = JSON.parse(raw);
  const hasValidMigrationTarget = new Set(
    Object.values(MIGRATE).filter(v => v in (parsed.colors || {}))
  );

  const out = [];
  let deleted = 0, migrated = 0;
  for (const line of lines) {
    const key = keyAtLineStart(line);
    if (key && DELETE.has(key)) { deleted++; continue; }
    if (key && MIGRATE[key]) {
      const target = MIGRATE[key];
      if (hasValidMigrationTarget.has(target)) { deleted++; continue; } // valid key already present -> drop dupe
      out.push(line.replace(`"${key}"`, `"${target}"`));
      migrated++;
      continue;
    }
    out.push(line);
  }

  // Fix any dangling comma left when the deleted key was the last entry in a block.
  for (let i = 0; i < out.length; i++) {
    if (/,\s*$/.test(out[i])) {
      let j = i + 1;
      while (j < out.length && out[j].trim() === '') j++;
      if (j < out.length && /^\s*[}\]]/.test(out[j])) {
        out[i] = out[i].replace(/,(\s*)$/, '$1');
      }
    }
  }

  const result = out.join(eol);
  JSON.parse(result); // guard: must still parse

  if (deleted || migrated) {
    fs.writeFileSync(full, result, 'utf8');
    filesChanged++;
    totalDeleted += deleted;
    totalMigrated += migrated;
    console.log(`  ${file}: -${deleted} deleted, ~${migrated} migrated`);
  }
}

console.log(`\nDone. ${filesChanged} files changed, ${totalDeleted} deletions, ${totalMigrated} migrations.`);
