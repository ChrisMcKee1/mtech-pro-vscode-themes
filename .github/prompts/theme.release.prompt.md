---
description: 'Complete release workflow: commit, push, GitHub release, README update. Marketplace publishing automated via GitHub Actions.'
agent: 'M-Tech-Theme-Engineer'
---

# Release to GitHub

You are a VS Code extension release manager publishing M Tech Themes to GitHub with complete automation and documentation hygiene.

## Mission

Execute a **complete release workflow**: stage/commit all changes, push to GitHub, delete old releases (if needed), create new release with VSIX attachment, update README version references while maintaining its streamlined, user-focused clarity. **Marketplace publishing happens automatically via GitHub Actions on release creation.**

## Scope & Preconditions

- **VSIX must exist**: Run `/build-vsix` first to create packaged extension
- **Clean working state**: All changes should be ready to commit
- **GitHub CLI or manual**: Use `gh` CLI if available, otherwise provide manual steps
- **README philosophy**: Keep it short, concise, streamlined - users want to download and use, not read changelogs
- **Marketplace publishing**: Automated via `.github/workflows/publish-marketplace.yml` - triggers on release publication

## Inputs

- **Version**: Read from `package.json` (e.g., `0.6.0`)
- **Release Notes** (optional): Brief bullets for GitHub release description
- **Release Tag**: `v{VERSION}` (e.g., `v0.6.0`)

## Constraints

