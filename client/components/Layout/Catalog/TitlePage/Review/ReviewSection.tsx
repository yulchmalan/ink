"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./review.module.scss";
import ReviewCard from "@/components/UI/Cards/ReviewCard/ReviewCard";
import { useS3Image } from "@/hooks/useS3Image";
import fallbackCover from "@/assets/cover.png";
import { useRouter } from "next/navigation";

type Review = {
  id: string;
  name: string;
  body: string;
  rating: number;
  views: number;
  score: {
    likes: number;
    dislikes: number;
    likedBy: { _id: string }[];
    dislikedBy: { _id: string }[];
  };
  title: {
    id: string;
  };
};

type Props = {
  titleId: string;
};

export default function ReviewSection({ titleId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const router = useRouter();
  const coverUrl = useS3Image("covers", titleId, fallbackCover.src);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
            query Reviews($filter: ReviewFilter) {
              reviews(filter: $filter, sortBy: CREATED_AT, sortOrder: DESC) {
                results {
                  id
                  name
                  body
                  rating
                  views
                  score { 
                    likes, 
                    dislikes, 
                    likedBy {
                      _id
                    }, 
                    dislikedBy  {
                      _id
                    } 
                  }
                  title { id }
                }
              }
            }
          `,
          variables: { filter: { titleId } },
        }),
        cache: "no-store",
      });

      const json = await res.json();
      setReviews(json.data?.reviews?.results || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [titleId]);

  return (
    <div className={styles.reviewSection}>
      {reviews.length === 0 ? (
        <p>Рецензій поки немає.</p>
      ) : (
        reviews.map((r) => (
          <div
            key={r.id}
            onClick={() => router.push(`/review/${r.id}`)}
            style={{ cursor: "pointer" }}
          >
            <ReviewCard
              title={r.name}
              body={r.body}
              views={r.views}
              rating={r.rating / 2}
              likes={r.score?.likes.toString()}
              coverUrl={coverUrl}
            />
          </div>
        ))
      )}
    </div>
  );
}
