"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Phone, Mail, MapPin, GitBranch, ExternalLink, Copy, Check } from "lucide-react";
import { LineGutter } from "@/components/primitives/LineGutter";

const EMAIL = "osman.dayi3478@gmail.com";
const PHONE = "+90 536 930 1936";
const GITHUB = "https://github.com/osmandayi";
const LINKEDIN = "https://www.linkedin.com/in/osman-d-272a2820b/";

export function ContactPage() {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex min-h-full font-mono">
      <LineGutter lines={24} className="border-r border-border bg-panel py-6 pl-3" />
      <div className="max-w-3xl flex-1 px-8 py-6 leading-[22px]">
        <p className="mb-6 text-fg-muted">{t("intro")}</p>

        <h1 className="mb-6 text-2xl">
          <span className="text-success">echo </span>
          <span className="text-accent-2">&quot;{t("heading")}&quot;</span>
        </h1>

        <ul className="space-y-3 text-[14px]">
          <li className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-accent" />
            <span className="text-fg-muted">{t("phone")}:</span>
            <a className="text-fg hover:text-accent" href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
          </li>
          <li className="flex flex-wrap items-center gap-3">
            <Mail className="h-4 w-4 text-accent" />
            <span className="text-fg-muted">{t("email")}:</span>
            <a className="text-fg hover:text-accent" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[12px] text-fg-muted hover:border-accent hover:text-fg"
            >
              {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
              {copied ? t("copied") : t("copyEmail")}
            </button>
          </li>
          <li className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="text-fg-muted">{t("location")}:</span>
            <span className="text-fg">{t("locationValue")}</span>
          </li>
          <li className="flex items-center gap-3">
            <GitBranch className="h-4 w-4 text-accent" />
            <span className="text-fg-muted">{t("github")}:</span>
            <a className="text-fg hover:text-accent" href={GITHUB} target="_blank" rel="noreferrer">{GITHUB}</a>
          </li>
          <li className="flex items-center gap-3">
            <ExternalLink className="h-4 w-4 text-accent" />
            <span className="text-fg-muted">{t("linkedin")}:</span>
            <a className="text-fg hover:text-accent" href={LINKEDIN} target="_blank" rel="noreferrer">/in/osman-d-272a2820b</a>
          </li>
        </ul>

        <p className="mt-8 text-fg-muted">$ _</p>
      </div>
    </div>
  );
}
