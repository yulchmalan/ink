import { notFound } from "next/navigation";
import ReviewContent from "@/components/Layout/Review/ReviewContent";
import Container from "@/components/Layout/Container/Container";

export async function generateMetadata({ params }: any) {
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

  if (!review) return { title: "Рецензія не знайдена | Ink" };

  return {
    title: `${review.name} | Рецензія на ${review.title.name} | Ink`,
    description: `Огляд користувача ${review.user.username} на твір "${review.title.name}". Оцінка: ${review.rating}/10. Прочитайте думки та залиште свою!`,
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
