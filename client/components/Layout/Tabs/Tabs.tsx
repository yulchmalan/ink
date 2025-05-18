"use client";

import { useState } from "react";
import clsx from "clsx";
import styles from "./tabs.module.scss";

interface TabData {
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabData[];
  type?: "default" | "profile";
}

const Tabs = ({ tabs, type = "default" }: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const isProfile = type === "profile";

  return (
    <div
      className={clsx(styles.container, {
        [styles.profile]: isProfile,
      })}
    >
      <div
        className={clsx(styles.tabHeader, {
          [styles.profile]: isProfile,
        })}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tab} ${
              activeIndex === index ? styles.active : ""
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div
        className={clsx(styles.tabContent, {
          [styles.profile]: isProfile,
        })}
      >
        {tabs[activeIndex].content}
      </div>
    </div>
  );
};

export default Tabs;
