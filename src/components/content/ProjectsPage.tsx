"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Code, EyeIcon } from "lucide-react";
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

  const visible = PROJECTS.filter(
    (p) => filter === "All" || p.tags.includes(filter),
  );

  return (
    <div className="flex min-h-full font-mono">
      <LineGutter
        lines={120}
        className="border-r border-border bg-panel py-6 pl-3"
      />
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
              {f === "All"
                ? t("filterAll")
                : f === "Frontend"
                  ? t("filterFrontend")
                  : t("filterFullStack")}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((p, i) => {
            const title = t(`items.${idKey(p.id)}.title`);
            return (
              <RevealOnView
                key={p.id}
                delay={(i % 3) * 0.05}
                className="h-full"
              >
                <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-panel/50 transition hover:border-accent/60">
                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-panel-2">
                    <Image
                      src={p.image}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-black/65 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-3 px-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {p.gitUrl ? (
                        <Link
                          href={p.gitUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={t("viewGit")}
                          title={t("viewGit")}
                          className="relative h-14 w-14 rounded-full border-2 border-success/50 transition hover:bg-success/10"
                        >
                          <Code
                            className="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform"
                            color="#52ff74"
                          />
                        </Link>
                      ) : (
                        <span
                          role="img"
                          aria-label={t("noRepo")}
                          title={t("noRepo")}
                          className="relative h-14 w-14 cursor-not-allowed rounded-full border-2 border-danger/50"
                        >
                          <Code
                            className="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform"
                            color="#ff5252"
                          />
                        </span>
                      )}
                      {p.previewUrl ? (
                        <Link
                          href={p.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={t("viewLive")}
                          title={t("viewLive")}
                          className="relative h-14 w-14 rounded-full border-2 border-success/50 transition hover:bg-success/10"
                        >
                          <EyeIcon
                            className="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform"
                            color="#52ff74"
                          />
                        </Link>
                      ) : (
                        <span
                          role="img"
                          aria-label={t("noLive")}
                          title={t("noLive")}
                          className="relative h-14 w-14 cursor-not-allowed rounded-full border-2 border-danger/50"
                        >
                          <EyeIcon
                            className="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 transform"
                            color="#ff5252"
                          />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
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
                    <h2 className="font-mono text-[15px] text-fg">{title}</h2>
                    <p className="mt-2 line-clamp-3 font-sans text-[13px] text-fg-muted">
                      {t(`items.${idKey(p.id)}.desc`)}
                    </p>
                  </div>
                </article>
              </RevealOnView>
            );
          })}
        </div>
        <p className="mt-8 text-fg-muted">{"];"}</p>
      </div>
    </div>
  );
}
