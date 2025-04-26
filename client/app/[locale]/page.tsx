import LanguageSwitcher from "@/components/UI/LanguageSwitcher";
import { getTranslations, getLocale } from "next-intl/server";

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Index" });

  return (
    <>
      <h1>{t("localeText")}</h1>
      <LanguageSwitcher></LanguageSwitcher>
    </>
  );
}
