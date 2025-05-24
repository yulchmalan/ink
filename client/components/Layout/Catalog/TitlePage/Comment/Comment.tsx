"use client";

import ChevronUp from "@/assets/icons/ChevronUp";
import ChevronDown from "@/assets/icons/ChevronDown";
import styles from "./comment.module.scss";
import { formatDistanceToNow } from "date-fns";
import { enUS, uk, pl } from "date-fns/locale";
import { useS3Image } from "@/hooks/useS3Image";
import fallbackPfp from "@/assets/pfp.svg";
import { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import type { Locale } from "date-fns";
import Dots from "@/assets/icons/Dots";
import Trash from "@/assets/icons/Trash";
import Pencil from "@/assets/icons/Pencil";
import Button from "@/components/UI/Buttons/StandartButton/Button";

type VoteState = "upvoted" | "downvoted" | "none";

interface CommentProps {
  comment: {
    id: string;
    body: string;
    createdAt: string;
    score: {
      likes: number;
      dislikes: number;
      likedBy: { _id: string }[];
      dislikedBy: { _id: string }[];
    };
    user: {
      _id: string;
      username: string;
    };
  };
  onRefresh?: () => void;
}

export default function Comment({ comment, onRefresh }: CommentProps) {
  const { id: commentId, body, createdAt, score, user } = comment;

  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id;
  const [vote, setVote] = useState<VoteState>("none");
  const [localLikes, setLikes] = useState(score.likes);
  const [localDislikes, setDislikes] = useState(score.dislikes);
  const rating = localLikes - localDislikes;
  const avatar = useS3Image("avatars", user._id, fallbackPfp.src);
  const locale = useLocale();

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(body);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const localeMap: Record<string, Locale> = {
    uk,
    en: enUS,
    pl,
  };

  const dateLocale = localeMap[locale] ?? enUS;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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

  useEffect(() => {
    if (!currentUserId) return;
    if (score.likedBy.some((u) => u._id === currentUserId)) setVote("upvoted");
    else if (score.dislikedBy.some((u) => u._id === currentUserId))
      setVote("downvoted");
    else setVote("none");
  }, [currentUserId, score]);

  const handleVote = async (type: VoteState) => {
    if (!currentUserId) return;

    let newVote: VoteState = vote;

    // Якщо клік повторний — просто знімаємо голос
    if (vote === type) {
      if (type === "upvoted") setLikes((l) => l - 1);
      else setDislikes((d) => d - 1);
      setVote("none");

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            query: `
              mutation {
                clearCommentVote(id: "${commentId}", userId: "${currentUserId}") {
                  id
                }
              }
            `,
          }),
        });

        const json = await res.json();
        if (!json.data) throw new Error("Clear vote failed");
      } catch (err) {
        console.error("Clearing vote error:", err);
      }

      return;
    }

    // Якщо новий голос
    if (type === "upvoted") {
      setLikes((l) => l + 1);
      if (vote === "downvoted") setDislikes((d) => d - 1);
    } else {
      setDislikes((d) => d + 1);
      if (vote === "upvoted") setLikes((l) => l - 1);
    }

    setVote(type);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
            mutation {
              ${
                type === "upvoted"
                  ? `likeComment(id: "${commentId}", userId: "${currentUserId}")`
                  : `dislikeComment(id: "${commentId}", userId: "${currentUserId}")`
              } {
                id
              }
            }
          `,
        }),
      });

      const json = await res.json();
      if (!json.data) throw new Error("Vote failed");
    } catch (err) {
      console.error("Voting error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
          mutation {
            deleteComment(id: "${commentId}")
          }
        `,
        }),
      });

      const json = await res.json();
      if (!json.data?.deleteComment) throw new Error("Delete failed");
      onRefresh?.();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
          mutation {
            editComment(id: "${commentId}", edits: { body: """${editedText}""" }) {
              id
              body
            }
          }
        `,
        }),
      });

      const json = await res.json();
      if (!json.data?.editComment) throw new Error("Edit failed");
      setIsEditing(false);
      onRefresh?.();
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  return (
    <div className={styles.comment}>
      <div className={styles.body}>
        <div className={styles.avatar}>
          <img src={avatar ?? fallbackPfp.src} alt="Avatar" />
        </div>
        <div className={styles.content}>
          <div className={styles.userInfo}>
            <span className={styles.username}>{user.username}</span>
            <span className={styles.date}>
              {formatDistanceToNow(new Date(createdAt), {
                addSuffix: true,
                locale: dateLocale,
              })}
            </span>

            {currentUserId === user._id && (
              <div className={styles.menuWrapper}>
                <button
                  className={styles.menuBtn}
                  onClick={() => setShowMenu((prev) => !prev)}
                >
                  <Dots />
                </button>
                {showMenu && (
                  <div className={styles.dropdown}>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                    >
                      <Pencil /> Редагувати
                    </button>
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowMenu(false);
                      }}
                    >
                      <Trash /> Видалити
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className={styles.editBox}>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className={styles.editTextarea}
              />
              <div className={styles.editActions}>
                <Button
                  onClick={handleEdit}
                  disabled={!editedText.trim() || editedText === body}
                >
                  Підтвердити
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedText(body);
                  }}
                >
                  Скасувати
                </Button>
              </div>
            </div>
          ) : (
            <p className={styles.message}>{body}</p>
          )}

          {currentUserId === user._id && (
            <div className={styles.menuWrapper} ref={menuRef}>
              <button
                className={styles.menuBtn}
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <Dots />
              </button>
              {showMenu && (
                <div className={styles.dropdown}>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                  >
                    <Pencil /> Редагувати
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                  >
                    <Trash /> Видалити
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
