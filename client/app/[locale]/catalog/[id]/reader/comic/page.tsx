"use client";

import { useSearchParams, useParams } from "next/navigation";
import ComicSwiper from "@/components/Reader/ComicReader/ComicSwiper";

export default function ReaderPage() {
  const searchParams = useSearchParams();
  const params = useParams();

  const chapter = Number(searchParams.get("chapter") ?? "1");
  const titleId = params.id as string;

  if (!titleId || isNaN(chapter)) return null;

  return <ComicSwiper titleId={titleId} initialChapter={chapter} />;
}
