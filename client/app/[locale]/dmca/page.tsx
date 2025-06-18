import Container from "@/components/Layout/Container/Container";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import { getTranslations } from "next-intl/server";
import styles from "./page.module.scss";

export async function generateMetadata() {
  const t = await getTranslations("DMCA");
  return {
    title: t("meta_title"),
    description: t("meta_description"),
    openGraph: {
      title: t("meta_title"),
      description: t("meta_og_desc"),
      type: "article",
      url: "https://ink-three.vercel.app/dmca",
    },
    twitter: {
      card: "summary",
      title: t("meta_title"),
      description: t("meta_tw_desc"),
    },
  };
}

export default async function DmcaPage() {
  const t = await getTranslations("DMCA");

  return (
    <Container>
      <Wrapper className={styles.wrapper}>
        <h1>{t("title")}</h1>

        <p>{t("p1")}</p>
        <p>{t("p2")}</p>

        <h2>{t("how_title")}</h2>
        <p>{t("how_intro")}</p>
        <p>{t("how_must_include")}</p>

        <ul>
          <li>{t("how_1")}</li>
          <li>{t("how_2")}</li>
          <li>{t("how_3")}</li>
          <li>{t("how_4")}</li>
          <li>{t("how_5")}</li>
          <li>{t("how_6")}</li>
        </ul>

        <p>{t("after_notice")}</p>

        <h2>{t("warn_title")}</h2>
        <p>{t("warn_body")}</p>

        <h2>{t("limit_title")}</h2>
        <p>{t("limit_1")}</p>
        <p>{t("limit_2")}</p>
      </Wrapper>
    </Container>
  );
}
