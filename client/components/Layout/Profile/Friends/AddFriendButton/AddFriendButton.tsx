"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import Container from "@/components/Layout/Container/Container";
import styles from "./btn.module.scss";
import { useTranslations } from "next-intl";

interface Props {
  profileUserId: string;
}

export default function AddFriendButton({ profileUserId }: Props) {
  const t = useTranslations("Friends");
  const { user: currentUser } = useAuth();
  const [status, setStatus] = useState<
    "NONE" | "PENDING" | "RECEIVED" | "ACCEPTED"
  >("NONE");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFriendStatus = async () => {
      if (!currentUser || currentUser._id === profileUserId) return;

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
                  }
                  status
                }
              }
            }
          `,
          variables: { id: currentUser._id },
        }),
      });

      const json = await res.json();
      const entry = json.data?.user?.friends.find(
        (f: any) => f.user?._id === profileUserId
      );

      if (entry) {
        setStatus(entry.status);
      } else {
        setStatus("NONE");
      }
    };

    fetchFriendStatus();
  }, [currentUser, profileUserId]);

  const handleAddFriend = async () => {
    if (!currentUser) return;
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
            mutation AddFriend($userId: ObjectID!, $friendId: ObjectID!, $status: FriendStatus!) {
              addFriend(userId: $userId, friendId: $friendId, status: $status) {
                _id
              }
            }
          `,
          variables: {
            userId: currentUser._id,
            friendId: profileUserId,
            status: "PENDING",
          },
        }),
      });

      const json = await res.json();
      if (!json.errors) setStatus("PENDING");
    } catch (error) {
      console.error("Request failed:", error);
    }

    setIsLoading(false);
  };

  if (!currentUser || currentUser._id === profileUserId) return null;

  const getText = () => {
    if (status === "PENDING") return t("pending");
    if (status === "RECEIVED") return t("received");
    if (status === "ACCEPTED") return t("accepted");
    return t("add");
  };

  const getVariant = (): "primary" | "secondary" => {
    return status !== "NONE" ? "secondary" : "primary";
  };

  const isDisabled = status !== "NONE";

  return (
    <Container className={styles.container}>
      <Button
        variant={getVariant()}
        onClick={handleAddFriend}
        disabled={isDisabled || isLoading}
        className={styles.btn}
      >
        {isLoading ? t("sending") : getText()}
      </Button>
    </Container>
  );
}
