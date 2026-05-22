"use client";

import { Command } from "cmdk";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  FileText, FileCode2, FileJson, Terminal as TerminalIcon, GraduationCap,
  Moon, Sun, Languages, GitBranch, ExternalLink, Mail, PanelLeft, ChevronsRight,
} from "lucide-react";
import { FILES, type FileEntry } from "@/lib/files";
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
                <GitBranch className="h-4 w-4" /> {t("openGithub")}
              </Command.Item>
              <Command.Item value="open linkedin" onSelect={() => { window.open("https://www.linkedin.com/in/osman-d-272a2820b/", "_blank"); setPalette(false); }} className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-fg data-[selected=true]:bg-panel-2">
                <ExternalLink className="h-4 w-4" /> {t("openLinkedin")}
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
