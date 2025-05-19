import styles from "./stats.module.scss";

interface StatTagProps {
  value: number | string;
  label: string;
}

export default function StatTag({ value, label }: StatTagProps) {
  return (
    <div className={styles.statTag}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
