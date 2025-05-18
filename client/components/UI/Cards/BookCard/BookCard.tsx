import styles from "./book-card.module.scss";
import clsx from "clsx";

export interface BookCardProps {
  title: string;
  desc: string;
  coverUrl: string;
  href: string;
  size?: "large" | "small";
}

export default function BookCard({
  title,
  desc,
  coverUrl,
  href,
  size = "small",
}: BookCardProps) {
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
