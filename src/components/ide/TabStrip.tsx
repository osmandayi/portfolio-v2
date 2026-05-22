"use client";

import { X } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fileById, fileByRoute, type FileId } from "@/lib/files";
import { useTabs } from "@/hooks/useTabs";
import { cn } from "@/lib/cn";

export function TabStrip() {
  const { openIds, activeId, open, close, setActive } = useTabs();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  // Sync URL → tabs: if user navigates to a route, open that file as tab + active.
  useEffect(() => {
    const f = fileByRoute(pathname);
    if (f) open(f.id);
  }, [pathname, open]);

  const onClickTab = (id: FileId) => {
    setActive(id);
    const f = fileById(id);
    router.push(`/${locale}${f.route === "/" ? "" : f.route}`);
  };

  const onCloseTab = (e: React.MouseEvent, id: FileId) => {
    e.stopPropagation();
    close(id);
    if (id === activeId) {
      const idx = openIds.indexOf(id);
      const nextId = openIds[idx + 1] ?? openIds[idx - 1] ?? "readme";
      const f = fileById(nextId);
      router.push(`/${locale}${f.route === "/" ? "" : f.route}`);
    }
  };

  return (
    <div className="flex h-9 shrink-0 items-stretch overflow-x-auto border-b border-border bg-panel">
      <AnimatePresence initial={false}>
        {openIds.map((id) => {
          const f = fileById(id);
          const Icon = f.icon;
          const active = id === activeId;
          return (
            <motion.button
              key={id}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={() => onClickTab(id)}
              className={cn(
                "group flex items-center gap-2 overflow-hidden border-r border-border px-3 text-[12px] font-mono whitespace-nowrap",
                active
                  ? "bg-panel-2 text-fg"
                  : "bg-panel text-fg-muted hover:text-fg",
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: f.iconColor }} />
              <span>{f.label}</span>
              {active && id !== "readme" && (
                <span
                  aria-hidden
                  className="ml-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
              )}
              <span
                role="button"
                aria-label={`Close ${f.label}`}
                onClick={(e) => onCloseTab(e, id)}
                className="ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded text-fg-muted hover:bg-danger/20 hover:text-danger"
              >
                <X className="h-3 w-3" />
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
