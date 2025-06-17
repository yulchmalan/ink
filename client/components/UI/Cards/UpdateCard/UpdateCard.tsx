import Cross from "@/assets/icons/Cross";
import ProgressBar from "../../ProgressBar/ProgressBar";
import styles from "./update-card.module.scss";
import clsx from "clsx";
import Trash from "@/assets/icons/Trash";
import Bookmark from "@/assets/icons/Bookmark";
import Eye from "@/assets/icons/Eye";
import Heart from "@/assets/icons/Heart";

export interface UpdateCardProps {
  title: string;
  desc: string;
  coverUrl: string;
  href: string;
  className?: string;
  rating: number | null;
  saves: number;
}

export default function UpdateCard({
  title,
  coverUrl,
  href,
  desc,
  className,
  rating,
  saves,
}: UpdateCardProps) {
  const formatCount = (num: number) => {
    return num >= 1000
      ? (num / 1000).toFixed(1).replace(/\.0$/, "") + "К"
      : num.toString();
  };
  return (
    <a href={href} className={clsx(styles.card, className)}>
      <div className={styles.coverContainer}>
        <img src={coverUrl} alt={title} className={styles.cover} />
      </div>
      <div className={styles.info}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.desc}>{desc}</p>
        </div>
        <div className={styles.bottomInfo}>
          <div>
            <Heart />
            <p>{rating !== null ? rating.toFixed(1) : "0"}</p>
          </div>
          <div>
            <Bookmark />
            <p>{saves}</p>
          </div>
        </div>
      </div>
    </a>
  );
}
