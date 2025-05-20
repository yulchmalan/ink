"use client";

import styles from "./title-card.module.scss";
import clsx from "clsx";
import { format } from "date-fns";
import Pencil from "@/assets/icons/Pencil";

interface TitleData {
  name: string;
  cover: string;
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
  const { name, cover, chapter, chapterCount, added } = title;
  const formattedDate = added ? format(new Date(added), "dd.MM.yyyy") : "";

  return (
    <div className={clsx(styles.card, styles[type])}>
      <div className={styles.coverWrapper}>
        <img src={cover} alt={name} className={styles.cover} />
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
