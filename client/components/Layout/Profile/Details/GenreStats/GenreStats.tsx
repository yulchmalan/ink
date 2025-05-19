"use client";

import styles from "./genre-stats.module.scss";
import GenreTag from "./GenreTag";
import GenreProgressBar from "./GenreProgressBar";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const rawGenres = [
  { name: "Комедія", count: 7 },
  { name: "Драма", count: 30 },
  { name: "Містика", count: 5 },
  { name: "Романтика", count: 9 },
  { name: "Кримінал", count: 16 },
  { name: "Трилер", count: 25 },
  { name: "Шьоджьо", count: 4 },
  { name: "Надприродне", count: 3 },
  { name: "Детектив", count: 1 },
  { name: "Фантастика", count: 2 },
];

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
  const listRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!listRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - listRef.current.offsetLeft;
    scrollLeft.current = listRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !listRef.current) return;
    e.preventDefault();
    const x = e.pageX - listRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    listRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const sortedGenres = [...rawGenres].sort((a, b) => b.count - a.count);
  const topGenres = sortedGenres.slice(0, 9).map((genre, index) => ({
    ...genre,
    color: COLORS[index] || "#ccc",
  }));

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScrollEdges = () => {
    const el = listRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      checkScrollEdges();
    }, 0);

    const el = listRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollEdges);
      return () => {
        clearTimeout(timeout);
        el.removeEventListener("scroll", checkScrollEdges);
      };
    }
  }, []);

  return (
    <div className={styles.genreStats}>
      <div className={styles.genreScrollWrapper}>
        <div
          className={clsx(styles.leftFade, { [styles.fadeVisible]: showLeft })}
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
            <GenreTag key={genre.name} {...genre} />
          ))}
        </div>
        <div
          className={clsx(styles.rightFade, {
            [styles.fadeVisible]: showRight,
          })}
        />
      </div>
      <GenreProgressBar genres={topGenres} />
    </div>
  );
}
