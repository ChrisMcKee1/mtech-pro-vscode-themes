// Make Hurricanes Dark syntax aggressively red-forward: keyword/storage scopes
// become Hurricanes red, numbers become mauve (to differ from red keywords).
// Operators, punctuation, braces, markup, strings stay calm to avoid noise.
// Only touches tokenColors + semanticTokenColors (never chrome colors{}).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '..', 'themes', 'Hurricanes Dark.json');

const KEYWORD_FROM = '#9AA0A4'; // silver (shared with punctuation in tokens)
const KEYWORD_RED = '#F0565B';  // Hurricanes red, 5.36:1 on #161618
const NUMBER_FROM = '#F0726B';  // coral
const NUMBER_MAUVE = '#C99AB8';

const REDABLE = /keyword|storage/i;       // promote these to red
const CALM = /operator|punctuation|brace|markup|string|git|scss|sass|mapping\.key|yaml|delimiter/i; // keep silver

const theme = JSON.parse(fs.readFileSync(file, 'utf8'));

// semanticTokenColors: keywords red, numbers mauve
const sem = theme.semanticTokenColors || {};
for (const k of ['keyword', 'keyword-like', 'newOperator']) {
  if (sem[k] === KEYWORD_FROM) sem[k] = KEYWORD_RED;
}
for (const k of ['number', 'numberLiteral', 'customLiteral', 'enumMember', 'variable.readonly', 'property.readonly']) {
  if (sem[k] === NUMBER_FROM) sem[k] = NUMBER_MAUVE;
}

// tokenColors: red for real keyword/storage scopes, mauve for numbers
let redCount = 0, mauveCount = 0, keptSilver = 0;
for (const entry of theme.tokenColors || []) {
  const fg = entry.settings && entry.settings.foreground;
  if (!fg) continue;
  const scope = Array.isArray(entry.scope) ? entry.scope.join(' ') : (entry.scope || '');
  if (fg === KEYWORD_FROM) {
    if (REDABLE.test(scope) && !CALM.test(scope)) { entry.settings.foreground = KEYWORD_RED; redCount++; }
    else keptSilver++;
  } else if (fg === NUMBER_FROM) {
    entry.settings.foreground = NUMBER_MAUVE; mauveCount++;
  }
}

fs.writeFileSync(file, JSON.stringify(theme, null, 2) + '\n', 'utf8');
console.log(`Hurricanes Dark: ${redCount} scopes -> red, ${mauveCount} -> mauve, ${keptSilver} kept silver (punctuation/operators).`);
