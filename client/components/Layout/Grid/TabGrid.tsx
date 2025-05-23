"use client";

import React, { useState, useEffect } from "react";
import styles from "./grid.module.scss";
import Cross from "@/assets/icons/Cross";
import Settings from "@/assets/icons/Settings";

interface Props {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export default function TabGrid({ sidebar, children }: Props) {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsActive(false);
    }
  }, []);

  const handleClose = () => setIsActive(false);
  const handleOpen = () => setIsActive(!isActive);

  return (
    <div className={styles.tabGrid}>
      {sidebar && (
        <aside
          className={`${styles.tabGridSidebar} ${
            isActive ? styles.active : ""
          }`}
        >
          {sidebar}
          <button className={styles.closeBtn} onClick={handleClose}>
            <Cross />
          </button>
        </aside>
      )}
      <div className={styles.tabGridMain}>
        {children}
        <button className={styles.openBtn} onClick={handleOpen}>
          <Settings />
        </button>
      </div>
    </div>
  );
}
