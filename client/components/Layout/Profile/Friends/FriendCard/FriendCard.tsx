"use client";

import styles from "./friend-card.module.scss";
import Trash from "@/assets/icons/Trash";
import Button from "@/components/UI/Buttons/StandartButton/Button";
import { useState } from "react";
import { useRandomAvatar } from "@/hooks/useRandomAvatar";
import { useAuth } from "@/contexts/AuthContext";
import Check from "@/assets/icons/Check";
import { useRouter } from "next/navigation";

interface Props {
  user: {
    _id: string;
    username: string;
    createdAt: string;
    last_online?: string;
  };
  mode: "ACCEPTED" | "RECEIVED" | "PENDING";
  status: string;
  isOwner: boolean;
}

export default function FriendCard({ user, mode, status, isOwner }: Props) {
  const [showModal, setShowModal] = useState(false);
  const fallbackAvatar = useRandomAvatar();
  const [imgSrc, setImgSrc] = useState(
    `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/avatars/${user._id}.jpg`
  );

  const isOnline =
    !!user.last_online &&
    Date.now() - new Date(user.last_online).getTime() < 2 * 60 * 1000;

  const { user: currentUser } = useAuth();

  const handleRemove = async () => {
    if (!currentUser?._id) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
            mutation RemoveFriend($userId: ObjectID!, $friendId: ObjectID!) {
              removeFriend(userId: $userId, friendId: $friendId) {
                _id
              }
            }
          `,
          variables: {
            userId: currentUser._id,
            friendId: user._id,
          },
        }),
      });

      const json = await res.json();

      if (json.errors) {
        console.error("GraphQL errors:", json.errors);
        return;
      }

      setShowModal(false);
      window.location.reload();
    } catch (err) {
      console.error("Failed to remove friend:", err);
    }
  };

  const handleAccept = async () => {
    if (!currentUser?._id) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
            mutation UpdateFriendStatus($userId: ObjectID!, $friendId: ObjectID!, $newStatus: FriendStatus!) {
              updateFriendStatus(userId: $userId, friendId: $friendId, newStatus: $newStatus) {
                _id
              }
            }
          `,
          variables: {
            userId: currentUser._id,
            friendId: user._id,
            newStatus: "ACCEPTED",
          },
        }),
      });

      const json = await res.json();

      if (json.errors) {
        console.error("GraphQL errors:", json.errors);
        return;
      }

      window.location.reload();
    } catch (err) {
      console.error("Failed to accept friend:", err);
    }
  };

  const router = useRouter();

  const handleGoToProfile = () => {
    router.push(`/profile/${user._id}`);
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar} onClick={handleGoToProfile}>
            <img
              src={imgSrc}
              alt="Аватар"
              onError={() => setImgSrc(fallbackAvatar.src)}
            />
          </div>
          <span
            className={`${styles.statusDot} ${
              isOnline ? styles.online : styles.offline
            }`}
            title={isOnline ? "Online" : "Offline"}
          />
        </div>

        <div className={styles.info}>
          <div className={styles.name} onClick={handleGoToProfile}>
            {user.username ?? "Користувач"}
          </div>
        </div>

        {isOwner && (
          <>
            {status === "RECEIVED" && mode === "RECEIVED" ? (
              <>
                <button
                  className={styles.acceptBtn}
                  onClick={handleAccept}
                  title="Прийняти"
                >
                  <Check />
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => setShowModal(true)}
                  title="Відхилити"
                >
                  <Trash />
                </button>
              </>
            ) : (
              <button
                className={styles.deleteBtn}
                onClick={() => setShowModal(true)}
                title="Видалити"
              >
                <Trash />
              </button>
            )}
          </>
        )}
      </div>

      {/* Модалка підтвердження */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>Ви впевнені, що хочете видалити цього користувача з друзів?</p>
            <div className={styles.modalActions}>
              <Button onClick={handleRemove}>Так</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Скасувати
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
