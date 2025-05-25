"use client";

import { useState, useEffect } from "react";
import styles from "./chapter-reader.module.scss";

interface Props {
  titleId: string;
  totalChapters: number;
}

export default function ChapterReader({ titleId, totalChapters }: Props) {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [html, setHtml] = useState("");

  const BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET!;
  const REGION = process.env.NEXT_PUBLIC_S3_REGION!;
  const BASE_URL = `https://${BUCKET}.s3.${REGION}.amazonaws.com`;

  useEffect(() => {
    const fetchChapter = async () => {
      const url = `${BASE_URL}/titles/${titleId}/chapter_${currentChapter}.html`;
      const res = await fetch(url);
      const text = await res.text();
      setHtml(text);
    };

    fetchChapter();
  }, [titleId, currentChapter]);

  return (
    <div className={styles.reader}>
      <div className={styles.nav}>
        <button
          onClick={() => setCurrentChapter((prev) => Math.max(1, prev - 1))}
          disabled={currentChapter === 1}
        >
          ← Попередня
        </button>
        <span>Глава {currentChapter}</span>
        <button
          onClick={() =>
            setCurrentChapter((prev) => Math.min(totalChapters, prev + 1))
          }
          disabled={currentChapter === totalChapters}
        >
          Наступна →
        </button>
      </div>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
