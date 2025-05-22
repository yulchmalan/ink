"use client";

import styles from "./title-card.module.scss";
import clsx from "clsx";
import { format } from "date-fns";
import Pencil from "@/assets/icons/Pencil";
import { useS3Image } from "@/hooks/useS3Image";
import fallbackCover from "@/assets/cover.png";
import { useState } from "react";

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
  onEdit?: () => void;
}

export default function TitleCard({
  title,
  type = "grid",
  onEdit,
}: TitleCardProps) {
  const { name, id, chapter, chapterCount, added } = title;
  const [loaded, setLoaded] = useState(false);

  const cover = useS3Image("covers", id, fallbackCover.src);
  const isLoading = !cover;

  const formattedDate = added ? format(new Date(added), "dd.MM.yyyy") : "";

  return (
    <div className={clsx(styles.card, styles[type])}>
      <div className={styles.coverWrapper}>
        {isLoading && <div className={styles.skeleton} />}
        <img
          src={cover ?? fallbackCover.src}
          alt={name}
          className={clsx(styles.cover, { [styles.loaded]: loaded })}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
        {type === "grid" && onEdit && (
          <button className={styles.editBtn} onClick={onEdit}>
            <Pencil />
          </button>
        )}
      </div>

      <div className={styles.info}>
        <div>
          <h3 className={styles.title}>{name}</h3>
          <span className={styles.chapter}>
            {title.type === "NOVEL"
              ? `${chapter}%`
              : `Розділ ${chapter}/${chapterCount}`}
          </span>
        </div>

        {type === "row" && (
          <div className={styles.meta}>
            <span className={styles.label}>Додано</span>
            <span className={styles.date}>{formattedDate}</span>
          </div>
        )}

        {type === "row" && onEdit && (
          <button className={styles.editBtn} onClick={onEdit}>
            <Pencil />
          </button>
        )}
      </div>
    </div>
  );
}
