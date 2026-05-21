# osman.dev — Portfolio Design Spec

**Date:** 2026-05-21
**Author:** Osman Dayı (osman.dayi3478@gmail.com)
**Status:** Approved for implementation

---

## 1. Goal

Build a personal portfolio website for Osman Dayı (Frontend Developer, ~3 years experience, currently at Huawei). The site must look unmistakably different from a "default Next.js template" portfolio: it presents itself as a working code editor (VSCode/Cursor-like IDE) where every section of the CV is a file the visitor opens in a tab.

The site ships with:

- English + Turkish language switching (`next-intl`)
- Dark + light theme switching (`next-themes`, GitHub Modern palette)
- High-fidelity animation pass (typing, tab open/close, page transitions, scroll reveal, live status bar)
- A working command palette (Cmd+K), real keyboard shortcuts, a status bar, and an interactive fake terminal panel (Ctrl+`)

## 2. Non-goals

- No CMS, no blog engine, no comments.
- No backend, no database, no auth. Pure static / client side.
- No analytics SDKs.
- No mobile-only design pivot — mobile is supported (responsive collapse of sidebar + simplified status bar) but the IDE metaphor is desktop-first.
- No real code execution in the fake terminal. Only a closed list of canned commands.
- No e2e tests. Only unit tests for hooks/components with non-trivial logic.

## 3. Concept

The entire site is presented as a single IDE window:

```
┌────────────────────────────────────────────────────┐
│ ● ● ●   osman.dev — Portfolio          [TR][🌙][↗] │  Title bar
├──┬─────────────────────────────────────────────────┤
│▸ │ [README.md ●][about.md][experience.tsx][...][✕]│  Tab strip
│  ├─────────────────────────────────────────────────┤
│E │ 1   # Osman Dayı                                │
│X │ 2   > Frontend Engineer                         │  Editor area
│P │ 3                                               │
│L │ ...                                             │
│  │                                                 │
├──┴─────────────────────────────────────────────────┤
│ ⎇ main  ⊙ TR  ⚙ dark  Ln 42, Col 12  UTF-8  Ready │  Status bar
└────────────────────────────────────────────────────┘
```

Each "file" in the sidebar is a real Next.js route. Clicking a file in the explorer opens it as a tab in the tab strip and navigates to its route. Tabs can be closed (✕), reordered is **out of scope for v1**. Each tab has its own dedicated render component, but they all share the IDE shell (title bar, sidebar, tab strip, status bar, terminal).

## 4. Sections (the "files")

| Path (route) | File label shown in UI | Content |
|---|---|---|
| `/[locale]` | `README.md` | Hero greeting, role, short pitch, CTA buttons (View projects / Download CV / Contact). Typing animation on first paint. Default tab. |
| `/[locale]/about` | `about.md` | About text (CV section 1) rendered as Markdown. |
| `/[locale]/experience` | `experience.tsx` | Huawei (NBI + Supply Chain) → Azetech (Dijirack) → Hakmar internship, rendered as a JSX-looking timeline. |
| `/[locale]/projects` | `projects.tsx` | All 7 projects in a card grid with tag filter chips: `All` / `Frontend` / `FullStack`. |
| `/[locale]/skills` | `skills.json` | Technologies as syntax-highlighted JSON with hoverable badges. Categories: `core`, `libraries`, `tools`. |
| `/[locale]/education` | `education.md` | Bülent Ecevit University, 2018–2023. |
| `/[locale]/contact` | `contact.sh` | Contact info rendered as the stdout of a shell script: phone, email, GitHub, LinkedIn, location. Clickable. |

Project list (from CV.txt, all 7):

1. **Coffe Pub** — Frontend — github.com/osmandayi/CoffePub — coffe-pub.vercel.app
2. **SAS (30 Temmuz)** — Frontend — github.com/osmandayi/30Temmuz — 30-temmuz.vercel.app
3. **E-Commerce** — FullStack — github.com/osmandayi/E-Commerce — online-commerce-and-grocery.vercel.app
4. **Netflix Clone** — Frontend — github.com/osmandayi/Netflix-Clone-FE — netflix-clone-fe.vercel.app
5. **Dijirack** — Frontend — demo.dijirack.com
6. **IFI** — Frontend — (no public URL)
7. **Medscript** — Frontend (Teknofest-24) — medscript.dijirack.com

Project images already exist at `C:\Users\Pc\Documents\GitHub\portfolio\public\projects\` and will be copied to this project's `public/projects/`.

## 5. Layout (the IDE shell)

The shell wraps all routes inside `app/[locale]/layout.tsx`. From top to bottom:

### 5.1 Title bar (32px)
- Left: three macOS-style window dots (purely decorative, no action). Title: `osman.dev — Portfolio`.
- Right: language toggle (`TR` / `EN`), theme toggle (sun/moon), external link icon (LinkedIn quick-jump).

### 5.2 Body (flex row, fills remaining height)

**Sidebar (240px wide, collapsible)**
- Vertical activity bar (48px) with icons: Explorer (default active), Search, Git, Settings. Only Explorer is interactive in v1; the others show a tooltip "Coming soon" on hover.
- File tree below the activity icons:
  ```
  ▾ portfolio/
    📄 README.md
    📄 about.md
    📄 experience.tsx
    📄 projects.tsx
    📄 skills.json
    📄 education.md
    📄 contact.sh
  ```
- Each file row shows the appropriate Lucide icon for its extension and is keyboard navigable.
- Cmd/Ctrl+B toggles the sidebar (animates width 240 → 0).

**Editor (fills the rest)**
- Top: tab strip. Each open tab shows the file icon, label, dirty dot (only for the active tab to indicate "unsaved", purely cosmetic), and a close ✕ on hover.
- Body: the route's page component. The first column (40px) is a gutter showing line numbers. Content area indents from line 1.
- All textual content uses a monospace font (JetBrains Mono) for the editor, sans for surrounding chrome (Inter).

### 5.3 Status bar (24px, fixed bottom)
- Left: `⎇ main` (fake git branch), then a rotating fake-commit message ("feat: add i18n" — purely cosmetic, no live polling, just a static string in v1).
- Right: language indicator (`TR` / `EN`), theme indicator (`dark` / `light`), cursor position (`Ln 42, Col 12` — derived from the active page's scroll position approximated to line/col), `UTF-8`, `Ready`.

### 5.4 Terminal panel (collapsed by default, toggled with Ctrl+`)
- Slides up from above the status bar, takes 240px height.
- Prompt: `osman@portfolio:~$`. Supports a fixed list of commands (see §8.4).
- History persisted in `sessionStorage` so it survives route changes within the same tab.

