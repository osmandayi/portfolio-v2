import { setRequestLocale } from "next-intl/server";
import { SkillsPage } from "@/components/content/SkillsPage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SkillsPage />;
}
