import Container from "@/components/Layout/Container/Container";
import ChapterReader from "@/components/Reader/ChapterReader";
import ComicReader from "@/components/Reader/ComicReader/ComicReader";

export async function generateMetadata({ params, searchParams }: any) {
  const p = await params;
  const sp = await searchParams;
  const titleId = p.id;
  const locale = p.locale;
  const chapter = Number(sp?.c ?? 1);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      query: `
        query GetTitle($id: ObjectID!) {
          getTitle(id: $id) {
            name
            alt_names {
              lang
              value
            }
            type
          }
        }
      `,
      variables: { id: titleId },
    }),
    cache: "no-store",
  });

  const title = res.ok ? (await res.json())?.data?.getTitle : null;
  if (!title) return { title: "Читання | Ink" };

  const localized =
    title.alt_names?.find((alt: any) => alt.lang === locale)?.value ||
    title.name;

  const readableType =
    title.type === "COMIC"
      ? locale === "en"
        ? "comic"
        : locale === "pl"
        ? "komiks"
        : "комікс"
      : locale === "en"
      ? "novel"
      : locale === "pl"
      ? "powieść"
      : "роман";

  const readableChapter =
    locale === "en"
      ? `Chapter ${chapter}`
      : locale === "pl"
      ? `Rozdział ${chapter}`
      : `Розділ ${chapter}`;

  return {
    title: `${localized} — ${readableChapter} | Ink`,
    description: `Читайте ${readableType} "${localized}", ${readableChapter}. Продовжуйте історію там, де зупинились.`,
    openGraph: {
      title: `${localized} — ${readableChapter} | Ink`,
      description: `Читання ${readableType} на платформі Ink — комфортно, зручно, збереження прогресу.`,
      type: "article",
    },
  };
}

export default async function ReaderPage({ params, searchParams }: any) {
  const p = await params;
  const titleId = await p.id;
  const sp = await searchParams;
  const chapter = Number(sp?.c ?? 1);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      query: `
        query GetTitle($id: ObjectID!) {
          getTitle(id: $id) {
            chapterCount
            type
          }
        }
      `,
      variables: { id: titleId },
    }),
    cache: "no-store",
  });

  const { data } = await res.json();
  const title = data?.getTitle;
  const totalChapters = title?.chapterCount || 1;
  const type = title?.type;

  return (
    <Container>
      {type === "NOVEL" ? (
        <ChapterReader
          titleId={titleId}
          totalChapters={totalChapters}
          initialChapter={chapter}
        />
      ) : (
        <ComicReader
          titleId={titleId}
          totalChapters={totalChapters}
          initialChapter={chapter}
        />
      )}
    </Container>
  );
}
