import React from "react";
import styles from "./grid.module.scss";
import clsx from "clsx";

type SidebarLayoutProps = {
  sidebar: React.ReactNode;
  topRight: React.ReactNode;
  bottomRight: React.ReactNode;
  className?: string;
};

export default function SidebarLayout({
  sidebar,
  topRight,
  bottomRight,
  className,
}: SidebarLayoutProps) {
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