## 6. Color palette (GitHub Modern + purple accent)

### Dark (default)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#0d1117` | Body background |
| `--panel` | `#161b22` | Sidebar, status bar, terminal |
| `--panel-2` | `#21262d` | Active tab background, tab strip background |
| `--border` | `#30363d` | All borders |
| `--fg` | `#c9d1d9` | Primary text |
| `--fg-muted` | `#8b949e` | Secondary text, line numbers |
| `--accent` | `#58a6ff` | Links, focus rings, active state |
| `--accent-2` | `#a371f7` | Purple highlight (the "different" pop) |
| `--success` | `#3fb950` | Strings in syntax, contact email |
| `--danger` | `#f85149` | Close hover, error states |
| `--warning` | `#d29922` | Keywords in syntax |

### Light
| Token | Value | Use |
|---|---|---|
| `--bg` | `#ffffff` | Body background |
| `--panel` | `#f6f8fa` | Sidebar, status bar, terminal |
| `--panel-2` | `#eaeef2` | Active tab background |
| `--border` | `#d0d7de` | All borders |
| `--fg` | `#24292f` | Primary text |
| `--fg-muted` | `#57606a` | Secondary text |
| `--accent` | `#0969da` | Links, focus rings |
| `--accent-2` | `#8250df` | Purple highlight |
| `--success` | `#1a7f37` | Strings, email |
| `--danger` | `#cf222e` | Close hover |
| `--warning` | `#9a6700` | Keywords |

Theme switch animates with a 200ms ease-out transition on all color properties.

Syntax highlighting uses Shiki with two custom themes locked to the palette above so highlighted code blocks match the chrome exactly.

## 7. Typography

- **Editor body, code blocks, terminal, status bar:** JetBrains Mono (`@fontsource/jetbrains-mono`), weights 400 / 500 / 700.
- **Headings inside Markdown content, marketing-style text:** Inter (`next/font/google`), 400 / 500 / 600 / 700.
- Sizes: editor 14px / line-height 1.6, line numbers 12px, status bar 12px, title bar 13px, hero heading 48px (mobile 32px).

## 8. Interactions

### 8.1 Tabs
- Opening a file from the sidebar:
  - If a tab for that file is already open, it becomes active.
  - Otherwise a new tab is appended to the strip and becomes active. Animation: width 0 → auto over 160ms, content fades in.
- Closing a tab (✕ or Cmd/Ctrl+W):
  - Animation: width auto → 0 over 140ms.
  - If the closed tab was active, the next tab to the right becomes active (or the previous one if it was the last). If the last open tab closes, README.md is re-opened (because there must always be one active tab).
