"use client";

import styles from "./comment.module.scss";
import { formatDistanceToNow } from "date-fns";
import { uk, enUS, pl } from "date-fns/locale";
import { useS3Image } from "@/hooks/useS3Image";
import fallbackPfp from "@/assets/pfp.svg";
import { useState } from "react";
import clsx from "clsx";
import { useLocale } from "next-intl";
import type { Locale } from "date-fns";

interface CommentProps {
  username: string;
  userId: string;
  date: Date;
  message: string;
  likes: number;
  dislikes: number;
  title?: {
    id: string;
    name: string;
    alt_names?: { lang: string; value: string }[];
  };
}

const getLocalizedName = (
  name: string,
  altNames: { lang: string; value: string }[] = [],
  locale: string
) => {
  if (!Array.isArray(altNames)) return name;

  return (
    altNames.find((n) => n?.lang === locale)?.value ||
    altNames.find((n) => n?.lang === "uk")?.value ||
    altNames.find((n) => n?.lang === "en")?.value ||
    name
  );
};

export default function Comment({
  username,
  userId,
  date,
  message,
  likes,
  dislikes,
  title,
}: CommentProps) {
  const [reported, setReported] = useState(false);
  const rating = likes - dislikes;
  const avatar = useS3Image("avatars", userId, fallbackPfp.src);
  const locale = useLocale();

  const localeMap: Record<string, Locale> = {
    uk,
    en: enUS,
    pl,
  };

  const localizedTitle =
    title && getLocalizedName(title.name, title.alt_names, locale);

  return (
    <div className={styles.comment}>
      <div className={styles.body}>
        <div className={styles.avatar}>
          <img src={avatar ?? fallbackPfp.src} alt="Avatar" />
        </div>
        <div className={styles.content}>
          <div className={styles.userInfo}>
            <span className={styles.username}>{username}</span>
            <span className={styles.date}>
              {formatDistanceToNow(date, {
                addSuffix: true,
                locale: localeMap[locale] ?? uk,
              })}
            </span>
          </div>
          <p className={styles.message}>{message}</p>

          <div className={styles.footer}>
            <span
              className={clsx(styles.rating, {
                [styles.positive]: rating >= 0,
                [styles.negative]: rating < 0,
              })}
            >
              {rating}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
