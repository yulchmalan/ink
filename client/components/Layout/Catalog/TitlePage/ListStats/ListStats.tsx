"use client";

import styles from "./list-stats.module.scss";
import ProgressBar from "@/components/UI/ProgressBar/ProgressBar";
import React, { useEffect, useState } from "react";
import { GET_TITLE_RATINGS } from "@/graphql/queries/getTitleRatings";
import { useTranslations } from "use-intl";

type Props = {
  titleId: string;
};

const LIST_KEYS = ["reading", "planned", "completed", "dropped", "favorite"];

export default function ListStats({ titleId }: Props) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const t = useTranslations("UI");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            query: GET_TITLE_RATINGS,
          }),
          cache: "no-store",
        });

        const json = await res.json();
        const users = json.data?.users;

        if (!users) return;

        const listMap: Record<string, number> = {
          reading: 0,
          planned: 0,
          completed: 0,
          dropped: 0,
          favorite: 0,
        };

        users.forEach((user: any) => {
          user.lists?.forEach((list: any) => {
            const name = list.name;
            const containsTitle = list.titles?.some(
              (t: any) => t.title?.id === titleId
            );
            if (containsTitle && listMap[name] !== undefined) {
              listMap[name]++;
            }
          });
        });

        const sum = Object.values(listMap).reduce((a, b) => a + b, 0);
        setCounts(listMap);
        setTotal(sum);
      } catch (error) {
        console.error("Error fetching list stats:", error);
      }
    };

    fetchData();
  }, [titleId]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {t("inLists")}{" "}
        {total > 0 && <span className={styles.total}>{total}</span>}
      </h2>

      <div className={styles.grid}>
        {LIST_KEYS.map((key) => {
          const count = counts[key] || 0;
          const percent = total ? (count / total) * 100 : 0;

          return (
            <React.Fragment key={key}>
              <span className={styles.label}>{t(key)}</span>
              <ProgressBar value={percent} />
              <span className={styles.percent}>{Math.round(percent)}%</span>
              <span className={styles.count}>{count}</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
