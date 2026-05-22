# osman.dev — Portfolio

Personal portfolio of **Osman Dayı** (Frontend Developer), built as an interactive code editor. Every section of the CV is a "file" you open in a tab — sidebar, command palette, fake terminal, the whole thing.

> Live: _(deploy soon)_

---

## Features

- **IDE-style shell** — title bar, file-tree sidebar, multi-tab editor, status bar, slide-up terminal panel.
- **Bilingual** — full English + Turkish translations via `next-intl`, switchable from the title bar or command palette.
- **Dark / light themes** — GitHub Modern palette with a 200 ms color transition, system preference auto-detect via `next-themes`.
- **Command palette** — `Cmd/Ctrl+K` opens a `cmdk`-powered fuzzy finder for navigation, theme, language, and quick actions.
- **Keyboard shortcuts** — `Cmd/Ctrl+B` toggles sidebar, `Cmd/Ctrl+W` closes the active tab, `Cmd/Ctrl+1..7` jumps between tabs, `` Ctrl+` `` toggles the terminal.
- **Fake terminal** — `help`, `whoami`, `ls`, `cat <file>`, `open <file>`, `theme dark|light`, `lang en|tr`, `contact`, `clear`, plus history navigation with arrow keys (persisted in `sessionStorage`).
- **Animations** — typing animation on the homepage hero, tab open/close width animation, page-transition fade, scroll-reveal on cards, all collapsing gracefully under `prefers-reduced-motion`.
- **CV download** — automatically serves whichever PDF in `public/` was last modified.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme inline` tokens in `globals.css`) |
| i18n | `next-intl` v4 |
| Theming | `next-themes` |
| Animations | Framer Motion |
| Command palette | `cmdk` |
| Icons | `lucide-react` |
| Tests | Vitest + happy-dom + Testing Library |
| Lint | ESLint flat config + typescript-eslint |

## Quick start

```bash
git clone https://github.com/osmandayi/portfolio-v2.git
cd portfolio-v2
npm install
npm run dev
```

Open <http://localhost:3000> — you'll be redirected to `/en`. Try `/tr` for Turkish.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build (all 14 locale routes pre-rendered) |
| `npm start` | Run the production build |
| `npm test` | Run unit tests once (Vitest) |
| `npm run test:watch` | Watch mode |
| `npm run lint` | ESLint over `src/` |

## Project structure

```
src/
  app/[locale]/         Locale-scoped routes (en/tr) for the 7 sections
  components/
    ide/                Shell chrome: TitleBar, Sidebar, TabStrip, StatusBar, Terminal, CommandPalette
    content/            One component per "file" — README, About, Experience, Projects, Skills, Education, Contact
    primitives/         TypingText, RevealOnView, LineGutter, ThemeToggle, LanguageToggle
    providers/          ThemeProvider + NextIntlClientProvider + UiStoreProvider wrapper
  hooks/                useTabs, useKeyboard, useTerminal, useUiStore, useCursorPosition
  lib/                  files, projects, skills, experience, cv (server-side CV picker), cn
  messages/             en.json, tr.json
  i18n.ts               next-intl config (timezone, locales)
  proxy.ts              next-intl middleware (Next 16 renamed middleware → proxy)
tests/                  Vitest specs for the three non-trivial hooks
public/                 CV PDFs and project screenshots
docs/superpowers/       Original design spec and implementation plan
```

## Deployment

Built for Vercel — push to GitHub, import the repo at <https://vercel.com/new>, no environment variables required. All 14 locale routes are pre-rendered at build time.

## License

Personal portfolio — no open license. Feel free to read the code for ideas, but please don't redeploy it as your own.
