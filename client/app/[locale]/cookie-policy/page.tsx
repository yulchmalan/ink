import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import Container from "@/components/Layout/Container/Container";
import styles from "./page.module.scss";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Cookies");
  return {
    title: t("meta_title"),
    description: t("meta_description"),
    openGraph: {
      title: t("meta_title"),
      description: t("og_description"),
      type: "website",
      url: "https://ink-three.vercel.app/cookie-policy",
    },
    twitter: {
      card: "summary",
      title: t("meta_title"),
      description: t("twitter_description"),
    },
  };
}

export default async function CookiesPage() {
  const t = await getTranslations("Cookies");

  return (
    <Container>
      <Wrapper className={styles.wrapper}>
        <h1>{t("title")}</h1>
        <div className={styles.section}>
          <h2>{t("s1_title")}</h2>
          <p>{t("s1_p")}</p>

          <h2>{t("s2_title")}</h2>
          <p>{t("s2_p")}</p>
          <ul>
            <li>{t("s2_l1")}</li>
            <li>{t("s2_l2")}</li>
            <li>{t("s2_l3")}</li>
            <li>{t("s2_l4")}</li>
            <li>{t("s2_l5")}</li>
          </ul>

          <h2>{t("s3_title")}</h2>
          <p>{t("s3_p")}</p>
          <ul>
            <li>
              <strong>{t("s3_l1_t")}</strong>: {t("s3_l1_d")}
            </li>
            <li>
              <strong>{t("s3_l2_t")}</strong>: {t("s3_l2_d")}
            </li>
            <li>
              <strong>{t("s3_l3_t")}</strong>: {t("s3_l3_d")}
            </li>
            <li>
              <strong>{t("s3_l4_t")}</strong>: {t("s3_l4_d")}
            </li>
          </ul>

          <h2>{t("s4_title")}</h2>
          <p>{t("s4_p")}</p>

          <h2>{t("s5_title")}</h2>
          <p>{t("s5_p")}</p>

          <h2>{t("s6_title")}</h2>
          <p>
            {t("s6_p")}{" "}
            <a href="mailto:juliamalanjuk@gmail.com">juliamalanjuk@gmail.com</a>
            .
          </p>
        </div>
      </Wrapper>
    </Container>
  );
}
