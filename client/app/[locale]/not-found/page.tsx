import Link from "next/link";
import styles from "@/app/not-found.module.scss";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Meta");

  return {
    title: `${t("notFoundTitle")} | Ink`,
    description: t("notFoundDescription"),
    robots: "noindex",
  };
}

export default async function NotFound() {
  const t = await getTranslations("404");

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.h1}>{t("title")}</h1>
      <p className={styles.p}>{t("desc")}</p>
      <a href="/" className={styles.homeBtn}>
        {t("back")}
      </a>
    </div>
  );
}
