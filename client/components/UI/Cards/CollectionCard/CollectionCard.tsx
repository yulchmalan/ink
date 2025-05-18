import styles from "./collection-card.module.scss";
import Tag from "../../Tag/Tag";
import clsx from "clsx";

interface CollectionCardProps {
  title: string;
  views: number;
  itemsCount: number;
  bookmarks: number;
  likes: string;
  covers?: string[];
  className?: string;
}

export default function CollectionCard({
  title,
  views,
  itemsCount,
  bookmarks,
  likes,
  covers = [],
  className,
}: CollectionCardProps) {
  const emptyCovers = 3 - covers.length;

  return (
    <div className={clsx(styles.card, className)}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.tags}>
        <Tag type="views" value={views} />
        <Tag type="layers" value={itemsCount} />
        <Tag type="bookmarks" value={bookmarks} />
        <Tag type="likes" value={likes} />
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
