"use client";

import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { ReactNode } from "react";
import { UiStoreProvider } from "@/hooks/useUiStore";

export function Providers({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Istanbul">
        <UiStoreProvider>{children}</UiStoreProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
