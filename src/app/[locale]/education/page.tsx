import { setRequestLocale } from "next-intl/server";
import { EducationPage } from "@/components/content/EducationPage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EducationPage />;
}
