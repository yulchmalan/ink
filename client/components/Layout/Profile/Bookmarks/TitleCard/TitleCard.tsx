"use client";

import styles from "./title-card.module.scss";
import clsx from "clsx";
import { format } from "date-fns";
import { useS3Image } from "@/hooks/useS3Image";
import fallbackCover from "@/assets/cover.png";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface TitleData {
  id: string;
  name: string;
  chapter: number;
  chapterCount: number;
  last_open?: string;
  added?: string;
  type: "COMIC" | "NOVEL";
}

interface TitleCardProps {
  title: TitleData;
  type?: "grid" | "row";
}

export default function TitleCard({ title, type = "grid" }: TitleCardProps) {
  const t = useTranslations("Profile");

  const { name, id, chapter, chapterCount, added } = title;
  const [loaded, setLoaded] = useState(false);

  const cover = useS3Image("covers", id, fallbackCover.src);
  const isLoading = !cover;

  const formattedDate = added ? format(new Date(added), "dd.MM.yyyy") : "";

  return (
    <div className={clsx(styles.card, styles[type])}>
      <Link className={styles.coverWrapper} href={`/catalog/${id}`}>
        <div className={styles.coverWrapper}>
          {isLoading && <div className={styles.skeleton} />}

          <img
            src={cover ?? fallbackCover.src}
            alt={name}
            className={clsx(styles.cover, { [styles.loaded]: loaded })}
            onLoad={() => setLoaded(true)}
          />
        </div>
      </Link>

      <div className={styles.info}>
        <div>
          <Link href={`/catalog/${id}`}>
            <h3 className={styles.title}>{name}</h3>
          </Link>
          <span className={styles.chapter}>
            {t("chapter") + ` ${chapter}/${chapterCount}`}
          </span>
        </div>

        {type === "row" && (
          <div className={styles.meta}>
            <span className={styles.label}>{t("sort_added")}</span>
            <span className={styles.date}>{formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
