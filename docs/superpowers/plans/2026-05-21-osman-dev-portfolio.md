# osman.dev Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js 15 portfolio site that presents itself as a working code editor (VSCode-like IDE), with EN/TR i18n, dark/light themes, command palette, keyboard shortcuts, fake terminal, and rich animations.

**Architecture:** App Router with a `[locale]` segment. A single IDE shell (TitleBar + Sidebar + TabStrip + EditorArea + StatusBar + Terminal) wraps all routes. Each "file" in the sidebar is a real route whose component renders inside the editor area. State (tabs, terminal history, command palette open) lives in client-side hooks; theme is `next-themes`, i18n is `next-intl`.

**Tech Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS · Framer Motion · next-intl · next-themes · cmdk · shiki · lucide-react · vitest + @testing-library/react.

**Reference spec:** `docs/superpowers/specs/2026-05-21-osman-dev-portfolio-design.md`

---

## Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `.gitignore`, `.eslintrc.json`, `next-env.d.ts`

- [ ] **Step 1.1: Initialize Next.js with TypeScript and Tailwind**

Run from `C:\Users\Pc\Desktop\portfolio`:

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint --use-npm
```

When prompted about overwriting (the spec file is already there), answer `n` to keep existing files. If create-next-app refuses to run in a non-empty dir, run it in a temp dir and copy files over preserving `docs/`.

Expected: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` exist.

- [ ] **Step 1.2: Install runtime dependencies**

```bash
npm install framer-motion next-intl next-themes cmdk shiki lucide-react clsx tailwind-merge tailwindcss-animate @fontsource/jetbrains-mono
```

- [ ] **Step 1.3: Install dev dependencies**

```bash
npm install -D vitest @vitejs/plugin-react happy-dom @testing-library/react @testing-library/jest-dom @testing-library/user-event eslint eslint-config-next prettier prettier-plugin-tailwindcss @types/node
```

- [ ] **Step 1.4: Configure `tsconfig.json`**

Overwrite `tsconfig.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 1.5: Add `.gitignore`**

```
node_modules
.next
out
build
*.log
.env*.local
.DS_Store
coverage
```

- [ ] **Step 1.6: Initialize git and commit**

```bash
git init
git add -A
git commit -m "chore: bootstrap Next.js 15 project"
```

---

## Task 2: Configure Tailwind with design tokens

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Create: `src/lib/cn.ts`

- [ ] **Step 2.1: Write `cn` util**

Create `src/lib/cn.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2.2: Overwrite `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        "panel-2": "var(--panel-2)",
        border: "var(--border)",
        fg: "var(--fg)",
        "fg-muted": "var(--fg-muted)",
        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
        success: "var(--success)",
        danger: "var(--danger)",
        warning: "var(--warning)",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.1s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};
export default config;
```

