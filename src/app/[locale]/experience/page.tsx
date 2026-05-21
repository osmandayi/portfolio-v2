import { setRequestLocale } from "next-intl/server";
import { ExperiencePage } from "@/components/content/ExperiencePage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ExperiencePage />;
}
