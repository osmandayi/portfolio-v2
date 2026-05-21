import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTabs } from "@/hooks/useTabs";

describe("useTabs", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("opens README by default", () => {
    const { result } = renderHook(() => useTabs());
    expect(result.current.openIds).toEqual(["readme"]);
    expect(result.current.activeId).toBe("readme");
  });

  it("opens a new tab and makes it active", () => {
    const { result } = renderHook(() => useTabs());
    act(() => result.current.open("about"));
    expect(result.current.openIds).toEqual(["readme", "about"]);
    expect(result.current.activeId).toBe("about");
  });

  it("opening an already-open tab just activates it", () => {
    const { result } = renderHook(() => useTabs());
    act(() => result.current.open("about"));
    act(() => result.current.open("projects"));
    act(() => result.current.open("about"));
    expect(result.current.openIds).toEqual(["readme", "about", "projects"]);
    expect(result.current.activeId).toBe("about");
  });

  it("closes the active tab and activates the next one to the right", () => {
    const { result } = renderHook(() => useTabs());
    act(() => result.current.open("about"));
    act(() => result.current.open("projects"));
    act(() => result.current.setActive("about"));
    act(() => result.current.close("about"));
    expect(result.current.openIds).toEqual(["readme", "projects"]);
    expect(result.current.activeId).toBe("projects");
  });

  it("closes the rightmost active tab and activates the previous one", () => {
    const { result } = renderHook(() => useTabs());
    act(() => result.current.open("about"));
    act(() => result.current.open("projects"));
    act(() => result.current.close("projects"));
    expect(result.current.openIds).toEqual(["readme", "about"]);
    expect(result.current.activeId).toBe("about");
  });

  it("closing the last tab re-opens README", () => {
    const { result } = renderHook(() => useTabs());
    act(() => result.current.close("readme"));
    expect(result.current.openIds).toEqual(["readme"]);
    expect(result.current.activeId).toBe("readme");
  });

  it("persists tabs to localStorage", () => {
    const { result } = renderHook(() => useTabs());
    act(() => result.current.open("about"));
    expect(JSON.parse(localStorage.getItem("portfolio.tabs") ?? "{}")).toMatchObject({
      openIds: ["readme", "about"],
      activeId: "about",
    });
  });
});
