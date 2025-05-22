"use client";

import { useEffect, useRef, useState } from "react";
import Comment from "../Comment";
import Wrapper from "@/components/Layout/Wrapper/Wrapper";
import type { User } from "@/types/user";
import type { CommentType } from "@/types/comment";

interface Props {
  user: User;
  sortBy: string; // "date" | "rating"
  sortOrder: "asc" | "desc";
}

const BATCH_SIZE = 5;

export default function ProfileComments({ user, sortBy, sortOrder }: Props) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchComments = async (pageToFetch: number) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    const graphqlSortBy = sortBy === "rating" ? "RATING" : "CREATED_AT";

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

    setComments((prev) => {
      const merged = [...prev, ...results];
      const unique = Array.from(new Map(merged.map((c) => [c.id, c])).values());
      return unique;
    });

    if ((pageToFetch + 1) * BATCH_SIZE >= total) {
      setHasMore(false);
    }

    setIsLoading(false);
  };

  // Reset при зміні сортування
  useEffect(() => {
    setComments([]);
    setPage(0);
    setHasMore(true);
    fetchComments(0); // фетч першої сторінки
  }, [sortBy, sortOrder, user._id]);

  // Фетч наступних сторінок
  useEffect(() => {
    if (page === 0) return;
    fetchComments(page);
  }, [page]);

  // Інфініті-скрол
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

  return (
    <Wrapper>
      {comments.map((c) => (
        <Comment
          key={c.id}
          title={c.title}
          userId={user._id}
          username={c.user.username}
          date={new Date(c.createdAt)}
          message={c.body}
          likes={c.score?.likes ?? 0}
          dislikes={c.score?.dislikes ?? 0}
        />
      ))}
      {hasMore && <div ref={loaderRef} style={{ height: 40 }} />}
    </Wrapper>
  );
}
