"use client";

import styles from "./collection-card.module.scss";
import Tag from "../../Tag/Tag";
import clsx from "clsx";
import { useS3Image } from "@/hooks/useS3Image";
import fallbackCover from "@/assets/cover.png";

interface CollectionCardProps {
  title: string;
  views: number;
  itemsCount: number;
  bookmarks?: number;
  likes: number;
  dislikes: number;
  titleIds: string[];
  className?: string;
}

export default function CollectionCard({
  title,
  views,
  itemsCount,
  bookmarks,
  likes,
  dislikes,
  titleIds = [],
  className,
}: CollectionCardProps) {
  const idsToShow = titleIds.slice(0, 3);
  const emptyCovers = 3 - idsToShow.length;

  const covers = idsToShow.map((id) =>
    useS3Image("covers", id, fallbackCover.src)
  );

  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.tags}>
          <Tag type="views" value={views} />
          <Tag type="layers" value={itemsCount} />
          <Tag type="likes" value={`${likes}/${dislikes}`} />
        </div>
      </div>

      <div className={styles.covers}>
        {covers.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`cover-${index}`}
            className={styles.coverImg}
          />
        ))}
        {Array.from({ length: emptyCovers }).map((_, index) => (
          <div key={`empty-${index}`} className={styles.placeholder} />
        ))}
      </div>
    </div>
  );
}
