"use client";

import styles from "./level-progress.module.scss";
import { useTranslations } from "use-intl";

type LevelProgressProps = {
  totalExp: number;
};

function getLevelFromExp(exp: number) {
  let level = 0;
  let expToReachLevel = 0;

  while (true) {
    const nextLevelExp = 25 * Math.pow(level + 1, 2);
    if (exp < nextLevelExp) break;
    expToReachLevel = nextLevelExp;
    level++;
  }

  const nextExp = 25 * Math.pow(level + 1, 2);
  const currentProgress = exp - expToReachLevel;
  const expToNext = nextExp - expToReachLevel;

  return {
    level,
    currentProgress,
    expToNext,
  };
}

export default function LevelProgress({ totalExp }: LevelProgressProps) {
  const t = useTranslations("UI");
  const { level, currentProgress, expToNext } = getLevelFromExp(totalExp);
  const progressPercent = (currentProgress / expToNext) * 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <span className={styles.level}>
          {t("level")} {level}
        </span>
        <span className={styles.untilNext}>
          {t("untilNext")} {expToNext - currentProgress}
        </span>
      </div>

      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${progressPercent}%` }} />
      </div>

      <div className={styles.total}>
        {t("totalExp")} {totalExp}
      </div>
    </div>
  );
}
