"use client";

import { Files, Search, GitBranch, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { FileTree } from "./FileTree";

export function Sidebar() {
  const t = useTranslations("chrome");
  return (
    <aside className="absolute inset-y-0 left-0 z-20 flex h-full shrink-0 border-r border-border bg-panel md:relative">
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
