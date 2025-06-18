import Container from "@/components/Layout/Container/Container";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import { getTranslations } from "next-intl/server";
import styles from "./page.module.scss";

export async function generateMetadata() {
  const t = await getTranslations("Contacts");
  return {
    title: t("meta_title"),
    description: t("meta_description"),
    openGraph: {
      title: t("meta_title"),
      description: t("meta_og_desc"),
      type: "website",
      url: "https://ink-three.vercel.app/contacts",
    },
    twitter: {
      card: "summary",
      title: t("meta_title"),
      description: t("meta_tw_desc"),
    },
  };
}

export default async function ContactsPage() {
  const t = await getTranslations("Contacts");

  return (
    <Container>
      <Wrapper className={styles.wrapper}>
        <h1>{t("title")}</h1>
        <p>{t("intro")}</p>

        <h2>{t("tech_title")}</h2>
        <p>
          {t("tech_email")}:{" "}
          <a href="mailto:juliamalanjuk@gmail.com">juliamalanjuk@gmail.com</a>
          <br />
          {t("tech_note")}
        </p>

        <h2>{t("dmca_title")}</h2>
        <p>
          {t("dmca_email")}:{" "}
          <a href="mailto:juliamalanjuk@gmail.com">juliamalanjuk@gmail.com</a>
          <br />
          {t("dmca_note")}
        </p>

        <h2>{t("social_title")}</h2>
        <ul>
          <li>
            Discord:{" "}
            <a href="https://discord.gg/ink-platform" target="_blank">
              discord.gg/ink-platform
            </a>
          </li>
          <li>
            Telegram:{" "}
            <a href="https://t.me/ink_platform" target="_blank">
              @ink_platform
            </a>
          </li>
          <li>
            Twitter / X:{" "}
            <a href="https://twitter.com/ink_platform" target="_blank">
              @ink_platform
            </a>
          </li>
        </ul>

        <h2>{t("address_title")}</h2>
        <p>{t("address_body")}</p>

        <p>{t("outro")}</p>
      </Wrapper>
    </Container>
  );
}
