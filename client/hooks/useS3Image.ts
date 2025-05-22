import { useEffect, useState } from "react";

const SUPPORTED_EXTENSIONS = ["webp", "png", "jpg", "jpeg"];

export const useS3Image = (
  folder: "covers" | "banners" | "avatars",
  id: string,
  fallback: string
) => {
  const [url, setUrl] = useState<string | null>(null); 

  useEffect(() => {
    if (!id) return;

    const base = `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${folder}/`;

    let isFound = false;

    const tryNext = async (index: number) => {
      if (index >= SUPPORTED_EXTENSIONS.length) {
        setUrl(fallback); 
        return;
      }

      const ext = SUPPORTED_EXTENSIONS[index];
      const full = `${base}${id}.${ext}?cb=${Date.now()}`;
      const img = new Image();
      img.src = full;

      img.onload = () => {
        if (!isFound) {
          isFound = true;
          setUrl(full);
        }
      };

      img.onerror = () => {
        tryNext(index + 1);
      };
    };

    tryNext(0);
  }, [id, folder, fallback]);

  return url ?? fallback;
};
