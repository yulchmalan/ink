import Link from "next/link";
import styles from "@/app/not-found.module.scss";
import { Metadata } from "next";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Сторінку не знайдено | Ink",
  description: "Такої сторінки не існує або вона була видалена.",
  robots: "noindex",
};

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.h1}>Сторінку не знайдено</h1>
      <p className={styles.p}>
        Можливо, вона була видалена або ніколи не існувала.
      </p>
      <Link href="/" className={styles.homeBtn}>
        Повернутись на головну
      </Link>
    </div>
  );
}
