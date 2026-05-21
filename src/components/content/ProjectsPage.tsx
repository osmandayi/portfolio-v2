"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { GitBranch, ExternalLink } from "lucide-react";
import { PROJECTS, PROJECT_TAG_FILTERS, type ProjectTag } from "@/lib/projects";
import { LineGutter } from "@/components/primitives/LineGutter";
import { RevealOnView } from "@/components/primitives/RevealOnView";
import { cn } from "@/lib/cn";

function idKey(id: string): string {
  if (id === "coffe-pub") return "coffe";
  return id;
}

export function ProjectsPage() {
  const t = useTranslations("projects");
  const [filter, setFilter] = useState<"All" | ProjectTag>("All");

  const visible = PROJECTS.filter((p) => filter === "All" || p.tags.includes(filter));

  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={120} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="flex-1 px-8 py-6 leading-[22px]">
        <h1 className="mb-2 text-2xl">
          <span className="text-warning">export const </span>
          <span className="text-accent-2">projects </span>
          <span className="text-fg-muted">= [</span>
        </h1>
        <p className="mb-6 text-[13px] text-fg-muted">{t("heading")}</p>

        <div className="mb-6 flex flex-wrap gap-2">
          {PROJECT_TAG_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1 text-[12px] font-medium",
                filter === f
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-fg-muted hover:border-accent/40 hover:text-fg",
              )}
            >
              {f === "All" ? t("filterAll") : f === "Frontend" ? t("filterFrontend") : t("filterFullStack")}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((p, i) => (
            <RevealOnView key={p.id} delay={(i % 3) * 0.05}>
              <article className="group overflow-hidden rounded-lg border border-border bg-panel/50 transition hover:border-accent/60">
                <div className="relative aspect-[16/10] overflow-hidden bg-panel-2">
                  <Image
                    src={p.image}
                    alt={t(`items.${idKey(p.id)}.title`)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-border bg-panel px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-mono text-[15px] text-fg">{t(`items.${idKey(p.id)}.title`)}</h2>
                  <p className="mt-2 line-clamp-3 font-sans text-[13px] text-fg-muted">
                    {t(`items.${idKey(p.id)}.desc`)}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-[12px]">
                    {p.gitUrl ? (
                      <a
                        href={p.gitUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-fg-muted hover:text-accent"
                      >
                        <GitBranch className="h-3.5 w-3.5" /> {t("viewGit")}
                      </a>
                    ) : (
                      <span className="text-fg-muted/50">{t("noRepo")}</span>
                    )}
                    {p.previewUrl ? (
                      <a
                        href={p.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-fg-muted hover:text-accent"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> {t("viewLive")}
                      </a>
                    ) : (
                      <span className="text-fg-muted/50">{t("noLive")}</span>
                    )}
                  </div>
                </div>
              </article>
            </RevealOnView>
          ))}
        </div>
        <p className="mt-8 text-fg-muted">{"];"}</p>
      </div>
    </div>
  );
}
