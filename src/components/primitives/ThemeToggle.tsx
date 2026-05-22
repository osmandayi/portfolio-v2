"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, MonitorCog } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <button className="h-6 w-6" aria-hidden />;
  }

  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const Icon = theme === "system" ? MonitorCog : resolvedTheme === "dark" ? Moon : Sun;

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`theme: ${theme}`}
      aria-pressed={resolvedTheme === "dark"}
      title={`theme: ${theme}`}
      className="flex h-6 w-6 items-center justify-center rounded text-fg-muted hover:bg-panel-2 hover:text-fg"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
