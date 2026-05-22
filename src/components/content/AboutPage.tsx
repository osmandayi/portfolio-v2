"use client";

import Image from "next/image";
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
        <header className="mb-8 flex items-center gap-5">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-accent-2/60 shadow-lg shadow-accent-2/10 ring-2 ring-bg sm:h-28 sm:w-28">
            <Image
              src="/osman.jpeg"
              alt="Osman Dayı"
              fill
              sizes="(max-width: 640px) 96px, 112px"
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl">
            <span className="text-accent-2"># </span>
            {t("heading")}
          </h1>
        </header>
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
