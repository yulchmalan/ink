"use client";

import { useEffect, useState } from "react";
import Comment from "./Comment";
import Input from "@/components/Form/Input/Input";
import { GET_COMMENTS_BY_TITLE } from "@/graphql/queries/getCommentsByTitle";
import { CREATE_COMMENT } from "@/graphql/mutations/createComment";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./comment.module.scss";
import Button from "@/components/UI/Buttons/StandartButton/Button";

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
  parent_ID?: string;
};

type Props = {
  titleId: string;
};

export default function CommentsSection({ titleId }: Props) {
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
          variables: { subjectId: titleId },
        }),
        cache: "no-store",
      });

      const json = await res.json();
      const fetched = json.data?.comments?.results || [];
      const topLevel = fetched.filter((c: any) => !c.parent_ID);
      setComments(topLevel);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [titleId]);

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
              subjectId: titleId,
              body: newComment.trim(),
            },
          },
        }),
      });

      const json = await res.json();
      const created = json.data?.createComment;
      if (created) {
        fetchComments();
        setNewComment("");
      }
    } catch (err) {
      console.error("Error sending comment:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.commentSection}>
      {currentUserId && (
        <div className={styles.inputContainer}>
          <Input
            label="Залишити коментар"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            onClick={handleSubmit}
            disabled={isSending || !newComment.trim()}
            className={styles.sendButton}
          >
            Надіслати
          </Button>
        </div>
      )}

      {comments.length === 0 ? (
        <p>Немає коментарів</p>
      ) : (
        comments.map((comment) => (
          <Comment
            key={comment.id}
            subjectId={titleId}
            comment={comment}
            onRefresh={fetchComments}
          />
        ))
      )}
    </div>
  );
}
