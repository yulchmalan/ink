"use client";
import styles from "./book-card.module.scss";
import fallbackCover from "@/assets/cover.png";
import { useS3Image } from "@/hooks/useS3Image";
import clsx from "clsx";
import { useLocalizedName } from "@/hooks/useLocalizedName";

export interface BookCardProps {
  title: string;
  alt_names?: { lang: string; value: string }[];
  desc?: string;
  coverId: string;
  href: string;
  size?: "large" | "small";
}

export default function BookCard({
  title,
  alt_names,
  desc,
  coverId,
  href,
  size = "small",
}: BookCardProps) {
  const localizedTitle = useLocalizedName(title, alt_names);
  const coverUrl = useS3Image("covers", coverId, fallbackCover.src);
  return (
    <a href={href} className={clsx(styles.card, styles[size])}>
      <div className={styles.coverContainer}>
        <img src={coverUrl} alt={localizedTitle} className={styles.cover} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{localizedTitle}</h3>
        {size === "large" && <p className={styles.desc}>{desc}</p>}
      </div>
    </a>
  );
}
