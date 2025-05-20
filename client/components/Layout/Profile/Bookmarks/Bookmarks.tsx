"use client";

import React from "react";
import type { User } from "@/types/user";
import TitleCard from "./TitleCard/TitleCard";
import styles from "./bookmarks.module.scss";
import clsx from "clsx";
import Wrapper from "../../Wrapper/Wrapper";
import { useS3Image } from "@/hooks/useS3Image";
import { useLocale } from "next-intl";
import fallbackCover from "@/assets/cover.png";

interface Props {
  user: User;
  style?: "grid" | "row";
}

function getLocalizedName(
  name: string,
  altNames: { lang: string; value: string }[] = [],
  locale: string
) {
  return (
    altNames.find((n) => n.lang === locale)?.value ||
    altNames.find((n) => n.lang === "uk")?.value ||
    altNames.find((n) => n.lang === "en")?.value ||
    name
  );
}

export default function BookMarks({ user, style = "grid" }: Props) {
  const lists = user.lists ?? [];
  const locale = useLocale();

  const allTitles = lists.flatMap((list) => list.titles ?? []);

  if (allTitles.length === 0) {
    return <p>Немає збережених творів.</p>;
  }

  const content = (
    <ul className={clsx(styles.ul, styles[style])}>
      {allTitles.map((savedTitle, idx) => {
        const title = savedTitle?.title;

        if (!title || typeof title !== "object" || !("name" in title)) {
          return <li key={idx}>Некоректний тайтл</li>;
        }

        const localizedName = getLocalizedName(
          title.name,
          title.alt_names,
          locale
        );

        const coverUrl = useS3Image("covers", title.id, fallbackCover.src);
        const isNovel = title.type === "NOVEL";

        const chapterCount = isNovel ? 100 : title.content?.chapter ?? 0;
        const chapter = isNovel
          ? Math.min(savedTitle.progress ?? 0, 100)
          : savedTitle.progress ?? 0;

        return (
          <li key={idx}>
            <TitleCard
              title={{
                name: localizedName,
                cover: coverUrl,
                chapter,
                chapterCount,
                last_open: savedTitle.last_open,
                type: title.type,
              }}
              type={style}
            />
          </li>
        );
      })}
    </ul>
  );

  return style === "row" ? <Wrapper>{content}</Wrapper> : content;
}
