"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../chapter-reader.module.scss";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import ChevronRight from "@/assets/icons/ChevronRight";
import ChevronLeft from "@/assets/icons/ChevronLeft";
import { useAuth } from "@/contexts/AuthContext";
import { useProgressAndExp } from "@/hooks/useProgressAndExp";

interface Props {
  titleId: string;
  totalChapters: number;
  initialChapter?: number;
}

export default function ComicReader({
  titleId,
  totalChapters,
  initialChapter = 1,
}: Props) {
  const [currentChapter, setCurrentChapter] = useState(initialChapter);
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id;

  const { updateProgress } = useProgressAndExp({
    userId: currentUserId ?? "",
    titleId,
  });

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

  const handleOpen = () => {
    router.push(`/catalog/${titleId}/reader/comic?chapter=${currentChapter}`);
  };

  return (
    <div className={styles.reader}>
      <div className={styles.nav}>
        <Button
          variant="secondary"
          onClick={goToPrev}
          disabled={currentChapter === 1}
        >
          <ChevronLeft />
          Попередній
        </Button>
        <h1>Розділ {currentChapter}</h1>
        <Button
          variant="secondary"
          onClick={goToNext}
          disabled={currentChapter === totalChapters}
        >
          Наступний <ChevronRight />
        </Button>
      </div>
      <Button onClick={handleOpen} className={styles.startButton}>
        Читати розділ
      </Button>
    </div>
  );
}
