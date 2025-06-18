import CreateCollectionContent from "./CreateCollectionContent";

export function generateMetadata() {
  return {
    title: "Створити колекцію | Ink",
    description:
      "Створи власну добірку улюблених тайтлів — книжок, коміксів чи романів на платформі Ink.",
    openGraph: {
      title: "Створити колекцію | Ink",
      description:
        "Складай колекції, ділись з іншими й відкривай нові твори разом з Ink.",
      type: "website",
    },
  };
}

export default function Page() {
  return <CreateCollectionContent />;
}
