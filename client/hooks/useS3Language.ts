import { useEffect, useState } from "react";

const SUPPORTED_LANGUAGES = ["uk", "en", "pl"];

export const useS3Language = (titleId: string): string | null => {
  const [language, setLanguage] = useState<string | null>(null);

  useEffect(() => {
    if (!titleId) return;

    const base = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/titles/${titleId}/`;

    const checkNext = async (index: number) => {
      if (index >= SUPPORTED_LANGUAGES.length) {
        setLanguage(null);
        return;
      }

      const lang = SUPPORTED_LANGUAGES[index];
      const testUrl = `${base}${lang}/`;
      try {
        const res = await fetch(`${testUrl}1/1.webp`, { method: "HEAD" });
        if (res.ok) {
          setLanguage(lang);
        } else {
          checkNext(index + 1);
        }
      } catch {
        checkNext(index + 1);
      }
    };

    checkNext(0);
  }, [titleId]);

  return language;
};