- [ ] **Step 2.3: Overwrite `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #ffffff;
  --panel: #f6f8fa;
  --panel-2: #eaeef2;
  --border: #d0d7de;
  --fg: #24292f;
  --fg-muted: #57606a;
  --accent: #0969da;
  --accent-2: #8250df;
  --success: #1a7f37;
  --danger: #cf222e;
  --warning: #9a6700;
}

.dark {
  --bg: #0d1117;
  --panel: #161b22;
  --panel-2: #21262d;
  --border: #30363d;
  --fg: #c9d1d9;
  --fg-muted: #8b949e;
  --accent: #58a6ff;
  --accent-2: #a371f7;
  --success: #3fb950;
  --danger: #f85149;
  --warning: #d29922;
}

* {
  border-color: var(--border);
}

html,
body {
  height: 100%;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  transition: background-color 200ms ease-out, color 200ms ease-out;
}

::selection {
  background: var(--accent);
  color: #fff;
}

button,
a {
  outline-offset: 2px;
}
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2.4: Commit**

```bash
git add -A
git commit -m "feat: configure tailwind tokens and globals"
```

---

## Task 3: Set up fonts

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 3.1: Replace `src/app/layout.tsx`**

```tsx
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={inter.variable}
      style={{ ["--font-mono" as string]: "'JetBrains Mono'" }}
    >
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: "osman.dev — Portfolio",
  description: "Osman Dayı — Frontend Developer",
};
```

- [ ] **Step 3.2: Delete `src/app/page.tsx`** (will be replaced by locale route in Task 6)

```bash
rm src/app/page.tsx
```

- [ ] **Step 3.3: Commit**

```bash
git add -A
git commit -m "feat: configure fonts"
```

---

## Task 4: Configure next-intl middleware and routing

**Files:**
- Create: `src/i18n.ts`
- Create: `src/middleware.ts`
- Create: `messages/en.json`
- Create: `messages/tr.json`
- Modify: `next.config.mjs`

- [ ] **Step 4.1: Create empty message files**

`messages/en.json`:

```json
{
  "chrome": {
    "title": "osman.dev — Portfolio",
    "branch": "main",
    "commit": "feat: add i18n",
    "ready": "Ready",
    "themeDark": "dark",
    "themeLight": "light"
  }
}
```

`messages/tr.json`:

```json
{
  "chrome": {
    "title": "osman.dev — Portfolyo",
    "branch": "main",
    "commit": "feat: add i18n",
    "ready": "Hazır",
    "themeDark": "koyu",
    "themeLight": "açık"
  }
}
```

- [ ] **Step 4.2: Create `src/i18n.ts`**

```ts
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["en", "tr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4.3: Create `src/middleware.ts`**

```ts
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

- [ ] **Step 4.4: Update `next.config.mjs`**

```js
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 4.5: Verify build compiles**

```bash
npm run build
```

Expected: builds without errors (no pages yet — only middleware).

- [ ] **Step 4.6: Commit**

```bash
git add -A
git commit -m "feat: wire next-intl middleware and i18n config"
```

---

## Task 5: Set up next-themes provider

**Files:**
- Create: `src/components/providers/Providers.tsx`

- [ ] **Step 5.1: Create `src/components/providers/Providers.tsx`**

```tsx
"use client";

import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { ReactNode } from "react";

export function Providers({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
```

- [ ] **Step 5.2: Commit**

```bash
git add -A
git commit -m "feat: add theme and intl providers"
```

---

## Task 6: Create canonical data layer

**Files:**
- Create: `src/lib/files.ts`
- Create: `src/lib/projects.ts`
- Create: `src/lib/skills.ts`
- Create: `src/lib/experience.ts`

- [ ] **Step 6.1: Create `src/lib/files.ts`**

```ts
import type { LucideIcon } from "lucide-react";
import {
  FileText,
  FileCode2,
  FileJson,
  Terminal as TerminalIcon,
  GraduationCap,
} from "lucide-react";

export type FileId =
  | "readme"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "contact";

export interface FileEntry {
  id: FileId;
  label: string;
  route: string;
  icon: LucideIcon;
  iconColor: string;
  order: number;
}

export const FILES: FileEntry[] = [
  { id: "readme",     label: "README.md",       route: "/",            icon: FileText,      iconColor: "var(--accent)",   order: 1 },
  { id: "about",      label: "about.md",        route: "/about",       icon: FileText,      iconColor: "var(--accent)",   order: 2 },
  { id: "experience", label: "experience.tsx", route: "/experience",  icon: FileCode2,     iconColor: "var(--warning)",  order: 3 },
  { id: "projects",   label: "projects.tsx",    route: "/projects",    icon: FileCode2,     iconColor: "var(--warning)",  order: 4 },
  { id: "skills",     label: "skills.json",     route: "/skills",      icon: FileJson,      iconColor: "var(--success)",  order: 5 },
  { id: "education",  label: "education.md",   route: "/education",   icon: GraduationCap, iconColor: "var(--accent-2)", order: 6 },
  { id: "contact",    label: "contact.sh",      route: "/contact",     icon: TerminalIcon,  iconColor: "var(--danger)",   order: 7 },
];

export function fileByRoute(route: string): FileEntry | undefined {
  const norm = route.replace(/^\/(en|tr)/, "") || "/";
  return FILES.find((f) => f.route === norm);
}

export function fileById(id: FileId): FileEntry {
  const f = FILES.find((x) => x.id === id);
  if (!f) throw new Error(`unknown file id: ${id}`);
  return f;
}
```

- [ ] **Step 6.2: Copy project images**

```bash
mkdir -p public/projects
cp "/c/Users/Pc/Documents/GitHub/portfolio/public/projects/coffe-pub.png" public/projects/
cp "/c/Users/Pc/Documents/GitHub/portfolio/public/projects/sas.png" public/projects/
cp "/c/Users/Pc/Documents/GitHub/portfolio/public/projects/online-commerce-and-grocery.png" public/projects/
cp "/c/Users/Pc/Documents/GitHub/portfolio/public/projects/netflix-clone-fe.png" public/projects/
cp "/c/Users/Pc/Documents/GitHub/portfolio/public/projects/demo_dijirack.png" public/projects/
cp "/c/Users/Pc/Documents/GitHub/portfolio/public/projects/demo_ifi.png" public/projects/
cp "/c/Users/Pc/Documents/GitHub/portfolio/public/projects/medscript.png" public/projects/
```

(On Windows PowerShell, equivalent: `Copy-Item "C:\Users\Pc\Documents\GitHub\portfolio\public\projects\*.png" "public\projects\"`.)

- [ ] **Step 6.3: Create `src/lib/projects.ts`**

```ts
export type ProjectTag = "Frontend" | "FullStack";

export interface Project {
  id: string;
  titleKey: string;
  descKey: string;
  image: string;
  tags: ProjectTag[];
  gitUrl: string | null;
  previewUrl: string | null;
}

export const PROJECTS: Project[] = [
  {
    id: "coffe-pub",
    titleKey: "projects.items.coffe.title",
    descKey: "projects.items.coffe.desc",
    image: "/projects/coffe-pub.png",
    tags: ["Frontend"],
    gitUrl: "https://github.com/osmandayi/CoffePub",
    previewUrl: "https://coffe-pub.vercel.app/",
  },
  {
    id: "sas",
    titleKey: "projects.items.sas.title",
    descKey: "projects.items.sas.desc",
    image: "/projects/sas.png",
    tags: ["Frontend"],
    gitUrl: "https://github.com/osmandayi/30Temmuz",
    previewUrl: "https://30-temmuz.vercel.app/",
  },
  {
    id: "ecommerce",
    titleKey: "projects.items.ecommerce.title",
    descKey: "projects.items.ecommerce.desc",
    image: "/projects/online-commerce-and-grocery.png",
    tags: ["FullStack"],
    gitUrl: "https://github.com/osmandayi/E-Commerce",
    previewUrl: "https://online-commerce-and-grocery.vercel.app/",
  },
  {
    id: "netflix",
    titleKey: "projects.items.netflix.title",
    descKey: "projects.items.netflix.desc",
    image: "/projects/netflix-clone-fe.png",
    tags: ["Frontend"],
    gitUrl: "https://github.com/osmandayi/Netflix-Clone-FE",
    previewUrl: "https://netflix-clone-fe.vercel.app/",
  },
  {
    id: "dijirack",
    titleKey: "projects.items.dijirack.title",
    descKey: "projects.items.dijirack.desc",
    image: "/projects/demo_dijirack.png",
    tags: ["Frontend"],
    gitUrl: null,
    previewUrl: "https://demo.dijirack.com/",
  },
  {
    id: "ifi",
    titleKey: "projects.items.ifi.title",
    descKey: "projects.items.ifi.desc",
    image: "/projects/demo_ifi.png",
    tags: ["Frontend"],
    gitUrl: null,
    previewUrl: null,
  },
  {
    id: "medscript",
    titleKey: "projects.items.medscript.title",
    descKey: "projects.items.medscript.desc",
    image: "/projects/medscript.png",
    tags: ["Frontend"],
    gitUrl: null,
    previewUrl: "http://medscript.dijirack.com/",
  },
];

export const PROJECT_TAG_FILTERS: ("All" | ProjectTag)[] = ["All", "Frontend", "FullStack"];
```

- [ ] **Step 6.4: Create `src/lib/skills.ts`**

```ts
export interface SkillCategory {
  key: "core" | "libraries" | "tools";
  items: string[];
}

export const SKILLS: SkillCategory[] = [
  {
    key: "core",
    items: [
      "HTML", "CSS", "JavaScript", "TypeScript",
      "React", "Next.js", "Vue", "Angular",
      "Node.js", "REST", "PostgreSQL", "MongoDB",
    ],
  },
  {
    key: "libraries",
    items: [
      "Tailwind CSS", "SASS", "MUI", "shadcn/ui",
      "Redux Toolkit", "Zustand", "React Query",
      "React Router", "React Flow", "ApexCharts",
      "Formik", "Yup", "next-auth", "i18next",
      "Axios", "JQuery",
    ],
  },
  {
    key: "tools",
    items: ["Git", "GitHub", "Slack", "Jira"],
  },
];
```

- [ ] **Step 6.5: Create `src/lib/experience.ts`**

```ts
export interface ExperienceEntry {
  id: string;
  company: string;
  roleKey: string;
  from: string;
  to: string | null;
  bulletsKey: string;
  subRoles?: { titleKey: string; bulletsKey: string }[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: "huawei",
    company: "Huawei",
    roleKey: "experience.huawei.role",
    from: "2025-01",
    to: null,
    bulletsKey: "experience.huawei.bullets",
    subRoles: [
      { titleKey: "experience.huawei.nbi.title", bulletsKey: "experience.huawei.nbi.bullets" },
      { titleKey: "experience.huawei.sc.title", bulletsKey: "experience.huawei.sc.bullets" },
    ],
  },
  {
    id: "azetech",
    company: "Azetech",
    roleKey: "experience.azetech.role",
    from: "2023-01",
    to: "2025-01",
    bulletsKey: "experience.azetech.bullets",
  },
  {
    id: "hakmar",
    company: "Hakmar Gıda A.Ş.",
    roleKey: "experience.hakmar.role",
    from: "2022-06",
    to: "2022-07",
    bulletsKey: "experience.hakmar.bullets",
  },
];
```

- [ ] **Step 6.6: Commit**

```bash
git add -A
git commit -m "feat: add canonical data layer (files, projects, skills, experience)"
```

---

## Task 7: Fill translation files

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/tr.json`

- [ ] **Step 7.1: Overwrite `messages/en.json`**

```json
{
  "chrome": {
    "title": "osman.dev — Portfolio",
    "branch": "main",
    "commit": "feat: add i18n",
    "ready": "Ready",
    "themeDark": "dark",
    "themeLight": "light",
    "encoding": "UTF-8",
    "sidebarExplorer": "Explorer",
    "sidebarSearch": "Search",
    "sidebarGit": "Source Control",
    "sidebarSettings": "Settings",
    "comingSoon": "Coming soon",
    "toggleSidebar": "Toggle sidebar",
    "toggleTerminal": "Toggle terminal",
    "openExternal": "Open LinkedIn"
  },
  "readme": {
    "greeting": "// Welcome to my portfolio",
    "name": "Osman Dayı",
    "role": "Frontend Engineer",
    "pitch": "I build modern, performant web interfaces. Currently migrating legacy systems to modern frontend architectures at Huawei.",
    "ctaProjects": "View projects",
    "ctaContact": "Contact me",
    "ctaCv": "Download CV"
  },
  "about": {
    "heading": "About me",
    "body": "Hi, I'm Osman Dayı. I'm a Computer Engineering graduate and a Frontend Developer with around 3 years of experience. My career has mostly focused on migrating legacy systems to modern frontend architectures, performance optimization, and building sustainable interfaces.\n\nAt Huawei, I work on migration projects involving older React stacks, vanilla JavaScript, Vue.js, and enterprise UI libraries — modernizing complex systems. In my own projects I produce user-focused, secure applications with React, Next.js, Tailwind CSS, and various state management solutions.\n\nFor a short period I ran my own office, building CRM and ERP solutions and an integration product that lets you manage multiple e-commerce platforms from a single panel.\n\nI adapt quickly to new projects and aim to add value through curiosity and problem solving."
  },
  "experience": {
    "heading": "Experience",
    "present": "Present",
    "huawei": {
      "role": "Software Developer",
      "bullets": "At Huawei I'm primarily involved in frontend migration projects.",
      "nbi": {
        "title": "NBI (Northbound Interface)",
        "bullets": "Worked on critical modules: server information, network inventory, device statuses, system integrations and operator-based data management.||Because the project used an older React version and a Huawei-internal legacy UI library, many problems had to be solved with vanilla JavaScript.||With limited debugging tooling, I took ownership of the hardest parts and reduced the technical load on the team using my vanilla JS experience.||Took an active role in refactor, debugging and performance work."
      },
      "sc": {
        "title": "Supply Chain",
        "bullets": "Migrating a project originally built with Webix UI to a modern stack.||Learned Vue.js quickly to onboard onto the migration.||Rebuilt pages using Huawei's in-house Aurora UI library to meet modern UI/UX standards.||Helped migrate pages quickly, sustainably and in a way that scales."
      }
    },
    "azetech": {
      "role": "Frontend Developer",
      "bullets": "Built Dijirack, an IT monitoring application.||Built responsive, user-friendly interfaces with MUI.||Implemented JWT-based authentication and authorization for secure access.||Used React Query to manage asynchronous state effectively.||Used ApexCharts for user-friendly charts and diagrams.||Built interactive forms with Formik.||Used REST APIs and proper protocols for secure data transfer.||Built cabinet and topology visualizations with React Flow."
    },
    "hakmar": {
      "role": "Intern",
      "bullets": "Built various mobile applications with Flutter and Firebase during my internship — Quiz App, BMI Calculator, Flash Chat, Roll Dice, Destiny Game."
    }
  },
  "projects": {
    "heading": "Projects",
    "filterAll": "All",
    "filterFrontend": "Frontend",
    "filterFullStack": "FullStack",
    "viewGit": "GitHub",
    "viewLive": "Live demo",
    "noLive": "No live demo",
    "noRepo": "Private repo",
    "items": {
      "coffe": {
        "title": "Coffe Pub",
        "desc": "A single-page coffee site offering information and choices for coffee lovers. Tailwind for layout, React Type Animation for entrance effects — smooth transitions and immersive visual elements."
      },
      "sas": {
        "title": "SAS — 30 Temmuz",
        "desc": "A simple educational/marketing single-page site built with React and Tailwind."
      },
      "ecommerce": {
        "title": "E-Commerce",
        "desc": "A modern e-commerce experience with validation and user-friendly features. Tailwind UI, Zustand for state, Strapi backend, per-user persistent carts."
      },
      "netflix": {
        "title": "Netflix Clone",
        "desc": "Netflix UI clone — responsive grid, hover interactions, video card details."
      },
      "dijirack": {
        "title": "Dijirack",
        "desc": "IT monitoring application built at Azetech. MUI, JWT auth, React Query, ApexCharts, React Flow topologies, Formik forms."
      },
      "ifi": {
        "title": "IFI",
        "desc": "Enterprise internal frontend project (private)."
      },
      "medscript": {
        "title": "Medscript",
        "desc": "Analyzes potential side-effect interactions between medications for safer use. Next.js + Tailwind, Select2 components. Teknofest 2024 entry — a contribution toward safer medication usage."
      }
    }
  },
  "skills": {
    "heading": "Skills",
    "core": "Core",
    "libraries": "Libraries & Tools",
    "tools": "Workflow"
  },
  "education": {
    "heading": "Education",
    "school": "Zonguldak Bülent Ecevit University",
    "degree": "B.S. Computer Engineering",
    "years": "2018 – 2023",
    "lang": "Foreign language: English (B1)"
  },
  "contact": {
    "heading": "Contact",
    "intro": "$ ./contact.sh",
    "phone": "Phone",
    "email": "Email",
    "location": "Location",
    "locationValue": "Pendik / İstanbul",
    "github": "GitHub",
    "linkedin": "LinkedIn",
    "copyEmail": "Copy email",
    "copied": "Copied!"
  },
  "palette": {
    "placeholder": "Type a command…",
    "empty": "No results.",
    "groupNav": "Navigation",
    "groupTheme": "Theme",
    "groupLang": "Language",
    "groupLinks": "Links",
    "groupActions": "Actions",
    "go": "Go to",
    "switchTheme": "Switch theme",
    "switchLang": "Switch language",
    "openGithub": "Open GitHub",
    "openLinkedin": "Open LinkedIn",
    "copyEmail": "Copy email",
    "toggleTerminal": "Toggle terminal",
    "toggleSidebar": "Toggle sidebar"
  },
  "terminal": {
    "prompt": "osman@portfolio:~$",
    "welcome": "Type 'help' to see available commands.",
    "notFound": "command not found: {cmd}. Type 'help'.",
    "help": "Available commands:\n  help                show this help\n  whoami              print user name\n  ls                  list files\n  cat <file>          dump a section\n  open <file>         open a tab\n  theme dark|light    switch theme\n  lang en|tr          switch language\n  contact             print contact info\n  clear               clear scrollback\n  vim|nano|sudo …     :)",
    "vimJoke": "vim is not installed. Try Cursor.",
    "nanoJoke": "nano? In 2026?",
    "sudoJoke": "osman is not in the sudoers file. This incident will be reported."
  }
}
```

- [ ] **Step 7.2: Overwrite `messages/tr.json`**

```json
{
  "chrome": {
    "title": "osman.dev — Portfolyo",
    "branch": "main",
    "commit": "feat: add i18n",
    "ready": "Hazır",
    "themeDark": "koyu",
    "themeLight": "açık",
    "encoding": "UTF-8",
    "sidebarExplorer": "Gezgin",
    "sidebarSearch": "Arama",
    "sidebarGit": "Kaynak Kontrol",
    "sidebarSettings": "Ayarlar",
    "comingSoon": "Yakında",
    "toggleSidebar": "Sidebar'ı aç/kapat",
    "toggleTerminal": "Terminali aç/kapat",
    "openExternal": "LinkedIn'i aç"
  },
  "readme": {
    "greeting": "// Portfolyoma hoş geldiniz",
    "name": "Osman Dayı",
    "role": "Frontend Geliştirici",
    "pitch": "Modern ve performanslı web arayüzleri geliştiriyorum. Şu anda Huawei'de eski sistemleri modern frontend mimarilerine taşıyorum.",
    "ctaProjects": "Projeleri gör",
    "ctaContact": "İletişime geç",
    "ctaCv": "CV'yi indir"
  },
  "about": {
    "heading": "Hakkımda",
    "body": "Merhabalar, ben Osman Dayı. Bilgisayar Mühendisliği mezunuyum ve Frontend Developer olarak yaklaşık 3 yıllık deneyime sahibim. Kariyerimde ağırlıklı olarak legacy sistemlerin modern frontend mimarilerine taşınması, performans iyileştirme ve sürdürülebilir arayüzler geliştirme üzerine çalıştım.\n\nHuawei'de yer aldığım migration projelerinde eski React yapıları, Pure JavaScript, Vue.js ve kurumsal UI kütüphaneleriyle karmaşık sistemleri modernleştirdim. Geliştirdiğim projelerde React, Next.js, Tailwind CSS ve çeşitli state management çözümleriyle kullanıcı odaklı ve güvenli uygulamalar ürettim.\n\nBuna ek olarak, kısa süreliğine kendi ofisimi kurarak CRM ve ERP odaklı müşteri ihtiyaçlarına çözümler geliştirdim ve çoklu e-ticaret platformlarını tek bir panelden yönetmeyi sağlayan bir entegrasyon ürünü üzerinde çalıştım.\n\nÖğrenmeye açık yapım ve problem çözme becerilerimle, yer aldığım projelere hızlı adapte olarak katma değer sağlamayı hedefliyorum."
  },
  "experience": {
    "heading": "Deneyim",
    "present": "Devam ediyor",
    "huawei": {
      "role": "Yazılım Geliştirici",
      "bullets": "Huawei bünyesinde ağırlıklı olarak frontend migration projelerinde aktif rol aldım.",
      "nbi": {
        "title": "NBI (Northbound Interface)",
        "bullets": "Sunucu bilgileri, network envanteri, cihaz durumları, sistem entegrasyonları ve operatör bazlı veri yönetimi gibi kritik modüller üzerinde çalıştım.||Projede React'in eski bir sürümü ve Huawei'ye özel legacy bir UI kütüphanesi kullanıldığından, birçok teknik problemi pure JavaScript ile çözmek zorunda kaldım.||Debug süreçlerinin sınırlı olması nedeniyle, karmaşık ve zorlayıcı kısımlarda sorumluluk alarak pure JavaScript tecrübemle ekip üzerindeki teknik yükü azalttım.||Kod refactor, hata ayıklama ve performans iyileştirme çalışmalarında aktif rol aldım."
      },
      "sc": {
        "title": "Supply Chain",
        "bullets": "Daha önce Webix UI ile geliştirilmiş projenin modern mimariye taşınması sürecinde çalıştım.||Migration sürecinde, daha önce kullanmadığım Vue.js teknolojisini kısa sürede öğrenerek projeye hızlıca adapte oldum.||Huawei'nin inline UI kütüphanesi olan Aurora kullanılarak sayfaların yeniden geliştirilmesi ve modern UI/UX standartlarına uygun hale getirilmesini sağladım.||Kısa sürede önemli ilerleme kaydederek sayfaların hızlı, sürdürülebilir ve ölçeklenebilir şekilde migrate edilmesine katkı sağladım."
      }
    },
    "azetech": {
      "role": "Frontend Geliştirici",
      "bullets": "Dijirack adında bir IT monitoring uygulaması geliştirdim.||Duyarlı ve kullanıcı dostu arayüzler oluşturmak için MUI kütüphanesini kullandım.||JWT tabanlı kimlik doğrulama ve yetkilendirme sistemlerini uygulayarak güvenli kullanıcı erişimi sağladım.||Asenkron durumu etkin bir şekilde yönetmek için React Query kütüphanesini kullandım.||Kullanıcı dostu grafikler ve diyagramlar oluşturmak için ApexCharts'tan yararlandım.||Form yönetimi için Formik kütüphanesini kullanarak interaktif formlar geliştirdim.||Veri iletimini güvenli şekilde sağlamak için RESTful API çağrıları kullandım.||React Flow kullanarak kabin ve topoloji görselleştirmeleri oluşturdum."
    },
    "hakmar": {
      "role": "Stajyer",
      "bullets": "Stajyerlik dönemimde Flutter ve Firebase kullanarak çeşitli mobil uygulamalar geliştirdim: Quiz App, BMI Calculator, Flash Chat, Zar At ve Destiny Game."
    }
  },
  "projects": {
    "heading": "Projeler",
    "filterAll": "Tümü",
    "filterFrontend": "Frontend",
    "filterFullStack": "FullStack",
    "viewGit": "GitHub",
    "viewLive": "Canlı önizleme",
    "noLive": "Canlı önizleme yok",
    "noRepo": "Özel repo",
    "items": {
      "coffe": {
        "title": "Coffe Pub",
        "desc": "Kahve severler için bilgi ve seçenekler sunan tek sayfalık site. Tailwind ile şık layout, React Type Animation ile etkileşim — akıcı geçişler ve etkileyici görsel öğeler."
      },
      "sas": {
        "title": "SAS — 30 Temmuz",
        "desc": "React ve Tailwind ile geliştirilmiş basit eğitsel/tanıtım odaklı tek sayfalık site."
      },
      "ecommerce": {
        "title": "E-Ticaret",
        "desc": "Modern arayüz, doğrulama işlemleri ve kullanıcı dostu özelliklerle online alışveriş deneyimini optimize eden proje. Tailwind UI, Zustand state, Strapi backend, kullanıcıya özel kalıcı sepetler."
      },
      "netflix": {
        "title": "Netflix Clone",
        "desc": "Netflix UI klonu — responsive grid, hover etkileşimleri, video kart detayları."
      },
      "dijirack": {
        "title": "Dijirack",
        "desc": "Azetech'te geliştirdiğim IT monitoring uygulaması. MUI, JWT auth, React Query, ApexCharts, React Flow topolojileri, Formik formları."
      },
      "ifi": {
        "title": "IFI",
        "desc": "Kurumsal iç frontend projesi (özel)."
      },
      "medscript": {
        "title": "Medscript",
        "desc": "İlaçların birbirleriyle olan potansiyel yan etkileşimlerini analiz ederek güvenli kullanımı destekleyen proje. Next.js + Tailwind, Select2 bileşenleri. Teknofest 2024 — güvenli ilaç kullanımına katkı."
      }
    }
  },
  "skills": {
    "heading": "Yetenekler",
    "core": "Çekirdek",
    "libraries": "Kütüphaneler & Araçlar",
    "tools": "İş Akışı"
  },
  "education": {
    "heading": "Eğitim",
    "school": "Zonguldak Bülent Ecevit Üniversitesi",
    "degree": "Bilgisayar Mühendisliği Lisans",
    "years": "2018 – 2023",
    "lang": "Yabancı dil: İngilizce (B1)"
  },
  "contact": {
    "heading": "İletişim",
    "intro": "$ ./contact.sh",
    "phone": "Telefon",
    "email": "E-posta",
    "location": "Konum",
    "locationValue": "Pendik / İstanbul",
    "github": "GitHub",
    "linkedin": "LinkedIn",
    "copyEmail": "E-postayı kopyala",
    "copied": "Kopyalandı!"
  },
  "palette": {
    "placeholder": "Bir komut yazın…",
    "empty": "Sonuç yok.",
    "groupNav": "Gezinme",
    "groupTheme": "Tema",
    "groupLang": "Dil",
    "groupLinks": "Bağlantılar",
    "groupActions": "Eylemler",
    "go": "Git",
    "switchTheme": "Temayı değiştir",
    "switchLang": "Dili değiştir",
    "openGithub": "GitHub'ı aç",
    "openLinkedin": "LinkedIn'i aç",
    "copyEmail": "E-postayı kopyala",
    "toggleTerminal": "Terminali aç/kapat",
    "toggleSidebar": "Sidebar'ı aç/kapat"
  },
  "terminal": {
    "prompt": "osman@portfolio:~$",
    "welcome": "Komutlar için 'help' yazın.",
    "notFound": "komut bulunamadı: {cmd}. 'help' yazın.",
    "help": "Mevcut komutlar:\n  help                bu yardımı göster\n  whoami              kullanıcı adını yaz\n  ls                  dosyaları listele\n  cat <file>          bir bölümü göster\n  open <file>         bir tab aç\n  theme dark|light    temayı değiştir\n  lang en|tr          dili değiştir\n  contact             iletişim bilgisi\n  clear               terminali temizle\n  vim|nano|sudo …     :)",
    "vimJoke": "vim yüklü değil. Cursor dene.",
    "nanoJoke": "nano mu? 2026'da mı?",
    "sudoJoke": "osman sudoers dosyasında değil. Bu olay bildirilecek."
  }
}
```

- [ ] **Step 7.3: Commit**

```bash
git add -A
git commit -m "feat: add EN/TR translations"
```

---

## Task 8: Build the locale-scoped root layout

**Files:**
- Create: `src/app/[locale]/layout.tsx`

- [ ] **Step 8.1: Create `src/app/[locale]/layout.tsx`**

```tsx
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Providers } from "@/components/providers/Providers";
import { Shell } from "@/components/ide/Shell";
import { locales } from "@/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <Providers locale={locale} messages={messages}>
      <Shell>{children}</Shell>
    </Providers>
  );
}
```

- [ ] **Step 8.2: Note — the `Shell` import will fail until Task 9. Skip the verify step.**

---

## Task 9: Create the IDE Shell wrapper (composes the chrome)

**Files:**
- Create: `src/components/ide/Shell.tsx`

- [ ] **Step 9.1: Create `src/components/ide/Shell.tsx`**

```tsx
"use client";

