"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/primitives/ThemeToggle";
import { LanguageToggle } from "@/components/primitives/LanguageToggle";
import { ConfirmDialog } from "@/components/ide/ConfirmDialog";
import { OLD_URL } from "@/lib/urls";

export function TitleBar() {
  const t = useTranslations("chrome");
  const td = useTranslations("dialog.switchLegacy");
  const [legacyOpen, setLegacyOpen] = useState(false);

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
        <button
          onClick={() => setLegacyOpen(true)}
          aria-label={t("openLegacy")}
          title={t("openLegacy")}
          className="flex h-6 w-6 items-center justify-center rounded text-fg-muted hover:bg-panel-2 hover:text-fg"
        >
          <History className="h-4 w-4" />
        </button>
      </div>

      <ConfirmDialog
        open={legacyOpen}
        onClose={() => setLegacyOpen(false)}
        onConfirm={() => {
          window.location.href = OLD_URL;
        }}
        title={td("title")}
        description={td("body")}
        confirmLabel={td("confirm")}
        cancelLabel={td("cancel")}
      />
    </header>
  );
}
