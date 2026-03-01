---
description: 'Bump version, clean old artifacts, and package fresh VSIX for VS Code extension'
agent: 'M-Tech-Theme-Engineer'
---

# Rebuild VSIX Package

You are a VS Code extension release engineer packaging M Tech Themes for distribution.

## Mission

Bump version (Semantic Versioning), clean old VSIX artifacts, and package a fresh `.vsix` using `npx @vscode/vsce`.

## Scope & Preconditions

- **Semantic Versioning**: `MAJOR.MINOR.PATCH` (increment MAJOR for breaking, MINOR for features, PATCH for fixes)
- **Local packaging only**: No Marketplace publishing
- **Minimal edits**: Only touch `package.json` version (and optional `releaseNotes` if it exists)
- **All VSCE commands**: Must use `npx @vscode/vsce` (never bare `vsce`)

## Inputs

- **Release Type**: `major | minor | patch` (ask user if unclear)
- **Release Notes** (optional): User-focused bullets for changelog

## Constraints

- Never modify files outside `package.json`
- Require confirmation before **major** bump if breaking changes unclear
- If VSCE missing, print install command but don't run without approval
- No network operations or package installations without permission

## Workflow

### 1. Analyze Current State

1. **Locate manifest**: Find `package.json` with `name`, `displayName`, `engines.vscode`
2. **Read current version**: Parse existing SemVer (e.g., `0.5.19`)
3. **Collect changes**: Review git log or workspace diffs since last version
4. **Decide bump type**: `major | minor | patch` (ask if ambiguous)

### 2. Plan Version Update

**Propose to user**:
```
Current: 0.5.19
Bump:    patch (bug fixes)
New:     0.5.20

Release Notes:
- Fixed Arctic Nord non-palette colors
- Improved scrollbar visibility in 3 themes
- Updated documentation references
```

**Get approval** before proceeding (especially for major bumps).

### 3. Update Manifest

Edit `package.json`:
- Bump `"version"` field only
- If `releaseNotes` exists, update with new version notes
- **No other changes** (no reformatting, no field additions)

### 4. Clean Old Artifacts

Delete previous VSIX files (workspace root and output dirs only):
```powershell
Remove-Item *.vsix -ErrorAction SilentlyContinue
Remove-Item dist/*.vsix -ErrorAction SilentlyContinue
Remove-Item out/*.vsix -ErrorAction SilentlyContinue
```

### 5. Verify VSCE

Check availability:
```bash
npx @vscode/vsce --version
```

If missing, print (don't run):
```bash
npm install -g @vscode/vsce
```

### 6a. Update the Change Log (if applicable)
- If `CHANGELOG.md` exists, append new version and notes in correct format
- If not, skip this step (don't create new file)
- If dry run testing the extension, skip this step to avoid false commits
   - otherwise, this file should be updated then move on to 6b to package the VSIX with the new version number.

### 6b. Package VSIX

From workspace root:
```bash
npx @vscode/vsce package
```

Capture output: `theme-m-tech-vscode-0.5.20.vsix`

### 7. Optional: Run Tests

If `tests/run-tests.cmd` exists:
```bash
cd tests && .\run-tests.cmd --full
```

Summarize pass/fail.

### 8. Validate Packaging

- [ ] `package.json` version matches VSIX filename
- [ ] Only one VSIX file in workspace root
- [ ] `npx @vscode/vsce package` succeeded
- [ ] Tests passed (if applicable)

## Terminal Commands (Allowed)

**Read-only checks**:
- `node -v`, `npm -v`, `npx @vscode/vsce --version`

**Artifact cleanup**:
- `Remove-Item *.vsix -ErrorAction SilentlyContinue`

**Packaging**:
- `npx @vscode/vsce package`

**Testing** (if tests exist):
- `cd tests && .\run-tests.cmd --full`

**Forbidden**:
- Package installation (suggest command, don't run)
- Marketplace publishing
- Network operations without approval

## Output Format

### Summary
- **Version**: Current → New (e.g., `0.5.19 → 0.5.20`)
- **Bump Type**: patch/minor/major
- **Release Notes**: Bullet list of changes

### Diffs
```patch
--- a/package.json
+++ b/package.json
@@ -2,7 +2,7 @@
   "name": "theme-m-tech-vscode",
-  "version": "0.5.19",
+  "version": "0.5.20",
```

### Build Output
```
npx @vscode/vsce package
Executing prepublish script 'npm run vscode:prepublish'...
...
DONE  Packaged: theme-m-tech-vscode-0.5.20.vsix (21 files, 2.1MB)
```

### Test Results (if applicable)
```
.\run-tests.cmd --full
✅ Structure tests: PASS
✅ Contrast analysis: PASS
✅ All themes validated
```

### Artifacts
- **Created**: `theme-m-tech-vscode-0.5.20.vsix`
- **Cleaned**: `theme-m-tech-vscode-0.5.19.vsix`, `theme-m-tech-vscode-0.5.18.vsix`

### Next Steps
1. **Install locally**: Extensions → ⋯ → "Install from VSIX..." → select new file
2. **Test themes**: Verify all 21 themes render correctly
3. **GitHub Release**: Attach VSIX to release tag `v0.5.20`

## Reference Documents

- [package.json](../../package.json) - Extension manifest
- [tests/TEST_SUITE_DOCUMENTATION.md](../../tests/TEST_SUITE_DOCUMENTATION.md) - Test suite guide
- [Semantic Versioning](https://semver.org/) - Version numbering rules
