"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import styles from "./notifications.module.scss";
import Tabs from "@/components/Layout/Tabs/Tabs";
import { useLocale, useTranslations } from "next-intl";

type NotificationType = "REPLY" | "FRIEND_REQUEST" | "FRIEND_ACCEPTED";

type Notification = {
  _id: string;
  type: NotificationType;
  sender?: { _id: string; username: string };
  subjectType?: "TITLE" | "REVIEW" | "COLLECTION";
  subjectId?: string;
  subject?: { subject_ID: string; body: string };
  createdAt: string;
  read: boolean;
};

export default function NotificationContent() {
  const locale = useLocale();
  const t = useTranslations("Profile");
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

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
            {t("replied")}:{" "}
            <em>“{n.subject?.body?.slice(0, 100) || t("deleted")}...”</em>.{" "}
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
              {t("check")}
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
            {t("request")}.
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
            {t("accepted")}.
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

  if (!user) return <p>{t("login_to_check")}</p>;

  const UnreadTab = (
    <ul className={styles.list}>
      {unread.length === 0 ? (
        <p>{t("no_new")}</p>
      ) : (
        unread.map(renderNotification)
      )}
    </ul>
  );

  const ReadTab = (
    <ul className={styles.list}>
      {read.length === 0 ? <p>{t("no_read")}</p> : read.map(renderNotification)}
    </ul>
  );

  return (
    <>
      <h1>{t("notifications")}</h1>
      <Tabs
        tabs={[
          { title: t("not_read"), content: UnreadTab },
          { title: t("read"), content: ReadTab },
        ]}
      />
    </>
  );
}
