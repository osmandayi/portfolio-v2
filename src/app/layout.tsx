import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}
      style={{ ["--font-mono" as string]: "'JetBrains Mono'" }}>
      <body>{children}</body>
    </html>
  );
}

export const metadata = { title: "osman.dev — Portfolio", description: "Osman Dayı — Frontend Developer" };
