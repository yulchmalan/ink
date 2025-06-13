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
import Dots from "@/assets/icons/Dots";
import Trash from "@/assets/icons/Trash";
import Pencil from "@/assets/icons/Pencil";
import CommentsSection from "../Catalog/TitlePage/Comment/CommentSection";
import { GET_COMMENTS_COUNT_BY_SUBJECT } from "@/graphql/queries/getCommentsCount";
import Link from "next/link";
import Button from "@/components/UI/Buttons/StandartButton/Button";

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
  const [views, setViews] = useState(review.views);
  const rating = likes - dislikes;

  const [showMenu, setShowMenu] = useState(false);
  const isPrivileged =
    currentUser?.role === "MODERATOR" ||
    currentUser?.role === "OWNER" ||
    currentUserId === review.user._id;
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(review.body);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  useEffect(() => {
    const incrementViews = async () => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
          mutation {
            incrementReviewViews(id: "${review.id}") {
              id
            }
          }
        `,
        }),
      });
    };

    incrementViews();
  }, [review.id]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    setShowConfirmModal(false);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `
        mutation {
          deleteReview(id: "${review.id}")
        }
      `,
      }),
    });
    location.href = `/catalog/${review.title.id}`;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dropdown = document.getElementById("review-dropdown");
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className={styles.reviewPage}>
      <div className={styles.coverWRapper}>
        <img src={coverUrl} alt={review.title.name} className={styles.cover} />
      </div>
      <div className={styles.header}>
        <div className={styles.meta}>
          {isPrivileged && (
            <div className={styles.actionsWrapper}>
              <button
                className={styles.dotsBtn}
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <Dots />
              </button>

              {showMenu && (
                <div id="review-dropdown" className={styles.dropdown}>
                  <button onClick={handleEdit}>
                    <Pencil /> Редагувати
                  </button>
                  <button onClick={() => setShowConfirmModal(true)}>
                    <Trash /> Видалити
                  </button>
                </div>
              )}
            </div>
          )}
          <h1>{review.name}</h1>
          <p className={styles.titleName}>
            Тема:{" "}
            <Link href={`/catalog/${review.title.id}`}>
              <strong>{review.title.name}</strong>
            </Link>
          </p>
          <div className={styles.info}>
            <p className={styles.author}>
              Автор{" "}
              <Link href={`/profile/${review.user._id}`}>
                <span className={styles.highlight}>{review.user.username}</span>
              </Link>
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
        {isEditing ? (
          <>
            <textarea
              className={styles.editTextarea}
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              style={{ height: "auto", overflow: "hidden" }}
              ref={(el) => {
                if (el) {
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
            />
            <div className={styles.editButtons}>
              <Button
                className={styles.saveButton}
                onClick={async () => {
                  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
                    },
                    body: JSON.stringify({
                      query: `
                mutation {
                  updateReview(id: "${review.id}", body: """${editedBody}""") {
                    id
                  }
                }
              `,
                    }),
                  });
                  setIsEditing(false);
                }}
              >
                Зберегти
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditedBody(review.body);
                }}
              >
                Скасувати
              </Button>
            </div>
          </>
        ) : (
          <p>{review.body}</p>
        )}
        {rating > 0 && <Rating readOnly={true} value={review.rating / 2} />}
        <div className={styles.footer}>
          <div className={styles.tags}>
            <Tag type="views" value={views} />
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
        <CommentsSection subjectType="REVIEW" subjectId={review.id} />
      </Wrapper>
      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Ви впевнені, що хочете видалити цю рецензію?</p>
            <div className={styles.modalActions}>
              <Button onClick={handleDelete}>Видалити</Button>
              <Button
                variant="secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Скасувати
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
