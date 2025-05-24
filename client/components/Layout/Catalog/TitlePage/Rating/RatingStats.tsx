"use client";

import styles from "./rating.module.scss";
import Rating from "@/components/UI/Rating/Rating";
import ProgressBar from "@/components/UI/ProgressBar/ProgressBar";
import React, { useEffect, useState } from "react";
import { GET_TITLE_RATINGS } from "@/graphql/queries/getTitleRatings";
import StarFull from "@/assets/icons/StarFull";

type Props = {
  titleId: string;
};

export default function RatingStats({ titleId }: Props) {
  const [stats, setStats] = useState<Record<number, number>>({});
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState<number | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
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

        const ratings: number[] = [];

        for (const user of users) {
          for (const list of user.lists ?? []) {
            for (const item of list.titles ?? []) {
              if (item?.title?.id === titleId && item.rating > 0) {
                const stars = Math.round((item.rating / 2) * 2) / 2;
                ratings.push(stars);
              }
            }
          }
        }

        const ratingMap: Record<number, number> = {
          5: 0,
          4.5: 0,
          4: 0,
          3.5: 0,
          3: 0,
          2.5: 0,
          2: 0,
          1.5: 0,
          1: 0,
          0.5: 0,
        };

        ratings.forEach((s) => {
          if (ratingMap[s] !== undefined) ratingMap[s]++;
        });

        const totalCount = ratings.length;
        const weightedSum = ratings.reduce((sum, r) => sum + r, 0);

        setStats(ratingMap);
        setTotal(totalCount);
        setAverage(totalCount ? +(weightedSum / totalCount).toFixed(1) : null);
      } catch (error) {
        console.error("Error fetching rating stats:", error);
      }
    };

    fetchRatings();
  }, [titleId]);

  const getBarColor = (stars: number) => {
    const percent = (stars - 0.5) / (5 - 0.5);
    const r = Math.round(255 - percent * 155);
    const g = Math.round(100 + percent * 155);
    return `rgb(${r}, ${g}, 100)`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Оцінки користувачів</h2>
        <div className={styles.avg}>
          <span className={styles.avgScore}>
            <StarFull width={18} height={18} />
            {average !== null ? average.toFixed(1) : "0"}
          </span>
          <span className={styles.total}>({total})</span>
        </div>
      </div>

      <div className={styles.grid}>
        {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5].map((stars) => {
          const count = stats[stars] || 0;
          const percent = total ? (count / total) * 100 : 0;

          return (
            <React.Fragment key={stars}>
              <Rating value={stars} size={18} />
              <ProgressBar value={percent} color={getBarColor(stars)} />
              <span className={styles.value}>{Math.round(percent)}%</span>
              <span className={styles.count}>{count}</span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
