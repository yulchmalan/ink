"use client";

import React from "react";
import styles from "./progress-bar.module.scss";
import { useTranslations } from "use-intl";

type ProgressBarProps = {
  value: number;
  max?: number;
  type?: "chapter";
  color?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  type,
  color,
}) => {
  const t = useTranslations("UI");

  const effectiveMax = typeof max === "number" ? max || 1 : 100;
  const progress = Math.min((value / effectiveMax) * 100, 100);

  return (
    <div className={styles.container}>
      {type === "chapter" && (
        <div className={styles.text}>
          {`${t("chapter")} ${value}/${effectiveMax}`}
        </div>
      )}
      <div className={styles.barBackground}>
        <div
          className={styles.barFill}
          style={{
            width: `${progress}%`,
            backgroundColor: color || undefined,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
