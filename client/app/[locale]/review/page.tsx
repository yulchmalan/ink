import Container from "@/components/Layout/Container/Container";
import ReviewSection from "@/components/Layout/Review/ReviewSection";

export const metadata = {
  title: "Усі рецензії | Ink",
  description:
    "Читайте найновіші рецензії на книги, комікси та графічні романи на платформі Ink. Думки читачів, оцінки та обговорення творів.",
};

const GET_REVIEWS = `
  query Reviews(
    $filter: ReviewFilter
    $sortBy: ReviewSortField
    $sortOrder: SortOrder
    $offset: Int
    $limit: Int
  ) {
    reviews(
      filter: $filter
      sortBy: $sortBy
      sortOrder: $sortOrder
      offset: $offset
      $limit: Int
    ) {
      results {
        id
        name
        body
        rating
        views
        score { likes dislikes }
        title { id name }
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
      query: GET_REVIEWS,
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
  const reviews = json.data?.reviews?.results || [];

  return (
    <Container>
      <ReviewSection initialReviews={reviews} />
    </Container>
  );
}
