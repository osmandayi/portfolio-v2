"use client";

import { useTranslations } from "next-intl";
import { LineGutter } from "@/components/primitives/LineGutter";
import { RevealOnView } from "@/components/primitives/RevealOnView";

export function AboutPage() {
  const t = useTranslations("about");
  const body = t("body");
  const paragraphs = body.split("\n\n");
  const lineCount = paragraphs.reduce((acc, p) => acc + p.split("\n").length + 2, 4);

  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={lineCount} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="max-w-3xl flex-1 px-8 py-6 leading-[22px]">
        <h1 className="mb-6 text-2xl">
          <span className="text-accent-2"># </span>
          {t("heading")}
        </h1>
        <div className="space-y-5 font-sans text-[15px] leading-relaxed text-fg">
          {paragraphs.map((p, i) => (
            <RevealOnView key={i} delay={i * 0.06}>
              <p>{p}</p>
            </RevealOnView>
          ))}
        </div>
      </div>
    </div>
  );
}
