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
