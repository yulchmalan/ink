"use client";

import React from "react";
import styles from "./progress-bar.module.scss";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";

type ProgressBarProps = {
  value: number;
  max?: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max }) => {
  const isChapter = typeof max === "number";
  const effectiveMax = isChapter ? max || 1 : 100;
  const progress = Math.min((value / effectiveMax) * 100, 100);
  const localActive = useLocale();
  const t = useTranslations("UI");

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        {isChapter
          ? `${t("chapter")} ${value}/${effectiveMax}`
          : `${Math.round(progress)}%`}
      </div>
      <div className={styles.barBackground}>
        <div className={styles.barFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ProgressBar;
