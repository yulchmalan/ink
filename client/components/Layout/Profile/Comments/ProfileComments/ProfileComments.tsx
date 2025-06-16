"use client";

import { useEffect, useState } from "react";
import Comment from "../Comment";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import type { User } from "@/types/user";
import type { CommentType } from "@/types/comment";
import Link from "next/link";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import ChevronLeft from "@/assets/icons/ChevronLeft";
import ChevronRight from "@/assets/icons/ChevronRight";
import styles from "./comments.module.scss";

interface Props {
  user: User;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const BATCH_SIZE = 5;

export default function ProfileComments({ user, sortBy, sortOrder }: Props) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = async (pageToFetch: number) => {
    setIsLoading(true);

    const graphqlSortBy = sortBy;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `
          query GetUserComments(
            $userId: ObjectID!
            $limit: Int
            $offset: Int
            $sortBy: CommentSortField
            $sortOrder: SortOrder
          ) {
            comments(
              filter: { userId: $userId }
              limit: $limit
              offset: $offset
              sortBy: $sortBy
              sortOrder: $sortOrder
            ) {
              total
              results {
                id
                body
                createdAt
                subjectType
                score {
                  likes
                  dislikes
                }
                title {
                  id
                  name
                  alt_names {
                    lang
                    value
                  }
                }
                subject_ID
                user {
                  username
                }
              }
            }
          }
        `,
        variables: {
          userId: user._id,
          limit: BATCH_SIZE,
          offset: pageToFetch * BATCH_SIZE,
          sortBy: graphqlSortBy,
          sortOrder: sortOrder.toUpperCase(),
        },
      }),
    });

    const json = await res.json();
    const results: CommentType[] = json.data?.comments?.results ?? [];
    const total: number = json.data?.comments?.total ?? 0;

    setComments(results);
    setTotalPages(Math.ceil(total / BATCH_SIZE));
    setIsLoading(false);
  };

  useEffect(() => {
    setPage(0);
  }, [sortBy, sortOrder, user._id]);

  useEffect(() => {
    fetchComments(page);
  }, [page, sortBy, sortOrder, user._id]);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 0));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  return (
    <Wrapper>
      {comments.map((c) => {
        let href = "#";

        switch (c.subjectType) {
          case "TITLE":
            href = `/catalog/${c.subject_ID}`;
            break;
          case "REVIEW":
            href = `/review/${c.subject_ID}`;
            break;
          case "COLLECTION":
            href = `/collection/${c.subject_ID}`;
            break;
        }

        return (
          <Link key={c.id} href={href} scroll={false}>
            <Comment
              title={c.title}
              userId={user._id}
              username={c.user.username}
              date={new Date(c.createdAt)}
              message={c.body}
              likes={c.score?.likes ?? 0}
              dislikes={c.score?.dislikes ?? 0}
            />
          </Link>
        );
      })}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className={styles.button}
          >
            <ChevronLeft />
          </button>
          <span className={styles.pageInfo}>
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page + 1 >= totalPages}
            className={styles.button}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </Wrapper>
  );
}
