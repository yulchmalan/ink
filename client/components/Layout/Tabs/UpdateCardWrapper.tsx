"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import UpdateCard from "@/components/UI/Cards/UpdateCard/UpdateCard";
import { useS3Image } from "@/hooks/useS3Image";
import { useLocalizedName } from "@/hooks/useLocalizedName"; // підкоригуй шлях при потребі
import fallbackCover from "@/assets/cover.png";

const UpdateCardWrapper = ({ t }: { t: any }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [saves, setSaves] = useState<number>(0);
  const locale = useLocale();
  const coverUrl = useS3Image("covers", t.id, fallbackCover.src);

  const localizedName = useLocalizedName(t.name, t.alt_names);

  const typeMap: Record<string, Record<string, string>> = {
    NOVEL: { uk: "Роман", en: "Novel", pl: "Powieść" },
    COMIC: { uk: "Комікс", en: "Comic", pl: "Komiks" },
  };

  const type = typeMap[t.type]?.[locale] ?? "";
  const genre = t.genres?.[0]?.name?.[locale] ?? "";

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
            query {
              users {
                lists {
                  name
                  titles {
                    rating
                    title {
                      id
                    }
                  }
                }
              }
            }
          `,
        }),
        cache: "no-store",
      });

      const json = await res.json();
      const users = json.data?.users ?? [];

      let ratings: number[] = [];
      let savesCount = 0;

      users.forEach((user: any) => {
        user.lists?.forEach((list: any) => {
          const match = list.titles?.find((i: any) => i.title?.id === t.id);
          if (match) {
            savesCount++;
            if (match.rating > 0)
              ratings.push(Math.round((match.rating / 2) * 2) / 2);
          }
        });
      });

      const avg = ratings.length
        ? +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : null;

      setRating(avg);
      setSaves(savesCount);
    };

    fetchStats();
  }, [t.id]);

  return (
    <UpdateCard
      href={`/catalog/${t.id}`}
      title={localizedName}
      desc={[type, genre].filter(Boolean).join(" – ")}
      coverUrl={coverUrl}
      rating={rating}
      saves={saves}
    />
  );
};

export default UpdateCardWrapper;
