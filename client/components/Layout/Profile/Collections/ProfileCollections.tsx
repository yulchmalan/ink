"use client";

import { useEffect, useRef, useState } from "react";
import CollectionCard from "@/components/UI/Cards/CollectionCard/CollectionCard";
import { User } from "@/types/user";
import styles from "./profile-collections.module.scss";

interface Collection {
  id: string;
  name: string;
  description: string;
  views: number;
  score: { likes: number; dislikes: number };
  titles: { id: string }[];
  createdAt: string;
}

interface Props {
  user: User;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const BATCH_SIZE = 6;

export default function ProfileCollections({ user, sortBy, sortOrder }: Props) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchCollections = async (pageToFetch: number) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    const graphqlSortBy = sortBy === "rating" ? "RATING" : "CREATED_AT";

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
            query GetCollections(
              $filter: CollectionFilter,
              $limit: Int,
              $offset: Int,
              $sortBy: CollectionSortField,
              $sortOrder: SortOrder
            ) {
              collections(
                filter: $filter,
                limit: $limit,
                offset: $offset,
                sortBy: $sortBy,
                sortOrder: $sortOrder
              ) {
                total
                results {
                  id
                  name
                  description
                  views
                  createdAt
                  score {
                    likes
                    dislikes
                  }
                  titles {
                    id
                  }
                }
              }
            }
          `,
          variables: {
            filter: { userId: user._id },
            limit: BATCH_SIZE,
            sortBy: graphqlSortBy,
            sortOrder: sortOrder.toUpperCase(),
          },
        }),
      });

      const json = await res.json();
      const results: Collection[] = json.data?.collections?.results ?? [];
      const total: number = json.data?.collections?.total ?? 0;

      setCollections((prev) => {
        const all = [...prev, ...results];
        const unique = Array.from(new Map(all.map((c) => [c.id, c])).values());
        return unique;
      });

      if ((pageToFetch + 1) * BATCH_SIZE >= total) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch collections:", err);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setCollections([]);
    setPage(0);
    setHasMore(true);
    fetchCollections(0);
  }, [sortBy, sortOrder, user._id]);

  useEffect(() => {
    if (page === 0) return;
    fetchCollections(page);
  }, [page]);

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
    <div className={styles.wrapper}>
      {collections.length === 0 && !isLoading && <p>Немає колекцій</p>}
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          title={collection.name}
          views={collection.views}
          itemsCount={collection.titles.length}
          bookmarks={0}
          likes={collection.score.likes ?? 0}
          dislikes={collection.score.dislikes ?? 0}
          titleIds={collection.titles.map((t) => t.id)}
        />
      ))}
      {hasMore && <div ref={loaderRef} style={{ height: 40 }} />}
    </div>
  );
}
