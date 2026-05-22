import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTerminal } from "@/hooks/useTerminal";

const setTheme = vi.fn();
const navigate = vi.fn();

const ctx = {
  setTheme,
  navigate,
  switchLang: vi.fn(),
  openFile: vi.fn(),
  copyEmail: vi.fn(),
};

describe("useTerminal", () => {
  beforeEach(() => {
    sessionStorage.clear();
    setTheme.mockClear();
    navigate.mockClear();
    ctx.switchLang.mockClear();
    ctx.openFile.mockClear();
    ctx.copyEmail.mockClear();
  });

  it("starts with a welcome line", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    expect(result.current.lines[0].text).toMatch(/help/i);
  });

  it("`help` prints the help text", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("help"));
    const last = result.current.lines.at(-1)!;
    expect(last.text).toMatch(/help/i);
  });

  it("`whoami` prints osman", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("whoami"));
    expect(result.current.lines.at(-1)!.text).toBe("osman");
  });

  it("`theme dark` calls setTheme('dark')", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("theme dark"));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("`open projects.tsx` opens the projects file", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("open projects.tsx"));
    expect(ctx.openFile).toHaveBeenCalledWith("projects");
  });

  it("unknown command produces 'command not found'", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("nope"));
    expect(result.current.lines.at(-1)!.text).toMatch(/not found/i);
  });

  it("`clear` empties the buffer", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("whoami"));
    act(() => result.current.run("clear"));
    expect(result.current.lines).toEqual([]);
  });

  it("up arrow recalls previous command", () => {
    const { result } = renderHook(() => useTerminal(ctx));
    act(() => result.current.run("whoami"));
    act(() => result.current.run("help"));
    expect(result.current.history[0]).toBe("whoami");
    expect(result.current.history[1]).toBe("help");
    const prev = result.current.recall(-1);
    expect(prev).toBe("help");
  });
});