import { ReactNode } from "react";
import { TitleBar } from "./TitleBar";
import { Sidebar } from "./Sidebar";
import { TabStrip } from "./TabStrip";
import { StatusBar } from "./StatusBar";
import { Terminal } from "./Terminal";
import { CommandPalette } from "./CommandPalette";
import { useUiStore } from "@/hooks/useUiStore";
import { useKeyboard } from "@/hooks/useKeyboard";

export function Shell({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useUiStore();
  useKeyboard();

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-bg text-fg">
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        {sidebarOpen && <Sidebar />}
        <div className="flex min-w-0 flex-1 flex-col">
          <TabStrip />
          <main className="relative flex min-h-0 flex-1 overflow-hidden">
            <div className="flex min-w-0 flex-1 flex-col overflow-auto">
              {children}
            </div>
          </main>
          <Terminal />
        </div>
      </div>
      <StatusBar />
      <CommandPalette />
    </div>
  );
}
```

- [ ] **Step 9.2: Note — subcomponents come in later tasks.**

---

## Task 10: UI store (Zustand-free, simple context)

**Files:**
- Create: `src/hooks/useUiStore.tsx`

- [ ] **Step 10.1: Create `src/hooks/useUiStore.tsx`**

Using a small custom store (no Zustand to keep deps light):

```tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface UiState {
  sidebarOpen: boolean;
  paletteOpen: boolean;
  terminalOpen: boolean;
  setSidebar: (v: boolean | ((p: boolean) => boolean)) => void;
  setPalette: (v: boolean | ((p: boolean) => boolean)) => void;
  setTerminal: (v: boolean | ((p: boolean) => boolean)) => void;
}

const UiContext = createContext<UiState | null>(null);

export function UiStoreProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpenRaw] = useState(true);
  const [paletteOpen, setPaletteOpenRaw] = useState(false);
  const [terminalOpen, setTerminalOpenRaw] = useState(false);

  const setSidebar = useCallback(
    (v: boolean | ((p: boolean) => boolean)) =>
      setSidebarOpenRaw((p) => (typeof v === "function" ? v(p) : v)),
    [],
  );
  const setPalette = useCallback(
    (v: boolean | ((p: boolean) => boolean)) =>
      setPaletteOpenRaw((p) => (typeof v === "function" ? v(p) : v)),
    [],
  );
  const setTerminal = useCallback(
    (v: boolean | ((p: boolean) => boolean)) =>
      setTerminalOpenRaw((p) => (typeof v === "function" ? v(p) : v)),
    [],
  );

  return (
    <UiContext.Provider
      value={{ sidebarOpen, paletteOpen, terminalOpen, setSidebar, setPalette, setTerminal }}
    >
      {children}
    </UiContext.Provider>
  );
}

