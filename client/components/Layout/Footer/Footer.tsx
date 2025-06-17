"use client";

import Logo from "@/components/UI/Buttons/Logo/Logo";
import styles from "./footer.module.scss";
import Image from "next/image";
import Link from "next/link";
import Telegram from "@/assets/icons/Telegram";
import Twitter from "@/assets/icons/Twitter";
import YouTube from "@/assets/icons/YouTube";
import Container from "../Container/Container";
import { useLocale, useTranslations } from "use-intl";

export default function Footer() {
  const localActive = useLocale();
  const t = useTranslations("Footer");

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.columns}>
            <div className={styles.column}>
              <Logo className={styles.logo}></Logo>
            </div>
            <div className={styles.column}>
              <h4>{t("col1_heading")}</h4>
              <ul>
                <li>
                  <Link href="/privacy-policy">{t("col1_1")}</Link>
                </li>
                <li>
                  <Link href="/public-offer">{t("col1_2")}</Link>
                </li>
                <li>
                  <Link href="/dmca">{t("col1_3")}</Link>
                </li>
              </ul>
            </div>
            <div className={styles.column}>
              <h4>{t("col2_heading")}</h4>
              <ul>
                <li>
                  <Link href="/">{t("col2_1")}</Link>
                </li>
                <li>
                  <Link href="/catalog">{t("col2_2")}</Link>
                </li>
                <li>
                  <Link href="/faq">{t("col2_3")}</Link>
                </li>
              </ul>
            </div>
            <div className={styles.column}>
              <h4>{t("col3_heading")}</h4>
              <ul>
                <li>
                  <Link href="/contacts">{t("col3_1")}</Link>
                </li>
              </ul>
            </div>
            <div className={styles.column}>
              <h4>{t("col4_heading")}</h4>
              <ul>
                <li>
                  <Link href="/catalog?type=NOVEL">{t("col4_1")}</Link>
                </li>
                <li>
                  <Link href="/catalog?type=COMIC">{t("col4_2")}</Link>
                </li>
              </ul>
            </div>
            <div className={styles.column}>
              <h4>{t("col5_heading")}</h4>
              <div className={styles.socials}>
                <Link
                  href="https://t.me/ink_platform"
                  target="_blank"
                  className={styles.social}
                >
                  <Telegram />
                </Link>
                <Link
                  href="https://twitter.com/ink_platform"
                  target="_blank"
                  className={styles.social}
                >
                  <Twitter />
                </Link>
                <Link
                  href="https://youtube.com/ink_platform"
                  target="_blank"
                  className={styles.social}
                >
                  <YouTube />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>©2025 Ink, {t("rights")}</span>
          <div className={styles.links}>
            <Link href="/terms" className={styles.link}>
              {t("terms")}
            </Link>
            <Link href="/privacy-policy" className={styles.link}>
              {t("privacy")}
            </Link>
            <Link href="/cookie-policy" className={styles.link}>
              {t("cookie")}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
