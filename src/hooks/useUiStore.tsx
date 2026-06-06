"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface UiState {
  sidebarOpen: boolean;
  paletteOpen: boolean;
  terminalOpen: boolean;
  mobileNavOpen: boolean;
  setSidebar: (v: boolean | ((p: boolean) => boolean)) => void;
  setPalette: (v: boolean | ((p: boolean) => boolean)) => void;
  setTerminal: (v: boolean | ((p: boolean) => boolean)) => void;
  setMobileNav: (v: boolean | ((p: boolean) => boolean)) => void;
}

const UiContext = createContext<UiState | null>(null);

export function UiStoreProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpenRaw] = useState(true);
  const [paletteOpen, setPaletteOpenRaw] = useState(false);
  const [terminalOpen, setTerminalOpenRaw] = useState(false);
  const [mobileNavOpen, setMobileNavOpenRaw] = useState(false);

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
  const setMobileNav = useCallback(
    (v: boolean | ((p: boolean) => boolean)) =>
      setMobileNavOpenRaw((p) => (typeof v === "function" ? v(p) : v)),
    [],
  );

  return (
    <UiContext.Provider
      value={{
        sidebarOpen,
        paletteOpen,
        terminalOpen,
        mobileNavOpen,
        setSidebar,
        setPalette,
        setTerminal,
        setMobileNav,
      }}
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
