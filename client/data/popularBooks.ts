import { BookCardProps } from "@/components/UI/Cards/BookCard/BookCard";

export const popularBooks = async (): Promise<BookCardProps[]> => {
  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1] || "uk"
      : "uk"; 

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      query: `
        query GetPopularTitles {
          popularTitles(limit: 15) {
            id
            name
            type
            genres {
              name {
                uk
                en
                pl
              }
            }
          }
        }
      `,
    }),
    cache: "no-store",
  });

  const { data } = await res.json();

  const typeMap: Record<string, Record<string, string>> = {
    NOVEL: { uk: "Новела", en: "Novel", pl: "Powieść" },
    COMIC: { uk: "Комікс", en: "Comic", pl: "Komiks" },
  };

  return (
    data?.popularTitles?.map((t: any): BookCardProps => {
      const typeName = typeMap[t.type]?.[locale] ?? "";
      const genreName = t.genres?.[0]?.name?.[locale] ?? "";

      return {
        title: t.name,
        desc: [typeName, genreName].filter(Boolean).join(" – "),
        coverId: t.id,
        href: `/catalog/${t.id}`,
        size: "large",
      };
    }) ?? []
  );
};
