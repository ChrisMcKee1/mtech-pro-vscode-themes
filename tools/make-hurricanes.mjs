// Derive Hurricanes 2026 Championship themes from the America250 templates.
// America250 is complete + key-clean, so the output inherits valid structure.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THEMES = path.join(__dirname, '..', 'themes');

// ── DARK (Home / black-red jersey): charcoal-black chrome, Hurricanes red, silver ──
const DARK = {
  '#000000': '#000000', '#070C16': '#08080A', '#0E1726': '#0E0E10', '#101A2B': '#161618',
  '#1A2740': '#201F22', '#1C2C4A': '#262528', '#243352': '#2C2B2F', '#2A3550': '#34343A',
  '#2A3A5C': '#34343A', '#2E3B57': '#3A3A40', '#46506A': '#505156', '#5B6B8F': '#6E7176',
  '#6B7795': '#7C7F84', '#7A8499': '#8A8D92', '#8A93A8': '#9A9DA2', '#AEB6C7': '#C0C2C6',
  '#D7DCE6': '#C7C9CC', '#E6E9F0': '#ECECEE', '#FFFFFF': '#FFFFFF',
  // navy accents -> red family
  '#1F4480': '#7E1A1F', '#24467F': '#7E1A1F', '#234A86': '#8E1D22', '#2C5798': '#A01D22',
  '#2E5099': '#A81D22', '#2B5BB5': '#B31D22', '#3F66BC': '#BE2A2F', '#3A6BC4': '#C42A2F',
  '#4A78D0': '#D14A4F', '#5B8DEF': '#E84850',
  // secondary bright blue -> silver (inactive/subtle)
  '#6FA8FF': '#9AA0A4',
  // deep red bg (keep)
  '#6B1A18': '#5A1416',
  // syntax: blue -> steel/silver-cyan (functions)
  '#8FB8E8': '#A9D0DB', '#A5C8EE': '#BFE0E8',
  // greens -> sage (strings)
  '#93C56F': '#9FC078', '#9DC183': '#A6C08A', '#B0CF99': '#B9CE9C',
  // purple -> mauve (numbers)
  '#C9A0D8': '#C99AB8', '#DCC0E8': '#DBBED0',
  // coral/red keywords (on-brand reds)
  '#E08A7A': '#EC8079', '#E5848A': '#F0888C', '#EC6F62': '#F0726B', '#ED6B6F': '#F06A6E', '#F06A6A': '#F26A6A',
  '#E5484D': '#E84850',
  // golds -> storm amber
  '#E3C988': '#E8B978', '#EFD9A8': '#EBCF9E', '#FFD98A': '#F2C98A',
};

// ── LIGHT (Away / white jersey): white/silver chrome, deep red, charcoal text ──
const LIGHT = {
  '#000000': '#000000', '#FFFFFF': '#FFFFFF',
  // creams -> white / silver-grey surfaces
  '#FBF3E2': '#FBFBFC', '#FBF8F2': '#FFFFFF', '#F0E9D8': '#F2F3F5', '#F0E9D7': '#F2F3F5',
  '#EFE7D4': '#EDEFF1', '#EDE2CC': '#E8EAED', '#E4DBC6': '#DEE1E4', '#E2D9C2': '#DADDE0',
  '#DDD4BF': '#D2D5D9', '#DBD0B8': '#CDD1D5', '#DAD0BA': '#CDD1D5', '#D8CEB4': '#C8CCD0',
  '#D8DEE6': '#DDE0E3', '#F3E9D2': '#EFF1F3',
  // dark navy text -> charcoal / near-black
  '#0E1426': '#1A1B1D', '#19202F': '#232427', '#1A2238': '#1B1C1E', '#3A4257': '#3A3B3E',
  '#4A5268': '#4A4B4E', '#4B5870': '#4E4F53', '#5E667C': '#5E6064', '#3C4257': '#3A3B3E',
  '#7C8296': '#76787C', '#7C8799': '#7E8084', '#9A9486': '#8E9094', '#746D5C': '#76787C',
  // navy/blue accents -> Hurricanes deep red
  '#2B5BB5': '#C8102E', '#3C68C0': '#C8102E', '#3F66BC': '#C8102E', '#5C7FC9': '#D63A48',
  '#27508F': '#B31217', '#2B4C8C': '#B31217', '#1E5A7E': '#A8141C', '#2F6E7E': '#B31217',
  '#94ABDC': '#E0888D',
  // red family -> Hurricanes red
  '#A12329': '#A8141C', '#B0413E': '#C03238', '#B23A36': '#C03238', '#C1272D': '#C8102E',
  // golds -> amber
  '#FFD98A': '#E9C98F', '#EFD9A8': '#E4C58C', '#D99A33': '#B5781E', '#C9892E': '#A86B1A', '#9A5B12': '#8A5410',
  // greens -> sage
  '#4F6B30': '#4E6B2E', '#54762F': '#557A2E', '#5A7A3C': '#5E7E3C', '#7F9E50': '#7C9A4E', '#93B05E': '#8FAC5C',
  // purple -> mauve
  '#7A4FB5': '#7A4FA0', '#8A3D6E': '#8A3D6E', '#B49AD6': '#B49AC8',
};

function remapString(str, map, unmapped) {
  return str.replace(/#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?/g, (m) => {
    const base = m.slice(0, 7).toUpperCase();
    const alpha = m.length === 9 ? m.slice(7) : '';
    if (map[base]) return map[base] + alpha;
    unmapped.add(base);
    return m;
  });
}

function deepRemap(node, map, unmapped) {
  if (typeof node === 'string') return remapString(node, map, unmapped);
  if (Array.isArray(node)) return node.map((n) => deepRemap(n, map, unmapped));
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = deepRemap(v, map, unmapped);
    return out;
  }
  return node;
}

function build(srcName, outName, map, meta) {
  const src = JSON.parse(fs.readFileSync(path.join(THEMES, srcName + '.json'), 'utf8'));
  const unmapped = new Set();
  const colors = deepRemap(src.colors || {}, map, unmapped);
  const tokenColors = deepRemap(src.tokenColors || [], map, unmapped);
  const semanticTokenColors = deepRemap(src.semanticTokenColors || {}, map, unmapped);
  const out = {
    name: meta.name, type: meta.type, author: 'tech', uuid: meta.uuid,
    colorSpaceName: 'sRGB', semanticHighlighting: true,
    colors, tokenColors, semanticTokenColors,
  };
  fs.writeFileSync(path.join(THEMES, outName + '.json'), JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`${outName}: written. Unmapped colors: ${unmapped.size ? [...unmapped].join(' ') : 'none'}`);
}

build('America250 Dark', 'Hurricanes Dark', DARK,
  { name: 'Hurricanes Dark', type: 'dark', uuid: 'hurricanes-dark-uuid' });
build('America250 Light', 'Hurricanes Light', LIGHT,
  { name: 'Hurricanes Light', type: 'light', uuid: 'hurricanes-light-uuid' });
