"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { FILES, type FileId } from "@/lib/files";

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

const HISTORY_KEY = "portfolio.terminal.history";

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
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
  const [history, setHistory] = useState<string[]>(() => loadHistory());
  const cursorRef = useRef<number>(-1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // sessionStorage full or unavailable; ignore
    }
  }, [history]);

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
