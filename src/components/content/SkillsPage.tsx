"use client";

import { useTranslations } from "next-intl";
import { SKILLS } from "@/lib/skills";
import { LineGutter } from "@/components/primitives/LineGutter";
import { RevealOnView } from "@/components/primitives/RevealOnView";

export function SkillsPage() {
  const t = useTranslations("skills");

  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={Math.max(40, SKILLS.reduce((a, c) => a + c.items.length, 0) + 12)} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="max-w-4xl flex-1 px-8 py-6 leading-[22px]">
        <h1 className="mb-2 text-2xl">
          <span className="text-fg-muted">{"{"}</span>
        </h1>
        <div className="space-y-6 pl-4">
          {SKILLS.map((cat, i) => (
            <RevealOnView key={cat.key} delay={i * 0.08}>
              <section>
                <p className="text-[13px]">
                  <span className="text-success">&quot;{cat.key}&quot;</span>
                  <span className="text-fg-muted">: </span>
                  <span className="text-fg-muted">[</span>
                </p>
                <ul className="my-2 ml-5 flex flex-wrap gap-2">
                  {cat.items.map((s) => (
                    <li
                      key={s}
                      className="rounded border border-border bg-panel-2 px-2 py-1 text-[12px] text-fg hover:border-accent hover:text-accent"
                    >
                      &quot;{s}&quot;
                    </li>
                  ))}
                </ul>
                <p className="text-fg-muted">{"],"}</p>
                <p className="mt-1 text-[12px] text-fg-muted/70">// {t(cat.key)}</p>
              </section>
            </RevealOnView>
          ))}
        </div>
        <p className="mt-4 text-fg-muted">{"}"}</p>
      </div>
    </div>
  );
}
