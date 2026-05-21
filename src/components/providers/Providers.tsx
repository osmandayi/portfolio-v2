"use client";

import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { ReactNode } from "react";

export function Providers({ children, locale, messages }:
  { children: ReactNode; locale: string; messages: AbstractIntlMessages }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
