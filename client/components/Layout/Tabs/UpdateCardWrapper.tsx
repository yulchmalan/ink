import { useEffect, useState } from "react";
import UpdateCard from "@/components/UI/Cards/UpdateCard/UpdateCard";
import { useS3Image } from "@/hooks/useS3Image";
import fallbackCover from "@/assets/cover.png";

const UpdateCardWrapper = ({ t }: { t: any }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [saves, setSaves] = useState<number>(0);
  const coverUrl = useS3Image("covers", t.id, fallbackCover.src);

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
      title={t.name}
      desc={`${t.type === "NOVEL" ? "Роман" : "Комікс"} – ${
        t.genres?.[0]?.name.uk ?? ""
      }`}
      coverUrl={coverUrl}
      rating={rating}
      saves={saves}
    />
  );
};

export default UpdateCardWrapper;
