import Container from "@/components/Layout/Container/Container";
import ChapterReader from "@/components/Reader/ChapterReader";
import ComicReader from "@/components/Reader/ComicReader/ComicReader";

export default async function ReaderPage({ params, searchParams }: any) {
  const titleId = params.id;
  const chapter = Number(searchParams?.c ?? 1);

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
