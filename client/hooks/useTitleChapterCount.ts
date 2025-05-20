import { useEffect, useState } from "react";

export const useTitleChapterCount = (
  titleId: string,
  type: "COMIC" | "NOVEL"
) => {
  const [chapterCount, setChapterCount] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      const base = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/titles/${titleId}/`;

      if (type === "NOVEL") {
        setChapterCount(100); 
        return;
      }

      let count = 0;
      let tryNext = true;

      while (tryNext) {
        const testUrl = `${base}${count + 1}/1.webp`;
        const img = new Image();
        img.src = testUrl;

        await new Promise((resolve) => {
          img.onload = () => {
            count += 1;
            resolve(true);
          };
          img.onerror = () => {
            tryNext = false;
            resolve(false);
          };
        });
      }

      setChapterCount(count);
    };

    fetchChapters().catch(() => setError(true));
  }, [titleId, type]);

  return { chapterCount, error };
};
