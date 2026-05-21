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
