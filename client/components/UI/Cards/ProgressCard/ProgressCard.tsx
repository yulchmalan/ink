"use client";

import { useS3Image } from "@/hooks/useS3Image";
import Cross from "@/assets/icons/Cross";
import Trash from "@/assets/icons/Trash";
import ProgressBar from "../../ProgressBar/ProgressBar";
import styles from "./progress-card.module.scss";
import clsx from "clsx";
import fallbackCover from "@/assets/cover.png";

export interface ProgressCardProps {
  title: string;
  coverId: string;
  href: string;
  value: number;
  max?: number;
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export default function ProgressCard({
  title,
  coverId,
  href,
  value,
  max,
  onDelete,
  className,
}: ProgressCardProps) {
  const coverUrl = useS3Image("covers", coverId, fallbackCover.src);

  return (
    <div className={clsx(styles.card, className)}>
      <a href={href}>
        <div className={styles.coverContainer}>
          <img src={coverUrl} alt={title} className={styles.cover} />
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          <ProgressBar type="chapter" value={value} max={max} />
        </div>
      </a>
      <button className={styles.deleteBtn} onClick={onDelete}>
        <Cross className={styles.cross} />
        <Trash className={styles.trash} />
      </button>
    </div>
  );
}
