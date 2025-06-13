"use client";

import styles from "./review-card.module.scss";
import Tag from "../../Tag/Tag";
import clsx from "clsx";
import Rating from "../../Rating/Rating";
import { useCommentsCount } from "@/hooks/useCommentCount";

interface CollectionCardProps {
  id: string;
  title: string;
  body: string;
  views: number;
  rating: number;
  likes: string;
  coverUrl: string;
  className?: string;
}

export default function CollectionCard({
  id,
  title,
  body,
  views,
  rating,
  likes,
  coverUrl,
  className,
}: CollectionCardProps) {
  const commentsCount = useCommentsCount(id);

  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.coverContainer}>
        <img src={coverUrl} alt={title} className={styles.cover} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        {rating > 0 && <Rating readOnly={true} value={rating} />}
        <p className={styles.reviewBody}>{body}</p>
        <div className={styles.tags}>
          <Tag type="views" value={views} />
          <Tag type="likes" value={likes} />
          {commentsCount !== undefined && (
            <Tag type="comments" value={commentsCount} />
          )}
        </div>
      </div>
    </div>
  );
}
