"use client";

import Logo from "@/components/UI/Buttons/Logo/Logo";
import styles from "./footer.module.scss";
import Image from "next/image";
import Link from "next/link";
import Telegram from "@/assets/icons/Telegram";
import Twitter from "@/assets/icons/Twitter";
import YouTube from "@/assets/icons/YouTube";
import Container from "../Container/Container";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.columns}>
            <div className={styles.column}>
              <Logo className={styles.logo}></Logo>
            </div>
            <div className={styles.column}>
              <h4>Наш сайт</h4>
              <ul>
                <li>
                  <Link href="#">Політика конфіденційності</Link>
                </li>
                <li>
                  <Link href="#">Публічна оферта</Link>
                </li>
                <li>
                  <Link href="#">DMCA – Правовласникам</Link>
                </li>
                <li>
                  <Link href="#">Як створити публікацію?</Link>
                </li>
              </ul>
            </div>
            <div className={styles.column}>
              <h4>Навігація</h4>
              <ul>
                <li>
                  <Link href="#">Головна</Link>
                </li>
                <li>
                  <Link href="#">Каталог</Link>
                </li>
                <li>
                  <Link href="#">FAQ</Link>
                </li>
              </ul>
            </div>
            <div className={styles.column}>
              <h4>Підтримка</h4>
              <ul>
                <li>
                  <Link href="#">Контакти</Link>
                </li>
              </ul>
            </div>
            <div className={styles.column}>
              <h4>Каталог</h4>
              <ul>
                <li>
                  <Link href="#">Книги</Link>
                </li>
                <li>
                  <Link href="#">Комікси</Link>
                </li>
                <li>
                  <Link href="#">Манґа</Link>
                </li>
                <li>
                  <Link href="#">Манхви</Link>
                </li>
              </ul>
            </div>
            <div className={styles.column}>
              <h4>Ми в соцмережах</h4>
              <div className={styles.socials}>
                <Link href="#" className={styles.social}>
                  <Telegram />
                </Link>
                <Link href="#" className={styles.social}>
                  <Twitter />
                </Link>
                <Link href="#" className={styles.social}>
                  <YouTube />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>©2025 Ink, All Rights Reserved</span>
          <div className={styles.links}>
            <Link href="#" className={styles.link}>
              Terms of Use
            </Link>
            <Link href="#" className={styles.link}>
              Privacy Policy
            </Link>
            <Link href="#" className={styles.link}>
              Cookie Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
