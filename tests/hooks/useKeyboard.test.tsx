import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboard } from "@/hooks/useKeyboard";

const setSidebar = vi.fn();
const setPalette = vi.fn();
const setTerminal = vi.fn();
const closeActive = vi.fn();
const setActiveByIndex = vi.fn();
const routerPush = vi.fn();

vi.mock("@/hooks/useUiStore", () => ({
  useUiStore: () => ({
    sidebarOpen: true,
    paletteOpen: false,
    terminalOpen: false,
    setSidebar,
    setPalette,
    setTerminal,
  }),
}));

vi.mock("@/hooks/useTabs", () => ({
  useTabs: () => ({
    openIds: ["readme", "about", "projects"],
    activeId: "about",
    close: closeActive,
    setActive: setActiveByIndex,
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPush }),
  usePathname: () => "/en/about",
}));

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

function press(key: string, opts: KeyboardEventInit = {}) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, ...opts }));
}

describe("useKeyboard", () => {
  beforeEach(() => {
    setSidebar.mockClear();
    setPalette.mockClear();
    setTerminal.mockClear();
    closeActive.mockClear();
    setActiveByIndex.mockClear();
    routerPush.mockClear();
  });

  it("Cmd+K toggles command palette", () => {
    renderHook(() => useKeyboard());
    press("k", { metaKey: true });
    expect(setPalette).toHaveBeenCalledTimes(1);
  });

  it("Ctrl+B toggles sidebar", () => {
    renderHook(() => useKeyboard());
    press("b", { ctrlKey: true });
    expect(setSidebar).toHaveBeenCalledTimes(1);
  });

  it("Cmd+W closes active tab", () => {
    renderHook(() => useKeyboard());
    press("w", { metaKey: true });
    expect(closeActive).toHaveBeenCalledWith("about");
  });

  it("Cmd+1 switches to first tab", () => {
    renderHook(() => useKeyboard());
    press("1", { metaKey: true });
    expect(setActiveByIndex).toHaveBeenCalledWith("readme");
  });

  it("shortcut is ignored while typing in an input", () => {
    renderHook(() => useKeyboard());
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "b", ctrlKey: true, bubbles: true }));
    expect(setSidebar).not.toHaveBeenCalled();
  });
});
