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
    <footer className="hidden h-6 shrink-0 items-center justify-between border-t border-border bg-accent/90 px-3 text-[11px] text-white md:flex dark:bg-accent/70">
      <div className="hidden items-center gap-3 md:flex">
        <span className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" />
          {t("branch")}
        </span>
        <span className="opacity-90">{t("commit")}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden md:inline">Ln {ln}, Col {col}</span>
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
