"use client";

import styles from "./review-card.module.scss";
import Tag from "../../Tag/Tag";
import clsx from "clsx";
import Rating from "../../Rating/Rating";
import { useCommentsCount } from "@/hooks/useCommentCount";
import { useS3Image } from "@/hooks/useS3Image";
import fallbackCover from "@/assets/cover.png";

interface ReviewCardProps {
  id: string;
  titleId?: string;
  title: string;
  body: string;
  views: number;
  rating: number;
  likes: string;
  coverUrl?: string;
  className?: string;
}

export default function ReviewCard({
  id,
  titleId,
  title,
  body,
  views,
  rating,
  likes,
  coverUrl,
  className,
}: ReviewCardProps) {
  const commentsCount = useCommentsCount(id);

  const resolvedCover =
    coverUrl ||
    (titleId
      ? useS3Image("covers", titleId, fallbackCover.src)
      : fallbackCover.src);

  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.coverContainer}>
        <img src={resolvedCover} alt={title} className={styles.cover} />
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
