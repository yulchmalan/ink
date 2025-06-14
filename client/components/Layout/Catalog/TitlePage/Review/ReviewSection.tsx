"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./review.module.scss";
import ReviewCard from "@/components/UI/Cards/ReviewCard/ReviewCard";
import { useS3Image } from "@/hooks/useS3Image";
import fallbackCover from "@/assets/cover.png";
import { useRouter } from "next/navigation";
import { CREATE_REVIEW } from "@/graphql/mutations/createReview";
import Input from "@/components/Form/Input/Input";
import Rating from "@/components/UI/Rating/Rating";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import clsx from "clsx";

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

  const { user: currentUser } = useAuth();
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isFormActive, setIsFormActive] = useState(false);

  const handleCreate = async () => {
    if (!currentUser?._id || !name.trim() || !body.trim()) return;
    setIsSending(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: CREATE_REVIEW,
          variables: {
            input: {
              userId: currentUser._id,
              titleId,
              name: name.trim(),
              body: body.trim(),
              rating: Math.round(rating * 2),
            },
          },
        }),
      });
      setName("");
      setBody("");
      setRating(0);
      fetchReviews();
    } catch (err) {
      console.error("Error creating review:", err);
    } finally {
      setIsSending(false);
    }
  };

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
    <>
      {currentUser?._id && (
        <div className={clsx(styles.form, { [styles.active]: isFormActive })}>
          <h3 onClick={() => setIsFormActive((prev) => !prev)}>
            Залишити рецензію
          </h3>
          {isFormActive && (
            <div className={styles.formBody}>
              <Input
                label="Заголовок"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                placeholder="Текст рецензії"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={styles.textarea}
                style={{ width: "100%" }}
              />
              <Rating
                value={rating}
                onChange={(val) => setRating(val)}
                size={24}
              />
              <Button
                onClick={handleCreate}
                disabled={isSending || !name || !body}
              >
                Опублікувати
              </Button>
            </div>
          )}
        </div>
      )}
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
                id={r.id}
                title={r.name}
                body={r.body}
                views={r.views}
                rating={r.rating / 2}
                likes={`${r.score?.likes.toString()}/${r.score?.dislikes.toString()}`}
                coverUrl={coverUrl}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}
