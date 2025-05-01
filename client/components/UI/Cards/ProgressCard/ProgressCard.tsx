import Cross from "@/assets/icons/Cross";
import ProgressBar from "../../ProgressBar/ProgressBar";
import styles from "./progress-card.module.scss";
import clsx from "clsx";
import Trash from "@/assets/icons/Trash";

export interface ProgressCardProps {
  title: string;
  coverUrl: string;
  href: string;
  value: number;
  max?: number;
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export default function ProgressCard({
  title,
  coverUrl,
  href,
  value,
  max,
  onDelete,
  className,
}: ProgressCardProps) {
  return (
    <div className={clsx(styles.card, className)}>
      <a href={href}>
        <div className={styles.coverContainer}>
          <img src={coverUrl} alt={title} className={styles.cover} />
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          <ProgressBar value={value} max={max} />
        </div>
      </a>
      <button className={styles.deleteBtn} onClick={onDelete}>
        <Cross className={styles.cross} />
        <Trash className={styles.trash} />
      </button>
    </div>
  );
}
