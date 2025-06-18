import Container from "@/components/Layout/Container/Container";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import { getLocale, getTranslations } from "next-intl/server";
import styles from "./page.module.scss";

export async function generateMetadata() {
  const t = await getTranslations("Offer");
  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function PublicOfferPage() {
  const t = await getTranslations("Offer");
  const locale = await getLocale();

  return (
    <Container>
      <Wrapper className={styles.wrapper}>
        <h1>{t("title")}</h1>
        <p>{t("intro")}</p>

        <h2>{t("s1")}</h2>
        <ul>
          <li>{t("s1_1")}</li>
          <li>{t("s1_2")}</li>
          <li>{t("s1_3")}</li>
          <li>{t("s1_4")}</li>
          <li>{t("s1_5")}</li>
          <li>{t("s1_6")}</li>
        </ul>

        <h2>{t("s2")}</h2>
        <ul>
          <li>{t("s2_1")}</li>
          <li>{t("s2_2")}</li>
          <li>{t("s2_3")}</li>
          <li>{t("s2_4")}</li>
        </ul>

        <h2>{t("s3")}</h2>
        <ul>
          <li>{t("s3_1")}</li>
          <li>{t("s3_2")}</li>
          <li>{t("s3_3")}</li>
        </ul>

        <h2>{t("s4")}</h2>
        <ul>
          <li>{t("s4_1")}</li>
          <li>{t("s4_2")}</li>
          <li>{t("s4_3")}</li>
          <li>{t("s4_4")}</li>
        </ul>

        <h2>{t("s5")}</h2>
        <ul>
          <li>{t("s5_1")}</li>
          <li>{t("s5_2")}</li>
          <li>{t("s5_3")}</li>
          <li>{t("s5_4")}</li>
        </ul>

        <h2>{t("s6")}</h2>
        <ul>
          <li>{t("s6_1")}</li>
          <li>{t("s6_2")}</li>
          <li>{t("s6_3")}</li>
          <li>{t("s6_4")}</li>
        </ul>

        <h2>{t("s7")}</h2>
        <ul>
          <li>{t("s7_1")}</li>
          <li>{t("s7_2")}</li>
        </ul>

        <h2>{t("s8")}</h2>
        <p>{t("s8_text")}</p>

        <p>
          {t("last_update")}:{" "}
          {new Date("2025-01-01T12:00:00").toLocaleString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </Wrapper>
    </Container>
  );
}
