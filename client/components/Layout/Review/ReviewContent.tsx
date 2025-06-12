"use client";

import { useS3Image } from "@/hooks/useS3Image";
import { useAuth } from "@/contexts/AuthContext";
import fallbackCover from "@/assets/cover.png";
import styles from "./review.module.scss";
import Rating from "@/components/UI/Rating/Rating";
import Tag from "@/components/UI/Tag/Tag";
import ChevronUp from "@/assets/icons/ChevronUp";
import ChevronDown from "@/assets/icons/ChevronDown";
import Wrapper from "../Wrapper/Wrapper";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { enUS, uk, pl } from "date-fns/locale";
import clsx from "clsx";
import CommentsSection from "../Catalog/TitlePage/Comment/CommentSection";
import { GET_COMMENTS_COUNT_BY_SUBJECT } from "@/graphql/queries/getCommentsCount";

type VoteState = "upvoted" | "downvoted" | "none";

type Review = {
  id: string;
  name: string;
  body: string;
  rating: number;
  views: number;
  createdAt: string;
  score: {
    likes: number;
    dislikes: number;
    likedBy: { _id: string }[];
    dislikedBy: { _id: string }[];
  };
  user: { username: string; _id: string };
  title: { id: string; name: string };
};

export default function ReviewContent({ review }: { review: Review }) {
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id;
  const locale = useLocale();
  const coverUrl = useS3Image("covers", review.title.id, fallbackCover.src);
  const dateLocale = { uk, en: enUS, pl }[locale as "uk" | "en" | "pl"] ?? enUS;

  const [vote, setVote] = useState<VoteState>("none");
  const [likes, setLikes] = useState(review.score.likes);
  const [dislikes, setDislikes] = useState(review.score.dislikes);
  const rating = likes - dislikes;

  useEffect(() => {
    if (!currentUserId) return;
    if (review.score.likedBy.some((u) => u._id === currentUserId)) {
      setVote("upvoted");
    } else if (review.score.dislikedBy.some((u) => u._id === currentUserId)) {
      setVote("downvoted");
    } else {
      setVote("none");
    }
  }, [currentUserId, review]);

  const fetchVote = async (mutation: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `mutation {
          ${mutation}(id: "${review.id}", userId: "${currentUserId}") {
            id
          }
        }`,
      }),
    });
  };

  const handleVote = async (type: VoteState) => {
    if (!currentUserId) return;

    if (vote === type) {
      setVote("none");
      type === "upvoted"
        ? setLikes((prev) => prev - 1)
        : setDislikes((prev) => prev - 1);
      await fetchVote("clearReviewVote");
    } else {
      setVote(type);
      if (type === "upvoted") {
        setLikes((prev) => prev + 1);
        if (vote === "downvoted") setDislikes((prev) => prev - 1);
      } else {
        setDislikes((prev) => prev + 1);
        if (vote === "upvoted") setLikes((prev) => prev - 1);
      }
      await fetchVote(type === "upvoted" ? "likeReview" : "dislikeReview");
    }
  };

  const [commentsCount, setCommentsCount] = useState<number>(0);

  useEffect(() => {
    const fetchCommentsCount = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: GET_COMMENTS_COUNT_BY_SUBJECT,
          variables: { subjectId: review.id },
        }),
      });

      const json = await res.json();
      setCommentsCount(json.data?.comments?.total || 0);
    };

    fetchCommentsCount();
  }, [review.id]);

  return (
    <div className={styles.reviewPage}>
      <div className={styles.header}>
        <div className={styles.coverWRapper}>
          <img
            src={coverUrl}
            alt={review.title.name}
            className={styles.cover}
          />
        </div>
        <div className={styles.meta}>
          <h1>{review.name}</h1>
          <p className={styles.titleName}>
            Тема: <strong>{review.title.name}</strong>
          </p>
          <div className={styles.info}>
            <p className={styles.author}>
              Автор{" "}
              <span className={styles.highlight}>{review.user.username}</span>
            </p>
            <p className={styles.date}>
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
                locale: dateLocale,
              })}
            </p>
          </div>
        </div>
      </div>

      <Wrapper className={styles.body}>
        <p style={{ whiteSpace: "pre-line" }}>{review.body}</p>
        <Rating readOnly value={review.rating / 2} />
        <div className={styles.footer}>
          <div className={styles.tags}>
            <Tag type="views" value={review.views} />
            <Tag type="likes" value={rating} />
            <Tag type="comments" value={commentsCount} />
          </div>
          <div className={styles.rate}>
            <button
              className={clsx(
                styles.voteBtn,
                styles.up,
                vote === "upvoted" && styles.active
              )}
              onClick={() => handleVote("upvoted")}
            >
              <ChevronUp />
            </button>
            <span
              className={clsx(
                styles.rating,
                rating > 0 && styles.positive,
                rating < 0 && styles.negative
              )}
            >
              {rating}
            </span>
            <button
              className={clsx(
                styles.voteBtn,
                styles.down,
                vote === "downvoted" && styles.active
              )}
              onClick={() => handleVote("downvoted")}
            >
              <ChevronDown />
            </button>
          </div>
        </div>
      </Wrapper>

      <Wrapper className={styles.commentSection}>
        <CommentsSection subjectId={review.id} />
      </Wrapper>
    </div>
  );
}