export function useUiStore() {
  const v = useContext(UiContext);
  if (!v) throw new Error("useUiStore must be used inside UiStoreProvider");
  return v;
}
```

- [ ] **Step 10.2: Wire `UiStoreProvider` into `Providers.tsx`**

Modify `src/components/providers/Providers.tsx`:

```tsx
"use client";

import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { ReactNode } from "react";
import { UiStoreProvider } from "@/hooks/useUiStore";

export function Providers({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <UiStoreProvider>{children}</UiStoreProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
```

- [ ] **Step 10.3: Commit**

```bash
git add -A
git commit -m "feat: add UI store for sidebar/palette/terminal state"
```

---

## Task 11: useTabs hook (TDD)

**Files:**
- Create: `src/hooks/useTabs.ts`
- Create: `vitest.config.ts`
- Create: `src/test-setup.ts`
- Create: `tests/hooks/useTabs.test.tsx`
- Modify: `package.json` (test scripts)

- [ ] **Step 11.1: Configure vitest**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./src/test-setup.ts"],
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

Create `src/test-setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());

// jsdom/happy-dom don't implement matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

Modify `package.json` — add scripts (merge into existing `"scripts"`):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 11.2: Write the failing test**

Create `tests/hooks/useTabs.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTabs } from "@/hooks/useTabs";

describe("useTabs", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("opens README by default", () => {
    const { result } = renderHook(() => useTabs());
    expect(result.current.openIds).toEqual(["readme"]);
    expect(result.current.activeId).toBe("readme");
  });

  it("opens a new tab and makes it active", () => {
    const { result } = renderHook(() => useTabs());
    act(() => result.current.open("about"));
    expect(result.current.openIds).toEqual(["readme", "about"]);
    expect(result.current.activeId).toBe("about");
  });

  it("opening an already-open tab just activates it", () => {
    const { result } = renderHook(() => useTabs());
    act(() => result.current.open("about"));
    act(() => result.current.open("projects"));
    act(() => result.current.open("about"));
    expect(result.current.openIds).toEqual(["readme", "about", "projects"]);
    expect(result.current.activeId).toBe("about");
  });

  it("closes the active tab and activates the next one to the right", () => {
    const { result } = renderHook(() => useTabs());
    act(() => result.current.open("about"));
    act(() => result.current.open("projects"));
    // active is projects (last opened). Activate about manually.
    act(() => result.current.setActive("about"));
    act(() => result.current.close("about"));
    expect(result.current.openIds).toEqual(["readme", "projects"]);
    expect(result.current.activeId).toBe("projects");
  });

  it("closes the rightmost active tab and activates the previous one", () => {
    const { result } = renderHook(() => useTabs());
    act(() => result.current.open("about"));
    act(() => result.current.open("projects"));
    act(() => result.current.close("projects"));
    expect(result.current.openIds).toEqual(["readme", "about"]);
    expect(result.current.activeId).toBe("about");
  });

  it("closing the last tab re-opens README", () => {
    const { result } = renderHook(() => useTabs());
    act(() => result.current.close("readme"));
    expect(result.current.openIds).toEqual(["readme"]);
    expect(result.current.activeId).toBe("readme");
  });

  it("persists tabs to localStorage", () => {
    const { result } = renderHook(() => useTabs());
    act(() => result.current.open("about"));
    expect(JSON.parse(localStorage.getItem("portfolio.tabs") ?? "{}")).toMatchObject({
      openIds: ["readme", "about"],
      activeId: "about",
    });
  });
});
```

- [ ] **Step 11.3: Run test — expect FAIL**

```bash
npm test
```

Expected: errors because `@/hooks/useTabs` is not implemented.

- [ ] **Step 11.4: Implement `src/hooks/useTabs.ts`**

```ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { FileId, FILES } from "@/lib/files";

const STORAGE_KEY = "portfolio.tabs";

interface Persisted {
  openIds: FileId[];
  activeId: FileId;
}

function load(): Persisted {
  if (typeof window === "undefined") return { openIds: ["readme"], activeId: "readme" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { openIds: ["readme"], activeId: "readme" };
    const parsed = JSON.parse(raw) as Persisted;
    if (!Array.isArray(parsed.openIds) || parsed.openIds.length === 0) {
      return { openIds: ["readme"], activeId: "readme" };
    }
    return parsed;
  } catch {
    return { openIds: ["readme"], activeId: "readme" };
  }
}

function save(state: Persisted) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useTabs() {
  const [state, setState] = useState<Persisted>(() => load());

  useEffect(() => {
    save(state);
  }, [state]);

  const open = useCallback((id: FileId) => {
    setState((s) => {
      if (s.openIds.includes(id)) return { ...s, activeId: id };
      return { openIds: [...s.openIds, id], activeId: id };
    });
  }, []);

  const close = useCallback((id: FileId) => {
    setState((s) => {
      const idx = s.openIds.indexOf(id);
      if (idx === -1) return s;
      const next = s.openIds.filter((x) => x !== id);
      if (next.length === 0) return { openIds: ["readme"], activeId: "readme" };
      let nextActive = s.activeId;
      if (s.activeId === id) {
        nextActive = next[idx] ?? next[idx - 1] ?? next[0];
      }
      return { openIds: next, activeId: nextActive };
    });
  }, []);

  const setActive = useCallback((id: FileId) => {
    setState((s) => (s.openIds.includes(id) ? { ...s, activeId: id } : s));
  }, []);

  const reset = useCallback(() => setState({ openIds: ["readme"], activeId: "readme" }), []);

  return {
    openIds: state.openIds,
    activeId: state.activeId,
    open,
    close,
    setActive,
    reset,
    files: FILES,
  };
}
```

- [ ] **Step 11.5: Run test — expect PASS**

```bash
npm test
```

Expected: all 7 tests pass.

- [ ] **Step 11.6: Commit**

```bash
git add -A
git commit -m "feat: add useTabs hook with tests"
```

---

## Task 12: TitleBar component

**Files:**
- Create: `src/components/ide/TitleBar.tsx`
- Create: `src/components/primitives/ThemeToggle.tsx`
- Create: `src/components/primitives/LanguageToggle.tsx`

- [ ] **Step 12.1: Create `src/components/primitives/ThemeToggle.tsx`**

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, MonitorCog } from "lucide-react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("chrome");
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <button className="h-6 w-6" aria-hidden />;
  }

  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const Icon = theme === "system" ? MonitorCog : resolvedTheme === "dark" ? Moon : Sun;

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`theme: ${theme}`}
      title={`theme: ${theme}`}
      className="flex h-6 w-6 items-center justify-center rounded text-fg-muted hover:bg-panel-2 hover:text-fg"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
```

- [ ] **Step 12.2: Create `src/components/primitives/LanguageToggle.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const next = locale === "tr" ? "en" : "tr";
  const nextPath = pathname.replace(/^\/(en|tr)/, `/${next}`);

  return (
    <Link
      href={nextPath || `/${next}`}
      className="flex h-6 min-w-[2rem] items-center justify-center rounded px-1.5 text-[11px] font-medium uppercase text-fg-muted hover:bg-panel-2 hover:text-fg"
      aria-label={`Switch to ${next.toUpperCase()}`}
    >
      {next}
    </Link>
  );
}
```

- [ ] **Step 12.3: Create `src/components/ide/TitleBar.tsx`**

```tsx
"use client";

import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";
import { LanguageToggle } from "@/components/primitives/LanguageToggle";

