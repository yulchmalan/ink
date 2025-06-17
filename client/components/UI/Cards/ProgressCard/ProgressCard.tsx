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
  titleId: string;
  coverId: string;
  href: string;
  value: number;
  max?: number;
  onDelete?: (titleId: string) => void;
  className?: string;
}

export default function ProgressCard({
  title,
  titleId,
  coverId,
  href,
  value,
  max,
  onDelete,
  className,
}: ProgressCardProps) {
  const coverUrl = useS3Image("covers", coverId, fallbackCover.src);

  async function resetProgress(userId: string, titleId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `
        mutation resetProgress($userId: ObjectID!, $titleId: ObjectID!) {
      updateUser(id: $userId, edits: {
        lists: [
          { name: "reading", titles: [{ title: $titleId, progress: 0 }] },
          { name: "planned", titles: [{ title: $titleId, progress: 0 }] },
          { name: "completed", titles: [{ title: $titleId, progress: 0 }] },
          { name: "dropped", titles: [{ title: $titleId, progress: 0 }] },
          { name: "favorite", titles: [{ title: $titleId, progress: 0 }] }
        ]
      }) {
        _id
      }
    }
      `,
        variables: { userId, titleId },
      }),
    });

    const { data } = await res.json();
    return data?.updateUser;
  }

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
      <button className={styles.deleteBtn} onClick={() => onDelete?.(titleId)}>
        <Cross className={styles.cross} />
        <Trash className={styles.trash} />
      </button>
    </div>
  );
}
