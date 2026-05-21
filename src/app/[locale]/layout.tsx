import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Providers } from "@/components/providers/Providers";
import { Shell } from "@/components/ide/Shell";
import { locales } from "@/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <Providers locale={locale} messages={messages}>
      <Shell>{children}</Shell>
    </Providers>
  );
}
