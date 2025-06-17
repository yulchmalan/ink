"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./chapter-reader.module.scss";
import { useAuth } from "@/contexts/AuthContext";
import Button from "../UI/Buttons/StandartButton/Button";
import ChevronLeft from "@/assets/icons/ChevronLeft";
import ChevronRight from "@/assets/icons/ChevronRight";
import { useProgressAndExp } from "@/hooks/useProgressAndExp";

interface Props {
  titleId: string;
  totalChapters: number;
  initialChapter?: number;
}

export default function ChapterReader({
  titleId,
  totalChapters,
  initialChapter,
}: Props) {
  const [currentChapter, setCurrentChapter] = useState<number>(
    initialChapter ?? 1
  );
  const [html, setHtml] = useState("");

  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id;

  const { updateProgress } = useProgressAndExp({
    userId: currentUserId ?? "",
    titleId,
  });

  const router = useRouter();

  const BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET!;
  const REGION = process.env.NEXT_PUBLIC_S3_REGION!;
  const BASE_URL = `https://${BUCKET}.s3.${REGION}.amazonaws.com`;

  useEffect(() => {
    const fetchChapter = async () => {
      const url = `${BASE_URL}/titles/${titleId}/chapter_${currentChapter}.html?cb=${Date.now()}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const text = await res.text();

        const formatHtml = (raw: string) => {
          return raw
            .split(/\n{2,}/)
            .map((p) => `<p>${p.trim()}</p>`)
            .join("\n");
        };

        setHtml(formatHtml(text));
      } catch (err) {
        console.warn("Розділ не знайдено:", err);
        setHtml(
          `<p style="color:red">Цей розділ недоступний або був видалений.</p>`
        );
      }
    };

    fetchChapter();
  }, [titleId, currentChapter]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.replace(`?c=${currentChapter}`, { scroll: false });
  }, [currentChapter]);

  useEffect(() => {
    if (currentUserId) updateProgress(currentChapter);
  }, [currentUserId, titleId]);

  useEffect(() => {
    if (currentUserId) updateProgress(currentChapter);
  }, [currentChapter]);

  const goToNext = () => {
    const next = Math.min(totalChapters, currentChapter + 1);
    setCurrentChapter(next);
  };

  const goToPrev = () => {
    const prev = Math.max(1, currentChapter - 1);
    setCurrentChapter(prev);
  };

  return (
    <div className={styles.reader}>
      <div className={styles.nav}>
        <Button
          onClick={() => router.push(`/catalog/${titleId}`)}
          className={styles.fullwidth}
        >
          Повернутися
        </Button>
        <Button onClick={goToPrev} disabled={currentChapter === 1}>
          <ChevronLeft />
        </Button>
        <h1>Глава {currentChapter}</h1>
        <Button onClick={goToNext} disabled={currentChapter === totalChapters}>
          <ChevronRight />
        </Button>
      </div>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className={styles.nav}>
        <Button onClick={goToPrev} disabled={currentChapter === 1}>
          <ChevronLeft />
        </Button>
        <h1>Глава {currentChapter}</h1>
        <Button onClick={goToNext} disabled={currentChapter === totalChapters}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