export function TitleBar() {
  const t = useTranslations("chrome");
  return (
    <header className="flex h-8 shrink-0 items-center justify-between border-b border-border bg-panel px-3 text-[12px] text-fg-muted">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="select-none">{t("title")}</div>
      <div className="flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
        <a
          href="https://www.linkedin.com/in/osman-d-272a2820b/"
          target="_blank"
          rel="noreferrer"
          aria-label={t("openExternal")}
          className="flex h-6 w-6 items-center justify-center rounded text-fg-muted hover:bg-panel-2 hover:text-fg"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}
```

- [ ] **Step 12.4: Commit**

```bash
git add -A
git commit -m "feat: add title bar with theme and language toggles"
```

---

## Task 13: Sidebar + FileTree

**Files:**
- Create: `src/components/ide/Sidebar.tsx`
- Create: `src/components/ide/FileTree.tsx`

- [ ] **Step 13.1: Create `src/components/ide/FileTree.tsx`**

```tsx
"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Folder } from "lucide-react";
import { useState } from "react";
import { FILES } from "@/lib/files";
import { useTabs } from "@/hooks/useTabs";
import { cn } from "@/lib/cn";

export function FileTree() {
  const locale = useLocale();
  const t = useTranslations("chrome");
  const router = useRouter();
  const pathname = usePathname();
  const [folderOpen, setFolderOpen] = useState(true);
  const { open } = useTabs();

  const handle = (id: (typeof FILES)[number]["id"], route: string) => {
    open(id);
    router.push(`/${locale}${route === "/" ? "" : route}`);
  };

  const activeRoute = pathname.replace(/^\/(en|tr)/, "") || "/";

  return (
    <div className="select-none px-2 py-2 text-[13px]">
      <button
        onClick={() => setFolderOpen((p) => !p)}
        className="flex w-full items-center gap-1 rounded px-1 py-0.5 text-fg-muted uppercase tracking-wider hover:text-fg"
        aria-expanded={folderOpen}
      >
        <ChevronRight
          className={cn("h-3 w-3 transition-transform", folderOpen && "rotate-90")}
        />
        <Folder className="h-3.5 w-3.5" />
        <span className="text-[11px]">portfolio</span>
      </button>
      {folderOpen && (
        <ul className="mt-1 space-y-0.5 pl-4">
          {FILES.map((f) => {
            const active = f.route === activeRoute;
            const Icon = f.icon;
            return (
              <li key={f.id}>
                <button
                  onClick={() => handle(f.id, f.route)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-1.5 py-1 text-left font-mono",
                    active
                      ? "bg-panel-2 text-fg"
                      : "text-fg-muted hover:bg-panel-2 hover:text-fg",
                  )}
                >
                  <Icon className="h-4 w-4" style={{ color: f.iconColor }} />
                  <span>{f.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 13.2: Create `src/components/ide/Sidebar.tsx`**

```tsx
"use client";

import { Files, Search, GitBranch, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { FileTree } from "./FileTree";

export function Sidebar() {
  const t = useTranslations("chrome");
  return (
    <aside className="flex h-full shrink-0 border-r border-border bg-panel">
      <nav className="flex w-12 flex-col items-center gap-2 border-r border-border bg-panel py-2">
        <button
          aria-label={t("sidebarExplorer")}
          title={t("sidebarExplorer")}
          className="flex h-8 w-8 items-center justify-center rounded text-fg"
        >
          <Files className="h-5 w-5" />
        </button>
        <button
          aria-label={t("sidebarSearch")}
          title={t("comingSoon")}
          className="flex h-8 w-8 items-center justify-center rounded text-fg-muted hover:text-fg"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          aria-label={t("sidebarGit")}
          title={t("comingSoon")}
          className="flex h-8 w-8 items-center justify-center rounded text-fg-muted hover:text-fg"
        >
          <GitBranch className="h-5 w-5" />
        </button>
        <button
          aria-label={t("sidebarSettings")}
          title={t("comingSoon")}
          className="mt-auto flex h-8 w-8 items-center justify-center rounded text-fg-muted hover:text-fg"
        >
          <Settings className="h-5 w-5" />
        </button>
      </nav>
      <div className="w-56">
        <FileTree />
      </div>
    </aside>
  );
}
```

- [ ] **Step 13.3: Commit**

```bash
git add -A
git commit -m "feat: add sidebar with activity bar and file tree"
```

---

## Task 14: TabStrip

**Files:**
- Create: `src/components/ide/TabStrip.tsx`

- [ ] **Step 14.1: Create `src/components/ide/TabStrip.tsx`**

```tsx
"use client";

import { X } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fileById, fileByRoute } from "@/lib/files";
import { useTabs } from "@/hooks/useTabs";
import { cn } from "@/lib/cn";

export function TabStrip() {
  const { openIds, activeId, open, close, setActive } = useTabs();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  // Sync URL → tabs: if user navigates to a route, open that file as tab + active.
  useEffect(() => {
    const f = fileByRoute(pathname);
    if (f) open(f.id);
  }, [pathname, open]);

  const onClickTab = (id: (typeof openIds)[number]) => {
    setActive(id);
    const f = fileById(id);
    router.push(`/${locale}${f.route === "/" ? "" : f.route}`);
  };

  const onCloseTab = (e: React.MouseEvent, id: (typeof openIds)[number]) => {
    e.stopPropagation();
    close(id);
    if (id === activeId) {
      const idx = openIds.indexOf(id);
      const nextId = openIds[idx + 1] ?? openIds[idx - 1] ?? "readme";
      const f = fileById(nextId);
      router.push(`/${locale}${f.route === "/" ? "" : f.route}`);
    }
  };

  return (
    <div className="flex h-9 shrink-0 items-stretch border-b border-border bg-panel">
      <AnimatePresence initial={false}>
        {openIds.map((id) => {
          const f = fileById(id);
          const Icon = f.icon;
          const active = id === activeId;
          return (
            <motion.button
              key={id}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={() => onClickTab(id)}
              className={cn(
                "group flex items-center gap-2 overflow-hidden border-r border-border px-3 text-[12px] font-mono whitespace-nowrap",
                active
                  ? "bg-panel-2 text-fg"
                  : "bg-panel text-fg-muted hover:text-fg",
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: f.iconColor }} />
              <span>{f.label}</span>
              {active && id !== "readme" && (
                <span
                  aria-hidden
                  className="ml-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
              )}
              <span
                role="button"
                aria-label={`Close ${f.label}`}
                onClick={(e) => onCloseTab(e, id)}
                className="ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded text-fg-muted hover:bg-danger/20 hover:text-danger"
              >
                <X className="h-3 w-3" />
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 14.2: Commit**

```bash
git add -A
git commit -m "feat: add tab strip with open/close animation"
```

---

## Task 15: StatusBar

**Files:**
- Create: `src/components/ide/StatusBar.tsx`
- Create: `src/hooks/useCursorPosition.ts`

- [ ] **Step 15.1: Create `src/hooks/useCursorPosition.ts`**

```ts
"use client";

import { useEffect, useState } from "react";

export function useCursorPosition() {
  const [pos, setPos] = useState({ ln: 1, col: 1 });

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    let raf: number | null = null;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const rect = main.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
        const ln = Math.max(1, Math.floor(y / 22) + 1);
        const col = Math.max(1, Math.floor(x / 8) + 1);
        setPos({ ln, col });
      });
    };
    main.addEventListener("mousemove", onMove);
    return () => {
      main.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return pos;
}
```

- [ ] **Step 15.2: Create `src/components/ide/StatusBar.tsx`**

```tsx
"use client";

import { GitBranch, Circle } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useCursorPosition } from "@/hooks/useCursorPosition";

export function StatusBar() {
  const { resolvedTheme } = useTheme();
  const locale = useLocale();
  const t = useTranslations("chrome");
  const { ln, col } = useCursorPosition();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <footer className="flex h-6 shrink-0 items-center justify-between border-t border-border bg-accent/90 px-3 text-[11px] text-white dark:bg-accent/70">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" />
          {t("branch")}
        </span>
        <span className="opacity-90">{t("commit")}</span>
      </div>
      <div className="flex items-center gap-3">
        <span>Ln {ln}, Col {col}</span>
        <span className="uppercase">{locale}</span>
        <span>{mounted && resolvedTheme === "dark" ? t("themeDark") : t("themeLight")}</span>
        <span>{t("encoding")}</span>
        <span className="flex items-center gap-1">
          <Circle className="h-2 w-2 fill-current" /> {t("ready")}
        </span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 15.3: Commit**

```bash
git add -A
git commit -m "feat: add status bar with live cursor position"
```

---

## Task 16: useKeyboard hook (TDD)

**Files:**
- Create: `tests/hooks/useKeyboard.test.tsx`
- Create: `src/hooks/useKeyboard.ts`

- [ ] **Step 16.1: Write the failing test**

Create `tests/hooks/useKeyboard.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboard } from "@/hooks/useKeyboard";

const setSidebar = vi.fn();
const setPalette = vi.fn();
const setTerminal = vi.fn();
const closeActive = vi.fn();
const setActiveByIndex = vi.fn();

vi.mock("@/hooks/useUiStore", () => ({
  useUiStore: () => ({
    sidebarOpen: true,
    paletteOpen: false,
    terminalOpen: false,
    setSidebar,
    setPalette,
    setTerminal,
  }),
}));

vi.mock("@/hooks/useTabs", () => ({
  useTabs: () => ({
    openIds: ["readme", "about", "projects"],
    activeId: "about",
    close: closeActive,
    setActive: setActiveByIndex,
  }),
}));

function press(key: string, opts: KeyboardEventInit = {}) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, ...opts }));
}

describe("useKeyboard", () => {
  beforeEach(() => {
    setSidebar.mockClear();
    setPalette.mockClear();
    setTerminal.mockClear();
    closeActive.mockClear();
    setActiveByIndex.mockClear();
  });

  it("Cmd+K toggles command palette", () => {
    renderHook(() => useKeyboard());
    press("k", { metaKey: true });
    expect(setPalette).toHaveBeenCalledTimes(1);
  });

  it("Ctrl+B toggles sidebar", () => {
    renderHook(() => useKeyboard());
    press("b", { ctrlKey: true });
    expect(setSidebar).toHaveBeenCalledTimes(1);
  });

  it("Cmd+W closes active tab", () => {
    renderHook(() => useKeyboard());
    press("w", { metaKey: true });
    expect(closeActive).toHaveBeenCalledWith("about");
  });

  it("Cmd+1 switches to first tab", () => {
    renderHook(() => useKeyboard());
    press("1", { metaKey: true });
    expect(setActiveByIndex).toHaveBeenCalledWith("readme");
  });

  it("shortcut is ignored while typing in an input", () => {
    renderHook(() => useKeyboard());
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "b", ctrlKey: true, bubbles: true }));
    expect(setSidebar).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 16.2: Run test — expect FAIL**

```bash
npm test -- tests/hooks/useKeyboard.test.tsx
```

- [ ] **Step 16.3: Implement `src/hooks/useKeyboard.ts`**

```ts
"use client";

import { useEffect } from "react";
import { useUiStore } from "@/hooks/useUiStore";
import { useTabs } from "@/hooks/useTabs";

function isTextField(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}

export function useKeyboard() {
  const { setSidebar, setPalette, setTerminal, paletteOpen } = useUiStore();
  const { openIds, activeId, close, setActive } = useTabs();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = (e.composedPath?.()[0] ?? e.target) as EventTarget | null;
      if (isTextField(target) && e.key !== "Escape") return;

      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
        return;
      }
      if (mod && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setSidebar((p) => !p);
        return;
      }
      if (mod && e.key.toLowerCase() === "w") {
        e.preventDefault();
        close(activeId);
        return;
      }
      if ((e.ctrlKey && (e.key === "`" || e.key === "~")) || (e.metaKey && e.key.toLowerCase() === "j")) {
        e.preventDefault();
        setTerminal((p) => !p);
        return;
      }
      if (mod && /^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const id = openIds[idx];
        if (id) {
          e.preventDefault();
          setActive(id);
        }
        return;
      }
      if (e.key === "Escape" && paletteOpen) {
        setPalette(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSidebar, setPalette, setTerminal, close, setActive, activeId, openIds, paletteOpen]);
}
```

- [ ] **Step 16.4: Run tests — expect PASS**

```bash
npm test
```

- [ ] **Step 16.5: Commit**

```bash
git add -A
git commit -m "feat: add global keyboard shortcuts"
```

---

## Task 17: Content primitives (TypingText + RevealOnView + LineGutter)

**Files:**
- Create: `src/components/primitives/TypingText.tsx`
- Create: `src/components/primitives/RevealOnView.tsx`
- Create: `src/components/primitives/LineGutter.tsx`

- [ ] **Step 17.1: Create `src/components/primitives/TypingText.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

const FLAG = "portfolio.typed";

export function TypingText({
  text,
  speed = 35,
  className,
  once = true,
}: {
  text: string;
  speed?: number;
  className?: string;
  once?: boolean;
}) {
  const [shown, setShown] = useState(() => {
    if (typeof window === "undefined") return text;
    if (once && sessionStorage.getItem(FLAG)) return text;
    return "";
  });

  useEffect(() => {
    if (shown === text) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      if (once) sessionStorage.setItem(FLAG, "1");
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        if (once) sessionStorage.setItem(FLAG, "1");
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, once, shown]);

  return (
    <span className={className}>
      {shown}
      {shown !== text && <span className="ml-0.5 inline-block h-[1em] w-[2px] bg-current animate-caret-blink align-middle" />}
    </span>
  );
}
```

- [ ] **Step 17.2: Create `src/components/primitives/RevealOnView.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function RevealOnView({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 17.3: Create `src/components/primitives/LineGutter.tsx`**

```tsx
"use client";

import { cn } from "@/lib/cn";

export function LineGutter({ lines, className }: { lines: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "select-none pr-3 text-right text-[12px] leading-[22px] text-fg-muted",
        className,
      )}
    >
      {Array.from({ length: lines }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );
}
```

- [ ] **Step 17.4: Commit**

```bash
git add -A
git commit -m "feat: add typing, reveal, and line gutter primitives"
```

---

## Task 18: ReadmePage (homepage)

**Files:**
- Create: `src/app/[locale]/page.tsx`
- Create: `src/components/content/ReadmePage.tsx`

- [ ] **Step 18.1: Create `src/components/content/ReadmePage.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Mail, Download } from "lucide-react";
import { TypingText } from "@/components/primitives/TypingText";
import { LineGutter } from "@/components/primitives/LineGutter";

export function ReadmePage() {
  const t = useTranslations("readme");
  const locale = useLocale();

  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={24} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="flex-1 px-8 py-6 leading-[22px]">
        <p className="text-fg-muted">{t("greeting")}</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
          <span className="text-accent-2"># </span>
          <TypingText text={t("name")} />
        </h1>
        <h2 className="mt-2 text-xl text-fg-muted md:text-2xl">
          <span className="text-success">{"> "}</span>
          <TypingText text={t("role")} speed={28} />
        </h2>
        <p className="mt-6 max-w-2xl font-sans text-[15px] leading-relaxed text-fg">
          {t("pitch")}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-panel-2 px-4 py-2 text-sm font-medium text-fg hover:border-accent hover:text-accent"
          >
            {t("ctaProjects")} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-fg-muted hover:border-accent hover:text-fg"
          >
            <Mail className="h-4 w-4" /> {t("ctaContact")}
          </Link>
          <a
            href="/cv.pdf"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-fg-muted hover:border-accent hover:text-fg"
          >
            <Download className="h-4 w-4" /> {t("ctaCv")}
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 18.2: Create `src/app/[locale]/page.tsx`**

```tsx
import { setRequestLocale } from "next-intl/server";
import { ReadmePage } from "@/components/content/ReadmePage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ReadmePage />;
}
```

- [ ] **Step 18.3: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000/en`. Expected: typing animation runs, IDE chrome visible, sidebar list correct, theme + lang toggles work. Open `http://localhost:3000/tr` — text should be Turkish.

Kill the dev server (Ctrl+C) before continuing.

- [ ] **Step 18.4: Commit**

```bash
git add -A
git commit -m "feat: add README homepage with typing animation"
```

---

## Task 19: AboutPage

**Files:**
- Create: `src/components/content/AboutPage.tsx`
- Create: `src/app/[locale]/about/page.tsx`

- [ ] **Step 19.1: Create `src/components/content/AboutPage.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { LineGutter } from "@/components/primitives/LineGutter";
import { RevealOnView } from "@/components/primitives/RevealOnView";

export function AboutPage() {
  const t = useTranslations("about");
  const body = t("body");
  const paragraphs = body.split("\n\n");
  const lineCount = paragraphs.reduce((acc, p) => acc + p.split("\n").length + 2, 4);

  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={lineCount} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="max-w-3xl flex-1 px-8 py-6 leading-[22px]">
        <h1 className="mb-6 text-2xl">
          <span className="text-accent-2"># </span>
          {t("heading")}
        </h1>
        <div className="space-y-5 font-sans text-[15px] leading-relaxed text-fg">
          {paragraphs.map((p, i) => (
            <RevealOnView key={i} delay={i * 0.06}>
              <p>{p}</p>
            </RevealOnView>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 19.2: Create `src/app/[locale]/about/page.tsx`**

```tsx
import { setRequestLocale } from "next-intl/server";
import { AboutPage } from "@/components/content/AboutPage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutPage />;
}
```

- [ ] **Step 19.3: Commit**

```bash
git add -A
git commit -m "feat: add about page"
```

---

## Task 20: ExperiencePage

**Files:**
- Create: `src/components/content/ExperiencePage.tsx`
- Create: `src/app/[locale]/experience/page.tsx`

- [ ] **Step 20.1: Create `src/components/content/ExperiencePage.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { EXPERIENCE } from "@/lib/experience";
import { LineGutter } from "@/components/primitives/LineGutter";
import { RevealOnView } from "@/components/primitives/RevealOnView";
import { Briefcase } from "lucide-react";

function Bullets({ keyName }: { keyName: string }) {
  const t = useTranslations();
  const raw = t(keyName);
  const items = raw.split("||");
  return (
    <ul className="ml-5 list-disc space-y-1 text-[14px] text-fg-muted">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

export function ExperiencePage() {
  const t = useTranslations("experience");

  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={64} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="max-w-4xl flex-1 px-8 py-6 leading-[22px]">
        <h1 className="mb-6 text-2xl">
          <span className="text-warning">const </span>
          <span className="text-accent-2">experience </span>
          <span className="text-fg-muted">= [</span>
        </h1>
        <div className="space-y-8 pl-4">
          {EXPERIENCE.map((e, i) => (
            <RevealOnView key={e.id} delay={i * 0.08}>
              <article className="rounded-md border border-border bg-panel/50 p-5">
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="flex items-center gap-2 text-lg text-fg">
                    <Briefcase className="h-4 w-4 text-accent-2" />
                    <span>{e.company}</span>
                    <span className="text-fg-muted">·</span>
                    <span className="text-fg-muted text-[14px]">{t(e.roleKey.replace("experience.", ""))}</span>
                  </h2>
                  <span className="text-[12px] text-fg-muted">
                    {e.from} — {e.to ?? t("present")}
                  </span>
                </header>
                <p className="mt-3 text-[14px] text-fg">{t(e.bulletsKey.replace("experience.", ""))}</p>
                {e.subRoles && (
                  <div className="mt-4 space-y-4">
                    {e.subRoles.map((sr) => (
                      <div key={sr.titleKey}>
                        <h3 className="mb-1 text-[14px] text-accent">
                          {t(sr.titleKey.replace("experience.", ""))}
                        </h3>
                        <Bullets keyName={`experience.${sr.bulletsKey.replace("experience.", "")}`} />
                      </div>
                    ))}
                  </div>
                )}
                {!e.subRoles && (
                  <div className="mt-3">
                    <Bullets keyName={`experience.${e.bulletsKey.replace("experience.", "")}`} />
                  </div>
                )}
              </article>
            </RevealOnView>
          ))}
        </div>
        <p className="mt-6 text-fg-muted">{"];"}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 20.2: Create `src/app/[locale]/experience/page.tsx`**

```tsx
import { setRequestLocale } from "next-intl/server";
import { ExperiencePage } from "@/components/content/ExperiencePage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ExperiencePage />;
}
```

- [ ] **Step 20.3: Commit**

```bash
git add -A
git commit -m "feat: add experience page with timeline"
```

---

## Task 21: ProjectsPage

**Files:**
- Create: `src/components/content/ProjectsPage.tsx`
- Create: `src/app/[locale]/projects/page.tsx`

- [ ] **Step 21.1: Create `src/components/content/ProjectsPage.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Github, ExternalLink } from "lucide-react";
import { PROJECTS, PROJECT_TAG_FILTERS, ProjectTag } from "@/lib/projects";
import { LineGutter } from "@/components/primitives/LineGutter";
import { RevealOnView } from "@/components/primitives/RevealOnView";
import { cn } from "@/lib/cn";

export function ProjectsPage() {
  const t = useTranslations("projects");
  const [filter, setFilter] = useState<"All" | ProjectTag>("All");

  const visible = PROJECTS.filter((p) => filter === "All" || p.tags.includes(filter));

  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={120} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="flex-1 px-8 py-6 leading-[22px]">
        <h1 className="mb-2 text-2xl">
          <span className="text-warning">export const </span>
          <span className="text-accent-2">projects </span>
          <span className="text-fg-muted">= [</span>
        </h1>
        <p className="mb-6 text-[13px] text-fg-muted">{t("heading")}</p>

        <div className="mb-6 flex flex-wrap gap-2">
          {PROJECT_TAG_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1 text-[12px] font-medium",
                filter === f
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-fg-muted hover:border-accent/40 hover:text-fg",
              )}
            >
              {f === "All" ? t("filterAll") : f === "Frontend" ? t("filterFrontend") : t("filterFullStack")}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((p, i) => (
            <RevealOnView key={p.id} delay={(i % 3) * 0.05}>
              <article className="group overflow-hidden rounded-lg border border-border bg-panel/50 transition hover:border-accent/60">
                <div className="relative aspect-[16/10] overflow-hidden bg-panel-2">
                  <Image
                    src={p.image}
                    alt={t(`items.${idKey(p.id)}.title`)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-border bg-panel px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-mono text-[15px] text-fg">{t(`items.${idKey(p.id)}.title`)}</h2>
                  <p className="mt-2 line-clamp-3 font-sans text-[13px] text-fg-muted">
                    {t(`items.${idKey(p.id)}.desc`)}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-[12px]">
                    {p.gitUrl ? (
                      <a
                        href={p.gitUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-fg-muted hover:text-accent"
                      >
                        <Github className="h-3.5 w-3.5" /> {t("viewGit")}
                      </a>
                    ) : (
                      <span className="text-fg-muted/50">{t("noRepo")}</span>
                    )}
                    {p.previewUrl ? (
                      <a
                        href={p.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-fg-muted hover:text-accent"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> {t("viewLive")}
                      </a>
                    ) : (
                      <span className="text-fg-muted/50">{t("noLive")}</span>
                    )}
                  </div>
                </div>
              </article>
            </RevealOnView>
          ))}
        </div>
        <p className="mt-8 text-fg-muted">{"];"}</p>
      </div>
    </div>
  );
}

function idKey(id: string): string {
  // map data id → translation key. Most match by stripping "-pub" suffix.
  if (id === "coffe-pub") return "coffe";
  return id;
}
```

- [ ] **Step 21.2: Create `src/app/[locale]/projects/page.tsx`**

```tsx
import { setRequestLocale } from "next-intl/server";
import { ProjectsPage } from "@/components/content/ProjectsPage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectsPage />;
}
```

- [ ] **Step 21.3: Commit**

```bash
git add -A
git commit -m "feat: add projects page with tag filter and image grid"
```

---

## Task 22: SkillsPage

**Files:**
- Create: `src/components/content/SkillsPage.tsx`
- Create: `src/app/[locale]/skills/page.tsx`

- [ ] **Step 22.1: Create `src/components/content/SkillsPage.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { SKILLS } from "@/lib/skills";
import { LineGutter } from "@/components/primitives/LineGutter";
import { RevealOnView } from "@/components/primitives/RevealOnView";

export function SkillsPage() {
  const t = useTranslations("skills");

  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={Math.max(40, SKILLS.reduce((a, c) => a + c.items.length, 0) + 12)} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="max-w-4xl flex-1 px-8 py-6 leading-[22px]">
        <h1 className="mb-2 text-2xl">
          <span className="text-fg-muted">{"{"}</span>
        </h1>
        <div className="space-y-6 pl-4">
          {SKILLS.map((cat, i) => (
            <RevealOnView key={cat.key} delay={i * 0.08}>
              <section>
                <p className="text-[13px]">
                  <span className="text-success">&quot;{cat.key}&quot;</span>
                  <span className="text-fg-muted">: </span>
                  <span className="text-fg-muted">[</span>
                </p>
                <ul className="my-2 ml-5 flex flex-wrap gap-2">
                  {cat.items.map((s) => (
                    <li
                      key={s}
                      className="rounded border border-border bg-panel-2 px-2 py-1 text-[12px] text-fg hover:border-accent hover:text-accent"
                    >
                      &quot;{s}&quot;
                    </li>
                  ))}
                </ul>
                <p className="text-fg-muted">{"],"}</p>
                <p className="mt-1 text-[12px] text-fg-muted/70">// {t(cat.key)}</p>
              </section>
            </RevealOnView>
          ))}
        </div>
        <p className="mt-4 text-fg-muted">{"}"}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 22.2: Create `src/app/[locale]/skills/page.tsx`**

```tsx
import { setRequestLocale } from "next-intl/server";
import { SkillsPage } from "@/components/content/SkillsPage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SkillsPage />;
}
```

- [ ] **Step 22.3: Commit**

```bash
git add -A
git commit -m "feat: add skills page rendered as JSON"
```

---

## Task 23: EducationPage

**Files:**
- Create: `src/components/content/EducationPage.tsx`
- Create: `src/app/[locale]/education/page.tsx`

- [ ] **Step 23.1: Create `src/components/content/EducationPage.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import { LineGutter } from "@/components/primitives/LineGutter";
import { RevealOnView } from "@/components/primitives/RevealOnView";

export function EducationPage() {
  const t = useTranslations("education");
  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={24} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="max-w-3xl flex-1 px-8 py-6 leading-[22px]">
        <h1 className="mb-6 text-2xl">
          <span className="text-accent-2"># </span>
          {t("heading")}
        </h1>
        <RevealOnView>
          <article className="rounded-md border border-border bg-panel/50 p-5">
            <header className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-accent-2" />
              <div>
                <h2 className="text-lg text-fg">{t("school")}</h2>
                <p className="text-[14px] text-fg-muted">{t("degree")} · {t("years")}</p>
              </div>
            </header>
            <p className="mt-4 text-[13px] text-fg-muted">{t("lang")}</p>
          </article>
        </RevealOnView>
      </div>
    </div>
  );
}
```

- [ ] **Step 23.2: Create `src/app/[locale]/education/page.tsx`**

```tsx
import { setRequestLocale } from "next-intl/server";
import { EducationPage } from "@/components/content/EducationPage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EducationPage />;
}
```

- [ ] **Step 23.3: Commit**

```bash
git add -A
git commit -m "feat: add education page"
```

---

## Task 24: ContactPage

**Files:**
- Create: `src/components/content/ContactPage.tsx`
- Create: `src/app/[locale]/contact/page.tsx`

- [ ] **Step 24.1: Create `src/components/content/ContactPage.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Phone, Mail, MapPin, Github, Linkedin, Copy, Check } from "lucide-react";
import { LineGutter } from "@/components/primitives/LineGutter";

const EMAIL = "osman.dayi3478@gmail.com";
const PHONE = "+90 536 930 1936";
const GITHUB = "https://github.com/osmandayi";
const LINKEDIN = "https://www.linkedin.com/in/osman-d-272a2820b/";

export function ContactPage() {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={24} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="max-w-3xl flex-1 px-8 py-6 leading-[22px]">
        <p className="mb-6 text-fg-muted">{t("intro")}</p>

        <h1 className="mb-6 text-2xl">
          <span className="text-success">echo </span>
          <span className="text-accent-2">&quot;{t("heading")}&quot;</span>
        </h1>

        <ul className="space-y-3 text-[14px]">
          <li className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-accent" />
            <span className="text-fg-muted">{t("phone")}:</span>
            <a className="text-fg hover:text-accent" href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
          </li>
          <li className="flex flex-wrap items-center gap-3">
            <Mail className="h-4 w-4 text-accent" />
            <span className="text-fg-muted">{t("email")}:</span>
            <a className="text-fg hover:text-accent" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[12px] text-fg-muted hover:border-accent hover:text-fg"
            >
              {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
              {copied ? t("copied") : t("copyEmail")}
            </button>
          </li>
          <li className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="text-fg-muted">{t("location")}:</span>
            <span className="text-fg">{t("locationValue")}</span>
          </li>
          <li className="flex items-center gap-3">
            <Github className="h-4 w-4 text-accent" />
            <span className="text-fg-muted">{t("github")}:</span>
            <a className="text-fg hover:text-accent" href={GITHUB} target="_blank" rel="noreferrer">{GITHUB}</a>
          </li>
          <li className="flex items-center gap-3">
            <Linkedin className="h-4 w-4 text-accent" />
            <span className="text-fg-muted">{t("linkedin")}:</span>
            <a className="text-fg hover:text-accent" href={LINKEDIN} target="_blank" rel="noreferrer">/in/osman-d-272a2820b</a>
          </li>
        </ul>

        <p className="mt-8 text-fg-muted">$ _</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 24.2: Create `src/app/[locale]/contact/page.tsx`**

```tsx
import { setRequestLocale } from "next-intl/server";
import { ContactPage } from "@/components/content/ContactPage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPage />;
}
```

- [ ] **Step 24.3: Commit**

```bash
git add -A
git commit -m "feat: add contact page with copy-email button"
```

---

## Task 25: Command palette (cmdk)

**Files:**
- Create: `src/components/ide/CommandPalette.tsx`

- [ ] **Step 25.1: Create `src/components/ide/CommandPalette.tsx`**

```tsx
"use client";

import { Command } from "cmdk";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  FileText, FileCode2, FileJson, Terminal as TerminalIcon, GraduationCap,
  Moon, Sun, Languages, Github, Linkedin, Mail, PanelLeft, ChevronsRight,
} from "lucide-react";
import { FILES, FileEntry } from "@/lib/files";
import { useTabs } from "@/hooks/useTabs";
import { useUiStore } from "@/hooks/useUiStore";

const iconForFile: Record<string, typeof FileText> = {
  readme: FileText, about: FileText, experience: FileCode2,
  projects: FileCode2, skills: FileJson, education: GraduationCap, contact: TerminalIcon,
};

export function CommandPalette() {
  const { paletteOpen, setPalette, setSidebar, setTerminal } = useUiStore();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("palette");
  const { setTheme } = useTheme();
  const { open } = useTabs();

  useEffect(() => {
    if (!paletteOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPalette]);

  const go = (f: FileEntry) => {
    open(f.id);
    router.push(`/${locale}${f.route === "/" ? "" : f.route}`);
    setPalette(false);
  };

  const switchLang = (next: "en" | "tr") => {
    const np = pathname.replace(/^\/(en|tr)/, `/${next}`) || `/${next}`;
    router.push(np);
    setPalette(false);
  };

  if (!paletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-[12vh]" onClick={() => setPalette(false)}>
      <div className="w-[640px] max-w-[92vw] overflow-hidden rounded-lg border border-border bg-panel shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <Command label="Command palette" loop>
          <Command.Input
            autoFocus
            placeholder={t("placeholder")}
            className="h-12 w-full border-b border-border bg-transparent px-4 text-[14px] text-fg outline-none placeholder:text-fg-muted"
          />
          <Command.List className="max-h-[60vh] overflow-auto p-2 text-[13px]">
            <Command.Empty className="px-3 py-6 text-center text-fg-muted">{t("empty")}</Command.Empty>

            <Command.Group heading={t("groupNav")} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-fg-muted">
              {FILES.map((f) => {
                const Icon = iconForFile[f.id] ?? FileText;
                return (
                  <Command.Item
                    key={f.id}
                    value={`go ${f.label} ${f.id}`}
                    onSelect={() => go(f)}
                    className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-fg data-[selected=true]:bg-panel-2"
                  >
                    <Icon className="h-4 w-4" style={{ color: f.iconColor }} />
                    <span>{t("go")}: {f.label}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            <Command.Group heading={t("groupTheme")} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-fg-muted">
              <Command.Item value="theme dark" onSelect={() => { setTheme("dark"); setPalette(false); }} className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-fg data-[selected=true]:bg-panel-2">
                <Moon className="h-4 w-4" /> {t("switchTheme")}: dark
              </Command.Item>
              <Command.Item value="theme light" onSelect={() => { setTheme("light"); setPalette(false); }} className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-fg data-[selected=true]:bg-panel-2">
                <Sun className="h-4 w-4" /> {t("switchTheme")}: light
              </Command.Item>
            </Command.Group>

            <Command.Group heading={t("groupLang")} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-fg-muted">
              <Command.Item value="lang en" onSelect={() => switchLang("en")} className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-fg data-[selected=true]:bg-panel-2">
                <Languages className="h-4 w-4" /> {t("switchLang")}: EN
              </Command.Item>
              <Command.Item value="lang tr" onSelect={() => switchLang("tr")} className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-fg data-[selected=true]:bg-panel-2">
                <Languages className="h-4 w-4" /> {t("switchLang")}: TR
              </Command.Item>
            </Command.Group>

            <Command.Group heading={t("groupLinks")} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-fg-muted">
              <Command.Item value="open github" onSelect={() => { window.open("https://github.com/osmandayi", "_blank"); setPalette(false); }} className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-fg data-[selected=true]:bg-panel-2">
                <Github className="h-4 w-4" /> {t("openGithub")}
              </Command.Item>
              <Command.Item value="open linkedin" onSelect={() => { window.open("https://www.linkedin.com/in/osman-d-272a2820b/", "_blank"); setPalette(false); }} className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-fg data-[selected=true]:bg-panel-2">
                <Linkedin className="h-4 w-4" /> {t("openLinkedin")}
              </Command.Item>
              <Command.Item value="copy email" onSelect={async () => { await navigator.clipboard.writeText("osman.dayi3478@gmail.com"); setPalette(false); }} className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-fg data-[selected=true]:bg-panel-2">
                <Mail className="h-4 w-4" /> {t("copyEmail")}
              </Command.Item>
            </Command.Group>

            <Command.Group heading={t("groupActions")} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-fg-muted">
              <Command.Item value="toggle terminal" onSelect={() => { setTerminal((p) => !p); setPalette(false); }} className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-fg data-[selected=true]:bg-panel-2">
                <ChevronsRight className="h-4 w-4" /> {t("toggleTerminal")}
              </Command.Item>
              <Command.Item value="toggle sidebar" onSelect={() => { setSidebar((p) => !p); setPalette(false); }} className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-fg data-[selected=true]:bg-panel-2">
                <PanelLeft className="h-4 w-4" /> {t("toggleSidebar")}
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
```

- [ ] **Step 25.2: Commit**

```bash
git add -A
git commit -m "feat: add command palette (Cmd+K)"
```

---

## Task 26: useTerminal hook (TDD)

**Files:**
- Create: `tests/hooks/useTerminal.test.tsx`
- Create: `src/hooks/useTerminal.ts`

- [ ] **Step 26.1: Write failing test**

Create `tests/hooks/useTerminal.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTerminal } from "@/hooks/useTerminal";

const setTheme = vi.fn();
const navigate = vi.fn();

const ctx = {
  setTheme,
  navigate,
  switchLang: vi.fn(),
  openFile: vi.fn(),
  copyEmail: vi.fn(),
};

describe("useTerminal", () => {
  beforeEach(() => {
    sessionStorage.clear();
    setTheme.mockClear();
    navigate.mockClear();
    ctx.switchLang.mockClear();
    ctx.openFile.mockClear();
    ctx.copyEmail.mockClear();
  });

  it("starts with a welcome line", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    expect(result.current.lines[0].text).toMatch(/help/i);
  });

  it("`help` prints the help text", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("help"));
    const last = result.current.lines.at(-1)!;
    expect(last.text).toMatch(/help/i);
  });

  it("`whoami` prints osman", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("whoami"));
    expect(result.current.lines.at(-1)!.text).toBe("osman");
  });

  it("`theme dark` calls setTheme('dark')", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("theme dark"));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("`open projects.tsx` opens the projects file", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("open projects.tsx"));
    expect(ctx.openFile).toHaveBeenCalledWith("projects");
  });

  it("unknown command produces 'command not found'", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("nope"));
    expect(result.current.lines.at(-1)!.text).toMatch(/not found/i);
  });

  it("`clear` empties the buffer", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("whoami"));
    act(() => result.current.run("clear"));
    expect(result.current.lines).toEqual([]);
  });

  it("up arrow recalls previous command", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("whoami"));
    act(() => result.current.run("help"));
    expect(result.current.history[0]).toBe("whoami");
    expect(result.current.history[1]).toBe("help");
    const prev = result.current.recall(-1);
    expect(prev).toBe("help");
  });
});
```

- [ ] **Step 26.2: Run test — expect FAIL**

```bash
npm test -- tests/hooks/useTerminal.test.tsx
```

- [ ] **Step 26.3: Implement `src/hooks/useTerminal.ts`**

```ts
"use client";

import { useCallback, useState, useRef } from "react";
import { FILES, FileId } from "@/lib/files";

export interface TerminalLine {
  id: number;
  kind: "input" | "output";
  text: string;
}

export interface TerminalCtx {
  setTheme: (v: "dark" | "light" | "system") => void;
  navigate: (path: string) => void;
  switchLang: (l: "en" | "tr") => void;
  openFile: (id: FileId) => void;
  copyEmail: () => void;
}

const HELP =
  "Available commands:\n" +
  "  help                show this help\n" +
  "  whoami              print user name\n" +
  "  ls                  list files\n" +
  "  cat <file>          dump a section\n" +
  "  open <file>         open a tab\n" +
  "  theme dark|light    switch theme\n" +
  "  lang en|tr          switch language\n" +
  "  contact             print contact info\n" +
  "  clear               clear scrollback\n" +
  "  vim|nano|sudo …     :)";

function fileByName(name: string): FileId | null {
  const f = FILES.find((x) => x.label === name || x.id === name);
  return f ? f.id : null;
}

export function useTerminal(ctx: TerminalCtx) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 0, kind: "output", text: "Type 'help' to see available commands." },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const cursorRef = useRef<number>(-1);

  const push = (text: string, kind: TerminalLine["kind"] = "output") =>
    setLines((prev) => [...prev, { id: prev.length + 1, kind, text }]);

  const run = useCallback((raw: string) => {
    const cmd = raw.trim();
    if (cmd) {
      setHistory((h) => [...h, cmd]);
      cursorRef.current = -1;
    }
    push(cmd, "input");

    if (!cmd) return;
    const [head, ...rest] = cmd.split(/\s+/);

    switch (head) {
      case "help":
        push(HELP);
        return;
      case "whoami":
        push("osman");
        return;
      case "ls":
        push(FILES.map((f) => f.label).join("  "));
        return;
      case "clear":
        setLines([]);
        return;
      case "contact":
        push("phone:    +90 536 930 1936\nemail:    osman.dayi3478@gmail.com\ngithub:   github.com/osmandayi\nlinkedin: linkedin.com/in/osman-d-272a2820b");
        return;
      case "theme": {
        const arg = rest[0];
        if (arg === "dark" || arg === "light" || arg === "system") {
          ctx.setTheme(arg);
          push(`theme → ${arg}`);
        } else {
          push("usage: theme dark|light|system");
        }
        return;
      }
      case "lang": {
        const arg = rest[0];
        if (arg === "en" || arg === "tr") {
          ctx.switchLang(arg);
          push(`lang → ${arg}`);
        } else {
          push("usage: lang en|tr");
        }
        return;
      }
      case "open":
      case "cat": {
        const fname = rest.join(" ").trim();
        const id = fileByName(fname);
        if (!id) {
          push(`no such file: ${fname}`);
          return;
        }
        if (head === "open") {
          ctx.openFile(id);
          push(`opening ${fname}…`);
        } else {
          push(`(see the open tab for ${fname})`);
          ctx.openFile(id);
        }
        return;
      }
      case "vim":
        push("vim is not installed. Try Cursor.");
        return;
      case "nano":
        push("nano? In 2026?");
        return;
      case "sudo":
        push("osman is not in the sudoers file. This incident will be reported.");
        return;
      default:
        push(`command not found: ${head}. Type 'help'.`);
    }
  }, [ctx]);

  const recall = useCallback((dir: -1 | 1): string => {
    if (history.length === 0) return "";
    if (cursorRef.current === -1) cursorRef.current = history.length;
    cursorRef.current = Math.max(0, Math.min(history.length, cursorRef.current + dir));
    return history[cursorRef.current] ?? "";
  }, [history]);

  return { lines, history, run, recall };
}
```

- [ ] **Step 26.4: Run test — expect PASS**

```bash
npm test
```

- [ ] **Step 26.5: Commit**

```bash
git add -A
git commit -m "feat: add useTerminal hook with command interpreter"
```

---

## Task 27: Terminal component

**Files:**
- Create: `src/components/ide/Terminal.tsx`

- [ ] **Step 27.1: Create `src/components/ide/Terminal.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useUiStore } from "@/hooks/useUiStore";
import { useTerminal } from "@/hooks/useTerminal";
import { fileById, FileId } from "@/lib/files";
import { useTabs } from "@/hooks/useTabs";
import { X } from "lucide-react";

export function Terminal() {
  const { terminalOpen, setTerminal } = useUiStore();
  const { setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("terminal");
  const { open } = useTabs();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { lines, run, recall } = useTerminal({
    setTheme,
    navigate: (p: string) => router.push(p),
    switchLang: (l) => router.push(pathname.replace(/^\/(en|tr)/, `/${l}`) || `/${l}`),
    openFile: (id: FileId) => {
      open(id);
      const f = fileById(id);
      router.push(`/${locale}${f.route === "/" ? "" : f.route}`);
    },
    copyEmail: () => navigator.clipboard.writeText("osman.dayi3478@gmail.com"),
  });

  useEffect(() => {
    if (terminalOpen) inputRef.current?.focus();
  }, [terminalOpen]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setInput(recall(-1));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setInput(recall(1));
    }
  };

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.section
          initial={{ height: 0 }}
          animate={{ height: 240 }}
          exit={{ height: 0 }}
          transition={{ duration: 0.16 }}
          className="shrink-0 overflow-hidden border-t border-border bg-panel"
          aria-label="Terminal"
        >
          <header className="flex h-7 items-center justify-between border-b border-border bg-panel-2 px-3 text-[11px] text-fg-muted">
            <span>TERMINAL</span>
            <button onClick={() => setTerminal(false)} className="rounded p-0.5 hover:bg-panel hover:text-fg">
              <X className="h-3 w-3" />
            </button>
          </header>
          <div ref={scrollRef} className="h-[calc(100%-28px-32px)] overflow-y-auto px-3 py-2 font-mono text-[12px]">
            <p className="text-fg-muted">{t("welcome")}</p>
            {lines.map((l) => (
              <pre key={l.id} className="whitespace-pre-wrap">
                {l.kind === "input" ? (
                  <span>
                    <span className="text-success">{t("prompt")}</span> {l.text}
                  </span>
                ) : (
                  <span className="text-fg">{l.text}</span>
                )}
              </pre>
            ))}
          </div>
          <div className="flex h-8 items-center gap-2 border-t border-border px-3 font-mono text-[12px]">
            <span className="text-success">{t("prompt")}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1 bg-transparent text-fg outline-none"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 27.2: Commit**

```bash
git add -A
git commit -m "feat: add terminal panel with command runner"
```

---

## Task 28: Page transitions

**Files:**
- Modify: `src/components/ide/Shell.tsx`

- [ ] **Step 28.1: Wrap `children` in `AnimatePresence`**

Replace the `<main>` block in `src/components/ide/Shell.tsx`:

```tsx
"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { TitleBar } from "./TitleBar";
import { Sidebar } from "./Sidebar";
import { TabStrip } from "./TabStrip";
import { StatusBar } from "./StatusBar";
import { Terminal } from "./Terminal";
import { CommandPalette } from "./CommandPalette";
import { useUiStore } from "@/hooks/useUiStore";
import { useKeyboard } from "@/hooks/useKeyboard";

export function Shell({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useUiStore();
  const pathname = usePathname();
  useKeyboard();

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-bg text-fg">
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        {sidebarOpen && <Sidebar />}
        <div className="flex min-w-0 flex-1 flex-col">
          <TabStrip />
          <main className="relative flex min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex min-w-0 flex-1 flex-col overflow-auto"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
          <Terminal />
        </div>
      </div>
      <StatusBar />
      <CommandPalette />
    </div>
  );
}
```

- [ ] **Step 28.2: Commit**

```bash
git add -A
git commit -m "feat: animate page transitions in editor area"
```

---

## Task 29: Responsive behavior + small-screen fallback

**Files:**
- Modify: `src/components/ide/Sidebar.tsx`
- Modify: `src/components/ide/StatusBar.tsx`
- Modify: `src/components/ide/Terminal.tsx`

- [ ] **Step 29.1: Make sidebar overlay on small screens**

In `src/components/ide/Sidebar.tsx`, change the root `<aside>` className:

```tsx
<aside className="absolute inset-y-0 left-0 z-20 flex h-full shrink-0 border-r border-border bg-panel md:relative">
```

- [ ] **Step 29.2: Trim status bar on small screens**

In `src/components/ide/StatusBar.tsx`, add `hidden md:flex` to the cursor / branch spans:

Replace the left block:

```tsx
<div className="hidden items-center gap-3 md:flex">
  <span className="flex items-center gap-1">
    <GitBranch className="h-3 w-3" />
    {t("branch")}
  </span>
  <span className="opacity-90">{t("commit")}</span>
</div>
```

And the cursor span:

```tsx
<span className="hidden md:inline">Ln {ln}, Col {col}</span>
```

- [ ] **Step 29.3: Hide terminal panel on small screens**

In `src/components/ide/Terminal.tsx`, change the `<motion.section>` className to:

```tsx
className="hidden shrink-0 overflow-hidden border-t border-border bg-panel md:block"
```

- [ ] **Step 29.4: Commit**

```bash
git add -A
git commit -m "feat: responsive fallback for sidebar/status/terminal"
```

---

## Task 30: Polish, build, verify

**Files:**
- Create: `public/cv.pdf` (placeholder if real one isn't ready)

- [ ] **Step 30.1: Add a CV placeholder**

Create a placeholder so the download link doesn't 404:

```bash
echo "placeholder" > public/cv.pdf
```

(Replace with the real PDF when ready.)

- [ ] **Step 30.2: Run lint**

```bash
npm run lint
```

Fix any reported errors. The most likely complaints will be missing keys in `useTranslations` or unused imports — clean them up.

- [ ] **Step 30.3: Run all tests**

```bash
npm test
```

Expected: every test passes.

- [ ] **Step 30.4: Run production build**

```bash
npm run build
```

Expected: builds successfully. Address any type errors that appear.

- [ ] **Step 30.5: Manual verification**

```bash
npm run dev
```

Walk through the following checklist in a browser at `http://localhost:3000`:

- [ ] Default route redirects to `/en`
- [ ] README.md tab is open; typing animation runs once
- [ ] Click each file in the sidebar; tab opens; route updates
- [ ] Close a tab; correct neighbor activates; closing the last reopens README
- [ ] Cmd/Ctrl+K opens palette; selecting "Go to: projects.tsx" navigates
- [ ] Cmd/Ctrl+B toggles sidebar
- [ ] Cmd/Ctrl+W closes active tab
- [ ] Ctrl+` toggles terminal
- [ ] Terminal: `help`, `whoami`, `ls`, `theme dark`, `theme light`, `lang tr`, `lang en`, `open projects.tsx`, `clear`, `nope`, up-arrow recall
- [ ] Theme toggle in title bar cycles light → dark → system
- [ ] Language toggle switches `/en/...` ↔ `/tr/...` preserving the path
- [ ] All 7 projects render with images; tag filter narrows the list
- [ ] Contact page: copy-email button shows "Copied!"
- [ ] Resize browser to 600px: sidebar becomes overlay, terminal hidden, status bar simplified
- [ ] Set OS to `prefers-reduced-motion`: animations collapse to near-instant

- [ ] **Step 30.6: Commit final polish**

```bash
git add -A
git commit -m "chore: final polish and CV placeholder"
```

- [ ] **Step 30.7: Tag v1**

```bash
git tag v1.0.0
```

---

## Done

The portfolio is feature-complete per the spec.

**v2 deferred items (from spec §19):**
- Tab reordering by drag
- Real search panel
- Real git panel
- Blog (`/posts`)
- Playground tab
- Mobile-first redesign
