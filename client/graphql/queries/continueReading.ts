import { jwtDecode } from "jwt-decode";
import { ProgressCardProps } from "@/components/UI/Cards/ProgressCard/ProgressCard";

type Locale = "uk" | "en" | "pl";

interface DecodedToken {
  userId: string;
}

interface Title {
  id: string;
  name: string;
  alt_names?: { lang: string; value: string }[];
  chapterCount: number | null;
}

interface SavedTitle {
  progress: number;
  last_open: string;
  title: Title;
}

interface UserList {
  name: string;
  titles: SavedTitle[];
}

export const continueReading = async (): Promise<ProgressCardProps[]> => {
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
    },
    body: JSON.stringify({
      query: `
        query GetContinueReading($userId: ObjectID!) {
          user(id: $userId) {
            lists {
              name
              titles {
                progress
                last_open
                title {
                  id
                  name
                  alt_names {
                    lang
                    value
                  }
                  chapterCount
                }
              }
            }
          }
        }
      `,
      variables: { userId },
    }),
    cache: "no-store",
  });

  const json = await res.json();
  const lists: UserList[] = json?.data?.user?.lists ?? [];

  const titles = lists
    .flatMap((l) => l.titles)
    .filter((t) => t.progress > 0 && t.last_open && t.title)
    .sort((a, b) => new Date(b.last_open).getTime() - new Date(a.last_open).getTime())
    .slice(0, 4);

  return titles.map((t): ProgressCardProps => {
    const alt = t.title.alt_names?.find((n) => n.lang === locale)?.value;
    return {
      titleId: t.title.id,
      title: alt || t.title.name,
      coverId: t.title.id,
      href: `/catalog/${t.title.id}`,
      value: t.progress,
      max: t.title.chapterCount ?? undefined, 
    };
  });
};
