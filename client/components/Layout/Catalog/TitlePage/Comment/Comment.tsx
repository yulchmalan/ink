"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { enUS, uk, pl } from "date-fns/locale";
import type { Locale } from "date-fns";

import styles from "./comment.module.scss";
import { useLocale } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { useS3Image } from "@/hooks/useS3Image";

import fallbackPfp from "@/assets/pfp.svg";
import ChevronUp from "@/assets/icons/ChevronUp";
import ChevronDown from "@/assets/icons/ChevronDown";
import Dots from "@/assets/icons/Dots";
import Trash from "@/assets/icons/Trash";
import Pencil from "@/assets/icons/Pencil";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import { GET_REPLIES } from "@/graphql/queries/getReplies";
import Reply from "@/assets/icons/Reply";

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
    subject_ID: string;
    parent_ID?: string;
  };
  subjectId: string;
  onRefresh?: () => void;
}

export default function Comment({
  comment,
  onRefresh,
  subjectId,
}: CommentProps) {
  const { id: commentId, body, createdAt, score, user } = comment;
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id;
  const currentUserRole = currentUser?.role;

  const canDelete =
    currentUserId === user._id ||
    ["MODERATOR", "ADMIN", "OWNER"].includes(currentUserRole ?? "");

  const [vote, setVote] = useState<VoteState>("none");
  const [likes, setLikes] = useState(score.likes);
  const [dislikes, setDislikes] = useState(score.dislikes);
  const rating = likes - dislikes;

  const [replies, setReplies] = useState<CommentProps["comment"][]>([]);
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            query: GET_REPLIES,
            variables: { parentId: commentId },
          }),
        });

        const json = await res.json();
        const fetched = json.data?.comments?.results || [];
        setReplies(fetched);
      } catch (err) {
        console.error("Error fetching replies:", err);
      }
    };

    fetchReplies();
  }, [commentId]);

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(body);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);

  const avatar = useS3Image("avatars", user._id, fallbackPfp.src);
  const locale = useLocale();
  const localeMap: Record<string, Locale> = { uk, en: enUS, pl };
  const dateLocale = localeMap[locale] ?? enUS;

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [showMenu]);

  useEffect(() => {
    if (!currentUserId) return;
    if (score.likedBy.some((u) => u._id === currentUserId)) setVote("upvoted");
    else if (score.dislikedBy.some((u) => u._id === currentUserId))
      setVote("downvoted");
    else setVote("none");
  }, [currentUserId, score]);

  const fetchVote = async (mutation: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `mutation { ${mutation}(id: "${commentId}", userId: "${currentUserId}") { id } }`,
      }),
    });
  };

  const handleVote = async (type: VoteState) => {
    if (!currentUserId) return;

    const opposite = type === "upvoted" ? "downvoted" : "upvoted";

    if (vote === type) {
      setVote("none");
      type === "upvoted" ? setLikes((l) => l - 1) : setDislikes((d) => d - 1);
      await fetchVote("clearCommentVote");
    } else {
      setVote(type);
      if (type === "upvoted") {
        setLikes((l) => l + 1);
        if (vote === "downvoted") setDislikes((d) => d - 1);
      } else {
        setDislikes((d) => d + 1);
        if (vote === "upvoted") setLikes((l) => l - 1);
      }
      await fetchVote(type === "upvoted" ? "likeComment" : "dislikeComment");
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `mutation { deleteComment(id: "${commentId}") }`,
      }),
    });

    const json = await res.json();
    if (json.data?.deleteComment) onRefresh?.();
  };

  const handleEdit = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `mutation {
          editComment(id: "${commentId}", edits: { body: """${editedText}""" }) {
            id body
          }
        }`,
      }),
    });

    const json = await res.json();
    if (json.data?.editComment) {
      setIsEditing(false);
      onRefresh?.();
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !currentUserId) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `mutation {
          createComment(input: {
            userId: "${currentUserId}",
            subjectId: "${subjectId}",
            body: """${replyText.trim()}""",
            parentId: "${commentId}"
          }) { id }
        }`,
      }),
    });

    const json = await res.json();
    if (json.data?.createComment) {
      setReplyText("");
      setShowReplyInput(false);
      onRefresh?.();
    }
  };

  return (
    <>
      <div className={styles.comment}>
        <div className={styles.body}>
          <div className={styles.avatar}>
            <Link href={`/profile/${user._id}`}>
              <img src={avatar ?? fallbackPfp.src} alt="Avatar" />
            </Link>
          </div>

          <div className={styles.content}>
            <div className={styles.userInfo}>
              <Link href={`/profile/${user._id}`} className={styles.username}>
                {user.username}
              </Link>
              <span className={styles.date}>
                {formatDistanceToNow(new Date(createdAt), {
                  addSuffix: true,
                  locale: dateLocale,
                })}
              </span>

              {canDelete && (
                <div className={styles.menuWrapper} ref={menuRef}>
                  <button
                    className={styles.menuBtn}
                    onClick={() => setShowMenu((prev) => !prev)}
                  >
                    <Dots />
                  </button>
                  {showMenu && (
                    <div className={styles.dropdown}>
                      {currentUserId === user._id && (
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowMenu(false);
                          }}
                        >
                          <Pencil /> Редагувати
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setShowReplyInput(true);
                          setShowMenu(false);
                        }}
                      >
                        <Reply />
                        Відповісти
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

            <div className={styles.footer}>
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

            {showReplyInput && (
              <div className={styles.replyBox}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className={styles.replyInput}
                  placeholder="Ваша відповідь..."
                />
                <div className={styles.replyActions}>
                  <Button onClick={handleReply} disabled={!replyText.trim()}>
                    Надіслати
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setReplyText("");
                      setShowReplyInput(false);
                    }}
                  >
                    Скасувати
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {replies.length > 0 && (
        <div className={styles.replies}>
          {replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              subjectId={subjectId}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </>
  );
}
