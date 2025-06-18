import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import Container from "@/components/Layout/Container/Container";
import { getTranslations } from "next-intl/server";
import styles from "./page.module.scss";

export async function generateMetadata() {
  const t = await getTranslations("Terms2");
  return {
    title: t("title"),
    description: t("meta_description"),
  };
}

export default async function TermsPage() {
  const t = await getTranslations("Terms2");

  return (
    <Container>
      <Wrapper className={styles.wrapper}>
        <h1>{t("title")}</h1>
        <div className={styles.section}>
          <h2>{t("s1_title")}</h2>
          <p>{t("s1_p1")}</p>
          <p>{t("s1_p2")}</p>

          <h2>{t("s2_title")}</h2>
          <p>{t("s2_p1")}</p>
          <p>{t("s2_p2")}</p>

          <h2>{t("s3_title")}</h2>
          <p>{t("s3_p1")}</p>
          <p>{t("s3_p2")}</p>

          <h2>{t("s4_title")}</h2>
          <p>
            <strong>{t("s4_user_rights")}:</strong>
          </p>
          <ul>
            <li>{t("s4_r1")}</li>
            <li>{t("s4_r2")}</li>
            <li>{t("s4_r3")}</li>
          </ul>
          <p>
            <strong>{t("s4_user_duties")}:</strong>
          </p>
          <ul>
            <li>{t("s4_d1")}</li>
            <li>{t("s4_d2")}</li>
            <li>{t("s4_d3")}</li>
          </ul>

          <h2>{t("s5_title")}</h2>
          <p>{t("s5_p1")}</p>
          <p>{t("s5_p2")}</p>

          <h2>{t("s6_title")}</h2>
          <p>
            {t("s6_intro")}
            <ul>
              <li>{t("s6_li1")}</li>
              <li>{t("s6_li2")}</li>
              <li>{t("s6_li3")}</li>
            </ul>
          </p>

          <h2>{t("s7_title")}</h2>
          <p>{t("s7_p")}</p>

          <h2>{t("s8_title")}</h2>
          <p>{t("s8_p")}</p>

          <h2>{t("s9_title")}</h2>
          <p>
            {t("s9_p")}{" "}
            <a href="mailto:juliamalanjuk@gmail.com">juliamalanjuk@gmail.com</a>
            .
          </p>
        </div>
      </Wrapper>
    </Container>
  );
}