- Open tabs persist in `localStorage` so a refresh restores them.

### 8.2 Page transitions
- The editor body uses Framer Motion `AnimatePresence` with `mode="wait"`. Transition: 200ms, content slides 8px up + fade.

### 8.3 Command palette (Cmd/Ctrl+K)
Powered by `cmdk`. Top-level commands:

- `Go to: README` / `Go to: About` / ... (one per file) — navigates and opens tab
- `Theme: Switch to Light` / `Theme: Switch to Dark`
- `Language: Switch to English` / `Language: Switch to Turkish`
- `Open: GitHub` (opens new tab to GitHub profile)
- `Open: LinkedIn`
- `Copy: Email`
- `Toggle: Terminal`
- `Toggle: Sidebar`

Fuzzy search by command label. Esc closes.

### 8.4 Terminal (Ctrl+`)
Supported commands (everything else echoes `command not found: <x>. Type 'help'.`):

| Command | Output |
|---|---|
| `help` | Lists all available commands |
| `whoami` | `osman` |
| `ls` | List of "files" (README.md, about.md, ...) |
| `cat <file>` | Plain-text dump of that section's content |
| `open <file>` | Navigates + opens tab (e.g. `open projects.tsx`) |
| `theme dark` / `theme light` | Switches theme |
| `lang tr` / `lang en` | Switches language |
| `contact` | Same output as the `contact.sh` page |
| `clear` | Clears terminal scrollback |
| `vim` / `nano` / `sudo ...` | Jokey canned responses |

History: Up / Down arrows cycle through previous commands within the session.

### 8.5 Keyboard shortcuts (handled by a single `useKeyboard` hook)
- `Cmd/Ctrl + K` → command palette
- `Cmd/Ctrl + B` → toggle sidebar
- `Cmd/Ctrl + W` → close active tab
- `Cmd/Ctrl + 1..7` → switch to tab N
- `Ctrl + ~` (and Cmd+J on mac) → toggle terminal
- `Esc` → close any modal (palette, terminal if focused)

Shortcuts are suppressed while typing into an input/textarea.

### 8.6 Scroll reveal
Each major content block (an experience card, a project card, a skills category) animates in via Framer Motion's `whileInView` with a 60ms stagger when multiple siblings enter together.

### 8.7 Typing animation
The README.md hero text types out character by character (3 lines: name, role, one-line pitch) on first paint only — a `sessionStorage` flag prevents re-running on subsequent visits this session. Typing speed 35 ms/char, with a blinking caret afterwards.

### 8.8 Cursor position in status bar
Approximated: the status bar listens to `scroll` on the editor body and derives `Ln` and `Col` from the page's scroll percentage mapped to the (statically known) total line count of the rendered content. Updates at most every 100ms (throttled).

## 9. i18n

