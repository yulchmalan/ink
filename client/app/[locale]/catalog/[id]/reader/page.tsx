import ChapterReader from "@/components/Reader/ChapterReader";

export default async function ReaderPage({ params }: any) {
  const { id: titleId } = params;

  // тимчасово захардкожено, але можеш фетчити з GraphQL або генерувати при парсингу
  const totalChapters = 13;

  return <ChapterReader titleId={titleId} totalChapters={totalChapters} />;
}
