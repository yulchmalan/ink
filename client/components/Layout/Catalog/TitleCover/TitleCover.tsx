"use client";

import { useS3Image } from "@/hooks/useS3Image";
import fallback from "@/assets/cover.png";

interface Props {
  id: string;
  name: string;
  className?: string;
}

export default function TitleCover({ id, name, className }: Props) {
  const url = useS3Image("covers", id, fallback.src);

  return (
    <div className={className}>
      <img src={url} alt={name} />
    </div>
  );
}
