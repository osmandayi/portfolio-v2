"use client";

import { ReactNode } from "react";
import { TitleBar } from "./TitleBar";
import { Sidebar } from "./Sidebar";
import { TabStrip } from "./TabStrip";
import { StatusBar } from "./StatusBar";
import { Terminal } from "./Terminal";
import { CommandPalette } from "./CommandPalette";
import { useUiStore } from "@/hooks/useUiStore";
import { useKeyboard } from "@/hooks/useKeyboard";

export function Shell({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useUiStore();
  useKeyboard();

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-bg text-fg">
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        {sidebarOpen && <Sidebar />}
        <div className="flex min-w-0 flex-1 flex-col">
          <TabStrip />
          <main className="relative flex min-h-0 flex-1 overflow-hidden">
            <div className="flex min-w-0 flex-1 flex-col overflow-auto">
              {children}
            </div>
          </main>
          <Terminal />
        </div>
      </div>
      <StatusBar />
      <CommandPalette />
    </div>
  );
}