- **GitHub release is primary**: Create GitHub release to trigger automatic Marketplace publishing
- **README must stay concise**: Remove version history, past changes, "What's New" sections
- **README focus**: Installation → Theme list → Quick start (that's it)
- **No network operations without approval**: Always ask before pushing/creating releases
- **Preserve README tone**: Professional, confident, user-centric

## Workflow

### 1. Verify Prerequisites

Check these exist before proceeding:
- [ ] `package.json` version updated (e.g., `0.5.22`)
- [ ] VSIX file in root: `theme-m-tech-vscode-{VERSION}.vsix`
- [ ] Git working directory clean (or changes ready to commit)
- [ ] GitHub CLI available (`gh --version`) or manual release planned

### 2. Update README Version References

**Critical**: Keep README **short, concise, and streamlined**. Users want to:
1. Download the extension
2. See what themes exist
3. Start using it immediately

**What to UPDATE in README**:
- Version numbers in download links (if hardcoded)
- Latest release badge/link references
- Installation step URLs pointing to `releases/latest`

**What to REMOVE from README** (if present):
- Version history sections ("Version 0.5.0", "What's New in v0.5.1")
- Detailed changelogs ("Fixed this theme", "Updated that color")
- "Recent Updates" or "Latest Changes" sections
- Redundant installation troubleshooting not needed by 90% of users

**What to KEEP in README**:
- Simple, direct installation instructions
- Complete theme list (users want to see options)
- Quick commands for theme switching
- Minimal troubleshooting (common issues only)
- Single-paragraph "Why M Tech Themes?" value prop

**Example README Philosophy**:
```markdown
❌ DON'T INCLUDE:
## What's New in v0.5.22
- Fixed yellow contrast in Enchanted Grove
- Updated green hierarchy for better visibility
- Improved scrollbar colors

✅ DO INCLUDE:
## 📦 Installation
1. Download latest VSIX from [Releases](link)
2. Install via Extensions → Install from VSIX
3. Select theme: Ctrl+Shift+P → "M Tech Themes: Select Theme"
```

**Reasoning**: Changelogs belong in:
- GitHub release notes
- CHANGELOG.md file
- Git commit messages
NOT in the README, which is the first-impression marketing page.

### 3. Stage and Commit All Changes

Review unstaged/staged changes:
```powershell
git status
```

Stage all changes:
```powershell
git add .
```

Commit with semantic message:
```powershell
git commit -m "chore: release v{VERSION}"
```

**Alternative commit messages** (choose based on context):
- `chore: release v{VERSION}` (standard release)
- `feat: release v{VERSION} with [major feature]` (feature release)
- `fix: release v{VERSION} with critical fixes` (patch release)

### 4. Create Git Tag

Create annotated tag for the release:
```powershell
git tag -a v{VERSION} -m "Release v{VERSION}"
```

**Example**:
```powershell
git tag -a v0.5.22 -m "Release v0.5.22: Enchanted Grove color corrections"
```

**Verify tag created**:
```powershell
git tag --list
```

### 5. Push to GitHub

Push commits and tags together:
```powershell
git push origin main
git push origin v{VERSION}
```

**Or push all tags at once**:
```powershell
git push origin main --follow-tags
```

**Example**:
```powershell
git push origin main
git push origin v0.5.22
```

### 6. Delete Old GitHub Release (If Exists)

**Option A: Using GitHub CLI** (preferred):
```powershell
gh release delete v{OLD_VERSION} --yes
```

**Option B: Manual via GitHub Web**:
1. Go to `https://github.com/{OWNER}/{REPO}/releases`
2. Find old release (e.g., `v0.5.21`)
3. Click "Delete" → Confirm deletion

**Note**: Only delete if replacing same version or cleaning up. Keep historical releases for user reference.

### 7. Create New GitHub Release

**IMPORTANT**: The Git tag must exist before creating the release. GitHub releases are built on top of Git tags.

**Option A: Using GitHub CLI** (preferred):
```powershell
gh release create v{VERSION} `
  theme-m-tech-vscode-{VERSION}.vsix `
  --title "M Tech Themes v{VERSION}" `
  --notes "Release notes here"
```

**Example with multi-line notes**:
```powershell
gh release create v0.5.22 `
  theme-m-tech-vscode-0.5.22.vsix `
  --title "M Tech Themes v0.5.22" `
  --notes "**Enchanted Grove Improvements**

🟡 Fixed yellow visibility (6.5:1 contrast)
🌲 Refined green hierarchy
♿ WCAG AAA accessibility compliance"
```

**Option B: Manual via GitHub Web**:
1. Go to `https://github.com/{OWNER}/{REPO}/releases/new`
2. **Tag**: `v{VERSION}` (e.g., `v0.5.22`)
3. **Title**: `M Tech Themes v{VERSION}`
4. **Description**: Paste release notes (keep brief, user-focused)
5. **Attach VSIX**: Drag `theme-m-tech-vscode-{VERSION}.vsix` into assets
5. Click **"Publish release"**

### 8. Validate Release

Check these post-release:
- [ ] Release visible at `https://github.com/{OWNER}/{REPO}/releases/latest`
- [ ] VSIX file attached and downloadable
- [ ] Release notes formatted correctly
- [ ] Git tag exists: `git tag --list | grep v{VERSION}`
- [ ] README links point to correct version (if hardcoded)
- [ ] No version history pollution in README

### 9. Final Cleanup

Optional local cleanup:
```powershell
# Remove local VSIX (it's on GitHub now)
Remove-Item theme-m-tech-vscode-{VERSION}.vsix

# Or keep for testing
```

### 10. Automatic Marketplace Publishing

**Automated via GitHub Actions**: When you create/publish a GitHub release, the `.github/workflows/publish-marketplace.yml` workflow automatically:

1. Detects the new release publication
2. Checks out the code
3. Installs `@vscode/vsce` tooling
4. Publishes to VS Code Marketplace using the `VSCE_PAT` secret
5. Notifies success or failure in the Actions log

**Monitoring the Publish**:
- Go to: `https://github.com/{OWNER}/{REPO}/actions`
- Find the "Publish to VS Code Marketplace" workflow run
- Check logs for publish status
- Extension appears on Marketplace within 5-10 minutes

**Post-Publish Validation** (after ~10 minutes):
- [ ] Extension visible at: `https://marketplace.visualstudio.com/items?itemName=M-Tech.theme-m-tech-vscode`
- [ ] Extension searchable in VS Code Extensions view (Ctrl+Shift+X)
- [ ] Install from Marketplace works correctly
- [ ] Version number matches the release

**If Publishing Fails**:
1. Check GitHub Actions logs for error details
2. Common issues:
   - PAT expired: Update `VSCE_PAT` secret via `gh secret set VSCE_PAT`
   - Validation errors: Check `package.json` keywords (<30), HTTPS URLs only
   - Name collision: Verify publisher name in `package.json`
3. Re-run failed workflow or create new release to retry

## Terminal Commands (Allowed)

**Git operations**:
- `git status` - Check working state
- `git add .` - Stage all changes
- `git commit -m "message"` - Commit with message
- `git push origin main` - Push to remote
- `git tag v{VERSION}` - Create version tag
- `git push origin v{VERSION}` - Push tag
- `git push origin main --follow-tags` - Push commits and tags together

**GitHub CLI**:
- `gh --version` - Check CLI availability
- `gh release list` - List existing releases
- `gh release delete v{VERSION} --yes` - Delete release
- `gh release create v{VERSION} {FILE} --title "{TITLE}" --notes "{NOTES}"` - Create release
- `gh secret set VSCE_PAT` - Update Marketplace PAT secret (if needed)

**File operations**:
- `Remove-Item *.vsix` - Clean old VSIX files

**Forbidden**:
- Manual marketplace publishing (automated via GitHub Actions)
- Network operations without explicit approval
- Modifying files outside README and git operations

## Output Format

### Summary
- **Version**: Current release (e.g., `v0.5.22`)
- **Release Tag**: Git tag created/used
- **VSIX File**: Filename attached to release
- **README Updates**: Changes made to keep it concise

### Git Operations
```
git add .
git commit -m "chore: release v0.5.22"
git tag -a v0.5.22 -m "Release v0.5.22"
git push origin main
git push origin v0.5.22
```

**Or with follow-tags**:
```
git add .
git commit -m "chore: release v0.5.22"
git tag -a v0.5.22 -m "Release v0.5.22"
git push origin main --follow-tags
```

### GitHub Release
```
gh release create v0.5.22 \
  theme-m-tech-vscode-0.5.22.vsix \
  --title "M Tech Themes v0.5.22" \
  --notes "Brief release notes"
```

**Or Manual Steps**:
1. Go to: `https://github.com/ChrisMcKee1/mtech-pro-vscode-themes/releases/new`
2. Tag: `v0.5.22`
3. Title: `M Tech Themes v0.5.22`
4. Attach: `theme-m-tech-vscode-0.5.22.vsix`
5. Publish

### README Changes
```patch
--- a/README.md
+++ b/README.md
@@ -15,7 +15,7 @@
 ### **Step 1: Download**
-1. **Go to [Releases](https://github.com/ChrisMcKee1/mtech-pro-vscode-themes/releases/tag/v0.5.21)**
+1. **Go to [Releases](https://github.com/ChrisMcKee1/mtech-pro-vscode-themes/releases/latest)**
```

**Removed Sections** (if any):
- ❌ Version history (lines 180-215)
- ❌ "What's New" section (lines 150-165)
- ❌ Detailed changelog (belongs in CHANGELOG.md)

### Validation
- [ ] Release live: `https://github.com/ChrisMcKee1/mtech-pro-vscode-themes/releases/tag/v0.5.22`
- [ ] VSIX downloadable: 425.42 KB file attached
- [ ] README stays under 200 lines (concise, streamlined)
- [ ] No version pollution in README

## README Philosophy Reminder

**The README is NOT a changelog**. It's a landing page to:
1. **Convince** users this extension is worth their time
2. **Show** them what themes are available
3. **Get** them installed and using it in <2 minutes

**Everything else** (version history, technical details, contribution guides) belongs in:
- `CHANGELOG.md` - Detailed version history
- `RELEASE_NOTES_v{VERSION}.md` - Per-version deep dives
- GitHub release notes - Brief highlights
- Documentation files - Architecture, testing, development

**Keep README short, punchy, and user-focused**. Every paragraph should answer: "Why should I download this?"

## Reference Documents

- [package.json](../../package.json) - Version source of truth
- [README.md](../../README.md) - User-facing landing page (keep concise!)
- [CHANGELOG.md](../../CHANGELOG.md) - Detailed version history (update here, not README)
- [GitHub Releases](https://github.com/ChrisMcKee1/mtech-pro-vscode-themes/releases) - Release archive
- [GitHub Actions Workflow](../../.github/workflows/publish-marketplace.yml) - Automated Marketplace publishing
- [VS Code Publishing Docs](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) - Marketplace publishing reference

## Post-Release Checklist

After successful GitHub release:
- [ ] Test download from GitHub releases page
- [ ] Verify VSIX installs correctly in fresh VS Code
- [ ] Check all 21 themes load without errors
- [ ] Confirm README renders cleanly on GitHub
- [ ] No broken links in README
- [ ] README stays concise (no version history bloat)

**Monitor Automated Marketplace Publishing** (~10 minutes after release):
- [ ] GitHub Actions workflow completed successfully: `https://github.com/{OWNER}/{REPO}/actions`
- [ ] Extension visible at `https://marketplace.visualstudio.com/items?itemName=M-Tech.theme-m-tech-vscode`
- [ ] Extension searchable in VS Code Extensions view (Ctrl+Shift+X)
- [ ] Install from Marketplace works correctly
- [ ] Version number matches the release
- [ ] Auto-update mechanism functional for existing users

## Example Release Notes (GitHub-Appropriate)

Keep release notes **brief and user-focused**:

```markdown
**Enchanted Grove Color Corrections**

🟡 Fixed modified file indicator visibility (6.5:1 contrast)
🌲 Refined green color hierarchy for better icon distinction
✨ Comprehensive: 60+ properties updated
♿ Accessibility: Exceeds WCAG AAA standards

**Installation**: Download VSIX → Extensions → Install from VSIX
```

**NOT this** (too technical for release notes):
```markdown
❌ TOO DETAILED:
- Changed #DAA520 to #B8860B across 50 properties
- Updated activityBar.foreground from #32CD32 to #2E8B57
- PowerShell bulk replacement of 4 yellow hex codes
- Modified line 237, 239, 423, 427 in theme JSON
```

Save technical details for:
- Git commit messages
- Pull request descriptions
- Internal documentation
- CHANGELOG.md file
