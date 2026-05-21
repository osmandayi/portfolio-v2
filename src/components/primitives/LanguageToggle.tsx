"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const next = locale === "tr" ? "en" : "tr";
  const nextPath = pathname.replace(/^\/(en|tr)/, `/${next}`);

  return (
    <Link
      href={nextPath || `/${next}`}
      className="flex h-6 min-w-[2rem] items-center justify-center rounded px-1.5 text-[11px] font-medium uppercase text-fg-muted hover:bg-panel-2 hover:text-fg"
      aria-label={`Switch to ${next.toUpperCase()}`}
    >
      {next}
    </Link>
  );
}
