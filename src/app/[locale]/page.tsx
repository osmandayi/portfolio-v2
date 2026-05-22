import { setRequestLocale } from "next-intl/server";
import { ReadmePage } from "@/components/content/ReadmePage";
import { getLatestCv } from "@/lib/cv";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cv = getLatestCv();
  return <ReadmePage cvHref={cv.href} cvFile={cv.file} />;
}
