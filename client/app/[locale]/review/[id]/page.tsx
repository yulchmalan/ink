import { notFound } from "next/navigation";
import ReviewContent from "@/components/Layout/Review/ReviewContent";
import Container from "@/components/Layout/Container/Container";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: any) {
  const t = await getTranslations("Meta");
  const p = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      query: GET_REVIEW,
      variables: { id: p.id },
    }),
    cache: "no-store",
  });

  const json = await res.json();
  const review = json.data?.review;

  if (!review) {
    return {
      title: t("review_not_found_title"),
    };
  }

  return {
    title: t("review_title", {
      review: review.name,
      title: review.title.name,
    }),
    description: t("review_description", {
      username: review.user.username,
      title: review.title.name,
      rating: review.rating,
    }),
  };
}

const GET_REVIEW = `
  query Review($id: ObjectID!) {
    review(id: $id) {
      id
      name
      body
      rating
      views
      createdAt
      score {
        likes
        dislikes
        likedBy {
          _id
        }
        dislikedBy {
          _id
        }
      }
      user {
        _id
        username
      }
      title {
        id
        name
      }
    }
  }
`;

export default async function Page({ params }: any) {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify({
      query: GET_REVIEW,
      variables: { id: id },
    }),
    cache: "no-store",
  });

  const json = await res.json();
  const review = json.data?.review;
  if (!review) return notFound();

  return (
    <Container>
      <ReviewContent initialReview={review} />
    </Container>
  );
}
