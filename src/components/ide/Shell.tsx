"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  useKeyboard();

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-bg text-fg">
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        {sidebarOpen && <Sidebar />}
        <div className="flex min-w-0 flex-1 flex-col">
          <TabStrip />
          <main className="relative flex min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex min-w-0 flex-1 flex-col overflow-auto"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
          <Terminal />
        </div>
      </div>
      <StatusBar />
      <CommandPalette />
    </div>
  );
}
