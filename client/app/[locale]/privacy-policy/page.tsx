import Container from "@/components/Layout/Container/Container";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import { getLocale, getTranslations } from "next-intl/server";
import styles from "./page.module.scss";

export async function generateMetadata() {
  const t = await getTranslations("Privacy");
  return {
    title: t("meta_title"),
    description: t("meta_description"),
    openGraph: {
      title: t("meta_title"),
      description: t("meta_og_desc"),
      type: "website",
      url: "https://ink-three.vercel.app/privacy-policy",
    },
    twitter: {
      card: "summary",
      title: t("meta_title"),
      description: t("meta_tw_desc"),
    },
  };
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("Privacy");
  const locale = await getLocale();

  return (
    <Container>
      <Wrapper className={styles.wrapper}>
        <h1>{t("title")}</h1>
        <p>{t("intro")}</p>

        <h2>{t("section1_title")}</h2>
        <p>{t("section1_intro")}</p>
        <ul>
          <li>{t("section1_item1")}</li>
          <li>{t("section1_item2")}</li>
          <li>{t("section1_item3")}</li>
          <li>{t("section1_item4")}</li>
          <li>{t("section1_item5")}</li>
        </ul>

        <h2>{t("section2_title")}</h2>
        <p>{t("section2_intro")}</p>
        <ul>
          <li>{t("section2_item1")}</li>
          <li>{t("section2_item2")}</li>
          <li>{t("section2_item3")}</li>
          <li>{t("section2_item4")}</li>
          <li>{t("section2_item5")}</li>
        </ul>

        <h2>{t("section3_title")}</h2>
        <p>{t("section3_body")}</p>

        <h2>{t("section4_title")}</h2>
        <p>{t("section4_body")}</p>

        <h2>{t("section5_title")}</h2>
        <p>{t("section5_body")}</p>

        <h2>{t("section6_title")}</h2>
        <p>{t("section6_intro")}</p>
        <ul>
          <li>{t("section6_item1")}</li>
          <li>{t("section6_item2")}</li>
          <li>{t("section6_item3")}</li>
          <li>{t("section6_item4")}</li>
        </ul>

        <h2>{t("section7_title")}</h2>
        <p>{t("section7_body")}</p>

        <p>
          {t("last_update")}:{" "}
          {new Date("2025-01-01T12:00:00").toLocaleString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </Wrapper>
    </Container>
  );
}
