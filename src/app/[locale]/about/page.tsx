import { setRequestLocale } from "next-intl/server";
import { AboutPage } from "@/components/content/AboutPage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutPage />;
}
