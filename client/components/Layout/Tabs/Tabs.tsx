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
  activeIndex?: number;
  onTabChange?: (index: number) => void;
}

const Tabs = ({
  tabs,
  type = "default",
  activeIndex,
  onTabChange,
}: TabsProps) => {
  const isControlled =
    typeof activeIndex === "number" && typeof onTabChange === "function";
  const [internalIndex, setInternalIndex] = useState(0);
  const currentIndex = isControlled ? activeIndex! : internalIndex;

  const isProfile = type === "profile";

  const handleTabClick = (index: number) => {
    if (isControlled) {
      onTabChange!(index);
    } else {
      setInternalIndex(index);
    }
  };

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
              currentIndex === index ? styles.active : ""
            }`}
            onClick={() => handleTabClick(index)}
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
        {tabs[currentIndex].content}
      </div>
    </div>
  );
};

export default Tabs;
