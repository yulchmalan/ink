import ComicReaderContent from "./ComicReaderContent";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }: any) {
  const p = await params;
  const sp = await searchParams;
  const titleId = p.id;
  const locale = p.locale;
  const chapter = Number(sp?.chapter ?? 1);

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
  if (!title) return { title: "Читання коміксу | Ink" };

  const localized =
    title.alt_names?.find((alt: any) => alt.lang === locale)?.value ||
    title.name;

  return {
    title: `${localized} — Розділ ${chapter} | Ink`,
    description: `Читайте комікс "${localized}", розділ ${chapter}. Візуальна історія оживає на платформі Ink.`,
    openGraph: {
      title: `${localized} — Розділ ${chapter} | Ink`,
      description: `Ink — зручна читалка коміксів з прогресом, збереженням і персоналізацією.`,
      type: "article",
    },
  };
}

export default function ComicReaderPageWrapper() {
  return <ComicReaderContent />;
}
