import Container from "@/components/Layout/Container/Container";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import { getTranslations } from "next-intl/server";
import styles from "./faq.module.scss";

export async function generateMetadata() {
  const t = await getTranslations("FAQ");
  return {
    title: t("meta_title"),
    description: t("meta_description"),
    openGraph: {
      title: t("meta_title"),
      description: t("meta_og_desc"),
      type: "website",
      url: "https://ink-three.vercel.app/faq",
    },
    twitter: {
      card: "summary",
      title: t("meta_title"),
      description: t("meta_tw_desc"),
    },
  };
}

export default async function FAQPage() {
  const t = await getTranslations("FAQ");

  const items = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
    { q: t("q6"), a: t("a6") },
  ];

  return (
    <Container>
      <Wrapper className={styles.wrapper}>
        <div className={styles.faqPage}>
          <h1>{t("title")}</h1>
          <div className={styles.accordion}>
            {items.map((item, idx) => (
              <details key={idx} className={styles.item}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Wrapper>
    </Container>
  );
}
