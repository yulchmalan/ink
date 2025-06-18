"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@/types/user";
import type { FriendStatus } from "@/types/friend";
import FriendCard from "./FriendCard/FriendCard";
import styles from "./profile-friends.module.scss";
import { useAuth } from "@/contexts/AuthContext";
import Wrapper from "../../Wrapper/Wrapper";
import { useTranslations } from "next-intl";

interface Props {
  user: User;
  selfId: string;
  mode: "ACCEPTED" | "RECEIVED" | "PENDING";
}

const BATCH_SIZE = 6;

export default function ProfileFriends({ user, selfId, mode }: Props) {
  const [friends, setFriends] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { user: currentUser } = useAuth();
  const t = useTranslations("Profile");

  const fetchFriends = async (pageToFetch: number) => {
    let result: any[] = [];

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify({
        query: `
        query GetUser($id: ObjectID!) {
          user(id: $id) {
            friends {
              user {
                _id
                username
                createdAt
                last_online
              }
              status
            }
          }
        }
      `,
        variables: { id: user._id },
      }),
    });

    const json = await res.json();
    const allFriends = json.data?.user?.friends ?? [];

    if (mode === "ACCEPTED") {
      result = allFriends.filter((f: any) => f.status === "ACCEPTED");
    } else if (mode === "RECEIVED") {
      result = allFriends.filter((f: any) => f.status === "RECEIVED");
    } else if (mode === "PENDING") {
      result = allFriends.filter((f: any) => f.status === "PENDING");
    }

    setFriends(result.slice(0, (pageToFetch + 1) * BATCH_SIZE));
    if ((pageToFetch + 1) * BATCH_SIZE >= result.length) {
      setHasMore(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setFriends([]);
    setPage(0);
    setHasMore(true);
    fetchFriends(0);
  }, [mode, user._id]);

  useEffect(() => {
    if (page === 0) return;
    fetchFriends(page);
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
    <Wrapper className={styles.wrapper}>
      {friends.length === 0 && !isLoading && <p>{t("no_friends")}</p>}
      {friends.map(({ user: friendUser, status }) => (
        <FriendCard
          key={friendUser._id}
          user={friendUser}
          status={status}
          isOwner={currentUser?._id === user._id}
          mode={mode}
        />
      ))}
      {hasMore && <div ref={loaderRef} style={{ height: 40 }} />}
    </Wrapper>
  );
}
