"use client";
import styles from "./book-card.module.scss";
import fallbackCover from "@/assets/cover.png";
import { useS3Image } from "@/hooks/useS3Image";
import clsx from "clsx";

export interface BookCardProps {
  title: string;
  desc?: string;
  coverId: string;
  href: string;
  size?: "large" | "small";
}

export default function BookCard({
  title,
  desc,
  coverId,
  href,
  size = "small",
}: BookCardProps) {
  const coverUrl = useS3Image("covers", coverId, fallbackCover.src);

  return (
    <a href={href} className={clsx(styles.card, styles[size])}>
      <div className={styles.coverContainer}>
        <img src={coverUrl} alt={title} className={styles.cover} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        {size === "large" && <p className={styles.desc}>{desc}</p>}
      </div>
    </a>
  );
}
