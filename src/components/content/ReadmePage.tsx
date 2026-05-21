"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Mail, Download } from "lucide-react";
import { TypingText } from "@/components/primitives/TypingText";
import { LineGutter } from "@/components/primitives/LineGutter";

export function ReadmePage() {
  const t = useTranslations("readme");
  const locale = useLocale();

  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={24} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="flex-1 px-8 py-6 leading-[22px]">
        <p className="text-fg-muted">{t("greeting")}</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
          <span className="text-accent-2"># </span>
          <TypingText text={t("name")} />
        </h1>
        <h2 className="mt-2 text-xl text-fg-muted md:text-2xl">
          <span className="text-success">{"> "}</span>
          <TypingText text={t("role")} speed={28} />
        </h2>
        <p className="mt-6 max-w-2xl font-sans text-[15px] leading-relaxed text-fg">
          {t("pitch")}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-panel-2 px-4 py-2 text-sm font-medium text-fg hover:border-accent hover:text-accent"
          >
            {t("ctaProjects")} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-fg-muted hover:border-accent hover:text-fg"
          >
            <Mail className="h-4 w-4" /> {t("ctaContact")}
          </Link>
          <a
            href="/cv.pdf"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-fg-muted hover:border-accent hover:text-fg"
          >
            <Download className="h-4 w-4" /> {t("ctaCv")}
          </a>
        </div>
      </div>
    </div>
  );
}
