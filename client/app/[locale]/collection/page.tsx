import CollectionSection from "@/components/Layout/Collection/CollectionSection";
import Container from "@/components/Layout/Container/Container";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Catalog");

  return {
    title: t("collections_title"),
    description: t("collections_desc"),
    openGraph: {
      title: t("collections_title"),
      description: t("collections_opengraph"),
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
    $limit: Int
  ) {
    collections(
      filter: $filter
      sortBy: $sortBy
      sortOrder: $sortOrder
      offset: $offset
      $limit: Int
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
        limit: 100,
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
