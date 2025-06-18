import { BookCardProps } from "@/components/UI/Cards/BookCard/BookCard";
import { jwtDecode } from "jwt-decode";

type TitleType = "NOVEL" | "COMIC";
type Locale = "uk" | "en" | "pl";

interface RecommendedTitle {
  id: string;
  name: string;
  alt_names?: { lang: string; value: string }[];
  type: TitleType;
  genres: {
    name: Record<Locale, string>;
  }[];
}

type DecodedToken = {
  userId: string;
};

export const recommendedBooks = async (): Promise<BookCardProps[]> => {
  const locale: Locale =
    typeof window !== "undefined"
      ? (window.location.pathname.split("/")[1] as Locale) || "uk"
      : "uk";

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return [];

  const decoded = jwtDecode<DecodedToken>(token);
  const userId = decoded.userId;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        query RecommendedTitles($userId: ObjectID!) {
          recommendedTitles(userId: $userId) {
            id
            name
            alt_names {
              lang
              value
            }
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
      variables: { userId },
    }),
    cache: "no-store",
  });

  const { data } = await res.json();

  const typeMap: Record<"NOVEL" | "COMIC", Record<Locale, string>> = {
    NOVEL: { uk: "Новела", en: "Novel", pl: "Powieść" },
    COMIC: { uk: "Комікс", en: "Comic", pl: "Komiks" },
  };

  return (
    data?.recommendedTitles?.map((t: RecommendedTitle): BookCardProps => {
      const localizedName =
        t.alt_names?.find((n) => n.lang === locale)?.value || t.name;
      const typeName = typeMap[t.type][locale];
      const genreName = t.genres?.[0]?.name[locale] ?? "";

      return {
        title: localizedName,
        desc: [typeName, genreName].filter(Boolean).join(" – "),
        coverId: t.id,
        href: `/catalog/${t.id}`,
        size: "large",
      };
    }) ?? []
  );
}
