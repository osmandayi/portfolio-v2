"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Folder } from "lucide-react";
import { useState } from "react";
import { FILES } from "@/lib/files";
import { useTabs } from "@/hooks/useTabs";
import { cn } from "@/lib/cn";

export function FileTree() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [folderOpen, setFolderOpen] = useState(true);
  const { open } = useTabs();

  const handle = (id: (typeof FILES)[number]["id"], route: string) => {
    open(id);
    router.push(`/${locale}${route === "/" ? "" : route}`);
  };

  const activeRoute = pathname.replace(/^\/(en|tr)/, "") || "/";

  return (
    <div className="select-none px-2 py-2 text-[13px]">
      <button
        onClick={() => setFolderOpen((p) => !p)}
        className="flex w-full items-center gap-1 rounded px-1 py-0.5 text-fg-muted uppercase tracking-wider hover:text-fg"
        aria-expanded={folderOpen}
      >
        <ChevronRight
          className={cn("h-3 w-3 transition-transform", folderOpen && "rotate-90")}
        />
        <Folder className="h-3.5 w-3.5" />
        <span className="text-[11px]">portfolio</span>
      </button>
      {folderOpen && (
        <ul className="mt-1 space-y-0.5 pl-4">
          {FILES.map((f) => {
            const active = f.route === activeRoute;
            const Icon = f.icon;
            return (
              <li key={f.id}>
                <button
                  onClick={() => handle(f.id, f.route)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-1.5 py-1 text-left font-mono",
                    active
                      ? "bg-panel-2 text-fg"
                      : "text-fg-muted hover:bg-panel-2 hover:text-fg",
                  )}
                >
                  <Icon className="h-4 w-4" style={{ color: f.iconColor }} />
                  <span>{f.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
