"use client";

import { useEffect, useRef, useState } from "react";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import type { User } from "@/types/user";
import ReviewCard from "@/components/UI/Cards/ReviewCard/ReviewCard";
import fallbackCover from "@/assets/cover.png";
import { useRouter } from "next/navigation";
import { useS3Image } from "@/hooks/useS3Image";
import styles from "./review.module.scss";

const BATCH_SIZE = 5;

interface Props {
  user: User;
  sortBy: string; // "date" | "rating"
  sortOrder: "asc" | "desc";
}

export default function ProfileReviews({ user, sortBy, sortOrder }: Props) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const graphqlSortBy = sortBy === "rating" ? "RATING" : "CREATED_AT";

  const fetchReviews = async () => {
    setIsLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `
        query GetUserReviews(
          $userId: ObjectID!
          $sortBy: ReviewSortField
          $sortOrder: SortOrder
        ) {
          reviews(
            filter: { userId: $userId }
            sortBy: $sortBy
            sortOrder: $sortOrder
          ) {
            results {
              id
              name
              body
              views
              rating
              title {
                id
              }
              score {
                likes
                dislikes
              }
            }
          }
        }
      `,
        variables: {
          userId: user._id,
          sortBy: graphqlSortBy,
          sortOrder: sortOrder.toUpperCase(),
        },
      }),
    });

    const json = await res.json();
    const results = json.data?.reviews?.results ?? [];

    setReviews(results);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [sortBy, sortOrder, user._id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    const target = loaderRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, isLoading]);
  function getS3ImageUrl(folder: string, id: string, fallback: string) {
    if (!id) return fallback;
    return `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${folder}/${id}.webp`;
  }
  return (
    <Wrapper className={styles.section}>
      {reviews.length === 0 ? (
        <p>Рецензій поки немає.</p>
      ) : (
        reviews.map((r) => {
          const coverUrl = getS3ImageUrl(
            "covers",
            r.title?.id,
            fallbackCover.src
          );
          return (
            <div
              key={r.id}
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/review/${r.id}`)}
            >
              <ReviewCard
                id={r.id}
                title={r.name}
                body={r.body}
                rating={r.rating / 2}
                likes={`${r.score?.likes.toString()}/${r.score?.dislikes.toString()}`}
                views={r.views}
                coverUrl={coverUrl}
              />
            </div>
          );
        })
      )}
      {hasMore && <div ref={loaderRef} style={{ height: 40 }} />}
    </Wrapper>
  );
}
