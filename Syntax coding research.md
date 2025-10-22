Best Practices for Designing an Ultimate Code
 Syntax Highlighting Theme (2025)
 Designing a top-tier editor theme is both an art and a science. Modern research and years of community
 experience have converged on certain best practices for syntax coloring. Below, we outline 2025’s best
 practices – from cognitive research insights to practical color choices – to help you craft the “ultimate”
 theme syntax. We focus on code token coloring (classes, functions, braces, etc.) rather than general UI
 theming. All key principles are backed by sources, and a comprehensive checklist of VS Code token
 categories is included.
 Why Syntax Highlighting Matters (and the Science Behind It)
 Syntax highlighting isn’t just aesthetics – it can improve code comprehension and reduce mental effort.
 Studies using eye-tracking and even fMRI have shown that color cues help programmers read and
 understand code faster. For example, one controlled experiment found that developers completed code
 tasks significantly faster with syntax highlighting than without (especially less experienced devs) .
 Uniquely colored tokens also make certain bugs obvious – e.g. an unclosed string literal stands out
 immediately when everything after it turns the string’s color . Eye-tracker data suggests highlighting lets
 you mentally “skip over” structural keywords and focus on the meaningful parts: programmers fixate less
 on language keywords when those keywords are colored distinctly, indicating they can parse structure
 at a glance .
 1
 2
 3
 4
 5
 5
 At the same time, too much highlighting can backfire. If you paint every token a different bright color,
 nothing stands out – the eye loses a clear focal point . A theme where “everything is highlighted”
 effectively highlights nothing . The brain adapts and the colors blur together. The lesson: strategic
 contrast is key. Good syntax themes deliberately decide which elements deserve high contrast color and
 which should stay subtle . This reduces extraneous cognitive load and guides the eye to what matters in
 code.
 Color Palette and Contrast Considerations
 6
 7
 Choose a balanced color palette for your theme before mapping it to syntax. Many popular themes use 5
7 distinct hues for code tokens, not counting shades for UI. Using too many colors can overwhelm (and you
 likely can’t remember what each color means) . Instead, allocate a small set of vivid, distinguishable
 colors and reuse them across token types wisely. Contrast is a scarce resource, so “spend” it where it provides
 information . For example, if two token categories are easily told apart by context (like numbers vs.
 string escapes), you don’t need separate colors for them . But if two things could be confused (e.g.
 class names vs. variable names), give them different colors for clarity .
 8
 7
 9
 1
When picking colors, follow some universal conventions and avoid common pitfalls:
 • 
