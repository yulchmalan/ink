"use client";

import styles from "./genre-stats.module.scss";
import GenreTag from "./GenreTag";
import GenreProgressBar from "./GenreProgressBar";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useParams } from "next/navigation";

type LocalizedName = {
  en: string;
  ua: string;
  pl: string;
};

type RawGenre = {
  name: LocalizedName;
  count: number;
};

type DisplayGenre = {
  name: string;
  count: number;
  color: string;
};

const COLORS = [
  "#EF5555",
  "#F17A4F",
  "#F2A048",
  "#F4C542",
  "#C0D44F",
  "#9EC17C",
  "#7DAEA8",
  "#5B9BD5",
  "#505C8F",
];

export default function GenreStats() {
  const { id, locale } = useParams(); // <– отримуємо локаль з адресного рядка
  const currentLocale =
    typeof locale === "string" && ["en", "ua", "pl"].includes(locale)
      ? (locale as "en" | "ua" | "pl")
      : "ua";

  const listRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [genres, setGenres] = useState<RawGenre[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenreStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            query: `
              query GenreStats($userId: ObjectID!) {
                userGenreStats(userId: $userId) {
                  name {
                    en
                    ua
                    pl
                  }
                  count
                }
              }
            `,
            variables: { userId: id },
          }),
        });

        const json = await res.json();
        setGenres(json.data.userGenreStats || []);
      } catch (err) {
        console.error("Failed to load genre stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreStats();
  }, [id]);

  const sortedGenres = [...genres].sort((a, b) => b.count - a.count);
  const topGenres: DisplayGenre[] = sortedGenres
    .slice(0, 9)
    .map((genre, index) => ({
      name: genre.name[currentLocale],
      count: genre.count,
      color: COLORS[index] || "#ccc",
    }));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!listRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - listRef.current.offsetLeft;
    scrollLeft.current = listRef.current.scrollLeft;
  };

  const handleMouseLeave = () => (isDragging.current = false);
  const handleMouseUp = () => (isDragging.current = false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !listRef.current) return;
    e.preventDefault();
    const x = e.pageX - listRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    listRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScrollEdges = () => {
    const el = listRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const timeout = setTimeout(checkScrollEdges, 0);
    el.addEventListener("scroll", checkScrollEdges);

    return () => {
      clearTimeout(timeout);
      el.removeEventListener("scroll", checkScrollEdges);
    };
  }, [genres]);

  if (loading) return <p>Завантаження жанрової статистики...</p>;

  return (
    <div className={styles.genreStats}>
      {topGenres.length > 0 ? (
        <>
          <div className={styles.genreScrollWrapper}>
            <div
              className={clsx(styles.leftFade, {
                [styles.fadeVisible]: showLeft,
              })}
            />

            <div
              className={styles.genreList}
              ref={listRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onScroll={checkScrollEdges}
            >
              {topGenres.map((genre) => (
                <GenreTag
                  key={genre.name}
                  name={genre.name}
                  count={genre.count}
                  color={genre.color}
                />
              ))}
            </div>

            <div
              className={clsx(styles.rightFade, {
                [styles.fadeVisible]: showRight,
              })}
            />
          </div>
          <GenreProgressBar genres={topGenres} />
        </>
      ) : (
        <div className={styles.emptyBar}>
          <div className={styles.progressBar}>
            <div
              className={styles.segment}
              style={{
                width: "100%",
                backgroundColor: "#eee",
                opacity: 0.5,
              }}
            />
          </div>
          <p className={styles.noData}>Немає даних для відображення жанрів</p>
        </div>
      )}
    </div>
  );
}
