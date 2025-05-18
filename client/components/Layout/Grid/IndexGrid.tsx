import React from "react";
import styles from "./grid.module.scss";
import clsx from "clsx";

type IndexGridProps = {
  sidebar: React.ReactNode;
  topRight: React.ReactNode;
  bottomRight: React.ReactNode;
  className?: string;
};

export default function IndexGrid({
  sidebar,
  topRight,
  bottomRight,
  className,
}: IndexGridProps) {
  return (
    <div className={clsx(styles.layout, className)}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <div className={styles.right}>
        <section className={styles.topRight}>{topRight}</section>
        <section className={styles.bottomRight}>{bottomRight}</section>
      </div>
    </div>
  );
}
