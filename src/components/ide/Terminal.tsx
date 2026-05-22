"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useUiStore } from "@/hooks/useUiStore";
import { useTerminal } from "@/hooks/useTerminal";
import { fileById, type FileId } from "@/lib/files";
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
          className="hidden shrink-0 overflow-hidden border-t border-border bg-panel md:block"
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
