"use client";

import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import { LineGutter } from "@/components/primitives/LineGutter";
import { RevealOnView } from "@/components/primitives/RevealOnView";

export function EducationPage() {
  const t = useTranslations("education");
  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={24} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="max-w-3xl flex-1 px-8 py-6 leading-[22px]">
        <h1 className="mb-6 text-2xl">
          <span className="text-accent-2"># </span>
          {t("heading")}
        </h1>
        <RevealOnView>
          <article className="rounded-md border border-border bg-panel/50 p-5">
            <header className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-accent-2" />
              <div>
                <h2 className="text-lg text-fg">{t("school")}</h2>
                <p className="text-[14px] text-fg-muted">{t("degree")} · {t("years")}</p>
              </div>
            </header>
            <p className="mt-4 text-[13px] text-fg-muted">{t("lang")}</p>
          </article>
        </RevealOnView>
      </div>
    </div>
  );
}
