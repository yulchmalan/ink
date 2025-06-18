import CollectionSection from "@/components/Layout/Collection/CollectionSection";
import Container from "@/components/Layout/Container/Container";

export async function generateMetadata() {
  return {
    title: "Колекції | Ink",
    description:
      "Переглянь унікальні підбірки книг, романів і коміксів, створені користувачами Ink. Відкрий щось нове для читання!",
    openGraph: {
      title: "Колекції | Ink",
      description:
        "Оглянь добірки творів на платформі Ink — від особистих рекомендацій до тематичних серій.",
      type: "website",
    },
  };
}

const GET_COLLECTIONS = `
  query Collections(
    $filter: CollectionFilter
    $sortBy: CollectionSortField
    $sortOrder: SortOrder
    $offset: Int
  ) {
    collections(
      filter: $filter
      sortBy: $sortBy
      sortOrder: $sortOrder
      offset: $offset
    ) {
      results {
        id
        name
        titles { id }
        score { likes dislikes }
        views
      }
    }
  }
`;

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      query: GET_COLLECTIONS,
      variables: {
        sortBy: "CREATED_AT",
        sortOrder: "DESC",
        offset: 0,
      },
    }),
    cache: "no-store",
  });

  const json = await res.json();
  const collections = json.data?.collections?.results || [];

  return (
    <Container>
      <CollectionSection initialCollections={collections} />
    </Container>
  );
}
