# VS Code Theme Contrast Guidelines
## M Tech Themes - Light/Dark Mode Consistency Rules

**Version:** 2.0  
**Date:** October 17, 2025  
**Purpose:** Ensure perfect contrast and readability across all light and dark theme variants while maintaining each theme's artistic identity.

**Based On:** [Official VS Code Theme Color Reference](https://code.visualstudio.com/api/references/theme-color) - Comprehensive documentation research completed October 17, 2025

---

## 🎨 Core Design Philosophy

### **Golden Rule: Contrast Inversion**
When converting a dark theme to light (or vice versa):
- **Dark backgrounds (#2e3440, #3b4252, #434c5e) → Light backgrounds (#ECEFF4, #E5E9F0, #D8DEE9)**
- **Light foregrounds (#FFFFFF, #ECEFF4, #D8DEE9) → Dark foregrounds (#2E3440, #434C5E, #4C566A)**

### **Preserve Theme Identity**
- **Arctic Nord**: Maintain Nordic color palette (Polar Night, Snow Storm, Frost, Aurora)
- **Tokyo Night/Day**: Preserve neon-soaked urban atmosphere
- **Cyberpunk**: Keep electric, high-voltage aesthetics
- **Enchanted Grove**: Maintain mystical forest character

### **CRITICAL Discovery: Property Precedence**
VS Code has an internal property precedence system. When multiple states apply simultaneously (focus + hover, selection + focus), certain properties override others:

**Example - The GitLens Issue:**
```json
// BEFORE (v0.5.7) - White text on white background when hovering
"list.focusForeground": "#FFFFFF",      // ⚠️ WHITE - Overrides hover!
"list.hoverForeground": "#2E3440",      // ✅ DARK - But gets overridden

// AFTER (v0.5.8) - Text readable in all states
"list.focusForeground": "#ECEFF4",      // ✅ LIGHT GRAY - Readable
"list.hoverForeground": "#2E3440",      // ✅ DARK - Works correctly
```

**When a list item has BOTH focus AND hover states**, `list.focusForeground` takes precedence over `list.hoverForeground`. This caused GitLens commit rows to show white text on white background.

**Testing Multi-State Scenarios:**
Always test these combinations:
1. Focus alone (keyboard navigation)
2. Hover alone (mouse movement)
3. **Focus + Hover** (keyboard navigation while mouse hovering)
4. Selection alone (clicked item)
5. Selection + Focus (selected item with keyboard focus)
6. Selection + Hover (selected item with mouse hover)
7. **Selection + Focus + Hover** (all three states)

### **Invalid Properties Warning**
Some property names may seem logical but **do not exist** in the official VS Code API. Always verify against the [official documentation](https://code.visualstudio.com/api/references/theme-color).

**Example - Removed in Arctic Nord v0.5.8:**
```json
// ❌ THESE PROPERTIES DO NOT EXIST
"scmGraph.historyItemHoverBackground": "#ECEFF4",  // Invalid
"scmGraph.historyItemHoverForeground": "#2E3440",  // Invalid
```

**Why Invalid:** The official "Source Control Graph colors" section only defines:
- `scmGraph.foreground1` through `scmGraph.foreground5` (graph lines)
- `scmGraph.historyItemHoverLabelBackground/Foreground` (tooltips only)
- `scmGraph.historyItemHoverDefaultLabelBackground/Foreground` (default tooltips)
- Other `scmGraph.*` properties for additions, deletions, refs

**GitLens commit rows use standard `list.*` properties**, not custom `scmGraph` hover properties. The `Label` properties control tooltip overlays, not the row itself.

---

## 📋 Complete Property Checklist

### **Critical Properties Requiring Foreground/Background Pairs**

These properties MUST have matching foreground colors when backgrounds are light or dark:

#### **1. Activity Bar**
| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| `activityBar.background` | Dark (#2e3440) | Light (#ECEFF4) |
| `activityBar.foreground` | Light (#FFFFFF) | Dark (#434C5E) |
| `activityBar.inactiveForeground` | Mid-light (#88C0D0) | Mid-dark (#4C566A) |
| `activityBarBadge.background` | Accent (#A3C5F0) | Accent (#5E8AAC) |
| `activityBarBadge.foreground` | Dark (#2e3440) | Light (#ECEFF4) |

#### **2. Buttons (All States)**
| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| `button.background` | Accent (#5E81AC) | Accent (#5E8AAC) |
| `button.foreground` | Light (#FFFFFF) | Light (#ECEFF4) |
| `button.hoverBackground` | Accent variant | Accent variant |
| `button.secondaryBackground` | Dark (#434c5e) | Light (#D8DEE9) |
| `button.secondaryForeground` | Light (#FFFFFF) | Dark (#434C5E) |
| **`button.secondaryHoverBackground`** | **Light (#ECEFF4)** | **Dark (#4C566A)** |
| **`button.secondaryHoverForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |

**⚠️ CRITICAL**: If hover background is light, foreground MUST be dark (and vice versa)!

#### **3. Editor Suggestion Widget**
| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| `editorSuggestWidget.background` | Dark (#434c5e) | Light (#D8DEE9) |
| `editorSuggestWidget.foreground` | Light (#FFFFFF) | Dark (#2E3440) |
| `editorSuggestWidget.highlightForeground` | Light (#FFFFFF) | Dark (#2E3440) |
| **`editorSuggestWidget.selectedBackground`** | **Light (#ECEFF4)** | **Dark (#4C566A)** |
| **`editorSuggestWidget.selectedForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |

#### **4. Input Options (Checkboxes, Radio Buttons)**
| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| `inputOption.activeBackground` | Light (#ECEFF4) | Dark (#4C566A) |
| **`inputOption.activeForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |
| `inputOption.hoverBackground` | Light (#ECEFF4) | Dark (#4C566A) |
| **`inputOption.hoverForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |

#### **5. Keyboard Binding Labels**
| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| `keybindingLabel.background` | Light (#ECEFF4) | Dark (#4C566A) |
| **`keybindingLabel.foreground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |
| `keybindingLabel.border` | Light (#ECEFF4) | Dark (#4C566A) |
| `keybindingLabel.bottomBorder` | Light (#ECEFF4) | Dark (#4C566A) |

#### **6. Lists (All Selection/Hover States)**
| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| `list.activeSelectionBackground` | Light (#ECEFF4) | Dark (#4C566A) |
| **`list.activeSelectionForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |
| **`list.activeSelectionIconForeground`** | **Dark (#2E3440)** 🆕 | **Light (#ECEFF4)** 🆕 |
| `list.hoverBackground` | Light (#ECEFF4) | Dark (#4C566A4D) |
| **`list.hoverForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |
| `list.focusBackground` | Dark (#434c5e) | Light (#D8DEE9) |
| **`list.focusForeground`** | **Light Gray (#ECEFF4)** ⚠️🔥 | **Dark (#2E3440)** ⚠️ |
| **`list.focusOutline`** | **Accent (#88C0D0)** 🆕 | **Accent (#5E81AC)** 🆕 |
| **`list.focusAndSelectionOutline`** | **Accent (#88C0D0)** 🆕 | **Accent (#5E81AC)** 🆕 |
| `list.inactiveFocusBackground` | Dark (#3B4252) 🆕 | Light (#E5E9F0) 🆕 |
| **`list.inactiveFocusOutline`** | **Mid (#4C566A)** 🆕 | **Mid (#D8DEE9)** 🆕 |
| `list.inactiveSelectionBackground` | Dark (#434c5e) | Light (#D8DEE9) |
| `list.inactiveSelectionForeground` | Light (#D8DEE9) | Dark (#3B4252) |
| **`list.inactiveSelectionIconForeground`** | **Light (#D8DEE9)** 🆕 | **Dark (#3B4252)** 🆕 |
| **`list.highlightForeground`** | **Accent (#88C0D0)** 🆕 | **Accent (#5E81AC)** 🆕 |
| `list.dropBackground` | Dark translucent | Light translucent |

**🔥 CRITICAL:** `list.focusForeground` was causing GitLens white-on-white issue. Changed from `#FFFFFF` (pure white) to `#ECEFF4` (light gray) in v0.5.8 to ensure readability when focus + hover states overlap.

**🆕 NEW PROPERTIES (v0.5.8):** Added based on official VS Code Theme Color Reference research:
- `list.focusOutline` - Visible keyboard navigation outline
- `list.focusAndSelectionOutline` - Outline when item is both focused and selected
- `list.activeSelectionIconForeground` - Icon colors for selected items
- `list.inactiveSelectionIconForeground` - Icon colors when selection is inactive
- `list.inactiveFocusBackground` - Background when list has focus but window is inactive
- `list.inactiveFocusOutline` - Outline when focus is inactive
- `list.highlightForeground` - Search match highlights in lists

#### **7. Menu (All States)**
| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| `menu.background` | Dark (#434c5e) | Light (#D8DEE9) |
| `menu.foreground` | Light (#FFFFFF) | Dark (#2E3440) |
| `menu.selectionForeground` | Light (#FFFFFF) | Dark (#2E3440) |
| `menubar.selectionForeground` | Light (#FFFFFF) | Dark (#2E3440) |

#### **8. Notebooks**
| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| `notebook.cellStatusBarItemHoverBackground` | Light (#ECEFF4) | Dark (#4C566A) |
| **`notebook.cellStatusBarItemHoverForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |

#### **9. Peek View**
| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| `peekViewResult.selectionBackground` | Light (#ECEFF4) | Dark (#4C566A) |
| **`peekViewResult.selectionForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |

#### **10. Status Bar (All States)**
| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| `statusBar.background` | Dark (#2e3440) | Light (#ECEFF4) |
| `statusBar.foreground` | Light (#FFFFFF) | Dark (#2E3440) |
| `statusBarItem.activeBackground` | Light (#ECEFF4) | Dark (#4C566A) |
| **`statusBarItem.activeForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |
| `statusBarItem.hoverBackground` | Light (#ECEFF4) | Dark (#4C566A) |
| **`statusBarItem.hoverForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |
| `statusBarItem.prominentHoverBackground` | Light (#ECEFF4) | Dark (#4C566A) |
| **`statusBarItem.prominentHoverForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |

#### **11. Tabs (All Hover States)**
| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| `tab.activeBackground` | Dark (#3b4252) | Light (#E5E9F0) |
| `tab.activeForeground` | Light (#FFFFFF) | Dark (#2E3440) |
| `tab.hoverBackground` | Light (#ECEFF4) | Dark (#4C566A) |
| **`tab.hoverForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |
| `tab.inactiveBackground` | Dark (#2e3440) | Light (#ECEFF4) |
| `tab.inactiveForeground` | Light (#FFFFFF) | Dark (#434C5E) |
| `tab.unfocusedHoverBackground` | Light (#ECEFF4) | Dark (#4C566A) |
| **`tab.unfocusedHoverForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |

#### **12. Welcome Page**
| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| `welcomePage.buttonBackground` | Dark (#434c5e) | Light (#D8DEE9) |
| `welcomePage.buttonHoverBackground` | Light (#ECEFF4) | Dark (#4C566A) |
| **`welcomePage.buttonHoverForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |
| `welcomePage.tileBackground` | Dark (#434c5e) | Light (#D8DEE9) |
| `welcomePage.tileHoverBackground` | Light (#ECEFF4) | Dark (#4C566A) |
| **`welcomePage.tileHoverForeground`** | **Dark (#2E3440)** ⚠️ | **Light (#ECEFF4)** ⚠️ |

#### **13. Source Control Graph (SCM Graph) - GitLens & Git Extensions**
| Property | Dark Theme | Light Theme | Notes |
|----------|-----------|-------------|-------|
| **`scmGraph.foreground1`** | Nord 11 Red (#BF616A) 🆕 | Nord 11 Red (#BF616A) 🆕 | Graph line color 1 |
| **`scmGraph.foreground2`** | Nord 12 Orange (#D08770) 🆕 | Nord 12 Orange (#D08770) 🆕 | Graph line color 2 |
| **`scmGraph.foreground3`** | Nord 13 Yellow (#EBCB8B) 🆕 | Nord 13 Yellow (#EBCB8B) 🆕 | Graph line color 3 |
| **`scmGraph.foreground4`** | Nord 14 Green (#A3BE8C) 🆕 | Nord 14 Green (#A3BE8C) 🆕 | Graph line color 4 |
| **`scmGraph.foreground5`** | Nord Frost (#88C0D0) 🆕 | Nord Frost (#5E81AC) 🆕 | Graph line color 5 |
| **`scmGraph.historyItemHoverLabelBackground`** | Light (#ECEFF4) | Dark (#4C566A) | Tooltip background |
| **`scmGraph.historyItemHoverLabelForeground`** | Dark (#2E3440) ⚠️ | Light (#ECEFF4) ⚠️ | Tooltip text |
| `scmGraph.historyItemHoverDefaultLabelBackground` | Light (#ECEFF4) | Dark (#4C566A) | Default tooltip bg |
| `scmGraph.historyItemHoverDefaultLabelForeground` | Dark (#2E3440) | Light (#ECEFF4) | Default tooltip text |
| **`scmGraph.historyItemHoverAdditionsForeground`** | Nord Green (#A3BE8C) 🆕 | Nord Green (#A3BE8C) 🆕 | +additions indicator |
| **`scmGraph.historyItemHoverDeletionsForeground`** | Nord Red (#BF616A) 🆕 | Nord Red (#BF616A) 🆕 | -deletions indicator |
| **`scmGraph.historyItemRefColor`** | Nord Purple (#B48EAD) 🆕 | Nord Purple (#B48EAD) 🆕 | Reference tags (bright) |
| **`scmGraph.historyItemRemoteRefColor`** | Nord Green (#A3BE8C) 🆕 | Nord Green (#A3BE8C) 🆕 | Remote refs (bright) |
| **`scmGraph.historyItemBaseRefColor`** | Nord Frost (#88C0D0) 🆕 | Nord Frost (#5E81AC) 🆕 | Base refs (bright) |

**⚠️ CRITICAL DISCOVERY - GitLens Commit Rows Use List Properties, NOT scmGraph:**

The following properties **DO NOT EXIST** in the official VS Code API (removed in v0.5.8):
```json
// ❌ INVALID PROPERTIES (DO NOT USE)
"scmGraph.historyItemHoverBackground": "#ECEFF4",  // Not a real property
"scmGraph.historyItemHoverForeground": "#2E3440",  // Not a real property
```

**The Truth:** GitLens commit rows are **standard list items**. They use `list.hoverBackground`, `list.hoverForeground`, `list.focusForeground`, etc.

**Property Breakdown:**
1. **Commit Row Hover** → Uses `list.hoverBackground` and `list.hoverForeground`
2. **Commit Row Focus** → Uses `list.focusBackground` and `list.focusForeground`
3. **Tooltip Overlay** → Uses `scmGraph.historyItemHoverLabelBackground/Foreground`
4. **Graph Lines** → Uses `scmGraph.foreground1` through `scmGraph.foreground5`
5. **Ref Tags** → Uses `scmGraph.historyItemRefColor`, `scmGraph.historyItemRemoteRefColor`, etc.

**Common Symptoms Fixed in v0.5.8:**
- ❌ White text on white background when hovering over GitLens commit **rows** → Fixed by changing `list.focusForeground` from `#FFFFFF` to `#ECEFF4`
- ✅ Tooltips were already working correctly with `scmGraph.historyItemHoverLabel*` properties

**🆕 NEW in v0.5.8:** All `scmGraph` colors now use official Nord palette (Nord 0-15 specification) for 100% theme compliance.

---

## 🔍 Detection Patterns

### **Property Validation Against Official Documentation**

**Step 1: Always Verify Properties Exist**
- ✅ **Reference**: [VS Code Theme Color Reference](https://code.visualstudio.com/api/references/theme-color)
- ❌ **Never assume**: If a property seems logical but isn't documented, it doesn't exist
- 🔍 **Cross-reference**: Compare theme JSON against official property list before adding

**Example Property Verification:**
```json
// ❌ INVALID - Not in official VS Code API (removed in v0.5.8):
"scmGraph.historyItemHoverBackground": "#ECEFF4",   // Doesn't exist
"scmGraph.historyItemHoverForeground": "#2E3440",   // Doesn't exist

// ✅ VALID - Official VS Code properties:
"scmGraph.historyItemHoverLabelBackground": "#ECEFF4",  // Tooltip overlay
"list.hoverBackground": "#ECEFF4",                      // Commit row hover
```

**Property Validation Workflow:**
1. Extract all properties from theme JSON
2. Search official documentation for each property name
3. Flag any property not found in official docs
4. Research intended use case
5. Find correct official property or remove if no alternative exists

**Common Invalid Properties (Do Not Use):**
```json
"scmGraph.historyItemHoverBackground"          // ❌ Use list.hoverBackground instead
"scmGraph.historyItemHoverForeground"          // ❌ Use list.hoverForeground instead
"list.focusAndSelectionBackground"             // ❌ Only outline variant exists
"gitDecoration.renamedResourceBackground"      // ❌ Only foreground exists
```

---

### **How to Find Missing Foreground Properties**

#### **Pattern 1: Light Background Without Foreground**
```json
// ❌ BAD - Light background with no foreground specified
"propertyName.hoverBackground": "#ECEFF4",
// Missing: "propertyName.hoverForeground": "#2E3440"

// ✅ GOOD - Complete pair
"propertyName.hoverBackground": "#ECEFF4",
"propertyName.hoverForeground": "#2E3440"
```

#### **Pattern 2: Search for All Hover/Active/Selection Properties**
```regex
// Search patterns to find potential issues:
(hover|active|selection)Background.*#ECEFF4    // Dark theme
(hover|active|selection)Background.*#4C566A    // Light theme
```

#### **Pattern 3: Check All *Background Properties**
For every property ending in `Background` with a light color (#ECEFF4, #D8DEE9, #E5E9F0), there MUST be a corresponding `Foreground` property with a dark color (#2E3440, #434C5E, #4C566A).

---

## 🛠️ Systematic Fixing Workflow

### **Step 0: Verify All Properties Against Official Documentation** 🆕
```powershell
# Extract all property names from theme JSON
Get-Content "themes/Theme Name.json" | Select-String '"([a-zA-Z]+\.[a-zA-Z\.]+)":\s*"#' | 
  ForEach-Object { $_.Matches.Groups[1].Value } | Sort-Object -Unique

# Manually verify each property exists at:
# https://code.visualstudio.com/api/references/theme-color
```

**Critical Checks:**
- ✅ Property exists in official documentation
- ✅ Property name spelled correctly (case-sensitive)
- ✅ Property applies to intended UI element
- ❌ Remove any properties not found in official docs

---

### **Step 1: Identify All Light Backgrounds in Dark Theme**
```powershell
# Find all light backgrounds in dark theme
Select-String -Path "themes/Theme Name.json" -Pattern "#ECEFF4|#D8DEE9|#E5E9F0" | Select-Object LineNumber, Line
```

### **Step 2: Check for Corresponding Foreground Properties**
For each light background found, check if there's a matching foreground property in the next few lines.

### **Step 3: Add Missing Foreground Properties**
Use the inversion table above to add the correct dark foreground color.

### **Step 4: Test Multi-State Scenarios** 🆕
Test all 7 multi-state combinations from Core Design Philosophy section:
1. Hover alone
2. Focus alone  
3. Focus + Hover (tests property precedence)
4. Selection alone
5. Selection + Hover
6. Focus + Selection
7. Inactive window states

**Example Test for GitLens:**
```
1. Hover over commit row (no focus) → list.hoverForeground applies
2. Click commit row (focus only) → list.focusForeground applies
3. Hover over focused commit row → list.focusForeground takes precedence (!)
```

### **Step 5: Repeat for Light Theme**
Find all dark backgrounds (#2e3440, #3b4252, #434c5e, #4C566A) and ensure they have light foreground properties.

### **Step 6: Validate**
- Reload VS Code window
- Test all hover states, selections, and active states
- **🆕 Test GitLens commit history** (hover, focus, focus+hover)
- Use search, tabs, status bar, welcome screen
- Check autocomplete/IntelliSense suggestions
- **🆕 Verify property precedence** in multi-state scenarios

---

## 📊 Color Contrast Reference

### **WCAG 2.1 Requirements**
- **Normal text**: 4.5:1 minimum contrast ratio
- **UI elements**: 3.0:1 minimum contrast ratio
- **Large text**: 3.0:1 minimum contrast ratio

### **Arctic Nord Color Palette**

#### **Dark Theme Colors**
| Type | Color | Hex | Usage |
|------|-------|-----|-------|
| Background (Darkest) | Polar Night 1 | `#2e3440` | Main background |
| Background (Dark) | Polar Night 2 | `#3b4252` | Editor background |
| Background (Mid-dark) | Polar Night 3 | `#434c5e` | Widgets, inputs |
| Background (Light) | Snow Storm 3 | `#ECEFF4` | Selections, hovers |
| Foreground (on dark) | Snow Storm 3 | `#FFFFFF` | Main text |
| Foreground (on light) | Polar Night 1 | `#2E3440` | Text on light bg |
| Accent (Blue) | Frost | `#A3C5F0` | Links, borders |

#### **Light Theme Colors**
| Type | Color | Hex | Usage |
|------|-------|-----|-------|
| Background (Lightest) | Snow Storm 3 | `#ECEFF4` | Main background |
| Background (Light) | Snow Storm 2 | `#E5E9F0` | Editor background |
| Background (Mid-light) | Snow Storm 1 | `#D8DEE9` | Widgets, inputs |
| Background (Dark) | Polar Night 3 | `#4C566A` | Selections, hovers |
| Foreground (on light) | Polar Night 1 | `#2E3440` | Main text |
| Foreground (on dark) | Snow Storm 3 | `#ECEFF4` | Text on dark bg |
| Accent (Blue) | Frost (darker) | `#5E8AAC` | Links, borders |

---

## ✅ Pre-Release Checklist

Before releasing a theme update, verify:

### **Property Validation** 🆕
- [ ] **All properties verified against official documentation**: https://code.visualstudio.com/api/references/theme-color
- [ ] **No invalid properties** (e.g., scmGraph.historyItemHoverBackground)
- [ ] **Property names spelled correctly** (case-sensitive)
- [ ] **Properties apply to intended UI elements** (verified in documentation)

### **Multi-State Testing** 🆕
- [ ] **Test all 7 multi-state scenarios**:
  - [ ] Hover alone (mouse over unfocused item)
  - [ ] Focus alone (click item, no hover)
  - [ ] Focus + Hover (🔥 tests property precedence)
  - [ ] Selection alone
  - [ ] Selection + Hover
  - [ ] Focus + Selection
  - [ ] Inactive window (all states when window loses focus)
- [ ] **GitLens commit rows**: Test hover, focus, focus+hover combinations
- [ ] **Sidebar lists**: Test Explorer, Search, Extensions in all states
- [ ] **Quick Pick menus**: Test Command Palette item states

### **Foreground/Background Pairings**
- [ ] All `*HoverBackground` properties have matching `*HoverForeground`
- [ ] All `*ActiveBackground` properties have matching `*ActiveForeground`
- [ ] All `*SelectionBackground` properties have matching `*SelectionForeground`
- [ ] All `*FocusBackground` properties have matching `*FocusForeground` 🆕

### **Component-Specific Checks**
- [ ] Keyboard labels are readable (keybindingLabel.*)
- [ ] Input options are readable (inputOption.*)
- [ ] Editor suggestions are readable (editorSuggestWidget.*)
- [ ] Lists are readable (list.*) - **🔥 Check focus + hover combinations**
- [ ] Tabs are readable (tab.*)
- [ ] Status bar is readable (statusBarItem.*)
- [ ] Welcome page is readable (welcomePage.*)
- [ ] Notebook cells are readable (notebook.*)
- [ ] Buttons are readable (button.*)
- [ ] **GitLens commit graph tooltips** (scmGraph.historyItemHoverLabel*) 🆕
- [ ] **GitLens commit graph rows** (list.hoverForeground, list.focusForeground) 🆕

### **Automated Testing**
- [ ] Run automated contrast tests: `cd tests && .\run-tests.cmd --contrast`
- [ ] Run structure validation: `cd tests && .\run-tests.cmd --quick`
- [ ] Check refactor status: `cd tests && .\run-tests.cmd --status`

### **Manual Testing Scenarios**
- [ ] **GitLens commit graph** (🔥 most common missed property!)
  - [ ] Hover over commit row (unfocused)
  - [ ] Click commit row (focus, no hover)
  - [ ] Hover over focused commit row (tests precedence)
  - [ ] Tooltip overlay on commit row
- [ ] Search results (hover, selection, focus)
- [ ] Command Palette (hover, selection, type-ahead highlighting)
- [ ] Settings UI (all input types, checkboxes, dropdowns)
- [ ] Extensions panel (list items, hover, selection)
- [ ] Terminal (ANSI colors, selection)
- [ ] Diff views (additions, deletions, inline changes)
- [ ] Debug console (error, warning, info messages)

---

## 🎯 Common Mistakes to Avoid

### **❌ Mistake #1: Forgetting Hover Foregrounds**
```json
// BAD
"button.secondaryHoverBackground": "#ECEFF4"
// Missing corresponding foreground!

// GOOD
"button.secondaryHoverBackground": "#ECEFF4",
"button.secondaryHoverForeground": "#2E3440"
```

### **❌ Mistake #2: Inconsistent Opacity**
```json
// BAD - List hover uses alpha, but selection doesn't
"list.hoverBackground": "#ECEFF44D",
"list.activeSelectionBackground": "#ECEFF4"

// GOOD - Consistent approach
"list.hoverBackground": "#ECEFF4",
"list.activeSelectionBackground": "#ECEFF4"
```

### **❌ Mistake #3: Copying Dark → Light Without Inversion**
```json
// BAD - Light theme using dark theme's light foreground
"activityBar.background": "#ECEFF4",  // Light bg in light theme
"activityBar.foreground": "#FFFFFF"    // Light fg - NO CONTRAST!

// GOOD - Inverted
"activityBar.background": "#ECEFF4",
"activityBar.foreground": "#434C5E"   // Dark fg on light bg
```

### **❌ Mistake #4: Assuming Default Inheritance**
```json
// BAD - Assuming hover inherits from base
"list.activeSelectionForeground": "#2E3440",
// Missing: "list.hoverForeground"

// GOOD - Explicitly define all states
"list.activeSelectionForeground": "#2E3440",
"list.hoverForeground": "#2E3440"
```

### **❌ Mistake #5: Property Precedence Oversight** 🆕
```json
// BAD - Focus property overrides hover in focus+hover state (v0.5.7)
"list.focusForeground": "#FFFFFF",      // WHITE - Takes precedence!
"list.hoverForeground": "#2E3440",      // DARK - Gets ignored in focus+hover
// Result: White text on white background when hovering over focused GitLens commit row

// GOOD - Both properties work together (v0.5.8)
"list.focusForeground": "#ECEFF4",      // READABLE - Works in focus+hover
"list.hoverForeground": "#2E3440",      // DARK - Works when hover-only
```

**Key Lesson:** When multiple states apply (focus + hover), VS Code uses property precedence. Test all multi-state combinations, not just individual states.

### **❌ Mistake #6: Inventing Properties Not in Official Docs** 🆕
```json
// BAD - These properties seem logical but DON'T EXIST (removed v0.5.8)
"scmGraph.historyItemHoverBackground": "#ECEFF4",   // ❌ Not a real property
"scmGraph.historyItemHoverForeground": "#2E3440",   // ❌ Not a real property
"list.focusAndSelectionBackground": "#88C0D0",      // ❌ Only outline exists

// GOOD - Use official properties verified in documentation
"scmGraph.historyItemHoverLabelBackground": "#ECEFF4",  // ✅ Tooltip overlay
"list.hoverBackground": "#ECEFF4",                      // ✅ Commit row hover
"list.focusAndSelectionOutline": "#88C0D0",             // ✅ Outline only
```

**Key Lesson:** Always verify property names at https://code.visualstudio.com/api/references/theme-color before adding to theme JSON. GitLens commit rows use standard `list.*` properties, not custom `scmGraph` properties.

---

## 📚 Additional Resources

- [VS Code Theme Color Reference](https://code.visualstudio.com/api/references/theme-color)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Nord Color Palette](https://www.nordtheme.com/docs/colors-and-palettes)
- [M Tech Themes Contrast Analysis](./THEME_IMPROVEMENTS_ANALYSIS.md)

---

## 🔄 Version History

**v2.0 (2025-10-17)**: **Major Research-Based Update** - Comprehensive revision based on official VS Code Theme Color Reference documentation research.

**Breaking Discovery**: GitLens commit rows use standard `list.*` properties, not custom `scmGraph` properties for backgrounds.

**Key Changes:**
- **Property Validation Added**: All properties now verified against official VS Code API
- **Invalid Properties Removed**: Documented `scmGraph.historyItemHoverBackground/Foreground` don't exist
- **Property Precedence Explained**: Added Core Design Philosophy section explaining how `list.focusForeground` overrides `list.hoverForeground` in multi-state scenarios
- **Multi-State Testing**: Added 7 test scenarios for focus, hover, selection combinations
- **7 New List Properties**: Added `list.focusOutline`, `list.focusAndSelectionOutline`, `list.activeSelectionIconForeground`, `list.inactiveSelectionIconForeground`, `list.inactiveFocusBackground`, `list.inactiveFocusOutline`, `list.highlightForeground`
- **SCM Graph Clarification**: Separated tooltip properties (`scmGraph.historyItemHoverLabel*`) from commit row properties (standard `list.*`)
- **GitLens Case Study**: Added before/after code examples showing root cause and fix for white-on-white hover issue
- **Detection Patterns Enhanced**: Added property verification workflow and invalid property warnings
- **Systematic Fixing Workflow Updated**: Added Step 0 for property validation and Step 4 for multi-state testing
- **Pre-Release Checklist Expanded**: Added property validation section, multi-state testing requirements, and enhanced GitLens testing scenarios
- **Common Mistakes Extended**: Added Mistake #5 (Property Precedence) and Mistake #6 (Inventing Properties)
- **Official Documentation Citation**: Added reference to https://code.visualstudio.com/api/references/theme-color

**Impact**: Enables systematic refactoring of all 21 M Tech themes with confidence based on authoritative official documentation.

---

**v1.2 (2025-10-17)**: Expanded GitLens properties to include **commit row hover states**. Added `scmGraph.historyItemHoverBackground` and `scmGraph.historyItemHoverForeground` for row hover (separate from tooltip hover). This distinction is critical - GitLens uses TWO SETS of hover properties: one for the commit row itself, one for the tooltip that appears.

**Note (v2.0)**: This version's assumptions were incorrect. The properties `scmGraph.historyItemHoverBackground/Foreground` don't exist in VS Code API. GitLens commit rows actually use standard `list.hoverBackground/Foreground` properties.

---

**v1.1 (2025-10-17)**: Added GitLens Source Control Graph (SCM Graph) properties section. This property was initially missed and discovered through user testing. Added `scmGraph.historyItemHoverLabelBackground` and `scmGraph.historyItemHoverLabelForeground` to critical property checklist.

---

**v1.0 (2025-10-17)**: Initial comprehensive guidelines based on Arctic Nord dark/light theme refactoring. Identified 13 critical property pairs requiring foreground/background coordination.

---

**Maintainers**: Review this document before creating or modifying any theme variants to ensure consistent, accessible contrast across all M Tech Themes.
