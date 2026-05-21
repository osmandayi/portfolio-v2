"use client";

import { useTranslations } from "next-intl";
import { EXPERIENCE } from "@/lib/experience";
import { LineGutter } from "@/components/primitives/LineGutter";
import { RevealOnView } from "@/components/primitives/RevealOnView";
import { Briefcase } from "lucide-react";

function Bullets({ keyName }: { keyName: string }) {
  const t = useTranslations();
  const raw = t(keyName);
  const items = raw.split("||");
  return (
    <ul className="ml-5 list-disc space-y-1 text-[14px] text-fg-muted">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

export function ExperiencePage() {
  const t = useTranslations("experience");

  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={64} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="max-w-4xl flex-1 px-8 py-6 leading-[22px]">
        <h1 className="mb-6 text-2xl">
          <span className="text-warning">const </span>
          <span className="text-accent-2">experience </span>
          <span className="text-fg-muted">= [</span>
        </h1>
        <div className="space-y-8 pl-4">
          {EXPERIENCE.map((e, i) => (
            <RevealOnView key={e.id} delay={i * 0.08}>
              <article className="rounded-md border border-border bg-panel/50 p-5">
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="flex items-center gap-2 text-lg text-fg">
                    <Briefcase className="h-4 w-4 text-accent-2" />
                    <span>{e.company}</span>
                    <span className="text-fg-muted">·</span>
                    <span className="text-fg-muted text-[14px]">{t(e.roleKey.replace("experience.", ""))}</span>
                  </h2>
                  <span className="text-[12px] text-fg-muted">
                    {e.from} — {e.to ?? t("present")}
                  </span>
                </header>
                <p className="mt-3 text-[14px] text-fg">{t(e.bulletsKey.replace("experience.", ""))}</p>
                {e.subRoles && (
                  <div className="mt-4 space-y-4">
                    {e.subRoles.map((sr) => (
                      <div key={sr.titleKey}>
                        <h3 className="mb-1 text-[14px] text-accent">
                          {t(sr.titleKey.replace("experience.", ""))}
                        </h3>
                        <Bullets keyName={`experience.${sr.bulletsKey.replace("experience.", "")}`} />
                      </div>
                    ))}
                  </div>
                )}
                {!e.subRoles && (
                  <div className="mt-3">
                    <Bullets keyName={`experience.${e.bulletsKey.replace("experience.", "")}`} />
                  </div>
                )}
              </article>
            </RevealOnView>
          ))}
        </div>
        <p className="mt-6 text-fg-muted">{"];"}</p>
      </div>
    </div>
  );
}
