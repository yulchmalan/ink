"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./notifications.module.scss";
import { useLocale } from "next-intl";
import Tabs from "@/components/Layout/Tabs/Tabs";
import Container from "@/components/Layout/Container/Container";

type NotificationType = "REPLY" | "FRIEND_REQUEST" | "FRIEND_ACCEPTED";

type Notification = {
  _id: string;
  type: "REPLY" | "FRIEND_REQUEST" | "FRIEND_ACCEPTED";
  sender?: { _id: string; username: string };
  subjectType?: "TITLE" | "REVIEW" | "COLLECTION";
  subjectId?: string;
  subject?: { subject_ID: string; body: string };
  createdAt: string;
  read: boolean;
};

export default function NotificationsPage() {
  const locale = useLocale();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  const UnreadTab = (
    <ul className={styles.list}>
      {unread.length === 0 ? (
        <p>Немає нових сповіщень.</p>
      ) : (
        unread.map(renderNotification)
      )}
    </ul>
  );

  const ReadTab = (
    <ul className={styles.list}>
      {read.length === 0 ? (
        <p>Немає прочитаних.</p>
      ) : (
        read.map(renderNotification)
      )}
    </ul>
  );

  function renderNotification(n: Notification) {
    return (
      <li key={n._id} className={n.read ? styles.read : styles.unread}>
        {n.type === "REPLY" && n.sender && (
          <span>
            <button
              onClick={() => markAsRead(n._id, `/profile/${n.sender?._id}`)}
              className={styles.linkBtn}
            >
              {n.sender.username}
            </button>{" "}
            відповів(-ла) на ваш коментар:{" "}
            <em>
              “{n.subject?.body?.slice(0, 100) || "коментар видалено"}...”
            </em>
            .{" "}
            <button
              className={styles.viewBtn}
              onClick={() =>
                markAsRead(
                  n._id,
                  n.subjectType === "TITLE"
                    ? `/catalog/${n.subject?.subject_ID}`
                    : n.subjectType === "REVIEW"
                    ? `/review/${n.subject?.subject_ID}`
                    : `/collection/${n.subject?.subject_ID}`
                )
              }
            >
              Переглянути
            </button>
          </span>
        )}
        {n.type === "FRIEND_REQUEST" && n.sender && (
          <span>
            <button
              onClick={() => markAsRead(n._id, `/profile/${n.sender?._id}`)}
              className={styles.linkBtn}
            >
              {n.sender.username}
            </button>{" "}
            надіслав(-ла) вам запит у друзі.
          </span>
        )}
        {n.type === "FRIEND_ACCEPTED" && n.sender && (
          <span>
            <button
              onClick={() => markAsRead(n._id, `/profile/${n.sender?._id}`)}
              className={styles.linkBtn}
            >
              {n.sender.username}
            </button>{" "}
            прийняв(-ла) ваш запит у друзі.
          </span>
        )}
        <span className={styles.time}>
          {new Date(n.createdAt).toLocaleString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </li>
    );
  }

  useEffect(() => {
    if (!user?._id) return;

    const fetchNotifications = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
           query ($userId: ObjectID!) {
                notifications(userId: $userId) {
                    _id
                    type
                    subjectId
                    subjectType
                    read
                    createdAt
                    sender {
                        _id
                        username
                    }
                    subject {
                        id
                        body
                        subjectType
                        subject_ID
                        title {
                            id
                            name
                            alt_names {
                                lang
                                value
                            }
                        }
                    }
                }
            }
            `,
          variables: { userId: user._id },
        }),
      });

      const json = await res.json();
      setNotifications(json.data?.notifications || []);
    };

    fetchNotifications();
  }, [user]);

  async function markAsRead(notificationId: string, redirectUrl: string) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify({
          query: `
          mutation($id: ObjectID!) {
            markNotificationRead(id: $id)
          }
        `,
          variables: { id: notificationId },
        }),
      });

      window.location.href = redirectUrl;
    } catch (err) {
      console.error("Не вдалося позначити сповіщення як прочитане", err);
      window.location.href = redirectUrl;
    }
  }

  if (!user) return <p>Будь ласка, увійдіть, щоб переглядати сповіщення.</p>;

  return (
    <Container className={styles.notificationsPage}>
      <h1>Сповіщення</h1>
      <Tabs
        tabs={[
          { title: "Непрочитані", content: UnreadTab },
          { title: "Прочитані", content: ReadTab },
        ]}
      />
    </Container>
  );
}
