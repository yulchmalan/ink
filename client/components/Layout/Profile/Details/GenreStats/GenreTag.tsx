import styles from "./genre-stats.module.scss";

interface GenreTagProps {
  name: string;
  count: number;
  color: string;
}

export default function GenreTag({ name, count, color }: GenreTagProps) {
  return (
    <div className={styles.genreTag}>
      <span style={{ backgroundColor: color }} className={styles.label}>
        {name}
      </span>
      <span className={styles.count}>{count}</span>
    </div>
  );
}
