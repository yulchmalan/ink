"use client";

import styles from "./grid.module.scss";
import Cross from "@/assets/icons/Cross";
import Settings from "@/assets/icons/Settings";

interface Props {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export default function TabGrid({ sidebar, children }: Props) {
  return (
    <div className={styles.titleGrid}>
      {sidebar && <aside className={styles.titleGridSidebar}>{sidebar}</aside>}
      <div className={styles.titleGridMain}>{children}</div>
    </div>
  );
}
