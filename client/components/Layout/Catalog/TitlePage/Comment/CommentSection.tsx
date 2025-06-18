"use client";

import { useEffect, useState } from "react";
import Comment from "./Comment";
import Input from "@/components/Form/Input/Input";
import { GET_COMMENTS_BY_TITLE } from "@/graphql/queries/getCommentsByTitle";
import { CREATE_COMMENT } from "@/graphql/mutations/createComment";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./comment.module.scss";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import { useTranslations } from "next-intl";

type CommentType = {
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
  subjectType: "TITLE" | "REVIEW" | "COLLECTION";
  parent_ID?: string;
};

type Props = {
  subjectId: string;
  subjectType: "TITLE" | "REVIEW" | "COLLECTION";
};

export default function CommentsSection({ subjectId, subjectType }: Props) {
  const t = useTranslations("Comment");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id;

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: GET_COMMENTS_BY_TITLE,
          variables: { subjectId },
        }),
        cache: "no-store",
      });

      const json = await res.json();
      const fetched = json.data?.comments?.results || [];
      setComments(fetched);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [subjectId]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !currentUserId) return;
    setIsSending(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: CREATE_COMMENT,
          variables: {
            input: {
              userId: currentUserId,
              subjectId,
              subjectType,
              body: newComment.trim(),
            },
          },
        }),
      });

      const json = await res.json();
      const created = json.data?.createComment;
      if (created) {
        setNewComment("");
        fetchComments();

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            query: `
            mutation {
              addExpToUser(userId: "${currentUserId}", amount: 1) {
                _id
                exp
              }
            }
          `,
          }),
        }).catch((err) =>
          console.error("Не вдалося додати досвід за коментар:", err)
        );
      }
    } catch (err) {
      console.error("Error sending comment:", err);
    } finally {
      setIsSending(false);
    }
  };

  const topLevelComments = comments.filter((c) => !c.parent_ID);

  return (
    <div className={styles.commentSection}>
      {currentUserId && (
        <div className={styles.inputContainer}>
          <Input
            label={t("leave_comment")}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            onClick={handleSubmit}
            disabled={isSending || !newComment.trim()}
            className={styles.sendButton}
          >
            {t("send")}
          </Button>
        </div>
      )}

      {topLevelComments.length === 0 ? (
        <p>{t("no_comments")}</p>
      ) : (
        topLevelComments.map((comment) => (
          <Comment
            subjectType={subjectType}
            key={comment.id}
            subjectId={subjectId}
            comment={comment}
            onRefresh={fetchComments}
          />
        ))
      )}
    </div>
  );
}