- `next-intl` with route segment `[locale]` of `tr` | `en`. Default redirect: browser language → fallback `en`.
- Message files: `messages/en.json`, `messages/tr.json`. Flat-namespaced by section (`readme.*`, `about.*`, `experience.*`, `projects.*`, `skills.*`, `education.*`, `contact.*`, `chrome.*`).
- The CV is sourced from Turkish (CV.txt). The `tr.json` file uses the Turkish text directly; the `en.json` file is a faithful translation.
- Language toggle in the title bar swaps `tr` ↔ `en` in the URL while preserving the rest of the path (so `/tr/projects` ↔ `/en/projects`).
- The terminal commands themselves stay English (they're CLI commands), but their stdout output respects the active language.

## 10. Theming

- `next-themes` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange={false}`.
- All colors are declared as CSS variables under `:root` (light) and `.dark` (dark) in `globals.css`. Tailwind reads them via `theme.extend.colors`.
- The toggle in the title bar cycles **light → dark → system**, with the icon reflecting the current resolved theme.

## 11. File / module structure

```
src/
  app/
    [locale]/
      layout.tsx              IDE shell (TitleBar, Sidebar, TabStrip, EditorArea, StatusBar, Terminal, CommandPalette)
      page.tsx                README.md → <ReadmePage/>
      about/page.tsx          → <AboutPage/>
      experience/page.tsx     → <ExperiencePage/>
      projects/page.tsx       → <ProjectsPage/>
      skills/page.tsx         → <SkillsPage/>
      education/page.tsx      → <EducationPage/>
      contact/page.tsx        → <ContactPage/>
    layout.tsx                <html><body>, font setup, providers
    globals.css               CSS variables, base resets
  components/
    ide/
      TitleBar.tsx
      Sidebar.tsx
      FileTree.tsx
      TabStrip.tsx
      EditorArea.tsx
      LineGutter.tsx
      StatusBar.tsx
      Terminal.tsx
      CommandPalette.tsx
    content/
      ReadmePage.tsx
      AboutPage.tsx
      ExperiencePage.tsx
      ProjectsPage.tsx
      SkillsPage.tsx
      EducationPage.tsx
      ContactPage.tsx
    primitives/
      Tab.tsx
      ThemeToggle.tsx
      LanguageToggle.tsx
      ExternalLink.tsx
      SyntaxBlock.tsx          wraps shiki render
      TypingText.tsx           the typing animation
      RevealOnView.tsx         scroll reveal wrapper
  hooks/
    useTabs.ts                 open/close/active tab state, persisted to localStorage
    useTerminal.ts             terminal state + command interpreter
    useCommandPalette.ts       open state + command list
    useKeyboard.ts             global shortcut handler
    useCursorPosition.ts       Ln/Col derivation
    useTypingOnce.ts           sessionStorage-gated typing
  lib/
    files.ts                   The canonical list of "files" + their route + label + icon + tab order
    projects.ts                The 7 project records (icon, tags, urls, image paths)
    skills.ts                  Skill categories
    experience.ts              Job records
    cn.ts                      clsx + tailwind-merge helper
  messages/
    en.json
    tr.json
  i18n.ts                      next-intl config
  middleware.ts                next-intl locale routing
public/
  projects/                    Images copied from existing portfolio
  fonts/                       Self-hosted JetBrains Mono if needed
```

## 12. Tech stack and dependencies

- **Next.js 15** (App Router) + **TypeScript** (strict)
- **Tailwind CSS** + `tailwindcss-animate`
- **Framer Motion**
- **next-intl**
- **next-themes**
- **cmdk**
- **shiki** (syntax highlighting, server-rendered for the initial paint)
- **lucide-react** (icons)
- **clsx**, **tailwind-merge**
- **@fontsource/jetbrains-mono**, **next/font/google** (Inter)
- **vitest** + **@testing-library/react** + **happy-dom** (unit tests for hooks)
- **eslint-config-next**, **prettier**

## 13. Testing

Scope: targeted unit tests, not full coverage.

- `useTabs.ts` — opening, closing, "always keep one open", active-tab fallback rules.
- `useTerminal.ts` — command parsing for the canned commands, history navigation, unknown command fallback.
- `useKeyboard.ts` — shortcuts fire correctly and are suppressed inside text inputs.
- `<TabStrip/>` — renders open tabs, calls close handler, marks active.

UI feature verification (the rest of the work) is done manually in a browser: run `npm run dev`, walk through each tab, both themes, both languages, and verify the command palette + terminal + shortcuts work.

## 14. Accessibility

- All interactive elements are real `<button>` / `<a>` elements with discernible labels.
- Focus rings use `--accent` with a 2px outline and visible offset.
- Theme switch is announced via `aria-pressed`.
- Language switch is a real `<a>` so right-click "open in new tab" works.
- Keyboard navigation works through the sidebar file tree (arrow keys, Enter to open).
- `prefers-reduced-motion`: the typing animation, page transitions, and scroll reveal collapse to instant — only the essential layout (tab open/close) keeps a 60ms fade.

## 15. Performance

- All content is static. No client-side data fetching.
- Shiki renders highlighted code at build time (server component).
- Images: `next/image`, `priority` only for the README hero, the rest lazy.
- `cmdk` and the terminal are dynamically imported so they don't ship in the first JS chunk.
- Target: Lighthouse Performance ≥ 95 on desktop, ≥ 85 on mobile.

## 16. Responsive behavior

- ≥ 1024 px: full IDE layout as described.
- 768–1023 px: sidebar collapsed by default, can be opened via toggle. Status bar drops cursor position + git branch (keeps only theme, language, "Ready").
- < 768 px: tab strip becomes horizontally scrollable. Terminal panel is hidden (command + button removed from UI). Sidebar opens as a full-width overlay.

## 17. Deployment

- Target: Vercel (Osman already uses Vercel for other projects per CV.txt).
- Static export not required — App Router on Vercel default.
- `next.config.mjs` has `images.formats: ['image/avif', 'image/webp']`.

## 18. Open questions

None. All design decisions are committed; deferring nothing to "we'll figure it out later".

## 19. Out of scope (explicitly deferred)

- Tab reordering by drag — v2.
- Real search panel in the sidebar — v2.
- Real git panel — v2.
- Blog (`/posts`) — v2.
- A "playground" tab that compiles JS — v2.
- Mobile-first redesign — v2 if traffic warrants.