• 
• 
• 
• 
• 
Reserve red for errors/alerts. Nearly every scheme avoids using pure red for normal code, because
 red draws attention and is associated with errors or breakpoints
 10
 . Save it for squiggly underlines,
 error tokens, or removed diff lines, not for everyday identifiers.
 Ensure sufficient contrast. Each syntax color should be clearly distinguishable from the
 background and from other token colors
 11
 . For dark themes, this often means using fairly
 saturated mid-brightness colors (avoid very dark tones that fade into a dark background, and
 extremely bright tones that cause eye strain or “glow”)
 12
 . For light themes, pure white
 backgrounds can support a range of darker colors, but extremely bright colors (like pure yellow) can
 be hard to read on white
 13
 14
 . In both cases, test your colors for contrast (a 4.5:1 contrast ratio is a
 good minimum ).
 Avoid clashing hues. Steer clear of unpleasant combinations like red on blue or green on yellow for
 large text regions
 15
 backgrounds)
 16
 17
 . These can cause visual vibration or halation (bright text glowing on dark
 . Instead, use colors that harmonize well. Many themes draw from proven
 palettes (e.g. Monokai’s neon pastels, or the Material/One Dark palette of softer “chalky” colors).
 Learn from Solarized’s research. The popular Solarized theme was meticulously designed with
 measured color relationships. It uses “selective contrast” and carefully calibrated lightness steps in the
 CIELAB color space for optimal readability
 18
 . For instance, Solarized defines four base tones and
 chooses accent colors with equal perceptual contrast differences, ensuring code is readable in both
 its dark and light mode. While you needn’t copy Solarized’s palette, its principles (e.g. symmetric
 contrast and limited palette) are worth emulating .
 Dark vs. light themes. Around 70% of developers now prefer dark themes
 18
 19
 , so chances are
 you’re designing a dark theme (Dracula, Monokai, etc. are dark). Dark backgrounds can make colors
 “pop” more, but note that not all colors have good dark equivalents (there’s no truly dark yellow that
 is easily visible, for example
 20
 ). This is why many dark themes lean on magenta, cyan, orange,
 green, purple – these remain vivid against dark backgrounds – whereas light themes can use more
 subtle shades. In any case, don’t use pure black as background or pure white as text if possible; a
 very dark gray background (#1e1e1e, etc.) with off-white text (#d0d0d0) is often easier on the eyes
 than 100% contrast black/white.
 Keep accessibility in mind (even if not your focus). A truly “ultimate” theme should still be usable
 by many people. This means testing your colors under common color blindness filters (ensure, for
 example, that you’re not relying on a red/green distinction alone to convey critical differences) .
 Also, provide enough contrast for people who might work in brightly lit environments or have older
 monitors. Accessibility doesn’t have to be the core goal, but following its guidelines tends to improve
 general readability for everyone.
 Highlighting What Matters: Syntax Elements and Color Choices
 14
 The heart of your theme is how you color different syntax elements – keywords, classes, strings,
 punctuation, and so on. There’s consensus on many categories, thanks to years of theme evolution
 (Dracula, Monokai, One Dark, etc. all share certain patterns). Below we break down the key token
 categories and how to approach coloring them for an optimal developer experience:
 • 
Keywords and Keywords-like (control structures, modifiers): Traditionally, language keywords
 (if, 
else , 
for , 
function , 
class , etc.) are given a strong, distinct color to set them off from
 identifiers. For example, the official Dracula spec uses pink (magenta) for keywords and storage
 2
modifiers . This means keywords like 
21
 return , 
class or type modifiers (
 public , 
const ,
 etc.) are all pink in Dracula. Many other themes use blue or purple for keywords (One Dark uses a
 purple/magenta, Monokai famously used a bright pink/orange for keywords). The rationale is that
 keywords define the structure of the code, so highlighting them helps visualize the structure.
 However, a contrary school of thought suggests not over-emphasizing keywords: since keywords
 are typically short and visually distinct anyway, you may not need to draw the eye to them . Some
 modern minimal themes leave keywords in the default text color or a low-key shade, arguing that
 “you rarely search for the keyword 
22
 22
 if – the condition after it is what matters” . Best practice in
 2025: Highlight keywords in a distinct color (to meet user expectations), but avoid overly neon
 shades that steal attention from identifiers. A magenta/pink or medium blue works well, as it
 contrasts with colors used for strings or types in most palettes. If you prefer a minimalist approach,
 you can tone down keyword brightness slightly so they don’t overpower more important tokens (or
 even use italic/bold styling instead of bright color). The key is consistency – if you choose a color for
 keywords, apply it uniformly to all language-defined words so developers learn that “color =
 keyword”.
 • 
• 
• 
Classes, Types, and Constructors: Class names (and user-defined types like structs, interfaces,
 enums) should have their own color to distinguish them from variables and functions. This helps
 class definitions and references stand out, and signals where types are used. Commonly, themes
 pick a blue or purple tone for classes and types. For instance, Dracula uses purple for class names,
 interface names, and type annotations . In VS Code’s default Dark+ theme, class names are a light
 blue. The goal is a color that is visible but not confused with keyword or string colors. Why this
 23
 matters: if 
Order (a class) and 
order (a variable) appear in code, having 
Order in a unique
 color immediately tells you it’s a type. In your theme, choose a color for types that isn’t used for
 variables or functions. Many palettes use a cooler color (blue/purple) for types to convey a more
 “static” feel, but it’s up to you. Tip: If your language and editor support semantic highlighting, you
 can even differentiate class names from interface names or type parameters – e.g. one designer
 assigned maroon for classes vs. teal for interfaces to avoid confusion . These fine distinctions are
 optional; the main point is to separate type identifiers from regular variables with color.
 25
 24
 Functions and Methods: Function and method names (particularly at definition/declaration, but
 also often at call sites) are typically highlighted with a unique color. This helps you spot where
 functions are defined and when they’re being invoked. A popular choice is a yellow, orange, or light
 green tone for function names – something warm that contrasts with the cooler keyword/class
 colors. The One Dark theme uses a green tint for function names, while Dracula uses yellow for
 functions and methods . If your palette has an orange or a bright yellow available, this is a good
 place to use it. By coloring function names, you make them pop out of the code, which is useful since
 functions are the verbs of your code. For example, in Dracula every function call or declaration
 appears in yellow, distinct from purple classes and pink keywords . Be careful that your function
 color isn’t so bright that it overwhelms – it should stand out just enough to scan for function calls or
 definitions when skimming code.
 26
 27
 Variables and Identifiers: Surprisingly, most themes do NOT assign a special hue to ordinary
 variable names. Variables, along with identifiers like object property names, are often left as the
 default foreground color . This is intentional: variables tend to appear very frequently – arguably
 most of the code – so if you gave them all a bright color, your screen would be a confetti of color with
 no focal point. By keeping variables in a neutral tone (white or light gray on dark backgrounds, or
 3
27
 black/dark on light backgrounds), you let the more sparingly used tokens (keywords, classes, etc.)
 carry the color accents. The Dracula spec explicitly maps “Variables & Identifiers” to the foreground
 (default) color . Other popular themes do similarly; for example, in Monokai and One Dark,
 regular variables are plain or only very subtly tinted. This doesn’t mean variables are unimportant – it
 means they’re so common that highlighting them would be like highlighting every other word. Best
 practice is to use font style rather than color if you want variables to have some distinction: e.g.
 italics for parameter names vs. plain for local variables (some themes do this via semantic token
 rules). But in general, treat variables as the base text color. This allows your chosen accent colors to
 be used on the structural and literal tokens without overwhelming the developer .
 • 
28
 2
 Strings and Text Literals: String literals (and character literals, and template literals) almost always
 get a dedicated color. This is both aesthetically and functionally motivated: strings represent user
facing text or data, so giving them a distinct color makes them easy to spot amid code. Also, as
 noted, a uniquely colored string helps catch errors (an unterminated string will color an entire
 remainder of code, an immediate red flag) . Common practice is to use a warm color for strings– often green or orange. Dracula uses green for all strings and text content , as do many dark
 themes (green is friendly to dark backgrounds and was also the classic terminal color for string
 literals). Some themes use soft red or orange for strings (Monokai uses an orange-brown for
 strings, Solarized Dark uses a orange for strings). Choose a color that is clearly different from your
 keyword and class colors; green works well because few other code elements are green. Make sure
 string color is not too light on a light theme (avoid pure yellow on white, for instance, because of
 poor contrast ). Also consider coloring character escapes or format specifiers inside strings
 13
 differently (some editors tokenize 
\n or 
29
 {0} inside a string as a separate scope). You might use a
 slightly brighter variant or underline for escapes so they’re visible – but this is a fine-tuning detail. At
 minimum, give strings a distinct hue. Developers expect it, and it makes strings and inline text
 immediately stand out from code logic.
 • 
Numeric Literals & Constants: Numbers, booleans, and 
null /
 undefined (language constants)
 are often grouped together color-wise. They are literal values in code, and like strings, they benefit
 from a unique color to catch the eye – especially since “magic numbers” should stand out for
 potential refactoring. A golden orange is a popular choice for numbers and constants. In fact,
 Dracula uses orange for numbers, booleans (
 true /
 false ), and constants like 
null . This
 continues a pattern you’ll notice: many themes use green for strings and orange for numbers, two
 warm colors that pair well but are distinguishable. If your palette doesn’t include orange, you could
 use light blue for numbers (some light themes do this), but be careful not to conflict with class
 30
 colors. The key is to separate numbers from both strings and variables. Booleans and 
null are
 often treated as keywords or constants – Dracula treats 
30
 true/false like numeric constants,
 coloring them orange as well . You can decide if booleans should be keyword-colored or number
colored; just be consistent. It’s also useful to highlight constant identifiers (like 
MAX_VALUE or enum
 members) if you can – some themes color constants differently from regular variables, e.g. in
 uppercase or with a separate color. If using semantic highlighting, you could mark constants with
 the same color as numbers to indicate their immutability. This is an advanced touch; at a minimum,
 ensure numeric literals are colored distinctly so they’re easily found.
 • 
Comments and Documentation: Comments are an interesting case with two diverging practices.
 The traditional approach is to de-emphasize comments – show them in a neutral, low-contrast color
 (gray or a soft tone), so that the actual code stands out. Indeed, most default themes use a gray or
 4
31
 muted italic for comments, treating them as background information. This convention originated
 partly to discourage treating long comment blocks as equal to code . However, modern thinking
 recognizes that good comments are important and should be readable. Some experts argue that
 comments should be highlighted (in a positive way) rather than faded out . For example, Nikita
 Prokopov’s Alabaster theme uses bright yellow for explanatory comments to draw the eye . The
 Dracula theme strikes a balance: it styles comments in a distinct comment color (in many Dracula
 implementations, comments are gray or italic purple) but also uses italics to set them apart . 
Best practice: Use a consistent comment color that is clearly separate from code colors, and
 ensure comments are legible (don’t make them so faint that one strains to read them). A medium
 gray on dark background is common. You might also consider differentiating documentation
 32
 comments (like Javadoc-style 
32
 33
 /** ... */ ) from regular comments. Some themes give doc
 comments a slightly different tint or italicize them to indicate they’re API documentation. Craig
 Motlin suggests Javadoc comments should be a distinct color from regular 
// comments . If
 your target languages have a way to identify doc comments, giving them an accent (or just a
 brighter shade of the comment color) can be helpful. Additionally, if you recognize “commented-out
 code”, you might choose to dim those more (some editors can’t distinguish, but in certain contexts
 34
 or by convention, e.g. a 
// TODO vs a chunk of code commented out might be styled differently).
 In summary: do not neglect comment styling – many users actually gauge a theme by how pleasing
 the comment color is, since comments often span multiple lines. A tasteful, slightly subdued color
 (gray, or maybe olive green, etc.) that remains readable is a safe bet, unless you intentionally want to
 highlight them more.
 • 
• 
Operators and Symbols: Operators (
 + , -, =, ==, 
=> , etc.) and punctuation symbols often
 have minimal coloring. In many themes, they are rendered in the default foreground or a minor
 variation of it. The reasoning is similar to variables – operators appear in nearly every expression, so
 coloring them in neon tones can be distracting. A good practice is to either leave operators as the
 default text color or use a middle-ground tone (like a slightly dimmed foreground) so they visually
 separate identifiers without demanding attention . Some designers actually gray out
 punctuation and operators to reduce noise . For instance, one approach is to make commas,
 semicolons, and braces a lighter gray so that the “words” of the code stand out more clearly between
 the gray punctuation. The idea is that when scanning code, you care more about the variable and
 function names than the commas and semicolons. If you follow this approach, ensure the
 punctuation is still visible enough to spot missing commas or to align braces. You can alternatively
 35
 35
 color certain operators for emphasis: for example, some themes give the assignment operator 
special color (or bold styling) to make assignments pop out, or color the 
= a
 | and & logical operators
 distinctly in complex expressions. This is optional and not common in most general themes, but you
 can consider it if it aligns with your philosophy. 
Braces, Brackets, and Parentheses: By default, braces (
 {} ), parentheses 
() , and brackets 
36
 []
 are usually colored as punctuation – i.e. with the same color as other symbols (often the foreground
 or a gray). The Dracula specification explicitly notes that braces and parens should match the
 surrounding text color unless they serve a special role . This means in normal code, your braces
 don’t need a unique color. The reason is that modern editors have features like brace matching
 (highlighting the matching brace when your cursor is on one) and indent guides to delineate blocks,
 so braces are more for structure than for content. Keeping them low-key prevents visual clutter. That
 said, some themes or plugins implement “rainbow brackets”, where each nested parenthesis/
 bracket pair gets its own color. This can be very useful for deeply nested code to trace matching
 5
pairs. If you want to support this, you might not do it through the core theme (usually it’s an
 extension), but you can at least ensure your theme plays nicely with such extensions by not
 overpowering their colors. A safe best practice: color braces and semicolons in a neutral color
 (same as text or slightly lighter), so that they separate tokens but don’t scream for attention . If
 a user desires rainbow brackets, they’ll likely enable an extension which can override those brace
 tokens with colors. For your base theme, consistency and subtlety for braces is fine. (Note: Dracula’s
 special rule about braces being purple for “headings” refers to markdown headings or UI elements,
 not code syntax, so in code it uses foreground for braces .)
 35
 36
 • 
• 
Semicolons, Commas, and Delimiters: These fall under punctuation, but are worth noting because
 your question explicitly mentioned semicolons vs. braces. Similar to braces, semicolons and
 commas typically get no special highlight – they use the general punctuation color. However, a few
 theme creators tweak these for readability. For example, one custom scheme made semicolons
 gray (very inconspicuous) and commas pink to act as subtle list separators . The idea there was
 that semicolons (end-of-line) are uninteresting noise, while commas separating items might benefit
 from a slight tint to spot list boundaries. This is quite subjective and not a standard convention. You
 could experiment with slightly coloring commas if you feel it aids scanning, but ensure it doesn’t
 conflict with other token colors (pink commas only work if pink isn’t already used heavily elsewhere,
 in that author’s case it was free to use for punctuation). In summary, treating all punctuation
 (commas, semicolons, dots, etc.) uniformly in a low-key color is a reliable approach. It cleans up
 the code’s look by reducing “visual noise” without hiding these characters altogether .
 37
 35
 Built-in Names and API Functions: Many languages have standard library classes or global
 functions (like 
Math , 
print() , DOM 
document , etc.). Some themes choose to highlight these
 built-ins in a separate color to distinguish them from user-defined variables. Dracula, for instance,
 uses cyan for “support & built-ins,” which includes built-in classes/functions, HTML tags, CSS units,
 and regex patterns . This is why in a Dracula-themed editor, you might see HTML tag names or
 38
 console.log and regex 
/pattern/ in a cyan tone distinct from user code. Incorporating this in
 your theme can be very useful for developers: it lets them instantly tell a global function or type
 versus something defined in their code. If you have the bandwidth, consider assigning one color
 (perhaps teal or cyan) to these categories of tokens. This would cover things like:
 • 
• 
Language built-ins and globals: e.g. 
Standard API classes: e.g. 
String , 
Math , 
Number in JS, or 
printf in C, etc.
 Date , 
• 
• 
• 
System (depending on language).
 HTML/XML tags and attribute names: these are often a separate scope; many HTML/CSS color
 schemes use one color for tag names (e.g. cyan) and another for attribute names (often purple or
 blue), while attribute values are colored as strings (since they are strings) .
 RegEx literal patterns: If your editor scopes them specially, you could use the same color as
 numbers or a distinct color; Dracula considers regexes as “support” and colors them cyan as well .
 CSS property names: Also often treated as built-ins (since they are predefined identifiers) – Dracula
 also lumps CSS properties/units into the cyan “support” color .
 39
 38
 29
 38
 If you do not separate built-ins with a unique color, they will simply appear as variables or classes (whatever
 their form is). That’s not a deal-breaker, but giving them a unique color (like cyan) can enhance readability,
 6
especially in languages like JavaScript or Python where built-in functions might otherwise blend with user
defined ones. It’s a nice-to-have that many “premium” themes implement.
 • 
• 
• 
• 
• 
• 
Special cases and Miscellaneous: Finally, consider some miscellaneous syntax elements that
 could use attention:
 Annotations/Decorators: (e.g. 
@Override in Java, 
@Component in Angular, Python decorators).
 These often appear above classes or functions and many themes give them a distinct color. You
 could color annotations similar to keywords (since they modify declarations), or use another accent.
 The key is to ensure they’re not in the default text color, because they’re not normal code; they’re
 metadata.
 Preprocessor directives: (like 
#include , 
#define in C/C++). Typically, these are colored like
 keywords or comments. Many themes choose a slightly different color for preprocessor directives 
e.g. a bluish tint distinct from regular keywords – so they stand out at the top of files. You can follow
 suit if supporting such languages.
 Escape sequences in strings: (e.g. 
\n , 
\xFF ). If possible, give these a special style (often a bright
 color or bold) so they’re noticeable within strings. This prevents them from being overlooked as plain
 text.
 HTML/CSS specifics: If your theme will be used for web development, define colors for HTML tags
 vs. attributes vs. attribute values (as noted above). Often: tags one color, attribute names another,
 values = string color. For CSS, selectors might be treated as “identifiers” (foreground), properties as
 built-ins (one color), and property values as either numbers/strings (if numeric or string) or a special
 color for keywords like 
auto , 
flex (some themes treat those as constants).
 Markdown and documentation markup: If theming in VS Code, you can also color Markdown
 syntax elements (like headings, 
**bold** text, links). Since your focus is code, this is secondary,
 but many devs appreciate when a theme also prettifies Markdown notes or doc comments. For
 example, you could make Markdown headings one color, bold/italic text another, and links
 underlined. Dracula, for instance, suggests using purple for Markdown headings (as an extension
 of its brace rule) .
 40
 In short, make a checklist of all language token types you want to address. Below is such a checklist for VS
 Code theme properties (token scopes/categories) to ensure you don’t miss anything crucial when fine
tuning your colors:
 VS Code Syntax Token Checklist
 When building a VS Code color theme, you will define rules for token scopes (TextMate scopes and/or
 semantic tokens). VS Code provides some generic token names out-of-the-box (like 
"strings" , 
41
 "comments" , 
"numbers" ) , but for a thorough theme you’ll want to specify many more. Use the list
 below as a starting point for properties/scopes to consider customizing:
 • 
• 
Editor Foreground/Background: The base text color and background color of the editor
 (editor.foreground, 
editor.background ). These set the default for unthemed text (like
 variables, unless overridden). Most of your syntax colors will override the foreground for specific
 tokens, but it’s good to choose a sensible default (e.g. light gray on near-black background).
 Comment: Color for comments (scope selectors like 
comment.line , 
comment.block ). Often a
 gray or muted color. Ensure italics if you want that style (via fontStyle in the theme).
 7
• 
String: Color for string literals (e.g. scope 
string.quoted ). Also covers character literals and
 template strings.
 • 
Numeric Literal: Color for numbers (scope 
constant.numeric ). This often also applies to
 booleans and null/undefined (sometimes scoped as 
constant.language – you can target that
 too).
 • 
• 
Keywords / Control: Color for language keywords (scope 
keyword.control , 
keyword.operator for 
(if/else, loops) and declaration keywords (
 modifier scopes (e.g. 
storage.modifier for 
keyword , and sub-scopes like 
new , 
typeof , etc.). This includes control flow
 class , 
function , etc.). Also consider 
storage
 public , 
static in languages that have them).
 Functions and Methods: Color for function and method names. In TextMate grammars, function
 names in declarations often have scope 
entity.name.function and function calls might be 
support.function or 
entity.name.function.invocation depending on language
 grammar. You may need to experiment or use VS Code’s scope inspector to target these. Many
 themes color both definitions and calls the same, but you might choose to differentiate definition vs
 call via semantic tokens (e.g. VS Code’s semantic token type 
function.declaration ). At least
 ensure global/built-in functions (often 
• 
support.function ) are handled, and user functions (which
 might just fall back to default or a generic scope) have the intended color.
 Classes and Types: Color for class names, interface names, enum names, type aliases, and type
 keywords. Scopes to target: 
entity.name.type , 
entity.name.class , 
built-in classes), 
storage.type (for primitive types like 
int , 
support.class (for
 string – some grammars classify
 those as storage type). Semantic tokens can also help (e.g. token types 
class , 
• 
• 
interface , 
enum if enabled). Make sure to also cover constructor functions (sometimes they have scopes like 
entity.name.function.constructor or are identified as classes).
 Variables and Properties: Since variables are usually default foreground, you might not set a
 specific color. But you might want to distinguish constant variables. Some grammars use 
variable.other.constant or 
constant.other for constants (e.g. ALL_CAPS constants),
 which you could color like numbers or another color. Object property names can be scoped as 
variable.other.property . Decide if you want to color properties differently (many themes do
 not, leaving them as default or the same as variables). If using semantic highlighting, you could
 distinguish local variables vs. global vs. parameter (there are semantic token modifiers for
 parameter, etc.). For example, VS Code’s semantic highlighting can mark parameters, and in the
 Dark+ default, parameters are italicized. Craig’s scheme assigned orange to parameters and green to
 locals
 42
 – an advanced differentiation you might adopt via semantic token rules. These are extras;
 the baseline is that identifiers not matched by other categories will appear in the default color.
 Built-in / Library symbols: As discussed, if you want a separate color for standard library functions/
 types, target scopes like 
support.function (for built-in functions), 
classes), 
support.type , etc. Also 
support.class (built-in
 support.constant might catch constant like 
NULL .
 Dracula’s use of cyan for these is one approach .
 38
 • 
• 
Operators: Scopes like 
keyword.operator (for +, -, = in some grammars), or they might just be
 punctuation. You can leave them as default or color them subtly. If you want, you could explicitly set
 e.g. 
keyword.operator.assignment to a noticeable color to highlight assignments.
 Punctuation: Brackets, braces, commas, semicolons often have scope 
scopes like 
punctuation.separator , 
punctuation (with sub
punctuation.terminator for semicolons, 
punctuation.definition.string for quotes, etc.). You can target broad 
35
 punctuation to
 color all, or be granular. A common technique: set punctuation to a gray (on dark theme) so that it’s
 visually deemphasized . Be mindful not to accidentally recolor string delimiters or regex
 delimiters in a way that confuses – sometimes quotes are labeled as punctuation, but you might
 8
want them to share the string color instead (so the quoted text looks continuous). Many themes
 don’t bother and let punctuation be default. Decide based on whether you want that ultra-clean look
 where punctuation fades out.
 • 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
• 
Comments (Doc vs. Regular): We covered comment color, but remember to check if your languages
 of interest have a separate scope for documentation comments. For example, in Java, 
/** ... */
 might be tokenized differently (often as 
comment.block.documentation ). You could assign it the
 same base comment color, perhaps italic, or a slightly different hue to indicate “this is a doc
 comment.” It’s a nice detail if you want completeness.
 Annotations/Decorators: Often scoped as 
entity.name.function or 
storage.type.annotation or 
punctuation.definition.annotation depending on
 grammar. You can find these via the scope inspector by looking at an 
@ annotation in code. You
 might color them like keywords (since they alter declarations) or give them their own color.
 JSON/YAML keys: If theming for JSON, keys are typically strings and will appear in string color (in
 JSON, keys are in quotes by spec). YAML keys might be plain identifiers though. Some YAML
 grammars scope keys specially; you could choose to color YAML keys as a distinct color if desired,
 but not required.
 Markup (HTML/XML): Scopes: 
entity.name.tag for tag names, 
entity.other.attribute
name for attribute names, and attribute values are usually just strings. In many themes:
 Tag names are one color (often cyan or blue).
 Attribute names another (often green or orange).
 Values reuse the string color. Ensure your theme covers these if web dev is target. Also style the
 punctuation 
< and > as punctuation (often same color as other punctuation or maybe same as
 tag name – some themes make 
< > the same color as the tag to visually enclose it).
 CSS: Scopes like 
support.type.property-name.css (for CSS property), 
support.function.misc.css (for CSS functions like 
calc() ), 
constant.numeric.css (for
 numeric values with units). Typically:
 CSS properties are one color (Dracula uses cyan as they consider them built-in).
 CSS classes/selectors might appear as plain text (you could color class selectors like variables).
 CSS keywords like 
auto , 
solid might be scoped as constants or keywords – often colored as
 numbers or a separate color. Again, decide a scheme: many just follow the pattern of their main
 palette, ensuring CSS doesn’t introduce entirely new colors.
 Regular Expressions: In languages where regex is literal (JavaScript, Perl, etc.), inside the regex the
 tokens might be scoped (e.g. character classes, quantifiers). Few themes get granular with regex
 beyond coloring the whole regex as one color (often same as string or number). If you want to be
 fancy, you could differentiate regex parts (but that’s probably overkill for a general theme).
 Error/Invalid tokens: VS Code marks errors with the 
invalid scope or semantic token type.
 Typically you don’t need to set this because the editor will underline errors in red squiggles. But you
 can set a style for 
invalid scope – many themes set it to red wavy underline or background. Since
 errors are usually shown via editor UI (squiggles, the Problems panel), this is not mandatory to
 theme via color, except to ensure it contrasts (often bright red or with a red background).
 Diff and source control: If your theme might be used in diff views, consider coloring added/
 removed lines (VS Code has settings like 
diffEditor.insertedTextForeground if you want to
 tweak those). By default, added text might be green and removed red background – those are UI
 colors more than syntax, but relevant if you want a complete theme polish.
 Bracket guides / matching: VS Code now has bracket pair guides and matching bracket highlights.
 These are configured via workbench color settings (e.g. 
editorBracketMatch.border and 
editorBracketHighlight.foregroundN ). Ensure these default to visible colors that coordinate
 9
with your theme (or let VS Code default them). Many dark themes use subtle colored borders for the
 matching pair when your cursor is at one; that’s often enough. If you want rainbow bracket colors,
 VS Code exposes up to 6 colors (
 editorBracketHighlight.foreground1 ... 
foreground6 )
 you can set (some themes do set a rainbow sequence there). It’s optional, as the default might be
 f
 ine or an extension can handle it.
 In this example, a theme uses too many bright colors – notice nearly every token has its own hue (keywords in
 purple, strings in green, numbers in red, types in cyan, etc.). Because everything is “loud,” it’s hard to quickly spot
 the focal points (can you immediately find the function definition?). Over-highlighting can reduce readability .
 4
 By contrast, this minimalist theme uses only a few colors: comments are bold yellow, string constants green, and
 the top-level function name is blue, while keywords and punctuation are muted. The function definition
 (capitalize and 
pad functions in blue) now clearly stands out. A selective approach like this highlights the
 structure without overwhelming the eyes .
 22
 32
 Learn from Popular Themes (Dracula, Monokai, One Dark)
 The best practices above aren’t theoretical – they’re distilled from what successful themes already do.
 Dracula, One Dark (Atom’s theme), Monokai, and others have converged on very similar mappings
 because those work well. For example, Dracula’s official spec explicitly defines its token colors, which align
 with the advice we’ve given:
 • 
• 
• 
• 
• 
• 
• 
• 
• 
21
 23
 29
 26
 30
 Keywords → Pink/Magenta
 Functions & Methods → Yellow
 Classes & Types → Purple
 Strings → Green
 Numbers & Constants → Orange
 Comments → (Dracula uses a special gray tone with italics for comments)
 Built-in/Library → Cyan (for API classes, HTML tags, regex, etc.)
 Variables/Identifiers → Default foreground (no extra color)
 Errors/Invalid → Red (indicators for errors, diff deletions, etc.)
 33
 38
 27
 43
 Monokai (the classic) uses a similar scheme: it famously has a pinkish-orange for keywords, green for
 strings, red for constants, blue for functions, and white for plain text – which is not far off from the Dracula
 pattern. One Dark (and its VS Code incarnation) uses purple for keywords, green for strings and function
 names, blue/cyan for types and classes, light orange for constants, and gray for comments. These themes
 were created by different people, yet they gravitated to comparable solutions – because those choices
 balance the palette well and reflect a sort of informal consensus on what each color should represent.
 Why certain colors for certain things? Often it comes down to contrast and tradition: Strings and
 comments are often softer or warmer colors (green, etc.) so they don’t clash with code elements. Keywords
 and control flow get bold, high-contrast colors (purple, blue, etc.) so the structure is visible. Types might get
 blue or cyan, staying distinct from keywords but still prominent. Numbers often get an orangey tone
 because it’s visually distinct from both blue and green. These conventions also make it easier to switch
 themes – a developer will quickly recognize familiar color patterns. There’s also a bit of psychology: e.g.
 green is associated with “literal data” (perhaps because of old terminal green screens), blue with “entities
 and types,” and red catches attention so it’s reserved for warnings/errors .
 10
 10
Final Tips
 • 
• 
• 
• 
• 
• 
Use Semantic Highlighting: VS Code (and other modern IDEs) support semantic token coloring,
 which can refine the syntax coloring based on actual code meaning. In 2025, many language
 extensions provide semantic data (e.g. distinguish class vs enum vs type parameter, or local var vs
 f
 ield). You can opt-in your theme to use these. For example, VS Code’s default themes color 
parameters vs. local variables differently when semantic highlighting is on . Leverage this if you
 44
 want ultra-granular theming. In your 
package.json , set 
"semanticHighlighting": true for
 your theme and provide 
semanticTokenColors rules for token types like 
"variable.parameter" , 
"variable.readonly" , 
"function" etc. (Often you can map them
 to the same colors you chose for similar TextMate scopes.) This ensures your theme is future-proof
 and consistent (e.g., your class color will definitely apply to classes, even if a language’s TextMate
 grammar missed a case, because the semantic token will catch it ).
 Test with a variety of languages and code snippets. The Dracula spec provides a sample snippet
 with many language constructs
 46
 47
 45
 – use such “all features” code to validate your theme. Make
 sure, for instance, that a template literal, a regex, a decorator, an HTML file, a JSON file, etc., all look
 good. Adjust any color that feels jarring or any token that was left unintentionally unstyled (if you
 see something in a weird default color, track down its scope).
 48
 Provide customization and consider user preferences. No single theme pleases everyone .
 Some devs might love your palette but wish function names were a bit brighter, etc. VS Code allows
 users to override theme colors easily. Document in your README which key scopes you use for
 important elements so power users can tweak them. And ensure your theme works in both dark and
 light variants if you offer both (the same logic applies, but colors will differ).
 Contrast checks: Especially if you aim for “ultimate” status, double-check that your color combos
 meet accessibility contrast guidelines (WCAG AA at least)
 14
 . A theme can be colorful and sufficiently
 contrasting – many manage this by avoiding low-contrast pastel-on-dark or neon-on-light
 combinations.
 Consistency across file types: Use the same color for the same concept across languages. For
 example, if you color JavaScript keywords pink, do the same for Python, C#, etc., in your theme. This
 consistency is usually handled by the fact you target high-level scopes (like 
keyword.control
 covers many languages). But be mindful with domain-specific languages – e.g. SQL keywords vs.
 programming language keywords – ideally both should get the keyword color.
 Don’t forget UI elements. (Though out of scope for code syntax, a truly polished theme also
 addresses UI chrome: matching the minimap, scrollbar, line highlight, selection color, matching
 bracket highlight, etc., to your palette). For instance, if your accent color is purple, you might use
 that for the active line highlight or caret. This doesn’t affect syntax directly, but contributes to the
 overall experience.
 6
 In summary, designing the “perfect” syntax theme means making deliberate choices about what each
 color signifies, guided by both research and convention. Use just enough colors that each serves a purpose
 you can remember . Highlight the elements that carry meaning (like identifiers, constants, and structure)
 and tone down the rest (boilerplate punctuation and keywords) so that the code’s logic shines through. By
 following the lessons from existing beloved themes and the cognitive science insights available, you’ll create
 a theme that is not only beautiful but boosts productivity – one where “at a glance” the important code
 elements jump out in color
 9
 and nothing necessary is lost in the dark. Good luck, and happy theming!
 11
Sources:
 • 
• 
• 
• 
• 
• 
• 
3
 1
 Saifi, Sohail. How Syntax Highlighting Affects Code Comprehension (fMRI Study) (Medium, 2025) 
Summary of brain scan research on code reading and highlighting.
 Sarkar, Advait. The Impact of Syntax Colouring on Program Comprehension (PPIG 2015) – Empirical
 study showing highlighting improves task speed; discusses eye fixation patterns.
 Prokopov, Nikita. “Everyone is Getting Syntax Highlighting Wrong” – Blog advocating minimal
 highlighting: emphasizes highlighting fewer categories (strings, constants, definitions) and greying
 out noise (punctuation, keywords)
 2
 22
 35
 3
 32
 , as well as making comments more visible . 
Motlin, Craig. How to Pick Colors for a Syntax Highlighting Theme (2022) – Discusses choosing a finite
 palette and using contrast to avoid ambiguity
 7
 blues)
 8
 and to reserve red for errors
 10
 . Notes not to overuse similar hues (e.g. too many
 . Also gives an example custom scheme distinguishing
 9
 37
 classes, interfaces, etc. . 
Dracula Theme Official Spec (Dracula Theme, 2021) – Detailed specification of token colors for the
 popular Dracula theme
 21
 49
 50
 27
 14
 , and guidelines like keeping braces the same color as text
 and meeting contrast standards . Illustrates a well-balanced, widely-used color mapping. 
Stack Exchange Q&A – “Syntax-highlighting color scheme studies” – Highlights that no single scheme is
 objectively best, but principles from design (contrast, color theory) apply. Refers to Solarized theme’s
 approach of measured contrast in Lab space
 18
 36
 and general advice to choose distinguishable colors
 11
 that aren’t eye-searing . 
Visual Studio Code Documentation – Color Theme Guide and Syntax Highlight Guide. Explains how
 to define theme token colors and the existence of default token group names
 41
 . Also shows
 examples of semantic highlighting (e.g. coloring class vs parameter via language server info) .
 These ensure your theme integrates with VS Code’s theming system properly. 
44
 12
(PDF) The impact of syntax colouring on program comprehension
 https://www.researchgate.net/publication/293652017_The_impact_of_syntax_colouring_on_program_comprehension
 ppig.org
 https://ppig.org/files/2015-PPIG-26th-Sarkar1.pdf
 Left: code without highlighting. Right: same code with syntax... | Download Scientific Diagram
 https://www.researchgate.net/figure/Left-code-without-highlighting-Right-same-code-with-syntax-highlighting_fig1_293652017
 I am sorry, but everyone is getting syntax highlighting wrong @
 tonsky.me
 https://tonsky.me/blog/syntax-highlighting/
 How to pick colors for a syntax highlighting theme | by Craig Motlin |
 Medium
 https://motlin.medium.com/how-to-pick-colors-for-a-syntax-highlighting-theme-96d3e06c19dc
 Syntax highlighting color conventions - User Experience Stack Exchange
 https://ux.stackexchange.com/questions/126048/syntax-highlighting-color-conventions
 Spec • Dracula Theme
 https://draculatheme.com/spec
 Code Colorizing and Readability
 https://blog.codinghorror.com/code-colorizing-and-readability/
 Color Theme | Visual Studio Code Extension API
 https://code.visualstudio.com/api/extension-guides/color-theme
 Themes
 https://code.visualstudio.com/docs/configure/themes
 1
 2
 3
 4 5 6 12 19 20 22 28 31 32 35
 7 8 9 10 13 24 34 37 42
 11 18 48
 14 21 23 25 26 27 29 30 33 36 38 39 40 43 46 47 49 50
 15 16 17
 41
 44 45
 13