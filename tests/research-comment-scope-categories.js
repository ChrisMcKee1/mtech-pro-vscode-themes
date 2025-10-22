// Research: Comment Scope Categories and Appropriate Thresholds
// Analyze the three categories of comment-related scopes

const fs = require('fs');
const path = require('path');

// Helper functions
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return {r, g, b};
};

const getLuminance = ({r, g, b}) => {
  const [rs, gs, bs] = [r/255, g/255, b/255].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const getContrast = (hex1, hex2) => {
  const l1 = getLuminance(hexToRgb(hex1));
  const l2 = getLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

// Scope categorization
const scopeCategories = {
  mainComments: [
    'comment',
    'comment keyword',
    'comment markup.underline.link',
    'comment string',
    'comment punctuation.definition',
    'comment punctuation',
    'comment text'
  ],
  jsdocScopes: [
    'comment storage.type',
    'comment entity.name.type',
    'comment variable',
    'comment variable.other',
    'comment keyword',
    'comment entity.name.tag',
    'comment support',
    'comment support.class'
  ],
  gitStatusScopes: [
    'comment.git-status.header.remote',
    'comment.git-status.header.local',
    'comment.other.git-status.head'
  ],
  otherCommentScopes: [
    'comment keyword.codetag.notation',  // TODO/FIXME
    'punctuation.definition.comment'
  ]
};

console.log('='.repeat(80));
console.log('COMMENT SCOPE CATEGORY RESEARCH');
console.log('='.repeat(80));
console.log('');

// Analyze Arctic Nord as example
const themePath = path.join(__dirname, '..', 'themes', 'Arctic Nord.json');
const theme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
const bg = theme.colors['editor.background'];

console.log('Theme: Arctic Nord');
console.log('Background:', bg);
console.log('');

// Find each scope category
const results = {
  mainComments: [],
  jsdocScopes: [],
  gitStatusScopes: [],
  otherCommentScopes: []
};

theme.tokenColors.forEach(token => {
  const scopes = Array.isArray(token.scope) ? token.scope : [token.scope];
  const foreground = token.settings?.foreground;
  
  if (!foreground) return;
  
  scopes.forEach(scope => {
    // Categorize
    if (scopeCategories.mainComments.some(s => s === scope)) {
      results.mainComments.push({scope, color: foreground, name: token.settings.name});
    } else if (scopeCategories.jsdocScopes.some(s => scope.includes(s.split(' ')[0]) && scope.includes(s.split(' ')[1]))) {
      results.jsdocScopes.push({scope, color: foreground, name: token.settings.name});
    } else if (scopeCategories.gitStatusScopes.some(s => s === scope)) {
      results.gitStatusScopes.push({scope, color: foreground, name: token.settings.name});
    } else if (scope.includes('comment') || scope.includes('Comment')) {
      results.otherCommentScopes.push({scope, color: foreground, name: token.settings.name});
    }
  });
});

// Report findings
console.log('📝 CATEGORY 1: MAIN COMMENTS (De-emphasized, 4.0-6.0:1)');
console.log('-'.repeat(80));
if (results.mainComments.length > 0) {
  const mainComment = results.mainComments[0];
  const contrast = getContrast(mainComment.color, bg);
  console.log(`Scope: ${mainComment.scope}`);
  console.log(`Color: ${mainComment.color}`);
  console.log(`Contrast: ${contrast.toFixed(2)}:1`);
  console.log(`Status: ${contrast >= 4.0 && contrast <= 6.0 ? '✅ Optimal' : contrast < 4.0 ? '❌ Too low' : '⚠️ Too vivid'}`);
  console.log('Purpose: Regular code comments, should be legible but not distracting');
} else {
  console.log('❌ No main comment scopes found');
}
console.log('');

console.log('📚 CATEGORY 2: JSDOC/NESTED SCOPES (Clarity, semantic meaning)');
console.log('-'.repeat(80));
if (results.jsdocScopes.length > 0) {
  results.jsdocScopes.forEach(item => {
    const contrast = getContrast(item.color, bg);
    console.log(`${item.scope}`);
    console.log(`  Color: ${item.color} | Contrast: ${contrast.toFixed(2)}:1`);
  });
  console.log('');
  console.log('Purpose: Syntax highlighting WITHIN comments (JSDoc types, parameters)');
  console.log('Philosophy: Provides clarity - NOT meant to be muted like main comments');
  console.log('Recommendation: Allow higher contrast (6.0-10.0:1) for semantic meaning');
} else {
  console.log('ℹ️ No JSDoc scopes defined');
}
console.log('');

console.log('🔀 CATEGORY 3: GIT STATUS SCOPES (Visual indicators, semantic)');
console.log('-'.repeat(80));
if (results.gitStatusScopes.length > 0) {
  results.gitStatusScopes.forEach(item => {
    const contrast = getContrast(item.color, bg);
    const semantic = item.scope.includes('remote') ? 'Remote changes (red/pink)' :
                     item.scope.includes('local') ? 'Local changes (blue/cyan)' :
                     'HEAD indicator (white/bright)';
    console.log(`${item.scope}`);
    console.log(`  Color: ${item.color} | Contrast: ${contrast.toFixed(2)}:1`);
    console.log(`  Semantic: ${semantic}`);
  });
  console.log('');
  console.log('Purpose: Status indicators in git status view (not code comments!)');
  console.log('Philosophy: High contrast intentional - users need to see what changed');
  console.log('Recommendation: Allow ANY contrast (semantic color coding more important)');
} else {
  console.log('ℹ️ No git status scopes defined');
}
console.log('');

console.log('🏷️  CATEGORY 4: OTHER COMMENT SCOPES');
console.log('-'.repeat(80));
if (results.otherCommentScopes.length > 0) {
  results.otherCommentScopes.forEach(item => {
    const contrast = getContrast(item.color, bg);
    console.log(`${item.scope}`);
    console.log(`  Color: ${item.color} | Contrast: ${contrast.toFixed(2)}:1`);
  });
  console.log('');
  console.log('Examples: TODO/FIXME tags, comment punctuation');
  console.log('Recommendation: Case-by-case evaluation');
}
console.log('');

console.log('='.repeat(80));
console.log('PROPOSED TEST HARNESS UPDATES');
console.log('='.repeat(80));
console.log('');
console.log('Current Issue: Test treats ALL comment scopes as "should be de-emphasized"');
console.log('');
console.log('Proposed Solution:');
console.log('1. Main comments: Enforce 4.0-6.0:1 range (current rule) ✅');
console.log('2. JSDoc scopes: EXCLUDE from vivid check (semantic meaning) 🆕');
console.log('3. Git status: EXCLUDE entirely (status indicators, not comments) 🆕');
console.log('4. TODO/FIXME: Allow brighter (intentionally draw attention) 🆕');
console.log('');
console.log('Expected Impact: Reduce false positives from ~80 to ~10-15 actual issues');
