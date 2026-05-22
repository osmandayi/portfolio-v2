"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useUiStore } from "@/hooks/useUiStore";
import { useTabs } from "@/hooks/useTabs";
import { fileById } from "@/lib/files";

function isTextField(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}

export function useKeyboard() {
  const { setSidebar, setPalette, setTerminal, paletteOpen } = useUiStore();
  const { openIds, activeId, close, setActive } = useTabs();
  const router = useRouter();
  const locale = useLocale();

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
        const idx = openIds.indexOf(activeId);
        const nextId = openIds[idx + 1] ?? openIds[idx - 1] ?? "readme";
        close(activeId);
        const f = fileById(nextId);
        router.push(`/${locale}${f.route === "/" ? "" : f.route}`);
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
  }, [setSidebar, setPalette, setTerminal, close, setActive, activeId, openIds, paletteOpen, router, locale]);
}
