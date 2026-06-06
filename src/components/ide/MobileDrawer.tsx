"use client";

import { useEffect } from "react";
import { X, Folder } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { FILES, type FileId } from "@/lib/files";
import { useTabs } from "@/hooks/useTabs";
import { useUiStore } from "@/hooks/useUiStore";
import { cn } from "@/lib/cn";

export function MobileDrawer() {
  const t = useTranslations("chrome");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useTabs();
  const { mobileNavOpen, setMobileNav } = useUiStore();

  const activeRoute = pathname.replace(/^\/(en|tr)/, "") || "/";

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNav(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen, setMobileNav]);

  const handle = (id: FileId, route: string) => {
    open(id);
    router.push(`/${locale}${route === "/" ? "" : route}`);
    setMobileNav(false);
  };

  return (
    <AnimatePresence>
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden" aria-modal role="dialog">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileNav(false)}
            className="absolute inset-0 bg-black/50"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col border-r border-border bg-panel"
          >
            <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
              <span className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-fg-muted">
                <Folder className="h-3.5 w-3.5" />
                portfolio
              </span>
              <button
                onClick={() => setMobileNav(false)}
                aria-label={t("closeMenu")}
                className="flex h-8 w-8 items-center justify-center rounded text-fg-muted hover:bg-panel-2 hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <nav className="flex-1 overflow-y-auto p-2">
              <ul className="space-y-1">
                {FILES.map((f) => {
                  const active = f.route === activeRoute;
                  const Icon = f.icon;
                  return (
                    <li key={f.id}>
                      <button
                        onClick={() => handle(f.id, f.route)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left font-mono text-[14px]",
                          active
                            ? "bg-accent/15 text-fg"
                            : "text-fg-muted active:bg-panel-2",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" style={{ color: f.iconColor }} />
                        <span>{f.label}</span>
                        {active && (
                          <span
                            aria-hidden
                            className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
